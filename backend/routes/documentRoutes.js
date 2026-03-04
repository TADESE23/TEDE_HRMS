const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp-original
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
router.post('/upload', [verifyToken, upload.single('file')], documentController.uploadDocument);
router.get('/all', verifyToken, documentController.getAllDocuments); // Allow HR/Admin
router.get('/:employeeId', verifyToken, documentController.getDocuments);
router.get('/download/:id', verifyToken, documentController.downloadDocument);

module.exports = router;
