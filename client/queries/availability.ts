import 'server-only';

import { getApiUrl } from '@/lib';
import type { GetAvailability } from '@/types';

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
