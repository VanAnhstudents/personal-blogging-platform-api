const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const articleRoutes = require('./routes/articles');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Start Express App
const app = express();

// Middleware
app.use(cors()); // Enable requests from other domain
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/articles', articleRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is running successfully' })
});

// Middleware error handle
app.use(errorHandler);

module.exports = app;