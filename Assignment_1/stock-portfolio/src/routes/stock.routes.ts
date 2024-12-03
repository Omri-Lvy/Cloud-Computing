import { Router } from 'express';
import {
    createStockController, deleteStockController, getPortfolioValueController,
    getStockController,
    getStocksController, getStockValueController,
    updateStockController
} from "../controllers/stock.controller";

const router = Router();

// Stocks collection routes
router.post('/stocks', createStockController);
router.get('/stocks', getStocksController);

// Single stock routes
router.get('/stocks/:id', getStockController);
router.put('/stocks/:id', updateStockController);
router.delete('/stocks/:id', deleteStockController);

// Stock value routes
router.get('/stock-value/:id', getStockValueController);
router.get('/portfolio-value', getPortfolioValueController);


export default router;