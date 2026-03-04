const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, isHR, isAdmin } = require('../middleware/authMiddleware');

// Public or Protected Routes
// Get all leaves (HR/Admin usually, but open for now with token)
router.get('/', verifyToken, leaveController.getAllLeaves);

// Get specific employee leaves
router.get('/my-leaves/:employeeId', verifyToken, leaveController.getMyLeaves);

// Request a leave
router.post('/request', verifyToken, leaveController.requestLeave);

// Update status (HR/Admin only)
router.put('/:id/status', [verifyToken, isHR], leaveController.updateLeaveStatus);

module.exports = router;
