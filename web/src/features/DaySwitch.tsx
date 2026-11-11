import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dayBefore, iso, todayIso } from '../lib/day';

const dayAfter = (day: string) => { const d = new Date(day + 'T12:00:00'); d.setDate(d.getDate() + 1); return iso(d); };
/** « aujourd'hui », « hier », sinon « lundi 9 novembre ». */
export function dayName(day: string) {
  const today = todayIso();
  if (day === today) return 'aujourd’hui';
  if (day === dayBefore(today)) return 'hier';
  return new Date(day + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** Choisir le jour à compléter : aujourd'hui, hier ou un jour d'avant, pour cocher après coup. */
export function DaySwitch({ day, onChange }: { day: string; onChange: (day: string) => void }) {
  const today = todayIso(), name = dayName(day);
  return <div className="day-switch">
    <button className="icon-btn" aria-label="Jour précédent" onClick={() => onChange(dayBefore(day))}><ChevronLeft size={20} /></button>
    <strong>{name.charAt(0).toUpperCase() + name.slice(1)}</strong>
    <button className="icon-btn" aria-label="Jour suivant" disabled={day >= today} onClick={() => onChange(dayAfter(day))}><ChevronRight size={20} /></button>
    {day !== today && <button className="link-btn small" onClick={() => onChange(today)}>Revenir à aujourd’hui</button>}
  </div>;
}
