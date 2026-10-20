import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { HeaderAdd } from '@/components/HeaderAdd';
import { AppText, Card, Screen } from '@/components/ui';
import { TRIP_STATUS_LABEL, tripCountdown, type TripStatus } from '@/decouvertes/trips';
import { useData } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';

const ORDER: TripStatus[] = ['planned', 'idea', 'done'];

export default function Decouvertes() {
  const today = useToday();
  const { c } = useTheme();
  const trips = useData(({ life }) => life.listTrips());

  return (
    <Screen title="Mes découvertes" back right={<HeaderAdd label="Nouvelle destination" onPress={() => router.push({ pathname: '/decouvertes/edition/[id]', params: { id: 'new' } })} />}>
      {!trips.length ? <AppText color={c.textMuted}>Notez une première envie de voyage : destination, période rêvée, budget.</AppText> : null}
      {ORDER.map((status) => {
        const group = trips.filter((t) => t.status === status);
        if (!group.length) return null;
        return (
          <View key={status} style={{ gap: 8 }}>
            <AppText variant="cardTitle">{status === 'planned' ? 'Prochains voyages' : status === 'idea' ? 'Envies' : 'Souvenirs'}</AppText>
            {group.map((t) => {
              const countdown = tripCountdown(t, today);
              return (
                <Pressable key={t.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/decouvertes/[id]', params: { id: t.id } })}>
                  <Card tone={countdown ? 'sage' : 'surface'} style={{ gap: 4 }}>
                    <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{t.title}</AppText>
                    <AppText variant="caption" color={c.textMuted}>
                      {t.destination}
                      {t.startDate ? ` · ${t.startDate.split('-').reverse().join('/')}` : ''} · {TRIP_STATUS_LABEL[t.status]}
                    </AppText>
                    {countdown ? <AppText variant="caption" color={c.accent} style={{ fontFamily: 'Inter_600SemiBold' }}>{countdown}</AppText> : null}
                  </Card>
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </Screen>
  );
}
