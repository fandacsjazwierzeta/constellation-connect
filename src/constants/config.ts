import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Branded splash. Must stay at 8000 — anything shorter races the screenshot gate. */
export const LOADER_DURATION_MS = 8000;

/** Compact layout under 720 dp of height. */
export const COMPACT = SCREEN_H < 720;

export const TOP_PAD = 44;
export const HEADER_H = COMPACT ? 48 : 56;
export const H_PAD = 16;
export const GAP = 12;
export const BOTTOM_PAD = 16;

/** Board frame = padding (7) + border (1). */
export const BOARD_PAD = 7;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;

/** Vertical budget consumed by everything except the board on GameScreen. */
const GAME_CHROME_H =
  TOP_PAD + HEADER_H + 40 /* status strip */ + 24 /* feedback */ + 132 /* floating bar */ + 40 /* gaps */;

const AVAILABLE_BOARD_H = SCREEN_H - GAME_CHROME_H;

/** Square board: never below 288 dp, never above 380 dp. */
export const BOARD_SIZE = Math.max(
  260,
  Math.floor(Math.min(SCREEN_W - 32, 380, Math.max(288, AVAILABLE_BOARD_H))),
);

export const BOARD_INNER = BOARD_SIZE - 2 * BOARD_FRAME;

/** 5x5 logical grid, 24 dp inset from the inner drawing area. */
export const GRID_INSET = 24;
export const GRID_MAX = 4;
export const GRID_PITCH = (BOARD_INNER - 2 * GRID_INSET) / GRID_MAX;

export const STAR_TARGET = 48;
export const STAR_CORE = 12;
export const STAR_GLOW = 28;
export const CAPSULE_W = 36;
export const CAPSULE_H = 18;

/** Drag/tap discrimination and hit tolerance, in dp. */
export const TAP_THRESHOLD = 6;
export const HIT_RADIUS = Math.min(STAR_TARGET / 2, GRID_PITCH / 2);

export const CATALOG_SIZE = 88;
export const CHAPTER_SIZE = 22;
export const TILES_PER_PAGE = 4;
export const PAGES_PER_CHAPTER = Math.ceil(CHAPTER_SIZE / TILES_PER_PAGE); // 6

export const FEEDBACK_MS = 1600;
export const HINT_MS = 2000;
export const COMPLETE_MS = 220;
export const FADE_MS = 180;
export const TIMER_TICK_MS = 1000;

/** Logical-coordinate tolerance for the segment predicates. */
export const EPS = 0.000001;
