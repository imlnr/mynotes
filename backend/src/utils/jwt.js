const jwt = require('jsonwebtoken');

const DEV_FALLBACK_SECRET = 'dev-only-secret-change-me';

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (secret) return secret;

    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is required in production');
    }

    return DEV_FALLBACK_SECRET;
}

function signToken(id) {
    return jwt.sign({ id }, getJwtSecret(), {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    });
}

function verifyToken(token) {
    return jwt.verify(token, getJwtSecret());
}

module.exports = { getJwtSecret, signToken, verifyToken };
