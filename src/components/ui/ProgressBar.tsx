import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const { c } = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={{ height: 8, borderRadius: 4, backgroundColor: c.progressTrack, overflow: 'hidden' }}
    >
      <View style={{ width: `${pct * 100}%`, height: 8, borderRadius: 4, backgroundColor: c.progress }} />
    </View>
  );
}
