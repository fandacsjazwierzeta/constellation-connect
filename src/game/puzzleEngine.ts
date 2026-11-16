import { edgeEnds, edgeKey } from './catalog';
import { passesThroughStar, segmentsConflict } from './geometry';
import type { MoveResult, Puzzle, Star } from './types';

export const starById = (puzzle: Puzzle, id: string): Star | undefined =>
  puzzle.stars.find(s => s.id === id);

export const degreeOf = (edges: string[], id: string): number => {
  let n = 0;
  for (let i = 0; i < edges.length; i += 1) {
    const ends = edgeEnds(edges[i]);
    if (ends[0] === id || ends[1] === id) n += 1;
  }
  return n;
};

export const degreeMap = (puzzle: Puzzle, edges: string[]): Record<string, number> => {
  const map: Record<string, number> = {};
  puzzle.stars.forEach(s => {
    map[s.id] = 0;
  });
  edges.forEach(key => {
    const ends = edgeEnds(key);
    if (map[ends[0]] !== undefined) map[ends[0]] += 1;
    if (map[ends[1]] !== undefined) map[ends[1]] += 1;
  });
  return map;
};

/**
 * Decide what a pair of stars does to the current graph.
 * Removal is checked before capacity, so a full star can always be freed again.
 */
export const evaluatePair = (puzzle: Puzzle, edges: string[], aId: string, bId: string): MoveResult => {
  if (aId === bId) {
    return { ok: false, reason: 'A star cannot link to itself' };
  }
  const a = starById(puzzle, aId);
  const b = starById(puzzle, bId);
  if (!a || !b) {
    return { ok: false, reason: 'That is not a star on this sky' };
  }

  const key = edgeKey(aId, bId);
  if (edges.indexOf(key) >= 0) {
    return { ok: true, type: 'remove', key };
  }

  const degrees = degreeMap(puzzle, edges);
  if (degrees[aId] >= a.required || degrees[bId] >= b.required) {
    return { ok: false, reason: 'That star has all its links' };
  }

  if (passesThroughStar(a, b, puzzle.stars)) {
    return { ok: false, reason: 'A line cannot pass through a star' };
  }

  for (let i = 0; i < edges.length; i += 1) {
    const ends = edgeEnds(edges[i]);
    const p2 = starById(puzzle, ends[0]);
    const q2 = starById(puzzle, ends[1]);
    if (!p2 || !q2) continue;
    if (segmentsConflict(a, b, p2, q2)) {
      return { ok: false, reason: 'Lines cannot cross' };
    }
  }

  return { ok: true, type: 'add', key };
};

export const applyMove = (edges: string[], type: 'add' | 'remove', key: string): string[] => {
  if (type === 'add') {
    if (edges.indexOf(key) >= 0) return edges;
    return edges.concat(key).sort();
  }
  return edges.filter(k => k !== key);
};

export const isConnected = (puzzle: Puzzle, edges: string[]): boolean => {
  const stars = puzzle.stars;
  if (stars.length === 0) return false;

  const neighbours: Record<string, string[]> = {};
  stars.forEach(s => {
    neighbours[s.id] = [];
  });
  edges.forEach(key => {
    const ends = edgeEnds(key);
    if (neighbours[ends[0]] && neighbours[ends[1]]) {
      neighbours[ends[0]].push(ends[1]);
      neighbours[ends[1]].push(ends[0]);
    }
  });

  const seen: Record<string, boolean> = {};
  const queue: string[] = [stars[0].id];
  seen[stars[0].id] = true;
  let visited = 0;

  while (queue.length > 0) {
    const current = queue.shift() as string;
    visited += 1;
    const list = neighbours[current] || [];
    for (let i = 0; i < list.length; i += 1) {
      if (!seen[list[i]]) {
        seen[list[i]] = true;
        queue.push(list[i]);
      }
    }
  }

  return visited === stars.length;
};

export const allDegreesMatched = (puzzle: Puzzle, edges: string[]): boolean => {
  const degrees = degreeMap(puzzle, edges);
  return puzzle.stars.every(s => degrees[s.id] === s.required);
};

export const matchedCount = (puzzle: Puzzle, edges: string[]): number => {
  const degrees = degreeMap(puzzle, edges);
  return puzzle.stars.filter(s => degrees[s.id] === s.required).length;
};

export const isSolved = (puzzle: Puzzle, edges: string[]): boolean =>
  allDegreesMatched(puzzle, edges) && isConnected(puzzle, edges);

/** Status sentence for the strip above the board. */
export const statusLine = (puzzle: Puzzle, edges: string[]): string => {
  const matched = matchedCount(puzzle, edges);
  const total = puzzle.stars.length;
  if (matched === total && !isConnected(puzzle, edges)) {
    return 'Join the groups into one constellation';
  }
  if (matched === 0) {
    return 'Match every star link count';
  }
  return matched + ' of ' + total + ' stars matched';
};

/** Validate a restored edge list; drop anything the engine would never have accepted. */
export const sanitizeEdges = (puzzle: Puzzle, raw: string[]): string[] => {
  let safe: string[] = [];
  const seen: Record<string, boolean> = {};
  for (let i = 0; i < raw.length; i += 1) {
    const key = raw[i];
    if (seen[key]) continue;
    const ends = edgeEnds(key);
    if (!ends[0] || !ends[1]) continue;
    const result = evaluatePair(puzzle, safe, ends[0], ends[1]);
    if (result.ok && result.type === 'add') {
      safe = applyMove(safe, 'add', result.key);
      seen[key] = true;
    }
  }
  return safe;
};
