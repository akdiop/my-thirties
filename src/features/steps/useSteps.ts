import { Pedometer } from 'expo-sensors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { addDays, parseISODate, type ISODate } from '@/agenda/dates';
import { useSession } from '@/db/DatabaseProvider';
import { useSettings } from '@/state/settings';

export type StepDay = { date: ISODate; steps: number | null };

export async function enableSteps() {
  if (!(await Pedometer.isAvailableAsync())) return 'unavailable' as const;
  const current = await Pedometer.getPermissionsAsync();
  if (current.granted) return 'granted' as const;
  if (!current.canAskAgain) return 'denied' as const;
  return (await Pedometer.requestPermissionsAsync()).granted ? ('granted' as const) : ('denied' as const);
}

async function countDay(date: ISODate, now: Date) {
  const start = parseISODate(date);
  const end = parseISODate(addDays(date, 1));
  const result = await Pedometer.getStepCountAsync(start, end < now ? end : now);
  return result.steps;
}

export function useSteps(today: ISODate) {
  const enabled = useSettings((s) => s.stepsEnabled);
  const { well } = useSession();
  const [week, setWeek] = useState<StepDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const savedPast = useRef(new Set<string>());

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const permission = await Pedometer.getPermissionsAsync();
      if (!permission.granted) {
        setError('Accès aux mouvements refusé. Autorisez-le dans Réglages › My thirties.');
        return;
      }
      const now = new Date();
      const days = Array.from({ length: 7 }, (_, i) => addDays(today, -i));
      const counts = await Promise.all(days.map((d) => countDay(d, now).catch(() => null)));
      days.forEach((d, i) => {
        const steps = counts[i];
        if (steps !== null && steps !== undefined && d !== today && !savedPast.current.has(d)) {
          well.saveDailyHealth(d, { steps });
          savedPast.current.add(d);
        }
      });
      if (counts[0] !== null && counts[0] !== undefined) well.saveDailyHealth(today, { steps: counts[0] });
      setWeek(days.map((date, i) => ({ date, steps: counts[i] ?? well.getDailyHealth(date)?.steps ?? null })));
      setError(null);
    } catch {
      setError('Le nombre de pas n’est pas disponible pour le moment.');
    }
  }, [enabled, today, well]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 60_000);
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    return () => {
      clearInterval(t);
      sub.remove();
    };
  }, [refresh]);

  return { enabled, today: week[0]?.steps ?? null, week, error, refresh };
}
