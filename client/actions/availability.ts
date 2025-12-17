'use server';

import { updateTag } from 'next/cache';

import { api, getApiUrl } from '@/lib';
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
 * Get availability details
 * @param meetingPublicId Public ID of the meeting (not used in endpoint but kept for consistency)
 * @param privateId Private ID of the availability
 */
export async function getAvailability(
  meetingPublicId: string,
  privateId: string
): Promise<GetAvailability> {
  const url = getApiUrl(`/meeting/${meetingPublicId}/available/${privateId}`);
  const response = await fetch(url, {
    method: 'GET',
    next: { tags: [`availability-${privateId}`] },
  });

  if (!response.ok) {
    throw new Error(`Failed to get availability: ${response.statusText}`);
  }

  return response.json();
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
