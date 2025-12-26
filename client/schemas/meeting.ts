import { z } from 'zod';

export const createMeetingSchema = z
  .object({
    availabilityEnabled: z.boolean().optional(),
    availabilityDeadline: z.iso.datetime().optional(),
    commentsEnabled: z.boolean().optional(),
    updatesEnabled: z.boolean().optional(),
    excusesEnabled: z.boolean().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    owner: z.string().nonempty('Owner name is required'),
    date: z.iso.datetime().optional(),
    durationMins: z.int('Duration must be an integer').positive('Duration must be positive'),
    availabilityStart: z.iso.datetime().optional(),
    availabilityEnd: z.iso.datetime().optional(),
  })
  .refine(
    (data) =>
      !data.availabilityStart ||
      !data.availabilityEnd ||
      data.availabilityStart < data.availabilityEnd,
    {
      message: 'Start of availability must be before end',
      path: ['availabilityEnd'],
    }
  )
  .refine(
    (data) =>
      !data.availabilityDeadline ||
      !data.availabilityStart ||
      data.availabilityDeadline < data.availabilityStart,
    {
      message: 'Availability deadline must be before start',
      path: ['availabilityDeadline'],
    }
  );

export const updateMeetingSchema = z.object({
  availabilityEnabled: z.boolean().optional(),
  availabilityDeadline: z.iso.datetime().optional(),
  commentsEnabled: z.boolean().optional(),
  updatesEnabled: z.boolean().optional(),
  excusesEnabled: z.boolean().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  owner: z.string().optional(),
  date: z.iso.datetime().optional(),
  durationMins: z.number().int().positive().optional(),
  availabilityStart: z.iso.datetime().optional(),
  availabilityEnd: z.iso.datetime().optional(),
});

export type CreateMeetingFormValues = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingFormValues = z.infer<typeof updateMeetingSchema>;
