import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:5001";

describe("Single Stock API Tests", () => {
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

    it("should fetch a stock by its ID", async () => {
        console.log(`🔍 Testing GET /stocks/${stockId}...`);
        if (!stockId) {
            throw new Error("Test setup failed: stockId is null.");
        }

        try {
            const response = await axios.get(`${API_URL}/stocks/${stockId}`);
            console.log("Server Response:", response.data);

            // Validate response structure
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty("id", stockId);
            expect(response.data).toHaveProperty("symbol", "AAPL");
            console.log("✅ Successfully fetched the stock by ID.");
        } catch (error) {
            console.error(`❌ Failed to fetch stock for ID ${stockId}:`, (error as AxiosError).response?.data);
            throw error;
        }
    });

    it("should update a stock's details", async () => {
        console.log(`🔍 Testing PUT /stocks/${stockId} to update stock details...`);
        if (!stockId) {
            throw new Error("Test setup failed: stockId is null.");
        }

        const updatedStockData = {
            symbol: "AAPL",
            name: "Apple Inc. Updated",
            purchase_price: 160,
            purchase_date: "01-09-2020",
            shares: 15,
        };

        try {
            const response = await axios.put(`${API_URL}/stocks/${stockId}`, updatedStockData);
            console.log("Update Response:", response.data);

            // Validate response
            expect(response.status).toBe(200);
            expect(response.data).toMatchObject(updatedStockData);
            console.log("✅ Successfully updated the stock.");
        } catch (error) {
            console.error(`❌ Failed to update stock for ID ${stockId}:`, (error as AxiosError).response?.data);
            throw error;
        }
    });

    it("should return 404 for a non-existing stock ID", async () => {
        const nonExistingId = "non-existing-id";
        console.log(`🔍 Testing GET /stocks/${nonExistingId} for a non-existing stock...`);

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
