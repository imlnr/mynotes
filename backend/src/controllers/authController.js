const User = require('../models/User');
const Otp = require('../models/Otp');
const sendEmail = require('../services/email');
const jwt = require('jsonwebtoken');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretdevelopmentsignature', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    });
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: 'fail', message: 'Please provide an email.' });
        }

        const otp = generateOTP();

        await Otp.deleteMany({ email: email.toLowerCase() });

        await Otp.create({
            email: email.toLowerCase(),
            otp,
        });

        const message = `Your login OTP is ${otp}. It will expire in 5 minutes.`;
        const htmlMessage = `<p>Your login OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`;

        await sendEmail({
            email,
            subject: 'Your Notables Login OTP',
            message,
            html: htmlMessage
        });

        res.status(200).json({
            status: 'success',
            message: 'OTP sent to email!',
        });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send OTP.' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and OTP.' });
        }

        const record = await Otp.findOne({ email: email.toLowerCase() });
        if (!record) {
            return res.status(400).json({ status: 'fail', message: 'OTP expired or not found.' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ status: 'fail', message: 'Invalid OTP.' });
        }

        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            user = await User.create({
                email: email.toLowerCase(),
                authProvider: 'email',
            });
        }

        await Otp.deleteOne({ _id: record._id });

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            }
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to verify OTP.' });
    }
};

exports.googleAuth = async (req, res) => {
    try {
        // The frontend will decode the Google credential and pass the basic profile info
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ status: 'fail', message: 'No email provided from Google.' });
        }

        // Find or create the user based on email
        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            user = await User.create({
                email: email.toLowerCase(),
                name: name || '',
                authProvider: 'google',
            });
        }

        // Issue our backend JWT
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            }
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to authenticate with Google.' });
    }
};
