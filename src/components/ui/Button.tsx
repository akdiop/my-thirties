import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH, radius } from '@/theme/tokens';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

type Props = Omit<PressableProps, 'children'> & { label: string; variant?: Variant; loading?: boolean };

export function Button({ label, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  const { c } = useTheme();
  const look = {
    primary: { bg: c.primary, fg: c.onPrimary, border: c.primary },
    secondary: { bg: c.secondary, fg: c.onSecondary, border: c.secondary },
    outline: { bg: 'transparent', fg: c.primary, border: c.primary },
    danger: { bg: 'transparent', fg: c.danger, border: c.danger },
  }[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      style={(state) => [
        styles.base,
        { backgroundColor: look.bg, borderColor: look.border, opacity: inactive ? 0.5 : state.pressed ? 0.85 : 1 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color={look.fg} /> : <AppText variant="label" color={look.fg} style={styles.label}>{label}</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: Math.max(MIN_TOUCH, 52), borderRadius: radius.lg, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
});
