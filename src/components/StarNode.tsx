import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CAPSULE_H, CAPSULE_W, STAR_CORE, STAR_GLOW, STAR_TARGET } from '../constants/config';
import type { Palette } from '../constants/theme';

interface Props {
  starId: string;
  cx: number;
  cy: number;
  current: number;
  required: number;
  selected: boolean;
  hinted: boolean;
  palette: Palette;
}

const remainingText = (current: number, required: number): string => {
  const left = Math.max(0, required - current);
  if (left === 0) return 'all links made';
  if (left === 1) return 'one link remaining';
  return left + ' links remaining';
};

/**
 * Visual only — the board PanResponder owns input, so this never intercepts
 * touches. The accessibility node keeps the star reachable without dragging.
 */
const StarNodeBase = ({ starId, cx, cy, current, required, selected, hinted, palette }: Props) => {
  const matched = current === required;
  const capsuleBorder = matched ? palette.primary : palette.skyCardBorder;

  return (
    <View
      pointerEvents="none"
      accessible
      accessibilityRole="button"
      accessibilityLabel={
        'Star ' + starId + ', ' + current + ' of ' + required + ' links, ' + remainingText(current, required)
      }
      style={[styles.hit, { left: cx - STAR_TARGET / 2, top: cy - STAR_TARGET / 2 }]}>
      <View
        style={[
          styles.glow,
          { backgroundColor: palette.starGlow, opacity: hinted ? 0.4 : selected ? 0.34 : 0.18 },
        ]}
      />
      {selected || hinted ? (
        <View style={[styles.ring, { borderColor: palette.accent }]} />
      ) : null}
      <View style={[styles.core, { backgroundColor: palette.starCore }]} />
      {matched ? <View style={[styles.check, { borderColor: palette.primary }]} /> : null}
      <View
        style={[
          styles.capsule,
          { borderColor: capsuleBorder, backgroundColor: palette.boardFill },
        ]}>
        <Text style={[styles.count, { color: matched ? palette.primary : palette.skyTextSecondary }]}>
          {current + '/' + required}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hit: {
    position: 'absolute',
    width: STAR_TARGET,
    height: STAR_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: STAR_GLOW,
    height: STAR_GLOW,
    borderRadius: STAR_GLOW / 2,
  },
  ring: {
    position: 'absolute',
    width: STAR_TARGET - 8,
    height: STAR_TARGET - 8,
    borderRadius: (STAR_TARGET - 8) / 2,
    borderWidth: 2,
  },
  core: {
    width: STAR_CORE,
    height: STAR_CORE,
    borderRadius: STAR_CORE / 2,
  },
  check: {
    position: 'absolute',
    width: STAR_CORE + 8,
    height: STAR_CORE + 8,
    borderRadius: (STAR_CORE + 8) / 2,
    borderWidth: 1.5,
  },
  capsule: {
    position: 'absolute',
    top: STAR_TARGET / 2 + 8,
    width: CAPSULE_W,
    height: CAPSULE_H,
    borderRadius: CAPSULE_H / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
  },
});

export const StarNode = React.memo(StarNodeBase);

export default StarNode;
