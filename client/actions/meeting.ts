'use server';

import { api, getApiUrl } from '@/lib';
import type { CreateMeeting, GetIds, GetMeeting } from '@/types';

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

/**
 * Create a new meeting
 * @param data Meeting creation data
 */
export async function createMeeting(data: CreateMeeting): Promise<GetIds> {
  const response = await api.post<GetIds>('/meeting/create', data);
  return response.data;
}
