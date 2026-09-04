const crypto = require('crypto');

function generateShareId() {
    return crypto.randomBytes(12).toString('base64url');
}

module.exports = { generateShareId };
