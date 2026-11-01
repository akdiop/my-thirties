import { useState, type ReactNode } from 'react';
import { BookOpen, Check, ChevronRight, ClipboardList, Dumbbell, Gavel, NotebookPen, PlayCircle, ScanLine, Target } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { TEMPLATES } from '../lib/challenges';
import { SPORT_SESSION_IDEAS } from '../lib/sportSessionIdeas';
import { PADEL_RULES, PADEL_VIDEO_SEARCHES, TENNIS_RULES, type RuleSection } from '../lib/sportRules';
import { NIVEAUX, WORKOUT_PATH, type WorkoutStep } from '../lib/workoutPath';
import { HeroPhoto } from './HeroPhoto';
import { LocalVideoPose } from './LocalVideoPose';
import { SportNotebook } from './SportNotebook';
import { SportProgress } from './SportProgress';

type Discipline = 'Pilates' | 'Yoga' | 'Tennis' | 'Padel' | 'Workout';
type Video = { id?: string; q?: string; title: string };
const videoUrl = (v: Video) => v.id ? 'https://www.youtube.com/watch?v=' + v.id : 'https://www.youtube.com/results?search_query=' + encodeURIComponent(v.q ?? v.title);

const SPORTS: Record<Discipline, {
  tagline: string; tone: 'caramel' | 'sauge' | 'sable' | 'chocolat';
  basics: { name: string; text: string }[]; benefits: string[];
  exercises: { name: string; text: string }[]; videos: Video[];
  rules?: RuleSection[];
}> = {
  Pilates: {
    tagline: 'Renforcer · Équilibrer · Respirer', tone: 'caramel',
    basics: [
      { name: 'Respiration et contrôle', text: 'Respire sans bloquer l’air. Favorise des mouvements précis et confortables plutôt que l’amplitude maximale.' },
      { name: 'Pilates au sol', text: 'Commence par des exercices de mobilité douce et de stabilité. Adapte l’amplitude à tes sensations.' },
      { name: 'Reformer', text: 'Le Reformer utilise un chariot et des ressorts. Les réglages et la technique doivent être montrés par un encadrant qualifié.' },
      { name: 'Alignement', text: 'Recherche une position confortable du bassin, des épaules et de la nuque. Arrête un exercice douloureux.' },
    ],
    benefits: ['Renforcement profond du centre du corps', 'Posture et conscience corporelle', 'Mobilité de la colonne', 'Concentration et respiration'],
    exercises: [
      { name: 'The Hundred', text: 'Sur le dos, jambes en table, bras qui battent le rythme de la respiration : 5 temps d’inspiration, 5 d’expiration.' },
      { name: 'Roll-up', text: 'Déroule la colonne vertèbre par vertèbre pour t’asseoir, puis redescends lentement. Plie les genoux si besoin.' },
      { name: 'Cercles de jambe', text: 'Une jambe tendue vers le plafond dessine de petits cercles, bassin stable.' },
      { name: 'Pont', text: 'Pieds au sol, soulève le bassin en déroulant la colonne, puis redescends en contrôle.' },
      { name: 'Swimming', text: 'À plat ventre, bras et jambes alternés légèrement décollés, nuque longue.' },
    ],
    videos: [
      { id: '6sFL1gcW7GA', title: 'Pilates débutant, séance complète de 40 min' },
      { id: 'OtDxhKBS08U', title: 'Pilates for Black Women' },
      { id: 'hx5fYkg5wrs', title: 'Pilates à la maison (ELLE)' },
      { id: 'IW1UutkWaN4', title: 'Le Hundred expliqué' },
      { id: 'YVmB-b125dU', title: 'Le Roll-up expliqué' },
    ],
  },
  Tennis: {
    tagline: 'Frapper · Bouger · Anticiper', tone: 'sauge',
    basics: [
      { name: 'Le service', text: 'Travaille une préparation stable, une prise confortable et un lancer régulier. Privilégie la précision avant la vitesse.' },
      { name: 'Le coup droit', text: 'Prépare tôt la raquette, oriente les épaules et cherche un contact équilibré. Reviens ensuite vers une position prête.' },
      { name: 'Le revers', text: 'En revers à une ou deux mains, veille à l’équilibre des appuis et à la fluidité du geste.' },
      { name: 'Comprendre le score', text: 'Les points d’un jeu sont annoncés 0, 15, 30, 40, puis jeu, avec les règles d’égalité et d’avantage selon le format.' },
    ],
    benefits: ['Cardio et endurance', 'Coordination et réflexes', 'Jeu de jambes', 'Plaisir de jouer à plusieurs'],
    exercises: [
      { name: 'Ombre du coup droit', text: 'Sans balle, répète lentement le geste complet devant un miroir : préparation, frappe, accompagnement.' },
      { name: 'Lancer de balle', text: 'Entraîne-toi à lancer la balle toujours au même endroit, bras tendu, avant de servir.' },
      { name: 'Pas chassés', text: 'Déplacements latéraux courts, retour au centre après chaque « frappe ».' },
    ],
    videos: [
      { id: 'xue9cSVZp-U', title: 'Le coup droit (FFT)' },
      { id: '0APgBmGB7xo', title: 'Le revers à deux mains (FFT)' },
      { id: 'YWfd2sO33Ko', title: 'Le revers à une main (FFT)' },
      { id: 'IE7PKOA5dW8', title: 'Le service (FFT)' },
      { id: 'E8Kglf--tEc', title: 'La volée (FFT)' },
      { id: 'NTv6mojUidw', title: 'Le smash (FFT)' },
      { id: 'F9Qlbtqb998', title: 'Le jeu de jambes (FFT)' },
      { id: 'bRCQwLgEs9M', title: 'Le service de Venus Williams' },
    ],
    rules: TENNIS_RULES,
  },
  Padel: {
    tagline: 'Vitres · Volée · Complicité', tone: 'caramel',
    basics: [
      { name: 'Un sport de double', text: 'On joue toujours à quatre. La communication avec ta ou ton partenaire compte autant que la technique.' },
      { name: 'Le jeu avec les vitres', text: 'Laisse passer la balle, attends qu’elle revienne de la vitre, puis frappe. C’est le geste le plus propre au padel.' },
      { name: 'Le filet', text: 'Les points se gagnent surtout au filet. Monte ensemble avec ton partenaire, redescends ensemble.' },
      { name: 'La bandeja', text: 'Un smash contrôlé, frappé au-dessus de l’épaule avec la raquette ouverte, pour garder le filet sans prendre de risque.' },
    ],
    benefits: ['Cardio sans impact violent', 'Réflexes et coordination', 'Facile à apprendre', 'Très convivial'],
    exercises: [
      { name: 'Prise continentale', text: 'Tiens la raquette comme un marteau : c’est la prise de base pour la volée et le service.' },
      { name: 'Sortie de vitre', text: 'Fais rebondir la balle au sol puis sur la vitre du fond, recule avec elle et frappe en avançant.' },
      { name: 'Volée de blocage', text: 'Au filet, raquette devant toi, petit geste court : tu bloques la balle plus que tu ne la frappes.' },
      { name: 'Le lob', text: 'Depuis le fond, envoie la balle haut au-dessus des adversaires pour reprendre le filet.' },
    ],
    videos: PADEL_VIDEO_SEARCHES,
    rules: PADEL_RULES,
  },
  Workout: {
    tagline: 'Renforcer · Transpirer · Progresser', tone: 'chocolat',
    basics: [
      { name: 'Au poids du corps', text: 'Pas besoin de matériel : un tapis, une chaise stable, une marche. Tout se fait à la maison.' },
      { name: 'La qualité avant tout', text: 'Un mouvement propre vaut mieux que dix mouvements rapides. Ralentis si ta posture se dégrade.' },
      { name: 'Progresser étape par étape', text: 'Passe au niveau suivant quand une séance te paraît confortable de bout en bout.' },
      { name: 'Récupérer', text: 'Garde au moins un jour de repos entre deux séances intenses. Le muscle se construit pendant la récupération.' },
    ],
    benefits: ['Force et tonus', 'Cardio', 'Posture', 'Énergie au quotidien'],
    exercises: [
      { name: 'Squat', text: 'Pieds largeur de hanches, fesses vers l’arrière, poids dans les talons, genoux dans l’axe des pieds.' },
      { name: 'Pompe', text: 'Corps gainé de la tête aux talons ; commence contre un mur, puis sur les genoux.' },
      { name: 'Planche', text: 'Avant-bras sous les épaules, ventre rentré, dos plat.' },
      { name: 'Fente', text: 'Les deux genoux à 90°, buste droit.' },
    ],
    videos: [
      { q: 'squat technique débutant', title: 'Bien faire un squat' },
      { q: 'pompes débutant progression', title: 'Progresser aux pompes' },
      { q: 'planche gainage technique', title: 'Réussir sa planche' },
      { q: 'workout maison débutant 20 minutes', title: 'Workout maison débutant' },
    ],
  },
  Yoga: {
    tagline: 'Souplesse · Souffle · Présence', tone: 'sable',
    basics: [
      { name: 'Hatha', text: 'Un rythme posé, qui permet d’explorer les postures, la respiration et les transitions.' },
      { name: 'Yin', text: 'Des positions tenues avec douceur et soutiens si nécessaire. Évite de forcer dans les articulations.' },
      { name: 'Vinyasa', text: 'Un enchaînement de mouvements coordonnés à la respiration. Choisis un rythme qui te convient.' },
      { name: 'Restauratif', text: 'Des postures soutenues avec des accessoires pour favoriser le confort et la détente.' },
    ],
    benefits: ['Souplesse et mobilité', 'Respiration et détente', 'Équilibre', 'Écoute de soi'],
    exercises: [
      { name: 'Chien tête en bas', text: 'Mains et pieds au sol, bassin vers le haut, genoux pliés si besoin pour allonger le dos.' },
      { name: 'Guerrier II', text: 'Jambes écartées, genou avant au-dessus de la cheville, bras ouverts à l’horizontale.' },
      { name: 'Posture de l’enfant', text: 'Assise sur les talons, buste vers l’avant, front au sol : une posture de repos.' },
    ],
    videos: [
      { id: '8N_MfbPabCE', title: 'Séance de yoga débutant' },
      { id: 'DkgJ82UVQ7c', title: 'Yoga avec Jessamyn Stanley' },
      { id: 'H46cwAAIbUk', title: 'Le chien tête en bas' },
      { id: 'RcGdWwmorTg', title: 'Le guerrier II' },
    ],
  },
};

