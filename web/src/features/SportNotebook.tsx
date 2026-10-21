import { useMemo, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';

export function SportNotebook({ entries, onCreate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const [sport, setSport] = useState('Tennis');
  const [date, setDate] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [focus, setFocus] = useState('Coordination');
  const [observation, setObservation] = useState('');
  const [next, setNext] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const notes = useMemo(() => entries.filter((e) => e.kind === 'technique_note')
    .sort((x, y) => (y.entry_date ?? '').localeCompare(x.entry_date ?? '')), [entries]);
  const save = async () => {
    if (!observation.trim()) return setStatus('Ajoute une observation.');
    setBusy(true); setStatus('');
    try {
      await onCreate({ module: 'sport', kind: 'technique_note', title: sport + ' · ' + focus, entry_date: date,
        data: { date, discipline: sport, focus, observation: observation.trim(), next: next.trim() } });
      setObservation(''); setNext(''); setStatus('Observation enregistrée.');
    } catch { setStatus('Enregistrement impossible.'); }
    finally { setBusy(false); }
  };
  return <section className="tool-card">
    <h3>Mon carnet technique</h3>
    <p className="muted">Note tes observations sans score imposé et compare deux séances.</p>
    <div className="planner-form">
      <label>Discipline<select value={sport} onChange={(e) => setSport(e.target.value)}>
        {['Tennis','Pilates','Yoga','Autre'].map((s) => <option key={s}>{s}</option>)}</select></label>
      <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label>Point observé<select value={focus} onChange={(e) => setFocus(e.target.value)}>
        {['Coordination','Appuis','Mobilité','Respiration','Autre'].map((s) => <option key={s}>{s}</option>)}</select></label>
    </div>
    <label>Mon observation<textarea rows={3} maxLength={1500} value={observation} onChange={(e) => setObservation(e.target.value)} /></label>
    <label>Pour la prochaine séance<textarea rows={2} maxLength={1000} value={next} onChange={(e) => setNext(e.target.value)} /></label>
    <button className="button secondary" disabled={busy} onClick={() => void save()}>Enregistrer</button>
    {status && <p role="status">{status}</p>}
    {notes.length >= 2 && <div className="sport-compare">
      <h4>Comparer deux séances</h4>
      <div className="planner-form">
        {([a,b] as const).map((v, index) => <label key={index}>{index ? 'Seconde séance' : 'Première séance'}
          <select value={v} onChange={(e) => index ? setB(e.target.value) : setA(e.target.value)}>
            <option value="">Choisir</option>
            {notes.map((n) => <option key={n.id} value={n.id}>{n.entry_date} · {n.title}</option>)}
          </select></label>)}
      </div>
      {a && b && a !== b && <div className="sport-comparison">{[a,b].map((id) => {
        const n = notes.find((x) => x.id === id);
        return n && <article className="stat-card" key={id}><strong>{n.entry_date} · {n.title}</strong>
          <p>{String(n.data.observation ?? '')}</p><p className="muted">{String(n.data.next ?? '')}</p></article>;
      })}</div>}
    </div>}
  </section>;
}
