const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

router.get('/', trainingController.getTrainings);
router.post('/', trainingController.addTraining);

module.exports = router;
