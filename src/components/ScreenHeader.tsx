import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { H_PAD, HEADER_H } from '../constants/config';
import type { Palette } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  palette: Palette;
  tone?: 'sky' | 'page';
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  align?: 'left' | 'center';
}

/**
 * The one header used by every screen. Screens vary only leftSlot / title /
 * rightSlot, so padding and type never drift between them.
 */
export const ScreenHeader = ({
  title,
  subtitle,
  palette,
  tone = 'page',
  leftSlot,
  rightSlot,
  align = 'left',
}: Props) => {
  const text = tone === 'sky' ? palette.skyText : palette.pageText;
  const muted = tone === 'sky' ? palette.skyTextMuted : palette.pageTextMuted;
  const border = tone === 'sky' ? palette.skyCardBorder : palette.pageCardBorder;
  const backing = tone === 'sky' ? 'rgba(5,5,16,0.80)' : 'rgba(237,246,245,0.22)';

  return (
    <View style={[styles.header, { borderBottomColor: border, backgroundColor: backing }]}>
      <View style={styles.slot}>{leftSlot}</View>
      <View style={[styles.middle, align === 'center' ? styles.center : styles.left]}>
        <Text
          numberOfLines={1}
          accessibilityRole="header"
          accessibilityLabel={title}
          style={[styles.title, { color: text }, align === 'center' ? styles.centerText : null]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, { color: muted }, align === 'center' ? styles.centerText : null]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.slot}>{rightSlot}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    borderBottomWidth: 1,
  },
  slot: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  middle: { flex: 1, justifyContent: 'center', paddingHorizontal: 8 },
  left: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  centerText: { textAlign: 'center' },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  subtitle: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
});

export default ScreenHeader;
