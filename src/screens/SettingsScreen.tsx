import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ConfirmDialog from '../components/ConfirmDialog';
import IconButton from '../components/IconButton';
import Pager from '../components/Pager';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SettingRow from '../components/SettingRow';
import { H_PAD } from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette, ThemeMode } from '../constants/theme';
import type { Envelope } from '../services/localStore';

interface Props {
  palette: Palette;
  envelope: Envelope;
  onTheme: (mode: ThemeMode) => void;
  onPreference: (key: 'hapticsEnabled' | 'showTimer' | 'reduceMotion', value: boolean) => void;
  onReset: () => void;
  onDone: () => void;
}

export const SettingsScreen = ({ palette, envelope, onTheme, onPreference, onReset, onDone }: Props) => {
  const [page, setPage] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <AppShell palette={palette} kind="page">
      <ScreenHeader
        title="Settings"
        subtitle={page === 0 ? 'Appearance' : 'Atlas data'}
        palette={palette}
        tone="page"
        leftSlot={
          <IconButton Icon={ChevronLeft} label="Back" palette={palette} tone="page" onPress={onDone} />
        }
      />

      <View style={styles.body}>
        {page === 0 ? (
          <View style={styles.rows}>
            <Text style={[styles.groupLabel, { color: palette.pageTextMuted }]}>THEME</Text>
            <SettingRow
              kind="choice"
              label="Light"
              description="Mint atlas pages"
              value={envelope.theme === 'light'}
              palette={palette}
              onChange={() => onTheme('light')}
            />
            <SettingRow
              kind="choice"
              label="Midnight"
              description="Dark atlas chrome"
              value={envelope.theme === 'midnight'}
              palette={palette}
              onChange={() => onTheme('midnight')}
            />
            <SettingRow
              kind="choice"
              label="Red"
              description="Dim palette for outdoor use"
              value={envelope.theme === 'red'}
              palette={palette}
              onChange={() => onTheme('red')}
            />
            <Text style={[styles.groupLabel, { color: palette.pageTextMuted }]}>FEEDBACK</Text>
            <SettingRow
              kind="switch"
              label="Show timer"
              description="Quiet elapsed time on the board"
              value={envelope.showTimer}
              palette={palette}
              onChange={next => onPreference('showTimer', next)}
            />
            <SettingRow
              kind="switch"
              label="Haptics"
              description="A short confirmation on a legal link"
              value={envelope.hapticsEnabled}
              palette={palette}
              onChange={next => onPreference('hapticsEnabled', next)}
            />
          </View>
        ) : (
          <View style={styles.rows}>
            <Text style={[styles.groupLabel, { color: palette.pageTextMuted }]}>MOTION</Text>
            <SettingRow
              kind="switch"
              label="Reduce motion"
              description="Immediate positions, no bounce"
              value={envelope.reduceMotion}
              palette={palette}
              onChange={next => onPreference('reduceMotion', next)}
            />
            <Text style={[styles.groupLabel, { color: palette.pageTextMuted }]}>ATLAS DATA</Text>
            <SecondaryButton
              label="RESET ATLAS AND STATS"
              palette={palette}
              tone="page"
              onPress={() => setConfirmVisible(true)}
            />
            <View
              style={[
                styles.identity,
                { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder },
              ]}>
              <Check size={18} color={palette.primary} strokeWidth={2.5} />
              <Text numberOfLines={2} style={[styles.identityText, { color: palette.pageTextSecondary }]}>
                {'Constellation Connect · Offline puzzle atlas'}
              </Text>
            </View>
          </View>
        )}

        <Pager
          page={page}
          pageCount={2}
          palette={palette}
          tone="page"
          onPrevious={() => setPage(0)}
          onNext={() => setPage(1)}
        />

        <PrimaryButton label="DONE" palette={palette} onPress={onDone} />
      </View>

      <ConfirmDialog
        visible={confirmVisible}
        title="Reset all 88 skies, saved attempts and stats?"
        body="Theme, timer and motion preferences are kept."
        confirmLabel="RESET ATLAS"
        palette={palette}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          onReset();
        }}
      />
    </AppShell>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: H_PAD, paddingTop: 14, paddingBottom: 20 },
  rows: { flex: 1, gap: 10, justifyContent: 'center' },
  groupLabel: { fontSize: 11, fontWeight: '700', lineHeight: 15, letterSpacing: 1.2 },
  identity: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  identityText: { flex: 1, fontSize: 13, fontWeight: '500', lineHeight: 18 },
});

export default SettingsScreen;
