import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';
import { AppText } from './AppText';

type Props<T extends string> = { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string };

export function Segmented<T extends string>({ value, options, onChange, label }: Props<T>) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', backgroundColor: c.surfaceAlt, borderRadius: radius.md + 2, padding: 4 }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={{ flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md - 1, backgroundColor: active ? c.secondary : 'transparent' }}
          >
            <AppText variant="label" color={active ? c.onSecondary : c.text} style={active && { fontFamily: 'Inter_600SemiBold' }}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
