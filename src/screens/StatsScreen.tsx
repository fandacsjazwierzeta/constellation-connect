import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, ChevronLeft, Clock, Hash, Lightbulb, Play, Star, Target, Timer } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ConstellationPreview from '../components/ConstellationPreview';
import IconButton from '../components/IconButton';
import Pager from '../components/Pager';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import { CATALOG_SIZE, H_PAD } from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { CATALOG, getPuzzle } from '../game/catalog';
import { averageMs, uniqueCount } from '../game/progress';
import type { AggregateStats, CompletedMap } from '../game/progress';
import { formatTime, formatTotal } from '../utils/formatTime';

interface Props {
  palette: Palette;
  stats: AggregateStats;
  completed: CompletedMap;
  onPlay: () => void;
  onBack: () => void;
}

interface Card {
  Icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

export const StatsScreen = ({ palette, stats, completed, onPlay, onBack }: Props) => {
  const [page, setPage] = useState(0);
  const mapped = uniqueCount(completed);
  const empty = stats.completedAttempts === 0;

  const pageOne: Card[] = [
    { Icon: Star, value: mapped + '/' + CATALOG_SIZE, label: 'constellations mapped', color: palette.primary },
    { Icon: Check, value: String(stats.completedAttempts), label: 'completed attempts', color: palette.line },
    { Icon: Clock, value: formatTotal(stats.totalActiveMs), label: 'total solve time', color: palette.accent },
    { Icon: Target, value: formatTime(averageMs(stats)), label: 'average attempt', color: palette.primary },
  ];

  const pageTwo: Card[] = [
    { Icon: Timer, value: formatTime(stats.fastestMs), label: 'fastest solve', color: palette.primary },
    { Icon: Hash, value: String(stats.totalMoves), label: 'accepted moves', color: palette.line },
  ];
  if (stats.attemptsWithHint > 0) {
    pageTwo.push({
      Icon: Lightbulb,
      value: String(stats.attemptsWithHint),
      label: 'attempts with a hint',
      color: palette.accent,
    });
    pageTwo.push({
      Icon: Lightbulb,
      value: String(stats.totalHints),
      label: 'hints requested',
      color: palette.accent,
    });
  }

  const cards = page === 0 ? pageOne : pageTwo;
  const rows: Card[][] = [];
  for (let i = 0; i < cards.length; i += 2) {
    const row = cards.slice(i, i + 2);
    if (row.length === 2) rows.push(row);
  }

  const recent = stats.lastSolvedId > 0 ? CATALOG[stats.lastSolvedId - 1] : null;

  return (
    <AppShell palette={palette} kind="page">
      <ScreenHeader
        title="Stats"
        subtitle={empty ? 'No completed skies yet' : mapped + ' of ' + CATALOG_SIZE + ' mapped'}
        palette={palette}
        tone="page"
        leftSlot={
          <IconButton Icon={ChevronLeft} label="Back" palette={palette} tone="page" onPress={onBack} />
        }
      />

      <View style={styles.body}>
        <Text style={[styles.title, { color: palette.pageText }]}>Your story so far</Text>

        {empty ? (
          <View style={styles.emptyBlock}>
            <ConstellationPreview
              puzzle={getPuzzle(1)}
              size={120}
              lineColor={palette.pageTextMuted}
              starColor={palette.primary}
              outlined
              strokeWidth={1.6}
            />
            <Text style={[styles.emptyText, { color: palette.pageTextSecondary }]}>
              Complete a sky to begin your story.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {rows.map((row, i) => (
              <View key={'row' + i} style={styles.gridRow}>
                {row.map(card => (
                  <StatCard
                    key={card.label}
                    Icon={card.Icon}
                    value={card.value}
                    label={card.label}
                    valueColor={card.color}
                    palette={palette}
                    tone="page"
                  />
                ))}
              </View>
            ))}

            {recent ? (
              <View
                style={[
                  styles.recent,
                  { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder },
                ]}>
                <View style={styles.recentText}>
                  <Text style={[styles.recentLabel, { color: palette.pageTextMuted }]}>
                    Most recent solve
                  </Text>
                  <Text numberOfLines={1} style={[styles.recentName, { color: palette.pageText }]}>
                    {recent.name}
                  </Text>
                  <Text style={[styles.recentTime, { color: palette.primary }]}>
                    {formatTime(stats.lastSolvedMs)}
                  </Text>
                </View>
                <ConstellationPreview
                  puzzle={getPuzzle(recent.id)}
                  size={54}
                  lineColor={palette.primary}
                  starColor={palette.accent}
                  strokeWidth={1.6}
                />
              </View>
            ) : null}
          </View>
        )}

        {empty ? null : (
          <Pager
            page={page}
            pageCount={2}
            palette={palette}
            tone="page"
            onPrevious={() => setPage(0)}
            onNext={() => setPage(1)}
          />
        )}

        <PrimaryButton label="PLAY" Icon={Play} palette={palette} onPress={onPlay} />
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: H_PAD, paddingTop: 14, paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', lineHeight: 32, marginBottom: 12 },
  grid: { flex: 1, justifyContent: 'center', gap: 10, paddingVertical: 8 },
  gridRow: { flexDirection: 'row', gap: 10 },
  emptyBlock: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  emptyText: { fontSize: 15, fontWeight: '500', lineHeight: 22, textAlign: 'center' },
  recent: {
    height: 100,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentText: { flex: 1 },
  recentLabel: { fontSize: 11, fontWeight: '600', lineHeight: 15, letterSpacing: 0.8, textTransform: 'uppercase' },
  recentName: { fontSize: 18, fontWeight: '700', lineHeight: 24, marginTop: 2 },
  recentTime: { fontSize: 14, fontWeight: '600', lineHeight: 18, fontVariant: ['tabular-nums'] },
});

export default StatsScreen;
