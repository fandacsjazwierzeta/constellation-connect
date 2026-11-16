import React, { useMemo } from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
import { edgeEnds } from '../game/catalog';
import type { Puzzle } from '../game/types';
import { GRID_MAX } from '../constants/config';

interface Props {
  puzzle: Puzzle;
  size: number;
  lineColor: string;
  starColor: string;
  edges?: string[];
  outlined?: boolean;
  strokeWidth?: number;
}

/**
 * Non-interactive SVG rendering of a puzzle graph. Used for atlas thumbnails,
 * chapter cards and the Reveal figure — never a raster file.
 */
export const ConstellationPreview = ({
  puzzle,
  size,
  lineColor,
  starColor,
  edges,
  outlined,
  strokeWidth = 2,
}: Props) => {
  const inset = Math.max(4, size * 0.12);
  const span = size - inset * 2;
  const step = span / GRID_MAX;

  const points = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    puzzle.stars.forEach(s => {
      map[s.id] = { x: inset + s.x * step, y: inset + s.y * step };
    });
    return map;
  }, [inset, puzzle, step]);

  const drawn = edges || puzzle.solution;
  const dotRadius = Math.max(1.6, size * 0.035);

  return (
    <Svg width={size} height={size} accessibilityRole="image">
      {drawn.map(key => {
        const ends = edgeEnds(key);
        const a = points[ends[0]];
        const b = points[ends[1]];
        if (!a || !b) return null;
        return (
          <Line
            key={key}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={outlined ? 0.55 : 1}
          />
        );
      })}
      {puzzle.stars.map(s => {
        const p = points[s.id];
        return (
          <Circle
            key={s.id}
            cx={p.x}
            cy={p.y}
            r={dotRadius}
            fill={outlined ? 'none' : starColor}
            stroke={starColor}
            strokeWidth={outlined ? 1.4 : 0}
          />
        );
      })}
    </Svg>
  );
};

export default React.memo(ConstellationPreview);
