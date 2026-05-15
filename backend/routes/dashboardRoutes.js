const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

// Get dashboard statistics
router.get('/stats', verifyToken, dashboardController.getDashboardStats);

// Get dashboard analytics
router.get('/analytics', verifyToken, dashboardController.getDashboardAnalytics);

// Get campus metrics
router.get('/campus-metrics', verifyToken, dashboardController.getCampusMetrics);

// Get staff distribution
router.get('/staff-distribution', verifyToken, dashboardController.getStaffDistribution);

// Get rank distribution
router.get('/rank-distribution', verifyToken, dashboardController.getRankDistribution);

// Get system activity
router.get('/activity', verifyToken, dashboardController.getSystemActivity);

// Export dashboard report
router.post('/export', verifyToken, dashboardController.exportDashboardReport);

module.exports = router;
