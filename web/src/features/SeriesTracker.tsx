import { useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';

type SeriesStatus = 'À regarder' | 'En cours' | 'En pause' | 'Terminée';
const STATUSES: SeriesStatus[] = ['À regarder', 'En cours', 'En pause', 'Terminée'];
const positiveInt = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 999 ? n : fallback;
};

export function SeriesTracker({ entries, onCreate, onUpdate }: {
  entries: Entry[];
  onCreate: (input: EntryInput) => Promise<void>;
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const series = entries.filter((e) => e.kind === 'series' && e.title.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')));
  const add = async () => {
    if (!title.trim() || busy) return;
    setBusy(true); setFeedback('');
    try {
      await onCreate({ module: 'passions', kind: 'series', title: title.trim().slice(0, 150), entry_date: null,
        data: { season: 1, episode: 1, status: 'À regarder', rating: '', notes: '' } });
      setTitle(''); setFeedback('Série ajoutée.');
    } catch { setFeedback('Impossible d’ajouter la série.'); }
    finally { setBusy(false); }
  };
  const update = async (entry: Entry, patch: Record<string, unknown>) => {
    setBusy(true); setFeedback('');
    try { await onUpdate(entry, { ...entry.data, ...patch }); }
    catch { setFeedback('Impossible de sauvegarder la progression.'); }
    finally { setBusy(false); }
  };
  return <section className="tool-card">
    <h3>Mes séries TV</h3>
    <p className="muted">Ta liste à regarder, ta progression par saison et épisode, et tes notes. Aucune donnée de visionnage n’est transmise à une plateforme de streaming.</p>
    <div className="planner-form">
      <label>Ajouter une série<input maxLength={150} value={title} placeholder="Titre de la série" onChange={(e) => setTitle(e.target.value)} /></label>
      <button className="button secondary" disabled={!title.trim() || busy} onClick={() => void add()}>Ajouter</button>
    </div>
    <label>Rechercher dans mes séries<input type="search" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
    {!series.length && <p className="muted">Aucune série enregistrée pour cette recherche.</p>}
    <div className="lesson-grid">{series.map((entry) => {
      const season = positiveInt(entry.data.season, 1);
      const episode = positiveInt(entry.data.episode, 1);
      const status = STATUSES.includes(entry.data.status as SeriesStatus) ? entry.data.status as SeriesStatus : 'À regarder';
      return <article className="lesson-card" key={entry.id}>
        <h3>{entry.title}</h3>
        <label>Statut<select disabled={busy} value={status} onChange={(e) => void update(entry, { status: e.target.value })}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select></label>
        <div className="recipe-filters">
          <label>Saison<input type="number" min={1} max={999} value={season} disabled={busy}
            onChange={(e) => { const n = Number(e.target.value); if (Number.isInteger(n) && n >= 1 && n <= 999) void update(entry, { season: n, episode: 1 }); }} /></label>
          <label>Prochain épisode<input type="number" min={1} max={999} value={episode} disabled={busy}
            onChange={(e) => { const n = Number(e.target.value); if (Number.isInteger(n) && n >= 1 && n <= 999) void update(entry, { episode: n }); }} /></label>
        </div>
        <button className="button secondary" disabled={busy || episode >= 999} onClick={() => void update(entry, { episode: episode + 1, status: 'En cours' })}>Épisode vu · suivant</button>
        <details><summary>Mon avis et mes notes</summary>
          <SeriesNotes key={entry.id} notes={String(entry.data.notes ?? '')} disabled={busy} onSave={(notes) => update(entry, { notes })} />
        </details>
      </article>;
    })}</div>
    {feedback && <p role="status">{feedback}</p>}
  </section>;
}

function SeriesNotes({ notes, disabled, onSave }: { notes: string; disabled: boolean; onSave: (notes: string) => Promise<void> }) {
  const [value, setValue] = useState(notes);
  return <><label>Mes notes<textarea rows={3} maxLength={2000} value={value} onChange={(e) => setValue(e.target.value)} /></label>
    <button className="button secondary" disabled={disabled || value === notes} onClick={() => void onSave(value)}>Enregistrer mes notes</button></>;
}
