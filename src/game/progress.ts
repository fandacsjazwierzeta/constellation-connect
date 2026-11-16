import { CATALOG, CHAPTER_LIST } from './catalog';
import { CATALOG_SIZE, CHAPTER_SIZE } from '../constants/config';
import type { Chapter } from './types';

export interface CompletedRecord {
  firstCompletedAt: number;
  lastCompletedAt: number;
  bestElapsedMs: number;
  completedAttemptCount: number;
  edges: string[];
}

export interface AggregateStats {
  completedAttempts: number;
  totalActiveMs: number;
  totalMoves: number;
  totalHints: number;
  attemptsWithHint: number;
  fastestMs: number;
  lastSolvedId: number;
  lastSolvedMs: number;
}

export const emptyStats = (): AggregateStats => ({
  completedAttempts: 0,
  totalActiveMs: 0,
  totalMoves: 0,
  totalHints: 0,
  attemptsWithHint: 0,
  fastestMs: 0,
  lastSolvedId: 0,
  lastSolvedMs: 0,
});

export type CompletedMap = Record<number, CompletedRecord>;

export const uniqueCount = (completed: CompletedMap): number => Object.keys(completed).length;

export const chapterCompleted = (completed: CompletedMap, chapter: Chapter): number =>
  CATALOG.filter(entry => entry.chapter === chapter && !!completed[entry.id]).length;

export const overallPercent = (completed: CompletedMap): number =>
  Math.round((100 * uniqueCount(completed)) / CATALOG_SIZE);

export const chapterPercent = (completed: CompletedMap, chapter: Chapter): number =>
  Math.round((100 * chapterCompleted(completed, chapter)) / CHAPTER_SIZE);

export const averageMs = (stats: AggregateStats): number =>
  stats.completedAttempts > 0 ? Math.round(stats.totalActiveMs / stats.completedAttempts) : 0;

/** Next incomplete entry in catalogue order, wrapping once. */
export const nextIncompleteId = (completed: CompletedMap, fromId: number): number => {
  for (let step = 1; step <= CATALOG_SIZE; step += 1) {
    const id = ((fromId - 1 + step) % CATALOG_SIZE) + 1;
    if (!completed[id]) return id;
  }
  return (fromId % CATALOG_SIZE) + 1;
};

export const chapterOf = (id: number): Chapter =>
  CHAPTER_LIST[Math.floor((id - 1) / CHAPTER_SIZE)] || CHAPTER_LIST[0];

export const pageOf = (id: number, perPage: number): number =>
  Math.floor(((id - 1) % CHAPTER_SIZE) / perPage);
