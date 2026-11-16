import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { BookOpen, Home, Moon, Play, RotateCcw } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface Props {
  visible: boolean;
  palette: Palette;
  onResume: () => void;
  onRules: () => void;
  onNight: () => void;
  onRestart: () => void;
  onAtlas: () => void;
}

/** Freezes the attempt; the drag and the source selection are already cleared. */
export const PauseSheet = ({
  visible,
  palette,
  onResume,
  onRules,
  onNight,
  onRestart,
  onAtlas,
}: Props) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onResume}>
    <View style={[styles.scrim, { backgroundColor: palette.scrim }]}>
      <View
        style={[
          styles.panel,
          theme.shadows.panel,
          { backgroundColor: palette.sheetFill, borderColor: palette.skyCardBorder },
        ]}>
        <Text style={[styles.title, { color: palette.sheetText }]}>Sky paused</Text>
        <Text style={[styles.hint, { color: palette.skyTextMuted }]}>
          Every accepted link is already saved.
        </Text>
        <PrimaryButton label="RESUME" Icon={Play} palette={palette} onPress={onResume} />
        <View style={styles.gap} />
        <SecondaryButton label="RULES" Icon={BookOpen} palette={palette} onPress={onRules} />
        <View style={styles.gap} />
        <SecondaryButton label="NIGHT MODE" Icon={Moon} palette={palette} onPress={onNight} />
        <View style={styles.gap} />
        <SecondaryButton label="PLAY AGAIN" Icon={RotateCcw} palette={palette} onPress={onRestart} />
        <View style={styles.gap} />
        <SecondaryButton label="STAR ATLAS" Icon={Home} palette={palette} onPress={onAtlas} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  scrim: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  panel: {
    width: '100%',
    maxWidth: 360,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  hint: { fontSize: 13, fontWeight: '500', lineHeight: 18, marginTop: 4, marginBottom: 18 },
  gap: { height: 10 },
});

export default PauseSheet;
