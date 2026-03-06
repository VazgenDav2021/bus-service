import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { error: ERROR_MESSAGES.tooManyRequests, code: ERROR_CODES.rateLimitExceeded },
  standardHeaders: true,
  legacyHeaders: false,
});
