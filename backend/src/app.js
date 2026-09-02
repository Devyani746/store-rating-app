require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).send('Store Rating Backend Service is live.');
});

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Store Rating REST API is running successfully'
  });
});

// Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

// Catch-all 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requestedPath: req.originalUrl
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

module.exports = app;