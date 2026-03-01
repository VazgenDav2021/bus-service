import { z } from 'zod';

export const createBusOwnerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

export const createStudentSchema = z.object({
  studentId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().optional(),
});

export type CreateBusOwnerInput = z.infer<typeof createBusOwnerSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
