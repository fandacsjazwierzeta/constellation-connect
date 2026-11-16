import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  palette: Palette;
  tone?: 'sky' | 'page';
  selected?: boolean;
  padding?: number;
  radius?: number;
  style?: object;
  children: React.ReactNode;
}

export const GlassCard = ({
  palette,
  tone = 'page',
  selected,
  padding = 16,
  radius = theme.radius.card,
  style,
  children,
}: Props) => (
  <View
    style={[
      styles.card,
      theme.shadows.card,
      {
        padding,
        borderRadius: radius,
        backgroundColor: tone === 'sky' ? palette.skyCard : palette.pageCard,
        borderColor: selected ? palette.accent : tone === 'sky' ? palette.skyCardBorder : palette.pageCardBorder,
        borderWidth: selected ? 2 : 1,
      },
      style,
    ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
});

export default GlassCard;
