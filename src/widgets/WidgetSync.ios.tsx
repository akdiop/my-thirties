import { useEffect } from 'react';
import { dailyPriorities } from '@/agenda/tasks';
import { useData } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useSettings } from '@/state/settings';
import DayWidget from './DayWidget';
import LockWidget from './LockWidget';

const EMPTY_DAY = { heading: 'My Thirties', summary: 'Votre espace personnel', priorityOne: '', priorityTwo: '', visible: false };
export function clearWidgets() {
  DayWidget.updateSnapshot(EMPTY_DAY);
  LockWidget.updateSnapshot({ countLabel: 'My Thirties', showCount: false });
}

export function WidgetSync() {
  const today = useToday();
  const enabled = useSettings((s) => s.widgetAgendaEnabled);
  const tasks = useData(({ org }) => org.listTasks());

  useEffect(() => {
    if (!enabled) {
      clearWidgets();
      return;
    }
    // Only explicitly permitted priorities; lock screen shows counts, never titles.
    const priorities = dailyPriorities(tasks, today).filter((t) => !t.completedAt);
    const count = priorities.length;
    const summary = count === 0 ? 'Aucune priorité en attente' : count === 1 ? '1 priorité en attente' : `${count} priorités en attente`;
    DayWidget.updateSnapshot({
      heading: 'Ma journée',
      summary,
      priorityOne: priorities[0]?.title.slice(0, 65) ?? '',
      priorityTwo: priorities[1]?.title.slice(0, 65) ?? '',
      visible: true,
    });
    LockWidget.updateSnapshot({ countLabel: summary, showCount: true });
  }, [enabled, tasks, today]);
  return null;
}
