'use server';

import { updateTag } from 'next/cache';

import { api, getApiUrl } from '@/lib';
import type { GetResponses, UpdateMeeting } from '@/types';

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

/**
 * Update meeting (admin)
 * @param privateId Private ID of the meeting
 * @param data Meeting update data
 */
export async function updateMeeting(privateId: string, data: UpdateMeeting): Promise<void> {
  await api.post(`/meeting/${privateId}/admin`, data);
  updateTag(`meeting-${privateId.slice(0, 6)}`);
  updateTag(`admin-${privateId.slice(0, 6)}`);
}

/**
 * Delete meeting (admin)
 * @param privateId Private ID of the meeting
 */
export async function deleteMeeting(privateId: string): Promise<void> {
  await api.post(`/meeting/${privateId}/delete`);
  updateTag(`meeting-${privateId.slice(0, 6)}`);
  updateTag(`admin-${privateId.slice(0, 6)}`);
}
