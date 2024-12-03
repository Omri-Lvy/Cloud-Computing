import './config';
import express from 'express';
import stockRoutes from "./routes/stock.routes";
import {ensureJsonContent, validateStockData} from "./middleware";

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(ensureJsonContent);
app.use('/', validateStockData, stockRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ server_error: err.message });
});

app.listen(port as number, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

export default app;