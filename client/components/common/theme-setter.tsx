'use client';

import React, { useCallback, useTransition } from 'react';

import { Moon, Sun } from 'lucide-react';

import { setTheme } from '@/actions';
import { Button } from '@/components/ui/button';

function startViewTransition(callback: () => void) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      callback();
    });
  } else {
    callback();
  }
}

interface ThemeSetterProps {
  children: React.ReactNode;
}

export interface ThemeProps {
  setTheme?: (theme: 'light' | 'dark') => Promise<void>;
  currentTheme?: 'light' | 'dark';
}

/**
 * A component that provides a way to set the theme of the application.
 *
 * It accepts a single child which can be either a React element or a function that
 * receives a `setTheme` function as a prop. The `setTheme` function can be used to
 * change the theme of the application.
 *
 * Example usage:
 * ```tsx
 * <ThemeSetter>
 *   {({ setTheme }) => (
 *     <button onClick={() => setTheme('dark')}>
 *       Dark mode
 *     </button>
 *   )}
 * </ThemeSetter>
 * ```
 */
export default function ThemeSetter({ children }: Readonly<ThemeSetterProps>) {
  const [, startTransition] = useTransition();

  const setter = useCallback(async (theme: 'light' | 'dark') => {
    startViewTransition(() => {
      startTransition(() => {
        setTheme(theme);
      });
    });
  }, []);

  if (React.isValidElement(children)) {
    return (
      <>{React.cloneElement(children, { setTheme: setter } as React.Attributes & ThemeProps)}</>
    );
  }

  return <>{children}</>;
}

/**
 * A polished theme toggle button with smooth animations.
 */
export function ThemeToggle({ setTheme, currentTheme }: Readonly<ThemeProps>) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme?.(currentTheme === 'light' ? 'dark' : 'light')}
      className="size-10 rounded-full shadow-lg"
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
