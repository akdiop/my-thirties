import { useMemo, useState } from 'react';
import { Check, Plus, Sparkles } from 'lucide-react';
import { cloud, type Entry, type EntryInput } from '../lib/cloud';
import { useIntegrationPrefs } from '../lib/integrations';
import { addDays, habitStreak, isoOf } from '../lib/rituals';
import { GOAL_KIND, goalProgress, goalSteps, VISION_KIND } from '../lib/growth';
import { fmt, mainCurrency, monthReport } from '../lib/money';
import { moodOn } from '../screens/Review';
import { sleepHours } from '../screens/Sleep';

type Source = 'agenda' | 'habits' | 'goals' | 'mood' | 'money' | 'kitchen' | 'supplements';
type Action = { type: 'task' | 'event' | 'habit' | 'expense'; title: string; date?: string; time?: string; amount?: number; currency?: string; category?: string };

const SOURCES: { id: Source; label: string }[] = [
  { id: 'agenda', label: 'Mon agenda (7 jours)' },
  { id: 'habits', label: 'Mes habitudes et séries' },
  { id: 'goals', label: 'Mes objectifs et ma vision' },
  { id: 'mood', label: 'Humeur et sommeil (14 jours, sans le texte du journal)' },
  { id: 'money', label: 'Mon budget du mois' },
  { id: 'kitchen', label: 'Mes repas et recettes' },
  { id: 'supplements', label: 'Mes compléments' },
];

const IDEAS: { label: string; prompt: string; sources: Source[] }[] = [
  { label: 'Planifier ma semaine', prompt: 'Aide-moi à organiser ma semaine de façon réaliste, avec des moments de repos. Propose les tâches à ajouter.', sources: ['agenda', 'habits', 'goals'] },
  { label: 'Que cuisiner ce soir ?', prompt: 'Que puis-je cuisiner ce soir, simplement, avec mes recettes ?', sources: ['kitchen'] },
  { label: 'Message difficile', prompt: 'Aide-moi à écrire un message délicat, avec douceur et fermeté. Voici la situation : ', sources: [] },
  { label: 'Me remotiver', prompt: 'Je manque de motivation aujourd’hui. Aide-moi à repartir avec 3 petits pas concrets.', sources: ['habits', 'goals', 'mood'] },
  { label: 'Préparer un voyage', prompt: 'Aide-moi à préparer un voyage : liste des préparatifs et rétroplanning. Destination et dates : ', sources: ['agenda', 'money'] },
  { label: 'Point sur mes objectifs', prompt: 'Fais le point sur mes objectifs : où j’en suis, ce qui bloque, et la prochaine étape pour chacun.', sources: ['goals', 'habits'] },
  { label: 'Point budget', prompt: 'Analyse mon budget du mois et propose 3 ajustements simples.', sources: ['money'] },
  { label: 'Mieux dormir', prompt: 'Regarde mon humeur et mon sommeil récents et propose une petite routine du soir.', sources: ['mood'] },
];

const short = (s: unknown, n = 80) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);

