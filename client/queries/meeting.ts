import { cookies } from 'next/headers';

import 'server-only';

import { getApiUrl, getList } from '@/lib';
import type { GetMeeting } from '@/types';

/**
 * Get meetings details by public IDs
 * @param publicIds Array of public IDs
 * @return Array of meeting details
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

/**
 * Get meeting details by public ID
 * @param publicId Public ID of the meeting
 * @return Meeting details
 */
export async function getMeeting(publicId: string): Promise<GetMeeting> {
  const url = getApiUrl(`/meeting?publicId=${publicId}`);
  const response = await fetch(url, {
    method: 'GET',
    next: { tags: [`meeting-${publicId}`] },
  });

  if (!response.ok) {
    throw new Error(`Failed to get meeting: ${response.statusText}`);
  }

  const meetings: GetMeeting[] = await response.json();
  return meetings[0];
}

/**
 * Get stored meeting IDs from cookies
 * @return Array of meeting IDs
 */
export async function getUserMeetingIds(): Promise<string[]> {
  return getList<string>('meetingIds', await cookies());
}
