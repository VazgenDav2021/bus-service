import { Router } from 'express';
import * as authService from '../modules/auth/authService.js';
import { loginSchema, refreshSchema } from '../modules/auth/authValidation.js';
import { clearAuthCookies, setAuthCookies } from '../utils/authCookies.js';
import { parseOrThrow } from '../utils/validation.js';
import { sendError } from '../utils/response.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import { AUTH_COOKIE_NAMES } from '../constants/auth.js';
import { asyncHandler } from '../shared/http/asyncHandler.js';

export const authRouter = Router();

authRouter.post('/login', asyncHandler(async (req, res) => {
  const parsed = parseOrThrow(loginSchema, req.body);
  const tokens = await authService.login(parsed);
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken, tokens.expiresAt);
  res.json({ expiresAt: tokens.expiresAt, role: parsed.role });
}));

authRouter.post('/refresh', asyncHandler(async (req, res) => {
  const parsed = parseOrThrow(refreshSchema, req.body);
  const refreshToken = parsed.refreshToken ?? req.cookies?.[AUTH_COOKIE_NAMES.refreshToken];
  if (!refreshToken) {
    sendError(
      res,
      401,
      ERROR_MESSAGES.missingRefreshToken,
      ERROR_CODES.invalidRefreshToken
    );
    return;
  }
  const tokens = await authService.refreshTokens(refreshToken);
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken, tokens.expiresAt);
  res.json({ expiresAt: tokens.expiresAt });
}));

authRouter.post('/logout', (_req, res) => {
  clearAuthCookies(res);
  res.json({ success: true });
});
