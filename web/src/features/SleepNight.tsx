import { useEffect, useRef, useState } from 'react';
import { AlarmClock, Moon, Sun } from 'lucide-react';
import { analyseNight, fmtMin, minuteStats, nextAt, PHASE_LABEL, phasesOf, shouldWake, type NightAnalysis, type Phase } from '../lib/sleepAnalysis';
import { bell, unlockSound } from '../lib/sound';

const KEY = 'mt-sleep-night';
type Saved = { start: number; wake: string; window: number; act: number[]; loud: number };
type WakeLock = { release: () => Promise<void> };

const load = (): Saved | null => { try { const v = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Saved | null; return v && Date.now() - v.start < 16 * 3600000 ? v : null; } catch { return null; } };
const store = (v: Saved | null) => { try { if (v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY); } catch { /* stockage indisponible */ } };
export const pendingNight = () => load() !== null;

const session = (type: string) => { try { const s = (navigator as unknown as { audioSession?: { type: string } }).audioSession; if (s) s.type = type; } catch { /* iOS < 17 */ } };
const hhmm = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

/** Mode nuit : écoute les mouvements toute la nuit (l'app reste ouverte, écran allumé) et réveille en sommeil léger. */
export function SleepNight({ wake, window: win, onDone, onCancel }: { wake: string; window: number; onDone: (a: NightAnalysis) => Promise<void>; onCancel: () => void }) {
  const [night] = useState<Saved>(() => load() ?? { start: Date.now(), wake, window: win, act: [], loud: 0 });
  const [now, setNow] = useState(new Date());
  const [ringing, setRinging] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const stream = useRef<MediaStream | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const lock = useRef<WakeLock | null>(null);
  const snoozeUntil = useRef(0);
  const wakeAt = nextAt(night.wake, new Date(night.start));

  const stopMic = () => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; void ctx.current?.close().catch(() => undefined); ctx.current = null; };

  useEffect(() => {
    let alive = true, buf: number[] = [], minute = Math.floor((Date.now() - night.start) / 60000);
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    session('play-and-record');
    void navigator.mediaDevices?.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then((s) => {
      if (!alive) { s.getTracks().forEach((t) => t.stop()); return; }
      stream.current = s;
      const c = new AC(); ctx.current = c;
      const an = c.createAnalyser(); an.fftSize = 2048;
      c.createMediaStreamSource(s).connect(an);
      const data = new Float32Array(an.fftSize);
      const id = window.setInterval(() => {
        if (!alive) return;
        an.getFloatTimeDomainData(data);
        buf.push(Math.sqrt(data.reduce((a, x) => a + x * x, 0) / data.length));
        const m = Math.floor((Date.now() - night.start) / 60000);
        if (m > minute) {
          const st = minuteStats(buf); buf = [];
          while (night.act.length < minute) night.act.push(-1);
          night.act[minute] = st.events; if (st.loud) night.loud++;
          minute = m; store(night);
        }
      }, 500);
      c.addEventListener('statechange', () => { if (c.state === 'closed') window.clearInterval(id); });
    }).catch(() => setError('Autorise le micro pour analyser ta nuit (Réglages › Safari › Micro).'));
    return () => { alive = false; stopMic(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Écran allumé toute la nuit, repris si l'app revient au premier plan.
  useEffect(() => {
    const get = () => { const wl = (navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<WakeLock> } }).wakeLock; void wl?.request('screen').then((l) => { lock.current = l; }).catch(() => undefined); };
    const vis = () => { if (document.visibilityState === 'visible') get(); };
    get(); document.addEventListener('visibilitychange', vis);
    return () => { document.removeEventListener('visibilitychange', vis); void lock.current?.release().catch(() => undefined); };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const t = new Date(); setNow(t);
      if (!ringing && t.getTime() >= snoozeUntil.current && shouldWake(t, wakeAt, night.window, night.act)) { stopMic(); session('playback'); setRinging(true); }
    }, 15000);
    return () => window.clearInterval(id);
  }, [ringing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ringing) return;
    bell(1);
    const id = window.setInterval(() => bell(1), 4000);
    return () => window.clearInterval(id);
  }, [ringing]);

  const finish = async () => {
    setRinging(false); stopMic(); setSaving(true);
    const end = new Date();
    const act = [...night.act];
    while (act.length < Math.floor((end.getTime() - night.start) / 60000)) act.push(-1);
    try { if (act.length >= 30) await onDone(analyseNight(new Date(night.start), end, act, night.loud)); store(null); onCancel(); }
    catch { setError('Analyse non enregistrée, réessaie.'); setSaving(false); }
  };
  const snooze = () => { setRinging(false); snoozeUntil.current = Date.now() + 9 * 60000; unlockSound(); };

  return <div className="night-screen keep-colors">
    {ringing ? <>
      <Sun size={40} />
      <p className="night-clock">{hhmm(now)}</p>
      <p className="night-sub">Bonjour, c’est l’heure de te lever en douceur.</p>
      <button className="button primary night-main" onClick={() => void finish()}>Je suis réveillée</button>
      <button className="link-btn" onClick={snooze}>Encore 9 minutes</button>
    </> : <>
      <Moon size={32} />
      <p className="night-clock">{hhmm(now)}</p>
      <p className="night-sub"><AlarmClock size={16} /> {night.window ? `Réveil entre ${hhmm(new Date(wakeAt.getTime() - night.window * 60000))} et ${hhmm(wakeAt)}` : `Réveil à ${hhmm(wakeAt)}`}</p>
      <p className="night-hint">Laisse l’app ouverte, iPhone branché, posé sur le matelas près de ton oreiller.</p>
      {error && <p className="night-hint" role="alert">{error}</p>}
      <button className="button night-main" disabled={saving} onClick={() => void finish()}>{saving ? 'Analyse…' : 'Terminer ma nuit'}</button>
      <button className="link-btn" disabled={saving} onClick={() => { stopMic(); store(null); onCancel(); }}>Annuler sans enregistrer</button>
    </>}
  </div>;
}

