const db = require('./DB_config/db');
const bcrypt = require('bcryptjs');

async function addRecruiter() {
    try {
        const email = 'recruiter@uog.edu.et';
        const role = 'hr'; // Assuming HR role has access to recruitment dashboard
        const passwordHash = await bcrypt.hash('password123', 8);
        
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length === 0) {
            await db.query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, passwordHash, role]);
            console.log('Recruiter user created: recruiter@uog.edu.et / password123');
        } else {
            await db.query('UPDATE users SET password_hash = ?, role = ? WHERE email = ?', [passwordHash, role, email]);
            console.log('Recruiter user updated: recruiter@uog.edu.et / password123');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

addRecruiter();
