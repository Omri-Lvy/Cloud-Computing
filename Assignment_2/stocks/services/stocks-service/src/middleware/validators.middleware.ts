import {NextFunction, Request, Response} from "express";
import {sendMalformedError} from "../utils/errors.utils";
import {isStockDataValid} from "../utils/validation.utils";

export const validateStockData = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const stock = req.body;
        const requiredFields = ['symbol', 'purchase_price', 'shares'];

        const missingFields = requiredFields.filter(field => !(field in stock));
        if (missingFields.length) {
            sendMalformedError(res);
            return;
        }

        if (!isStockDataValid(stock)) {
            sendMalformedError(res);
            return;
        }

        if (stock.symbol) {
            stock.symbol = stock.symbol.toUpperCase();
        }
    }

    next();
};
