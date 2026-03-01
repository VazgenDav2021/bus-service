export const AUTH_COOKIE_NAMES = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

export const AUTH_TOKEN_TYPE = {
  refresh: 'refresh',
} as const;

export const AUTH_TOKEN_TTL_SECONDS = {
  access: 15 * 60,
  refresh: 7 * 24 * 60 * 60,
} as const;

export const AUTH_REFRESH_COOKIE_MAX_AGE_MS =
  AUTH_TOKEN_TTL_SECONDS.refresh * 1000;
