import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { ChevronLeft, Play } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import IconButton from '../components/IconButton';
import Pager from '../components/Pager';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { H_PAD, SCREEN_W } from '../constants/config';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface Props {
  palette: Palette;
  fromGame: boolean;
  onPrimary: () => void;
  onBack: () => void;
}

const PAGES = [
  {
    title: 'Make the links',
    lines: [
      'Each star shows links made / links needed.',
      'Drag between stars, or tap two stars.',
      'Tap the same pair again to remove a link.',
    ],
  },
  {
    title: 'Keep the sky clear',
    lines: [
      'Lines cannot cross or pass through another star.',
      'The final drawing must be one connected constellation.',
      'Undo, Redo and Hint are always free.',
    ],
  },
  {
    title: 'Explore your atlas',
    lines: [
      '88 named skies in four editorial season chapters.',
      'Progress saves itself, and retries are unlimited.',
      'Seasons organize this atlas into chapters. This game is not a live observing chart.',
    ],
  },
];

const DIAGRAM = Math.min(SCREEN_W - 64, 260);
const DIAGRAM_H = 120;

const Diagram = ({ page, palette }: { page: number; palette: Palette }) => {
  const line = palette.primary;
  const star = palette.accent;
  const bad = palette.pageTextMuted;

  if (page === 0) {
    return (
      <Svg width={DIAGRAM} height={DIAGRAM_H}>
        <Line x1={40} y1={80} x2={DIAGRAM / 2} y2={34} stroke={line} strokeWidth={3} strokeLinecap="round" />
        <Circle cx={40} cy={80} r={7} fill={star} />
        <Circle cx={DIAGRAM / 2} cy={34} r={7} fill={star} />
        <Circle cx={DIAGRAM - 40} cy={80} r={7} fill={star} />
      </Svg>
    );
  }

  if (page === 1) {
    return (
      <Svg width={DIAGRAM} height={DIAGRAM_H}>
        <Line x1={24} y1={30} x2={104} y2={94} stroke={line} strokeWidth={3} strokeLinecap="round" />
        <Line x1={24} y1={94} x2={104} y2={30} stroke={bad} strokeWidth={3} strokeDasharray="7,6" strokeLinecap="round" />
        <Circle cx={24} cy={30} r={6} fill={star} />
        <Circle cx={104} cy={94} r={6} fill={star} />
        <Circle cx={24} cy={94} r={6} fill={star} />
        <Circle cx={104} cy={30} r={6} fill={star} />
        <Line x1={DIAGRAM - 110} y1={62} x2={DIAGRAM - 62} y2={28} stroke={line} strokeWidth={3} strokeLinecap="round" />
        <Line x1={DIAGRAM - 110} y1={62} x2={DIAGRAM - 62} y2={96} stroke={line} strokeWidth={3} strokeLinecap="round" />
        <Circle cx={DIAGRAM - 110} cy={62} r={6} fill={star} />
        <Circle cx={DIAGRAM - 62} cy={28} r={6} fill={star} />
        <Circle cx={DIAGRAM - 62} cy={96} r={6} fill={star} />
      </Svg>
    );
  }

  return (
    <Svg width={DIAGRAM} height={DIAGRAM_H}>
      {[0, 1, 2, 3].map(i => (
        <Circle key={'c' + i} cx={40 + i * ((DIAGRAM - 80) / 3)} cy={60} r={7} fill={i < 2 ? star : 'none'} stroke={star} strokeWidth={2} />
      ))}
      {[0, 1, 2].map(i => (
        <Line
          key={'l' + i}
          x1={40 + i * ((DIAGRAM - 80) / 3)}
          y1={60}
          x2={40 + (i + 1) * ((DIAGRAM - 80) / 3)}
          y2={60}
          stroke={i < 1 ? line : bad}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
};

export const RulesScreen = ({ palette, fromGame, onPrimary, onBack }: Props) => {
  const [page, setPage] = useState(0);
  const content = PAGES[page];

  return (
    <AppShell palette={palette} kind="page">
      <ScreenHeader
        title="Rules"
        subtitle={content.title}
        palette={palette}
        tone="page"
        leftSlot={
          <IconButton Icon={ChevronLeft} label="Back" palette={palette} tone="page" onPress={onBack} />
        }
      />

      <View style={styles.body}>
        <Text style={[styles.title, { color: palette.pageText }]}>{content.title}</Text>

        <View
          style={[
            styles.diagramCard,
            { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder },
          ]}>
          <Diagram page={page} palette={palette} />
        </View>

        <View style={styles.rules}>
          {content.lines.map((text, i) => (
            <View
              key={'rule' + i}
              style={[
                styles.ruleCard,
                { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder },
              ]}>
              <View style={[styles.bullet, { backgroundColor: palette.primary }]} />
              <Text style={[styles.ruleText, { color: palette.pageTextSecondary }]}>{text}</Text>
            </View>
          ))}
        </View>

        <Pager
          page={page}
          pageCount={PAGES.length}
          palette={palette}
          tone="page"
          onPrevious={() => setPage(Math.max(0, page - 1))}
          onNext={() => setPage(Math.min(PAGES.length - 1, page + 1))}
        />

        <PrimaryButton
          label={fromGame ? 'RETURN TO SKY' : 'PLAY'}
          Icon={Play}
          palette={palette}
          onPress={onPrimary}
        />
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: H_PAD, paddingTop: 14, paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', lineHeight: 32, marginBottom: 12 },
  diagramCard: {
    height: DIAGRAM_H + 24,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rules: { flex: 1, justifyContent: 'center', gap: 10, paddingVertical: 12 },
  ruleCard: {
    borderRadius: theme.radius.card,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bullet: { width: 8, height: 8, borderRadius: 4 },
  ruleText: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
});

export default RulesScreen;
