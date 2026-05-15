const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, isHR } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Admin & HR can view all, Employees might view their own (logic handled in controller or via role check)
router.get('/', attendanceController.getAttendance);
router.post('/log', isHR, attendanceController.logAttendance);
router.get('/stats', attendanceController.getStats);

module.exports = router;
