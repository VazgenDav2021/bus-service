import { Request, Response, NextFunction } from 'express';
import type { JwtPayload, Role } from '../types/auth.js';
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare function authenticate(req: AuthRequest, _res: Response, next: NextFunction): Promise<void>;
export declare function requireRole(...roles: Role[]): (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map