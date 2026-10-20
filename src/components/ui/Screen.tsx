import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = { title: string; subtitle?: string; back?: boolean; right?: ReactNode; children: ReactNode; footer?: ReactNode };

export function Screen({ title, subtitle, back, right, children, footer }: Props) {
  const { c } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 12 }}>
          {back && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour"
              onPress={() => router.back()}
              style={{ width: MIN_TOUCH, height: MIN_TOUCH, marginLeft: -10, alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={24} color={c.primary} />
            </Pressable>
          )}
          <View style={{ flex: 1 }}>
            <AppText variant="screenTitle" accessibilityRole="header">{title}</AppText>
            {subtitle ? <AppText variant="label" color={c.textMuted}>{subtitle}</AppText> : null}
          </View>
          {right}
        </View>
        {children}
      </ScrollView>
      {footer ? <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>{footer}</View> : null}
    </SafeAreaView>
  );
}
