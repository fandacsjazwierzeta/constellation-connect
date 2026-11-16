import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { FADE_MS } from '../constants/config';
import type { Palette } from '../constants/theme';

interface Props {
  message: string;
  palette: Palette;
  reduceMotion: boolean;
}

/**
 * Reserved 24 dp strip. The height is always occupied so a message never
 * shifts the board, and only opacity animates (native driver safe).
 */
export const FeedbackLine = ({ message, palette, reduceMotion }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: message ? 1 : 0,
      duration: reduceMotion ? 100 : FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [message, opacity, reduceMotion]);

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }]}>
      <Text numberOfLines={1} style={[styles.text, { color: palette.skyTextSecondary }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { height: 24, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing: 0.2 },
});

export default FeedbackLine;
