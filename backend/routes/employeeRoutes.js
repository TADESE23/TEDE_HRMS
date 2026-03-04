const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, isHR, isAdmin } = require('../middleware/authMiddleware');

// Public or Protected Routes
router.get('/', verifyToken, employeeController.getAllEmployees);
router.get('/:id', verifyToken, employeeController.getEmployeeById);

// HR/Admin Only Operations
router.post('/', [verifyToken, isHR], employeeController.createEmployee);
router.put('/:id', [verifyToken, isHR], employeeController.updateEmployee);
router.delete('/:id', [verifyToken, isAdmin], employeeController.deleteEmployee);

module.exports = router;
