const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log("Loading .env...");
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

const secret = process.env.JWT_SECRET || 'secret_key_change_this';
console.log("Using secret:", secret);

// Simulate Token Generation (like authController)
const user = { id: 1, role: 'admin' };
const token = jwt.sign(
    { id: user.id, role: user.role },
    secret,
    { expiresIn: 86400 } // 24 hours
);

console.log("\nGenerated Token:", token);

// Simulate Verification (like authMiddleware)
console.log("\nVerifying Token...");
jwt.verify(token, secret, (err, decoded) => {
    if (err) {
        console.error("Verification FAILED:", err.message);
    } else {
        console.log("Verification SUCCESS!");
        console.log("Decoded:", decoded);
    }
});
