const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const { generateOTP, sendOTPEmail } = require('../services/emailService');

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email for verification
// @access  Public
router.post(
    '/send-otp',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('name').trim().notEmpty().withMessage('Name is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, name } = req.body;

        try {
            // Check if user already exists
            const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'User already exists with this email' });
            }

            // Generate OTP
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Delete any existing OTPs for this email
            await db.query('DELETE FROM otp_verifications WHERE email = ?', [email]);

            // Store OTP in database
            await db.query(
                'INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)',
                [email, otp, expiresAt]
            );

            // Send OTP email
            const emailResult = await sendOTPEmail(email, otp, name);

            if (!emailResult.success) {
                console.error('Email send failed:', emailResult.error);
                return res.status(500).json({ message: 'Failed to send OTP email. Please check email configuration.' });
            }

            res.json({ message: 'OTP sent successfully to your email' });
        } catch (error) {
            console.error('Send OTP error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post(
    '/verify-otp',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;

        try {
            // Get OTP from database
            const [otpRecords] = await db.query(
                'SELECT * FROM otp_verifications WHERE email = ? AND otp = ? AND verified = FALSE ORDER BY created_at DESC LIMIT 1',
                [email, otp]
            );

            if (otpRecords.length === 0) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            const otpRecord = otpRecords[0];

            // Check if OTP is expired
            if (new Date() > new Date(otpRecord.expires_at)) {
                return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
            }

            // Mark OTP as verified
            await db.query(
                'UPDATE otp_verifications SET verified = TRUE WHERE id = ?',
                [otpRecord.id]
            );

            res.json({ message: 'Email verified successfully' });
        } catch (error) {
            console.error('Verify OTP error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   POST /api/auth/signup
// @desc    Register new user (after OTP verification)
// @access  Public
router.post(
    '/signup',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, otp } = req.body;

        try {
            // Verify OTP is verified
            const [otpRecords] = await db.query(
                'SELECT * FROM otp_verifications WHERE email = ? AND otp = ? AND verified = TRUE ORDER BY created_at DESC LIMIT 1',
                [email, otp]
            );

            if (otpRecords.length === 0) {
                return res.status(400).json({ message: 'Please verify your email with OTP first' });
            }

            // Check if user already exists
            const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert user
            const [result] = await db.query(
                'INSERT INTO users (name, email, password, email_verified) VALUES (?, ?, ?, TRUE)',
                [name, email, hashedPassword]
            );

            // Delete used OTP
            await db.query('DELETE FROM otp_verifications WHERE email = ?', [email]);

            res.status(201).json({
                message: 'Account created successfully. Please login.',
                user: {
                    id: result.insertId,
                    name,
                    email
                }
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if user exists
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (users.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const user = users[0];

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Update last login
            await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

            // Create JWT token
            const payload = {
                userId: user.id,
                email: user.email
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, created_at, last_login FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post(
    '/forgot-password',
    [
        body('email').isEmail().withMessage('Please enter a valid email')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            // Check if user exists
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (users.length === 0) {
                return res.status(404).json({ message: 'No account found with this email' });
            }

            const user = users[0];

            // Generate OTP
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Delete any existing OTPs for this email
            await db.query('DELETE FROM otp_verifications WHERE email = ?', [email]);

            // Store OTP in database
            await db.query(
                'INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)',
                [email, otp, expiresAt]
            );

            // Send OTP email
            const emailResult = await sendOTPEmail(email, otp, user.name, 'Password Reset');

            if (!emailResult.success) {
                console.error('Email send failed:', emailResult.error);
                return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
            }

            res.json({ message: 'OTP sent successfully to your email' });
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post(
    '/reset-password',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
        body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp, newPassword } = req.body;

        try {
            // Verify OTP
            const [otpRecords] = await db.query(
                'SELECT * FROM otp_verifications WHERE email = ? AND otp = ? ORDER BY created_at DESC LIMIT 1',
                [email, otp]
            );

            if (otpRecords.length === 0) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            const otpRecord = otpRecords[0];

            // Check if OTP is expired
            if (new Date() > new Date(otpRecord.expires_at)) {
                return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
            }

            // Check if user exists
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

            // Delete used OTP
            await db.query('DELETE FROM otp_verifications WHERE email = ?', [email]);

            res.json({ message: 'Password reset successfully. Please login with your new password.' });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;
