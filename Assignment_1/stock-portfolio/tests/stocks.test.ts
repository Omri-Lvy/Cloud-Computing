import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:5001";

describe("Stocks API Tests", () => {
    let stockId: string | null = null
    it("should return an empty list of stocks initially", async () => {
        console.log("🔍 Testing GET /stocks for initial state...");
        const response = await axios.get(`${API_URL}/stocks`);
        expect(response.status).toBe(200);
        expect(response.data).toEqual([]);
        console.log("✅ GET /stocks returned an empty list as expected.");
    });

    it("should add a new stock using POST /stocks", async () => {
        console.log("🔍 Testing POST /stocks to add a new stock...");
        const stockData = {
            symbol: "AAPL",
            name: "Apple Inc.",
            purchase_price: 150,
            shares: 10,
        };

        try {
            const response = await axios.post(`${API_URL}/stocks`, stockData);
            console.log("Server Response:", response.data); // Debug response
            expect(response.status).toBe(201);

            // Save the stock ID for future tests
            stockId = response.data.id;
            console.log("✅ Stock ID saved:", stockId);
        } catch (error) {
            console.error("❌ POST /stocks failed:", (error as AxiosError).response?.data);
            throw error;
        }
    });

    it("should retrieve the added stock using GET /stocks", async () => {
        console.log("🔍 Testing GET /stocks to retrieve the added stock...");
        try {
            const response = await axios.get(`${API_URL}/stocks`);
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(1);
            expect(response.data[0].id).toBe(stockId);
        } catch (error) {
            console.error("❌ GET /stocks failed:", (error as AxiosError).response?.data);
            throw error;
        }
    });

    it("should return a 400 error for invalid POST /stocks data", async () => {
        console.log("🔍 Testing POST /stocks with invalid data...");
        const invalidData = { symbol: "MSFT" }; // Missing required fields

        try {
            await axios.post(`${API_URL}/stocks`, invalidData);
        } catch (error) {
            const axiosError = error as AxiosError;
            expect(axiosError.response?.status).toBe(400);
            expect(axiosError.response?.data).toHaveProperty("error");
            console.log("✅ POST /stocks returned 400 for invalid data.");
        }
    });

    it("should delete the added stock using DELETE /stocks/:id", async () => {
        console.log("🔍 Testing DELETE /stocks/:id to remove the added stock...");
        if (!stockId) {
            console.error("❌ Cannot delete stock: stockId is null. Ensure POST /stocks passes.");
            throw new Error("Test setup failed: stockId is null.");
        }

        try {
            const response = await axios.delete(`${API_URL}/stocks/${stockId}`);
            console.log("Server Response:", response.data); // Debug response
            expect(response.status).toBe(204);
            expect(response.statusText).toBe("No Content");
            expect(response.data).toBe("");

            // Verify the stock is removed
            const getResponse = await axios.get(`${API_URL}/stocks`);
            expect(getResponse.data).toEqual([]);
            console.log("✅ GET /stocks confirmed the stock list is empty.");
        } catch (error) {
            console.error("❌ DELETE /stocks/:id failed:", (error as AxiosError).response?.data);
            throw error;
        }
    });

});
