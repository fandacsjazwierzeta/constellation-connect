import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { getPuzzle } from '../game/catalog';
import type { CatalogEntry } from '../game/types';
import ConstellationPreview from './ConstellationPreview';

interface Props {
  entry: CatalogEntry;
  completed: boolean;
  selected: boolean;
  palette: Palette;
  onSelect: (id: number) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const PREVIEW = 36;

const AtlasTileBase = ({ entry, completed, selected, palette, onSelect }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  const puzzle = getPuzzle(entry.id);

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

  const handlePress = useCallback(() => onSelect(entry.id), [entry.id, onSelect]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={entry.name + ', ' + entry.tier + (completed ? ', mapped' : '')}
      accessibilityState={{ selected }}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          {
            transform: [{ scale }],
            backgroundColor: palette.pageCard,
            borderColor: selected ? palette.accent : palette.pageCardBorder,
            borderWidth: selected ? 2 : 1,
          },
        ]}>
        <View style={styles.textCol}>
          <Text numberOfLines={1} style={[styles.name, { color: palette.pageText }]}>
            {entry.name}
          </Text>
          <View style={styles.metaRow}>
            {completed ? <Check size={12} color={palette.primary} strokeWidth={3} /> : null}
            <Text numberOfLines={1} style={[styles.tier, { color: completed ? palette.primary : palette.pageTextMuted }]}>
              {completed ? 'Mapped' : entry.tier}
            </Text>
          </View>
        </View>
        <View style={styles.preview}>
          <ConstellationPreview
            puzzle={puzzle}
            size={PREVIEW}
            lineColor={completed ? palette.primary : palette.pageTextMuted}
            starColor={completed ? palette.accent : palette.pageTextSecondary}
            outlined={!completed}
            strokeWidth={1.4}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  press: { flex: 1, height: 72 },
  tile: {
    width: '100%',
    height: 72,
    borderRadius: theme.radius.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  textCol: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  tier: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  preview: { width: PREVIEW, height: PREVIEW, alignItems: 'center', justifyContent: 'center' },
});

export const AtlasTile = React.memo(AtlasTileBase);

export default AtlasTile;
