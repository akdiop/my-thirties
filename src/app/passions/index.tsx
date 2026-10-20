import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { HeaderAdd } from '@/components/HeaderAdd';
import { AppText, Card, ProgressBar, Screen } from '@/components/ui';
import { useData } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';

const STATUS = { active: 'En cours', paused: 'En pause', done: 'Accomplie' } as const;

export default function Passions() {
  const { c } = useTheme();
  const passions = useData(({ life }) =>
    life.listPassions().map((p) => {
      const steps = life.passionSteps(p.id);
      return { p, done: steps.filter((s) => s.doneAt).length, total: steps.length, next: steps.find((s) => !s.doneAt) };
    }),
  );

  return (
    <Screen title="Mes passions" back right={<HeaderAdd label="Nouvelle passion" onPress={() => router.push('/passions/nouveau')} />}>
      {!passions.length ? <AppText color={c.textMuted}>Choisissez un hobby à explorer sur six ou douze mois : céramique, piano, photo, couture…</AppText> : null}
      {passions.map(({ p, done, total, next }) => (
        <Pressable key={p.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/passions/[id]', params: { id: p.id } })}>
          <Card style={{ gap: 6 }}>
            <AppText variant="cardTitle">{p.title}</AppText>
            <ProgressBar value={total ? done / total : 0} label={`${done} étapes sur ${total}`} />
            <AppText variant="caption" color={c.textMuted}>
              {STATUS[p.status]} · parcours de {p.horizonMonths} mois{next ? ` · prochaine étape : ${next.title}` : ''}
            </AppText>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}
