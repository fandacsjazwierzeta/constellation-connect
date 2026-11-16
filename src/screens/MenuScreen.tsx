import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BarChart3, BookOpen, Compass, MoreHorizontal, Moon, Settings } from 'lucide-react-native';
import { assets } from '../assets';
import AppShell from '../components/AppShell';
import AtlasPlayTile from '../components/AtlasPlayTile';
import AtlasTile from '../components/AtlasTile';
import IconButton from '../components/IconButton';
import Pager from '../components/Pager';
import ScreenHeader from '../components/ScreenHeader';
import SeasonTabs from '../components/SeasonTabs';
import {
  CATALOG_SIZE,
  CHAPTER_SIZE,
  COMPACT,
  FADE_MS,
  H_PAD,
  PAGES_PER_CHAPTER,
  TILES_PER_PAGE,
} from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { CATALOG, chapterEntries } from '../game/catalog';
import { chapterCompleted, uniqueCount } from '../game/progress';
import type { CompletedMap } from '../game/progress';
import type { Chapter } from '../game/types';

interface Props {
  palette: Palette;
  chapter: Chapter;
  page: number;
  selectedId: number;
  completed: CompletedMap;
  hasSavedAttempt: boolean;
  reduceMotion: boolean;
  onChapter: (chapter: Chapter) => void;
  onPage: (page: number) => void;
  onSelect: (id: number) => void;
  onPlay: () => void;
  onProgress: () => void;
  onNight: () => void;
  onRules: () => void;
  onStats: () => void;
  onSettings: () => void;
  onMore: () => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** M3 Bento-Hub: seasonal collection above a bento action row. */
export const MenuScreen = ({
  palette,
  chapter,
  page,
  selectedId,
  completed,
  hasSavedAttempt,
  reduceMotion,
  onChapter,
  onPage,
  onSelect,
  onPlay,
  onProgress,
  onNight,
  onRules,
  onStats,
  onSettings,
  onMore,
}: Props) => {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(reduceMotion ? 1 : 0);
    Animated.timing(fade, {
      toValue: 1,
      duration: reduceMotion ? 100 : FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [chapter, fade, page, reduceMotion]);

  const entries = useMemo(() => chapterEntries(chapter), [chapter]);
  const pageEntries = useMemo(
    () => entries.slice(page * TILES_PER_PAGE, page * TILES_PER_PAGE + TILES_PER_PAGE),
    [entries, page],
  );

  const mapped = chapterCompleted(completed, chapter);
  const total = uniqueCount(completed);
  const selectedEntry = CATALOG[selectedId - 1] || CATALOG[0];

  const sectionTitle =
    total === 0 && mapped === 0
      ? chapter + ' · 22 skies to discover'
      : chapter + ' · ' + mapped + ' of ' + CHAPTER_SIZE;

  const handlePrevious = useCallback(() => onPage(Math.max(0, page - 1)), [onPage, page]);
  const handleNext = useCallback(
    () => onPage(Math.min(PAGES_PER_CHAPTER - 1, page + 1)),
    [onPage, page],
  );

  const rows = [pageEntries.slice(0, 2), pageEntries.slice(2, 4)];

  return (
    <AppShell palette={palette} kind="page">
      {palette.showRaster ? (
        <View style={styles.decor} pointerEvents="none">
          <Image source={assets.sprite2} style={styles.arc} />
          <Image source={assets.sprite1} style={styles.spark} />
        </View>
      ) : null}

      <ScreenHeader
        title="Star Atlas"
        subtitle="Constellation Connect"
        palette={palette}
        tone="page"
        leftSlot={
          <Image
            source={assets.logo}
            style={[styles.logo, palette.showRaster ? null : styles.logoDim]}
          />
        }
        rightSlot={
          <IconButton
            Icon={Settings}
            label="Settings"
            palette={palette}
            tone="page"
            onPress={onSettings}
          />
        }
      />

      <View style={styles.body}>
        <SeasonTabs value={chapter} palette={palette} onChange={onChapter} />

        <Text style={[styles.section, { color: palette.pageText }]}>{sectionTitle}</Text>

        <Animated.View style={[styles.grid, { opacity: fade }]} pointerEvents="box-none">
          {rows.map((row, rowIndex) =>
            row.length > 0 ? (
              <View key={'row' + rowIndex} style={styles.gridRow}>
                {row.map(entry => (
                  <AtlasTile
                    key={entry.id}
                    entry={entry}
                    completed={!!completed[entry.id]}
                    selected={entry.id === selectedId}
                    palette={palette}
                    onSelect={onSelect}
                  />
                ))}
                {row.length === 1 ? <View style={styles.spacer} /> : null}
              </View>
            ) : null,
          )}
        </Animated.View>

        <Pager
          page={page}
          pageCount={PAGES_PER_CHAPTER}
          palette={palette}
          tone="page"
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        <View style={[styles.bento, COMPACT ? styles.bentoCompact : null]}>
          <AtlasPlayTile
            entry={selectedEntry}
            completed={!!completed[selectedEntry.id]}
            hasSavedAttempt={hasSavedAttempt}
            palette={palette}
            onPlay={onPlay}
          />

          <View style={styles.bentoColumn}>
            <Pressable
              onPress={onProgress}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Atlas Progress"
              style={styles.cellPress}>
              <View
                style={[
                  styles.cell,
                  { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder },
                ]}>
                <Compass size={22} color={palette.primary} strokeWidth={1.75} />
                <Text numberOfLines={1} style={[styles.cellValue, { color: palette.primary }]}>
                  {total > 0 ? total + ' of ' + CATALOG_SIZE : 'Discover 88'}
                </Text>
                <Text numberOfLines={1} style={[styles.cellLabel, { color: palette.pageTextMuted }]}>
                  Atlas Progress
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onNight}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Night Mode"
              style={styles.cellPress}>
              <View
                style={[
                  styles.cell,
                  { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder },
                ]}>
                <Moon size={22} color={palette.accent} strokeWidth={1.75} />
                <Text numberOfLines={1} style={[styles.cellValue, { color: palette.accent }]}>
                  Red
                </Text>
                <Text numberOfLines={1} style={[styles.cellLabel, { color: palette.pageTextMuted }]}>
                  Night Mode
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.navRow}>
          <IconButton Icon={BookOpen} label="Rules" showLabel palette={palette} tone="page" onPress={onRules} />
          <IconButton Icon={BarChart3} label="Stats" showLabel palette={palette} tone="page" onPress={onStats} />
          <IconButton Icon={MoreHorizontal} label="More" showLabel palette={palette} tone="page" onPress={onMore} />
        </View>
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  decor: { ...StyleSheet.absoluteFillObject },
  arc: { position: 'absolute', right: 8, top: 6, width: 168, height: 168, resizeMode: 'contain', opacity: 0.06 },
  spark: { position: 'absolute', left: 16, top: 168, width: 56, height: 56, resizeMode: 'contain', opacity: 0.06 },
  logo: { width: 34, height: 34, resizeMode: 'contain' },
  logoDim: { opacity: 0.4 },
  body: { flex: 1, paddingHorizontal: H_PAD, paddingTop: 12, paddingBottom: 16 },
  section: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  grid: { flex: 1, justifyContent: 'center', gap: 8 },
  gridRow: { flexDirection: 'row', gap: 8 },
  spacer: { flex: 1 },
  bento: { height: 144, flexDirection: 'row', gap: 10, marginTop: 4 },
  bentoCompact: { height: 112 },
  bentoColumn: { flex: 38, gap: 10 },
  cellPress: { flex: 1 },
  cell: {
    width: '100%',
    height: '100%',
    minHeight: 48,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cellValue: { fontSize: 14, fontWeight: '700', lineHeight: 18, marginTop: 4 },
  cellLabel: { fontSize: 11, fontWeight: '500', lineHeight: 14, marginTop: 1 },
  navRow: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 8,
  },
});

export default MenuScreen;
