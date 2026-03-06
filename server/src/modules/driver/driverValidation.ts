import { z } from 'zod';

export const studentScanQuerySchema = z.object({
  qrToken: z.string().min(1),
});

export const createBoardingSchema = z.object({
  qrToken: z.string().min(1),
});
