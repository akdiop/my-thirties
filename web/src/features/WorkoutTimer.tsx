import { useEffect, useRef, useState } from 'react';
import { Check, Pause, Play, SkipForward, Square, Timer } from 'lucide-react';
import { fmtSec, human, planFromText, summary, type Segment } from '../lib/workoutTimer';

/** Bip court (Web Audio) et vibration si le téléphone le permet. */
let audio: AudioContext | null = null;
function beep(freq = 880, ms = 160) {
  try {
    audio ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = freq; g.gain.value = 0.15; o.connect(g); g.connect(audio.destination);
    o.start(); o.stop(audio.currentTime + ms / 1000);
  } catch { /* son indisponible */ }
  try { navigator.vibrate?.(ms); } catch { /* vibration indisponible */ }
}

type WakeLock = { release: () => Promise<void> };
const PRESETS = [20, 30, 45, 60, 90, 120];

/** Minuteur des défis : enchaîne la séance du jour (séries, efforts, repos) ou un minuteur libre, sans quitter l'app. */
export function WorkoutTimer({ text, onFinish }: { text: string | null; onFinish?: () => void }) {
  const auto = planFromText(text);
  const [seg, setSeg] = useState<Segment[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [work, setWork] = useState(40), [rest, setRest] = useState(20), [rounds, setRounds] = useState(5);
  const end = useRef(0);
  const lock = useRef<WakeLock | null>(null);
  const cur = seg?.[idx];

  const go = (list: Segment[], i: number) => {
    const s = list[i];
    if (!s) { setRunning(false); setDone(true); beep(660, 500); return; }
    setIdx(i); setLeft(s.sec);
    end.current = Date.now() + s.sec * 1000;
    setRunning(s.kind !== 'manual');
    beep(s.kind === 'rest' ? 520 : 880, 220);
  };
  const start = (list: Segment[]) => { setSeg(list); setDone(false); go(list, 0); };
  const stop = () => { setSeg(null); setRunning(false); setDone(false); };
  const next = () => seg && go(seg, idx + 1);

  useEffect(() => {
    if (!running || !seg) return;
    const id = window.setInterval(() => {
      const ms = end.current - Date.now();
      const s = Math.max(0, Math.ceil(ms / 1000));
      setLeft((prev) => { if (s !== prev && s > 0 && s <= 3) beep(660, 90); return s; });
      if (ms <= 0) { window.clearInterval(id); go(seg, idx + 1); }
    }, 200);
    return () => window.clearInterval(id);
  }, [running, seg, idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Garde l'écran allumé pendant la séance (iPhone récent).
  useEffect(() => {
    if (!seg || done) { void lock.current?.release().catch(() => undefined); lock.current = null; return; }
    const wl = (navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<WakeLock> } }).wakeLock;
    void wl?.request('screen').then((l) => { lock.current = l; }).catch(() => undefined);
  }, [seg, done]);

  const pause = () => { if (running) { setRunning(false); } else if (cur && cur.kind !== 'manual') { end.current = Date.now() + left * 1000; setRunning(true); } };
  const pct = cur && cur.sec ? 1 - left / cur.sec : 0;

  if (seg && done) return <section className="timer-card">
    <p className="ritual-label"><Timer size={16} /> Minuteur</p>
    <strong className="timer-done">Séance terminée, bravo !</strong>
    <div className="button-group">{onFinish && <button className="button primary" onClick={() => { onFinish(); stop(); }}><Check size={16} /> Marquer le jour réalisé</button>}
      <button className="button ghost" onClick={stop}>Fermer</button></div>
  </section>;

  if (seg && cur) return <section className={'timer-card running ' + cur.kind}>
    <p className="ritual-label"><Timer size={16} /> Étape {seg.slice(0, idx + 1).filter((s) => s.kind !== 'rest').length} sur {seg.filter((s) => s.kind !== 'rest').length}</p>
    <div className="timer-ring" style={{ background: cur.kind === 'manual' ? undefined : `conic-gradient(var(--ring) ${pct * 360}deg, #efe3de 0)` }}>
      <div><strong>{cur.kind === 'manual' ? '' : fmtSec(left)}</strong><span>{cur.kind === 'rest' ? cur.label : cur.kind === 'manual' ? 'À ton rythme' : 'Effort'}</span></div>
    </div>
    <p className="timer-label">{cur.label}</p>
    {seg[idx + 1] && <p className="muted small center">Ensuite : {seg[idx + 1]!.label}{seg[idx + 1]!.sec ? ' · ' + human(seg[idx + 1]!.sec) : ''}</p>}
    <div className="timer-actions">
      {cur.kind === 'manual'
        ? <button className="button primary" onClick={next}><Check size={16} /> Série faite</button>
        : <button className="button primary" onClick={pause}>{running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Reprendre</>}</button>}
      <button className="icon-btn" aria-label="Passer cette étape" onClick={next}><SkipForward size={18} /></button>
      <button className="icon-btn" aria-label="Arrêter le minuteur" onClick={stop}><Square size={18} /></button>
    </div>
  </section>;

  const interval = (): Segment[] => Array.from({ length: rounds }, (_, i) => [{ label: `Effort ${i + 1}/${rounds}`, sec: work, kind: 'work' as const },
    ...(i < rounds - 1 ? [{ label: 'Repos', sec: rest, kind: 'rest' as const }] : [])]).flat();
  return <section className="timer-card">
    <p className="ritual-label"><Timer size={16} /> Minuteur</p>
    {auto.length > 0 && <>
      <p className="muted small">Séance du jour prête : {summary(auto)}.</p>
      <button className="button primary" onClick={() => start(auto)}><Play size={16} /> Lancer la séance</button>
    </>}
    <details className="timer-free" open={!auto.length}><summary>Minuteur libre</summary>
      <div className="chip-row">{PRESETS.map((s) => <button key={s} className="chip" onClick={() => start([{ label: human(s), sec: s, kind: 'work' }])}>{human(s)}</button>)}</div>
      <div className="timer-interval">
        <label>Effort (s)<input type="number" inputMode="numeric" min={5} max={600} value={work} onChange={(e) => setWork(Math.max(5, Number(e.target.value) || 5))} /></label>
        <label>Repos (s)<input type="number" inputMode="numeric" min={0} max={600} value={rest} onChange={(e) => setRest(Math.max(0, Number(e.target.value) || 0))} /></label>
        <label>Tours<input type="number" inputMode="numeric" min={1} max={30} value={rounds} onChange={(e) => setRounds(Math.min(30, Math.max(1, Number(e.target.value) || 1)))} /></label>
      </div>
      <button className="button soft" onClick={() => start(interval())}>Lancer les intervalles</button>
    </details>
  </section>;
}
