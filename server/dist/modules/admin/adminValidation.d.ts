import { z } from 'zod';
export declare const createBusOwnerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    name: string;
    phone?: string | undefined;
}>;
export declare const createStudentSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    isActive: z.ZodEffects<z.ZodBoolean, boolean, unknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    email?: string | undefined;
}, {
    name: string;
    email?: unknown;
    isActive?: unknown;
}>;
export declare const updateStudentSchema: z.ZodObject<{
    studentId: z.ZodString;
    name: z.ZodString;
    email: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    isActive: z.ZodEffects<z.ZodBoolean, boolean, unknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    studentId: string;
    email?: string | undefined;
}, {
    name: string;
    studentId: string;
    email?: unknown;
    isActive?: unknown;
}>;
export declare const paginatedListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    search: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    search?: string | undefined;
}, {
    page?: number | undefined;
    pageSize?: number | undefined;
    search?: string | undefined;
}>;
export declare const studentListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    search: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
} & {
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["all", "true", "false"]>>, boolean | undefined, "true" | "all" | "false" | undefined>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    search?: string | undefined;
    isActive?: boolean | undefined;
}, {
    page?: number | undefined;
    pageSize?: number | undefined;
    search?: string | undefined;
    isActive?: "true" | "all" | "false" | undefined;
}>;
export type CreateBusOwnerInput = z.infer<typeof createBusOwnerSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type PaginatedListQueryInput = z.infer<typeof paginatedListQuerySchema>;
export type StudentListQueryInput = z.infer<typeof studentListQuerySchema>;
//# sourceMappingURL=adminValidation.d.ts.map