/** Construit le contexte texte envoyé à l'assistant, uniquement avec les rubriques cochées. */
export function buildContext(entries: Entry[], on: Set<Source>, today = isoOf(new Date())): string {
  const parts: string[] = [];
  if (on.has('agenda')) {
    const end = addDays(today, 7);
    const items = entries.filter((e) => e.module === 'quotidien' && ['task', 'event', 'routine'].includes(e.kind) && e.entry_date && e.entry_date >= today && e.entry_date <= end && e.data.completed !== true)
      .sort((a, b) => (a.entry_date! + String(a.data.time ?? '')).localeCompare(b.entry_date! + String(b.data.time ?? ''))).slice(0, 25)
      .map((e) => `- ${e.entry_date}${e.data.time ? ' ' + short(e.data.time, 5) : ''} · ${short(e.title)}`);
    parts.push('Agenda des 7 prochains jours :\n' + (items.join('\n') || '- rien de prévu'));
  }
  if (on.has('habits')) {
    const items = entries.filter((e) => e.kind === 'habit').slice(0, 20).map((e) => {
      const done = (e.data.done ?? {}) as Record<string, boolean>;
      const week = Array.from({ length: 7 }, (_, i) => addDays(today, -i)).filter((d) => done[d]).length;
      return `- ${short(e.title)} : série ${habitStreak(e, today)} j, ${week}/7 cette semaine${done[today] ? ', fait aujourd’hui' : ''}`;
    });
    parts.push('Habitudes :\n' + (items.join('\n') || '- aucune'));
  }
  if (on.has('goals')) {
    const goals = entries.filter((e) => e.kind === GOAL_KIND && e.data.archived !== true).slice(0, 10).map((e) => {
      const next = goalSteps(e).find((s) => !s.done);
      return `- ${short(e.title)} (${Math.round(goalProgress(e) * 100)} %)${e.data.domain ? ' · ' + short(e.data.domain, 30) : ''}${next ? ' · prochaine étape : ' + short(next.text) : ''}`;
    });
    const v = entries.find((e) => e.kind === VISION_KIND);
    const vision = v ? ['words', 'year1', 'year5'].filter((k) => v.data[k]).map((k) => `${k === 'words' ? 'Mes mots' : k === 'year1' ? 'Dans 1 an' : 'Dans 5 ans'} : ${short(v.data[k], 300)}`) : [];
    parts.push('Objectifs :\n' + (goals.join('\n') || '- aucun') + (vision.length ? '\nVision :\n' + vision.join('\n') : ''));
  }
  if (on.has('mood')) {
    const days = Array.from({ length: 14 }, (_, i) => addDays(today, -i));
    const lines = days.map((d) => {
      const mood = moodOn(entries, d);
      const night = entries.find((e) => e.kind === 'sommeil' && e.entry_date === d);
      const h = night ? sleepHours(night) : 0;
      return mood || h ? `- ${d} : ${mood || '—'}${h ? ', ' + h.toFixed(1).replace('.', ',') + ' h de sommeil' : ''}` : '';
    }).filter(Boolean);
    parts.push('Humeur et sommeil (14 jours) :\n' + (lines.join('\n') || '- rien de noté'));
  }
  if (on.has('money')) {
    const cur = mainCurrency(entries), r = monthReport(entries, today.slice(0, 7), cur);
    parts.push(`Budget du mois (${cur}) : dépensé ${fmt(r.spent, cur)}${r.budget ? ' sur ' + fmt(r.budget, cur) + ' prévus' : ''}${r.income ? ', revenus ' + fmt(r.income, cur) : ''}.`
      + (r.categories.length ? '\nPar catégorie : ' + r.categories.slice(0, 8).map((c) => `${c.name} ${fmt(c.total, cur)}`).join(', ') : ''));
  }
  if (on.has('kitchen')) {
    const recipes = entries.filter((e) => e.kind === 'recipe').slice(0, 40).map((e) => short(e.title, 50));
    const meals = entries.filter((e) => e.kind === 'meal' && e.entry_date && e.entry_date >= addDays(today, -3) && e.entry_date <= addDays(today, 7))
      .sort((a, b) => a.entry_date!.localeCompare(b.entry_date!)).slice(0, 15).map((e) => `- ${e.entry_date} · ${short(e.title)}`);
    parts.push('Mes recettes : ' + (recipes.join(', ') || 'aucune') + '\nRepas prévus :\n' + (meals.join('\n') || '- aucun'));
  }
  if (on.has('supplements')) {
    const items = entries.filter((e) => e.kind === 'complement').slice(0, 12).map((e) => `- ${short(e.title, 50)}${e.data.dose ? ' · ' + short(e.data.dose, 30) : ''}${e.data.time ? ' à ' + short(e.data.time, 5) : ''}${Number(e.data.days) ? ' · cure de ' + Number(e.data.days) + ' j' : ''}`);
    parts.push('Compléments :\n' + (items.join('\n') || '- aucun'));
  }
  return parts.join('\n\n').slice(0, 6000);
}

