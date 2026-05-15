const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register); // Ideally protect this for admins only
router.post('/login', authController.login);

// Verify Token Endpoint for frontend checks
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({ valid: true, userId: req.userId, role: req.userRole });
});

router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router;
