import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:5001";

describe("Error Handling Tests", () => {
    let stockId: string | null = null;

    beforeAll(async () => {
        console.log("🔧 Setting up: Creating a test stock...");
        const stockData = {
            symbol: "AAPL",
            name: "Apple Inc.",
            purchase_price: 150,
            shares: 10,
        };

        try {
            const response = await axios.post(`${API_URL}/stocks`, stockData, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("Created Stock Response:", response.data);
            stockId = response.data.id;
            console.log("✅ Test stock created with ID:", stockId);
        } catch (error) {
            console.error("❌ Failed to create test stock:", (error as AxiosError).response?.data);
            throw error;
        }
    });

    afterAll(async () => {
        if (stockId) {
            console.log("🧹 Cleaning up: Deleting the test stock...");
            try {
                const response = await axios.delete(`${API_URL}/stocks/${stockId}`);
                console.log(`Deleted Stock Response:`, response.data);
            } catch (error) {
                console.error("❌ Failed to delete test stock:", (error as AxiosError).response?.data);
            }
        }
    });

    it("should return 400 for missing payload in POST /stocks", async () => {
        console.log("🔍 Testing POST /stocks with missing payload...");
        try {
            await axios.post(`${API_URL}/stocks`, {}, {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            expect(axiosError.response?.status).toBe(400);
            expect(axiosError.response?.data).toHaveProperty("error", "Malformed data");
            console.log("✅ Correctly returned 400 for missing payload.");
        }
    });

    it("should return 400 for malformed payload in POST /stocks", async () => {
        console.log("🔍 Testing POST /stocks with malformed payload...");
        const malformedStockData = { symbol: "AAPL" }; // Missing required fields

        try {
            await axios.post(`${API_URL}/stocks`, malformedStockData, {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            expect(axiosError.response?.status).toBe(400);
            expect(axiosError.response?.data).toHaveProperty("error", "Malformed data");
            console.log("✅ Correctly returned 400 for malformed payload.");
        }
    });

    it("should return 404 for a non-existing stock ID in GET /stocks/{id}", async () => {
        const nonExistingId = "non-existing-id";
        console.log(`🔍 Testing GET /stocks/${nonExistingId} for non-existing stock...`);

        try {
            await axios.get(`${API_URL}/stocks/${nonExistingId}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            expect(axiosError.response?.status).toBe(404);
            expect(axiosError.response?.data).toHaveProperty("error", "Not found");
            console.log("✅ Correctly returned 404 for non-existing stock ID.");
        }
    });
});
