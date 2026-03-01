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

export type CreateBusInput = z.infer<typeof createBusSchema>;
export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
