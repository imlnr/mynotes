require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/helpers/db');
const authRoutes = require('./src/routes/authRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const apiKeyMiddleware = require('./src/middlewares/apiKeyMiddleware');

const app = express();

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

// Apply API Key Middleware globally
app.use(apiKeyMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
