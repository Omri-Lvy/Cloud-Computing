import {NextFunction, Request, Response} from "express";
import {sendMalformedError, sendNotFoundError} from "../utils/errors.utils";
import {
    createStock,
    deleteStock,
    findStockByQuery,
    getStock,
    getStocks,
    updateStock
} from "../services/storage.service";
import {calculatePortfolioValue, calculateStockValue} from "../services/stockApi.service";
import {isStockDataValid, isStockHaveAllFields} from "../utils/validation.utils";

export const createStockController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log(req.body)
        if (!isStockDataValid(req.body)) {
            sendMalformedError(res);
            return;
        }

        const stock = await createStock(req.body);
        res.status(201).json({id: stock.id});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getStocksController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = req.query as Record<string, string>;
        const stocks = Object.keys(query).length === 0 ? await getStocks() : await findStockByQuery(query);
        res.status(200).json(stocks);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getStockController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stock = await getStock(req.params.id);
        if (!stock) {
            sendNotFoundError(res);
            return;
        }
        res.status(200).json(stock);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const updateStockController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!isStockHaveAllFields(req.body)) {
            sendMalformedError(res);
            return;
        }

        if (!isStockDataValid(req.body)) {
            sendMalformedError(res);
            return;
        }

        const stock = await updateStock(req.params.id, req.body);
        if (!stock) {
            sendNotFoundError(res);
            return;
        }
        res.status(200).json(stock);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const deleteStockController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deleted = await deleteStock(req.params.id);
        if (!deleted) {
            sendNotFoundError(res);
            return;
        }
        res.status(204).send('');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getStockValueController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stock = await getStock(req.params.id);
        if (!stock) {
            sendNotFoundError(res);
            return;
        }
        const stockValue = await calculateStockValue(stock);
        res.status(200).json(stockValue);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getPortfolioValueController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stocks = await getStocks();
        const portfolioValue = await calculatePortfolioValue(stocks);
        res.status(200).json(portfolioValue);
    } catch (error) {
        console.error(error);
        next(error);
    }
};