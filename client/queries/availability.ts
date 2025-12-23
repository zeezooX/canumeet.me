import { cookies } from 'next/headers';

import 'server-only';

import { getApiUrl, getList } from '@/lib';
import type { GetAvailability } from '@/types';

/**
 * Get availability details
 * @param meetingPublicId Public ID of the meeting (not used in endpoint but kept for consistency)
 * @param privateId Private ID of the availability
 * @return Availability details
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
 * Get stored availability IDs from cookies
 * @return Array of availability IDs
 */
export async function getUserAvailabilityIds(): Promise<string[]> {
  return getList<string>('availabilityIds', await cookies());
}
