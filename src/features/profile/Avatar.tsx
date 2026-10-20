import { Image, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

export function Avatar({ photo, name, size = 56 }: { photo: string | null | undefined; name: string | undefined; size?: number }) {
  const { c } = useTheme();
  if (photo) return <Image source={{ uri: photo }} accessibilityIgnoresInvertColors style={{ width: size, height: size, borderRadius: size / 2 }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
      <AppText style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: size * 0.45 }} color={c.primary}>
        {(name?.trim().charAt(0) || 'M').toUpperCase()}
      </AppText>
    </View>
  );
}
