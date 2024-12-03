import request from 'supertest';
import app from '../app';

describe('Error Handling Tests', () => {
    describe('API Error Responses', () => {
        it('should handle malformed JSON data', async () => {
            const response = await request(app)
                .post('/stocks')
                .set('Content-Type', 'application/json')
                .send('{"invalid": JSON}');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should handle invalid share count', async () => {
            const response = await request(app)
                .post('/stocks')
                .send({
                    symbol: 'AAPL',
                    purchase_price: 150.50,
                    shares: 0  // Invalid share count
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Malformed data' });
        });

        it('should handle invalid purchase price', async () => {
            const response = await request(app)
                .post('/stocks')
                .send({
                    symbol: 'AAPL',
                    purchase_price: -150.50,  // Invalid price
                    shares: 10
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Malformed data' });
        });

        it('should handle invalid date format', async () => {
            const response = await request(app)
                .post('/stocks')
                .send({
                    symbol: 'AAPL',
                    purchase_price: 150.50,
                    shares: 10,
                    purchase_date: '2023/12/25'  // Wrong format
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Malformed data' });
        });
    });

    describe('API External Service Errors', () => {
        it('should handle external API errors gracefully', async () => {
            // Create a stock with invalid symbol
            const createResponse = await request(app)
                .post('/stocks')
                .send({
                    symbol: 'INVALID',
                    purchase_price: 150.50,
                    shares: 10
                })
                .set('Content-Type', 'application/json');

            const stockId = createResponse.body.id;

            // Try to get value for invalid symbol
            const response = await request(app).get(`/stock-value/${stockId}`);
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('server_error');
        });
    });
});