import type { Response } from 'express';
import type { ErrorCode } from '../constants/errorCodes.js';

export function sendError(
  res: Response,
  statusCode: number,
  error: string,
  code: ErrorCode
) {
  return res.status(statusCode).json({ error, code });
}
