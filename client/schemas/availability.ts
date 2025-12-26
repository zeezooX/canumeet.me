import { z } from 'zod';

export const createRangeSchema = z
  .object({
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'startTime must be before endTime',
  });

export const createAvailabilitySchema = z.object({
  owner: z.string().min(1, { message: 'Owner is required' }),
  message: z.string().optional(),
  ranges: z.array(createRangeSchema),
});

export type CreateRangeSchemaFormValues = z.infer<typeof createRangeSchema>;
export type CreateAvailabilityFormValues = z.infer<typeof createAvailabilitySchema>;
