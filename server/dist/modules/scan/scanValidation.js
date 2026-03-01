import { z } from 'zod';
export const scanSchema = z.object({
    qrToken: z.string().min(1, 'QR token required'),
    direction: z.enum(['TO', 'FROM']),
});
