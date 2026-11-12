import { useEffect, useMemo, useRef, useState } from 'react';
import { Headphones, Play, Square } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { BESOINS, ecoutes, FREQUENCES, mesFrequences, METHODE, RESSENTIS, type Frequence } from '../lib/frequences';
import { MEDITATION_KIND } from '../lib/meditation';
import { isoOf } from '../lib/rituals';
import { bell, tone, unlockSound } from '../lib/sound';

const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

/** Fréquences : choisir selon son besoin, écouter au casque après 2 minutes de respiration, noter ses ressentis. */
export function Frequences({ entries, onCreate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const [besoin, setBesoin] = useState<string | null>(null);
  const [session, setSession] = useState<{ f: Frequence; minutes: number; breathe: boolean } | null>(null);
  const [minutes, setMinutes] = useState(10), [breathe, setBreathe] = useState(true);
  const journal = useMemo(() => ecoutes(entries), [entries]);
  const mine = useMemo(() => mesFrequences(journal), [journal]);
  const list = besoin ? FREQUENCES.filter((f) => BESOINS.find((b) => b.label === besoin)!.hz.includes(f.hz)) : FREQUENCES;
  if (session) return <Listening {...session} intention={besoin ?? ''} onClose={() => setSession(null)} onSave={(d) => onCreate({ module: 'equilibre', kind: MEDITATION_KIND,
    title: 'Fréquence · ' + session.f.hz + ' Hz', entry_date: isoOf(new Date()), data: { date: isoOf(new Date()), type: 'frequence', name: session.f.hz + ' Hz · ' + session.f.titre, hz: session.f.hz, ...d } })} />;
  return <div className="stack-8">
    <details className="soft-card"><summary className="ritual-label">Comment écouter</summary><ol className="freq-steps">{METHODE.map((m) => <li key={m}>{m}</li>)}</ol></details>
    <div><p className="ritual-label">De quoi ai-je besoin ?</p><div className="chip-row">{BESOINS.map((b) => <button key={b.label} className={'chip' + (besoin === b.label ? ' on' : '')} aria-pressed={besoin === b.label}
      onClick={() => setBesoin(besoin === b.label ? null : b.label)}>{b.label}</button>)}</div></div>
    <div className="soft-card form-stack"><div className="chip-row">{[5, 10, 15, 20, 30].map((m) => <button key={m} className={'chip' + (minutes === m ? ' on' : '')} onClick={() => setMinutes(m)}>{m} min</button>)}</div>
      <label className="freq-check"><input type="checkbox" checked={breathe} onChange={(e) => setBreathe(e.target.checked)} /> Commencer par 2 minutes de respiration</label></div>
    {list.map((f) => <button key={f.hz} className="med-row" onClick={() => { unlockSound(); setSession({ f, minutes, breathe }); }}>
      <span className="pill freq-hz">{f.hz} Hz</span><span className="workout-title"><strong>{f.titre}</strong><small>{f.texte}</small></span><Play size={16} /></button>)}
    {journal.length > 0 && <div className="soft-card"><p className="ritual-label">Mon journal d’écoute</p>
      {mine.slice(0, 3).map((m) => <p key={m.hz} className="fiche-pt"><strong>{m.hz} Hz</strong> · {m.fois} écoute{m.fois > 1 ? 's' : ''}, {m.minutes} min{m.ressenti ? ' · souvent ' + m.ressenti.toLowerCase() : ''}</p>)}
      {journal.slice(0, 10).map((x, i) => <p key={i} className="muted small">{frDay(x.date)} · {x.hz} Hz{x.ressentis.length ? ' · ' + x.ressentis.join(', ').toLowerCase() : ''}{x.note ? ' · « ' + x.note + ' »' : ''}</p>)}</div>}
  </div>;
}

function Listening({ f, minutes, breathe, intention, onClose, onSave }: { f: Frequence; minutes: number; breathe: boolean; intention: string; onClose: () => void; onSave: (d: Record<string, unknown>) => Promise<void> }) {
  const total = minutes * 60, warm = breathe ? 120 : 0;
  const [t, setT] = useState(0), [vol, setVol] = useState(0.25), [done, setDone] = useState(false);
  const [res, setRes] = useState<string[]>([]), [note, setNote] = useState('');
  const handle = useRef<ReturnType<typeof tone>>(null);
  useEffect(() => { const id = window.setInterval(() => setT((x) => x + 1), 1000); return () => { window.clearInterval(id); handle.current?.stop(); }; }, []);
  useEffect(() => {
    if (done) return;
    if (t === warm && !handle.current) handle.current = tone(f.hz, vol);
    if (t >= warm + total) { handle.current?.stop(); handle.current = null; bell(1); setDone(true); }
  }, [t]); // eslint-disable-line react-hooks/exhaustive-deps
  const stop = () => { handle.current?.stop(); handle.current = null; setDone(true); };
  const listened = Math.max(1, Math.round(Math.max(0, Math.min(t, warm + total) - warm) / 60));
  if (done) return <section className="soft-card form-stack">
    <p className="ritual-label">Après la séance · {f.hz} Hz</p><p>Qu’as-tu ressenti ?</p>
    <div className="chip-row">{RESSENTIS.map((r) => <button key={r} className={'chip' + (res.includes(r) ? ' on' : '')} aria-pressed={res.includes(r)} onClick={() => setRes(res.includes(r) ? res.filter((x) => x !== r) : [...res, r])}>{r}</button>)}</div>
    <label>Ce que la fréquence a fait dans mon corps<textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></label>
    <div className="button-group"><button className="button primary" onClick={() => void onSave({ minutes: listened, ressentis: res, note: note.trim(), intention }).then(onClose)}>Noter dans mon journal</button>
      <button className="button ghost" onClick={onClose}>Passer</button></div>
  </section>;
  const breathing = t < warm, left = breathing ? warm - t : warm + total - t;
  return <div className="calm-screen">
    <div className="calm-top"><button className="quit-btn" onClick={stop}><Square size={14} /> Terminer</button></div>
    <p className="calm-title">{f.hz} Hz · {f.titre}</p>
    <div className={'freq-orb' + (breathing ? ' breathing' : ' playing')}><Headphones size={28} /></div>
    <p className="calm-phase">{breathing ? (t % 10 < 4 ? 'Inspire…' : 'Expire lentement…') : 'Laisse-toi traverser par la vibration'}</p>
    <p className="muted">{breathing ? 'Respiration · ' : ''}{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</p>
    {!breathing && <label className="freq-vol">Volume<input type="range" min={0.05} max={0.6} step={0.05} value={vol} onChange={(e) => { const v = Number(e.target.value); setVol(v); handle.current?.volume(v); }} /></label>}
  </div>;
}
