const jwt = require('jsonwebtoken');
const db = require('../DB_config/db');
const config = require('../Auth/auth.config');

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided!' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            console.error("Received Token:", token);
            return res.status(401).json({ message: `Unauthorized! ${err.message}` });
        }
        // Fix: Set req.user as an object matching controller expectations
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        // Keep these for backward compatibility if other parts use them, or remove if cleaner. 
        // Given "fix existing code", let's keeps them to be safe but ensure req.user exists.
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Require Admin Role!' });
    }
};

const isHR = (req, res, next) => {
    if (req.user && (req.user.role === 'hr' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Require HR or Admin Role!' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isHR
};
