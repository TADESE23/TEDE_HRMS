// using native fetch
// If node-fetch not available, use http/https modules or assume node 18+ has fetch.
// User environment is Windows, likely Node 18+

async function testApi() {
    const API_URL = 'http://localhost:5000/api';

    // 1. Login
    console.log("1. Attempting Login...");
    try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@uog.edu.et', // Assuming this user exists from seed
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            console.error("Login Failed:", loginRes.status, loginRes.statusText);
            const text = await loginRes.text();
            console.error("Body:", text);
            return;
        }

        const loginData = await loginRes.json();
        console.log("Login Success!");
        const token = loginData.accessToken;
        console.log("Token received:", token ? token.substring(0, 20) + "..." : "NONE");

        if (!token) {
            console.error("No token in login response!");
            return;
        }

        // 2. Test AI Forecasts
        console.log("\n2. Accessing /api/ai/forecasts...");
        const aiRes = await fetch(`${API_URL}/ai/forecasts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (aiRes.ok) {
            const forecasts = await aiRes.json();
            console.log("AI API Success!");
            console.log(`Received ${forecasts.length} forecasts.`);
        } else {
            console.error("AI API Failed:", aiRes.status, aiRes.statusText);
            const text = await aiRes.text();
            console.error("Body:", text);
        }

    } catch (error) {
        console.error("Network Error:", error.message);
    }
}

testApi();
