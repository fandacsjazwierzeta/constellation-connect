import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, AppState, BackHandler, StyleSheet, Text, View } from 'react-native';
import { Home, Pause } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ConfirmDialog from '../components/ConfirmDialog';
import FeedbackLine from '../components/FeedbackLine';
import FloatingControls from '../components/FloatingControls';
import IconButton from '../components/IconButton';
import MoreSheet from '../components/MoreSheet';
import PauseSheet from '../components/PauseSheet';
import ScreenHeader from '../components/ScreenHeader';
import SkyBoard from '../components/SkyBoard';
import { CATALOG_SIZE, H_PAD } from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';
import { usePuzzleSession } from '../hooks/usePuzzleSession';
import type { Puzzle } from '../game/types';
import type { SavedAttempt } from '../services/localStore';
import { formatTime } from '../utils/formatTime';

interface Props {
  palette: Palette;
  puzzle: Puzzle;
  saved: SavedAttempt | undefined;
  attemptId: number;
  showTimer: boolean;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
  firstEver: boolean;
  onGameOver: (payload: { edges: string[]; elapsedMs: number; moves: number; hints: number }) => void;
  /** Leaving the board always hands the app a snapshot, so returning restores it. */
  onNavigate: (target: BoardExit, snapshot: SavedAttempt) => void;
}

export type BoardExit = 'menu' | 'rules' | 'stats' | 'settings' | 'night';

