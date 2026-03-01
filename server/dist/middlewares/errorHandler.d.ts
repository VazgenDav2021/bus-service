import { Request, Response, NextFunction } from 'express';
import type { ErrorCode } from '../constants/errorCodes.js';
export declare class AppError extends Error {
    statusCode: number;
    code: ErrorCode;
    constructor(statusCode: number, message: string, code: ErrorCode);
}
export declare function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map