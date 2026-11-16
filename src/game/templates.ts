import type { LogicalPoint } from './types';

export interface Template {
  points: LogicalPoint[];
  /** canonical undirected edges written as sorted letter pairs */
  edges: [string, string][];
}

const p = (x: number, y: number): LogicalPoint => ({ x, y });

const e = (list: string): [string, string][] =>
  list.split(' ').map(pair => [pair[0], pair[1]] as [string, string]);

/**
 * Eleven planar, non-crossing graph designs on a 5x5 logical grid.
 * Star IDs are assigned A.. in the order of the listed coordinates.
 */
export const TEMPLATES: Template[] = [
  // T1 — Gentle
  { points: [p(0, 1), p(1, 1), p(2, 2), p(3, 2), p(4, 3)], edges: e('AB BC CD DE') },
  // T2 — Gentle
  { points: [p(0, 3), p(1, 2), p(1, 1), p(2, 1), p(3, 2), p(4, 2)], edges: e('AB BC CD DE EF') },
  // T3 — Gentle
  { points: [p(0, 2), p(1, 2), p(2, 2), p(3, 1), p(4, 1), p(2, 3)], edges: e('AB BC CD DE CF') },
  // T4 — Curious
  {
    points: [p(0, 1), p(1, 0), p(2, 1), p(2, 2), p(1, 3), p(0, 2), p(3, 2)],
    edges: e('AB BC CD DE EF AF DG'),
  },
  // T5 — Curious
  {
    points: [p(0, 3), p(1, 2), p(1, 1), p(2, 0), p(3, 1), p(3, 2), p(4, 2)],
    edges: e('AB BC CD DE EF FG'),
  },
  // T6 — Curious
  {
    points: [p(0, 2), p(1, 2), p(2, 2), p(3, 2), p(4, 1), p(1, 1), p(2, 3), p(3, 4)],
    edges: e('AB BC CD DE BF CG GH'),
  },
  // T7 — Curious
  {
    points: [p(0, 1), p(1, 0), p(2, 1), p(1, 2), p(2, 3), p(3, 3), p(4, 2), p(4, 1)],
    edges: e('AB BC CD AD DE EF FG GH'),
  },
  // T8 — Deep Sky
  {
    points: [p(0, 0), p(1, 1), p(2, 0), p(3, 1), p(4, 1), p(4, 2), p(3, 3), p(2, 3), p(1, 4)],
    edges: e('AB BC CD DE EF FG GH HI'),
  },
  // T9 — Deep Sky
  {
    points: [
      p(0, 2), p(1, 2), p(2, 1), p(3, 1), p(4, 0),
      p(2, 2), p(3, 3), p(4, 3), p(1, 3), p(0, 4),
    ],
    edges: e('AB BC CD DE CF FG GH BI IJ'),
  },
  // T10 — Deep Sky
  {
    points: [
      p(0, 1), p(1, 0), p(2, 1), p(1, 2), p(2, 2), p(3, 1),
      p(4, 2), p(3, 3), p(2, 4), p(1, 4), p(0, 3),
    ],
    edges: e('AB BC CD AD DE EF FG GH EH HI IJ JK'),
  },
  // T11 — Deep Sky
  {
    points: [
      p(0, 1), p(1, 0), p(2, 1), p(1, 2), p(2, 2), p(3, 2),
      p(4, 1), p(4, 3), p(3, 4), p(2, 3), p(1, 4), p(0, 3),
    ],
    edges: e('AB BC CD AD DE EF FG FH HI IJ EJ JK KL DL'),
  },
];

export const STAR_IDS = 'ABCDEFGHIJKL';

export const TEMPLATE_COUNT = TEMPLATES.length; // 11
