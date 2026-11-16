import { EPS } from '../constants/config';
import type { LogicalPoint, Star } from './types';

const cross = (o: LogicalPoint, a: LogicalPoint, b: LogicalPoint): number =>
  (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

export const orientation = (o: LogicalPoint, a: LogicalPoint, b: LogicalPoint): number => {
  const v = cross(o, a, b);
  if (v > EPS) return 1;
  if (v < -EPS) return -1;
  return 0;
};

export const samePoint = (a: LogicalPoint, b: LogicalPoint): boolean =>
  Math.abs(a.x - b.x) <= EPS && Math.abs(a.y - b.y) <= EPS;

/** True when c lies on the closed segment a-b (assumes the three are collinear). */
export const onSegment = (a: LogicalPoint, b: LogicalPoint, c: LogicalPoint): boolean =>
  c.x <= Math.max(a.x, b.x) + EPS &&
  c.x >= Math.min(a.x, b.x) - EPS &&
  c.y <= Math.max(a.y, b.y) + EPS &&
  c.y >= Math.min(a.y, b.y) - EPS;

/** True when c lies strictly inside the open segment a-b. */
export const pointOnOpenSegment = (a: LogicalPoint, b: LogicalPoint, c: LogicalPoint): boolean => {
  if (samePoint(a, c) || samePoint(b, c)) return false;
  if (orientation(a, b, c) !== 0) return false;
  return onSegment(a, b, c);
};

/**
 * Segment overlap test used by the puzzle validator.
 * A single shared endpoint is legal; a proper crossing, endpoint contact with a
 * non-shared segment, and any positive-length collinear overlap are not.
 */
export const segmentsConflict = (
  p1: LogicalPoint,
  q1: LogicalPoint,
  p2: LogicalPoint,
  q2: LogicalPoint,
): boolean => {
  const shares =
    samePoint(p1, p2) || samePoint(p1, q2) || samePoint(q1, p2) || samePoint(q1, q2);

  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  // fully collinear pair — look for a positive-length overlap
  if (o1 === 0 && o2 === 0 && o3 === 0 && o4 === 0) {
    const interior =
      pointOnOpenSegment(p1, q1, p2) ||
      pointOnOpenSegment(p1, q1, q2) ||
      pointOnOpenSegment(p2, q2, p1) ||
      pointOnOpenSegment(p2, q2, q1);
    return interior;
  }

  if (shares) {
    // only a shared endpoint; reject if the other endpoint also touches
    return (
      pointOnOpenSegment(p1, q1, p2) ||
      pointOnOpenSegment(p1, q1, q2) ||
      pointOnOpenSegment(p2, q2, p1) ||
      pointOnOpenSegment(p2, q2, q1)
    );
  }

  if (o1 !== o2 && o3 !== o4) return true;

  // endpoint of one segment touching the body of the other
  if (o1 === 0 && onSegment(p1, q1, p2)) return true;
  if (o2 === 0 && onSegment(p1, q1, q2)) return true;
  if (o3 === 0 && onSegment(p2, q2, p1)) return true;
  if (o4 === 0 && onSegment(p2, q2, q1)) return true;

  return false;
};

/** True when a proposed segment runs through the centre of an unrelated star. */
export const passesThroughStar = (a: Star, b: Star, stars: Star[]): boolean =>
  stars.some(s => s.id !== a.id && s.id !== b.id && pointOnOpenSegment(a, b, s));

export const distance = (ax: number, ay: number, bx: number, by: number): number =>
  Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
