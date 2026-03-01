import { z } from 'zod';
export declare const startShiftSchema: z.ZodObject<{
    busId: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    busId: string;
    startTime: string;
    endTime: string;
}, {
    busId: string;
    startTime: string;
    endTime: string;
}>;
export type StartShiftInput = z.infer<typeof startShiftSchema>;
//# sourceMappingURL=shiftValidation.d.ts.map