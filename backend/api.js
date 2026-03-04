const express = require('express');
const router = express.Router();

// Import Controllers
// const dashboardController = require('./controllers/dashboardController');

// Define general API routes here if not in specific route files
router.get('/status', (req, res) => {
    res.json({ status: 'API is working correctly', timestamp: new Date() });
});

module.exports = router;
