import 'server-only';

import { addToList, getApiUrl, getList } from '@/lib';
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

  for (const id of publicIds) {
    await addToList('meetingIds', id);
  }

  return response.json();
}

/**
 * Get stored meeting IDs from cookies
 * @return Array of meeting IDs
 */
export async function getMeetingIds(): Promise<string[]> {
  return getList<string>('meetingIds');
}
