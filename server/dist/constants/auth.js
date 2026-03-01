export const AUTH_COOKIE_NAMES = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
};
export const AUTH_TOKEN_TYPE = {
    refresh: 'refresh',
};
export const AUTH_TOKEN_TTL_SECONDS = {
    access: 15 * 60,
    refresh: 7 * 24 * 60 * 60,
};
export const AUTH_REFRESH_COOKIE_MAX_AGE_MS = AUTH_TOKEN_TTL_SECONDS.refresh * 1000;
