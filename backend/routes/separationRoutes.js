const express = require('express');
const router = express.Router();
const separationController = require('../controllers/separationController');
const { verifyToken, isHR } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(isHR); 

router.get('/', separationController.getSeparations);
router.post('/', separationController.addSeparation);

module.exports = router;
