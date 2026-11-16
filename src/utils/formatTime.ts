const pad = (n: number): string => (n < 10 ? '0' + n : String(n));

/** m:ss under an hour, h:mm:ss otherwise. Never negative, never NaN. */
export const formatTime = (ms: number): string => {
  const safe = !isFinite(ms) || ms < 0 ? 0 : Math.floor(ms / 1000);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) return hours + ':' + pad(minutes) + ':' + pad(seconds);
  return minutes + ':' + pad(seconds);
};

/** Compact total for overview cards: 2h 14m, 14m, or 0m. */
export const formatTotal = (ms: number): string => {
  const safe = !isFinite(ms) || ms < 0 ? 0 : Math.floor(ms / 60000);
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours > 0) return hours + 'h ' + minutes + 'm';
  return minutes + 'm';
};
