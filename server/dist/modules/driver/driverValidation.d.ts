import { z } from 'zod';
export declare const studentScanQuerySchema: z.ZodObject<{
    qrToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    qrToken: string;
}, {
    qrToken: string;
}>;
export declare const createBoardingSchema: z.ZodObject<{
    qrToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    qrToken: string;
}, {
    qrToken: string;
}>;
export type StudentScanQueryInput = z.infer<typeof studentScanQuerySchema>;
export type CreateBoardingInput = z.infer<typeof createBoardingSchema>;
//# sourceMappingURL=driverValidation.d.ts.map