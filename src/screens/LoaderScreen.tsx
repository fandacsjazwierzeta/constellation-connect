import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { assets } from '../assets';
import AppShell from '../components/AppShell';
import { LOADER_DURATION_MS } from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  palette: Palette;
  reduceMotion: boolean;
  onDone: () => void;
}

const BAR_W = 200;
const BAR_H = 4;
const LINK_W = 180;
const LINK_H = 56;

const LINK_POINTS = [
  { x: 10, y: 38 },
  { x: 52, y: 16 },
  { x: 92, y: 40 },
  { x: 132, y: 14 },
  { x: 170, y: 34 },
];

/**
 * Branded splash. Deliberately darker than the light Atlas and carries no
 * chips, tiles or interactive call-to-action, so the two screens never read
 * as the same frame.
 */
export const LoaderScreen = ({ palette, reduceMotion, onDone }: Props) => {
  const appear = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(reduceMotion ? 1 : 0.94)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const links = useRef(LINK_POINTS.map(() => new Animated.Value(0))).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: reduceMotion ? 100 : 220,
      useNativeDriver: true,
    }).start();

    Animated.timing(scale, {
      toValue: 1,
      duration: reduceMotion ? 100 : 220,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      reduceMotion ? 0 : 180,
      links.map(value =>
        Animated.timing(value, {
          toValue: 1,
          duration: reduceMotion ? 100 : 220,
          useNativeDriver: true,
        }),
      ),
    ).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [appear, links, progress, reduceMotion, scale]);

  const barShift = useMemo(
    () => progress.interpolate({ inputRange: [0, 1], outputRange: [-BAR_W, 0] }),
    [progress],
  );

  const red = palette.mode === 'red';
  const gradient = red
    ? [theme.colors.redBase, theme.colors.redSurface, theme.colors.redRaised]
    : [theme.colors.skyBase, theme.colors.skyMid, theme.colors.skyRaised];
  const lineColor = red ? palette.line : theme.colors.lineGold;
  const starColor = red ? palette.starCore : theme.colors.skyText;

  return (
    <AppShell palette={palette} kind="sky" gradient={gradient} overlayOpacity={0.92}>
      <View style={styles.root}>
        <View style={styles.starfield} pointerEvents="none">
          <Svg width="100%" height="100%">
            {STATIC_STARS.map((s, i) => (
              <Circle
                key={'s' + i}
                cx={s.x + '%'}
                cy={s.y + '%'}
                r={s.r}
                fill={starColor}
                opacity={s.o}
              />
            ))}
          </Svg>
        </View>

        <View style={styles.center}>
          <Animated.View
            pointerEvents="box-none"
            style={[styles.brand, { opacity: appear, transform: [{ scale }] }]}>
            <View
              style={[
                styles.panel,
                {
                  backgroundColor: palette.skyCard,
                  borderColor: palette.skyCardBorder,
                },
              ]}>
              <Image source={assets.logo} style={styles.logo} />
              <View style={styles.linkRow}>
                <Svg width={LINK_W} height={LINK_H}>
                  {LINK_POINTS.slice(0, -1).map((p, i) => (
                    <Line
                      key={'l' + i}
                      x1={p.x}
                      y1={p.y}
                      x2={LINK_POINTS[i + 1].x}
                      y2={LINK_POINTS[i + 1].y}
                      stroke={lineColor}
                      strokeWidth={2}
                      strokeLinecap="round"
                      opacity={0.75}
                    />
                  ))}
                </Svg>
                {LINK_POINTS.map((p, i) => (
                  <Animated.View
                    key={'d' + i}
                    pointerEvents="none"
                    style={[
                      styles.dot,
                      {
                        left: p.x - 5,
                        top: p.y - 5,
                        backgroundColor: starColor,
                        opacity: links[i],
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            <Text style={[styles.hero, { color: palette.skyText }]}>Constellation</Text>
            <Text style={[styles.hero, { color: palette.skyText }]}>Connect</Text>
            <Text style={[styles.subtitle, { color: palette.skyTextSecondary }]}>
              Draw a little wonder.
            </Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.track, { backgroundColor: red ? palette.skyCard : theme.colors.skyRaised }]}>
            <Animated.View
              style={[
                styles.fill,
                { backgroundColor: red ? palette.line : theme.colors.primary, transform: [{ translateX: barShift }] },
              ]}
            />
          </View>
          <Text style={[styles.loading, { color: palette.skyTextMuted }]}>LOADING...</Text>
        </View>
      </View>
    </AppShell>
  );
};

const STATIC_STARS = [
  { x: 8, y: 9, r: 1.6, o: 0.5 }, { x: 22, y: 5, r: 1.1, o: 0.35 },
  { x: 37, y: 12, r: 1.8, o: 0.45 }, { x: 54, y: 7, r: 1.2, o: 0.4 },
  { x: 68, y: 14, r: 1.5, o: 0.5 }, { x: 83, y: 6, r: 1.1, o: 0.3 },
  { x: 92, y: 18, r: 1.7, o: 0.45 }, { x: 14, y: 22, r: 1.2, o: 0.3 },
  { x: 47, y: 24, r: 1.0, o: 0.28 }, { x: 76, y: 27, r: 1.4, o: 0.38 },
  { x: 6, y: 36, r: 1.3, o: 0.32 }, { x: 95, y: 40, r: 1.2, o: 0.3 },
  { x: 11, y: 58, r: 1.5, o: 0.34 }, { x: 89, y: 62, r: 1.6, o: 0.36 },
  { x: 26, y: 74, r: 1.2, o: 0.3 }, { x: 44, y: 80, r: 1.0, o: 0.26 },
  { x: 62, y: 77, r: 1.4, o: 0.33 }, { x: 80, y: 85, r: 1.2, o: 0.3 },
  { x: 16, y: 88, r: 1.6, o: 0.38 }, { x: 34, y: 93, r: 1.1, o: 0.28 },
  { x: 55, y: 90, r: 1.5, o: 0.34 }, { x: 71, y: 95, r: 1.2, o: 0.3 },
  { x: 90, y: 92, r: 1.4, o: 0.32 }, { x: 4, y: 70, r: 1.1, o: 0.26 },
];

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  starfield: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brand: { alignItems: 'center' },
  panel: {
    width: 224,
    height: 176,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: { width: 104, height: 104, resizeMode: 'contain' },
  linkRow: { width: LINK_W, height: LINK_H, marginTop: -14 },
  dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  hero: { fontSize: 40, fontWeight: '700', lineHeight: 44, letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 16, fontWeight: '400', lineHeight: 22, marginTop: 10, textAlign: 'center' },
  footer: { alignItems: 'center', paddingBottom: 56 },
  track: { width: BAR_W, height: BAR_H, borderRadius: BAR_H / 2, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, width: BAR_W, height: BAR_H, borderRadius: BAR_H / 2 },
  loading: { fontSize: 12, fontWeight: '600', lineHeight: 16, letterSpacing: 2.4, marginTop: 12 },
});

export default LoaderScreen;
