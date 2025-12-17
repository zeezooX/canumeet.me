'use server';

import { updateTag } from 'next/cache';

import { api } from '@/lib';
import type { UpdateMeeting } from '@/types';

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
