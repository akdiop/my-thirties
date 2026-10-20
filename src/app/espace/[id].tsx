import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { ModuleIcon } from '@/components/ModuleIcon';
import { PlannedCard } from '@/components/PlannedCard';
import { AppText, Screen, StatusBadge } from '@/components/ui';
import { getModule } from '@/modules/registry';
import { useTheme } from '@/theme/ThemeProvider';

export default function Espace() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const module = getModule(id ?? '');
  const { c } = useTheme();
  if (!module) {
    return (
      <Screen title="Espace introuvable" back>
        <AppText>Cet espace n’existe pas.</AppText>
      </Screen>
    );
  }
  return (
    <Screen title={module.label} back>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <ModuleIcon id={module.id} color={c.primary} />
        <StatusBadge status={module.status} />
      </View>
      <PlannedCard title="À venir" phase={module.phase}>
        {module.description}
      </PlannedCard>
      {module.sensitive ? (
        <AppText variant="caption" color={c.textMuted}>
          Données sensibles : chiffrées sur l’iPhone, jamais partagées avec l’assistant sans votre accord.
        </AppText>
      ) : null}
    </Screen>
  );
}
