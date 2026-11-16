import type { LogicalPoint } from './types';
import { GRID_MAX } from '../constants/config';

/**
 * The eight grid isometries, applied about the centre of the 5x5 grid.
 * Every one of them preserves planarity, so a non-crossing template stays
 * non-crossing after transformation.
 */
export type TransformFn = (pt: LogicalPoint) => LogicalPoint;

const M = GRID_MAX; // 4

export const TRANSFORMS: TransformFn[] = [
  ({ x, y }) => ({ x, y }),
  ({ x, y }) => ({ x: M - y, y: x }),
  ({ x, y }) => ({ x: M - x, y: M - y }),
  ({ x, y }) => ({ x: y, y: M - x }),
  ({ x, y }) => ({ x: M - x, y }),
  ({ x, y }) => ({ x: M - y, y: M - x }),
  ({ x, y }) => ({ x, y: M - y }),
  ({ x, y }) => ({ x: y, y: x }),
];

export const TRANSFORM_COUNT = TRANSFORMS.length; // 8
