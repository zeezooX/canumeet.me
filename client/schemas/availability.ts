import { z } from 'zod';

import type { CreateAvailability, CreateRange } from '@/types';

export const createRangeSchema: z.ZodType<CreateRange> = z
  .object({
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'startTime must be before endTime',
  });

export const createAvailabilitySchema: z.ZodType<CreateAvailability> = z.object({
  owner: z.string().min(1, { message: 'Owner is required' }),
  message: z.string().optional(),
  ranges: z.array(createRangeSchema),
});
