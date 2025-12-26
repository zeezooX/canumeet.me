import { z } from 'zod';

export const createResponseSchema = z.object({
  owner: z.string().min(1, 'Owner name is required'),
  message: z.string().min(1, 'Message is required'),
});

export type CreateResponseFormValues = z.infer<typeof createResponseSchema>;
