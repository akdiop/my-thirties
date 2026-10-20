import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';
import { AppText } from './AppText';

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={{ minHeight: MIN_TOUCH, flexDirection: 'row', alignItems: 'center', gap: 12 }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          borderWidth: 1.5,
          borderColor: checked ? c.success : c.rest,
          backgroundColor: checked ? c.success : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
      </View>
      <AppText color={checked ? c.textMuted : c.text} style={checked && { textDecorationLine: 'line-through' }}>
        {label}
      </AppText>
    </Pressable>
  );
}
