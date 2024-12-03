import request from 'supertest';
import app from '../app';
import { Stock } from '../models/interfaces';

describe('Stock Portfolio API Tests', () => {
    let stockId: string;

    const sampleStock = {
        symbol: 'AAPL',
        purchase_price: 150.50,
        shares: 10
    };

    describe('POST /stocks', () => {
        it('should create a new stock with required fields only', async () => {
            const response = await request(app)
                .post('/stocks')
                .send(sampleStock)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            stockId = response.body.id;
        });

        it('should handle missing required fields', async () => {
            const response = await request(app)
                .post('/stocks')
                .send({ symbol: 'AAPL' })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Malformed data' });
        });

        it('should handle wrong content type', async () => {
            const response = await request(app)
                .post('/stocks')
                .send(sampleStock)
                .set('Content-Type', 'text/plain');

            expect(response.status).toBe(415);
            expect(response.body).toEqual({ error: 'Expected application/json media type' });
        });

        it('should convert lowercase symbol to uppercase', async () => {
            const response = await request(app)
                .post('/stocks')
                .send({ ...sampleStock, symbol: 'msft' })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(201);
            const getResponse = await request(app).get(`/stock/${response.body.id}`);
            expect(getResponse.body.symbol).toBe('MSFT');
        });
    });

    describe('GET /stocks', () => {
        it('should return all stocks', async () => {
            const response = await request(app).get('/stocks');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should filter stocks by query parameters', async () => {
            const response = await request(app).get('/stocks?symbol=AAPL');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((stock: Stock) => {
                expect(stock.symbol).toBe('AAPL');
            });
        });
    });

    describe('GET /stock/:id', () => {
        it('should return a specific stock', async () => {
            const response = await request(app).get(`/stock/${stockId}`);
            expect(response.status).toBe(200);
            expect(response.body.symbol).toBe(sampleStock.symbol);
        });

        it('should handle non-existent stock ID', async () => {
            const response = await request(app).get('/stock/nonexistent-id');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Not found' });
        });
    });

    describe('PUT /stock/:id', () => {
        const updatedStock = {
            symbol: 'AAPL',
            purchase_price: 160.75,
            shares: 15
        };

        it('should update an existing stock', async () => {
            const response = await request(app)
                .put(`/stock/${stockId}`)
                .send(updatedStock)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
        });

        it('should handle non-existent stock ID', async () => {
            const response = await request(app)
                .put('/stock/nonexistent-id')
                .send(updatedStock)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Not found' });
        });
    });

    describe('DELETE /stock/:id', () => {
        it('should delete an existing stock', async () => {
            const response = await request(app).delete(`/stock/${stockId}`);
            expect(response.status).toBe(204);
        });

        it('should handle non-existent stock ID', async () => {
            const response = await request(app).delete('/stock/nonexistent-id');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Not found' });
        });
    });
});