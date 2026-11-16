import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  palette: Palette;
  Icon?: LucideIcon;
  disabled?: boolean;
  tone?: 'sky' | 'page' | 'teal';
  style?: object;
  accessibilityHint?: string;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/** 48 dp translucent action. Same icon box and gap as PrimaryButton. */
export const SecondaryButton = ({
  label,
  onPress,
  palette,
  Icon,
  disabled,
  tone = 'sky',
  style,
  accessibilityHint,
}: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
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

  const fill =
    tone === 'teal' ? palette.primary : tone === 'page' ? palette.pageCard : palette.skyCard;
  const border =
    tone === 'teal' ? palette.primary : tone === 'page' ? palette.pageCardBorder : palette.skyCardBorder;
  const color =
    tone === 'teal'
      ? palette.mode === 'red'
        ? palette.skyText
        : theme.colors.text
      : tone === 'page'
      ? palette.pageText
      : palette.skyText;

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
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          {
            transform: [{ scale }],
            backgroundColor: fill,
            borderColor: border,
            opacity: disabled ? 0.45 : 1,
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={color} strokeWidth={1.75} /> : null}
          <Text numberOfLines={1} style={[styles.label, { color }]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  press: { width: '100%', height: 48 },
  shell: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.secondary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: ICON,
    letterSpacing: 0.4,
  },
});

export default SecondaryButton;
