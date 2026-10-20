import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { type as typeScale, type TypeVariant } from '@/theme/tokens';

type Props = TextProps & { variant?: TypeVariant; color?: string; center?: boolean };

export function AppText({ variant = 'body', color, center, style, ...rest }: Props) {
  const { c } = useTheme();
  const isTitle = variant === 'display' || variant === 'screenTitle';
  return (
    <Text
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[typeScale[variant], { color: color ?? (isTitle ? c.primary : c.text) }, center && { textAlign: 'center' }, style]}
    />
  );
}