/** G2 Floating Controls: the board owns the canvas, actions float below it. */
export const GameScreen = ({
  palette,
  puzzle,
  saved,
  attemptId,
  showTimer,
  hapticsEnabled,
  reduceMotion,
  firstEver,
  onGameOver,
  onNavigate,
}: Props) => {
  const [paused, setPaused] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);

  const session = usePuzzleSession({ puzzle, saved, hapticsEnabled, onSolved: onGameOver });

  const enter = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: reduceMotion ? 100 : 220,
      useNativeDriver: true,
    }).start();
  }, [enter, reduceMotion]);

  const sessionRef = useRef(session);
  sessionRef.current = session;

  const snapshot = useCallback((): SavedAttempt => {
    const live = sessionRef.current;
    return {
      attemptId,
      constellationId: puzzle.id,
      edges: live.edges,
      undo: live.history.undo,
      redo: live.history.redo,
      moves: live.moves,
      hints: live.hints,
      elapsedMs: live.readElapsed(),
      updatedAt: Date.now(),
    };
  }, [attemptId, puzzle.id]);

  // Android backgrounding freezes active time and opens Pause on return.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      if (next !== 'active') {
        sessionRef.current.pause();
        setPaused(true);
      }
    });
    return () => subscription.remove();
  }, []);

  const leave = useCallback(
    (target: BoardExit) => {
      sessionRef.current.pause();
      onNavigate(target, snapshot());
    },
    [onNavigate, snapshot],
  );

  const handleAtlas = useCallback(() => leave('menu'), [leave]);
  const handleRules = useCallback(() => leave('rules'), [leave]);
  const handleStats = useCallback(() => leave('stats'), [leave]);
  const handleSettings = useCallback(() => leave('settings'), [leave]);
  const handleNight = useCallback(() => leave('night'), [leave]);

  // Back closes an overlay first, then clears a source, then pauses.
  useEffect(() => {
    const onBack = () => {
      if (restartVisible) {
        setRestartVisible(false);
        return true;
      }
      if (moreVisible) {
        setMoreVisible(false);
        return true;
      }
      if (paused) {
        setPaused(false);
        sessionRef.current.resume();
        return true;
      }
      if (sessionRef.current.selected !== null) {
        sessionRef.current.onSelect(null);
        return true;
      }
      sessionRef.current.pause();
      setPaused(true);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [moreVisible, paused, restartVisible]);

  const gradient = useMemo(
    () =>
      palette.mode === 'red'
        ? palette.skyGradient
        : [theme.colors.skyBase, theme.colors.skyTeal, theme.colors.skyRaised],
    [palette],
  );

  const handleResume = useCallback(() => {
    setPaused(false);
    sessionRef.current.resume();
  }, []);

  const handlePause = useCallback(() => {
    sessionRef.current.pause();
    setPaused(true);
  }, []);

  const handleRestartConfirm = useCallback(() => {
    setRestartVisible(false);
    setPaused(false);
    sessionRef.current.restart();
  }, []);

  const handleClear = useCallback(() => sessionRef.current.onSelect(null), []);

  const guidance = firstEver && session.edges.length === 0
    ? 'Start with a star that needs one link.'
    : session.status;

  return (
    <AppShell palette={palette} kind="sky" gradient={gradient} overlayOpacity={0.84}>
      <ScreenHeader
        title={puzzle.name}
        subtitle={'Sky ' + String(puzzle.id).padStart(2, '0') + ' of ' + CATALOG_SIZE}
        palette={palette}
        tone="sky"
        align="center"
        leftSlot={
          <IconButton Icon={Home} label="Star Atlas" palette={palette} onPress={handleAtlas} />
        }
        rightSlot={<IconButton Icon={Pause} label="Pause" palette={palette} onPress={handlePause} />}
      />

      <View style={styles.statusStrip}>
        <Text numberOfLines={1} style={[styles.status, { color: palette.skyTextSecondary }]}>
          {guidance}
        </Text>
        {showTimer ? (
          <Text style={[styles.timer, { color: palette.skyTextMuted }]}>
            {formatTime(session.elapsedMs)}
          </Text>
        ) : null}
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.boardArea,
          {
            opacity: enter,
            transform: [
              { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
            ],
          },
        ]}>
        <SkyBoard
          puzzle={puzzle}
          edges={session.edges}
          degrees={session.degrees}
          selected={session.selected}
          hint={session.hint}
          inputDisabled={session.completing || paused}
          palette={palette}
          onPair={session.onPair}
          onSelect={session.onSelect}
        />
      </Animated.View>

      <FeedbackLine message={session.feedbackMessage} palette={palette} reduceMotion={reduceMotion} />

      <View style={styles.controls}>
        <FloatingControls
          palette={palette}
          canUndo={session.canUndo}
          canRedo={session.canRedo}
          sourceSelected={session.selected !== null}
          onUndo={session.onUndo}
          onRedo={session.onRedo}
          onHint={session.onHint}
          onMore={() => setMoreVisible(true)}
          onClear={handleClear}
          onRules={handleRules}
        />
      </View>

      <PauseSheet
        visible={paused}
        palette={palette}
        onResume={handleResume}
        onRules={handleRules}
        onNight={handleNight}
        onRestart={() => setRestartVisible(true)}
        onAtlas={handleAtlas}
      />

      <MoreSheet
        visible={moreVisible}
        palette={palette}
        onRules={() => {
          setMoreVisible(false);
          handleRules();
        }}
        onStats={() => {
          setMoreVisible(false);
          handleStats();
        }}
        onSettings={() => {
          setMoreVisible(false);
          handleSettings();
        }}
        onNight={() => {
          setMoreVisible(false);
          handleNight();
        }}
        onClose={() => setMoreVisible(false)}
      />

      <ConfirmDialog
        visible={restartVisible}
        title="Start this sky again?"
        body="This clears only the current unfinished attempt. Completed records stay in your atlas."
        confirmLabel="PLAY AGAIN"
        palette={palette}
        onCancel={() => setRestartVisible(false)}
        onConfirm={handleRestartConfirm}
      />
    </AppShell>
  );
};

const styles = StyleSheet.create({
  statusStrip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    gap: 12,
  },
  status: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
  timer: { fontSize: 14, fontWeight: '700', lineHeight: 20, fontVariant: ['tabular-nums'] },
  boardArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  controls: { paddingBottom: 24, paddingTop: 8 },
});

export default GameScreen;
