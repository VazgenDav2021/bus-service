import { z } from 'zod';
export declare const scanSchema: z.ZodObject<{
    qrToken: z.ZodString;
    direction: z.ZodEnum<["TO", "FROM"]>;
}, "strip", z.ZodTypeAny, {
    direction: "TO" | "FROM";
    qrToken: string;
}, {
    direction: "TO" | "FROM";
    qrToken: string;
}>;
export type ScanInput = z.infer<typeof scanSchema>;
//# sourceMappingURL=scanValidation.d.ts.map