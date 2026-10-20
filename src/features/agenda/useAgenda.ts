import { useEffect, useState } from 'react';

import { buildAgenda, type ExternalEvent } from '@/agenda/agenda';
import type { ISODate } from '@/agenda/dates';
import { useData } from '@/hooks/useData';
import { useSettings } from '@/state/settings';
import { loadDeviceEvents } from './deviceCalendar';

export function useAgenda(from: ISODate, to: ISODate) {
  const deviceCalendars = useSettings((s) => s.deviceCalendars);
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
    ({ org }) => buildAgenda(from, to, { events: org.listEvents(), tasks: org.listTasks(), routines: org.listRoutines(), external }),
    [from, to, external],
  );
}
