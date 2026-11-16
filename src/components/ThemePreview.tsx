import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { getPuzzle } from '../game/catalog';
import ConstellationPreview from './ConstellationPreview';

interface Props {
  palette: Palette;
  size: number;
}

/** Non-interactive sample board used by the Night Mode screen. */
export const ThemePreview = ({ palette, size }: Props) => {
  const puzzle = getPuzzle(9);
  return (
    <View
      accessible
      accessibilityLabel="Sample board preview"
      style={[
        styles.board,
        theme.shadows.panel,
        {
          width: size,
          height: size,
          backgroundColor: palette.boardFill,
          borderColor: palette.boardBorder,
        },
      ]}>
      <ConstellationPreview
        puzzle={puzzle}
        size={size - 24}
        lineColor={palette.line}
        starColor={palette.starCore}
        strokeWidth={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemePreview;
