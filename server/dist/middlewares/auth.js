import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { AppError } from './errorHandler.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import { AUTH_COOKIE_NAMES } from '../constants/auth.js';
export async function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;
    const cookieToken = req.cookies?.[AUTH_COOKIE_NAMES.accessToken];
    const token = bearerToken ?? cookieToken;
    if (!token) {
        throw new AppError(401, ERROR_MESSAGES.missingOrInvalidAuthorization, ERROR_CODES.unauthorized);
    }
    try {
        const payload = jwt.verify(token, config.jwt.accessSecret);
        req.user = payload;
        next();
    }
    catch {
        throw new AppError(401, ERROR_MESSAGES.invalidOrExpiredToken, ERROR_CODES.unauthorized);
    }
}
export function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw new AppError(401, ERROR_MESSAGES.authenticationRequired, ERROR_CODES.unauthorized);
        }
        if (!roles.includes(req.user.role)) {
            throw new AppError(403, ERROR_MESSAGES.insufficientPermissions, ERROR_CODES.forbidden);
        }
        next();
    };
}
