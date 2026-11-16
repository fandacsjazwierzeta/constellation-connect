import React from 'react';
import Svg, { Line } from 'react-native-svg';
import { edgeEnds } from '../game/catalog';
import type { Hint } from '../game/types';
import type { Palette } from '../constants/theme';

export interface ScreenPoint {
  x: number;
  y: number;
}

interface Props {
  size: number;
  points: Record<string, ScreenPoint>;
  edges: string[];
  hint: Hint | null;
  preview: { from: string; x: number; y: number } | null;
  palette: Palette;
}

/** Accepted gold strokes, the live magenta preview and the dashed hint. */
export const LinkLayer = ({ size, points, edges, hint, preview, palette }: Props) => {
  const hintEnds = hint ? edgeEnds(hint.key) : null;
  const hintFrom = hintEnds ? points[hintEnds[0]] : null;
  const hintTo = hintEnds ? points[hintEnds[1]] : null;
  const previewFrom = preview ? points[preview.from] : null;

  return (
    <Svg width={size} height={size} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      {edges.map(key => {
        const ends = edgeEnds(key);
        const a = points[ends[0]];
        const b = points[ends[1]];
        if (!a || !b) return null;
        const highlighted = hint !== null && hint.kind === 'remove' && hint.key === key;
        return (
          <Line
            key={key}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={highlighted ? palette.accent : palette.line}
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}

      {hint !== null && hint.kind === 'add' && hintFrom && hintTo ? (
        <Line
          x1={hintFrom.x}
          y1={hintFrom.y}
          x2={hintTo.x}
          y2={hintTo.y}
          stroke={palette.accent}
          strokeWidth={3}
          strokeDasharray="7,6"
          strokeLinecap="round"
        />
      ) : null}

      {preview && previewFrom ? (
        <Line
          x1={previewFrom.x}
          y1={previewFrom.y}
          x2={preview.x}
          y2={preview.y}
          stroke={palette.accent}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.9}
        />
      ) : null}
    </Svg>
  );
};

export default React.memo(LinkLayer);
