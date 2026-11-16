import { CHAPTER_LIST } from '../game/catalog';
import { TILES_PER_PAGE } from '../constants/config';
import { emptyStats } from '../game/progress';
import type { AggregateStats, CompletedMap } from '../game/progress';
import type { Chapter } from '../game/types';
import type { ThemeMode } from '../constants/theme';

export interface SavedAttempt {
  attemptId: number;
  constellationId: number;
  edges: string[];
  undo: { type: 'add' | 'remove'; key: string }[];
  redo: { type: 'add' | 'remove'; key: string }[];
  moves: number;
  hints: number;
  elapsedMs: number;
  updatedAt: number;
}

export interface Selection {
  chapter: Chapter;
  page: number;
  constellationId: number;
}

export interface Envelope {
  schemaVersion: 1;
  theme: ThemeMode;
  previousNonRedTheme: ThemeMode;
  hapticsEnabled: boolean;
  showTimer: boolean;
  reduceMotion: boolean;
  muteInRed: boolean;
  selection: Selection;
  nextAttemptId: number;
  lastCommittedAttemptId: number;
  attempts: Record<number, SavedAttempt>;
  completed: CompletedMap;
  stats: AggregateStats;
}

export const STORE_KEY = 'cc_state_v1';

export const defaultEnvelope = (): Envelope => ({
  schemaVersion: 1,
  theme: 'light',
  previousNonRedTheme: 'light',
  hapticsEnabled: false,
  showTimer: true,
  reduceMotion: false,
  muteInRed: true,
  selection: { chapter: CHAPTER_LIST[0], page: 0, constellationId: 1 },
  nextAttemptId: 1,
  lastCommittedAttemptId: 0,
  attempts: {},
  completed: {},
  stats: emptyStats(),
});

/**
 * Session-local store.
 *
 * The shipped dependency allow-list carries no storage package and the project
 * deliberately adds no extra native module, so the envelope lives in this
 * module for the lifetime of the JS bundle. Every write goes through saveState,
 * which keeps the whole app on one documented contract: when a device-backed
 * bridge is added later, only the two functions below change.
 */
let current: Envelope = defaultEnvelope();

export const loadState = (): Envelope => current;

export const saveState = (next: Envelope): void => {
  current = next;
};

export const resetGameState = (envelope: Envelope): Envelope => ({
  ...envelope,
  selection: { chapter: CHAPTER_LIST[0], page: 0, constellationId: 1 },
  nextAttemptId: 1,
  lastCommittedAttemptId: 0,
  attempts: {},
  completed: {},
  stats: emptyStats(),
});

export const pageForId = (id: number): number => {
  const withinChapter = (id - 1) % 22;
  return Math.floor(withinChapter / TILES_PER_PAGE);
};
