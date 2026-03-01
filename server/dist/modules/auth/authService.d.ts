import type { AppRole } from '../../types/auth.js';
export interface LoginInput {
    email: string;
    password: string;
    role: AppRole;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}
export declare function login(input: LoginInput): Promise<TokenPair>;
export declare function refreshTokens(refreshToken: string): Promise<TokenPair>;
//# sourceMappingURL=authService.d.ts.map