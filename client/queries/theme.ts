import { cookies } from 'next/headers';

import 'server-only';

import { getValue } from '@/lib';

/**
 * Get theme preference
 * @returns Theme ('light' | 'dark') or undefined
 */
export async function getTheme(): Promise<'light' | 'dark' | undefined> {
  const theme = getValue<'light' | 'dark'>('theme', await cookies());
  return theme || 'light';
}
