import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["ADMIN", "DRIVER", "BUS_OWNER"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role: "ADMIN" | "DRIVER" | "BUS_OWNER";
}, {
    email: string;
    password: string;
    role: "ADMIN" | "DRIVER" | "BUS_OWNER";
}>;
export declare const refreshSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["ADMIN", "DRIVER", "BUS_OWNER"]>>;
}, "strip", z.ZodTypeAny, {
    refreshToken?: string | undefined;
    role?: "ADMIN" | "DRIVER" | "BUS_OWNER" | undefined;
}, {
    refreshToken?: string | undefined;
    role?: "ADMIN" | "DRIVER" | "BUS_OWNER" | undefined;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
//# sourceMappingURL=authValidation.d.ts.map