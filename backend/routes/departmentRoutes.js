const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Public/Protected routes
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);

// Admin/HR operations
router.post('/', departmentController.createDepartment);
router.patch('/:id', departmentController.updateDepartment);
router.patch('/assign-employee', departmentController.assignEmployeeToDepartment);

module.exports = router;
