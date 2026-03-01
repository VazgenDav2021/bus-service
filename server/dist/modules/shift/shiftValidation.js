import { z } from 'zod';
export const startShiftSchema = z.object({
    busId: z.string().min(1, 'Bus ID required'),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
});
