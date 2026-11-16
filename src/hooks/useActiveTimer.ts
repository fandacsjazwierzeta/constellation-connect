import { useCallback, useEffect, useRef, useState } from 'react';
import { TIMER_TICK_MS } from '../constants/config';

/**
 * Accumulated active monotonic time. Mutable bookkeeping lives in refs so the
 * board does not re-render on every tick of the underlying clock.
 */
export const useActiveTimer = (initialMs: number) => {
  const baseRef = useRef(initialMs);
  const startedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [display, setDisplay] = useState(initialMs);

  const read = useCallback((): number => {
    const live = startedAtRef.current === null ? 0 : Date.now() - startedAtRef.current;
    return baseRef.current + live;
  }, []);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (startedAtRef.current !== null) return;
    startedAtRef.current = Date.now();
    clearTick();
    intervalRef.current = setInterval(() => setDisplay(read()), TIMER_TICK_MS);
  }, [clearTick, read]);

  const stop = useCallback(() => {
    if (startedAtRef.current !== null) {
      baseRef.current += Date.now() - startedAtRef.current;
      startedAtRef.current = null;
    }
    clearTick();
    setDisplay(baseRef.current);
  }, [clearTick]);

  const reset = useCallback(
    (value: number) => {
      clearTick();
      startedAtRef.current = null;
      baseRef.current = value;
      setDisplay(value);
    },
    [clearTick],
  );

  useEffect(() => clearTick, [clearTick]);

  return { display, read, start, stop, reset };
};
