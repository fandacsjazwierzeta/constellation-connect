import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, Home, Play } from 'lucide-react-native';
import { assets } from '../assets';
import AppShell from '../components/AppShell';
import ConstellationPreview from '../components/ConstellationPreview';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import ProgressTrack from '../components/ProgressTrack';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { CATALOG_SIZE, CHAPTER_SIZE, H_PAD } from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { CATALOG, CHAPTER_LIST, getPuzzle } from '../game/catalog';
import { chapterCompleted, uniqueCount } from '../game/progress';
import type { CompletedMap } from '../game/progress';
import type { Chapter } from '../game/types';

interface Props {
  palette: Palette;
  completed: CompletedMap;
  selectedId: number;
  onOpenChapter: (chapter: Chapter) => void;
  onPlay: () => void;
  onBack: () => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const CHAPTER_SEEDS = [1, 23, 45, 67];

export const AtlasProgressScreen = ({
  palette,
  completed,
  selectedId,
  onOpenChapter,
  onPlay,
  onBack,
}: Props) => {
  const mapped = uniqueCount(completed);
  const entry = CATALOG[selectedId - 1] || CATALOG[0];
  const empty = mapped === 0;

  return (
    <AppShell palette={palette} kind="page">
      {palette.showRaster ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image source={assets.sprite4} style={styles.decor} />
        </View>
      ) : null}

      <ScreenHeader
        title="Atlas Progress"
        subtitle={mapped + ' of ' + CATALOG_SIZE + ' skies mapped'}
        palette={palette}
        tone="page"
        leftSlot={
          <IconButton Icon={ChevronLeft} label="Back" palette={palette} tone="page" onPress={onBack} />
        }
      />

      <View style={styles.body}>
        <View style={[styles.hero, { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder }]}>
          <Text style={[styles.heroValue, { color: palette.pageText }]}>
            {mapped + ' of ' + CATALOG_SIZE}
          </Text>
          <ProgressTrack current={mapped} total={CATALOG_SIZE} palette={palette} height={6} />
        </View>

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
              Your atlas begins with one line.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {[0, 1].map(rowIndex => (
              <View key={'r' + rowIndex} style={styles.gridRow}>
                {CHAPTER_LIST.slice(rowIndex * 2, rowIndex * 2 + 2).map((chapter, i) => {
                  const done = chapterCompleted(completed, chapter);
                  const seed = CHAPTER_SEEDS[rowIndex * 2 + i];
                  return (
                    <Pressable
                      key={chapter}
                      onPress={() => onOpenChapter(chapter)}
                      hitSlop={HIT}
                      accessibilityRole="button"
                      accessibilityLabel={chapter + ', ' + done + ' of 22 mapped'}
                      style={styles.cardSlot}>
                      <View
                        style={[
                          styles.card,
                          { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder },
                        ]}>
                        <View style={styles.cardTop}>
                          <View style={styles.cardText}>
                            <Text numberOfLines={1} style={[styles.cardTitle, { color: palette.pageText }]}>
                              {chapter}
                            </Text>
                            <Text style={[styles.cardCount, { color: palette.primary }]}>
                              {done + ' of ' + CHAPTER_SIZE}
                            </Text>
                          </View>
                          <ConstellationPreview
                            puzzle={getPuzzle(seed)}
                            size={38}
                            lineColor={palette.pageTextMuted}
                            starColor={palette.accent}
                            outlined
                            strokeWidth={1.4}
                          />
                        </View>
                        <ProgressTrack current={done} total={CHAPTER_SIZE} palette={palette} height={6} />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        <Text numberOfLines={1} style={[styles.footerHint, { color: palette.pageTextMuted }]}>
          {'Selected · ' + entry.name}
        </Text>
        <PrimaryButton
          label={completed[entry.id] ? 'PLAY AGAIN' : 'PLAY'}
          Icon={Play}
          palette={palette}
          onPress={onPlay}
        />
        <View style={styles.gap} />
        <SecondaryButton label="STAR ATLAS" Icon={Home} palette={palette} tone="page" onPress={onBack} />
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  decor: {
    position: 'absolute',
    right: 12,
    top: 120,
    width: 150,
    height: 150,
    resizeMode: 'contain',
    opacity: 0.07,
  },
  body: { flex: 1, paddingHorizontal: H_PAD, paddingTop: 14, paddingBottom: 20 },
  hero: {
    height: 88,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  heroValue: { fontSize: 32, fontWeight: '700', lineHeight: 38, marginBottom: 8, fontVariant: ['tabular-nums'] },
  grid: { flex: 1, justifyContent: 'center', gap: 10, paddingVertical: 12 },
  gridRow: { flexDirection: 'row', gap: 10 },
  cardSlot: { flex: 1, height: 112 },
  card: {
    width: '100%',
    height: 112,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  cardCount: { fontSize: 13, fontWeight: '600', lineHeight: 18, marginTop: 2 },
  emptyBlock: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  emptyText: { fontSize: 15, fontWeight: '500', lineHeight: 22, textAlign: 'center' },
  footerHint: { fontSize: 12, fontWeight: '500', lineHeight: 16, marginBottom: 8, textAlign: 'center' },
  gap: { height: 10 },
});

export default AtlasProgressScreen;
