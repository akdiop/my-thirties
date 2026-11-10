import { useState } from 'react';
import { BookOpen, Check, Minus, Moon, Plus, Sunrise, Sunset } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { computeTimes, readSettings } from '../lib/prayertimes';
import { fastingSummary, QURAN_PAGES, RAMADAN_KIND, ramadanStatus, targetPage, type RamadanData } from '../lib/ramadan';
import { isoOf } from '../lib/rituals';
import { Bar } from '../ui/kit';

const addDays = (iso: string, n: number) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

/** Horaires du jour pour le Ramadan : fin du suhûr (Fajr) et rupture du jeûne (Maghrib). */
export function ramadanTimes(entries: Entry[], date = new Date()) {
  const s = readSettings(entries);
  if (!s) return null;
  const t = computeTimes(s.settings, date);
  return { suhur: t.Fajr, iftar: t.Maghrib };
}

/** Mode Ramadan : compte à rebours, horaires du suhûr et de l'iftar, jeûnes du mois, lecture du Coran et rattrapage. */
export function Ramadan({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> }) {
  const today = isoOf(new Date());
  const st = ramadanStatus(today);
  const times = ramadanTimes(entries);
  const all = entries.filter((e) => e.kind === RAMADAN_KIND);
  const entry = st ? all.find((e) => Number(e.data.year) === st.hijriYear) : undefined;
  const data = (entry?.data ?? {}) as RamadanData;
  const [page, setPage] = useState(String(data.page ?? ''));
  const [busy, setBusy] = useState(false);
  const save = async (patch: RamadanData) => { setBusy(true); try { await write(patch); } finally { setBusy(false); } };
  const write = (patch: RamadanData) => entry ? onUpdate(entry, { ...entry.data, ...patch })
    : onCreate({ module: 'spiritualite', kind: RAMADAN_KIND, title: 'Ramadan ' + (st?.hijriYear ?? ''), entry_date: st?.startIso ?? today, data: { year: st?.hijriYear, ...patch } });
  const totalToMakeUp = all.reduce((n, e) => n + fastingSummary(e.data as RamadanData).toMakeUp, 0);
  const lastWithDebt = [...all].sort((a, b) => Number(b.data.year) - Number(a.data.year)).find((e) => fastingSummary(e.data as RamadanData).toMakeUp > 0);

  if (!st) return <p className="muted">Le calendrier hégirien n’est pas disponible sur cet appareil.</p>;
  const fasted = data.fasted ?? {};
  const cycle = (iso: string) => { const v = fasted[iso]; const next = v === undefined ? true : v ? false : undefined; const f = { ...fasted }; if (next === undefined) delete f[iso]; else f[iso] = next; void save({ fasted: f }); };
  const sum = fastingSummary(data);
  const goal = st.active ? targetPage(st.day) : 0, read = Number(data.page) || 0;

  return <section className="ramadan stack-8">
    <div className="prayer-hero ramadan-hero">
      <span className="eyebrow light">Ramadan {st.hijriYear}</span>
      <strong className="serif">{st.active ? 'Jour ' + st.day : 'Dans ' + st.daysUntil + ' jour' + (st.daysUntil > 1 ? 's' : '')}</strong>
      <span>{st.active ? frDay(today) : 'Début prévu le ' + frDay(st.startIso) + ', selon l’observation de la lune'}</span>
    </div>

    <div className="soft-card ramadan-times">
      {times ? <>
        <div><Sunrise size={18} /><span>Fin du suhûr<small>Fajr</small></span><strong className="num">{times.suhur}</strong></div>
        <div><Sunset size={18} /><span>Iftar<small>Maghrib</small></span><strong className="num">{times.iftar}</strong></div>
      </> : <p className="muted small">Indique ta position dans « Horaires des prières » pour voir l’heure du suhûr et de l’iftar.</p>}
    </div>

    {st.active && <section className="soft-card">
      <p className="ritual-label"><Moon size={16} /> Mes jeûnes · {sum.fasted} jeûné{sum.fasted > 1 ? 's' : ''}{sum.missed ? ' · ' + sum.missed + ' à rattraper' : ''}</p>
      <div className="ramadan-grid">{Array.from({ length: Math.min(30, st.day) }, (_, i) => { const iso = addDays(st.startIso, i), v = fasted[iso];
        return <button key={iso} disabled={busy} className={'ramadan-day' + (v === true ? ' on' : v === false ? ' off' : '')} aria-label={'Jour ' + (i + 1) + (v === true ? ', jeûné' : v === false ? ', non jeûné' : '')} onClick={() => cycle(iso)}>{i + 1}</button>; })}</div>
      <p className="muted small">Touche un jour : jeûné, puis non jeûné (à rattraper), puis vide.</p>
    </section>}

    {st.active && <section className="soft-card form-stack">
      <p className="ritual-label"><BookOpen size={16} /> Finir le Coran ce mois-ci</p>
      <p className="muted small">Juz’ du jour : {Math.min(30, st.day)} · objectif page {goal} sur {QURAN_PAGES} (environ 20 pages par jour)</p>
      <Bar value={read / QURAN_PAGES} tone="caramel" />
      <label>J’en suis à la page<input type="number" inputMode="numeric" min={0} max={QURAN_PAGES} value={page} onChange={(e) => setPage(e.target.value)} onBlur={() => { const n = Math.max(0, Math.min(QURAN_PAGES, Number(page) || 0)); setPage(String(n)); void save({ page: n }); }} /></label>
      {read > 0 && <p className="small">{read >= goal ? 'Tu es dans les temps, qu’Allah t’en facilite la suite.' : 'Encore ' + (goal - read) + ' pages pour rattraper le rythme du jour.'}</p>}
    </section>}

    <section className="soft-card">
      <p className="ritual-label">Jours à rattraper</p>
      {totalToMakeUp > 0 && lastWithDebt ? <div className="ramadan-makeup">
        <strong>{totalToMakeUp}</strong><span>jour{totalToMakeUp > 1 ? 's' : ''} à rattraper{!st.active ? ' avant le prochain Ramadan' : ''}</span>
        <button className="icon-btn" aria-label="Annuler un rattrapage" disabled={!Number(lastWithDebt.data.madeUp)} onClick={() => void onUpdate(lastWithDebt, { ...lastWithDebt.data, madeUp: Math.max(0, (Number(lastWithDebt.data.madeUp) || 0) - 1) })}><Minus size={16} /></button>
        <button className="button soft small" onClick={() => void onUpdate(lastWithDebt, { ...lastWithDebt.data, madeUp: (Number(lastWithDebt.data.madeUp) || 0) + 1 })}><Plus size={14} /> J’ai rattrapé un jour</button>
      </div> : <p className="muted small"><Check size={14} /> Aucun jour à rattraper noté.</p>}
    </section>
  </section>;
}
