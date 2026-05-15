const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Apply auth middleware
router.use(verifyToken);
// Only admins can access settings
router.use(isAdmin);

router.get('/structure', settingsController.getStructure);
router.post('/structure/colleges', settingsController.addCollege);
router.post('/structure/departments', settingsController.addDepartment);

router.get('/jobs', settingsController.getJobs);
router.post('/jobs', settingsController.addJob);

router.get('/campuses', settingsController.getCampuses);

module.exports = router;
