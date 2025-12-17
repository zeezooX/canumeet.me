'use server';

import { api } from '@/lib';
import type { CreateMeeting, GetIds } from '@/types';

/**
 * Create a new meeting
 * @param data Meeting creation data
 */
export async function createMeeting(data: CreateMeeting): Promise<GetIds> {
  const response = await api.post<GetIds>('/meeting/create', data);
  return response.data;
}
