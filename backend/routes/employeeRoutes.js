const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, isHR, isAdmin } = require('../middleware/authMiddleware');

// All employee routes require authentication
router.use(verifyToken);

// Public or Protected Routes
router.get('/', employeeController.getAllEmployees);
router.get('/me', employeeController.getMe);
router.get('/:id', employeeController.getEmployeeById);

// HR/Admin Only Operations
router.post('/', isHR, employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.post('/:id/photo', employeeController.uploadPhoto, employeeController.updateProfilePhoto);
router.delete('/:id', isAdmin, employeeController.deleteEmployee);

module.exports = router;
