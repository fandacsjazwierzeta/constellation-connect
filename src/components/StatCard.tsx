import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  Icon: LucideIcon;
  value: string;
  label: string;
  valueColor: string;
  palette: Palette;
  tone?: 'sky' | 'page';
  accessibilityLabel?: string;
}

/**
 * One shared card for Reveal and Stats. Every pill in a row has the same width,
 * height, padding and radius; only the colour, number and label differ.
 * The root is the flex child — nothing inside it uses flex, so the content
 * never collapses (circular flex bug).
 */
export const StatCard = ({
  Icon,
  value,
  label,
  valueColor,
  palette,
  tone = 'page',
  accessibilityLabel,
}: Props) => (
  <View
    accessible
    accessibilityLabel={accessibilityLabel || label + ', ' + value}
    style={[
      styles.card,
      theme.shadows.card,
      {
        backgroundColor: tone === 'sky' ? palette.skyCard : palette.pageCard,
        borderColor: valueColor + '55',
      },
    ]}>
    <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
      <Icon size={22} color={valueColor} strokeWidth={2} />
    </View>
    <Text numberOfLines={1} style={[styles.value, { color: valueColor }]}>
      {value}
    </Text>
    <Text numberOfLines={2} style={[styles.label, { color: tone === 'sky' ? palette.skyTextMuted : palette.pageTextMuted }]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    textAlign: 'center',
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

export default StatCard;
