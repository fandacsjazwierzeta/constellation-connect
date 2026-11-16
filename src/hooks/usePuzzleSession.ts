import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HINT_MS } from '../constants/config';
import { emptyHistory, popRedo, popUndo, pushCommand } from '../game/history';
import type { HistoryState } from '../game/history';
import { nextHint } from '../game/hints';
import {
  applyMove,
  degreeMap,
  evaluatePair,
  isSolved,
  sanitizeEdges,
  statusLine,
} from '../game/puzzleEngine';
import type { Hint, Puzzle } from '../game/types';
import type { SavedAttempt } from '../services/localStore';
import { confirmHaptic } from '../services/platformFeedback';
import { useActiveTimer } from './useActiveTimer';
import { useFeedback } from './useFeedback';

interface Options {
  puzzle: Puzzle;
  saved: SavedAttempt | undefined;
  hapticsEnabled: boolean;
  onSolved: (payload: { edges: string[]; elapsedMs: number; moves: number; hints: number }) => void;
}

export const usePuzzleSession = ({ puzzle, saved, hapticsEnabled, onSolved }: Options) => {
  const restored = useMemo(
    () => (saved ? sanitizeEdges(puzzle, saved.edges) : []),
    [puzzle, saved],
  );

  const [edges, setEdges] = useState<string[]>(restored);
  const [history, setHistory] = useState<HistoryState>(
    saved ? { undo: saved.undo, redo: saved.redo } : emptyHistory(),
  );
  const [moves, setMoves] = useState(saved ? saved.moves : 0);
  const [hints, setHints] = useState(saved ? saved.hints : 0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hint, setHint] = useState<Hint | null>(null);
  const [completing, setCompleting] = useState(false);

  const timer = useActiveTimer(saved ? saved.elapsedMs : 0);
  const feedback = useFeedback();

  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const committedRef = useRef(false);
  const hapticsRef = useRef(hapticsEnabled);
  hapticsRef.current = hapticsEnabled;

  useEffect(
    () => () => {
      if (hintTimeoutRef.current !== null) clearTimeout(hintTimeoutRef.current);
    },
    [],
  );

  const degrees = useMemo(() => degreeMap(puzzle, edges), [puzzle, edges]);
  const status = useMemo(() => statusLine(puzzle, edges), [puzzle, edges]);

  const finish = useCallback(
    (nextEdges: string[], nextMoves: number, nextHints: number) => {
      if (committedRef.current) return;
      committedRef.current = true;
      setCompleting(true);
      timer.stop();
      onSolved({
        edges: nextEdges,
        elapsedMs: timer.read(),
        moves: nextMoves,
        hints: nextHints,
      });
    },
    [onSolved, timer],
  );

  /** Pure apply + win check. No side effect runs inside a state updater. */
  const commitCommand = useCallback(
    (current: string[], type: 'add' | 'remove', key: string) => {
      const next = applyMove(current, type, key);
      setEdges(next);
      if (isSolved(puzzle, next)) {
        finish(next, moves + 1, hints);
      }
    },
    [finish, hints, moves, puzzle],
  );

  /** Drag release or the second tap of a pair. */
  const onPair = useCallback(
    (aId: string, bId: string) => {
      if (completing) return;
      const result = evaluatePair(puzzle, edges, aId, bId);
      setSelected(null);
      setHint(null);

      if (!result.ok) {
        feedback.show(result.reason);
        return;
      }

      timer.start();
      confirmHaptic(hapticsRef.current);
      feedback.clear();
      setHistory(prev => pushCommand(prev, { type: result.type, key: result.key }));
      setMoves(prev => prev + 1);
      commitCommand(edges, result.type, result.key);
    },
    [commitCommand, completing, edges, feedback, puzzle, timer],
  );

  const onSelect = useCallback(
    (id: string | null) => {
      if (completing) return;
      setSelected(id);
    },
    [completing],
  );

  const onUndo = useCallback(() => {
    if (completing) return;
    const popped = popUndo(history);
    if (!popped) {
      feedback.show('Nothing to undo yet');
      return;
    }
    setHistory(popped.history);
    setSelected(null);
    setMoves(prev => prev + 1);
    commitCommand(edges, popped.command.type, popped.command.key);
  }, [commitCommand, completing, edges, feedback, history]);

  const onRedo = useCallback(() => {
    if (completing) return;
    const popped = popRedo(history);
    if (!popped) {
      feedback.show('Nothing to redo yet');
      return;
    }
    setHistory(popped.history);
    setSelected(null);
    setMoves(prev => prev + 1);
    commitCommand(edges, popped.command.type, popped.command.key);
  }, [commitCommand, completing, edges, feedback, history]);

  const onHint = useCallback(() => {
    if (completing) return;
    const next = nextHint(puzzle, edges);
    setHints(prev => prev + 1);
    if (!next) {
      feedback.show('Every link is already in place');
      return;
    }
    setHint(next);
    feedback.show(next.message);
    if (hintTimeoutRef.current !== null) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      hintTimeoutRef.current = null;
      setHint(null);
    }, HINT_MS);
  }, [completing, edges, feedback, puzzle]);

  const restart = useCallback(() => {
    committedRef.current = false;
    setEdges([]);
    setHistory(emptyHistory());
    setMoves(0);
    setHints(0);
    setSelected(null);
    setHint(null);
    setCompleting(false);
    feedback.clear();
    timer.reset(0);
  }, [feedback, timer]);

  const pause = useCallback(() => {
    timer.stop();
    setSelected(null);
  }, [timer]);

  const resume = useCallback(() => {
    if (edges.length > 0 && !completing) timer.start();
  }, [completing, edges.length, timer]);

  return {
    edges,
    degrees,
    status,
    selected,
    moves,
    hints,
    hint,
    completing,
    feedbackMessage: feedback.message,
    elapsedMs: timer.display,
    readElapsed: timer.read,
    canUndo: history.undo.length > 0,
    canRedo: history.redo.length > 0,
    history,
    onPair,
    onSelect,
    onUndo,
    onRedo,
    onHint,
    restart,
    pause,
    resume,
  };
};
