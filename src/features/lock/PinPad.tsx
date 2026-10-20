import { Delete } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import { PIN_LENGTH } from '@/security/pin';
import { useTheme } from '@/theme/ThemeProvider';

type Props = { value: string; onChange: (v: string) => void; disabled?: boolean; leftAction?: ReactNode };

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function PinDots({ length }: { length: number }) {
  const { c } = useTheme();
  return (
    <View accessible accessibilityLabel={`${length} chiffres saisis sur ${PIN_LENGTH}`} style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
      {Array.from({ length: PIN_LENGTH }, (_, i) => (
        <View
          key={i}
          style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: i < length ? c.primary : c.rest, backgroundColor: i < length ? c.primary : 'transparent' }}
        />
      ))}
    </View>
  );
}

export function PinPad({ value, onChange, disabled, leftAction }: Props) {
  const { c } = useTheme();
  const press = (digit: string) => {
    if (disabled || value.length >= PIN_LENGTH) return;
    onChange(value + digit);
  };
  const key = (digit: string) => (
    <Pressable
      key={digit}
      accessibilityRole="button"
      accessibilityLabel={digit}
      disabled={disabled}
      onPress={() => press(digit)}
      style={({ pressed }) => ({ width: 72, height: 72, borderRadius: 36, backgroundColor: pressed ? c.surfaceAlt : c.restTint, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.4 : 1 })}
    >
      <AppText style={{ fontSize: 26, lineHeight: 30, fontFamily: 'Inter_500Medium' }}>{digit}</AppText>
    </Pressable>
  );
  return (
    <View style={{ width: 272, flexDirection: 'row', flexWrap: 'wrap', columnGap: 28, rowGap: 18 }}>
      {KEYS.map(key)}
      <View style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}>{leftAction}</View>
      {key('0')}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Effacer"
        disabled={disabled || value.length === 0}
        onPress={() => onChange(value.slice(0, -1))}
        style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}
      >
        <Delete size={26} color={c.primary} />
      </Pressable>
    </View>
  );
}
