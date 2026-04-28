const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Add multer for CV uploads
const multer = require('multer');
const fs = require('fs');

const uploadDir = 'uploads/cvs';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

router.post('/vacancies', verifyToken, isAdmin, recruitmentController.createVacancy);
router.get('/vacancies', verifyToken, recruitmentController.getVacancies);

// Public routes
router.get('/public/vacancies', recruitmentController.getPublicVacancies);
router.post('/public/apply', upload.single('cv'), recruitmentController.applyForJob);

// Candidate routes
router.post('/candidates', verifyToken, upload.single('cv'), recruitmentController.createCandidate);
router.get('/candidates', verifyToken, recruitmentController.getCandidates);

module.exports = router;
