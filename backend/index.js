require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/helpers/db');
const authRoutes = require('./src/routes/authRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const apiKeyMiddleware = require('./src/middlewares/apiKeyMiddleware');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Notables API',
            version: '1.0.0',
            description: 'API documentation for Notables application',
            contact: {
                name: 'Developer'
            },
            servers: [{ urlBase: process.env.VITE_API_URL || 'http://localhost:5000' }]
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
                }
            }
        },
        security: [{ apiKeyAuth: [] }]
    },
    apis: ['./index.js', './src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: true }));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns the landing page
 *     responses:
 *       200:
 *         description: A beautifully styled HTML landing page
 */
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notables API | Secure & Fast</title>
            <style>
                :root {
                    --bg: #09090b;
                    --fg: #fafafa;
                    --primary: #ffffff;
                    --accent: #3b82f6;
                    --muted: #27272a;
                    --muted-fg: #a1a1aa;
                }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: var(--bg);
                    color: var(--fg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    text-align: center;
                }
                .container {
                    max-width: 600px;
                    padding: 2rem;
                    border: 1px solid var(--muted);
                    border-radius: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(10px);
                }
                h1 {
                    font-size: 3rem;
                    font-weight: 800;
                    margin: 0;
                    letter-spacing: -0.05em;
                }
                p {
                    font-size: 1.125rem;
                    color: var(--muted-fg);
                    margin-top: 1rem;
                }
                .tagline {
                    background: linear-gradient(to right, #fff, #a1a1aa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 500;
                }
                .btn {
                    display: inline-block;
                    margin-top: 2rem;
                    padding: 0.75rem 1.5rem;
                    background-color: var(--primary);
                    color: var(--bg);
                    text-decoration: none;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .btn:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                .status {
                    margin-top: 1.5rem;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    background-color: #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 8px #22c55e;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Notables</h1>
                <p class="tagline">Capture your thoughts, secure and fast.</p>
                <p>Advanced backend infrastructure powering your notes with enterprise-grade security and reliability.</p>
                <a href="/api-docs" class="btn">Explore API Docs</a>
                <div class="status">
                    <span class="dot"></span>
                    <span>System Operational</span>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Apply API Key Middleware globally for all subsequent routes
app.use(apiKeyMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
