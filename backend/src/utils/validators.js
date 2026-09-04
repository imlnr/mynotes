const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
    return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

module.exports = { isValidEmail, normalizeEmail };
