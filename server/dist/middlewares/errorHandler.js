import { ERROR_CODES } from '../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
export class AppError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
    }
}
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
        });
        return;
    }
    if (err instanceof Error) {
        console.error(err);
        res.status(500).json({
            error: ERROR_MESSAGES.internalServerError,
            code: ERROR_CODES.internalError,
        });
        return;
    }
    res.status(500).json({
        error: ERROR_MESSAGES.unknownError,
        code: ERROR_CODES.unknownError,
    });
}
