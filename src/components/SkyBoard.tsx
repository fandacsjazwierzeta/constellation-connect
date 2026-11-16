import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import {
  BOARD_BORDER,
  BOARD_INNER,
  BOARD_PAD,
  BOARD_SIZE,
  GRID_INSET,
  GRID_PITCH,
  HIT_RADIUS,
  TAP_THRESHOLD,
} from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { distance } from '../game/geometry';
import type { Hint, Puzzle } from '../game/types';
import LinkLayer from './LinkLayer';
import type { ScreenPoint } from './LinkLayer';
import StarNode from './StarNode';

interface Props {
  puzzle: Puzzle;
  edges: string[];
  degrees: Record<string, number>;
  selected: string | null;
  hint: Hint | null;
  inputDisabled: boolean;
  palette: Palette;
  onPair: (a: string, b: string) => void;
  onSelect: (id: string | null) => void;
}

interface Preview {
  from: string;
  x: number;
  y: number;
}

/**
 * Fixed square board. Logical 5x5 coordinates are converted once; the board
 * itself never moves while the player drags.
 */
export const SkyBoard = ({
  puzzle,
  edges,
  degrees,
  selected,
  hint,
  inputDisabled,
  palette,
  onPair,
  onSelect,
}: Props) => {
  const [preview, setPreview] = useState<Preview | null>(null);

  const points = useMemo(() => {
    const map: Record<string, ScreenPoint> = {};
    puzzle.stars.forEach(s => {
      map[s.id] = { x: GRID_INSET + s.x * GRID_PITCH, y: GRID_INSET + s.y * GRID_PITCH };
    });
    return map;
  }, [puzzle]);

  // mutable copies for the gesture callbacks — never read state inside them
  const pointsRef = useRef(points);
  pointsRef.current = points;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const disabledRef = useRef(inputDisabled);
  disabledRef.current = inputDisabled;
  const onPairRef = useRef(onPair);
  onPairRef.current = onPair;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const originRef = useRef({ x: 0, y: 0 });
  const dragFromRef = useRef<string | null>(null);
  const multiTouchRef = useRef(false);

  const hitTest = useCallback((x: number, y: number): string | null => {
    const map = pointsRef.current;
    const ids = Object.keys(map).sort();
    let best: string | null = null;
    let bestDistance = HIT_RADIUS;
    for (let i = 0; i < ids.length; i += 1) {
      const p = map[ids[i]];
      const d = distance(x, y, p.x, p.y);
      if (d < bestDistance) {
        bestDistance = d;
        best = ids[i];
      }
    }
    return best;
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderTerminationRequest: () => false,

        onPanResponderGrant: (event, gesture) => {
          if (disabledRef.current) return;
          multiTouchRef.current = gesture.numberActiveTouches > 1;
          originRef.current = {
            x: gesture.x0 - event.nativeEvent.locationX,
            y: gesture.y0 - event.nativeEvent.locationY,
          };
          const local = {
            x: event.nativeEvent.locationX,
            y: event.nativeEvent.locationY,
          };
          const star = hitTest(local.x, local.y);
          dragFromRef.current = star;
          if (star) {
            const p = pointsRef.current[star];
            setPreview({ from: star, x: p.x, y: p.y });
          } else {
            setPreview(null);
          }
        },

        onPanResponderMove: (_event, gesture) => {
          if (disabledRef.current || multiTouchRef.current) return;
          if (gesture.numberActiveTouches > 1) {
            multiTouchRef.current = true;
            return;
          }
          const from = dragFromRef.current;
          if (!from) return;
          const x = gesture.moveX - originRef.current.x;
          const y = gesture.moveY - originRef.current.y;
          setPreview({ from, x, y });
        },

        onPanResponderRelease: (_event, gesture) => {
          const from = dragFromRef.current;
          dragFromRef.current = null;
          setPreview(null);

          if (disabledRef.current || multiTouchRef.current) {
            multiTouchRef.current = false;
            onSelectRef.current(null);
            return;
          }

          if (!from) {
            onSelectRef.current(null);
            return;
          }

          const travelled = Math.sqrt(gesture.dx * gesture.dx + gesture.dy * gesture.dy);

          if (travelled < TAP_THRESHOLD) {
            const current = selectedRef.current;
            if (current === null) {
              onSelectRef.current(from);
            } else if (current === from) {
              onSelectRef.current(null);
            } else {
              onPairRef.current(current, from);
            }
            return;
          }

          const x = gesture.moveX - originRef.current.x;
          const y = gesture.moveY - originRef.current.y;
          const target = hitTest(x, y);
          if (target && target !== from) {
            onPairRef.current(from, target);
          } else {
            onSelectRef.current(null);
          }
        },

        onPanResponderTerminate: () => {
          dragFromRef.current = null;
          multiTouchRef.current = false;
          setPreview(null);
          onSelectRef.current(null);
        },
      }),
    [hitTest],
  );

  return (
    <View
      style={[
        styles.board,
        theme.shadows.panel,
        { backgroundColor: palette.boardFill, borderColor: palette.boardBorder },
      ]}>
      <View style={styles.inner} {...panResponder.panHandlers}>
        <LinkLayer
          size={BOARD_INNER}
          points={points}
          edges={edges}
          hint={hint}
          preview={preview}
          palette={palette}
        />
        {puzzle.stars.map(star => {
          const p = points[star.id];
          const hinted =
            hint !== null && hint.kind === 'add' && hint.key.indexOf(star.id) >= 0;
          return (
            <StarNode
              key={star.id}
              starId={star.id}
              cx={p.x}
              cy={p.y}
              current={degrees[star.id] || 0}
              required={star.required}
              selected={selected === star.id || (preview !== null && preview.from === star.id)}
              hinted={hinted}
              palette={palette}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderRadius: theme.radius.panel,
    overflow: 'visible',
  },
  inner: {
    width: BOARD_INNER,
    height: BOARD_INNER,
  },
});

export default SkyBoard;
