import { useState } from 'react';
import { Droplet, Minus, Moon, Pill, Shield, Timer } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { DAILY_KIND, isoOf } from '../lib/rituals';
import { momentOf, WATER_GOAL, waterOf } from '../lib/moment';
import { ProtectionSheet } from './ProtectionSheet';

type Go = (t: 'sommeil' | 'complements' | 'focus') => void;
const dayOf = (start: string, today: string) => Math.floor((new Date(today + 'T12:00:00').getTime() - new Date(start + 'T12:00:00').getTime()) / 86400000) + 1;

/** « En ce moment » : les gestes utiles selon l'heure (protection, compléments, eau, nuit), à portée de pouce. */
export function MomentBar({ entries, onGo, onCreate, onUpdate, now = new Date() }: {
  entries: Entry[]; onGo: Go; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; now?: Date;
}) {
  const [protection, setProtection] = useState(false);
  const today = isoOf(now), moment = momentOf(now.getHours());
  const day = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === today);
  const water = waterOf(day?.data);
  const supps = entries.filter((e) => e.kind === 'complement' && (() => { const d = Number(e.data.days) || 0; return !d || dayOf(String(e.data.start ?? today), today) <= d; })());
  const suppsDone = supps.filter((e) => (e.data.done as Record<string, boolean> | undefined)?.[today]).length;

  const setWater = (n: number) => day ? onUpdate(day, { ...day.data, water: n })
    : onCreate({ module: 'equilibre', kind: DAILY_KIND, title: 'Mon jour · ' + today, entry_date: today, data: { date: today, water: n } });

  return <section className="moment-bar" aria-label="En ce moment">
    {(moment === 'matin' || moment === 'soir' || moment === 'nuit') && <button className="moment-chip" onClick={() => setProtection(true)}><Shield size={16} /> Protection</button>}
    {supps.length > 0 && suppsDone < supps.length && moment !== 'nuit' && <button className="moment-chip" onClick={() => onGo('complements')}><Pill size={16} /> Compléments {suppsDone}/{supps.length}</button>}
    {moment !== 'nuit' && <span className={'moment-chip water' + (water >= WATER_GOAL ? ' done' : '')}>
      <button className="moment-water" aria-label={'Ajouter un verre d’eau, ' + water + ' sur ' + WATER_GOAL} onClick={() => void setWater(water + 1)}><Droplet size={16} /> Eau {water}/{WATER_GOAL}</button>
      {water > 0 && <button className="moment-minus" aria-label="Retirer un verre" onClick={() => void setWater(water - 1)}><Minus size={14} /></button>}
    </span>}
    {moment === 'journee' && <button className="moment-chip" onClick={() => onGo('focus')}><Timer size={16} /> Focus</button>}
    {(moment === 'soir' || moment === 'nuit') && <button className="moment-chip" onClick={() => onGo('sommeil')}><Moon size={16} /> Ma nuit</button>}
    {protection && <ProtectionSheet onClose={() => setProtection(false)} />}
  </section>;
}
