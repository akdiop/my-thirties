import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isDoneOn, occursOn, todayIso, toggledData } from '../lib/day';
import { Check22 } from '../ui/kit';

/* Idées de tâches prioritaires (reprises de l'ancienne carte « Mes 3 priorités »). */
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

export const TASK_TAGS = ['Maison', 'Santé', 'Personnel', 'Travail'];
type Filter = 'toutes' | 'jour' | 'avenir';
const dateOf = (e: Entry) => String(e.data.date ?? e.entry_date ?? '');
const shortDay = (iso: string, today: string) => (iso === today ? 'Aujourd’hui' : iso < today ? 'En retard' : new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }));

/** Les tâches du quotidien qui m'attendent, triées : en retard et aujourd'hui d'abord, puis à venir (les faites du jour restent visibles). */
export function taskBuckets(entries: Entry[], today: string) {
  const tasks = entries.filter((e) => e.kind === 'task' && e.module === 'quotidien');
  const repeats = (e: Entry) => ['Quotidienne', 'Hebdomadaire'].includes(String(e.data.frequency));
  const open = tasks.filter((e) => !isDoneOn(e, today) && dateOf(e) && (!repeats(e) || occursOn(e, new Date(today + 'T12:00:00'))));
  const doneToday = tasks.filter((e) => isDoneOn(e, today) && (dateOf(e) === today || e.data.frequency));
  const prio = (e: Entry) => (e.data.priority === 'Haute' ? 0 : e.data.priority === 'Basse' ? 2 : 1);
  const byDate = (a: Entry, b: Entry) => dateOf(a).localeCompare(dateOf(b)) || String(a.data.time ?? '99').localeCompare(String(b.data.time ?? '99'));
  const byPrio = (a: Entry, b: Entry) => prio(a) - prio(b) || byDate(a, b);
  const jour = open.filter((e) => dateOf(e) <= today).sort(byPrio), avenir = open.filter((e) => dateOf(e) > today).sort(byDate);
  return { jour, avenir, doneToday, toutes: [...jour, ...avenir] };
}

/** Accueil : ajouter une tâche en une ligne, avec une étiquette, et la cocher sans changer d'écran. */
export function TaskQuick({ entries, onCreate, onUpdate, onOpenList }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; onOpenList: () => void }) {
  const today = todayIso();
  const [title, setTitle] = useState(''), [tag, setTag] = useState(''), [filter, setFilter] = useState<Filter>('jour'), [busy, setBusy] = useState(false);
  const b = taskBuckets(entries, today);
  const shown = (filter === 'jour' ? [...b.jour, ...b.doneToday] : filter === 'avenir' ? b.avenir : [...b.toutes, ...b.doneToday]).slice(0, 6);
  const add = async () => {
    const t = title.trim(); if (!t) return;
    setBusy(true);
    try { await onCreate({ module: 'quotidien', kind: 'task', title: t.slice(0, 120), entry_date: today, data: { date: today, priority: 'Normale', ...(tag ? { context: tag } : {}) } }); setTitle(''); }
    finally { setBusy(false); }
  };
  return <section className="soft-card task-quick" aria-label="Mes tâches">
    <div className="tq-head"><strong>Aujourd’hui</strong><small>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</small></div>
    <form className="tq-add" onSubmit={(e) => { e.preventDefault(); void add(); }}>
      <input value={title} maxLength={120} placeholder="Que dois-tu faire ?" aria-label="Nouvelle tâche" onChange={(e) => setTitle(e.target.value)} />
      <button className="tq-plus" type="submit" disabled={busy || !title.trim()} aria-label="Ajouter la tâche"><Plus size={20} /></button>
    </form>
    <div className="tq-tags">{TASK_TAGS.map((t) => <button key={t} type="button" className={'tq-tag' + (tag === t ? ' on' : '')} aria-pressed={tag === t} onClick={() => setTag(tag === t ? '' : t)}>{t}</button>)}</div>
    <div className="tq-filters">{([['toutes', 'Toutes', b.toutes.length], ['jour', 'Aujourd’hui', b.jour.length], ['avenir', 'À venir', b.avenir.length]] as const).map(([v, l, n]) =>
      <button key={v} className={'chip' + (filter === v ? ' on' : '')} aria-pressed={filter === v} onClick={() => setFilter(v)}>{l} {n}</button>)}</div>
    {shown.length ? <div className="tq-list">{shown.map((e) => { const done = isDoneOn(e, today), d = dateOf(e);
      return <div key={e.id} className={'tq-row' + (done ? ' done' : '')}>
        <Check22 checked={done} label={e.title} onChange={(v) => void onUpdate(e, toggledData(e, today, v))} />
        <span className="tq-title">{e.title}</span>
        <small className={d < today && !done ? 'late' : ''}>{done ? 'Fait' : e.data.time ? String(e.data.time) : shortDay(d, today)}</small>
        {e.data.priority === 'Haute' && !done && <span className="tq-pill prio">Priorité</span>}
        {typeof e.data.context === 'string' && e.data.context && <span className="tq-pill">{e.data.context}</span>}
      </div>; })}</div>
      : <p className="muted small">{filter === 'avenir' ? 'Rien de prévu pour les jours qui viennent.' : 'Rien à faire pour l’instant.'}</p>}
    <select className="prio-select" value="" aria-label="Ajouter une priorité" onChange={(ev) => { const v = ev.target.value; if (v) void onCreate({ module: 'quotidien', kind: 'task', title: v, entry_date: today, data: { date: today, priority: 'Haute' } }); }}>
      <option value="">+ Une priorité parmi des idées…</option>
      {Object.entries(PRIORITY_IDEAS).map(([cat, list]) => <optgroup key={cat} label={cat}>{list.filter((x) => !b.jour.some((e) => e.title === x)).map((x) => <option key={x} value={x}>{x}</option>)}</optgroup>)}
    </select>
    <div className="tq-foot"><small>{b.jour.length} restante{b.jour.length > 1 ? 's' : ''} · {b.doneToday.length} faite{b.doneToday.length > 1 ? 's' : ''}</small>
      <button className="link-btn small" onClick={onOpenList}>Voir la liste ›</button></div>
  </section>;
}
