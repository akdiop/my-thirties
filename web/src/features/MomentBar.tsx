import { useState } from 'react';
import { Droplet, Footprints, Minus, Moon, Pill, Shield, Sunrise, Sunset, Timer, Wallet } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { addDays, DAILY_KIND, isoOf } from '../lib/rituals';
import { momentOf, WATER_GOAL, waterOf } from '../lib/moment';
import { ProtectionSheet } from './ProtectionSheet';
import { ramadanTimes } from './Ramadan';
import { ramadanStatus } from '../lib/ramadan';
import { categoryBudgets, mainCurrency } from '../lib/money';
import { suppStatus } from '../../supabase/functions/push-reminders/supplements';

type Go = (t: 'sommeil' | 'complements' | 'focus' | 'finances') => void;
const dayOf = (start: string, today: string) => Math.floor((new Date(today + 'T12:00:00').getTime() - new Date(start + 'T12:00:00').getTime()) / 86400000) + 1;

/** « En ce moment » : les gestes utiles selon l'heure (protection, compléments, eau, nuit), à portée de pouce. */
export function MomentBar({ entries, onGo, onCreate, onUpdate, now = new Date() }: {
  entries: Entry[]; onGo: Go; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; now?: Date;
}) {
  const [protection, setProtection] = useState(false);
  const today = isoOf(now), moment = momentOf(now.getHours());
  const day = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === today);
  const water = waterOf(day?.data);
  const yesterday = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === addDays(today, -1));
  const steps = Number(yesterday?.data.steps) || 0;
  const supps = entries.filter((e) => e.kind === 'complement' && (() => { const d = Number(e.data.days) || 0; return !d || dayOf(String(e.data.start ?? today), today) <= d; })());
  const suppsToday = supps.filter((e) => { const s = suppStatus(e.data, today); return s.due || s.takenToday; });
  const suppsDone = suppsToday.filter((e) => suppStatus(e.data, today).takenToday).length;

  const ramadan = ramadanStatus(today)?.active ? ramadanTimes(entries, now) : null;
  const budget = categoryBudgets(entries, today.slice(0, 7), mainCurrency(entries)).find((b) => b.share >= 0.8);
  const hm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const setWater = (n: number) => day ? onUpdate(day, { ...day.data, water: n })
    : onCreate({ module: 'equilibre', kind: DAILY_KIND, title: 'Mon jour · ' + today, entry_date: today, data: { date: today, water: n } });

  return <section className="moment-bar" aria-label="En ce moment">
    {ramadan && (hm < ramadan.suhur ? <span className="moment-chip info"><Sunrise size={16} /> Suhûr jusqu’à {ramadan.suhur}</span>
      : hm < ramadan.iftar ? <span className="moment-chip info"><Sunset size={16} /> Iftar à {ramadan.iftar}</span> : null)}
    {(moment === 'matin' || moment === 'soir' || moment === 'nuit') && <button className="moment-chip" onClick={() => setProtection(true)}><Shield size={16} /> Protection</button>}
    {suppsToday.length > 0 && suppsDone < suppsToday.length && moment !== 'nuit' && <button className="moment-chip" onClick={() => onGo('complements')}><Pill size={16} /> Compléments {suppsDone}/{suppsToday.length}</button>}
    {moment !== 'nuit' && <span className={'moment-chip water' + (water >= WATER_GOAL ? ' done' : '')}>
      <button className="moment-water" aria-label={'Ajouter un verre d’eau, ' + water + ' sur ' + WATER_GOAL} onClick={() => void setWater(water + 1)}><Droplet size={16} /> Eau {water}/{WATER_GOAL}</button>
      {water > 0 && <button className="moment-minus" aria-label="Retirer un verre" onClick={() => void setWater(water - 1)}><Minus size={14} /></button>}
    </span>}
    {steps > 0 && moment === 'matin' && <span className="moment-chip info"><Footprints size={16} /> Hier : {steps.toLocaleString('fr-FR')} pas</span>}
    {moment === 'journee' && <button className="moment-chip" onClick={() => onGo('focus')}><Timer size={16} /> Focus</button>}
    {(moment === 'soir' || moment === 'nuit') && <button className="moment-chip" onClick={() => onGo('sommeil')}><Moon size={16} /> Ma nuit</button>}
    {budget && moment !== 'nuit' && <button className="moment-chip warn" onClick={() => onGo('finances')}><Wallet size={16} /> {budget.name} · {budget.share >= 1 ? 'budget dépassé' : Math.round(budget.share * 100) + ' % du budget'}</button>}
    {protection && <ProtectionSheet onClose={() => setProtection(false)} />}
  </section>;
}
