import { router } from 'expo-router';
import { Waves } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { AppText } from '@/components/ui';
import { palette, radius } from '@/theme/tokens';

export function CalmButton() {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/calme')}
      style={({ pressed }) => ({
        minHeight: 48,
        borderRadius: radius.pill,
        backgroundColor: palette.sage,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Waves size={20} color="#1F2A1B" />
      <AppText variant="label" color="#1F2A1B" style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
        J’ai besoin de me calmer
      </AppText>
    </Pressable>
  );
}
