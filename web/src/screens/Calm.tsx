import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const MODES = ['Respiration', 'Ancrage 5-4-3-2-1', 'Écrire', 'Détente du corps'] as const;
type Mode = typeof MODES[number];
const GROUNDING = ['5 choses que tu vois', '4 choses que tu peux toucher', '3 sons que tu entends', '2 odeurs autour de toi', '1 chose que tu peux goûter ou une respiration lente'];
const BODY = ['Relâche le front et la mâchoire', 'Laisse tomber les épaules', 'Desserre les mains', 'Sens le poids de ton corps sur la chaise ou le sol', 'Détends le ventre à l’expiration', 'Pose les pieds bien à plat'];

export function Calm({ onQuit, onWrite }: { onQuit: () => void; onWrite: () => void }) {
  const [mode, setMode] = useState<Mode>('Respiration');
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 1000); return () => clearInterval(t); }, []);
  const pos = tick % 10;
  const inhale = pos < 4;
  const cycle = Math.min(6, Math.floor(tick / 10) + 1);
  const step = Math.floor(tick / 8);
  return <div className="calm-screen">
    <div className="calm-top"><button className="quit-btn" onClick={onQuit}><X size={18} /> Quitter</button></div>
    <p className="calm-title">Vous êtes en sécurité.<br />Respirons ensemble.</p>
    {mode === 'Respiration' && <>
      <div className={'breath ' + (inhale ? 'in' : 'out')} aria-live="polite">
        <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
        <span className="breath-text"><strong>{inhale ? 'Inspirez' : 'Expirez'}</strong><small>{inhale ? `${4 - pos} s` : `${10 - pos} s`}</small></span>
      </div>
      <p className="calm-sub">Cycle {cycle} sur 6 · inspirez 4 s, expirez 6 s</p>
    </>}
    {mode === 'Ancrage 5-4-3-2-1' && <ol className="calm-list">{GROUNDING.map((g, i) => <li key={g} className={i === step % 5 ? 'on' : ''}>{g}</li>)}</ol>}
    {mode === 'Détente du corps' && <ol className="calm-list">{BODY.map((g, i) => <li key={g} className={i === step % BODY.length ? 'on' : ''}>{g}</li>)}</ol>}
    {mode === 'Écrire' && <p className="calm-sub wide">Écris ce qui occupe ton esprit, sans chercher à bien faire. Personne d’autre ne le lira.</p>}
    <div className="calm-chips">{MODES.map((m) => <button key={m} className={m === mode ? 'on' : ''} onClick={() => { setMode(m); setTick(0); if (m === 'Écrire') onWrite(); }}>{m}</button>)}</div>
    <button className="calm-note" onClick={onWrite}>Noter ce que je ressens (facultatif)</button>
  </div>;
}