const Y: Record<Phase, number> = { eveil: 8, leger: 34, profond: 60 };
const COLOR: Record<Phase, string> = { eveil: '#D9B48F', leger: '#9FB5AA', profond: '#6F8A80' };

/** Rapport du matin : courbe des phases, qualité, durées et réveils. */
export function SleepReport({ a }: { a: NightAnalysis }) {
  const ph = phasesOf(a.act), n = ph.length, start = new Date(a.start), end = new Date(a.end);
  const W = 320, x = (i: number) => (i / Math.max(1, n)) * W;
  const path = ph.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${Y[p]} L${x(i + 1).toFixed(1)},${Y[p]}`).join(' ');
  const hours = Array.from({ length: 24 }, (_, h) => h).map((h) => { const d = new Date(start); d.setHours(start.getHours() + h + 1, 0, 0, 0); return d; }).filter((d) => d < end);
  const asleep = a.phases.leger + a.phases.profond;
  return <div className="sleep-report">
    <div className="sleep-quality"><strong>{a.quality} %</strong><span>Qualité de la nuit</span></div>
    <svg className="hypno" viewBox={`0 0 ${W} 80`} role="img" aria-label="Phases de sommeil estimées">
      {ph.map((p, i) => <rect key={i} x={x(i)} y={Y[p]} width={x(i + 1) - x(i) + 0.3} height={72 - Y[p]} fill={COLOR[p]} opacity={0.35} />)}
      <path d={path} fill="none" stroke="#4b342c" strokeWidth={1.2} />
      {hours.map((d) => { const i = (d.getTime() - start.getTime()) / 60000; if (i < 8 || i > n - 8) return null; return <text key={d.getTime()} x={x(i)} y={79} fontSize={7} fill="#8a7268" textAnchor="middle">{d.getHours()}h</text>; })}
    </svg>
    <div className="sleep-legend">{(['eveil', 'leger', 'profond'] as Phase[]).map((p) => <span key={p}><i style={{ background: COLOR[p] }} />{PHASE_LABEL[p]} · {fmtMin(a.phases[p])}</span>)}</div>
    <dl className="sleep-stats">
      <div><dt>Au lit</dt><dd>{start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} – {end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</dd></div>
      <div><dt>Endormie en</dt><dd>{a.onset} min</dd></div>
      <div><dt>Endormie</dt><dd>{fmtMin(asleep)}</dd></div>
      <div><dt>Réveils</dt><dd>{a.awakenings}</dd></div>
      <div><dt>Moments bruyants</dt><dd>{a.loud}</dd></div>
    </dl>
    {a.gaps > n * 0.1 && <p className="muted small">L’écoute s’est interrompue {fmtMin(a.gaps)} (écran verrouillé ou app fermée) : l’analyse est partielle.</p>}
  </div>;
}
