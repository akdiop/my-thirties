import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { searchEntries } from '../lib/search';
import { modules } from '../modules';

export type SearchTarget = { screen: string; entry?: Entry; day?: string };
/** Où ouvrir une entrée trouvée : l'écran qui la montre, sinon la fiche de son espace. */
export function targetOf(e: Entry): SearchTarget {
  const k = e.kind;
  if (k === 'daily') return { screen: 'myday', day: String(e.entry_date ?? '') };
  const map: Record<string, string> = { note: 'notes', task: 'agenda', event: 'agenda', appointment: 'agenda', routine: 'agenda', habit: 'habits', lecture: 'lectures', series: 'culture',
    gratitude_jour: 'gratitude', tcc: 'tcc', hsp: 'hsp', ressenti: 'ressenti', voeu: 'carnet', carnet_page: 'carnet', proche: 'proches', envie: 'envies', complement: 'complements', wird: 'spiritualite' };
  return map[k] ? { screen: map[k] } : { screen: 'entry', entry: e };
}
const GROUPS: [string, (e: Entry) => boolean][] = [
  ['Journal', (e) => ['note', 'daily', 'gratitude_jour', 'ressenti', 'carnet_page', 'voeu'].includes(e.kind)],
  ['Tâches et agenda', (e) => ['task', 'event', 'appointment', 'routine'].includes(e.kind)],
  ['Lectures, séries, envies', (e) => ['lecture', 'series', 'envie'].includes(e.kind)],
  ['Le reste', () => true],
];
const LABEL: Record<string, string> = { note: 'Note', daily: 'Mon jour', gratitude_jour: 'Gratitude', ressenti: 'Ressenti', task: 'Tâche', event: 'Événement', habit: 'Habitude', lecture: 'Lecture', series: 'Série', tcc: 'Exercice TCC', hsp: 'Hypersensibilité' };

/** Rechercher partout : journal, tâches, notes, lectures, séries… sans accents ni majuscules. */
export function GlobalSearch({ entries, onOpen }: { entries: Entry[]; onOpen: (t: SearchTarget) => void }) {
  const [q, setQ] = useState('');
  const found = useMemo(() => searchEntries(entries.filter((e) => !['reglages_accueil', 'reglages_integrations', 'profile', 'photo', 'hidden'].includes(e.kind)), q, 60), [entries, q]);
  const used = new Set<string>();
  const groups = GROUPS.map(([name, test]) => ({ name, items: found.filter((f) => !used.has(f.e.id) && test(f.e) && used.add(f.e.id)) })).filter((g) => g.items.length);
  return <div className="screen search-screen">
    <header className="tab-head"><h1>Rechercher</h1><p>Dans tout ton journal, tes tâches et tes listes</p></header>
    <label className="search-box"><Search size={18} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Un mot, un nom, une idée…" /></label>
    {q.trim().length >= 2 && !found.length && <p className="muted">Rien trouvé pour « {q.trim()} ».</p>}
    {groups.map((g) => <section key={g.name} className="stack-8"><p className="ritual-label">{g.name} · {g.items.length}</p>
      {g.items.map(({ e, snippet }) => <button key={e.id} className="row-plain search-hit" onClick={() => onOpen(targetOf(e))}>
        <span>{e.title}</span><small>{LABEL[e.kind] ?? modules.find((m) => m.id === e.module)?.name ?? ''}{e.entry_date ? ' · ' + new Date(e.entry_date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}</small>
        <span className="muted small">{snippet}</span></button>)}</section>)}
  </div>;
}
