import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { CHAPTER_LIST } from '../game/catalog';
import type { Chapter } from '../game/types';

interface Props {
  value: Chapter;
  palette: Palette;
  onChange: (chapter: Chapter) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Four 48 dp chapter selectors. The active chip adds a mark and an underline. */
export const SeasonTabs = ({ value, palette, onChange }: Props) => (
  <View style={styles.row}>
    {CHAPTER_LIST.map(chapter => {
      const active = chapter === value;
      return (
        <Pressable
          key={chapter}
          onPress={() => onChange(chapter)}
          hitSlop={HIT}
          accessibilityRole="tab"
          accessibilityLabel={chapter + ' chapter'}
          accessibilityState={{ selected: active }}
          style={styles.slot}>
          <View
            style={[
              styles.chip,
              {
                backgroundColor: active ? palette.primary : palette.pageCard,
                borderColor: active ? palette.primary : palette.pageCardBorder,
              },
            ]}>
            <View style={styles.chipRow}>
              {active ? <Check size={14} color={theme.colors.text} strokeWidth={2.5} /> : null}
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  { color: active ? theme.colors.text : palette.pageTextSecondary },
                ]}>
                {chapter}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.underline,
              { backgroundColor: active ? palette.accent : 'transparent' },
            ]}
          />
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  slot: { flex: 1, height: 52, justifyContent: 'space-between' },
  chip: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  underline: { height: 2, width: '100%', borderRadius: 1 },
});

export default SeasonTabs;
