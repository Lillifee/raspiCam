import { useEffect, useRef } from 'react';

/**
 * Debounce callback hook
 * Debounce an action
 * @param callback debounce action
 * @param wait wait time in ms
 * @return debounde trigger function
 */
export function useDebouncedCallback<T extends ((...args: any[]) => void) | (() => void)>(
  callback: T,
  wait?: number,
): [(...args: Parameters<T>) => void, () => void] {
  // Reference of the running timer
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  // Clear timer
  const clearTimer = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  // Clear timer on unmount
  useEffect(() => clearTimer, []);

  // clear an restart timer
  const debounceCallback = (...args: any[]) => {
    clearTimer();
    if (wait) {
      timeout.current = setTimeout(() => callback(...args), wait);
    }
  };

  return [debounceCallback, clearTimer];
}
