import { router } from 'expo-router';
import { Check, Star } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { dayLabel } from '@/agenda/dates';
import { isOverdue, type TaskLike } from '@/agenda/tasks';
import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

const PRIORITY_COLOR = ['transparent', '#8F9F7A', '#B68F72', '#6B3F2E'];

export function TaskRow({ task, today, onToggle, last }: { task: TaskLike; today: string; onToggle: () => void; last?: boolean }) {
  const { c } = useTheme();
  const done = !!task.completedAt;
  const overdue = isOverdue(task, today);
  const due = task.dueDate ? (task.dueDate === today ? 'Aujourd’hui' : dayLabel(task.dueDate)) : null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, borderBottomWidth: last ? 0 : 1, borderColor: c.border }}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={task.title}
        accessibilityState={{ checked: done }}
        onPress={onToggle}
        style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginLeft: -10 }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 7,
            borderWidth: 1.5,
            borderColor: done ? c.success : c.rest,
            backgroundColor: done ? c.success : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {done ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityHint="Ouvrir la tâche" onPress={() => router.push({ pathname: '/taches/[id]', params: { id: task.id } })} style={{ flex: 1, paddingVertical: 8, gap: 2 }}>
        <AppText style={done ? { textDecorationLine: 'line-through', color: c.textMuted } : undefined}>{task.title}</AppText>
        {due || task.recurrence ? (
          <AppText variant="caption" color={overdue ? c.danger : c.textMuted}>
            {[due && (overdue ? `En retard · ${due}` : due), task.dueTime, task.recurrence ? 'Répétée' : null].filter(Boolean).join(' · ')}
          </AppText>
        ) : null}
      </Pressable>
      {task.focusDate === today && !done ? <Star size={16} color={c.rest} fill={c.rest} accessibilityLabel="Priorité du jour" /> : null}
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: PRIORITY_COLOR[task.priority] ?? 'transparent' }} />
    </View>
  );
}
