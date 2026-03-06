import { Request, Response, NextFunction } from 'express';
import type { JwtPayload, Role } from '../types/auth.js';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  // TEMP BYPASS: auth checking disabled for now.
  // Re-enable by removing this block and uncommenting original logic below.
  const headerUserId = req.headers['x-dev-user-id'];
  const headerRole = req.headers['x-dev-role'];
  const devUserId =
    typeof headerUserId === 'string' && headerUserId.trim().length > 0
      ? headerUserId
      : 'dev-user-id';
  const devRole =
    headerRole === 'ADMIN' ||
    headerRole === 'DRIVER' ||
    headerRole === 'BUS_OWNER' ||
    headerRole === 'STUDENT'
      ? headerRole
      : 'ADMIN';
  req.user = { sub: devUserId, role: devRole };
  next();
  return;

  /*
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAMES.accessToken] as string | undefined;
  const token = bearerToken ?? cookieToken;

  if (!token) {
    throw new AppError(
      401,
      ERROR_MESSAGES.missingOrInvalidAuthorization,
      ERROR_CODES.unauthorized
    );
  }
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    throw new AppError(401, ERROR_MESSAGES.invalidOrExpiredToken, ERROR_CODES.unauthorized);
  }
  */
}

export function requireRole(..._roles: Role[]) {
  return (_req: AuthRequest, _res: Response, next: NextFunction): void => {
    // TEMP BYPASS: role checking disabled for now.
    // Re-enable by removing this block and uncommenting original logic below.
    next();
    return;

    /*
    if (!req.user) {
      throw new AppError(
        401,
        ERROR_MESSAGES.authenticationRequired,
        ERROR_CODES.unauthorized
      );
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, ERROR_MESSAGES.insufficientPermissions, ERROR_CODES.forbidden);
    }
    next();
    */
  };
}
