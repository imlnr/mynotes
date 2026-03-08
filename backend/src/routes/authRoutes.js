const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/google', authController.googleAuth);

module.exports = router;
