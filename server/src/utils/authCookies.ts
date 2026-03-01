import type { Response } from 'express';
import { config } from '../config.js';
import {
  AUTH_COOKIE_NAMES,
  AUTH_REFRESH_COOKIE_MAX_AGE_MS,
} from '../constants/auth.js';

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  expiresAt: string
) {
  const accessExpiry = new Date(expiresAt).getTime() - Date.now();
  res.cookie(AUTH_COOKIE_NAMES.accessToken, accessToken, {
    ...baseCookieOptions(),
    maxAge: Math.max(accessExpiry, 60_000),
  });
  res.cookie(AUTH_COOKIE_NAMES.refreshToken, refreshToken, {
    ...baseCookieOptions(),
    maxAge: AUTH_REFRESH_COOKIE_MAX_AGE_MS,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAMES.accessToken, { path: '/' });
  res.clearCookie(AUTH_COOKIE_NAMES.refreshToken, { path: '/' });
}
