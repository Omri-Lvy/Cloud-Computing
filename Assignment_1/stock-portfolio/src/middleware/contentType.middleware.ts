import {NextFunction, Response, Request} from "express";
import {sendMediaTypeError} from "../utils/errors.utils";

export const ensureJsonContent = (req: Request, res: Response, next: NextFunction):void => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.startsWith('application/json')) {
            sendMediaTypeError(res);
        }
    }
    next();
};
