const db = require('../DB_config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../Auth/auth.config');

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const userRole = role || 'employee';

        const [result] = await db.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, hashedPassword, userRole]
        );

        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = users[0];
        const passwordIsValid = await bcrypt.compare(password, user.password_hash);

        if (!passwordIsValid) {
            return res.status(401).json({ accessToken: null, message: 'Invalid Password!' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.secret,
            { expiresIn: config.jwtExpiration } // 24 hours
        );

        // Update last login
        await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            accessToken: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // 1. Fetch user
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = users[0];

        // 2. Verify current password
        const passwordIsValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid current password.' });
        }

        // 3. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Update password
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);

        res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: error.message });
    }
};
