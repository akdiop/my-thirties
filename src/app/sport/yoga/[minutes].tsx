import { router, useLocalSearchParams } from 'expo-router';

import { AppText, Button, Card, ListRow, Screen } from '@/components/ui';
import { VideoCard } from '@/components/VideoCard';
import { ficheById, YOGA_SESSIONS } from '@/sport/content';
import { useTheme } from '@/theme/ThemeProvider';

const HOLD: Record<number, string> = { 10: '3 respirations', 20: '5 respirations', 30: '5 à 8 respirations', 45: '8 à 10 respirations, deux tours' };

export default function YogaSession() {
  const { minutes } = useLocalSearchParams<{ minutes: string }>();
  const { c } = useTheme();
  const session = YOGA_SESSIONS.find((s) => String(s.minutes) === minutes);
  if (!session) {
    return (
      <Screen title="Séance introuvable" back>
        <AppText>Cette séance n’existe pas.</AppText>
      </Screen>
    );
  }
  const fiches = session.ficheIds.map(ficheById).filter((f) => !!f);
  return (
    <Screen
      title={`${session.title}`}
      subtitle={`Yoga · ${session.minutes} min · tenir chaque posture ${HOLD[session.minutes]}`}
      back
      footer={
        <Button
          label="J’ai fait cette séance"
          variant="secondary"
          onPress={() => router.push({ pathname: '/sport/seance/[id]', params: { id: 'nouveau', discipline: 'yoga', title: `Yoga · ${session.title}`, minutes: String(session.minutes) } })}
        />
      }
    >
      <VideoCard mediaKey={`yoga-seance-${session.minutes}`} />
      <Card style={{ paddingVertical: 4 }}>
        {fiches.map((f, i) => (
          <ListRow key={f.id} label={`${i + 1}. ${f.title}`} onPress={() => router.push({ pathname: '/sport/fiche/[id]', params: { id: f.id } })} last={i === fiches.length - 1} />
        ))}
      </Card>
      <AppText variant="caption" color={c.textMuted}>Adaptez ou sautez toute posture inconfortable.</AppText>
    </Screen>
  );
}
