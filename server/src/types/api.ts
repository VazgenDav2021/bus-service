import type { ErrorCode } from '../constants/errorCodes.js';

export interface ApiErrorResponse {
  error: string;
  code: ErrorCode;
}
