import { useEffect, useState } from 'react';
import { Moon } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { DAILY_KIND, isoOf } from '../lib/rituals';

const KEY = 'my-thirties-evening-reminder-v1';
type Prefs = { on: boolean; time: string; last: string };
const read = (): Prefs => { try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return { on: v.on === true, time: /^\d{2}:\d{2}$/.test(v.time) ? v.time : '21:00', last: String(v.last ?? '') }; } catch { return { on: false, time: '21:00', last: '' }; } };
const write = (p: Prefs) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* stockage indisponible */ } };
const supported = () => typeof Notification !== 'undefined' && window.isSecureContext;

/** Réglage du rappel « débriefing du soir » (notification du navigateur, quand l'app est ouverte). */
export function EveningReminderSettings() {
  const [p, setP] = useState(read);
  const [msg, setMsg] = useState('');
  const save = (next: Prefs) => { setP(next); write(next); };
  const toggle = async () => {
    if (!p.on && supported() && Notification.permission !== 'granted') {
      const r = await Notification.requestPermission();
      if (r !== 'granted') { setMsg('Notifications refusées par le navigateur.'); return; }
    }
    save({ ...p, on: !p.on }); setMsg('');
  };
  return <section className="panel form-stack">
    <div className="toggle-row"><span><strong><Moon size={16} /> Rappel du débriefing du soir</strong><small>Un rappel pour faire le point sur ta journée et préparer demain.</small></span>
      <button className={'switch' + (p.on ? ' on' : '')} role="switch" aria-checked={p.on} aria-label="Rappel du débriefing du soir" disabled={!supported()} onClick={() => void toggle()}><span /></button></div>
    {p.on && <label>Heure<input type="time" value={p.time} onChange={(e) => save({ ...p, time: e.target.value })} /></label>}
    <p className="fineprint">{supported() ? 'Le rappel s’affiche quand l’app est ouverte (ou installée sur l’écran d’accueil) à cette heure-là.' : 'Les notifications ne sont pas disponibles dans ce navigateur.'}{msg ? ' ' + msg : ''}</p>
  </section>;
}

/** Vérifie chaque minute s'il est l'heure du rappel et si le débriefing du jour n'est pas encore fait. */
export function EveningReminderRunner({ entries }: { entries: Entry[] }) {
  useEffect(() => {
    const check = () => {
      const p = read(), now = new Date(), day = isoOf(now);
      if (!p.on || !supported() || Notification.permission !== 'granted' || p.last === day) return;
      if (now.toTimeString().slice(0, 5) < p.time) return;
      const done = entries.some((e) => e.kind === DAILY_KIND && e.entry_date === day && (e.data.win || e.data.tomorrow));
      write({ ...p, last: day });
      if (!done) new Notification('Mon débriefing du soir 🌙', { body: 'Ta victoire du jour, ce que tu déposes, ton intention pour demain.' });
    };
    check();
    const t = setInterval(check, 60000);
    return () => clearInterval(t);
  }, [entries]);
  return null;
}
