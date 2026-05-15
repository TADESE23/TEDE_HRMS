const express = require('express');
const router = express.Router();
const housingController = require('../controllers/housingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(isAdmin); // Typically only admins manage housing

router.get('/', housingController.getHousing);
router.post('/', housingController.addHousing);

module.exports = router;
