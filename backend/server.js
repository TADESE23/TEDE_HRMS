const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes Import
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const documentRoutes = require('./routes/documentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');
const recruitmentRoutes = require('./routes/recruitmentRoutes');
const academicRoutes = require('./routes/academicRoutes');
const disciplinaryRoutes = require('./routes/disciplinaryRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const housingRoutes = require('./routes/housingRoutes');
const separationRoutes = require('./routes/separationRoutes');
const apiRoutes = require('./api'); // Main API aggregator if needed

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/disciplinary', disciplinaryRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/housing', housingRoutes);
app.use('/api/separations', separationRoutes);
app.use('/api', apiRoutes); // General API routes

// Root Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to UOG TEDE HRMS API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
