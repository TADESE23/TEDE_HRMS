const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { verifyToken, isHR, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/records', isHR, payrollController.getPayrollRecords);
router.post('/generate', isHR, payrollController.generatePayroll);
router.put('/records/:id/approve', isAdmin, payrollController.approvePayroll);

module.exports = router;
