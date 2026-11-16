/**
 * SPACE_COSMOS preset with the ConstellationConnect brief overrides.
 * The `name` field must stay exactly as it is in preset.ts.
 */

export type ThemeMode = 'light' | 'midnight' | 'red';

export const theme = {
  name: 'space-cosmos',

  colors: {
    // light atlas chrome
    background: '#EDF6F5',
    backgroundEnd: '#DDEDEB',
    primary: '#2AAB97',
    accent: '#C028E0',
    accentEnd: '#7B2FBE',
    text: '#182422',
    textSecondary: '#3F5C58',
    textMuted: '#526E69',
    secondary: '#B0CEDD',

    // midnight sky
    skyBase: '#050510',
    skyMid: '#0A0A20',
    skyRaised: '#10103A',
    skyTeal: '#0A1628',
    skyText: '#EDF6F5',
    skyTextSecondary: '#B0CEDD',
    skyTextMuted: '#8FAEBE',

    lineGold: '#E8C76A',
    shadow: '#050510',

    // red / night palette
    redBase: '#100708',
    redSurface: '#210B10',
    redRaised: '#2B1115',
    redText: '#D38C82',
    redSecondary: '#B87970',
    redAccent: '#A74D4B',
    redLine: '#D38C82',
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '700' as const, lineHeight: 44, letterSpacing: -0.5 },
    screenTitle: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
    sectionTitle: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
    body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
    button: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
    tile: { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },
    count: { fontSize: 14, fontWeight: '700' as const, lineHeight: 18 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 36 },

  radius: { sm: 8, md: 12, card: 16, panel: 18, button: 16, secondary: 14, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#050510',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 3,
    },
    panel: {
      shadowColor: '#050510',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 4,
    },
    button: {
      shadowColor: '#C028E0',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 10,
      elevation: 5,
    },
  },

  animation: {
    press: { tension: 180, friction: 18 },
    bounce: { tension: 140, friction: 9 },
  },
};

export interface Palette {
  mode: ThemeMode;
  isDark: boolean;

  /** light / information screens (Atlas, Rules, Stats, Settings, Progress) */
  pageGradient: string[];
  pageText: string;
  pageTextSecondary: string;
  pageTextMuted: string;
  pageCard: string;
  pageCardBorder: string;
  pageOverlayOpacity: number;

  /** dark sky screens (Loader, Board, Reveal) */
  skyGradient: string[];
  skyText: string;
  skyTextSecondary: string;
  skyTextMuted: string;
  skyCard: string;
  skyCardBorder: string;
  boardFill: string;
  boardBorder: string;

  /** shared accents */
  primary: string;
  accent: string;
  accentEnd: string;
  onAccent: string;
  line: string;
  starCore: string;
  starGlow: string;
  scrim: string;
  sheetFill: string;
  sheetText: string;
  /** red mode suppresses raster decoration */
  showRaster: boolean;
}

const C = theme.colors;

const LIGHT: Palette = {
  mode: 'light',
  isDark: false,
  pageGradient: [C.background, C.backgroundEnd, C.secondary],
  pageText: C.text,
  pageTextSecondary: C.textSecondary,
  pageTextMuted: C.textMuted,
  pageCard: 'rgba(237,246,245,0.90)',
  pageCardBorder: 'rgba(176,206,221,0.85)',
  pageOverlayOpacity: 0.96,
  skyGradient: [C.skyBase, C.skyTeal, C.skyRaised],
  skyText: C.skyText,
  skyTextSecondary: C.skyTextSecondary,
  skyTextMuted: C.skyTextMuted,
  skyCard: 'rgba(237,246,245,0.05)',
  skyCardBorder: 'rgba(237,246,245,0.12)',
  boardFill: 'rgba(10,10,32,0.92)',
  boardBorder: 'rgba(176,206,221,0.16)',
  primary: C.primary,
  accent: C.accent,
  accentEnd: C.accentEnd,
  onAccent: C.skyText,
  line: C.lineGold,
  starCore: '#FFF8DC',
  starGlow: '#B0CEDD',
  scrim: 'rgba(5,5,16,0.60)',
  sheetFill: 'rgba(10,22,40,0.96)',
  sheetText: C.skyText,
  showRaster: true,
};

const MIDNIGHT: Palette = {
  ...LIGHT,
  mode: 'midnight',
  isDark: true,
  pageGradient: [C.skyBase, C.skyMid, C.skyTeal],
  pageText: C.skyText,
  pageTextSecondary: C.skyTextSecondary,
  pageTextMuted: C.skyTextMuted,
  pageCard: 'rgba(237,246,245,0.06)',
  pageCardBorder: 'rgba(237,246,245,0.14)',
  pageOverlayOpacity: 0.86,
};

const RED: Palette = {
  mode: 'red',
  isDark: true,
  pageGradient: [C.redBase, C.redSurface, C.redRaised],
  pageText: C.redText,
  pageTextSecondary: C.redSecondary,
  pageTextMuted: C.redSecondary,
  pageCard: 'rgba(43,17,21,0.92)',
  pageCardBorder: 'rgba(167,77,75,0.6)',
  pageOverlayOpacity: 0.94,
  skyGradient: [C.redBase, C.redSurface, C.redRaised],
  skyText: C.redText,
  skyTextSecondary: C.redSecondary,
  skyTextMuted: C.redSecondary,
  skyCard: 'rgba(211,140,130,0.06)',
  skyCardBorder: 'rgba(167,77,75,0.45)',
  boardFill: 'rgba(16,7,8,0.94)',
  boardBorder: 'rgba(167,77,75,0.45)',
  primary: C.redAccent,
  accent: C.redAccent,
  accentEnd: C.redSurface,
  onAccent: C.redText,
  line: C.redLine,
  starCore: C.redText,
  starGlow: C.redAccent,
  scrim: 'rgba(16,7,8,0.72)',
  sheetFill: 'rgba(33,11,16,0.96)',
  sheetText: C.redText,
  showRaster: false,
};

export const PALETTES: Record<ThemeMode, Palette> = {
  light: LIGHT,
  midnight: MIDNIGHT,
  red: RED,
};

export const getPalette = (mode: ThemeMode): Palette => PALETTES[mode] || LIGHT;
