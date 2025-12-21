import 'server-only';

import { getValue } from '@/lib';

/**
 * Get theme preference
 * @returns Theme ('light' | 'dark') or undefined
 */
export async function getTheme(): Promise<'light' | 'dark' | undefined> {
  const theme = await getValue<'light' | 'dark'>('theme');
  return theme || 'light';
}
