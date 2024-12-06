import { Router } from 'express';
import {
    createStockController, deleteStockController, getPortfolioValueController,
    getStockController,
    getStocksController, getStockValueController,
    updateStockController
} from "../controllers/stock.controller";

const router = Router();

router.post('/stocks', createStockController);

router.get('/stocks', getStocksController);
router.get('/stocks/:id', getStockController);
router.get('/stock-value/:id', getStockValueController);
router.get('/portfolio-value', getPortfolioValueController);

router.put('/stocks/:id', updateStockController);
router.delete('/stocks/:id', deleteStockController);


export default router;
