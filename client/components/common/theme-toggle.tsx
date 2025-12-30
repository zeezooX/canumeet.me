'use client';

import { useCallback, useTransition } from 'react';

import { Moon, Sun } from 'lucide-react';

import { setTheme } from '@/actions';
import { Button } from '@/components/ui/button';

interface ThemeSetterProps {
  currentTheme?: 'light' | 'dark';
}

export function ThemeToggle({ currentTheme }: Readonly<ThemeSetterProps>) {
  const [isPending, startTransition] = useTransition();

  const startViewTransition = (callback: () => void) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        callback();
      });
    } else {
      callback();
    }
  };

  const setThemeWithTransition = useCallback((theme: 'light' | 'dark') => {
    startViewTransition(() => {
      startTransition(() => {
        setTheme(theme);
      });
    });
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setThemeWithTransition(currentTheme === 'light' ? 'dark' : 'light')}
      className="size-10 rounded-full shadow-lg"
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
      disabled={isPending}
    >
      <Sun
        className={`size-5 transition-all ${isPending ? 'scale-0 rotate-180' : 'scale-100 rotate-0 dark:scale-0 dark:-rotate-90'}`}
      />
      <Moon
        className={`absolute size-5 transition-all ${isPending ? 'scale-0 -rotate-180' : 'scale-0 rotate-90 dark:scale-100 dark:rotate-0'}`}
      />
      {isPending && (
        <div className="absolute size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
    </Button>
  );
}
