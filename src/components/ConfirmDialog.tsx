import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface Props {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  palette: Palette;
  onCancel: () => void;
  onConfirm: () => void;
}

/** In-app glass dialog. Cancel comes first so it takes initial focus. */
export const ConfirmDialog = ({
  visible,
  title,
  body,
  confirmLabel,
  palette,
  onCancel,
  onConfirm,
}: Props) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={[styles.scrim, { backgroundColor: palette.scrim }]}>
      <View
        style={[
          styles.panel,
          theme.shadows.panel,
          { backgroundColor: palette.sheetFill, borderColor: palette.skyCardBorder },
        ]}>
        <Text style={[styles.title, { color: palette.sheetText }]}>{title}</Text>
        <Text style={[styles.body, { color: palette.skyTextSecondary }]}>{body}</Text>
        <SecondaryButton label="CANCEL" palette={palette} onPress={onCancel} style={styles.cancel} />
        <PrimaryButton label={confirmLabel} palette={palette} onPress={onConfirm} />
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
  title: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22, marginTop: 8, marginBottom: 18 },
  cancel: { marginBottom: 12 },
});

export default ConfirmDialog;
