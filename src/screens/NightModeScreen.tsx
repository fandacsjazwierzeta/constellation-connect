import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, Moon } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SettingRow from '../components/SettingRow';
import ThemePreview from '../components/ThemePreview';
import { H_PAD, SCREEN_W } from '../constants/config';
import { theme } from '../constants/theme';
import { getPalette } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  palette: Palette;
  isRedActive: boolean;
  muteInRed: boolean;
  onMuteChange: (next: boolean) => void;
  onApply: () => void;
  onUsePrevious: () => void;
  onBack: () => void;
}

const PREVIEW = Math.min(176, SCREEN_W - 140);

/** The preview always shows the red palette; the app theme changes on Apply. */
export const NightModeScreen = ({
  palette,
  isRedActive,
  muteInRed,
  onMuteChange,
  onApply,
  onUsePrevious,
  onBack,
}: Props) => {
  const redPalette = getPalette('red');

  return (
    <AppShell
      palette={palette}
      kind="page"
      gradient={[theme.colors.redBase, theme.colors.redSurface, theme.colors.redRaised]}
      overlayOpacity={0.94}>
      <ScreenHeader
        title="Night Mode"
        subtitle="A dim red palette"
        palette={redPalette}
        tone="page"
        leftSlot={
          <IconButton Icon={ChevronLeft} label="Back" palette={redPalette} tone="page" onPress={onBack} />
        }
      />

      <View style={styles.body}>
        <Text style={[styles.title, { color: redPalette.pageText }]}>Outdoor red theme</Text>

        <View style={styles.previewArea}>
          <ThemePreview palette={redPalette} size={PREVIEW} />
        </View>

        <GlassCard palette={redPalette} tone="page" radius={theme.radius.panel} style={styles.card}>
          <Text style={[styles.cardText, { color: redPalette.pageTextSecondary }]}>
            A dim red palette for using the atlas outdoors. Bright decoration, gold linework and
            white highlights are suppressed; every link stays readable.
          </Text>
        </GlassCard>

        <SettingRow
          kind="switch"
          label="Keep sounds off in red mode"
          value={muteInRed}
          palette={redPalette}
          onChange={onMuteChange}
        />

        <View style={styles.spacer} />

        <PrimaryButton
          label={isRedActive ? 'KEEP RED THEME' : 'APPLY RED THEME'}
          Icon={Moon}
          palette={redPalette}
          onPress={onApply}
        />
        <View style={styles.gap} />
        <SecondaryButton
          label="USE PREVIOUS THEME"
          palette={redPalette}
          tone="page"
          onPress={onUsePrevious}
        />
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: H_PAD, paddingTop: 14, paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', lineHeight: 32, marginBottom: 12 },
  previewArea: { alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  card: { marginBottom: 12 },
  cardText: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  spacer: { flex: 1, minHeight: 12 },
  gap: { height: 10 },
});

export default NightModeScreen;
