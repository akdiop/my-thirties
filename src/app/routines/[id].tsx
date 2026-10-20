import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { dayLabel, toISODate } from '@/agenda/dates';
import { routineProgress } from '@/agenda/routines';
import { AppText, Button, Card, Checkbox, ProgressBar, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';

export default function RoutineDay() {
  const { id, date: param } = useLocalSearchParams<{ id: string; date?: string }>();
  const date = param ?? toISODate(new Date());
  const { c } = useTheme();
  const mutate = useMutate();
  const data = useData(
    ({ org }) => {
      const routine = org.getRoutine(id);
      const items = org.listRoutineItems(id);
      return { routine, items, checked: org.checksFor(id, date) };
    },
    [id, date],
  );

  if (!data.routine) {
    return (
      <Screen title="Routine introuvable" back>
        <AppText>Cette routine n’existe plus.</AppText>
      </Screen>
    );
  }

  const progress = routineProgress(data.items.map((i) => i.id), data.checked);

  return (
    <Screen
      title={data.routine.name}
      subtitle={dayLabel(date)}
      back
      footer={<Button label="Modifier la routine" variant="outline" onPress={() => router.push({ pathname: '/routines/edition/[id]', params: { id } })} />}
    >
      <View style={{ gap: 6 }}>
        <ProgressBar value={progress.ratio} label={`${progress.done} étapes sur ${progress.total}`} />
        <AppText variant="caption" color={c.accent}>
          {progress.done} / {progress.total} étapes
        </AppText>
      </View>
      <Card style={{ paddingVertical: 4 }}>
        {data.items.length ? (
          data.items.map((item) => (
            <Checkbox key={item.id} label={item.title} checked={data.checked.has(item.id)} onChange={(v) => mutate(({ org }) => org.toggleRoutineItem(item.id, date, v))} />
          ))
        ) : (
          <AppText color={c.textMuted} style={{ paddingVertical: 12 }}>Aucune étape. Ajoutez-en depuis « Modifier la routine ».</AppText>
        )}
      </Card>
      {progress.total > 0 && progress.done === progress.total ? (
        <AppText color={c.accent} center>Routine terminée. Bravo.</AppText>
      ) : null}
    </Screen>
  );
}
