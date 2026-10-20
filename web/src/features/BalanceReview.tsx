import { useMemo, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';

const iso = (d: Date) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
const weekStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
const date = () => iso(new Date());

export function BalanceReview({ entries, onCreate }: {
  entries: Entry[];
  onCreate: (input: EntryInput) => Promise<void>;
}) {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [reference, setReference] = useState(date);
  const [positive, setPositive] = useState('');
  const [challenge, setChallenge] = useState('');
  const [intention, setIntention] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const periodData = useMemo(() => {
    const d = new Date(reference + 'T12:00:00');
    const from = period === 'week' ? weekStart(d) : new Date(d.getFullYear(), d.getMonth(), 1);
    const to = period === 'week' ? new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6)
      : new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const items = entries.filter((e) => e.entry_date && e.entry_date >= iso(from) && e.entry_date <= iso(to));
    return { from: iso(from), to: iso(to),
      emotions: items.filter((e) => e.kind === 'emotion').length,
      gratitude: items.filter((e) => e.kind === 'gratitude').length,
      reviews: items.filter((e) => e.kind === 'review').length };
  }, [entries, period, reference]);
  const save = async () => {
    if (!positive.trim() && !challenge.trim() && !intention.trim()) { setMessage('Écris au moins une réflexion, si tu en as envie.'); return; }
    setBusy(true); setMessage('');
    try {
      await onCreate({ module: 'equilibre', kind: 'review', title: (period === 'week' ? 'Bilan hebdomadaire' : 'Bilan mensuel') + ' · ' + periodData.from,
        entry_date: periodData.to, data: { date: periodData.to, period, from: periodData.from, positive, challenge, intention } });
      setPositive(''); setChallenge(''); setIntention(''); setMessage('Bilan enregistré dans ton journal.');
    } catch { setMessage('Enregistrement impossible.'); } finally { setBusy(false); }
  };
  return <section className="tool-card">
    <h3>Mon bilan personnel</h3>
    <p className="muted">Un rendez-vous facultatif avec toi-même, sans score ni jugement.</p>
    <div className="planner-form"><label>Période<select value={period} onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}>
      <option value="week">Semaine</option><option value="month">Mois</option></select></label>
      <label>Choisir une date<input type="date" value={reference} onChange={(e) => setReference(e.target.value)} /></label></div>
    <p className="fineprint">Du {periodData.from} au {periodData.to} · {periodData.emotions} note(s) émotionnelles · {periodData.gratitude} gratitude(s) · {periodData.reviews} bilan(s)</p>
    <div className="form-stack">
      <label>Ce qui m'a fait du bien<textarea value={positive} onChange={(e) => setPositive(e.target.value)} rows={2} /></label>
      <label>Ce qui a été difficile<textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={2} /></label>
      <label>Ce que j'aimerais essayer ensuite<textarea value={intention} onChange={(e) => setIntention(e.target.value)} rows={2} /></label>
      <button className="button secondary" disabled={busy} onClick={() => void save()}>Enregistrer mon bilan</button>
    </div>
    {message && <p role="status">{message}</p>}
  </section>;
}
