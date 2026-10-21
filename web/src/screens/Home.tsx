import { Lightbulb, Sparkles, Waves } from 'lucide-react';
import type { Entry, ModuleId } from '../lib/cloud';
import { isDoneOn, longDate, priorities, str, timeline, todayIso, toggledData } from '../lib/day';
import { fmt, mainCurrency, monthReport } from '../lib/money';
import { dayNumber } from '../lib/challenges';
import { readProfile } from '../lib/profile';
import { ProfileAvatar } from '../features/PersonalProfile';
import { Bar, Check22, ModuleTile, SectionTitle } from '../ui/kit';
import { modules } from '../modules';

type Go = (screen: ModuleId | 'calme' | 'assistant' | 'settings' | 'agenda' | 'spaces') => void;

export function Home({ entries, profileEntry, onGo, onUpdate, onAdd }: {
  entries: Entry[]; profileEntry: Entry | undefined; onGo: Go;
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>; onAdd: () => void;
}) {
  const day = todayIso();
  const profile = readProfile(profileEntry);
  const today = timeline(entries, new Date()).slice(0, 4);
  const top = priorities(entries, day);
  const challenge = entries.find((e) => e.kind === 'challenge');
  const cur = mainCurrency(entries);
  const report = monthReport(entries, day.slice(0, 7), cur);
  const challengeDays = challenge ? Math.min(30, Math.max(7, Number(challenge.data.days) || 30)) : 30;
  const challengeDone = challenge && challenge.data.progress && typeof challenge.data.progress === 'object'
    ? Object.values(challenge.data.progress as Record<string, { status: string }>).filter((p) => p.status === 'done').length : 0;
  const challengeDay = challenge ? dayNumber(str(challenge, 'start') || challenge.entry_date || day, day) : 0;
  const tip = !top.length ? 'Commence par noter une petite priorité pour aujourd’hui.'
    : today.length >= 4 ? 'Journée bien remplie : garde un moment pour toi, même court.'
    : 'Un créneau libre ce soir ? C’est le bon moment pour préparer ton batch cooking.';

  return <div className="screen home">
    <header className="home-head">
      <button className="avatar-btn" onClick={() => onGo('settings')} aria-label="Mon profil"><ProfileAvatar profile={profile} size={48} /></button>
      <div className="home-hello"><h1>Bonjour{profile.firstName ? ', ' + profile.firstName : ''}</h1><p>{longDate()}</p></div>
      <button className="round-btn" onClick={() => onGo('assistant')} aria-label="Assistant"><Sparkles size={20} /></button>
    </header>

    <button className="calm-pill" onClick={() => onGo('calme')}><Waves size={20} /> J’ai besoin de me calmer</button>

    <section className="day-card">
      <div className="day-card-head"><h2>Votre journée</h2><span>Briefing du matin</span></div>
      {today.length ? today.map((t) => { const extra = t.sub.split(' · ').slice(1).join(' · '); return <div className="day-line" key={t.id}><span>{t.time || ''}</span><span>{t.title}{extra ? <small> · {extra}</small> : null}</span></div>; })
        : <p className="day-empty">Rien de prévu pour l’instant. Une journée à ton rythme.</p>}
    </section>

    <section>
      <SectionTitle action="Tout voir" onAction={() => onGo('agenda')}>Mes 3 priorités</SectionTitle>
      <div className="soft-card list-card">
        {top.length ? top.map((e) => {
          const done = isDoneOn(e, day);
          return <div className="prio-row" key={e.id}>
            <Check22 checked={done} label={e.title} onChange={(v) => void onUpdate(e, toggledData(e, day, v))} />
            <span className={done ? 'done' : ''}>{e.title}</span>
            {str(e, 'time') && <small>{str(e, 'time')}</small>}
          </div>;
        }) : <button className="prio-empty" onClick={onAdd}>+ Ajouter une priorité</button>}
      </div>
    </section>

    <div className="two-cards">
      <button className="soft-card stat-card" onClick={() => onGo('challenges')}>
        <span className="k">Challenge</span>
        {challenge ? <><strong className="serif">{challenge.title.replace(/^Défi \d+ jours /, '')} · jour {Math.max(1, Math.min(challengeDays, challengeDay))}</strong>
          <Bar value={challengeDone / challengeDays} /><span className="v sauge">{challengeDone} / {challengeDays} jours</span></>
          : <><strong className="serif">Aucun défi</strong><span className="v">Choisis un défi de 30 jours</span></>}
      </button>
      <button className="soft-card stat-card" onClick={() => onGo('finances')}>
        <span className="k">Budget de {new Date().toLocaleDateString('fr-FR', { month: 'long' })}</span>
        {report.left !== null ? <><strong className="num">{fmt(Math.max(0, report.left), cur).replace(' ' + cur, '')} <small>{cur} restants</small></strong>
          <Bar value={report.budget ? report.spent / report.budget : 0} tone="caramel" /><span className="v">{Math.round(100 * report.spent / report.budget)} % dépensés</span></>
          : <><strong className="num">{fmt(report.spent, cur)}</strong><span className="v">dépensés ce mois-ci</span></>}
      </button>
    </div>

    <section>
      <SectionTitle action="Tout voir" onAction={() => onGo('spaces')}>Mes espaces</SectionTitle>
      <div className="tile-grid">
        {modules.map((m) => <ModuleTile key={m.id} id={m.id} onClick={() => onGo(m.id)} />)}
        <ModuleTile id="assistant" label="Assistant IA" onClick={() => onGo('assistant')} />
      </div>
    </section>

    <div className="tip-card"><Lightbulb size={22} /><span>{tip}</span></div>
  </div>;
}
