import { useEffect, useState } from 'react';

import { buildAgenda, type ExternalEvent } from '@/agenda/agenda';
import { parseISODate, rangeDays, daysBetween, type ISODate } from '@/agenda/dates';
import { formatTime, PRAYER_LABEL, prayerTimes } from '@/spiritualite/prayer';
import { useData } from '@/hooks/useData';
import { useSettings } from '@/state/settings';
import { loadDeviceEvents } from './deviceCalendar';

export function useAgenda(from: ISODate, to: ISODate) {
  const deviceCalendars = useSettings((s) => s.deviceCalendars);
  const prayer = useSettings((s) => s.prayer);
  const [external, setExternal] = useState<ExternalEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!deviceCalendars) {
      setExternal([]);
      return;
    }
    loadDeviceEvents(from, to)
      .then((events) => !cancelled && setExternal(events))
      .catch(() => !cancelled && setExternal([]));
    return () => {
      cancelled = true;
    };
  }, [from, to, deviceCalendars]);

  return useData(
    ({ org, well }) => {
      const prayers = prayer.showInAgenda
        ? rangeDays(from, daysBetween(from, to) + 1).flatMap((date) =>
            prayerTimes(parseISODate(date), prayer).map((p) => ({ date, name: p.name, label: PRAYER_LABEL[p.name], time: formatTime(p.at) })),
          )
        : [];
      const workouts = well.listWorkouts(200).map((w) => ({ id: w.id, date: w.date, title: w.title }));
      return buildAgenda(from, to, { events: org.listEvents(), tasks: org.listTasks(), routines: org.listRoutines(), external, prayers, workouts });
    },
    [from, to, external, prayer],
  );
}
