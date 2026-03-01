import type { Response } from 'express';
import type { ErrorCode } from '../constants/errorCodes.js';
export declare function sendError(res: Response, statusCode: number, error: string, code: ErrorCode): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map