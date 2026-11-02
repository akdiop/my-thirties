import { useEffect, useRef, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';
import { addDays, isoOf, weekStartOf } from '../lib/rituals';
import { bell, unlockSound } from '../lib/sound';

export const FOCUS_KIND = 'focus';
const DURATIONS = [15, 25, 45, 60];
const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Focus : une plante pousse pendant que tu te concentres, et fane si tu quittes l'app pendant la séance. */
export function Focus({ entries, onCreate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const [minutes, setMinutes] = useState(25);
  const [label, setLabel] = useState('');
  const [startAt, setStartAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<'grown' | 'wilted' | null>(null);
  const saved = useRef(false);
  const total = minutes * 60000;
  const running = startAt !== null && !result;
  const progress = startAt ? Math.min(1, (now - startAt) / total) : 0;

  useEffect(() => { if (!running) return; const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, [running]);
  // Quitter l'app pendant une séance fait faner la plante.
  useEffect(() => {
    if (!running) return;
    const onHide = () => { if (document.visibilityState === 'hidden') setResult('wilted'); };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [running]);
  useEffect(() => { if (running && progress >= 1) { setResult('grown'); bell(2); } }, [running, progress]);
  useEffect(() => {
    if (!result || !startAt || saved.current) return;
    saved.current = true;
    const date = isoOf(new Date());
    const done = Math.max(1, Math.round((Math.min(now, startAt + total) - startAt) / 60000));
    void onCreate({ module: 'quotidien', kind: FOCUS_KIND, title: (label.trim() || 'Séance focus') + (result === 'grown' ? '' : ' (interrompue)'), entry_date: date,
      data: { date, minutes: result === 'grown' ? minutes : done, planned: minutes, completed: result === 'grown', label: label.trim() } });
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => { unlockSound(); saved.current = false; setResult(null); setNow(Date.now()); setStartAt(Date.now()); };
  const reset = () => { setStartAt(null); setResult(null); };
  const left = Math.max(0, total - (now - (startAt ?? now)));

  const sessions = entries.filter((e) => e.kind === FOCUS_KIND);
  const week = weekStartOf(isoOf(new Date()));
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const perDay = days.map((d) => sessions.filter((e) => e.entry_date === d && e.data.completed).reduce((a, e) => a + (Number(e.data.minutes) || 0), 0));
  const weekTotal = perDay.reduce((a, b) => a + b, 0);
  const grown = sessions.filter((e) => e.data.completed).length;
  const max = Math.max(60, ...perDay);

  return <div className="screen focus">
    <header className="tab-head"><h1>Focus</h1><p>{grown ? grown + ' plante' + (grown > 1 ? 's' : '') + ' dans ton jardin' : 'Ta première plante t’attend'}</p></header>
    <div className="focus-stage">
      <Plant progress={result === 'grown' ? 1 : progress} wilted={result === 'wilted'} />
      {running ? <><p className="focus-time">{String(Math.floor(left / 60000)).padStart(2, '0')}:{String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}</p>
          <p className="muted center">Reste dans l’app : si tu la quittes, ta plante fane.</p>
          <button className="button ghost wide" onClick={() => setResult('wilted')}>Abandonner</button></>
        : result ? <><p className="focus-msg">{result === 'grown' ? 'Bravo, ta plante a poussé !' : 'Ta plante a fané. Ce n’est rien : on recommence quand tu veux.'}</p>
          <button className="button primary wide" onClick={reset}>Nouvelle séance</button></>
        : <div className="form-stack">
          <div className="chip-row center">{DURATIONS.map((m) => <button key={m} className={'chip' + (minutes === m ? ' on' : '')} onClick={() => setMinutes(m)}>{m} min</button>)}</div>
          <input value={label} maxLength={80} onChange={(e) => setLabel(e.target.value)} placeholder="Sur quoi je me concentre ? (facultatif)" />
          <button className="button primary wide" onClick={start}>Planter et commencer</button>
        </div>}
    </div>
    <section className="ritual-card">
      <p className="ritual-label">Cette semaine · {weekTotal} min de concentration</p>
      <div className="focus-week">{days.map((d, i) => <div key={d} className="focus-col"><span style={{ height: Math.round(perDay[i]! / max * 100) + '%' }} /><small>{LETTERS[i]}</small></div>)}</div>
    </section>
  </div>;
}

function Plant({ progress, wilted }: { progress: number; wilted: boolean }) {
  const s = 0.25 + progress * 0.75;
  const leaf = wilted ? '#B9AFA4' : '#8F9F7A', leaf2 = wilted ? '#CFC6BC' : '#B5603F', stem = wilted ? '#A89C90' : '#5E7A5F';
  return <svg className={'plant' + (wilted ? ' wilted' : '')} viewBox="0 0 200 200" aria-hidden="true">
    <ellipse cx="100" cy="182" rx="62" ry="10" fill="#E9DCCF" />
    <path d="M70 150 h60 l-8 32 h-44 z" fill="#C48A5A" />
    <g transform={`translate(100 150) scale(${s}) ${wilted ? 'rotate(18)' : ''}`}>
      <path d="M0 0 C0 -40 2 -70 0 -110" stroke={stem} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M0 -40 C-30 -42 -48 -62 -46 -86 C-22 -84 -4 -66 0 -40 Z" fill={leaf} opacity={progress > 0.15 ? 1 : 0} />
      <path d="M0 -62 C28 -64 46 -82 46 -104 C22 -104 4 -88 0 -62 Z" fill={leaf} opacity={progress > 0.4 ? 1 : 0} />
      <path d="M0 -88 C-20 -92 -32 -108 -30 -126 C-12 -124 -2 -110 0 -88 Z" fill={leaf} opacity={progress > 0.65 ? 1 : 0} />
      <circle cx="0" cy="-116" r="12" fill={leaf2} opacity={progress >= 1 && !wilted ? 1 : 0} />
    </g>
  </svg>;
}
