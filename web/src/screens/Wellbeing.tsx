import { ChevronRight, CloudSun, Frown, Smile, Meh, Zap } from 'lucide-react';
import { useContext, useState } from 'react';
import type { Entry, EntryInput, ModuleId } from '../lib/cloud';
import { str, todayIso } from '../lib/day';
import { dayNumber, templateById } from '../lib/challenges';
import { cycleInfo, prayerDay } from '../lib/wellbeing';
import { PhotoContext } from '../features/HeroPhoto';
import { VISUALS } from '../lib/visuals';
import { SectionTitle } from '../ui/kit';

const MOODS = [
  { value: 'Sereine', icon: Smile }, { value: 'Joyeuse', icon: CloudSun }, { value: 'Fatiguée', icon: Meh }, { value: 'Stressée', icon: Frown },
] as const;

export function Wellbeing({ entries, onGo, onCreate, onUpdate }: {
  entries: Entry[]; onGo: (s: ModuleId | 'calme') => void;
  onCreate: (input: EntryInput) => Promise<void>; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  const day = todayIso();
  const { photos } = useContext(PhotoContext);
  const [busy, setBusy] = useState(false);
  const moodToday = entries.find((e) => e.kind === 'mood' && e.entry_date === day);
  const currentMood = moodToday ? str(moodToday, 'mood') : '';
  const session = entries.filter((e) => e.module === 'sport' && e.kind === 'session' && e.entry_date && e.entry_date >= day)
    .sort((a, b) => (a.entry_date! + str(a, 'time')).localeCompare(b.entry_date! + str(b, 'time')))[0];
  const challenges = entries.filter((e) => e.kind === 'challenge').slice(0, 4);
  const cycle = cycleInfo(entries, day);
  const prayer = prayerDay(entries);

  const setMood = async (mood: string) => {
    setBusy(true);
    try {
      if (moodToday) await onUpdate(moodToday, { ...moodToday.data, mood });
      else await onCreate({ module: 'sante', kind: 'mood', title: 'Humeur · ' + mood, entry_date: day, data: { date: day, mood } });
    } finally { setBusy(false); }
  };

  return <div className="screen">
    <header className="tab-head"><h1>Bien-être</h1><p>Votre corps et votre esprit, aujourd’hui</p></header>
    <section className="stack-8">
      <span className="label-strong">Comment vous sentez-vous ?</span>
      <div className="mood-row">{MOODS.map(({ value, icon: Icon }) =>
        <button key={value} disabled={busy} className={'mood' + (currentMood === value ? ' on' : '')} onClick={() => void setMood(value)}><Icon size={20} />{value}</button>)}</div>
    </section>

    <button className="session-card" onClick={() => onGo('sport')}>
      <span className="session-photo" style={{ backgroundImage: `linear-gradient(180deg,rgba(55,35,25,.04),rgba(55,35,25,.15)),url("${photos['sport-pilates'] || VISUALS.pilates}")` }}></span>
      <span className="session-body">
        {session ? <><small>Séance prévue · {session.entry_date === day ? (str(session, 'time') || 'aujourd’hui') : new Date(session.entry_date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long' })}</small>
          <strong className="serif">{session.title}</strong><span>{[str(session, 'duration') && str(session, 'duration') + ' min', str(session, 'technique')].filter(Boolean).join(' · ')}</span></>
          : <><small>Mon sport</small><strong className="serif">Prévoir une séance</strong><span>Tennis, Pilates ou Yoga</span></>}
      </span>
    </button>

    <section>
      <SectionTitle action="Tous" onAction={() => onGo('challenges')}>Challenges du jour</SectionTitle>
      <div className="stack-8">{challenges.length ? challenges.map((c) => {
        const t = templateById(c.data.template);
        const n = dayNumber(str(c, 'start') || c.entry_date || day, day);
        const plan = t && n > 0 ? t.day(n) : null;
        const status = (c.data.progress as Record<string, { status: string }> | undefined)?.[String(n)]?.status;
        const rest = Boolean(t) && n > 0 && plan === null;
        return <button key={c.id} className={'challenge-today' + (rest ? ' rest' : '')} onClick={() => onGo('challenges')}>
          <span className={'day-badge' + (rest ? ' outline' : '')}>{n > 0 ? n : '—'}</span>
          <span className="ct-body"><strong>{c.title.replace(/^Défi \d+ jours /, '')}</strong>
            <small>{status === 'done' ? 'Fait aujourd’hui, bravo' : rest ? 'Jour de repos, récupérez bien' : n > 0 ? 'À faire aujourd’hui' : 'Commence bientôt'}</small></span>
          {!rest && <ChevronRight size={18} />}
        </button>;
      }) : <button className="challenge-today" onClick={() => onGo('challenges')}><span className="day-badge"><Zap size={16} /></span><span className="ct-body"><strong>Choisir un défi</strong><small>Squats, abdos, bras, Pilates…</small></span><ChevronRight size={18} /></button>}</div>
    </section>

    <div className="two-cards">
      <button className="soft-card stat-card" onClick={() => onGo('sante')}>
        <span className="k">Cycle</span>
        <strong className="num">{cycle ? 'Jour ' + cycle.day : 'À noter'}</strong>
        <span className="v">{cycle?.next ? 'Prochaines règles vers le ' + cycle.next.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' (estimation)' : 'Note le début de tes règles dans Ma santé'}</span>
      </button>
      <button className="soft-card stat-card" onClick={() => onGo('spiritualite')}>
        <span className="k">Prochaine prière</span>
        <strong className="num">{prayer?.next ? prayer.next.name + ' · ' + prayer.next.time : prayer ? 'Fajr · demain' : 'Horaires'}</strong>
        <span className="v">{prayer?.next ? prayer.inText : prayer ? 'vers ' + (prayer.times[0]?.time ?? '') : 'À récupérer dans Ma spiritualité'}</span>
      </button>
    </div>

    <button className="calm-pill" onClick={() => onGo('calme')}>J’ai besoin de me calmer</button>
    <div className="stack-8">
      <button className="row-plain" onClick={() => onGo('equilibre')}>Mon équilibre <ChevronRight size={18} /></button>
      <button className="row-plain" onClick={() => onGo('sante')}>Ma santé <ChevronRight size={18} /></button>
    </div>
  </div>;
}
