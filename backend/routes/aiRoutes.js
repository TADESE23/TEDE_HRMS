const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get forecasts
router.get('/forecasts', verifyToken, aiController.getForecasts);

// Trigger generation manually
router.post('/generate', verifyToken, isAdmin, aiController.generateForecasts);

// Rank candidates for a given vacancy
router.get('/rank-candidates/:vacancyId', verifyToken, aiController.rankCandidates);

// Get turnover risk insights
router.get('/turnover-risk', verifyToken, aiController.getTurnoverRisk);

module.exports = router;
