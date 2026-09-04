const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/User');
const Otp = require('../models/Otp');
const sendEmail = require('../services/email');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');
const { isValidEmail, normalizeEmail } = require('../utils/validators');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const formatUser = (user) => ({
    id: user._id,
    email: user.email,
    name: user.name || '',
});

const sendAuthSuccess = (res, user) => {
    res.status(200).json({
        status: 'success',
        token: signToken(user._id),
        user: formatUser(user),
    });
};

const findOrCreateUser = async ({ email, name, authProvider }) => {
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            email,
            name: name || '',
            authProvider,
        });
    } else if (name && !user.name) {
        user.name = name;
        await user.save();
    }
    return user;
};

exports.sendOtp = asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);

    if (!isValidEmail(email)) {
        return res.status(400).json({ status: 'fail', message: 'Please provide a valid email.' });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: hashedOtp });

    const message = `Your login OTP is ${otp}. It will expire in 5 minutes.`;
    const htmlMessage = `<p>Your login OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`;

    await sendEmail({
        email,
        subject: 'Your Docables Login OTP',
        message,
        html: htmlMessage,
    });

    res.status(200).json({
        status: 'success',
        message: 'OTP sent to email!',
    });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { otp } = req.body;

    if (!isValidEmail(email) || !otp) {
        return res.status(400).json({ status: 'fail', message: 'Please provide email and OTP.' });
    }

    const record = await Otp.findOne({ email });
    if (!record) {
        return res.status(400).json({ status: 'fail', message: 'OTP expired or not found.' });
    }

    const isMatch = await bcrypt.compare(String(otp), record.otp);
    if (!isMatch) {
        return res.status(400).json({ status: 'fail', message: 'Invalid OTP.' });
    }

    const user = await findOrCreateUser({ email, authProvider: 'email' });
    await Otp.deleteOne({ _id: record._id });

    sendAuthSuccess(res, user);
});

exports.googleAuth = asyncHandler(async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({ status: 'fail', message: 'Google access token is required.' });
    }

    let profile;
    try {
        const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 8000,
        });
        profile = googleRes.data;
    } catch (err) {
        if (err.response) {
            return res.status(401).json({ status: 'fail', message: 'Google authentication failed.' });
        }
        throw err;
    }

    const email = normalizeEmail(profile.email);
    if (!isValidEmail(email)) {
        return res.status(400).json({ status: 'fail', message: 'Google did not return a valid email.' });
    }

    const user = await findOrCreateUser({
        email,
        name: profile.name || '',
        authProvider: 'google',
    });

    sendAuthSuccess(res, user);
});
