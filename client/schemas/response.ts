import { z } from 'zod';

import type { CreateResponse } from '@/types';

export const createResponseSchema: z.ZodType<CreateResponse> = z.object({
  owner: z.string().min(1, 'Owner is required'),
  message: z.string().min(1, 'Message is required'),
});
