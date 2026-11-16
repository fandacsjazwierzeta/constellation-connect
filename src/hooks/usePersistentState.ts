import { useCallback, useState } from 'react';
import { defaultEnvelope, loadState, resetGameState, saveState } from '../services/localStore';
import type { Envelope, SavedAttempt, Selection } from '../services/localStore';
import type { AttemptResult } from '../game/types';
import type { ThemeMode } from '../constants/theme';

const safeLoad = (): Envelope => {
  try {
    const loaded = loadState();
    if (!loaded || loaded.schemaVersion !== 1) return defaultEnvelope();
    return loaded;
  } catch (error) {
    return defaultEnvelope();
  }
};

/**
 * Single owner of the saved envelope. Screens receive selectors and actions
 * rather than the whole object, so a board re-render never depends on an
 * unrelated statistics field.
 */
export const usePersistentState = () => {
  const [envelope, setEnvelope] = useState<Envelope>(safeLoad);

  const commit = useCallback((next: Envelope) => {
    saveState(next);
    setEnvelope(next);
  }, []);

  const update = useCallback(
    (producer: (prev: Envelope) => Envelope) => {
      setEnvelope(prev => {
        const next = producer(prev);
        saveState(next);
        return next;
      });
    },
    [],
  );

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      update(prev => ({
        ...prev,
        theme: mode,
        previousNonRedTheme: mode === 'red' ? prev.previousNonRedTheme : mode,
      }));
    },
    [update],
  );

  const setPreference = useCallback(
    (key: 'hapticsEnabled' | 'showTimer' | 'reduceMotion' | 'muteInRed', value: boolean) => {
      update(prev => ({ ...prev, [key]: value }));
    },
    [update],
  );

  const setSelection = useCallback(
    (selection: Selection) => {
      update(prev => ({ ...prev, selection }));
    },
    [update],
  );

  const saveAttempt = useCallback(
    (attempt: SavedAttempt) => {
      update(prev => ({
        ...prev,
        attempts: { ...prev.attempts, [attempt.constellationId]: attempt },
      }));
    },
    [update],
  );

  const clearAttempt = useCallback(
    (constellationId: number) => {
      update(prev => {
        const attempts = { ...prev.attempts };
        delete attempts[constellationId];
        return { ...prev, attempts };
      });
    },
    [update],
  );

  /** Commits exactly one solve; a repeated callback for the same attempt is ignored. */
  const commitSolve = useCallback(
    (result: AttemptResult, attemptId: number) => {
      update(prev => {
        // one solve per attempt id, whatever re-fires the callback
        if (prev.lastCommittedAttemptId >= attemptId) return prev;
        const now = Date.now();
        const existing = prev.completed[result.constellationId];
        const completed = {
          ...prev.completed,
          [result.constellationId]: {
            firstCompletedAt: existing ? existing.firstCompletedAt : now,
            lastCompletedAt: now,
            bestElapsedMs:
              existing && existing.bestElapsedMs > 0
                ? Math.min(existing.bestElapsedMs, result.elapsedMs)
                : result.elapsedMs,
            completedAttemptCount: existing ? existing.completedAttemptCount + 1 : 1,
            edges: result.edges,
          },
        };
        const attempts = { ...prev.attempts };
        delete attempts[result.constellationId];

        const stats = {
          completedAttempts: prev.stats.completedAttempts + 1,
          totalActiveMs: prev.stats.totalActiveMs + result.elapsedMs,
          totalMoves: prev.stats.totalMoves + result.moves,
          totalHints: prev.stats.totalHints + result.hints,
          attemptsWithHint: prev.stats.attemptsWithHint + (result.hints > 0 ? 1 : 0),
          fastestMs:
            prev.stats.fastestMs > 0
              ? Math.min(prev.stats.fastestMs, result.elapsedMs)
              : result.elapsedMs,
          lastSolvedId: result.constellationId,
          lastSolvedMs: result.elapsedMs,
        };

        return { ...prev, completed, attempts, stats, lastCommittedAttemptId: attemptId };
      });
    },
    [update],
  );

  const resetAtlas = useCallback(() => {
    update(prev => resetGameState(prev));
  }, [update]);

  return {
    envelope,
    commit,
    setTheme,
    setPreference,
    setSelection,
    saveAttempt,
    clearAttempt,
    commitSolve,
    resetAtlas,
  };
};
