import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ModuleIcon } from '@/components/ModuleIcon';
import { AppText, Screen } from '@/components/ui';
import { orderedModules } from '@/modules/registry';
import { useAppData } from '@/state/appData';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export default function Espaces() {
  const modules = useAppData((s) => s.modules);
  const { c, scheme } = useTheme();
  const tones = {
    sand: { bg: c.surfaceAlt, fg: c.primary },
    sage: { bg: c.successTint, fg: c.accent },
    blush: { bg: scheme === 'dark' ? c.surface : '#F3E9DF', fg: c.primary },
  };
  const visible = orderedModules(modules);
  return (
    <Screen title="Mes espaces" subtitle={`${visible.length} espaces actifs`}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {visible.map(({ module }) => (
          <Pressable
            key={module.id}
            accessibilityRole="button"
            accessibilityLabel={module.label}
            onPress={() => router.push({ pathname: '/espace/[id]', params: { id: module.id } })}
            style={({ pressed }) => ({
              width: '31%',
              aspectRatio: 0.95,
              borderRadius: radius.lg + 2,
              backgroundColor: tones[module.tone].bg,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 6,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <ModuleIcon id={module.id} color={tones[module.tone].fg} />
            <AppText variant="label" center>{module.label}</AppText>
          </Pressable>
        ))}
      </View>
      <AppText variant="caption" color={c.textMuted} center>
        Les espaces se masquent depuis Profil › Espaces affichés.
      </AppText>
    </Screen>
  );
}
