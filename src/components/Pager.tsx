import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { Palette } from '../constants/theme';
import IconButton from './IconButton';

interface Props {
  page: number;
  pageCount: number;
  palette: Palette;
  tone?: 'sky' | 'page';
  onPrevious: () => void;
  onNext: () => void;
}

/** Fixed-page navigation — the collection never needs a scrolling root. */
export const Pager = ({ page, pageCount, palette, tone = 'page', onPrevious, onNext }: Props) => (
  <View style={styles.row}>
    <IconButton
      Icon={ChevronLeft}
      label="Previous page"
      palette={palette}
      tone={tone}
      disabled={page <= 0}
      onPress={onPrevious}
    />
    <Text
      style={[styles.label, { color: tone === 'sky' ? palette.skyTextSecondary : palette.pageTextSecondary }]}>
      {'Page ' + (page + 1) + ' of ' + pageCount}
    </Text>
    <IconButton
      Icon={ChevronRight}
      label="Next page"
      palette={palette}
      tone={tone}
      disabled={page >= pageCount - 1}
      onPress={onNext}
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18, fontVariant: ['tabular-nums'] },
});

export default Pager;
