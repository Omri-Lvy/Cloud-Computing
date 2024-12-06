import axios from "axios";

const API_URL = "http://localhost:5001";

describe("Docker and Server Integration Tests", () => {
    it("should have the server running on port 5001", async () => {
        console.log("🔍 Testing server availability on port 5001...");
        const response = await axios.get(`${API_URL}/stocks`);
        expect([200, 404]).toContain(response.status);
        console.log("✅ Server is running and responding on port 5001.");
    });

    it("should respond to all required endpoints", async () => {
        console.log("🔍 Testing all required API endpoints...");
        const endpoints = [
            { path: "/stocks", method: "GET" },
            { path: "/stock/test", method: "GET" },
            { path: "/stock-value/test", method: "GET" },
            { path: "/portfolio-value", method: "GET" },
        ];

        for (const endpoint of endpoints) {
            console.log(`🔗 Testing ${endpoint.method} ${endpoint.path}...`);
            const response = await axios.get(`${API_URL}${endpoint.path}`).catch(err => err.response);
            expect(response?.status).toBeDefined();
            console.log(`✅ ${endpoint.method} ${endpoint.path} is accessible.`);
        }
    });
});
