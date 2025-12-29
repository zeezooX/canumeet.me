import { z } from 'zod';

export const createResponseSchema = z.object({
  owner: z.string().trim().min(1, 'Name is required'),
  message: z.string().trim().min(1, 'Message is required'),
});

export type CreateResponseFormValues = z.infer<typeof createResponseSchema>;
