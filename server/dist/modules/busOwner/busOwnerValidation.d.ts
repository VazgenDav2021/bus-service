import { z } from 'zod';
export declare const createBusSchema: z.ZodObject<{
    plateNumber: z.ZodString;
    capacity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    plateNumber: string;
    capacity: number;
}, {
    plateNumber: string;
    capacity: number;
}>;
export declare const createDriverSchema: z.ZodObject<{
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
export declare const createAssignmentSchema: z.ZodObject<{
    driverId: z.ZodString;
    busId: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    driverId: string;
    busId: string;
    startDate: string;
    endDate: string;
}, {
    driverId: string;
    busId: string;
    startDate: string;
    endDate: string;
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
    search?: string | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
export type CreateBusInput = z.infer<typeof createBusSchema>;
export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type PaginatedListQueryInput = z.infer<typeof paginatedListQuerySchema>;
//# sourceMappingURL=busOwnerValidation.d.ts.map