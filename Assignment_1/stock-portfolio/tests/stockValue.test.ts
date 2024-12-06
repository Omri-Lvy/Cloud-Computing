import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:5001";

describe("Stock Value API Tests", () => {
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
                headers: {
                    "Content-Type": "application/json",
                },
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
                console.log("Delete Response:", response.data);
                console.log("✅ Test stock deleted successfully.");
            } catch (error) {
                console.error("❌ Failed to delete test stock:", (error as AxiosError).response?.data);
            }
        }
    });

    it("should fetch the current value of an existing stock by ID", async () => {
        console.log(`🔍 Testing GET /stock-value/${stockId}...`);
        if (!stockId) {
            throw new Error("Test setup failed: stockId is null.");
        }

        try {
            const response = await axios.get(`${API_URL}/stock-value/${stockId}`);
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty("symbol", "AAPL");
            expect(response.data).toHaveProperty("stock_value");
            expect(response.data).toHaveProperty("ticker");
            expect(typeof response.data.ticker).toBe("number");
            expect(typeof response.data["stock_value"]).toBe("number");

            console.log("✅ Successfully fetched the current value of the stock.");
        } catch (error) {
            console.error(`❌ Failed to fetch stock value for ID ${stockId}:`, (error as AxiosError).response?.data);
            throw error;
        }
    });

    it("should return a 404 for a non-existing stock ID", async () => {
        const nonExistingId = "non-existing-id";
        console.log(`🔍 Testing GET /stock-value/${nonExistingId} for a non-existing stock...`);

        try {
            await axios.get(`${API_URL}/stock-value/${nonExistingId}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            expect(axiosError.response?.status).toBe(404);
            expect(axiosError.response?.data).toHaveProperty("error", "Not found");
            console.log("✅ Correctly returned 404 for non-existing stock ID.");
        }
    });
});
