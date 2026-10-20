import { router } from 'expo-router';
import { View } from 'react-native';

import { filterTasks } from '@/agenda/tasks';
import { isScheduledOn } from '@/agenda/routines';
import { PlannedCard } from '@/components/PlannedCard';
import { AppText, Card, ListRow, Screen } from '@/components/ui';
import { useData } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';

export default function Quotidien() {
  const today = useToday();
  const { c } = useTheme();
  const counts = useData(
    ({ org }) => ({
      tasksToday: filterTasks(org.listTasks(), 'today', today).length,
      routinesToday: org.listRoutines().filter((r) => isScheduledOn(r.weekdays, today)).length,
    }),
    [today],
  );
  return (
    <Screen title="Mon quotidien" back>
      <Card style={{ paddingVertical: 4 }}>
        <ListRow label="Mes tâches" value={counts.tasksToday ? `${counts.tasksToday} aujourd’hui` : undefined} onPress={() => router.push('/taches')} />
        <ListRow label="Mes routines" value={counts.routinesToday ? `${counts.routinesToday} aujourd’hui` : undefined} onPress={() => router.push('/routines')} />
        <ListRow label="Agenda" onPress={() => router.navigate('/agenda')} last />
      </Card>
      <PlannedCard title="Planification intelligente" phase={5}>
        L’assistant proposera une organisation de la journée ou de la semaine, toujours soumise à votre accord.
      </PlannedCard>
      <View>
        <AppText variant="caption" color={c.textMuted}>Les priorités du jour se choisissent depuis une tâche (trois au maximum).</AppText>
      </View>
    </Screen>
  );
}
