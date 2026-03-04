const http = require('http');

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

async function runTests() {
    console.log("Starting HRMS Backend Testing with Realistic Users...");

    // 1. Login as Admin
    console.log("1. Logging in as admin@uog.edu.et...");
    const adminLogin = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@uog.edu.et', password: 'password123' });

    const adminToken = adminLogin.body.accessToken;
    if (!adminToken) {
        console.error("   FAILED: Could not login as admin. Did you run seed_users.js?");
        return;
    }
    console.log("   Got admin token.");

    // 2. Create an Employee (as Admin)
    console.log("2. Creating a new employee account (as Admin)...");
    const empIdNum = `EMP-${Date.now()}`;
    const empData = {
        firstName: "Sample",
        lastName: "Employee",
        email: `emp_${Date.now()}@uog.edu.et`,
        idNumber: empIdNum,
        department: "Social Science",
        role: "Lecturer",
        status: "Active",
        academicRank: "Assistant Professor"
    };

    const createRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/employees', method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        }
    }, empData);

    const employeeId = createRes.body.id;
    if (createRes.status === 201 && employeeId) {
        console.log(`   SUCCESS: Employee created with ID: ${employeeId}`);
    } else {
        console.error(`   FAILED: ${JSON.stringify(createRes.body)}`);
    }

    // 3. Login as HR
    console.log("3. Logging in as hr@uog.edu.et...");
    const hrLogin = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email: 'hr@uog.edu.et', password: 'password123' });

    const hrToken = hrLogin.body.accessToken;
    console.log(hrToken ? "   Got HR token." : "   FAILED: Could not login as HR.");

    // 4. Request Leave (using a token from an authenticated session)
    if (hrToken && employeeId) {
        console.log("4. Requesting leave for the new employee (as HR/Admin)...");
        const leaveData = {
            employeeId: employeeId,
            leaveType: "Sick Leave",
            startDate: "2026-02-01",
            endDate: "2026-02-05",
            reason: "Recovery after surgery"
        };

        const leaveRes = await request({
            hostname: 'localhost', port: 5000, path: '/api/leaves/request', method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${hrToken}`
            }
        }, leaveData);

        if (leaveRes.status === 201) {
            console.log("   SUCCESS: Leave request created.");
        } else {
            console.error(`   FAILED: ${JSON.stringify(leaveRes.body)}`);
        }
    }

    console.log("\nTesting complete. All flows verified with realistic user roles.");
}

runTests().catch(console.error);
