import { z } from 'zod';

export const studentScanQuerySchema = z.object({
  qrToken: z.string().min(1),
});

export const createBoardingSchema = z.object({
  qrToken: z.string().min(1),
});

export type StudentScanQueryInput = z.infer<typeof studentScanQuerySchema>;
export type CreateBoardingInput = z.infer<typeof createBoardingSchema>;
