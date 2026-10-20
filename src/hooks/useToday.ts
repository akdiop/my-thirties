import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { toISODate } from '@/agenda/dates';

export function useToday() {
  const [today, setToday] = useState(() => toISODate(new Date()));
  useEffect(() => {
    const refresh = () => setToday(toISODate(new Date()));
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    const timer = setInterval(refresh, 60_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, []);
  return today;
}
