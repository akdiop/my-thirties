import { useEffect, useState } from 'react';
import { BellRing, Send } from 'lucide-react';
import { cloud } from '../lib/cloud';

/** Réglages des rappels envoyés par le serveur (fonction push-reminders), même app fermée. */
export type NotifPrefs = {
  morning: { on: boolean; time: string }; evening: { on: boolean; time: string }; habits: { on: boolean; time: string };
  agenda: { on: boolean; minutes: number }; weekly: { on: boolean; day: number; time: string }; supplements: { on: boolean };
  plan: { on: boolean; time: string }; birthdays: { on: boolean; time: string };
  prayers: { on: boolean; minutes: number }; fasting: { on: boolean; time: string }; water: { on: boolean; time: string };
};
export const DEFAULT_PREFS: NotifPrefs = {
  morning: { on: true, time: '08:00' }, evening: { on: true, time: '21:00' }, habits: { on: true, time: '19:00' },
  agenda: { on: true, minutes: 15 }, weekly: { on: true, day: 0, time: '18:00' }, supplements: { on: true },
  plan: { on: true, time: '19:30' }, birthdays: { on: true, time: '09:00' },
  prayers: { on: true, minutes: 5 }, fasting: { on: true, time: '20:30' }, water: { on: true, time: '16:00' },
};
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const pushSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && typeof Notification !== 'undefined';
const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent);
const standalone = () => window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
const keyBytes = (b64: string) => { const s = (b64 + '='.repeat((4 - b64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/'); return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); };
const merge = (v: unknown): NotifPrefs => {
  const p = (v && typeof v === 'object' ? v : {}) as Partial<NotifPrefs>;
  return { morning: { ...DEFAULT_PREFS.morning, ...p.morning }, evening: { ...DEFAULT_PREFS.evening, ...p.evening }, habits: { ...DEFAULT_PREFS.habits, ...p.habits },
    agenda: { ...DEFAULT_PREFS.agenda, ...p.agenda }, weekly: { ...DEFAULT_PREFS.weekly, ...p.weekly }, supplements: { ...DEFAULT_PREFS.supplements, ...p.supplements },
    plan: { ...DEFAULT_PREFS.plan, ...p.plan }, birthdays: { ...DEFAULT_PREFS.birthdays, ...p.birthdays },
    prayers: { ...DEFAULT_PREFS.prayers, ...p.prayers }, fasting: { ...DEFAULT_PREFS.fasting, ...p.fasting }, water: { ...DEFAULT_PREFS.water, ...p.water } };
};

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
  const [device, setDevice] = useState<'unknown' | 'on' | 'off' | 'unsupported'>('unknown');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!cloud) return;
    void cloud.from('notification_prefs').select('prefs').maybeSingle().then(({ data }) => { if (data) setPrefs(merge(data.prefs)); });
    if (!pushSupported()) { setDevice('unsupported'); return; }
    void navigator.serviceWorker.ready.then((r) => r.pushManager.getSubscription()).then((s) => setDevice(s && Notification.permission === 'granted' ? 'on' : 'off'));
  }, []);

  const save = async (next: NotifPrefs) => {
    setPrefs(next);
    if (!cloud) return;
    const { data: u } = await cloud.auth.getUser();
    const { error } = await cloud.from('notification_prefs').upsert({ user_id: u.user?.id, prefs: next, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, updated_at: new Date().toISOString() });
    setMsg(error ? 'Réglages non enregistrés.' : '');
  };

  const enable = async () => {
    if (!cloud) return;
    setBusy(true); setMsg('');
    try {
      if (await Notification.requestPermission() !== 'granted') throw new Error('Notifications refusées : autorise-les dans les réglages du téléphone.');
      const reg = await navigator.serviceWorker.ready;
      const { data, error } = await cloud.functions.invoke('push-reminders', { body: { action: 'key' } });
      if (error || typeof data?.publicKey !== 'string') throw new Error('Service de notifications indisponible pour l’instant.');
      const sub = await reg.pushManager.getSubscription() ?? await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(data.publicKey) });
      const json = sub.toJSON();
      const { data: u } = await cloud.auth.getUser();
      const { error: e2 } = await cloud.from('push_subscriptions').upsert({ endpoint: json.endpoint, user_id: u.user?.id, subscription: json, device: navigator.userAgent.slice(0, 160) });
      if (e2) throw new Error('Appareil non enregistré.');
      await save(prefs);
      setDevice('on'); setMsg('Notifications activées sur cet appareil.');
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Activation impossible.'); }
    finally { setBusy(false); }
  };
  const disable = async () => {
    if (!cloud) return;
    setBusy(true);
    try {
      const sub = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
      if (sub) { await cloud.from('push_subscriptions').delete().eq('endpoint', sub.endpoint); await sub.unsubscribe(); }
      setDevice('off'); setMsg('Notifications désactivées sur cet appareil.');
    } finally { setBusy(false); }
  };
  const test = async () => {
    if (!cloud) return;
    const { data, error } = await cloud.functions.invoke('push-reminders', { body: { action: 'test' } });
    setMsg(error || !data?.sent ? 'Test non envoyé : vérifie que les notifications sont activées.' : 'Notification de test envoyée.');
  };

  const row = (label: string, hint: string, on: boolean, set: (on: boolean) => void, extra?: React.ReactNode) => <div className="notif-row">
    <div className="toggle-row"><span><strong>{label}</strong><small>{hint}</small></span>
      <button className={'switch' + (on ? ' on' : '')} role="switch" aria-checked={on} aria-label={label} onClick={() => set(!on)}><span /></button></div>
    {on && extra}</div>;
  const time = (value: string, set: (v: string) => void) => <input type="time" className="time-input" value={value} onChange={(e) => set(e.target.value)} />;

  return <section className="panel form-stack notif-settings">
    <h2><BellRing size={18} /> Notifications</h2>
    {device === 'unsupported' ? <p className="muted">{isIos() && !standalone()
      ? 'Sur iPhone, ajoute d’abord l’app à l’écran d’accueil (Partager › Sur l’écran d’accueil), puis ouvre-la depuis l’icône pour activer les notifications.'
      : 'Ce navigateur ne prend pas en charge les notifications.'}</p>
      : device === 'on' ? <div className="button-group"><span className="pill-ok">Activées sur cet appareil</span>
        <button className="button ghost small" onClick={() => void test()}><Send size={14} /> Tester</button>
        <button className="button ghost small" disabled={busy} onClick={() => void disable()}>Désactiver ici</button></div>
      : <button className="button primary wide" disabled={busy || device === 'unknown'} onClick={() => void enable()}>{busy ? 'Activation…' : 'Activer les notifications sur cet appareil'}</button>}
    {isIos() && !standalone() && device !== 'unsupported' && <p className="fineprint">Sur iPhone, les notifications ne marchent que depuis l’app ajoutée à l’écran d’accueil.</p>}

    {row('Heures de prière', 'Avant chaque prière, selon ta position (Ma spiritualité › Horaires des prières).', prefs.prayers.on, (on) => void save({ ...prefs, prayers: { ...prefs.prayers, on } }),
      <select value={prefs.prayers.minutes} onChange={(e) => void save({ ...prefs, prayers: { ...prefs.prayers, minutes: Number(e.target.value) } })}>
        {[0, 5, 10, 15].map((m) => <option key={m} value={m}>{m ? m + ' min avant' : 'À l’heure'}</option>)}</select>)}
    {row('Jeûnes recommandés', 'La veille au soir : lundi, jeudi, jours blancs, ‘Arafat, Achoura.', prefs.fasting.on, (on) => void save({ ...prefs, fasting: { ...prefs.fasting, on } }),
      time(prefs.fasting.time, (v) => void save({ ...prefs, fasting: { ...prefs.fasting, time: v } })))}
    {row('Mon Daily Reset', 'Le matin, si ton intention n’est pas encore posée.', prefs.morning.on, (on) => void save({ ...prefs, morning: { ...prefs.morning, on } }),
      time(prefs.morning.time, (v) => void save({ ...prefs, morning: { ...prefs.morning, time: v } })))}
    {row('Débriefing du soir', 'Si tu ne l’as pas encore fait.', prefs.evening.on, (on) => void save({ ...prefs, evening: { ...prefs.evening, on } }),
      time(prefs.evening.time, (v) => void save({ ...prefs, evening: { ...prefs.evening, time: v } })))}
    {row('Mes habitudes', 'Rappel des habitudes du jour pas encore cochées.', prefs.habits.on, (on) => void save({ ...prefs, habits: { ...prefs.habits, on } }),
      time(prefs.habits.time, (v) => void save({ ...prefs, habits: { ...prefs.habits, time: v } })))}
    {row('Agenda', 'Avant chaque rendez-vous, événement ou tâche avec une heure.', prefs.agenda.on, (on) => void save({ ...prefs, agenda: { ...prefs.agenda, on } }),
      <select value={prefs.agenda.minutes} onChange={(e) => void save({ ...prefs, agenda: { ...prefs.agenda, minutes: Number(e.target.value) } })}>
        {[0, 5, 15, 30, 60].map((m) => <option key={m} value={m}>{m ? m + ' min avant' : 'À l’heure'}</option>)}</select>)}
    {row('Mes compléments', 'À l’heure de chaque complément, tant que la prise n’est pas cochée.', prefs.supplements.on, (on) => void save({ ...prefs, supplements: { on } }))}
    {row('Bilan de la semaine', 'Ton résumé de la semaine est prêt.', prefs.weekly.on, (on) => void save({ ...prefs, weekly: { ...prefs.weekly, on } }),
      <div className="inline-pick"><select value={prefs.weekly.day} onChange={(e) => void save({ ...prefs, weekly: { ...prefs.weekly, day: Number(e.target.value) } })}>
        {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}</select>{time(prefs.weekly.time, (v) => void save({ ...prefs, weekly: { ...prefs.weekly, time: v } }))}</div>)}
    {row('Préparer ma semaine', 'Le dimanche soir, l’assistant t’aide à planifier la semaine (ajouts à valider).', prefs.plan.on, (on) => void save({ ...prefs, plan: { ...prefs.plan, on } }),
      time(prefs.plan.time, (v) => void save({ ...prefs, plan: { ...prefs.plan, time: v } })))}
    {row('Anniversaires de mes proches', 'Une semaine avant, 3 jours avant et le jour J.', prefs.birthdays.on, (on) => void save({ ...prefs, birthdays: { ...prefs.birthdays, on } }),
      time(prefs.birthdays.time, (v) => void save({ ...prefs, birthdays: { ...prefs.birthdays, time: v } })))}
    {row('Boire de l’eau', 'L’après-midi, si tu n’as pas encore noté tes 8 verres.', prefs.water.on, (on) => void save({ ...prefs, water: { ...prefs.water, on } }),
      time(prefs.water.time, (v) => void save({ ...prefs, water: { ...prefs.water, time: v } })))}
    {msg && <p role="status" className="fineprint">{msg}</p>}
  </section>;
}
