import { Minus, Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export function Scale({ label, value, onChange, max = 5, min = 1, low, high }: { label: string; value: number | null; onChange: (v: number | null) => void; max?: number; min?: number; low?: string; high?: string }) {
  const { c } = useTheme();
  const values = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <View style={{ gap: 6 }}>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', gap: 6 }}>
        {values.map((v) => {
          const on = value === v;
          return (
            <Pressable
              key={v}
              accessibilityRole="radio"
              accessibilityLabel={`${label} ${v}`}
              accessibilityState={{ selected: on }}
              onPress={() => onChange(on ? null : v)}
              style={{ flex: 1, height: MIN_TOUCH, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.secondary : c.surfaceAlt }}
            >
              <AppText variant="label" color={on ? c.onSecondary : c.text}>{v}</AppText>
            </Pressable>
          );
        })}
      </View>
      {low || high ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="caption" color={c.textMuted}>{low}</AppText>
          <AppText variant="caption" color={c.textMuted}>{high}</AppText>
        </View>
      ) : null}
    </View>
  );
}

export function Stepper({ label, value, onChange, min = 0, max = 99, step = 1, suffix }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; suffix?: string }) {
  const { c } = useTheme();
  const btn = (dir: -1 | 1) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${dir < 0 ? 'Moins' : 'Plus'} ${label}`}
      disabled={dir < 0 ? value <= min : value >= max}
      onPress={() => onChange(Math.min(max, Math.max(min, value + dir * step)))}
      style={{ width: MIN_TOUCH, height: MIN_TOUCH, borderRadius: 22, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}
    >
      {dir < 0 ? <Minus size={18} color={c.primary} /> : <Plus size={18} color={c.primary} />}
    </Pressable>
  );
  return (
    <View accessible accessibilityLabel={`${label} : ${value}${suffix ? ` ${suffix}` : ''}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      {btn(-1)}
      <AppText variant="number" style={{ minWidth: 56, textAlign: 'center' }}>
        {value}
        {suffix ? <AppText variant="caption" color={c.textMuted}> {suffix}</AppText> : null}
      </AppText>
      {btn(1)}
    </View>
  );
}
