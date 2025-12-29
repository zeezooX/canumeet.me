'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

/**
 * Automatically refreshes the current route at a specified interval.
 * The refresh only occurs when the document is visible.
 * @param intervalMs - The interval in milliseconds at which to refresh the route. Default is 30000 ms (30 seconds).
 * @param enabled - Whether the auto-refresh is enabled. Default is true.
 */
export function useAutoRefresh(intervalMs = 30000, enabled = true) {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefresh = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const refresh = () => {
      const now = Date.now();
      if (now - lastRefresh.current < 500) return;
      lastRefresh.current = now;

      if (document.visibilityState === 'visible') {
        router.refresh();
      }
    };

    intervalRef.current = setInterval(refresh, intervalMs);

    document.addEventListener('visibilitychange', refresh);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [router, intervalMs, enabled]);
}
