async function testAiEndpoint() {
    const API_URL = 'http://localhost:5000/api';

    // 1. Login
    console.log("1. Attempting Login...");
    try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@uog.edu.et',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            console.error("Login Failed:", loginRes.status);
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.accessToken;
        
        console.log("Login Success. Token acquired.");

        // 2. Test AI Rank Candidates
        console.log("\n2. Accessing /api/ai/rank-candidates/1...");
        const aiRes = await fetch(`${API_URL}/ai/rank-candidates/1`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (aiRes.ok) {
            const candidates = await aiRes.json();
            console.log("AI Proxy API Success!");
            console.log(JSON.stringify(candidates, null, 2));
        } else {
            console.error("AI Proxy API Failed:", aiRes.status, aiRes.statusText);
            const text = await aiRes.text();
            console.error("Body:", text);
        }

    } catch (error) {
        console.error("Network Error:", error.message);
    }
}

testAiEndpoint();
