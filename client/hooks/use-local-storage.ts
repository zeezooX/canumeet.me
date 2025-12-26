'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';

const USER_NAME_KEY = 'canumeetme_user_name';

function getServerSnapshot(): string {
  return '';
}

function subscribe(callback: () => void) {
  globalThis.addEventListener('storage', callback);
  return () => globalThis.removeEventListener('storage', callback);
}

/**
 * Hook to manage the user's name in localStorage
 * Automatically persists the name and retrieves it on mount
 */
export function useUserName() {
  const getSnapshot = useCallback(() => {
    try {
      const stored = localStorage.getItem(USER_NAME_KEY);
      if (stored) {
        return JSON.parse(stored) as string;
      }
    } catch {
      // ignore parse errors
    }
    return '';
  }, []);

  const userName = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setUserName = useCallback((name: string) => {
    if (name) {
      localStorage.setItem(USER_NAME_KEY, JSON.stringify(name));
    } else {
      localStorage.removeItem(USER_NAME_KEY);
    }
    globalThis.dispatchEvent(new Event('storage'));
  }, []);

  return { userName, setUserName };
}

/**
 * Generic localStorage hook with SSR safety
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialValueRef = useRef(initialValue);

  const getSnapshot = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch {
      // ignore parse errors
    }
    return initialValueRef.current;
  }, [key]);

  const getServerSnapshotGeneric = useCallback(() => {
    return initialValueRef.current;
  }, []);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshotGeneric);

  const setValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          typeof newValue === 'function' ? (newValue as (val: T) => T)(getSnapshot()) : newValue;
        localStorage.setItem(key, JSON.stringify(valueToStore));
        globalThis.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, getSnapshot]
  );

  return { value, setValue };
}