const DAY = /^\d{4}-\d{2}-\d{2}$/, TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Sépare la réponse et les propositions d'ajout (ligne « ACTIONS: [...] »), en ignorant tout ce qui est mal formé. */
export function splitAnswer(raw: string): { text: string; actions: Action[] } {
  const i = raw.search(/\n?\s*ACTIONS\s*:/);
  if (i < 0) return { text: raw.trim(), actions: [] };
  const text = raw.slice(0, i).trim();
  const rest = raw.slice(i).replace(/^\s*ACTIONS\s*:\s*/, '').replace(/```(json)?/g, '').trim();
  let list: unknown;
  try { list = JSON.parse(rest.slice(rest.indexOf('['), rest.lastIndexOf(']') + 1)); } catch { return { text, actions: [] }; }
  if (!Array.isArray(list)) return { text, actions: [] };
  const actions = list.slice(0, 6).flatMap((a): Action[] => {
    if (!a || typeof a !== 'object') return [];
    const x = a as Record<string, unknown>;
    const title = short(x.title, 120);
    if (!title || !['task', 'event', 'habit', 'expense'].includes(String(x.type))) return [];
    const date = typeof x.date === 'string' && DAY.test(x.date) ? x.date : undefined;
    const time = typeof x.time === 'string' && TIME.test(x.time) ? x.time : undefined;
    if (x.type === 'expense') {
      const amount = Number(x.amount);
      if (!Number.isFinite(amount) || amount <= 0) return [];
      return [{ type: 'expense', title, date, amount, currency: typeof x.currency === 'string' && /^[A-Z]{3}$/.test(x.currency) ? x.currency : 'XOF', category: short(x.category, 40) || 'Autres' }];
    }
    return [{ type: x.type as Action['type'], title, date, time }];
  });
  return { text, actions };
}

const describe = (a: Action) => a.type === 'habit' ? 'Habitude' : a.type === 'expense' ? `Dépense · ${fmt(a.amount!, a.currency!)}${a.date ? ' · ' + a.date : ''}`
  : `${a.type === 'event' ? 'Événement' : 'Tâche'}${a.date ? ' · ' + new Date(a.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : ''}${a.time ? ' · ' + a.time : ''}`;

function toInput(a: Action, today: string): EntryInput {
  const date = a.date ?? today;
  if (a.type === 'habit') return { module: 'quotidien', kind: 'habit', title: a.title, entry_date: null, data: { freq: 'daily', done: {}, icon: 'sprout', tint: 'sauge' } };
  if (a.type === 'expense') return { module: 'finances', kind: 'expense', title: a.title, entry_date: date, data: { date, amount: a.amount, currency: a.currency, category: a.category } };
  return { module: 'quotidien', kind: a.type, title: a.title, entry_date: date, data: { date, ...(a.time ? { time: a.time } : {}), ...(a.type === 'task' ? { priority: 'Normale' } : {}) } };
}

/** Mon assistant : il ne voit que les rubriques cochées, propose des idées prêtes et des ajouts que je valide un par un. */
export function PersonalAssistant({ entries, onCreate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const { prefs } = useIntegrationPrefs();
  const today = isoOf(new Date());
  const [message, setMessage] = useState('');
  const [on, setOn] = useState<Set<Source>>(new Set());
  const [answer, setAnswer] = useState<{ text: string; actions: Action[] } | null>(null);
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const context = useMemo(() => buildContext(entries, on, today), [entries, on, today]);
  const toggle = (s: Source) => setOn((cur) => { const n = new Set(cur); if (n.has(s)) n.delete(s); else n.add(s); return n; });

  const ask = async () => {
    if (!cloud || !prefs.assistant || message.trim().length < 2) return;
    setBusy(true); setAnswer(null); setStatus(''); setAdded(new Set());
    try {
      const { data, error } = await cloud.functions.invoke('personal-assistant', { body: { message: message.trim().slice(0, 1200), actions: true, ...(context ? { context } : {}) } });
      if (error) throw error;
      if (!data || typeof data.answer !== 'string') throw new Error('Assistant non configuré.');
      setAnswer(splitAnswer(data.answer));
    } catch { setStatus('Assistant indisponible pour le moment. Réessaie un peu plus tard.'); }
    finally { setBusy(false); }
  };
  const add = async (a: Action, i: number) => {
    try { await onCreate(toInput(a, today)); setAdded((s) => new Set(s).add(i)); }
    catch { setStatus('Ajout impossible pour le moment.'); }
  };

  return <section className="tool-card ai-assistant">
    <h3><Sparkles size={18} /> Mon assistant</h3>
    {!prefs.assistant && <p className="privacy-hint">L'assistant est désactivé. Active-le dans Profil → Centre de confidentialité.</p>}
    <div className="chip-row">{IDEAS.map((idea) => <button key={idea.label} className="chip" disabled={!prefs.assistant}
      onClick={() => { setMessage(idea.prompt); setOn(new Set(idea.sources)); }}>{idea.label}</button>)}</div>
    <label>Ma question<textarea rows={3} maxLength={1200} value={message} onChange={(e) => setMessage(e.target.value)}
      placeholder="Par exemple : aide-moi à organiser ma semaine." /></label>
    <fieldset className="assistant-sources"><legend>Ce que l’assistant peut voir</legend>
      {SOURCES.map((s) => <label key={s.id} className="checklist-item"><input type="checkbox" checked={on.has(s.id)} disabled={!prefs.assistant} onChange={() => toggle(s.id)} />{s.label}</label>)}
      {context ? <details><summary>Voir ce qui sera envoyé ({context.length} caractères)</summary><pre className="context-preview">{context}</pre></details>
        : <p className="fineprint">Rien n’est coché : seule ta question est envoyée.</p>}
    </fieldset>
    <button className="button primary" disabled={busy || !prefs.assistant || message.trim().length < 2} onClick={() => void ask()}>{busy ? 'Réflexion en cours…' : 'Demander'}</button>
    {answer && <div className="ai-answer" role="status"><strong>Réponse</strong><p>{answer.text}</p>
      {answer.actions.length > 0 && <div className="assistant-actions"><p className="ritual-label">Ajouts proposés</p>
        {answer.actions.map((a, i) => <div key={i} className="assistant-action"><div><strong>{a.title}</strong><small>{describe(a)}</small></div>
          {added.has(i) ? <span className="added"><Check size={16} /> Ajouté</span>
            : <button className="button secondary small" onClick={() => void add(a, i)}><Plus size={14} /> Ajouter</button>}</div>)}
        {answer.actions.length > 1 && added.size < answer.actions.length && <button className="link-btn small" onClick={() => void (async () => { for (const [i, a] of answer.actions.entries()) if (!added.has(i)) await add(a, i); })()}>Tout ajouter</button>}
      </div>}
    </div>}
    {status && <p role="status">{status}</p>}
    <p className="fineprint">Rien n’est ajouté sans ton clic.</p>
  </section>;
}