type Row = 'parcours' | 'bases' | 'regles' | 'exercices' | 'programmes' | 'technique' | 'journal' | 'objectifs';
const ROWS: { id: Row; label: string; icon: typeof BookOpen }[] = [
  { id: 'parcours', label: 'Mon parcours workout', icon: Dumbbell },
  { id: 'bases', label: 'Bases et bienfaits', icon: BookOpen },
  { id: 'regles', label: 'Toutes les règles', icon: Gavel },
  { id: 'exercices', label: 'Exercices et vidéos', icon: PlayCircle },
  { id: 'programmes', label: 'Programmes', icon: ClipboardList },
  { id: 'technique', label: 'Analyser ma technique', icon: ScanLine },
  { id: 'journal', label: 'Mon journal', icon: NotebookPen },
  { id: 'objectifs', label: 'Mes objectifs', icon: Target },
];

export function SportHub({ entries, challengeEntries, onCreate, onGoChallenges }: {
  entries: Entry[]; challengeEntries: Entry[]; onCreate: (input: EntryInput) => Promise<void>; onGoChallenges: () => void;
}) {
  const [active, setActive] = useState<Discipline>('Pilates');
  const [open, setOpen] = useState<Row | null>(null);
  const sport = SPORTS[active];
  const rows = ROWS.filter((r) => (r.id !== 'regles' || sport.rules) && (r.id !== 'parcours' || active === 'Workout') && (r.id !== 'technique' || active !== 'Workout'));
  const panel: Record<Row, ReactNode> = {
    parcours: <WorkoutParcours entries={entries} onCreate={onCreate} />,
    regles: sport.rules ? <Rules sections={sport.rules} /> : null,
    bases: <><ul className="benefits">{sport.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
      <div className="lesson-grid">{sport.basics.map((l) => <article className="lesson-card" key={l.name}><h3>{l.name}</h3><p>{l.text}</p></article>)}</div></>,
    exercices: <><SessionIdeas discipline={active} onCreate={onCreate} /><h4>Fiches techniques</h4><div className="lesson-grid">{sport.exercises.map((l) => <article className="lesson-card" key={l.name}><h3>{l.name}</h3><p>{l.text}</p></article>)}</div>
      <h4>Vidéos de démonstration</h4>
      <ul className="video-list">{sport.videos.map((v) => <li key={v.title}><a href={videoUrl(v)} target="_blank" rel="noopener noreferrer"><PlayCircle size={16} /> {v.title} ↗</a></li>)}</ul>
      <p className="fineprint">Les vidéos s’ouvrent sur YouTube.</p></>,
    programmes: <ProgramList discipline={active} challengeEntries={challengeEntries} onCreate={onCreate} onGo={onGoChallenges} />,
    technique: <LocalVideoPose />,
    journal: <><SportNotebook entries={entries} onCreate={onCreate} /><SportProgress entries={entries} /></>,
    objectifs: <Goals discipline={active} entries={entries} onCreate={onCreate} />,
  };
  return <section className="sport-hub">
    <div className="pill-tabs" role="tablist">{(Object.keys(SPORTS) as Discipline[]).map((d) =>
      <button key={d} role="tab" aria-selected={active === d} className={active === d ? 'active' : ''} onClick={() => { setActive(d); setOpen(null); }}>{d}</button>)}</div>
    <HeroPhoto slot={'sport-' + active.toLowerCase()} tone={sport.tone} label={active}>
      <div className="hero-title"><h2>{active}</h2><span>{sport.tagline}</span></div>
    </HeroPhoto>
    <div className="sport-menu">{rows.map(({ id, label, icon: Icon }) => <div key={id} className="sport-row-wrap">
      <button className={'sport-row' + (open === id ? ' open' : '')} aria-expanded={open === id} onClick={() => setOpen(open === id ? null : id)}>
        <Icon size={20} /><span>{label}</span><ChevronRight size={17} className="chev" /></button>
      {open === id && <div className="sport-panel">{panel[id]}</div>}
    </div>)}</div>
  </section>;
}


function SessionIdeas({ discipline, onCreate }: { discipline: Discipline; onCreate: (input: EntryInput) => Promise<void> }) {
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const ideas = SPORT_SESSION_IDEAS.filter((idea) => idea.discipline === discipline.toLowerCase());
  if (!ideas.length) return null;
  const record = async (idea: (typeof SPORT_SESSION_IDEAS)[number]) => {
    setBusy(idea.id); setMessage('');
    try {
      const date = new Date().toLocaleDateString('en-CA');
      await onCreate({ module: 'sport', kind: 'session', title: idea.title, entry_date: date,
        data: { date, discipline, duration: String(idea.minutes), technique: idea.focus,
          feeling: 'Bien', note: 'Séance guidée : ' + idea.title } });
      setMessage('Séance enregistrée dans ton journal.');
    } catch { setMessage('Enregistrement impossible.'); }
    finally { setBusy(''); }
  };
  return <div>
    <h4>Idées de séances guidées</h4>
    <p className="muted">Choisis selon ton temps et ton énergie.</p>
    <div className="lesson-grid">{ideas.map((idea) => <article className="lesson-card" key={idea.id}>
      <h3>{idea.title}</h3><p>{idea.minutes} min environ · {idea.focus}</p>
      <details><summary>Déroulé de la séance</summary>
        <ol>{idea.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
      </details>
      <button className="button secondary" disabled={Boolean(busy)} onClick={() => void record(idea)}>
        {busy === idea.id ? 'Enregistrement…' : 'J’ai fait cette séance'}
      </button>
    </article>)}</div>
    {message && <p role="status">{message}</p>}
  </div>;
}

function ProgramList({ discipline, challengeEntries, onCreate, onGo }: { discipline: Discipline; challengeEntries: Entry[]; onCreate: (input: EntryInput) => Promise<void>; onGo: () => void }) {
  const ids: Record<Discipline, string[]> = { Pilates: ['pilates-30', 'gainage-30', 'abdos-30', 'fessiers-30'], Yoga: ['yoga-30'], Tennis: ['squats-30', 'bras-30', 'gainage-30'], Padel: ['squats-30', 'gainage-30', 'fessiers-30'], Workout: ['squats-30', 'abdos-30', 'fessiers-30', 'bras-30', 'gainage-30'] };
  const programs = TEMPLATES.filter((t) => ids[discipline].includes(t.id));
  const started = new Set(challengeEntries.map((e) => e.data.template));
  const [busy, setBusy] = useState('');
  if (!programs.length) return <p className="muted">Pas encore de programme {discipline.toLowerCase()} : crée ton propre défi dans Mes challenges.</p>;
  return <div className="program-list">{programs.map((t) => <div key={t.id} className="program-item">
    <div><strong>{t.title}</strong><span className="muted">{t.tagline}</span></div>
    {started.has(t.id)
      ? <button className="button ghost" onClick={onGo}>Voir</button>
      : <button className="button secondary" disabled={Boolean(busy)} onClick={async () => {
          setBusy(t.id);
          const start = new Date().toLocaleDateString('en-CA');
          try { await onCreate({ module: 'challenges', kind: 'challenge', title: t.title, entry_date: start, data: { template: t.id, category: t.category, discipline: t.discipline, days: '30', start, plan: t.tagline, progress: {} } }); onGo(); }
          finally { setBusy(''); }
        }}>{busy === t.id ? '…' : 'Commencer'}</button>}
  </div>)}</div>;
}

function Goals({ discipline, entries, onCreate }: { discipline: Discipline; entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const goals = entries.filter((e) => e.kind === 'goal' && e.data.discipline === discipline);
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);
  return <div className="form-stack">
    {goals.length ? <ul className="goal-list">{goals.map((g) => <li key={g.id}><Target size={15} /> <span>{g.title}</span>{g.entry_date && <small className="muted"> · avant le {new Date(g.entry_date + 'T12:00:00').toLocaleDateString('fr-FR')}</small>}</li>)}</ul>
      : <p className="muted">Aucun objectif {discipline.toLowerCase()} pour l’instant.</p>}
    <label>Nouvel objectif<input value={text} maxLength={160} onChange={(e) => setText(e.target.value)} placeholder={discipline === 'Tennis' ? 'Passer 7 services sur 10' : discipline === 'Padel' ? 'Réussir une sortie de vitre sur trois' : discipline === 'Workout' ? 'Faire 10 vraies pompes' : discipline === 'Pilates' ? 'Tenir 1 minute de planche' : 'Faire le chien tête en bas, talons plus bas'} /></label>
    <label>Échéance (facultatif)<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
    <button className="button secondary" disabled={busy || !text.trim()} onClick={async () => {
      setBusy(true);
      try { await onCreate({ module: 'sport', kind: 'goal', title: text.trim(), entry_date: date || null, data: { discipline, date } }); setText(''); setDate(''); }
      finally { setBusy(false); }
    }}>Ajouter l’objectif</button>
  </div>;
}

function Rules({ sections }: { sections: RuleSection[] }) {
  return <div className="rules">{sections.map((sec) => <details key={sec.titre} className="rule-block">
    <summary>{sec.titre}</summary>
    <ul>{sec.points.map((p) => <li key={p}>{p}</li>)}</ul>
  </details>)}</div>;
}

function WorkoutParcours({ entries, onCreate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const done = new Set(entries.filter((e) => e.kind === 'session' && typeof e.data.parcours === 'string').map((e) => String(e.data.parcours)));
  const next = WORKOUT_PATH.find((s) => !done.has(s.id));
  const [openId, setOpenId] = useState<string | null>(next?.id ?? null);
  const [busy, setBusy] = useState('');
  const record = async (step: WorkoutStep) => {
    setBusy(step.id);
    try {
      const date = new Date().toLocaleDateString('en-CA');
      await onCreate({ module: 'sport', kind: 'session', title: 'Workout · ' + step.titre, entry_date: date,
        data: { date, discipline: 'Workout', duration: String(step.minutes), technique: step.focus, feeling: 'Bien', parcours: step.id, note: 'Parcours workout, niveau ' + step.niveau } });
      const after = WORKOUT_PATH[WORKOUT_PATH.indexOf(step) + 1];
      setOpenId(after?.id ?? null);
    } finally { setBusy(''); }
  };
  return <div className="workout-path">
    <p className="muted">{done.size} / {WORKOUT_PATH.length} séances faites. Fais 2 à 3 séances par semaine, avec un jour de repos entre deux.</p>
    <div className="progress-track"><div style={{ width: (done.size / WORKOUT_PATH.length * 100) + '%' }} /></div>
    {[1, 2, 3, 4].map((n) => <section key={n} className="workout-level">
      <h4>Niveau {n} · {NIVEAUX[n]}</h4>
      {WORKOUT_PATH.filter((s) => s.niveau === n).map((step) => {
        const isDone = done.has(step.id); const isOpen = openId === step.id;
        return <article key={step.id} className={'workout-step' + (isDone ? ' done' : '') + (next?.id === step.id ? ' next' : '')}>
          <button className="workout-head" aria-expanded={isOpen} onClick={() => setOpenId(isOpen ? null : step.id)}>
            <span className="workout-dot">{isDone ? <Check size={14} /> : WORKOUT_PATH.indexOf(step) + 1}</span>
            <span className="workout-title"><strong>{step.titre}</strong><small>{step.minutes} min · {step.focus}</small></span>
            <ChevronRight size={17} className="chev" />
          </button>
          {isOpen && <div className="workout-body">
            <h5>Échauffement · 5 min</h5><ul>{step.echauffement.map((x) => <li key={x}>{x}</li>)}</ul>
            <h5>Circuit · {step.tours} tours · {step.recup}</h5>
            <ol className="workout-moves">{step.circuit.map((m) => <li key={m.nom}><strong>{m.nom}</strong> <span className="dose">{m.dose}</span><p>{m.conseil}</p></li>)}</ol>
            <h5>Retour au calme</h5><ul>{step.retourCalme.map((x) => <li key={x}>{x}</li>)}</ul>
            {!isDone && <button className="button primary" disabled={Boolean(busy)} onClick={() => void record(step)}>{busy === step.id ? 'Enregistrement…' : 'J’ai fait cette séance'}</button>}
          </div>}
        </article>;
      })}
    </section>)}
  </div>;
}
