import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Palette } from '../constants/theme';

interface Props {
  current: number;
  total: number;
  palette: Palette;
  label?: string;
  tone?: 'sky' | 'page';
  height?: number;
}

/**
 * Static fill width — a track percentage is a layout property, so it is set
 * directly rather than driven by a native-driver animation.
 */
export const ProgressTrack = ({ current, total, palette, label, tone = 'page', height = 6 }: Props) => {
  const safeTotal = total > 0 ? total : 1;
  const ratio = Math.max(0, Math.min(1, current / safeTotal));
  const percent = Math.round(ratio * 100);
  const trackColor = tone === 'sky' ? palette.skyCardBorder : 'rgba(24,36,34,0.12)';

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={(label || 'Progress') + ', ' + percent + ' percent'}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: tone === 'sky' ? palette.skyTextMuted : palette.pageTextMuted }]}>
            {label}
          </Text>
          <Text style={[styles.percent, { color: palette.primary }]}>{percent + '%'}</Text>
        </View>
      ) : null}
      <View style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }]}>
        <View style={{ flexGrow: ratio, flexShrink: 0, flexBasis: 0, backgroundColor: palette.primary }} />
        <View style={{ flexGrow: 1 - ratio, flexShrink: 0, flexBasis: 0 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '500', lineHeight: 16, textTransform: 'uppercase', letterSpacing: 0.6 },
  percent: { fontSize: 12, fontWeight: '700', lineHeight: 16 },
  track: { width: '100%', overflow: 'hidden', flexDirection: 'row' },
});

export default ProgressTrack;
