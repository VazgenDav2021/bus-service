export declare const AUTH_ROLES: readonly ["ADMIN", "DRIVER", "BUS_OWNER", "STUDENT"];
export declare const APP_AUTH_ROLES: readonly ["ADMIN", "DRIVER", "BUS_OWNER"];
export type Role = (typeof AUTH_ROLES)[number];
export type AppRole = (typeof APP_AUTH_ROLES)[number];
export interface JwtPayload {
    sub: string;
    role: Role;
    iat?: number;
    exp?: number;
}
export interface RefreshTokenPayload extends JwtPayload {
    type: string;
}
//# sourceMappingURL=auth.d.ts.map