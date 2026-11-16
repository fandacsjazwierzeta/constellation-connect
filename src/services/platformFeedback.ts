import { Vibration } from 'react-native';

/**
 * Optional haptic confirmation. Off by default and a silent no-op when the
 * preference is off, so the app never buzzes for invalid input.
 * Declared in AndroidManifest.xml as android.permission.VIBRATE.
 */
export const confirmHaptic = (enabled: boolean): void => {
  if (!enabled) return;
  try {
    Vibration.vibrate(12);
  } catch (error) {
    // haptics are decorative — never let them reach the board
  }
};

export const completionHaptic = (enabled: boolean): void => {
  if (!enabled) return;
  try {
    Vibration.vibrate(28);
  } catch (error) {
    // ignored on devices without a vibrator
  }
};
