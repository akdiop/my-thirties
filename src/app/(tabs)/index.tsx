import { Sparkles } from 'lucide-react-native';
import { View } from 'react-native';

import { CalmButton } from '@/components/CalmButton';
import { PlannedCard } from '@/components/PlannedCard';
import { AppText, Screen } from '@/components/ui';
import { useAppData } from '@/state/appData';
import { useTheme } from '@/theme/ThemeProvider';
import { formatLongDate, greeting } from '@/utils/dates';

export default function Accueil() {
  const profile = useAppData((s) => s.profile);
  const { c } = useTheme();
  const now = new Date();
  return (
    <Screen
      title={`${greeting(now)}, ${profile?.firstName ?? ''}`}
      subtitle={formatLongDate(now, profile?.timezone)}
      right={<Sparkles size={22} color={c.primary} accessibilityLabel="Assistant, prévu en phase 5" />}
    >
      <CalmButton />
      <PlannedCard title="Votre journée" phase={2}>
        Le briefing du matin réunira ici votre agenda, vos trois priorités et vos rappels.
      </PlannedCard>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <PlannedCard title="Challenges" phase={3}>Vos calendriers de 30 jours.</PlannedCard>
        </View>
        <View style={{ flex: 1 }}>
          <PlannedCard title="Budget" phase={4}>Ce qu’il reste ce mois-ci.</PlannedCard>
        </View>
      </View>
      <AppText variant="caption" color={c.textMuted} center>
        Les widgets seront déplaçables et masquables.
      </AppText>
    </Screen>
  );
}
