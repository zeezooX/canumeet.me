'use server';

import { setValue } from '@/lib';

/**
 * Set theme preference
 * @param theme Theme ('light' | 'dark')
 * @returns void
 */
export async function setTheme(theme: 'light' | 'dark'): Promise<void> {
  await setValue('theme', theme);
}
