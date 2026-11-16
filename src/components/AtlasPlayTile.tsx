import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Play } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { getPuzzle } from '../game/catalog';
import type { CatalogEntry } from '../game/types';
import ConstellationPreview from './ConstellationPreview';
import PrimaryButton from './PrimaryButton';

interface Props {
  entry: CatalogEntry;
  completed: boolean;
  hasSavedAttempt: boolean;
  palette: Palette;
  onPlay: () => void;
}

/**
 * Left cell of the lower bento row: the selected sky, its graph and the main
 * action. Guidance sits ABOVE the button so the shadow never covers it.
 */
export const AtlasPlayTile = ({ entry, completed, hasSavedAttempt, palette, onPlay }: Props) => {
  const puzzle = getPuzzle(entry.id);
  const label = completed ? 'PLAY AGAIN' : 'PLAY';
  const guidance = hasSavedAttempt
    ? 'Continue saved sky'
    : completed
    ? 'Mapped — map it again'
    : entry.tier + ' sky';

  return (
    <View
      style={[
        styles.cell,
        theme.shadows.card,
        { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder },
      ]}>
      <View style={styles.top}>
        <View style={styles.textCol}>
          <Text numberOfLines={1} style={[styles.name, { color: palette.pageText }]}>
            {entry.name}
          </Text>
          <Text numberOfLines={1} style={[styles.guidance, { color: palette.pageTextMuted }]}>
            {guidance}
          </Text>
        </View>
        <ConstellationPreview
          puzzle={puzzle}
          size={44}
          lineColor={palette.primary}
          starColor={palette.accent}
          strokeWidth={1.6}
        />
      </View>
      <PrimaryButton label={label} Icon={Play} palette={palette} onPress={onPlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 62,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  textCol: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', lineHeight: 24 },
  guidance: { fontSize: 12, fontWeight: '500', lineHeight: 16, marginTop: 2 },
});

export default AtlasPlayTile;
