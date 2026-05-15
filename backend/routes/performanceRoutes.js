const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/goals', performanceController.getGoals);
router.post('/goals', performanceController.addGoal);

router.get('/appraisals', performanceController.getAppraisals);
router.post('/appraisals', performanceController.addAppraisal);

module.exports = router;
