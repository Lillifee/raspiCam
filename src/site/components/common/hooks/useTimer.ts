import { useCallback, useEffect, useRef } from 'react';

/**
 * Timer hook with callback and interval
 *
 * @param callback Callback function
 * @param interval interval in ms
 * @return [ start : () => void, stop: () => void ]
 */
export const useTimer = (
  callback: () => Promise<void> | void,
  interval?: number,
): [
  () => void, // Start timer
  () => void, // Stop timer
] => {
  // Reference of running timer
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  // Clear timer
  const stop = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  // Clear timer on unmount
  useEffect(() => stop, []);

  // Start the timer
  const start = useCallback(() => {
    if (interval) {
      timeout.current = setTimeout(async () => {
        await callback();
        start();
      }, interval);
    }
  }, [callback, interval]);

  return [start, stop];
};
