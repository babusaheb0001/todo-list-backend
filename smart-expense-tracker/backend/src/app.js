const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Security Middleware
app.use(helmet()); // Adds security headers to prevent common attacks
app.use(cors()); // Allows our frontend to talk to our backend
app.use(express.json()); // Allows us to receive JSON data in requests

// A simple test route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Smart Expense Tracker API is running!' });
});

// We will add more routes here later!

// Error Handling Middleware (must be at the end)
app.use(errorMiddleware);

module.exports = app;
