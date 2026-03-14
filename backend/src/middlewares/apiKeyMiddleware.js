const apiKeyMiddleware = (req, res, next) => {
    // Allow preflight OPTIONS requests without API key
    if (req.method === 'OPTIONS') {
        return next();
    }

    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.X_API_KEY;

    if (!validApiKey) {
        console.warn('Warning: X_API_KEY is not defined in environment variables. API requests may fail or be insecure.');
        // If no key is set in backend, we should technically fail so the dev knows to set it.
        return res.status(500).json({ status: 'error', message: 'Server configuration error: X_API_KEY not set.' });
    }

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid or missing x-api-key header.' });
    }

    next();
};

module.exports = apiKeyMiddleware;
