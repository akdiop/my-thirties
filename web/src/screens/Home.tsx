import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, HeartHandshake, Lightbulb, Search, Settings2, Shield, Sparkles, Waves } from 'lucide-react';
export type HomeSlot = 'pills' | 'top' | 'learning' | 'micro' | 'shortcuts';
import type { Entry, ModuleId } from '../lib/cloud';
import { longDate, priorities, str, timeline, todayIso } from '../lib/day';
import { fmt, mainCurrency, monthReport } from '../lib/money';
import { dayNumber } from '../lib/challenges';
import { readProfile } from '../lib/profile';
import { ProfileAvatar } from '../features/PersonalProfile';
import { Bar } from '../ui/kit';
import { ProtectionSheet } from '../features/ProtectionSheet';

type Go = (screen: ModuleId | 'calme' | 'ressenti' | 'recherche' | 'assistant' | 'settings' | 'agenda' | 'spaces') => void;

export function Home({ entries, profileEntry, onGo, ritual, todayCard, tasksCard, cardOrder, onCardOrder, word = '' }: {
  tasksCard?: ReactNode; ritual?: (slot: HomeSlot) => ReactNode; cardOrder?: string[]; onCardOrder?: (o: string[]) => void;
  word?: string; todayCard?: ReactNode; entries: Entry[]; profileEntry: Entry | undefined; onGo: Go;
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

  const evening = new Date().getHours() >= 18;
  const defaultOrder = evening ? ['journee', 'rappels', 'taches', 'bilan', 'micro', 'raccourcis'] : ['journee', 'taches', 'rappels', 'bilan', 'micro', 'raccourcis'];
  const order = [...(cardOrder ?? []).filter((c) => defaultOrder.includes(c)), ...defaultOrder.filter((c) => !(cardOrder ?? []).includes(c))];
  const [arranging, setArranging] = useState(false);
  const move = (i: number, d: number) => { const o = [...order]; [o[i], o[i + d]] = [o[i + d]!, o[i]!]; onCardOrder?.(o); };
  const cards: Record<string, { title: string; node: ReactNode }> = {
    journee: { title: 'Ma journée', node: todayCard },
    taches: { title: 'Mes tâches', node: tasksCard },
    rappels: { title: 'Je n’oublie pas', node: ritual?.('learning') },
    bilan: { title: 'Défi et budget', node: <><div className="two-cards">
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
    <div className="tip-card"><Lightbulb size={22} /><span>{tip}</span></div></> },
    micro: { title: 'Micro-rituels', node: ritual?.('micro') },
    raccourcis: { title: 'Mes raccourcis', node: ritual?.('shortcuts') },
  };

  return <div className="screen home">
    <header className="home-head">
      <button className="avatar-btn" onClick={() => onGo('settings')} aria-label="Mon profil"><ProfileAvatar profile={profile} size={48} /></button>
      <div className="home-hello"><h1>Bonjour{profile.firstName ? ', ' + profile.firstName : ''}</h1><p>{longDate()}</p>{word && <p className="home-word">« {word} »</p>}</div>
      <button className="round-btn" onClick={() => setProtection(true)} aria-label="Invocations de protection"><Shield size={20} /></button>
      <button className="round-btn" onClick={() => onGo('assistant')} aria-label="Assistant"><Sparkles size={20} /></button>
    </header>
    {protection && <ProtectionSheet onClose={() => setProtection(false)} />}
    <button className="home-search" onClick={() => onGo('recherche')}><Search size={18} /> Rechercher…</button>

    {ritual?.('pills')}
    {ritual?.('top')}

    <div className="calm-pills"><button className="calm-pill" onClick={() => onGo('calme')}><Waves size={20} /> J’ai besoin de me calmer</button>
      <button className="calm-pill soft" onClick={() => onGo('ressenti')}><HeartHandshake size={20} /> Je me sens mal</button></div>

    {order.map((id) => <Fold key={id} id={id} title={cards[id]!.title}>{cards[id]!.node}</Fold>)}

    <button className="link-btn small center-btn" onClick={() => setArranging(!arranging)}><Settings2 size={14} /> {arranging ? 'Terminé' : 'Organiser mon accueil'}</button>
    {arranging && <div className="shortcut-edit">{order.map((id, i) => <div key={id} className="sc-row">
      <span className="sc-label">{cards[id]!.title}</span>
      <button className="icon-btn" aria-label={'Monter ' + cards[id]!.title} disabled={i === 0} onClick={() => move(i, -1)}><ChevronUp size={16} /></button>
      <button className="icon-btn" aria-label={'Descendre ' + cards[id]!.title} disabled={i === order.length - 1} onClick={() => move(i, 1)}><ChevronDown size={16} /></button></div>)}
      <p className="muted small">Tu peux aussi replier une carte en touchant son titre : l’app s’en souvient.</p></div>}
  </div>;
}

/** Une carte de l'accueil, repliable d'un geste ; l'état est gardé sur cet appareil. */
function Fold({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const key = 'home-fold-' + id;
  const [open, setOpen] = useState(() => { try { return localStorage.getItem(key) !== '0'; } catch { return true; } });
  if (!children) return null;
  const toggle = () => { setOpen(!open); try { localStorage.setItem(key, open ? '0' : '1'); } catch { /* stockage indisponible */ } };
  return <section id={'home-' + id} className={'home-fold' + (open ? '' : ' closed')}>
    <button className="fold-head" aria-expanded={open} onClick={toggle}><span>{title}</span><ChevronDown size={16} className={open ? 'flip' : ''} /></button>
    {open && children}
  </section>;
}

