const path = require('path');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Docables API',
            version: '1.0.0',
            description: 'API documentation for Docables application',
            contact: {
                name: 'Developer',
            },
            servers: [{ url: process.env.VITE_API_URL || 'http://localhost:5000' }],
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
        security: [{ apiKeyAuth: [] }],
    },
    apis: [
        path.join(__dirname, '..', '..', 'index.js'),
        path.join(__dirname, '..', 'routes', '*.js'),
    ],
};

module.exports = swaggerOptions;
