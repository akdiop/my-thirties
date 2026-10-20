import * as Notifications from 'expo-notifications';

import type { PlannedNotification } from './planner';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensurePermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function applyPlan(plan: PlannedNotification[]) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const n of plan) {
    await Notifications.scheduleNotificationAsync({
      identifier: n.id,
      content: { title: n.title, body: n.body, data: { category: n.category } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: n.deliverAt },
    });
  }
}

export const cancelAll = () => Notifications.cancelAllScheduledNotificationsAsync();
