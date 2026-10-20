import { useEffect, useMemo, useState } from 'react';
import type { Entry } from '../lib/cloud';

const key = 'my-thirties-reminder-settings-v1';
type Prefs = { enabled: boolean; minutes: number; };
const readPrefs = (): Prefs => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    return { enabled: value.enabled === true, minutes: [0, 5, 15, 30, 60].includes(value.minutes) ? value.minutes : 15 };
  } catch { return { enabled: false, minutes: 15 }; }
};
const today = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};
const validTime = (value: unknown): value is string => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export function BrowserReminders({ entries }: { entries: Entry[] }) {
  const [prefs, setPrefs] = useState<Prefs>(readPrefs);
  const [message, setMessage] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [seen] = useState(() => new Set<string>());
  const supported = typeof Notification !== 'undefined' && window.isSecureContext;
  useEffect(() => { localStorage.setItem(key, JSON.stringify(prefs)); }, [prefs]);
  useEffect(() => {
    if (!prefs.enabled || !supported || Notification.permission !== 'granted') return;
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, [prefs.enabled, supported]);
  const reminders = useMemo(() => {
    const day = today();
    return entries.filter((e) => (e.module === 'quotidien' || (e.module === 'sante' && e.kind === 'appointment')) &&
      e.entry_date === day && validTime(e.data.time))
      .map((e) => {
        const target = new Date(day + 'T' + e.data.time + ':00').getTime() - prefs.minutes * 60000;
        return { id: e.id, title: e.title, target };
      });
  }, [entries, prefs.minutes]);
  useEffect(() => {
    if (!prefs.enabled || !supported || Notification.permission !== 'granted') return;
    for (const item of reminders) {
      if (item.target > now || item.target < now - 60000) continue;
      const k = today() + ':' + item.id + ':' + prefs.minutes;
      if (seen.has(k)) continue;
      seen.add(k);
      try { new Notification('My Thirties · Rappel', { body: item.title, tag: k }); } catch { setMessage('Ce navigateur ne permet pas l’affichage de cette notification.'); }
    }
  }, [now, reminders, prefs, supported, seen]);
  const activate = async () => {
    if (!supported) { setMessage('Les notifications ne sont pas prises en charge dans ce navigateur ou sans HTTPS.'); return; }
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') { setPrefs((p) => ({ ...p, enabled: true })); setMessage('Rappels activés pendant que cette page reste ouverte.'); }
      else setMessage('Permission non accordée. Aucun rappel activé.');
    } catch { setMessage('Impossible de demander la permission.'); }
  };
  return <section className="panel form-stack"><h2>Notifications de l'agenda</h2>
    <p className="muted">Rappels locaux facultatifs pour les tâches, événements et rendez-vous avec une heure. Aucune information n'est transmise à un service de notifications.</p>
    <label>Délai avant l'événement<select value={prefs.minutes} onChange={(e) => setPrefs((p) => ({ ...p, minutes: Number(e.target.value) }))}>
      {[0, 5, 15, 30, 60].map((n) => <option key={n} value={n}>{n === 0 ? 'À l’heure prévue' : n + ' minutes avant'}</option>)}</select></label>
    {prefs.enabled ? <button className="button secondary" onClick={() => { setPrefs((p) => ({ ...p, enabled: false })); setMessage('Rappels désactivés.'); }}>Désactiver les rappels</button>
      : <button className="button secondary" onClick={() => void activate()}>Autoriser les rappels</button>}
    {message && <p role="status">{message}</p>}
    <p className="fineprint">Limitation : cette version fonctionne uniquement tant que l'application est ouverte au premier plan. Les rappels iPhone en arrière-plan nécessitent un service push ou des notifications natives, non activés ici.</p>
  </section>;
}
