import { z } from 'zod';

export const createRangeSchema = z
  .object({
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'Start time must be before end time',
  });

export const createAvailabilitySchema = z.object({
  owner: z.string().min(1, { message: 'Owner name is required' }),
  message: z.string().optional(),
  ranges: z.array(createRangeSchema),
});

export type CreateRangeSchemaFormValues = z.infer<typeof createRangeSchema>;
export type CreateAvailabilityFormValues = z.infer<typeof createAvailabilitySchema>;
