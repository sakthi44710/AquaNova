const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, name, purpose = 'Email Verification') => {
  const getEmailContent = () => {
    if (purpose === 'Password Reset') {
      return {
        subject: 'AquaNova - Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #8B5CF6;">Password Reset Request</h1>
            <p>Hello <strong>${name}</strong>!</p>
            <p>We received a request to reset your password. Use the OTP below to proceed:</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h2 style="color: #8B5CF6; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h2>
            </div>
            <p><strong>This OTP is valid for 10 minutes.</strong></p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">This is an automated email from AquaNova. Please do not reply.</p>
          </div>
        `
      };
    } else {
      return {
        subject: 'AquaNova - Email Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #8B5CF6;">Welcome to AquaNova!</h1>
            <p>Hello <strong>${name}</strong>!</p>
            <p>Thank you for signing up. Please verify your email address using the OTP below:</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h2 style="color: #8B5CF6; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h2>
            </div>
            <p><strong>This OTP is valid for 10 minutes.</strong></p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">This is an automated email from AquaNova. Please do not reply.</p>
          </div>
        `
      };
    }
  };

  const emailContent = getEmailContent();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: emailContent.subject,
    html: emailContent.html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { generateOTP, sendOTPEmail };
