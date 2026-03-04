const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTest() {
    console.log("Starting Document Test with Realistic Users...");

    // 1. Login as Admin
    console.log("1. Logging in as admin@uog.edu.et...");
    const loginRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@uog.edu.et', password: 'password123' });

    const token = loginRes.body.accessToken;
    if (!token) {
        console.error("   FAILED: No token received. Ensure seed_users.js was run.");
        return;
    }
    console.log("   Got admin token.");

    // 2. Use an existing employee or create a quick one for the document test
    console.log("2. Fetching/Creating target employee for document upload...");
    const empRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/employees', method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    let targetEmployee;
    if (Array.isArray(empRes.body) && empRes.body.length > 0) {
        targetEmployee = empRes.body[0];
        console.log(`   Using existing employee: ${targetEmployee.first_name} ${targetEmployee.last_name} (ID: ${targetEmployee.id})`);
    } else {
        // Create one if none exist
        const createRes = await request({
            hostname: 'localhost', port: 5000, path: '/api/employees', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, {
            firstName: "Doc", lastName: "User", email: "docs@uog.edu.et", idNumber: "DOC-001",
            department: "IT", role: "Software Engineer", status: "Active"
        });
        targetEmployee = { id: createRes.body.id };
        console.log(`   Created new employee for test: ID ${targetEmployee.id}`);
    }

    const empId = targetEmployee.id;

    // 3. Upload Document using curl (simulating multipart form)
    console.log(`3. Uploading Document for Employee ID ${empId}...`);
    const testFile = path.join(__dirname, 'test_cv.txt');
    fs.writeFileSync(testFile, 'This is a realistic test CV content for UOG HRMS.');

    // Using PowerShell-compatible curl or standard curl
    const curlCmd = `curl -X POST -H "Authorization: Bearer ${token}" -F "file=@${testFile}" -F "employeeId=${empId}" -F "documentType=CV" http://localhost:5000/api/documents/upload`;

    exec(curlCmd, async (error, stdout, stderr) => {
        if (error) {
            console.error(`   Curl Error: ${error.message}`);
            return;
        }

        try {
            const uploadRes = JSON.parse(stdout);
            console.log(`   Upload Success: ${uploadRes.message}`);
        } catch (e) {
            console.log(`   Upload Response: ${stdout}`);
        }

        // 4. List Documents
        console.log(`4. Verifying document retrieval for employee ${empId}...`);
        const listRes = await request({
            hostname: 'localhost', port: 5000, path: `/api/documents/${empId}`, method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (listRes.status === 200 && Array.isArray(listRes.body)) {
            const found = listRes.body.find(d => d.document_name === 'test_cv.txt');
            if (found) {
                console.log(`   SUCCESS: Found uploaded document "${found.document_name}" in list.`);
            } else {
                console.warn("   WARNING: Document not found in list. Response:", listRes.body);
            }
        } else {
            console.error("   FAILED: Could not retrieve document list.");
        }
    });
}

runTest().catch(console.error);
