import { GetAvailability, GetComment } from '.';

export interface GetExcuse {
  excuseId: number;
  meetingId: string;
  owner: string;
  message: string;
  createdAt: string;
}

export interface GetResponses {
  meetingId: string;
  publicId: string;
  privateId: string;
  name?: string;
  owner: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  date?: string;
  durationMins?: number;
  availabilityEnabled: boolean;
  availabilityDeadline?: string;
  commentsEnabled: boolean;
  updatesEnabled: boolean;
  excusesEnabled: boolean;
  availabilityStart?: string;
  availabilityEnd?: string;
  userId?: number;
  availabilities: GetAvailability[];
  excuses: GetExcuse[];
  comments: GetComment[];
}

export interface CreateResponse {
  owner: string;
  message: string;
}
