import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  palette: Palette;
  Icon?: LucideIcon;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: object;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/** 56 dp gradient action. Icon box is a fixed 24 dp square with a 10 dp gap. */
export const PrimaryButton = ({
  label,
  onPress,
  palette,
  Icon,
  disabled,
  accessibilityHint,
  style,
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
          theme.shadows.button,
          { shadowColor: palette.accent, transform: [{ scale }], opacity: disabled ? 0.5 : 1 },
        ]}>
        <LinearGradient
          colors={[palette.accent, palette.accentEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={palette.onAccent} strokeWidth={2} /> : null}
            <Text numberOfLines={1} style={[styles.label, { color: palette.onAccent }]}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  press: { width: '100%', height: 56 },
  shell: { width: '100%', height: 56, borderRadius: theme.radius.button },
  fill: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: ICON,
    letterSpacing: 0.5,
  },
});

export default PrimaryButton;
