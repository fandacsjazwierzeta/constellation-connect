import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  heading: string;
  tale: string;
  palette: Palette;
  tone?: 'sky' | 'page';
  showSeal?: boolean;
}

/**
 * The supplied catalogue text in an 18 dp glass card. The seal sits at a
 * positive inset so it never pokes out of the rounded corner.
 */
export const AtlasTale = ({ heading, tale, palette, tone = 'sky', showSeal }: Props) => (
  <View
    style={[
      styles.card,
      theme.shadows.card,
      {
        backgroundColor: tone === 'sky' ? palette.skyCard : palette.pageCard,
        borderColor: tone === 'sky' ? palette.skyCardBorder : palette.pageCardBorder,
      },
    ]}>
    <Text style={[styles.heading, { color: palette.line }]}>{heading}</Text>
    <Text style={[styles.tale, { color: tone === 'sky' ? palette.skyTextSecondary : palette.pageTextSecondary }]}>
      {tale}
    </Text>
    {showSeal && palette.showRaster ? (
      <Image source={assets.sprite5} style={styles.seal} />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  heading: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  tale: { fontSize: 15, fontWeight: '400', lineHeight: 22, paddingRight: 40 },
  seal: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 34,
    height: 34,
    resizeMode: 'contain',
    opacity: 0.85,
  },
});

export default AtlasTale;
