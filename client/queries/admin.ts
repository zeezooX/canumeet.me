import { cookies } from 'next/headers';

import 'server-only';

import { getApiUrl, getList } from '@/lib';
import type { GetResponses } from '@/types';

/**
 * Get meeting responses (admin view)
 * @param privateId Private ID of the meeting
 * @return Meeting responses
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

/**
 * Get stored private meeting IDs from cookies
 * @return Array of private meeting IDs
 */
export async function getUserPrivateMeetingIds(): Promise<string[]> {
  return getList<string>('privateMeetingIds', await cookies());
}
