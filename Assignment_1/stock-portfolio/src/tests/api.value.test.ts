import request from 'supertest';
import app from '../app';
import { StockValue, PortfolioValue } from '../models/interfaces';

describe('Stock Value Calculation Tests', () => {
    let stockId: string;

    beforeAll(async () => {
        const response = await request(app)
            .post('/stocks')
            .send({
                symbol: 'AAPL',
                purchase_price: 150.50,
                shares: 10
            })
            .set('Content-Type', 'application/json');

        stockId = response.body.id;
    });

    describe('GET /stock-value/:id', () => {
        it('should return current value of a stock', async () => {
            const response = await request(app).get(`/stock-value/${stockId}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('symbol', 'AAPL');
            expect(response.body).toHaveProperty('ticker');
            expect(response.body).toHaveProperty('stock_value');

            const stockValue = response.body as StockValue;
            expect(typeof stockValue.ticker).toBe('number');
            expect(typeof stockValue.stock_value).toBe('number');
            // Stock value should be ticker price * shares
            expect(stockValue.stock_value).toBe(stockValue.ticker * 10);
        });

        it('should handle non-existent stock ID', async () => {
            const response = await request(app).get('/stock-value/nonexistent-id');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Not found' });
        });
    });

    describe('GET /portfolio-value', () => {
        it('should return total portfolio value', async () => {
            const response = await request(app).get('/portfolio-value');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('date');
            expect(response.body).toHaveProperty('portfolio_value');

            const portfolioValue = response.body as PortfolioValue;
            expect(typeof portfolioValue.portfolio_value).toBe('number');
            // Date should be in DD-MM-YYYY format
            expect(portfolioValue.date).toMatch(/^\d{2}-\d{2}-\d{4}$/);
        });
    });
});