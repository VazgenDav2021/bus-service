import { Request, Response, NextFunction } from 'express';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import type { ErrorCode } from '../constants/errorCodes.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: ErrorCode
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
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
