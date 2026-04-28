const db = require('./DB_config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function regenerate() {
    try {
        // Clear old forecasts
        await db.query('DELETE FROM hr_forecasts');
        console.log('Cleared old forecasts.');

        // Get admin user and generate token locally
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@uog.edu.et']);
        if (users.length === 0) {
            console.error('Admin user not found!');
            process.exit(1);
        }
        
        // Read the JWT secret from the config 
        let secret = 'your_jwt_secret_key';
        try {
            const config = require('./Auth/auth.config');
            secret = config.secret || secret;
        } catch(e) {}

        const token = jwt.sign({ id: users[0].id, role: users[0].role }, secret, { expiresIn: '1h' });

        const response = await fetch('http://localhost:5000/api/ai/generate', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('Forecast result:', JSON.stringify(data, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

regenerate();
