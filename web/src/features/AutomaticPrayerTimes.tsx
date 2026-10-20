import { useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';
import { useIntegrationPrefs } from '../lib/integrations';

const names = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const methods = [{ id: 3, label: 'Muslim World League' }, { id: 2, label: 'ISNA' },
  { id: 4, label: 'Umm Al-Qura (Makkah)' }, { id: 5, label: 'Egyptian General Authority' },
  { id: 12, label: 'Union des organisations islamiques de France' }] as const;
const today = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};
const timeOnly = (raw: unknown) => {
  if (typeof raw !== 'string') return null;
  const match = raw.match(/^([01]\d|2[0-3]):[0-5]\d/);
  return match ? match[0] : null;
};

export function AutomaticPrayerTimes({ entries, onCreate }: {
  entries: Entry[];
  onCreate: (input: EntryInput) => Promise<void>;
}) {
  const { prefs } = useIntegrationPrefs();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(today);
  const [method, setMethod] = useState(3);
  const [preview, setPreview] = useState<Record<string, string> | null>(null);
  const [hijri, setHijri] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [timezone, setTimezone] = useState('');
  const [controller] = useState(() => ({ current: null as AbortController | null }));
  const lookup = async () => {
    if (!prefs.prayer || !city.trim() || !country.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    controller.current?.abort();
    const abort = new AbortController(); controller.current = abort;
    setBusy(true); setPreview(null); setMessage('');
    try {
      const [year, month, day] = date.split('-');
      const params = new URLSearchParams({ city: city.trim(), country: country.trim(), method: String(method) });
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity/' + day + '-' + month + '-' + year + '?' + params,
        { signal: abort.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Service temporairement indisponible.');
      const json: unknown = await response.json();
      if (!json || typeof json !== 'object' || !('data' in json)) throw new Error('Réponse invalide.');
      const data = (json as { data?: { timings?: Record<string, unknown>; meta?: { timezone?: string }; date?: { hijri?: { date?: string } } } }).data;
      const times = Object.fromEntries(names.map((name) => [name, timeOnly(data?.timings?.[name])]));
      if (Object.values(times).some((value) => !value)) throw new Error('Horaires incomplets.');
      setPreview(times as Record<string, string>);
      setTimezone(data?.meta?.timezone ?? '');
      setHijri(data?.date?.hijri?.date ?? '');
    } catch (error) {
      if (!abort.signal.aborted) setMessage(error instanceof Error ? error.message : 'Impossible de récupérer les horaires.');
    } finally { if (!abort.signal.aborted) setBusy(false); }
  };
  const save = async () => {
    if (!preview) return;
    if (entries.some((e) => e.kind === 'prayer_schedule' && e.entry_date === date && e.data.source === 'AlAdhan API' && e.data.city === city.trim())) {
      setMessage('Un horaire automatique pour cette ville et cette date est déjà enregistré.'); return;
    }
    setBusy(true); setMessage('');
    try {
      await onCreate({ module: 'spiritualite', kind: 'prayer_schedule',
        title: 'Horaires calculés · ' + city.trim(), entry_date: date,
        data: { date, city: city.trim(), country: country.trim(), source: 'AlAdhan API',
          method: String(method), timezone, hijri, ...preview } });
      setMessage('Horaires enregistrés.'); setPreview(null);
    } catch { setMessage('Impossible d’enregistrer les horaires.'); } finally { setBusy(false); }
  };
  return <section className="tool-card">
    <h3>Horaires de prière automatiques</h3>
    {!prefs.prayer && <p className="privacy-hint">Service désactivé. Active-le dans Profil → Centre de confidentialité.</p>}
    <p className="muted">Calculs fournis par AlAdhan. La ville et le pays sont envoyés à ce service uniquement lorsque tu demandes les horaires. Aucune géolocalisation précise n'est demandée.</p>
    <div className="planner-form"><label>Ville<input value={city} onChange={(e) => { setCity(e.target.value); setPreview(null); }} maxLength={80} placeholder="Dakar" /></label>
      <label>Pays<input value={country} onChange={(e) => { setCountry(e.target.value); setPreview(null); }} maxLength={80} placeholder="Sénégal" /></label>
      <label>Date<input type="date" value={date} onChange={(e) => { setDate(e.target.value); setPreview(null); }} /></label>
      <label>Méthode de calcul<select value={method} onChange={(e) => { setMethod(Number(e.target.value)); setPreview(null); }}>
        {methods.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select></label></div>
    <button className="button secondary" disabled={!prefs.prayer || busy || !city.trim() || !country.trim() || !date} onClick={() => void lookup()}>
      {busy ? 'Recherche…' : 'Calculer les horaires'}</button>
    {preview && <div className="prayer-form">
      <div className="prayer-times">{names.map((name) => <div className="prayer-item" key={name}><strong>{name}</strong><span>{preview[name]}</span></div>)}</div>
      <p className="fineprint">Fuseau indiqué par le fournisseur : {timezone || 'non fourni'} · Date hégirienne : {hijri || 'non fournie'}. Vérifie auprès de ta mosquée locale, notamment pendant le Ramadan.</p>
      <button className="button primary" disabled={busy} onClick={() => void save()}>Enregistrer ces horaires</button>
    </div>}
    {message && <p role="status">{message}</p>}
    <p className="fineprint">Les horaires peuvent varier selon la méthode, l'école juridique et la pratique locale. Ce service ne déclenche pas de rappel en arrière-plan.</p>
  </section>;
}
