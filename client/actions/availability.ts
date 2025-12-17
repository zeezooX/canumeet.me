'use server';

import { updateTag } from 'next/cache';

import { api } from '@/lib';
import type { CreateAvailability, GetAvailability } from '@/types';

/**
 * Create availability for a meeting
 * @param meetingPublicId Public ID of the meeting
 * @param data Availability data
 */
export async function createAvailability(
  meetingPublicId: string,
  data: CreateAvailability
): Promise<GetAvailability> {
  const response = await api.post<GetAvailability>(`/meeting/${meetingPublicId}/available`, data);
  updateTag(`admin-${meetingPublicId}`);
  return response.data;
}

/**
 * Modify availability
 * @param meetingPublicId Public ID of the meeting
 * @param privateId Private ID of the availability
 * @param data Availability data
 */
export async function modifyAvailability(
  meetingPublicId: string,
  privateId: string,
  data: CreateAvailability
): Promise<GetAvailability> {
  const response = await api.post<GetAvailability>(
    `/meeting/${meetingPublicId}/available/${privateId}`,
    data
  );
  updateTag(`availability-${privateId}`);
  updateTag(`admin-${meetingPublicId}`);
  return response.data;
}
