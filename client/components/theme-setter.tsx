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
