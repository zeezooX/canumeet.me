'use server';

import { updateTag } from 'next/cache';

import { api } from '@/lib';
import type { CreateResponse } from '@/types';

/**
 * Send excuse for a meeting
 * @param publicId Public ID of the meeting
 * @param data Response data
 */
export async function sendExcuse(publicId: string, data: CreateResponse): Promise<void> {
  await api.post(`/meeting/${publicId}/excuse`, data);
  updateTag(`admin-${publicId}`);
}

/**
 * Send comment for a meeting
 * @param meetingId Meeting ID (public if normal comment or private if admin comment)
 * @param data Response data
 */
export async function sendComment(meetingId: string, data: CreateResponse): Promise<void> {
  await api.post(`/meeting/${meetingId}/comment`, data);
  updateTag(`meeting-${meetingId}`);
}

/**
 * Send reply to a comment
 * @param meetingId Meeting ID (public if normal comment or private if admin comment)
 * @param parentId Parent comment ID to reply to
 * @param data Response data
 */
export async function sendReply(
  meetingId: string,
  parentId: number,
  data: CreateResponse
): Promise<void> {
  await api.post(`/meeting/${meetingId}/comment/${parentId}`, data);
  updateTag(`meeting-${meetingId}`);
}

/**
 * Send an update about a meeting
 * @param privateId Private ID of the meeting
 * @param data Response data
 */
export async function sendUpdate(privateId: string, data: CreateResponse): Promise<void> {
  await api.post(`/meeting/${privateId}/update`, data);
  updateTag(`meeting-${privateId.slice(0, 6)}`);
}
