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
import { Minus, Plus, Star, Tv } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { Bar, Segmented } from '../ui/kit';

type Status = 'En cours' | 'À voir' | 'Terminée';
const n = (v: unknown, d: number) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : d; };
const statusOf = (e: Entry) => (typeof e.data.status === 'string' && e.data.status ? e.data.status : 'À voir');

/** Suivi des séries : saison et épisode en cours, progression, note, plateforme. */
export function SeriesTracker({ entries, onUpdate, onAdd }: { entries: Entry[]; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; onAdd: () => void }) {
  const series = entries.filter((e) => e.kind === 'series');
  const [tab, setTab] = useState<Status>('En cours');
  const shown = series.filter((e) => tab === 'Terminée' ? ['Terminée', 'Abandonnée'].includes(statusOf(e)) : tab === 'En cours' ? ['En cours', 'En pause'].includes(statusOf(e)) : statusOf(e) === 'À voir');

  return <section className="series">
    <div className="title-row"><h3 className="board-subtitle" style={{ margin: 0 }}>Mes séries</h3><button className="link-btn" onClick={onAdd}>+ Ajouter</button></div>
    <Segmented label="Séries" value={tab} onChange={setTab} options={(['En cours', 'À voir', 'Terminée'] as Status[]).map((s) => ({ value: s, label: s + ' · ' + series.filter((e) => s === 'Terminée' ? ['Terminée', 'Abandonnée'].includes(statusOf(e)) : s === 'En cours' ? ['En cours', 'En pause'].includes(statusOf(e)) : statusOf(e) === 'À voir').length }))} />
    {shown.length ? shown.map((e) => <SeriesCard key={e.id} entry={e} onUpdate={onUpdate} />)
      : <div className="empty-soft"><Tv size={26} /><p>{tab === 'À voir' ? 'Note les séries qu’on te recommande.' : tab === 'En cours' ? 'Aucune série en cours.' : 'Aucune série terminée pour l’instant.'}</p></div>}
  </section>;
}

function SeriesCard({ entry, onUpdate }: { entry: Entry; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> }) {
  const seasons = n(entry.data.seasons, 1);
  const perSeason = n(entry.data.episodes, 10);
  const season = Math.min(seasons, n(entry.data.season, 1));
  const episode = Number(entry.data.episode) || 0;
  const total = seasons * perSeason;
  const watched = Math.min(total, (season - 1) * perSeason + episode);
  const status = statusOf(entry);
  const rating = Number(entry.data.rating) || 0;
  const save = (patch: Record<string, unknown>) => void onUpdate(entry, { ...entry.data, ...patch });

  const step = (dir: 1 | -1) => {
    let s = season, ep = episode + dir;
    if (ep > perSeason) { if (s < seasons) { s += 1; ep = 1; } else ep = perSeason; }
    if (ep < 0) { if (s > 1) { s -= 1; ep = perSeason; } else ep = 0; }
    const finished = s === seasons && ep === perSeason;
    save({ season: String(s), episode: String(ep), status: finished ? 'Terminée' : status === 'À voir' && ep > 0 ? 'En cours' : status, lastWatched: new Date().toLocaleDateString('en-CA') });
  };

  return <article className="series-card">
    <div className="series-head">
      <span className="series-badge">{String(entry.data.platform || 'Série').slice(0, 1)}</span>
      <div className="series-title"><strong>{entry.title}</strong><small>{[entry.data.platform, entry.data.genre].filter(Boolean).join(' · ')}</small></div>
      <span className={'series-status s-' + status.replace(/\s/g, '').toLowerCase()}>{status}</span>
    </div>
    {status !== 'À voir' && <>
      <div className="series-progress"><span>Saison {season} · Épisode {episode}</span><small>{watched}/{total} épisodes</small></div>
      <Bar value={watched / total} tone="caramel" />
    </>}
    <div className="series-actions">
      {status === 'À voir'
        ? <button className="button secondary" onClick={() => save({ status: 'En cours', season: '1', episode: '1', lastWatched: new Date().toLocaleDateString('en-CA') })}>Je commence</button>
        : status !== 'Terminée' && status !== 'Abandonnée' && <div className="gstepper">
          <button aria-label="Épisode précédent" onClick={() => step(-1)}><Minus size={18} /></button>
          <span className="ep-label">Épisode vu</span>
          <button aria-label="Épisode suivant vu" onClick={() => step(1)}><Plus size={18} /></button>
        </div>}
      {(status === 'Terminée' || status === 'En cours' || status === 'En pause') && <div className="stars" aria-label="Ma note">{[1, 2, 3, 4, 5].map((i) =>
        <button key={i} aria-label={i + ' étoiles'} onClick={() => save({ rating: String(i === rating ? 0 : i) })}><Star size={18} fill={i <= rating ? '#D4B483' : 'none'} color="#B68F72" /></button>)}</div>}
    </div>
    <div className="gchips small">{['En cours', 'En pause', 'Terminée', 'Abandonnée'].filter((s) => s !== status && !(status === 'À voir' && s !== 'Abandonnée')).map((s) =>
      <button key={s} className="gchip" onClick={() => save({ status: s })}>{s}</button>)}</div>
  </article>;
}
