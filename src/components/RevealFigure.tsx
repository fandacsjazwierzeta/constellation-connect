import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { assets } from '../assets';
import type { Palette } from '../constants/theme';
import type { Puzzle } from '../game/types';
import ConstellationPreview from './ConstellationPreview';

interface Props {
  puzzle: Puzzle;
  finalEdges: string[];
  size: number;
  palette: Palette;
  animate: boolean;
}

/**
 * The completed graph as gold linework, with four soft sparkles placed well
 * outside the heading area. Only opacity and scale animate.
 */
export const RevealFigure = ({ puzzle, finalEdges, size, palette, animate }: Props) => {
  const appear = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate) {
      appear.setValue(1);
      pulse.setValue(1);
      return;
    }
    Animated.timing(appear, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 200, useNativeDriver: true }),
      Animated.spring(pulse, { toValue: 1, tension: 140, friction: 9, useNativeDriver: true }),
    ]).start();
  }, [animate, appear, pulse]);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.figure, { opacity: appear, transform: [{ scale: pulse }] }]}>
        <ConstellationPreview
          puzzle={puzzle}
          size={size}
          edges={finalEdges}
          lineColor={palette.line}
          starColor={palette.starCore}
          strokeWidth={3}
        />
      </Animated.View>

      {palette.showRaster ? (
        <>
          <Image source={assets.sprite3} style={[styles.sparkle, styles.sparkleTopLeft]} />
          <Image source={assets.sprite1} style={[styles.sparkle, styles.sparkleTopRight]} />
          <Image source={assets.sprite1} style={[styles.sparkle, styles.sparkleBottomLeft]} />
          <Image source={assets.sprite3} style={[styles.sparkle, styles.sparkleBottomRight]} />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  figure: { alignItems: 'center', justifyContent: 'center' },
  sparkle: { position: 'absolute', width: 26, height: 26, resizeMode: 'contain', opacity: 0.75 },
  sparkleTopLeft: { left: 8, top: 8 },
  sparkleTopRight: { right: 8, top: 14 },
  sparkleBottomLeft: { left: 14, bottom: 10 },
  sparkleBottomRight: { right: 10, bottom: 8 },
});

export default RevealFigure;
