import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, Settings2, Trash2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { countOn, goalOf, wirdPace } from '../../supabase/functions/push-reminders/wird';

export const WIRD_KIND = 'wird';
type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;

/** Suggestion de départ : la dou'â de Moussa (Coran 28:24). */
export const WIRD_SUGGESTIONS = [
  { title: 'Rabbi innî limâ anzalta ilayya min khayrin faqîr', arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
    phonetic: 'Rabbi innî limâ anzalta ilayya min khayrin faqîr', french: 'Seigneur, j’ai grand besoin du bien que Tu feras descendre vers moi.', ref: 'Coran 28:24 (sourate al-Qasas)', goal: 100 },
];

const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

/** Compteur d'un objectif de dhikr : appuis groupés et enregistrés après une courte pause. */
export function useWirdCount(entry: Entry | undefined, onUpdate: Save) {
  const day = isoOf(new Date());
  const [extra, setExtra] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(0);
  const flush = () => {
    if (!entry || !pending.current) return;
    const n = pending.current; pending.current = 0;
    const counts = (entry.data.counts && typeof entry.data.counts === 'object' ? entry.data.counts : {}) as Record<string, number>;
    void onUpdate(entry, { ...entry.data, counts: { ...counts, [day]: Math.max(0, countOn(entry.data, day) + n) } }).then(() => setExtra((x) => x - n));
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); flush(); }, [entry?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const add = (n: number) => {
    pending.current += n; setExtra((x) => x + n);
    try { navigator.vibrate?.(8); } catch { /* vibration indisponible */ }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 1200);
  };
  return { count: entry ? countOn(entry.data, day) + extra : 0, add };
}

/** Mes objectifs de dhikr : 100 ou 1000 fois dans la journée, avec l'avance ou le retard à cette heure. */
export function Wird({ entries, onCreate, onUpdate, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const list = entries.filter((e) => e.kind === WIRD_KIND);
  const [adding, setAdding] = useState(!list.length);
  const [title, setTitle] = useState(''), [goal, setGoal] = useState('100');
  const create = async (d: { title: string; arabic?: string; phonetic?: string; french?: string; ref?: string; goal: number }) => {
    await onCreate({ module: 'spiritualite', kind: WIRD_KIND, title: d.title.slice(0, 120), entry_date: null,
      data: { arabic: d.arabic ?? '', phonetic: d.phonetic ?? '', french: d.french ?? '', ref: d.ref ?? '', goal: d.goal, start: '07:00', end: '22:00', counts: {} } });
    setAdding(false); setTitle('');
  };
  return <section className="stack-8">
    {list.map((e) => <WirdCard key={e.id} entry={e} onUpdate={onUpdate} onRemove={onRemove} />)}
    {adding ? <div className="soft-card form-stack">
      <p className="ritual-label">Nouvel objectif de la journée</p>
      {WIRD_SUGGESTIONS.filter((s) => !list.some((e) => e.title === s.title)).map((s) => <button key={s.title} className="button soft wide" onClick={() => void create(s)}>
        <Plus size={16} /> {s.title} · {s.goal} par jour</button>)}
      <label>Ou une autre formule<input value={title} maxLength={120} placeholder="Astaghfirullah, salawât…" onChange={(e) => setTitle(e.target.value)} /></label>
      <label>Combien de fois par jour<select value={goal} onChange={(e) => setGoal(e.target.value)}>{[33, 70, 100, 300, 500, 1000].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      <div className="button-group"><button className="button primary" disabled={!title.trim()} onClick={() => void create({ title: title.trim(), goal: Number(goal) })}>Ajouter</button>
        {list.length > 0 && <button className="button ghost" onClick={() => setAdding(false)}>Annuler</button>}</div>
    </div> : <button className="button secondary wide" onClick={() => setAdding(true)}><Plus size={16} /> Ajouter un objectif</button>}
  </section>;
}

function WirdCard({ entry, onUpdate, onRemove }: { entry: Entry; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const day = isoOf(new Date());
  const { count, add } = useWirdCount(entry, onUpdate);
  const [settings, setSettings] = useState(false);
  const p = wirdPace({ ...entry.data, counts: { [day]: count } }, day, nowMin());
  const d = entry.data;
  const week = Array.from({ length: 7 }, (_, i) => { const x = new Date(day + 'T12:00:00'); x.setDate(x.getDate() - 6 + i); return isoOf(x); });
  return <article className="soft-card wird-card">
    <div className="wird-head"><strong>{entry.title}</strong><button className="icon-btn" aria-label="Réglages de l’objectif" onClick={() => setSettings(!settings)}><Settings2 size={18} /></button></div>
    {typeof d.arabic === 'string' && d.arabic && <p className="dua-ar" lang="ar" dir="rtl">{d.arabic}</p>}
    {typeof d.french === 'string' && d.french && <p className="muted small">{d.french}{d.ref ? ' (' + String(d.ref) + ')' : ''}</p>}
    <button className="dhikr-btn wird-btn" onClick={() => add(1)} aria-label={'Compter, ' + count + ' sur ' + p.goal}>
      <strong>{count}</strong><small>sur {p.goal}</small>
      <span className="dhikr-ring" style={{ background: `conic-gradient(#5F7A59 ${Math.min(1, count / p.goal) * 360}deg, #DDE5D7 0)` }} /></button>
    <div className="wird-quick">{[10, 33, 100].map((n) => <button key={n} className="chip" onClick={() => add(n)}>+{n}</button>)}
      <button className="chip" aria-label="Retirer 1" onClick={() => add(-1)} disabled={!count}><Minus size={14} /></button></div>
    <p className={'wird-pace' + (p.finished ? ' done' : p.behind > 0 ? ' late' : '')}>{p.finished ? 'Objectif atteint aujourd’hui, alhamdulillah'
      : p.behind > 0 ? 'À cette heure, vise ' + p.expected + ' : encore ' + p.behind + ' pour être à jour' : 'Tu es dans le rythme · encore ' + p.left + ' aujourd’hui'}</p>
    <div className="week-dots">{week.map((w) => <span key={w} className={(countOn(d, w) >= goalOf(d) ? 'on' : '') + (w === day ? ' today' : '')} title={w + ' : ' + countOn(d, w)}>{new Date(w + 'T12:00:00').getDate()}</span>)}</div>
    {settings && <div className="form-stack">
      <label>Objectif par jour<select value={String(goalOf(d))} onChange={(e) => void onUpdate(entry, { ...d, goal: Number(e.target.value) })}>
        {[33, 70, 100, 300, 500, 1000].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      <div className="two-inputs"><label>De<input type="time" value={String(d.start ?? '07:00')} onChange={(e) => void onUpdate(entry, { ...d, start: e.target.value })} /></label>
        <label>À<input type="time" value={String(d.end ?? '22:00')} onChange={(e) => void onUpdate(entry, { ...d, end: e.target.value })} /></label></div>
      <p className="muted small">L’objectif est réparti sur ces heures ; les rappels arrivent si tu as du retard.</p>
      <button className="button ghost" onClick={() => void onRemove(entry)}><Trash2 size={16} /> Supprimer cet objectif</button>
    </div>}
  </article>;
}
