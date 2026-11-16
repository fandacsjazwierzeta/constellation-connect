import type { Hint, Puzzle } from './types';

/**
 * Deterministic free hint.
 * Remove the lexicographically first non-canonical edge, otherwise add the
 * first missing canonical edge. Following it always reaches a valid solution.
 */
export const nextHint = (puzzle: Puzzle, edges: string[]): Hint | null => {
  const sorted = edges.slice().sort();

  for (let i = 0; i < sorted.length; i += 1) {
    if (puzzle.solution.indexOf(sorted[i]) < 0) {
      return { key: sorted[i], kind: 'remove', message: 'Try removing this link.' };
    }
  }

  for (let i = 0; i < puzzle.solution.length; i += 1) {
    if (sorted.indexOf(puzzle.solution[i]) < 0) {
      return { key: puzzle.solution[i], kind: 'add', message: 'Try linking these stars.' };
    }
  }

  return null;
};
