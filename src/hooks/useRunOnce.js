import { useEffect, useRef } from 'react';

/**
 * Runs a callback exactly once, even in React 19 strict mode dev rendering.
 * Prevents double-execution of effects during development.
 *
 * @param {Function} callback - Async or sync function to run once on mount.
 */
export default function useRunOnce(callback) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    callback?.();
  }, [callback]);
}
