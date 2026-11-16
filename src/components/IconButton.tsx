import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  Icon: LucideIcon;
  label: string;
  onPress: () => void;
  palette: Palette;
  disabled?: boolean;
  selected?: boolean;
  showLabel?: boolean;
  tone?: 'sky' | 'page';
  accessibilityHint?: string;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * One 48 dp icon target. The Pressable is always the parent and the animated
 * artwork is its child, so presses are never swallowed on Android release.
 */
export const IconButton = ({
  Icon,
  label,
  onPress,
  palette,
  disabled,
  selected,
  showLabel,
  tone = 'sky',
  accessibilityHint,
}: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.94,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const baseColor = tone === 'sky' ? palette.skyText : palette.pageText;
  const idleFill = tone === 'sky' ? palette.skyCard : palette.pageCard;
  const idleBorder = tone === 'sky' ? palette.skyCardBorder : palette.pageCardBorder;
  const color = disabled ? palette.skyTextMuted : selected ? palette.onAccent : baseColor;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, selected: !!selected }}
      style={showLabel ? styles.wrapWithLabel : styles.wrap}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.box,
          {
            transform: [{ scale }],
            backgroundColor: selected ? palette.accent : idleFill,
            borderColor: selected ? palette.accent : idleBorder,
            opacity: disabled ? 0.45 : 1,
          },
        ]}>
        <Icon size={24} color={color} strokeWidth={1.75} />
      </Animated.View>
      {showLabel ? (
        <Text numberOfLines={1} style={[styles.label, { color: disabled ? palette.skyTextMuted : palette.skyTextSecondary }]}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  wrapWithLabel: { width: 60, height: 66, alignItems: 'center', justifyContent: 'center' },
  box: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default IconButton;
