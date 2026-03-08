const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        trim: true,
    },
    authProvider: {
        type: String,
        enum: ['email', 'google'],
        default: 'email',
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
