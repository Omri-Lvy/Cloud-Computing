import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:5001";

describe("Portfolio Value API Tests", () => {
    let stockIds: string[] = [];

    beforeAll(async () => {
        console.log("🔧 Setting up: Creating test stocks...");
        const stocks = [
            { symbol: "AAPL", name: "Apple Inc.", purchase_price: 150, shares: 10 },
            { symbol: "GOOG", name: "Alphabet Inc.", purchase_price: 140.12, shares: 5 },
        ];

        try {
            for (const stock of stocks) {
                const response = await axios.post(`${API_URL}/stocks`, stock);
                console.log("Created Stock Response:", response.data);
                stockIds.push(response.data.id);
            }
            console.log("✅ Test stocks created with IDs:", stockIds);
        } catch (error) {
            console.error("❌ Failed to create test stocks:", (error as AxiosError).response?.data);
            throw error;
        }
    });

    afterAll(async () => {
        console.log("🧹 Cleaning up: Deleting test stocks...");
        try {
            for (const id of stockIds) {
                const response = await axios.delete(`${API_URL}/stocks/${id}`);
                console.log(`Deleted Stock ID: ${id}, Response:`, response.data);
            }
            console.log("✅ Test stocks deleted successfully.");
        } catch (error) {
            console.error("❌ Failed to delete test stocks:", (error as AxiosError).response?.data);
        }
    });

    it("should calculate the correct portfolio value", async () => {
        console.log("🔍 Testing GET /portfolio-value...");
        try {
            const response = await axios.get(`${API_URL}/portfolio-value`);
            console.log("Server Response:", response.data);

            // Validate the response
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty("date");
            expect(response.data).toHaveProperty("portfolio_value");

            const portfolioValue = response.data["portfolio_value"];
            expect(typeof portfolioValue).toBe("number");
            expect(portfolioValue).toBeGreaterThan(0);
            console.log("✅ Successfully calculated the portfolio value.");
        } catch (error) {
            console.error("❌ Failed to fetch portfolio value:", (error as AxiosError).response?.data);
            throw error;
        }
    });
});
