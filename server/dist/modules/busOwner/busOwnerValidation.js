import { z } from 'zod';
export const createBusSchema = z.object({
    plateNumber: z.string().min(1),
    capacity: z.number().int().positive(),
});
export const createDriverSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
});
export const createAssignmentSchema = z.object({
    driverId: z.string().min(1),
    busId: z.string().min(1),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
});
export const paginatedListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    search: z
        .string()
        .trim()
        .optional()
        .transform((value) => (value && value.length > 0 ? value : undefined)),
});
