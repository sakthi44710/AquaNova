require('dotenv').config();
const emailService = require('./services/emailService');

async function test() {
    console.log('Testing email...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);

    const otp = emailService.generateOTP();
    console.log('OTP:', otp);

    const result = await emailService.sendOTPEmail(process.env.EMAIL_USER, otp, 'Test User');
    console.log('Result:', result);
}

test();
