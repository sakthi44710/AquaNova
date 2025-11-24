import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/apiAuth';
import TOPOLOGY from 'vanta/dist/vanta.topology.min';
import p5 from 'p5';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const vantaRef = useRef(null);
    const vantaEffect = useRef(null);

    useEffect(() => {
        if (!vantaEffect.current) {
            vantaEffect.current = TOPOLOGY({
                el: vantaRef.current,
                p5: p5,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0xc2a0c2,
                backgroundColor: 0x0a0a1a
            });
        }
        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authAPI.sendOTP({
                email: formData.email,
                name: formData.name
            });

            setStep(2);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please check email configuration.');
        }

        setLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authAPI.verifyOTP({
                email: formData.email,
                otp: formData.otp
            });

            setStep(3);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        }

        setLoading(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await authAPI.signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                otp: formData.otp
            });

            // Redirect to login
            navigate('/login', {
                state: { message: 'Account created successfully! Please login.' }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }

        setLoading(false);
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return { strength: 0, label: '' };
        if (password.length < 6) return { strength: 1, label: 'Weak' };
        if (password.length < 10) return { strength: 2, label: 'Medium' };
        return { strength: 3, label: 'Strong' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="auth-container" ref={vantaRef}>
            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="logo">
                            <span className="logo-icon">🌊</span>
                            <h1>AquaNova</h1>
                        </div>
                        <p className="subtitle">Marine Data Intelligence Platform</p>
                    </div>

                    {/* Step Indicator */}
                    <div className="step-indicator">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <div className="step-label">Email</div>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <div className="step-label">Verify</div>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <div className="step-label">Password</div>
                        </div>
                    </div>

                    {/* Step 1: Email & Name */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="auth-form">
                            <h2>Create Account</h2>
                            <p className="form-subtitle">Enter your details to get started</p>

                            {error && (
                                <div className="error-message">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    autoComplete="name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Sending OTP...
                                    </>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </button>

                            <div className="auth-footer">
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/login" className="auth-link">
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="auth-form">
                            <h2>Verify Your Email</h2>
                            <p className="form-subtitle">
                                We've sent a 6-digit code to <strong>{formData.email}</strong>
                            </p>

                            {error && (
                                <div className="error-message">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="otp">Verification Code</label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit code"
                                    maxLength="6"
                                    required
                                    autoComplete="off"
                                    className="otp-input"
                                />
                                <small className="form-hint">Check your email inbox for the code</small>
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading || formData.otp.length !== 6}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Code'
                                )}
                            </button>

                            <div className="auth-footer">
                                <p>
                                    Didn't receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="auth-link"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Resend
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Password */}
                    {step === 3 && (
                        <form onSubmit={handleSignup} className="auth-form">
                            <h2>Set Your Password</h2>
                            <p className="form-subtitle">Create a strong password for your account</p>

                            {error && (
                                <div className="error-message">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    required
                                    autoComplete="new-password"
                                />
                                {formData.password && (
                                    <div className="password-strength">
                                        <div className="strength-bars">
                                            <div className={`bar ${passwordStrength.strength >= 1 ? 'active' : ''}`}></div>
                                            <div className={`bar ${passwordStrength.strength >= 2 ? 'active' : ''}`}></div>
                                            <div className={`bar ${passwordStrength.strength >= 3 ? 'active' : ''}`}></div>
                                        </div>
                                        <span className="strength-label">{passwordStrength.label}</span>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div className="auth-info">
                    <h3>Why Join AquaNova?</h3>
                    <ul>
                        <li>
                            <span className="info-icon">🌊</span>
                            <div>
                                <strong>Real-Time Ocean Data</strong>
                                <p>Access live temperature, currents, and more</p>
                            </div>
                        </li>
                        <li>
                            <span className="info-icon">💬</span>
                            <div>
                                <strong>AI Chat History</strong>
                                <p>Save and review your conversations</p>
                            </div>
                        </li>
                        <li>
                            <span className="info-icon">📈</span>
                            <div>
                                <strong>Advanced Analytics</strong>
                                <p>Visualize trends and patterns</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Signup;
