import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Palette } from '../constants/theme';

interface SwitchProps {
  kind: 'switch';
  label: string;
  description?: string;
  value: boolean;
  palette: Palette;
  onChange: (next: boolean) => void;
}

interface ChoiceProps {
  kind: 'choice';
  label: string;
  description?: string;
  value: boolean;
  palette: Palette;
  onChange: (next: boolean) => void;
}

type Props = SwitchProps | ChoiceProps;

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 56 dp accessible row — a switch toggle or a selectable segmented choice. */
export const SettingRow = ({ kind, label, description, value, palette, onChange }: Props) => {
  const body = (
    <View style={styles.textCol}>
      <Text numberOfLines={1} style={[styles.label, { color: palette.pageText }]}>
        {label}
      </Text>
      {description ? (
        <Text numberOfLines={1} style={[styles.description, { color: palette.pageTextMuted }]}>
          {description}
        </Text>
      ) : null}
    </View>
  );

  if (kind === 'choice') {
    return (
      <Pressable
        onPress={() => onChange(true)}
        hitSlop={HIT}
        accessibilityRole="radio"
        accessibilityLabel={label}
        accessibilityState={{ selected: value }}
        style={[
          styles.row,
          {
            backgroundColor: value ? palette.primary + '26' : palette.pageCard,
            borderColor: value ? palette.primary : palette.pageCardBorder,
          },
        ]}>
        {body}
        <View
          style={[
            styles.mark,
            { borderColor: value ? palette.primary : palette.pageCardBorder, backgroundColor: value ? palette.primary : 'transparent' },
          ]}>
          {value ? <Check size={16} color={theme.colors.text} strokeWidth={3} /> : null}
        </View>
      </Pressable>
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={label}
      style={[styles.row, { backgroundColor: palette.pageCard, borderColor: palette.pageCardBorder }]}>
      {body}
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        thumbColor={value ? palette.primary : '#F2F2F2'}
        trackColor={{ true: palette.primary + '66', false: 'rgba(82,110,105,0.35)' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 56,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  textCol: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  description: { fontSize: 12, fontWeight: '500', lineHeight: 16, marginTop: 2 },
  mark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingRow;
