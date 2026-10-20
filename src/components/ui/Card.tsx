import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

type Props = ViewProps & { tone?: 'surface' | 'sand' | 'sage' };

export function Card({ tone = 'surface', style, ...rest }: Props) {
  const { c } = useTheme();
  const bg = { surface: c.surface, sand: c.surfaceAlt, sage: c.successTint }[tone];
  return (
    <View
      style={[{ backgroundColor: bg, borderRadius: radius.lg, padding: 16, borderWidth: tone === 'surface' ? 1 : 0, borderColor: c.border }, style]}
      {...rest}
    />
  );
}
