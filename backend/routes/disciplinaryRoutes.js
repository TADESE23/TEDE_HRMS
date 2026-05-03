const express = require('express');
const router = express.Router();
const disciplinaryController = require('../controllers/disciplinaryController');

router.get('/', disciplinaryController.getDisciplinaryActions);
router.post('/', disciplinaryController.addDisciplinaryAction);

module.exports = router;
