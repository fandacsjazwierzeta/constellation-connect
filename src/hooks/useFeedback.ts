import { useCallback, useEffect, useRef, useState } from 'react';
import { FEEDBACK_MS } from '../constants/config';

/**
 * One gentle, self-expiring message. A new message always replaces the previous
 * one instead of stacking.
 */
export const useFeedback = () => {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMessage('');
  }, []);

  const show = useCallback((next: string) => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    setMessage(next);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setMessage('');
    }, FEEDBACK_MS);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { message, show, clear };
};
