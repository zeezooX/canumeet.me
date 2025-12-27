import { z } from 'zod';

const meeting = {
  availabilityEnabled: z.boolean().optional(),
  availabilityDeadline: z.iso.datetime().optional(),
  commentsEnabled: z.boolean().optional(),
  updatesEnabled: z.boolean().optional(),
  excusesEnabled: z.boolean().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  owner: z.string().nonempty('Owner name is required'),
  date: z.iso.datetime().optional(),
  durationMins: z
    .int('Duration must be an integer')
    .positive('Duration must be positive')
    .optional(),
  availabilityStart: z.iso.datetime().optional(),
  availabilityEnd: z.iso.datetime().optional(),
};

const availabilityEnd = {
  message: 'Start of availability window must be before end',
  path: ['availabilityEnd'],
};

const availabilityDeadline = {
  message: 'Deadline must be before start of availability window',
  path: ['availabilityDeadline'],
};

export const createMeetingSchema = z
  .object(meeting)
  .refine(
    (data) =>
      !data.availabilityStart ||
      !data.availabilityEnd ||
      data.availabilityStart < data.availabilityEnd,
    availabilityEnd
  )
  .refine(
    (data) =>
      !data.availabilityDeadline ||
      !data.availabilityStart ||
      data.availabilityDeadline < data.availabilityStart,
    availabilityDeadline
  );

export const updateMeetingSchema = z
  .object(meeting)
  .partial()
  .refine(
    (data) =>
      !data.availabilityStart ||
      !data.availabilityEnd ||
      data.availabilityStart < data.availabilityEnd,
    availabilityEnd
  )
  .refine(
    (data) =>
      !data.availabilityDeadline ||
      !data.availabilityStart ||
      data.availabilityDeadline < data.availabilityStart,
    availabilityDeadline
  );

export type CreateMeetingFormValues = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingFormValues = z.infer<typeof updateMeetingSchema>;
