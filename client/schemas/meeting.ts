import { z } from 'zod';

import type { CreateMeeting, UpdateMeeting } from '@/types';

export const createMeetingSchema: z.ZodType<CreateMeeting> = z.object({
  availabilityEnabled: z.boolean().optional(),
  availabilityDeadline: z.iso.datetime().optional(),
  commentsEnabled: z.boolean().optional(),
  updatesEnabled: z.boolean().optional(),
  excusesEnabled: z.boolean().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  owner: z.string(),
  date: z.iso.datetime().optional(),
  durationMins: z.number().int().positive().optional(),
  availabilityStart: z.iso.datetime().optional(),
  availabilityEnd: z.iso.datetime().optional(),
});

export const updateMeetingSchema: z.ZodType<UpdateMeeting> = z.object({
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
