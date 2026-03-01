import { z } from 'zod';
import { APP_AUTH_ROLES } from '../../types/auth.js';

export const loginSchema = z.object({
  email: z.string().email('Էլ. փոստը անվավեր է'),
  password: z.string().min(1, 'Գաղտնաբառը պարտադիր է'),
  role: z.enum(APP_AUTH_ROLES),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token-ը պարտադիր է').optional(),
  role: z.enum(APP_AUTH_ROLES).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
