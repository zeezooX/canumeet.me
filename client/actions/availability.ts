'use server';

import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { addToList, api } from '@/lib';
import type { CreateAvailability, GetAvailability, GetIds } from '@/types';

/**
 * Create availability for a meeting
 * @param meetingPublicId Public ID of the meeting
 * @param data Availability data
 * @returns Created availability IDs
 */
export async function createAvailability(
  meetingPublicId: string,
  data: CreateAvailability
): Promise<GetIds> {
  const response = await api.post<GetAvailability>(`/meeting/${meetingPublicId}/available`, data);
  updateTag(`admin-${meetingPublicId}`);
  addToList('availabilityIds', `${meetingPublicId}|${response.data.privateId}`, await cookies());
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
): Promise<void> {
  await api.post<GetAvailability>(`/meeting/${meetingPublicId}/available/${privateId}`, data);
  updateTag(`availability-${privateId}`);
  updateTag(`admin-${meetingPublicId}`);
  addToList('availabilityIds', `${meetingPublicId}|${privateId}`, await cookies());
}
