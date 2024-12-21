import './config';
import express from 'express';
import stockRoutes from "./routes/stock.routes";
import { ensureJsonContent, validateStockData } from "./middleware";
import { connectToDatabase, closeDatabaseConnection } from './config/database';

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(ensureJsonContent);
app.use('/', validateStockData, stockRoutes);

// Health check endpoint
app.get('/health', (_, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Kill endpoint for testing container restart
app.get('/kill', (_, res) => {
    res.status(200).send('Shutting down...');
    closeDatabaseConnection().finally(() => {
        process.exit(1);
    });
});

app.use((err: Error, req: express.Request, res: express.Response) => {
    console.error(err.stack);
    res.status(500).json({ server_error: err.message });
});

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(port as number, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await closeDatabaseConnection();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    await closeDatabaseConnection();
    process.exit(0);
});

startServer();

export default app;
