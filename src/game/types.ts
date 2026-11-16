export type Chapter = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type Tier = 'Gentle' | 'Curious' | 'Deep Sky';

export interface LogicalPoint {
  x: number;
  y: number;
}

export interface Star {
  id: string;
  x: number;
  y: number;
  required: number;
}

export interface Puzzle {
  id: number;
  name: string;
  chapter: Chapter;
  tale: string;
  tier: Tier;
  stars: Star[];
  /** canonical solution, sorted edge keys */
  solution: string[];
}

export interface CatalogEntry {
  id: number;
  name: string;
  chapter: Chapter;
  tale: string;
  tier: Tier;
}

export type CommandType = 'add' | 'remove';

export interface Command {
  type: CommandType;
  key: string;
}

export type MoveResult =
  | { ok: true; type: CommandType; key: string }
  | { ok: false; reason: string };

export interface Hint {
  key: string;
  kind: 'add' | 'remove';
  message: string;
}

export interface AttemptResult {
  constellationId: number;
  name: string;
  chapter: Chapter;
  tale: string;
  elapsedMs: number;
  moves: number;
  hints: number;
  edges: string[];
  firstSolve: boolean;
  reviewMode: boolean;
}
