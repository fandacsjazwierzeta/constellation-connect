import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BookOpen, Lightbulb, MoreHorizontal, Redo2, Undo2 } from 'lucide-react-native';
import { H_PAD } from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import IconButton from './IconButton';
import SecondaryButton from './SecondaryButton';

interface Props {
  palette: Palette;
  canUndo: boolean;
  canRedo: boolean;
  sourceSelected: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onMore: () => void;
  onClear: () => void;
  onRules: () => void;
}

/** Raised translucent bar in the thumb zone. */
export const FloatingControls = ({
  palette,
  canUndo,
  canRedo,
  sourceSelected,
  onUndo,
  onRedo,
  onHint,
  onMore,
  onClear,
  onRules,
}: Props) => (
  <View
    style={[
      styles.bar,
      theme.shadows.panel,
      { backgroundColor: palette.sheetFill, borderColor: palette.skyCardBorder },
    ]}>
    <View style={styles.row}>
      <IconButton
        Icon={Undo2}
        label="Undo"
        showLabel
        palette={palette}
        disabled={!canUndo}
        onPress={onUndo}
        accessibilityHint={canUndo ? 'Reverse the last link' : 'No link to reverse yet'}
      />
      <IconButton
        Icon={Redo2}
        label="Redo"
        showLabel
        palette={palette}
        disabled={!canRedo}
        onPress={onRedo}
        accessibilityHint={canRedo ? 'Reapply the last reversed link' : 'Nothing to reapply'}
      />
      <IconButton
        Icon={Lightbulb}
        label="Hint"
        showLabel
        palette={palette}
        onPress={onHint}
        accessibilityHint="Free hint, always available"
      />
      <IconButton Icon={MoreHorizontal} label="More" showLabel palette={palette} onPress={onMore} />
    </View>

    {sourceSelected ? (
      <SecondaryButton
        label="CLEAR SELECTION"
        palette={palette}
        tone="teal"
        onPress={onClear}
        style={styles.action}
      />
    ) : (
      <SecondaryButton
        label="RULES"
        Icon={BookOpen}
        palette={palette}
        onPress={onRules}
        style={styles.action}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: H_PAD,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  action: { width: '100%' },
});

export default FloatingControls;
