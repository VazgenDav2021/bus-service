export const AUTH_ROLES = ['ADMIN', 'DRIVER', 'BUS_OWNER', 'STUDENT'] as const;
export const APP_AUTH_ROLES = ['ADMIN', 'DRIVER', 'BUS_OWNER'] as const;

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
