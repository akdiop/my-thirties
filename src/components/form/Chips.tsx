import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

type Option<T> = { value: T; label: string; color?: string };

export function Chips<T extends string | number | null>({ options, value, onChange, label }: { options: Option<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={{
              minHeight: 38,
              paddingHorizontal: 14,
              borderRadius: radius.pill,
              backgroundColor: active ? c.secondary : c.surfaceAlt,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {o.color ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: o.color }} /> : null}
            <AppText variant="label" color={active ? c.onSecondary : c.text}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export function WeekdayPicker({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) {
  const { c } = useTheme();
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const names = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {days.map((d, i) => {
        const wd = i + 1;
        const on = value.includes(wd);
        return (
          <Pressable
            key={wd}
            accessibilityRole="checkbox"
            accessibilityLabel={names[i]}
            accessibilityState={{ checked: on }}
            onPress={() => onChange(on ? value.filter((x) => x !== wd) : [...value, wd].sort())}
            style={{ flex: 1, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.secondary : c.surfaceAlt }}
          >
            <AppText variant="label" color={on ? c.onSecondary : c.text}>{d}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
