import { useCallback, useEffect, useRef } from 'react';

/**
 * Timer hook
 *
 * @param timeout timeout reference
 * @param wait wait time in ms
 * @return [timeout, clearTimeout]
 */
const useTimer = <T extends ((...args: never[]) => void) | (() => void)>(
  callback: T,
  duration?: number,
): [
  (...args: Parameters<T>) => void,
  () => void,
  React.MutableRefObject<NodeJS.Timeout | undefined>,
] => {
  // Reference of running timer
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // Clear timer
  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };

  // Clear timer on unmount
  useEffect(() => clearTimer, []);

  const startTimer = useCallback(
    (...args: Parameters<T>) => {
      clearTimer();
      if (duration) {
        timer.current = setTimeout(() => {
          callback(...args);
          timer.current = undefined;
        }, duration);
      }
    },
    [callback, duration],
  );

  return [startTimer, clearTimer, timer];
};

/**
 * Debounce callback hook
 *
 * @param callback action
 * @param duration duration
 * @return debounced function
 */
export const useDebounce = <T extends ((...args: never[]) => void) | (() => void)>(
  callback: T,
  duration?: number,
): [(...args: Parameters<T>) => void] => {
  const [startTimer] = useTimer(callback, duration);

  // Start timer
  const debounceCallback = useCallback(
    (...args: Parameters<T>) => startTimer(...args),
    [startTimer],
  );

  return [debounceCallback];
};

/**
 * Throttle callback hook
 *
 * @param callback action
 * @param duration duration
 * @return throttled function
 */
export const useThrottle = <T extends ((...args: never[]) => void) | (() => void)>(
  callback: T,
  duration?: number,
) => {
  const lastArgs = useRef<Parameters<T>>();

  const executeCallback = useCallback(() => {
    if (lastArgs.current) {
      callback(...lastArgs.current);
      lastArgs.current = undefined;
    }
  }, [callback]);

  const [startTimer, , timer] = useTimer(executeCallback, duration);

  const throttleCallback = useCallback(
    (...args: Parameters<T>) => {
      lastArgs.current = args;
      if (timer.current) return;

      startTimer();
    },
    [startTimer, timer],
  );

  return [throttleCallback];
};
