import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { useData } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useSettings } from '@/state/settings';
import { planNotifications } from './planner';
import { collectReminders } from './reminders';
import { applyPlan, cancelAll } from './scheduler';

export function NotificationSync() {
  const today = useToday();
  const settings = useSettings();
  const sources = useData(({ org }) => ({ events: org.listEvents(), tasks: org.listTasks(), routines: org.listRoutines() }));

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (!settings.notifications.enabled) {
          await cancelAll();
          return;
        }
        const permission = await Notifications.getPermissionsAsync();
        if (!permission.granted) return;
        const reminders = collectReminders(today, 7, { ...sources, briefingTime: settings.briefingTime, eveningTime: settings.eveningTime });
        await applyPlan(planNotifications(reminders, settings.notifications, Date.now(), -new Date().getTimezoneOffset()));
      } catch {
        // Une erreur de planification ne doit pas bloquer l’application ; la prochaine modification relancera la synchronisation.
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [today, sources, settings.notifications, settings.briefingTime, settings.eveningTime]);

  return null;
}
