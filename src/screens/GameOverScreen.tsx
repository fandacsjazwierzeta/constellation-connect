import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Clock, Hash, Home, RotateCcw, Sparkles } from 'lucide-react-native';
import { assets } from '../assets';
import AppShell from '../components/AppShell';
import AtlasTale from '../components/AtlasTale';
import IconButton from '../components/IconButton';
import RevealFigure from '../components/RevealFigure';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { CATALOG_SIZE, COMPACT, FADE_MS, H_PAD, SCREEN_W } from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { getPuzzle } from '../game/catalog';
import type { AttemptResult } from '../game/types';
import { formatTime } from '../utils/formatTime';

interface Props {
  palette: Palette;
  result: AttemptResult;
  uniqueMapped: number;
  reduceMotion: boolean;
  onPlayAgain: () => void;
  onNextSky: () => void;
  onMenu: () => void;
}

const FIGURE = Math.min(176, SCREEN_W - 120);

/**
 * Distinct composition from the board: no count capsules, no controls bar and
 * no board frame — just the finished figure, its tale and the attempt measures.
 */
export const GameOverScreen = ({
  palette,
  result,
  uniqueMapped,
  reduceMotion,
  onPlayAgain,
  onNextSky,
  onMenu,
}: Props) => {
  const fade = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const puzzle = getPuzzle(result.constellationId);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: reduceMotion ? 100 : FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [fade, reduceMotion]);

  const gradient =
    palette.mode === 'red'
      ? palette.skyGradient
      : [theme.colors.skyRaised, theme.colors.skyTeal, theme.colors.skyBase];

  const headline = result.reviewMode ? 'Mapped constellation' : 'Sky mapped';
  const note = result.reviewMode
    ? 'Saved figure and tale'
    : result.firstSolve
    ? 'Added to your atlas'
    : 'Another sky completed';
  const taleHeading =
    uniqueMapped >= CATALOG_SIZE ? 'Atlas complete · 88 of 88' : 'Atlas tale';

  return (
    <AppShell palette={palette} kind="sky" gradient={gradient} overlayOpacity={0.88}>
      <ScreenHeader
        title="Constellation revealed"
        subtitle={result.name + ' · ' + result.chapter}
        palette={palette}
        tone="sky"
        leftSlot={<IconButton Icon={Home} label="Star Atlas" palette={palette} onPress={onMenu} />}
      />

      <Animated.View style={[styles.body, { opacity: fade }]} pointerEvents="box-none">
        <View style={styles.headlineBlock}>
          <Text style={[styles.headline, { color: palette.skyText }]}>{headline}</Text>
          <Text style={[styles.note, { color: palette.primary }]}>{note}</Text>
        </View>

        <View style={styles.figureArea}>
          {palette.showRaster ? (
            <View style={styles.arcWrap} pointerEvents="none">
              <Image source={assets.sprite2} style={styles.arc} />
            </View>
          ) : null}
          <RevealFigure
            puzzle={puzzle}
            finalEdges={result.edges}
            size={FIGURE}
            palette={palette}
            animate={!reduceMotion && !result.reviewMode}
          />
        </View>

        <AtlasTale
          heading={taleHeading}
          tale={result.tale}
          palette={palette}
          tone="sky"
          showSeal
        />

        <View style={styles.statsRow}>
          <StatCard
            Icon={Clock}
            value={formatTime(result.elapsedMs)}
            label="solve time"
            valueColor={palette.primary}
            palette={palette}
            tone="sky"
          />
          <StatCard
            Icon={Hash}
            value={String(result.moves)}
            label="moves"
            valueColor={palette.line}
            palette={palette}
            tone="sky"
          />
          {result.hints > 0 ? (
            <StatCard
              Icon={Sparkles}
              value={String(result.hints)}
              label="hints used"
              valueColor={palette.accent}
              palette={palette}
              tone="sky"
            />
          ) : null}
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label="PLAY AGAIN"
            Icon={RotateCcw}
            palette={palette}
            onPress={onPlayAgain}
            accessibilityHint="Start this sky again as a new attempt"
          />
          <View style={[styles.secondaryRow, COMPACT ? styles.secondaryRowCompact : null]}>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="NEXT SKY" palette={palette} onPress={onNextSky} />
            </View>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="STAR ATLAS" palette={palette} onPress={onMenu} />
            </View>
          </View>
        </View>
      </Animated.View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: H_PAD, paddingTop: 10, paddingBottom: 24 },
  headlineBlock: { alignItems: 'center' },
  headline: { fontSize: 36, fontWeight: '700', lineHeight: 42, letterSpacing: -0.5, textAlign: 'center' },
  note: { fontSize: 13, fontWeight: '600', lineHeight: 18, marginTop: 2, letterSpacing: 0.6, textTransform: 'uppercase' },
  figureArea: {
    flex: 1,
    minHeight: FIGURE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  arcWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  arc: {
    position: 'absolute',
    width: FIGURE + 70,
    height: FIGURE + 70,
    resizeMode: 'contain',
    opacity: 0.1,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  actions: { marginTop: 14 },
  secondaryRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  secondaryRowCompact: { marginTop: 8 },
  secondarySlot: { flex: 1 },
});

export default GameOverScreen;
