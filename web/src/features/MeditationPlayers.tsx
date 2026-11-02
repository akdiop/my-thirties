import { useEffect, useRef, useState } from 'react';
import { bell } from '../lib/sound';
import type { Breath, Guided } from '../lib/meditation';

/** Respiration guidée : un cercle qui grandit et rétrécit au rythme des phases. */
export function BreathPlayer({ breath, onDone }: { breath: Breath; onDone?: () => void }) {
  const [t, setT] = useState(0);
  const cycleLen = breath.phases.reduce((a, p) => a + p.secs, 0);
  const total = cycleLen * breath.cycles;
  const done = t >= total;
  const ended = useRef(false);
  useEffect(() => { if (done) return; const i = setInterval(() => setT((n) => n + 1), 1000); return () => clearInterval(i); }, [done]);
  useEffect(() => { if (done && !ended.current) { ended.current = true; onDone?.(); } }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  let pos = t % cycleLen, idx = 0;
  while (idx < breath.phases.length - 1 && pos >= breath.phases[idx]!.secs) { pos -= breath.phases[idx]!.secs; idx++; }
  const phase = breath.phases[idx]!;
  return <div className="player">
    <div className={'breath ' + (done ? 'out' : phase.grow ? 'in' : 'out')} style={{ ['--phase' as string]: phase.secs + 's' }} aria-live="polite">
      <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
      <span className="breath-text"><strong>{done ? 'Terminé' : phase.label}</strong><small>{done ? 'Bravo' : (phase.secs - pos) + ' s'}</small></span>
    </div>
    <p className="calm-sub">{done ? breath.cycles + ' cycles faits' : 'Cycle ' + (Math.floor(t / cycleLen) + 1) + ' sur ' + breath.cycles}</p>
  </div>;
}

/** Séance guidée : une consigne à la fois, à son rythme ou automatiquement. */
export function GuidedPlayer({ guided, onDone }: { guided: Guided; onDone?: () => void }) {
  const per = Math.max(20, Math.round((guided.minutes * 60) / guided.steps.length));
  const [t, setT] = useState(0);
  const step = Math.min(guided.steps.length, Math.floor(t / per));
  const done = step >= guided.steps.length;
  const ended = useRef(false);
  useEffect(() => { if (done) return; const i = setInterval(() => setT((n) => n + 1), 1000); return () => clearInterval(i); }, [done]);
  useEffect(() => { if (done && !ended.current) { ended.current = true; bell(1); onDone?.(); } }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="player guided">
    <ol className="calm-list">{guided.steps.map((s, i) => <li key={s} className={i === step ? 'on' : i < step ? 'past' : ''}>{s}</li>)}</ol>
    {!done && <button className="link-btn" onClick={() => setT((step + 1) * per)}>Étape suivante</button>}
    {done && <p className="calm-sub">Séance terminée. Prends un instant avant de reprendre.</p>}
  </div>;
}

/** Minuteur de méditation : cloche au début, au milieu et à la fin. */
export function TimerPlayer({ minutes, onDone }: { minutes: number; onDone?: () => void }) {
  const total = minutes * 60;
  const [t, setT] = useState(0);
  const done = t >= total;
  const ended = useRef(false);
  useEffect(() => { bell(1); }, []);
  useEffect(() => { if (done) return; const i = setInterval(() => setT((n) => n + 1), 1000); return () => clearInterval(i); }, [done]);
  useEffect(() => { if (t === Math.floor(total / 2) && t > 0) bell(1); }, [t, total]);
  useEffect(() => { if (done && !ended.current) { ended.current = true; bell(3); onDone?.(); } }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  const left = Math.max(0, total - t);
  return <div className="player">
    <div className="timer-ring" style={{ ['--p' as string]: String(t / total) }}>
      <span><strong>{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</strong><small>{done ? 'Terminé' : 'Respire tranquillement'}</small></span>
    </div>
  </div>;
}
