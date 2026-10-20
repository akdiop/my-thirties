import { timeToMinutes } from '@/agenda/dates';

export function sleepMinutes(bedTime: string, wakeTime: string) {
  const bed = timeToMinutes(bedTime);
  const wake = timeToMinutes(wakeTime);
  return wake > bed ? wake - bed : 24 * 60 - bed + wake;
}

export const formatDuration = (minutes: number) => `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`;

export function averageSleep(entries: { bedTime: string; wakeTime: string }[]) {
  if (!entries.length) return null;
  return Math.round(entries.reduce((s, e) => s + sleepMinutes(e.bedTime, e.wakeTime), 0) / entries.length);
}
