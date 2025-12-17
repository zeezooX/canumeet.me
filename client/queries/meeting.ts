import 'server-only';

import { getApiUrl } from '@/lib';
import type { GetMeeting } from '@/types';

/**
 * Get meeting details by public ID(s)
 * @param publicIds Array of public IDs
 */
export async function getMeetings(publicIds: string[]): Promise<GetMeeting[]> {
  const params = new URLSearchParams();
  for (const id of publicIds) {
    params.append('publicId', id);
  }

  const url = getApiUrl(`/meeting?${params.toString()}`);
  const tags = publicIds.map((id) => `meeting-${id}`);
  const response = await fetch(url, {
    method: 'GET',
    next: { tags },
  });

  if (!response.ok) {
    throw new Error(`Failed to get meetings: ${response.statusText}`);
  }

  return response.json();
}
