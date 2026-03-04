const db = require('../DB_config/db');
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { employeeId, documentType } = req.body;
        const { originalname, filename, size, path: filePath } = req.file;

        // Basic validation
        if (!employeeId || !documentType) {
            // Clean up file if validation fails
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: "Missing metadata (employeeId or documentType)" });
        }

        const [result] = await db.query(
            `INSERT INTO documents (employee_id, document_name, document_type, file_path, file_size)
             VALUES (?, ?, ?, ?, ?)`,
            [employeeId, originalname, documentType, filename, (size / 1024 / 1024).toFixed(2) + ' MB']
        );

        res.status(201).json({
            message: "Document uploaded successfully",
            id: result.insertId,
            document: {
                id: result.insertId,
                name: originalname,
                type: documentType,
                size: (size / 1024 / 1024).toFixed(2) + ' MB',
                date: new Date().toISOString().split('T')[0]
            }
        });

    } catch (error) {
        console.error("Error uploading document:", error);
        // Clean up file if DB insert fails
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const [documents] = await db.query(
            'SELECT * FROM documents WHERE employee_id = ? ORDER BY uploaded_at DESC',
            [employeeId]
        );
        res.status(200).json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllDocuments = async (req, res) => {
    try {
        const [documents] = await db.query(`
            SELECT d.*, e.first_name, e.last_name, e.employee_id_number as emp_id_num
            FROM documents d
            JOIN employees e ON d.employee_id = e.id
            ORDER BY d.uploaded_at DESC
        `);
        res.status(200).json(documents);
    } catch (error) {
        console.error("Error fetching all documents:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.downloadDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const [docs] = await db.query('SELECT * FROM documents WHERE id = ?', [documentId]);

        if (docs.length === 0) {
            return res.status(404).json({ message: "Document not found" });
        }

        const doc = docs[0];
        const filePath = path.join(__dirname, '../uploads', doc.file_path);

        if (fs.existsSync(filePath)) {
            res.download(filePath, doc.document_name);
        } else {
            res.status(404).json({ message: "File not found on server" });
        }
    } catch (error) {
        console.error("Error downloading document:", error);
        res.status(500).json({ message: error.message });
    }
};
