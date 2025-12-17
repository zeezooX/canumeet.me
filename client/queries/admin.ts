import 'server-only';

import { getApiUrl } from '@/lib';
import type { GetResponses } from '@/types';

/**
 * Get meeting responses (admin view)
 * @param privateId Private ID of the meeting
 */
export async function getResponses(privateId: string): Promise<GetResponses> {
  const url = getApiUrl(`/meeting/${privateId}/admin`);
  const response = await fetch(url, {
    method: 'GET',
    next: {
      tags: [`meeting-${privateId.slice(0, 6)}`, `admin-${privateId.slice(0, 6)}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get responses: ${response.statusText}`);
  }

  return response.json();
}
