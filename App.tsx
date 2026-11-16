/**
 * ConstellationConnect — app-level state machine.
 * Conditional rendering only: no navigation framework, no gameplay here.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import MoreSheet from './src/components/MoreSheet';
import { TILES_PER_PAGE } from './src/constants/config';
import { getPalette } from './src/constants/theme';
import type { ThemeMode } from './src/constants/theme';
import { CATALOG, getPuzzle } from './src/game/catalog';
import { chapterOf, nextIncompleteId, pageOf, uniqueCount } from './src/game/progress';
import type { AttemptResult, Chapter } from './src/game/types';
import { usePersistentState } from './src/hooks/usePersistentState';
import type { SavedAttempt } from './src/services/localStore';
import AtlasProgressScreen from './src/screens/AtlasProgressScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import type { BoardExit } from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import NightModeScreen from './src/screens/NightModeScreen';
import RulesScreen from './src/screens/RulesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatsScreen from './src/screens/StatsScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'progress'
  | 'night'
  | 'rules'
  | 'stats'
  | 'settings';

const App = () => {
  const store = usePersistentState();
  const envelope = store.envelope;

  const [screen, setScreen] = useState<Screen>('loader');
  const [origin, setOrigin] = useState<Screen>('menu');
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [moreVisible, setMoreVisible] = useState(false);
  const [attemptId, setAttemptId] = useState(1);
  const [replay, setReplay] = useState(false);

  const attemptCounter = useRef(1);
  const palette = useMemo(() => getPalette(envelope.theme), [envelope.theme]);

  const selection = envelope.selection;
  const selectedId = selection.constellationId;
  const puzzle = useMemo(() => getPuzzle(selectedId), [selectedId]);
  const savedAttempt = envelope.attempts[selectedId];

  /* ---------------------------------------------------------------- navigation */

  const openSupport = useCallback(
    (next: Screen) => {
      setOrigin(screen === 'rules' || screen === 'stats' || screen === 'settings' || screen === 'night' || screen === 'progress' ? origin : screen);
      setScreen(next);
    },
    [origin, screen],
  );

  const backToOrigin = useCallback(() => setScreen(origin), [origin]);

  const startGame = useCallback(
    (id: number, fresh: boolean) => {
      attemptCounter.current += 1;
      setAttemptId(attemptCounter.current);
      setReplay(fresh);
      if (fresh) store.clearAttempt(id);
      store.setSelection({ chapter: chapterOf(id), page: pageOf(id, TILES_PER_PAGE), constellationId: id });
      setScreen('game');
    },
    [store],
  );

  const handleGameOver = useCallback(
    (payload: { edges: string[]; elapsedMs: number; moves: number; hints: number }) => {
      const entry = CATALOG[selectedId - 1] || CATALOG[0];
      const firstSolve = !envelope.completed[selectedId];
      const attemptResult: AttemptResult = {
        constellationId: entry.id,
        name: entry.name,
        chapter: entry.chapter,
        tale: entry.tale,
        elapsedMs: payload.elapsedMs,
        moves: payload.moves,
        hints: payload.hints,
        edges: payload.edges,
        firstSolve,
        reviewMode: false,
      };
      store.commitSolve(attemptResult, attemptId);
      setResult(attemptResult);
      setScreen('gameover');
    },
    [attemptId, envelope.completed, selectedId, store],
  );

  /** Leaving the board saves the attempt first, so Rules/Settings can return to it. */
  const handleLeaveBoard = useCallback(
    (target: BoardExit, snapshot: SavedAttempt) => {
      if (snapshot.edges.length > 0 || snapshot.elapsedMs > 0) store.saveAttempt(snapshot);
      setReplay(false);
      if (target === 'menu') {
        setScreen('menu');
        return;
      }
      setOrigin('game');
      setScreen(target);
    },
    [store],
  );

  const handleNextSky = useCallback(() => {
    const nextId = nextIncompleteId(envelope.completed, selectedId);
    startGame(nextId, false);
  }, [envelope.completed, selectedId, startGame]);

  /* ----------------------------------------------------------- Android back */

  useEffect(() => {
    const onBack = () => {
      if (moreVisible) {
        setMoreVisible(false);
        return true;
      }
      if (screen === 'menu' || screen === 'loader') return false;
      if (screen === 'gameover') {
        setScreen('menu');
        return true;
      }
      if (screen === 'game') return false; // GameScreen owns its own handler
      setScreen(origin);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [moreVisible, origin, screen]);

  /* ------------------------------------------------------------------ render */

  const mapped = uniqueCount(envelope.completed);

  const renderScreen = () => {
    switch (screen) {
      case 'loader':
        return (
          <LoaderScreen
            palette={palette}
            reduceMotion={envelope.reduceMotion}
            onDone={() => setScreen('menu')}
          />
        );

      case 'game':
        return (
          <GameScreen
            key={'attempt-' + attemptId + '-sky-' + selectedId}
            palette={palette}
            puzzle={puzzle}
            saved={replay ? undefined : savedAttempt}
            attemptId={attemptId}
            showTimer={envelope.showTimer}
            hapticsEnabled={envelope.hapticsEnabled}
            reduceMotion={envelope.reduceMotion}
            firstEver={envelope.stats.completedAttempts === 0}
            onGameOver={handleGameOver}
            onNavigate={handleLeaveBoard}
          />
        );

      case 'gameover':
        if (!result) return renderMenu();
        return (
          <GameOverScreen
            palette={palette}
            result={result}
            uniqueMapped={mapped}
            reduceMotion={envelope.reduceMotion}
            onPlayAgain={() => startGame(result.constellationId, true)}
            onNextSky={handleNextSky}
            onMenu={() => setScreen('menu')}
          />
        );

      case 'progress':
        return (
          <AtlasProgressScreen
            palette={palette}
            completed={envelope.completed}
            selectedId={selectedId}
            onOpenChapter={(chapter: Chapter) => {
              const firstId = CATALOG.filter(e => e.chapter === chapter)[0].id;
              store.setSelection({ chapter, page: 0, constellationId: firstId });
              setScreen('menu');
            }}
            onPlay={() => startGame(selectedId, false)}
            onBack={() => setScreen('menu')}
          />
        );

      case 'night':
        return (
          <NightModeScreen
            palette={palette}
            isRedActive={envelope.theme === 'red'}
            muteInRed={envelope.muteInRed}
            onMuteChange={next => store.setPreference('muteInRed', next)}
            onApply={() => {
              store.setTheme('red');
              backToOrigin();
            }}
            onUsePrevious={() => {
              store.setTheme(envelope.previousNonRedTheme === 'red' ? 'light' : envelope.previousNonRedTheme);
              backToOrigin();
            }}
            onBack={backToOrigin}
          />
        );

      case 'rules':
        return (
          <RulesScreen
            palette={palette}
            fromGame={origin === 'game'}
            onPrimary={() => (origin === 'game' ? setScreen('game') : startGame(selectedId, false))}
            onBack={backToOrigin}
          />
        );

      case 'stats':
        return (
          <StatsScreen
            palette={palette}
            stats={envelope.stats}
            completed={envelope.completed}
            onPlay={() => startGame(selectedId, false)}
            onBack={backToOrigin}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            palette={palette}
            envelope={envelope}
            onTheme={(mode: ThemeMode) => {
              if (mode === 'red') {
                openSupport('night');
                return;
              }
              store.setTheme(mode);
            }}
            onPreference={store.setPreference}
            onReset={() => {
              store.resetAtlas();
              setScreen('menu');
            }}
            onDone={backToOrigin}
          />
        );

      case 'menu':
      default:
        return renderMenu();
    }
  };

  function renderMenu() {
    return (
      <MenuScreen
        palette={palette}
        chapter={selection.chapter}
        page={selection.page}
        selectedId={selectedId}
        completed={envelope.completed}
        hasSavedAttempt={!!savedAttempt && savedAttempt.edges.length > 0}
        reduceMotion={envelope.reduceMotion}
        onChapter={(chapter: Chapter) => {
          const firstId = CATALOG.filter(e => e.chapter === chapter)[0].id;
          store.setSelection({ chapter, page: 0, constellationId: firstId });
        }}
        onPage={(page: number) => store.setSelection({ ...selection, page })}
        onSelect={(id: number) => store.setSelection({ ...selection, constellationId: id })}
        onPlay={() => startGame(selectedId, false)}
        onProgress={() => openSupport('progress')}
        onNight={() => openSupport('night')}
        onRules={() => openSupport('rules')}
        onStats={() => openSupport('stats')}
        onSettings={() => openSupport('settings')}
        onMore={() => setMoreVisible(true)}
      />
    );
  }

  return (
    <View style={styles.root}>
      {renderScreen()}
      <MoreSheet
        visible={moreVisible}
        palette={palette}
        onRules={() => {
          setMoreVisible(false);
          openSupport('rules');
        }}
        onStats={() => {
          setMoreVisible(false);
          openSupport('stats');
        }}
        onSettings={() => {
          setMoreVisible(false);
          openSupport('settings');
        }}
        onNight={() => {
          setMoreVisible(false);
          openSupport('night');
        }}
        onClose={() => setMoreVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050510' },
});

export default App;
