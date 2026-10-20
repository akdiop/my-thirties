import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { filterTasks, sortTasks, type TaskFilter } from '@/agenda/tasks';
import { AppText, Card, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { TaskRow } from '@/features/tasks/TaskRow';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

const EMPTY: Record<TaskFilter, string> = {
  today: 'Rien pour aujourd’hui. Profitez-en, ou ajoutez une tâche.',
  upcoming: 'Aucune tâche planifiée.',
  all: 'Aucune tâche en cours.',
  done: 'Aucune tâche terminée pour l’instant.',
};

export default function Taches() {
  const today = useToday();
  const { c } = useTheme();
  const [filter, setFilter] = useState<TaskFilter>('today');
  const tasks = useData(({ org }) => org.listTasks());
  const mutate = useMutate();
  const shown = filter === 'done' ? filterTasks(tasks, 'done', today) : sortTasks(filterTasks(tasks, filter, today));

  return (
    <Screen
      title="Mes tâches"
      back
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nouvelle tâche"
          onPress={() => router.push({ pathname: '/taches/[id]', params: { id: 'nouveau' } })}
          style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={24} color={c.primary} />
        </Pressable>
      }
    >
      <Segmented<TaskFilter>
        label="Filtre"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'today', label: 'Aujourd’hui' },
          { value: 'upcoming', label: 'À venir' },
          { value: 'all', label: 'Toutes' },
          { value: 'done', label: 'Faites' },
        ]}
      />
      {shown.length ? (
        <Card style={{ paddingVertical: 0 }}>
          {shown.map((t, i) => (
            <TaskRow
              key={t.id}
              task={t}
              today={today}
              last={i === shown.length - 1}
              onToggle={() => mutate(({ org }) => (t.completedAt ? org.reopenTask(t.id, today) : org.completeTask(t, today)))}
            />
          ))}
        </Card>
      ) : (
        <AppText color={c.textMuted}>{EMPTY[filter]}</AppText>
      )}
    </Screen>
  );
}
