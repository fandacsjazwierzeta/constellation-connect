import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { BarChart3, BookOpen, Moon, Settings, X } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import SecondaryButton from './SecondaryButton';

interface Props {
  visible: boolean;
  palette: Palette;
  onRules: () => void;
  onStats: () => void;
  onSettings: () => void;
  onNight: () => void;
  onClose: () => void;
}

/** Thumb-zone navigation shared by Atlas and the board. */
export const MoreSheet = ({
  visible,
  palette,
  onRules,
  onStats,
  onSettings,
  onNight,
  onClose,
}: Props) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={[styles.scrim, { backgroundColor: palette.scrim }]}>
      <View
        style={[
          styles.panel,
          theme.shadows.panel,
          { backgroundColor: palette.sheetFill, borderColor: palette.skyCardBorder },
        ]}>
        <Text style={[styles.title, { color: palette.sheetText }]}>More</Text>
        <SecondaryButton label="RULES" Icon={BookOpen} palette={palette} onPress={onRules} />
        <View style={styles.gap} />
        <SecondaryButton label="STATS" Icon={BarChart3} palette={palette} onPress={onStats} />
        <View style={styles.gap} />
        <SecondaryButton label="NIGHT MODE" Icon={Moon} palette={palette} onPress={onNight} />
        <View style={styles.gap} />
        <SecondaryButton label="SETTINGS" Icon={Settings} palette={palette} onPress={onSettings} />
        <View style={styles.gap} />
        <SecondaryButton label="CLOSE" Icon={X} palette={palette} onPress={onClose} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 24 },
  panel: {
    width: '100%',
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 26, marginBottom: 14 },
  gap: { height: 10 },
});

export default MoreSheet;
