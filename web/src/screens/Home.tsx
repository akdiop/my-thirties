import { useState, type ReactNode } from 'react';
import { HeartHandshake, Lightbulb, Shield, Sparkles, Waves } from 'lucide-react';
import type { Entry, ModuleId } from '../lib/cloud';
import { isDoneOn, longDate, priorities, str, timeline, todayIso, toggledData } from '../lib/day';
import { fmt, mainCurrency, monthReport } from '../lib/money';
import { dayNumber } from '../lib/challenges';
import { readProfile } from '../lib/profile';
import { ProfileAvatar } from '../features/PersonalProfile';
import { Bar, Check22, SectionTitle } from '../ui/kit';
import { ProtectionSheet } from '../features/ProtectionSheet';

type Go = (screen: ModuleId | 'calme' | 'ressenti' | 'assistant' | 'settings' | 'agenda' | 'spaces') => void;

export function Home({ entries, profileEntry, onGo, onUpdate, onAdd, onQuickAdd, rituals, todayCard, tasksCard, word = '' }: {
  tasksCard?: ReactNode;
  word?: string; rituals?: ReactNode; todayCard?: ReactNode; entries: Entry[]; profileEntry: Entry | undefined; onGo: Go;
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>; onAdd: () => void; onQuickAdd: (title: string) => Promise<void>;
}) {
  const day = todayIso();
  const [protection, setProtection] = useState(false);
  const profile = readProfile(profileEntry);
  // Briefing : seulement les rendez-vous de l'agenda (pas les prières, tâches, repas planifiés ni séances).
  const today = timeline(entries, new Date()).filter((t) => t.entry.module === 'quotidien' && t.entry.kind === 'event').slice(0, 4);
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
      <div className="home-hello"><h1>Bonjour{profile.firstName ? ', ' + profile.firstName : ''}</h1><p>{longDate()}</p>{word && <p className="home-word">« {word} »</p>}</div>
      <button className="round-btn" onClick={() => setProtection(true)} aria-label="Invocations de protection"><Shield size={20} /></button>
      <button className="round-btn" onClick={() => onGo('assistant')} aria-label="Assistant"><Sparkles size={20} /></button>
    </header>
    {protection && <ProtectionSheet onClose={() => setProtection(false)} />}

    {rituals}

    <div className="calm-pills"><button className="calm-pill" onClick={() => onGo('calme')}><Waves size={20} /> J’ai besoin de me calmer</button>
      <button className="calm-pill soft" onClick={() => onGo('ressenti')}><HeartHandshake size={20} /> Je me sens mal</button></div>

    {todayCard}

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
        }) : null}
        {top.length < 3 && <select className="prio-select" value="" aria-label="Ajouter une priorité" onChange={(e) => { const v = e.target.value; if (v === AUTRE) onAdd(); else if (v) void onQuickAdd(v); }}>
          <option value="">+ Ajouter une priorité…</option>
          {Object.entries(PRIORITY_IDEAS).map(([cat, list]) => <optgroup key={cat} label={cat}>{list.filter((t) => !top.some((e) => e.title === t)).map((t) => <option key={t} value={t}>{t}</option>)}</optgroup>)}
          <option value={AUTRE}>Autre (écrire la mienne)…</option>
        </select>}
      </div>
    </section>

    {tasksCard}

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


    <div className="tip-card"><Lightbulb size={22} /><span>{tip}</span></div>
  </div>;
}

const AUTRE = '__autre__';
/** Idées de priorités, rangées par thème, pour en ajouter une en un geste. */
const PRIORITY_IDEAS: Record<string, string[]> = {
  'Travail': ['Avancer sur mon dossier principal', 'Répondre aux mails importants', 'Préparer ma réunion', 'Terminer une tâche en retard', 'Faire le point avec mon équipe', 'Mettre à jour mon CV', 'Planifier ma semaine de travail'],
  'Maison': ['Faire les courses', 'Lancer une lessive', 'Ranger une pièce', 'Changer les draps', 'Faire le ménage express', 'Préparer les repas de demain', 'Sortir les poubelles'],
  'Administratif et argent': ['Payer une facture', 'Noter mes dépenses', 'Classer mes papiers', 'Prendre un rendez-vous médical', 'Appeler la banque', 'Faire un virement épargne', 'Vérifier mon budget du mois'],
  'Santé et corps': ['Faire ma séance de sport', 'Marcher 30 minutes', 'Boire 1,5 L d’eau', 'Me coucher avant minuit', 'Préparer un repas sain', 'Prendre mes compléments', 'Faire mes étirements'],
  'Moi et mes proches': ['Appeler ma famille', 'Prendre des nouvelles d’une amie', 'Un moment rien que pour moi', 'Lire 20 pages', 'Écrire dans mon journal', 'Prendre soin de moi (soin, cheveux)', 'Préparer une surprise'],
  'Spiritualité': ['Prier à l’heure', 'Lire une page du Coran', 'Faire mon dhikr', 'Faire une sadaqa', 'Écouter un rappel'],
  'Projets': ['Avancer sur un projet perso', 'Apprendre 30 minutes', 'Préparer mon prochain voyage', 'Faire une to-do de la semaine', 'Trier mes photos'],
};
