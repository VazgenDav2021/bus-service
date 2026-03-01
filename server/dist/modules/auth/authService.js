import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { config } from '../../config.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { AUTH_TOKEN_TTL_SECONDS, AUTH_TOKEN_TYPE } from '../../constants/auth.js';
import { ERROR_CODES } from '../../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
async function findUserByEmailAndRole(email, role) {
    switch (role) {
        case 'ADMIN':
            return prisma.admin.findUnique({ where: { email } });
        case 'DRIVER':
            return prisma.driver.findUnique({ where: { email } });
        case 'BUS_OWNER':
            return prisma.busOwner.findUnique({ where: { email } });
        default:
            return null;
    }
}
export async function login(input) {
    const user = await findUserByEmailAndRole(input.email, input.role);
    if (!user || !('password' in user)) {
        throw new AppError(401, ERROR_MESSAGES.invalidCredentials, ERROR_CODES.invalidCredentials);
    }
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
        throw new AppError(401, ERROR_MESSAGES.invalidCredentials, ERROR_CODES.invalidCredentials);
    }
    const payload = {
        sub: user.id,
        role: input.role,
    };
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, { expiresIn: AUTH_TOKEN_TTL_SECONDS.access });
    const refreshToken = jwt.sign({ ...payload, type: AUTH_TOKEN_TYPE.refresh }, config.jwt.refreshSecret, { expiresIn: AUTH_TOKEN_TTL_SECONDS.refresh });
    const decoded = jwt.decode(accessToken);
    const expiresAt = decoded?.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : new Date(Date.now() + AUTH_TOKEN_TTL_SECONDS.access * 1000).toISOString();
    return {
        accessToken,
        refreshToken,
        expiresAt,
    };
}
export async function refreshTokens(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
        if (decoded.type !== AUTH_TOKEN_TYPE.refresh) {
            throw new Error('Invalid token');
        }
        const payload = { sub: decoded.sub, role: decoded.role };
        const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
            expiresIn: AUTH_TOKEN_TTL_SECONDS.access,
        });
        const newRefreshToken = jwt.sign({ ...payload, type: AUTH_TOKEN_TYPE.refresh }, config.jwt.refreshSecret, { expiresIn: AUTH_TOKEN_TTL_SECONDS.refresh });
        const accessDecoded = jwt.decode(accessToken);
        const expiresAt = accessDecoded?.exp
            ? new Date(accessDecoded.exp * 1000).toISOString()
            : new Date(Date.now() + AUTH_TOKEN_TTL_SECONDS.access * 1000).toISOString();
        return {
            accessToken,
            refreshToken: newRefreshToken,
            expiresAt,
        };
    }
    catch {
        throw new AppError(401, ERROR_MESSAGES.invalidRefreshToken, ERROR_CODES.invalidRefreshToken);
    }
}
