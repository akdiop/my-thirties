import { useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';

const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const today = () => new Date().toLocaleDateString('en-CA');
const read = (e: Entry, key: string) => typeof e.data[key] === 'string' ? e.data[key] as string : '';

export function PrayerPlanner({ entries, onCreate }: {
  entries: Entry[];
  onCreate: (input: EntryInput) => Promise<void>;
}) {
  const [date, setDate] = useState(today);
  const [prayer, setPrayer] = useState<string>('Fajr');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [schedule, setSchedule] = useState<Record<string, string>>({});
  const [source, setSource] = useState('');
  const [city, setCity] = useState('');
  const [scheduleDate, setScheduleDate] = useState(today);
  const [expanded, setExpanded] = useState(false);
  const records = entries.filter((e) => e.kind === 'prayer' && e.entry_date === date);
  const schedules = entries.filter((e) => e.kind === 'prayer_schedule' && e.entry_date === date);
  const latest = schedules[0];
  const save = async (input: EntryInput, success: string) => {
    setBusy(true); setMessage('');
    try { await onCreate(input); setMessage(success); } catch { setMessage('Enregistrement impossible.'); }
    finally { setBusy(false); }
  };
  return <section className="tool-card">
    <h3>Mes prières et mes repères</h3>
    <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
    <div className="prayer-grid">{prayers.map((name) => {
      const done = records.some((e) => read(e, 'prayer') === name);
      const time = latest ? read(latest, name) : '';
      return <div key={name} className="prayer-item"><strong>{name}</strong><span>{time || '—'}</span><small>{done ? 'Notée' : 'Non notée'}</small></div>;
    })}</div>
    <div className="planner-form"><label>Noter une prière<select value={prayer} onChange={(e) => setPrayer(e.target.value)}>
      {prayers.map((name) => <option key={name}>{name}</option>)}</select></label>
      <button className="button secondary" disabled={busy || !date || records.some((e) => read(e, 'prayer') === prayer)}
        onClick={() => void save({ module: 'spiritualite', kind: 'prayer', title: prayer + ' · ' + date,
          entry_date: date, data: { date, prayer } }, 'Prière notée.')}>Noter</button></div>
    <button className="text-button" onClick={() => setExpanded((v) => !v)}>{expanded ? 'Masquer les horaires' : 'Renseigner les horaires vérifiés'}</button>
    {expanded && <div className="prayer-form">
      <p className="muted">Saisis les horaires de ta mosquée ou d'une source religieuse locale de confiance. Les méthodes de calcul peuvent différer.</p>
      <div className="planner-form"><label>Jour<input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} /></label>
        <label>Ville (facultatif)<input value={city} maxLength={80} onChange={(e) => setCity(e.target.value)} /></label></div>
      <div className="prayer-times">{prayers.map((name) => <label key={name}>{name}<input type="time" value={schedule[name] || ''}
        onChange={(e) => setSchedule((v) => ({ ...v, [name]: e.target.value }))} /></label>)}</div>
      <label>Source consultée<input value={source} maxLength={180} onChange={(e) => setSource(e.target.value)} placeholder="Nom de la mosquée ou du calendrier" /></label>
      <button className="button secondary" disabled={busy || !source.trim() || !scheduleDate || !prayers.every((name) => schedule[name])}
        onClick={() => void save({ module: 'spiritualite', kind: 'prayer_schedule', title: 'Horaires · ' + (city || scheduleDate),
          entry_date: scheduleDate, data: { date: scheduleDate, city, source, ...schedule } }, 'Horaires enregistrés pour ce jour.')}>Enregistrer les horaires</button>
    </div>}
    {latest && <p className="fineprint">Horaires du {date} saisis manuellement · {read(latest, 'source') || 'Source non précisée'}.</p>}
    {message && <p role="status">{message}</p>}
    <p className="fineprint">Ce module ne calcule pas automatiquement les horaires et n'envoie pas encore de rappels. Vérifie les horaires pour chaque jour et chaque lieu.</p>
  </section>;
}
