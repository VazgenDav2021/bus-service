import { z } from 'zod';
export const createBusOwnerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
});
export const createStudentSchema = z.object({
    name: z.string().min(1),
    email: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().email().optional()),
    isActive: z.preprocess((value) => {
        if (value === undefined || value === null || value === '') {
            return true;
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return value;
    }, z.boolean()),
});
export const updateStudentSchema = z.object({
    name: z.string().min(1),
    email: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().email().optional()),
    isActive: z.preprocess((value) => {
        if (value === undefined || value === null || value === '') {
            return true;
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return value;
    }, z.boolean()),
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
export const studentListQuerySchema = paginatedListQuerySchema.extend({
    isActive: z
        .enum(['all', 'true', 'false'])
        .optional()
        .transform((value) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return undefined;
    }),
});
