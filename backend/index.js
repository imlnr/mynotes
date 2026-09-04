require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./src/helpers/db');
const authRoutes = require('./src/routes/authRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const apiKeyMiddleware = require('./src/middlewares/apiKeyMiddleware');
const errorHandler = require('./src/middlewares/errorHandler');
const swaggerOptions = require('./src/config/swagger');

const app = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions);

connectDB();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customSiteTitle: 'Docables API Documentation',
}));

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
            <title>Docables API | Secure & Fast</title>
            <style>
                :root {
                    --bg: #09090b;
                    --fg: #fafafa;
                    --primary: #ffffff;
                    --muted: #27272a;
                    --muted-fg: #a1a1aa;
                }
                body {
                    margin: 0;
                    font-family: -apple-system, BlinkSystemFont, "Segoe UI", Roboto, sans-serif;
                    background-color: var(--bg);
                    color: var(--fg);
                    display: flex;
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
                }
                h1 { font-size: 3rem; font-weight: 800; margin: 0; letter-spacing: -0.05em; }
                p { font-size: 1.125rem; color: var(--muted-fg); margin-top: 1rem; }
                .btn {
                    display: inline-block;
                    margin-top: 2rem;
                    padding: 0.75rem 1.5rem;
                    background-color: var(--primary);
                    color: var(--bg);
                    text-decoration: none;
                    border-radius: 0.5rem;
                    font-weight: 600;
                }
                .status { margin-top: 1.5rem; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .dot { width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Docables</h1>
                <p>Capture your thoughts, secure and fast.</p>
                <a href="/api-docs/" class="btn">Explore API Docs</a>
                <div class="status"><span class="dot"></span><span>System Operational</span></div>
            </div>
        </body>
        </html>
    `);
});

app.use(apiKeyMiddleware);
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
