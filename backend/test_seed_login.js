const http = require('http');

const users = [
    { email: 'admin@uog.edu.et', password: 'password123' },
    { email: 'hr@uog.edu.et', password: 'password123' },
    { email: 'manager@uog.edu.et', password: 'password123' },
    { email: 'manager@hrplus.com', password: 'password123' },
    { email: 'employee@uog.edu.et', password: 'password123' }
];

function login(user) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                const data = JSON.parse(body);
                if (res.statusCode === 200 && data.accessToken) {
                    console.log(`[PASS] Login successful for ${user.email} (Role: ${data.role})`);
                    resolve(true);
                } else {
                    console.log(`[FAIL] Login failed for ${user.email}: ${data.message}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`[ERROR] Request failed for ${user.email}: ${e.message}`);
            resolve(false);
        });

        req.write(JSON.stringify(user));
        req.end();
    });
}

async function runTests() {
    console.log("Verifying seeded users...");
    for (const user of users) {
        await login(user);
    }
}

runTests();
