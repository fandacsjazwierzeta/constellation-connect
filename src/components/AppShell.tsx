import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { TOP_PAD } from '../constants/config';
import type { Palette } from '../constants/theme';

export type ScreenKind = 'page' | 'sky';

interface Props {
  palette: Palette;
  kind: ScreenKind;
  /** extra darkening for the splash so Loader never reads as Menu */
  overlayOpacity?: number;
  gradient?: string[];
  children: React.ReactNode;
}

/**
 * The single bg_game backdrop plus a screen-specific gradient.
 * Every screen in the app sits inside one of these.
 */
export const AppShell = ({ palette, kind, overlayOpacity, gradient, children }: Props) => {
  const stops = gradient || (kind === 'sky' ? palette.skyGradient : palette.pageGradient);
  const opacity =
    overlayOpacity !== undefined
      ? overlayOpacity
      : kind === 'sky'
      ? 0.86
      : palette.pageOverlayOpacity;

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={kind === 'sky' || palette.isDark ? 'light-content' : 'dark-content'}
      />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={stops}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity }]}
        />
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050510' },
  bg: { flex: 1, width: '100%', height: '100%' },
  content: { flex: 1, paddingTop: TOP_PAD },
});

export default AppShell;
