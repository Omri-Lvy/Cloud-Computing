import {Response} from 'express';

export const sendMalformedError = (res: Response): Response =>
    res.status(400).json({ error: 'Malformed data' });

export const sendNotFoundError = (res: Response): Response =>
    res.status(404).json({ error: 'Not found' });

export const sendMediaTypeError = (res: Response): Response =>
    res.status(415).json({ error: 'Expected application/json media type' });

export const sendServerError = (res: Response, error: Error): Response =>
    res.status(500).json({ server_error: error.message });
