import { useState, type ReactNode } from 'react';
import { CalendarPlus, Check, Sparkles, Target } from 'lucide-react';
import type { EntryInput } from '../lib/cloud';
import { askAssistant, parseSteps, type Turn } from '../lib/assistant';
import { getIntegrationPrefs } from '../lib/integrations';
import { addDays, isoOf } from '../lib/rituals';

export type Coach = { pistes: string[]; question: string };
type Debrief = { mood: string; win: string; different: string; question: string; answer: string; letgo: string };

/** Relances sans IA, sous la question du soir : on les ajoute à sa réponse pour creuser. */
export const RELANCES = ['Comment le refaire demain ?', 'Qu’est-ce qui l’a rendu possible ?', 'Quelle petite action pour demain ?'];

export const COACH_FORMAT = 'Réponds uniquement en JSON : {"pistes":["…","…","…"],"question":"…"}';
const COACH_STYLE = 'Chaque piste : une phrase courte (moins de 110 caractères), concrète, au féminin, en me tutoyant. Ajoute une question de relance pour m’aider à aller plus loin. Pas de diagnostic ni de jargon. ';

/** Lit la réponse de l'assistant : JSON attendu, sinon une piste par ligne. */
export function parseCoach(raw: string): Coach {
  const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
  if (a >= 0 && b > a) {
    try {
      const v = JSON.parse(raw.slice(a, b + 1)) as { pistes?: unknown; question?: unknown };
      const pistes = Array.isArray(v.pistes) ? v.pistes.filter((x): x is string => typeof x === 'string').map((x) => x.trim().slice(0, 180)).filter(Boolean).slice(0, 4) : [];
      if (pistes.length) return { pistes, question: typeof v.question === 'string' ? v.question.trim().slice(0, 200) : '' };
    } catch { /* lignes */ }
  }
  return { pistes: parseSteps(raw).slice(0, 4), question: '' };
}

/** Message de coaching : consigne, style commun et faits, le tout sous 1 200 caractères. */
export const coachMessage = (ask: string, facts: string) => (ask + ' ' + COACH_STYLE + COACH_FORMAT + '\n' + facts).slice(0, 1190);

/** Le message du soir : uniquement le débriefing de ce soir, raccourci. */
export function coachPrompt(d: Debrief): string {
  const facts = [
    d.mood && 'Humeur du jour : ' + d.mood,
    d.win && 'Ma victoire : ' + d.win.slice(0, 220),
    d.different && 'Ce que je ferais autrement : ' + d.different.slice(0, 220),
    d.answer && `${d.question} ${d.answer.slice(0, 260)}`,
    d.letgo && 'Ce que je dépose : ' + d.letgo.slice(0, 160),
  ].filter(Boolean).join('\n');
  return coachMessage('Tu es une coach bienveillante et très concrète. Voici mon débriefing du soir. Propose 3 pistes pour demain : comment refaire ce qui m’a fait du bien, comment améliorer ce que je ferais autrement, et une toute petite action facile.', facts);
}

/** Carte de coach réutilisable : demande, pistes avec actions, question de relance et nouvelle réponse. */
export function CoachCard({ title, intro, prompt, ready, startLabel, coach, onCoach, actions }: {
  title: string; intro: string; prompt: () => string; ready: boolean; startLabel: string;
  coach: Coach | null; onCoach: (c: Coach) => void; actions: (piste: string) => ReactNode;
}) {
  const enabled = getIntegrationPrefs().assistant;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Turn[]>([]);
  const [reply, setReply] = useState('');
  const ask = async (message: string, past: Turn[]) => {
    setBusy(true); setError('');
    try {
      const raw = await askAssistant(message, { history: past });
      const c = parseCoach(raw);
      if (!c.pistes.length) throw new Error();
      onCoach(c); setHistory([...past, { role: 'user', content: message }, { role: 'assistant', content: raw }]); setReply('');
    } catch { setError('Pas de réponse de l’assistant pour l’instant. Réessaie dans un moment.'); }
    finally { setBusy(false); }
  };
  const start = () => { setHistory([]); void ask(prompt(), []); };
  const answer = () => { const r = reply.trim(); if (r) void ask('Ma réponse à ta question : ' + r.slice(0, 500) + '\nPropose 3 nouvelles pistes adaptées. ' + COACH_FORMAT, history); };

  return <section className="ritual-card coach-card">
    <p className="ritual-label"><Sparkles size={16} /> {title}</p>
    {!coach && <>
      <p className="muted small">{enabled ? intro : 'Active l’assistant IA dans Paramètres › Intégrations pour recevoir des pistes.'}</p>
      <button className="button soft" disabled={!enabled || busy || !ready} onClick={start}>{busy ? 'Je réfléchis…' : startLabel}</button>
    </>}
    {coach && <>
      <ol className="coach-list">{coach.pistes.map((p) => <li key={p}><span>{p}</span><span className="coach-actions">{actions(p)}</span></li>)}</ol>
      {coach.question && <div className="coach-follow">
        <p className="evening-q">{coach.question}</p>
        <textarea className="soft-input" rows={2} value={reply} placeholder="Ta réponse…" onChange={(e) => setReply(e.target.value)} />
        <button className="button soft" disabled={!enabled || busy || !reply.trim()} onClick={answer}>{busy ? 'Je réfléchis…' : 'Répondre et affiner'}</button>
      </div>}
      <button className="link-btn small" disabled={!enabled || busy || !ready} onClick={start}>Recommencer</button>
    </>}
    {error && <p className="error" role="alert">{error}</p>}
  </section>;
}

/** Bouton « Ajouter à demain » : crée la piste comme tâche dans l'agenda du lendemain. */
export function AddTomorrow({ text, date, onCreate }: { text: string; date?: string; onCreate: (i: EntryInput) => Promise<void> }) {
  const [done, setDone] = useState(false);
  const next = addDays(date ?? isoOf(new Date()), 1);
  return <button className="link-btn small" disabled={done} onClick={async () => {
    await onCreate({ module: 'quotidien', kind: 'task', title: text.slice(0, 170), entry_date: next, data: { date: next, priority: 'Normale' } }); setDone(true);
  }}>{done ? <><Check size={14} /> Dans l’agenda de demain</> : <><CalendarPlus size={14} /> Ajouter à demain</>}</button>;
}

/** Mon coach du soir : pistes pour demain à partir du débriefing, à ajouter à l'agenda ou en intention, puis relance. */
export function EveningCoach({ date, debrief, coach, onCoach, onIntention, onCreate }: {
  date: string; debrief: Debrief; coach: Coach | null; onCoach: (c: Coach) => void;
  onIntention: (text: string) => void; onCreate: (i: EntryInput) => Promise<void>;
}) {
  const hasContent = Boolean(debrief.win || debrief.different || debrief.answer || debrief.letgo);
  return <CoachCard title="Mon coach du soir" coach={coach} onCoach={onCoach} ready={hasContent}
    intro="À partir de tes réponses de ce soir, des pistes pour refaire ce qui t’a fait du bien et améliorer le reste demain. Ton débriefing n’est envoyé à l’assistant que quand tu appuies."
    startLabel={hasContent ? 'Des pistes pour demain' : 'Écris d’abord ton débriefing'} prompt={() => coachPrompt(debrief)}
    actions={(p) => <><AddTomorrow text={p} date={date} onCreate={onCreate} />
      <button className="link-btn small" onClick={() => onIntention(p)}><Target size={14} /> Mon intention</button></>} />;
}
