import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = { label: string; value?: string; onPress?: () => void; right?: ReactNode; last?: boolean; color?: string };

export function ListRow({ label, value, onPress, right, last, color }: Props) {
  const { c } = useTheme();
  const content = (
    <View style={{ minHeight: MIN_TOUCH + 4, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: last ? 0 : 1, borderColor: c.border }}>
      <AppText style={{ flex: 1 }} color={color}>{label}</AppText>
      {value ? <AppText variant="label" color={c.textMuted}>{value}</AppText> : null}
      {right}
      {onPress && !right ? <ChevronRight size={16} color={c.textMuted} /> : null}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    content
  );
}
