import { useState } from 'react';
import { Bell, Check, Play } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { BASICS, BREATHS, GUIDED, MEDITATION_KIND } from '../lib/meditation';
import { isoOf } from '../lib/rituals';
import { unlockSound } from '../lib/sound';
import { BreathPlayer, GuidedPlayer, TimerPlayer } from '../features/MeditationPlayers';
import { Segmented } from '../ui/kit';
import { Frequences } from '../features/Frequences';

type Tab = 'bases' | 'respirer' | 'guidees' | 'frequences' | 'minuteur';
type Playing = { kind: 'breath' | 'guided' | 'timer'; id: string; minutes: number; name: string; basicsDay?: number } | null;

/** Méditer : « Les bases » en 10 jours, respirations, séances guidées et minuteur avec cloche. */
export function Meditate({ entries, onCreate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const [tab, setTab] = useState<Tab>('bases');
  const [playing, setPlaying] = useState<Playing>(null);
  const [minutes, setMinutes] = useState(10);
  const sessions = entries.filter((e) => e.kind === MEDITATION_KIND);
  const basicsDone = new Set(sessions.map((e) => Number(e.data.basicsDay)).filter(Boolean));
  const nextBasic = BASICS.find((b) => !basicsDone.has(b.day));
  const week = isoOf(new Date(Date.now() - 6 * 86400000));
  const weekMinutes = sessions.filter((e) => String(e.entry_date) >= week).reduce((a, e) => a + (Number(e.data.minutes) || 0), 0);

  const start = (p: NonNullable<Playing>) => { unlockSound(); setPlaying(p); };
  const record = async (p: NonNullable<Playing>) => {
    const date = isoOf(new Date());
    await onCreate({ module: 'equilibre', kind: MEDITATION_KIND, title: 'Méditation · ' + p.name, entry_date: date,
      data: { date, minutes: p.minutes, type: p.kind, name: p.name, ...(p.basicsDay ? { basicsDay: p.basicsDay } : {}) } });
  };

  if (playing) {
    const breath = BREATHS.find((b) => b.id === playing.id), guided = GUIDED.find((g) => g.id === playing.id);
    return <div className="calm-screen">
      <div className="calm-top"><button className="quit-btn" onClick={() => setPlaying(null)}>Terminer</button></div>
      <p className="calm-title">{playing.name}</p>
      {playing.kind === 'breath' && breath && <BreathPlayer breath={breath} onDone={() => void record(playing)} />}
      {playing.kind === 'guided' && guided && <GuidedPlayer guided={guided} onDone={() => void record(playing)} />}
      {playing.kind === 'timer' && <TimerPlayer minutes={playing.minutes} onDone={() => void record(playing)} />}
    </div>;
  }

  return <div className="screen meditate">
    <header className="tab-head"><h1>Méditer</h1><p>{weekMinutes ? weekMinutes + ' min cette semaine' : 'Quelques minutes suffisent'}</p></header>
    <Segmented label="Méditer" value={tab} onChange={setTab} options={[{ value: 'bases', label: 'Les bases' }, { value: 'respirer', label: 'Respirer' }, { value: 'guidees', label: 'Guidées' }, { value: 'frequences', label: 'Fréquences' }, { value: 'minuteur', label: 'Minuteur' }]} />
    {tab === 'frequences' && <Frequences entries={entries} onCreate={onCreate} />}
    {tab === 'bases' && <div className="stack-8">
      <p className="muted">Dix jours pour installer une pratique, quelques minutes par jour. Un jour manqué n’efface rien.</p>
      {BASICS.map((b) => { const done = basicsDone.has(b.day), next = nextBasic?.day === b.day;
        const item = b.breath ? BREATHS.find((x) => x.id === b.breath)! : GUIDED.find((x) => x.id === b.guided)!;
        return <button key={b.day} className={'med-row' + (done ? ' done' : '') + (next ? ' next' : '')}
          onClick={() => start({ kind: b.breath ? 'breath' : 'guided', id: item.id, minutes: b.minutes, name: 'Les bases · jour ' + b.day, basicsDay: b.day })}>
          <span className="workout-dot">{done ? <Check size={14} /> : b.day}</span>
          <span className="workout-title"><strong>{b.title}</strong><small>{b.minutes} min · {b.text}</small></span><Play size={16} /></button>; })}
    </div>}
    {tab === 'respirer' && <div className="stack-8">{BREATHS.map((b) => {
      const mins = Math.max(1, Math.round(b.cycles * b.phases.reduce((a, p) => a + p.secs, 0) / 60));
      return <button key={b.id} className="med-row" onClick={() => start({ kind: 'breath', id: b.id, minutes: mins, name: b.name })}>
        <span className="pill">{b.goal}</span><span className="workout-title"><strong>{b.name}</strong><small>{mins} min · {b.why}</small></span><Play size={16} /></button>; })}</div>}
    {tab === 'guidees' && <div className="stack-8">{GUIDED.map((g) => <button key={g.id} className="med-row" onClick={() => start({ kind: 'guided', id: g.id, minutes: g.minutes, name: g.name })}>
      <span className="pill">{g.goal}</span><span className="workout-title"><strong>{g.name}</strong><small>{g.minutes} min</small></span><Play size={16} /></button>)}</div>}
    {tab === 'minuteur' && <section className="ritual-card form-stack">
      <p className="ritual-label"><Bell size={16} /> Méditation libre</p>
      <p className="muted">Une cloche au début, une au milieu, trois à la fin. Active le son de ton téléphone.</p>
      <div className="chip-row">{[3, 5, 10, 15, 20, 30].map((m) => <button key={m} className={'chip' + (minutes === m ? ' on' : '')} onClick={() => setMinutes(m)}>{m} min</button>)}</div>
      <button className="button primary wide" onClick={() => start({ kind: 'timer', id: 'timer', minutes, name: 'Minuteur ' + minutes + ' min' })}>Commencer</button>
    </section>}
  </div>;
}
