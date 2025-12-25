'use client';

import React, { useCallback, useTransition } from 'react';

import { setTheme } from '@/actions';

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
 * A simple button component that toggles between light and dark themes.
 *
 * It accepts `setTheme` and `currentTheme` as props.
 *
 * Example usage:
 * ```tsx
 * <ThemeToggle setTheme={setTheme} currentTheme="light" />
 * ```
 */
export function ThemeToggle({ setTheme, currentTheme }: Readonly<ThemeProps>) {
  return (
    <button onClick={() => setTheme?.(currentTheme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
