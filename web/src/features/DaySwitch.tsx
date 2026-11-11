import { dayBefore, todayIso } from '../lib/day';
import { Segmented } from '../ui/kit';

const label = (day: string) => new Date(day + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

/** Hier ou aujourd'hui : pour cocher après minuit ce qu'on a fait la veille. */
export function DaySwitch({ day, onChange }: { day: string; onChange: (day: string) => void }) {
  const today = todayIso(), yesterday = dayBefore(today);
  return <div className="day-switch">
    <Segmented label="Jour" value={day === yesterday ? 'hier' : 'auj'} onChange={(v) => onChange(v === 'hier' ? yesterday : today)}
      options={[{ value: 'hier', label: 'Hier' }, { value: 'auj', label: 'Aujourd’hui' }]} />
    {day === yesterday && <small>Tu complètes {label(yesterday)}.</small>}
  </div>;
}
