import { useEffect, useState } from 'react';
import { Minus, Plus, Search, Star, Tv } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { Bar, Segmented } from '../ui/kit';
import { SERIES_PLATFORMS } from '../modules';
import { platformOf, searchShows, showDetails, type ShowHit } from '../lib/tvmaze';

type Status = 'En cours' | 'À voir' | 'Terminée';
const n = (v: unknown, d: number) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : d; };
const statusOf = (e: Entry) => (typeof e.data.status === 'string' && e.data.status ? e.data.status : 'À voir');

/** Suivi des séries : saison et épisode en cours, progression, note, plateforme. */
export function SeriesTracker({ entries, onUpdate, onAdd, onCreate }: { entries: Entry[]; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; onAdd: () => void; onCreate: (i: EntryInput) => Promise<void> }) {
  const series = entries.filter((e) => e.kind === 'series');
  const [tab, setTab] = useState<Status>('En cours');
  const shown = series.filter((e) => tab === 'Terminée' ? ['Terminée', 'Abandonnée'].includes(statusOf(e)) : tab === 'En cours' ? ['En cours', 'En pause'].includes(statusOf(e)) : statusOf(e) === 'À voir');

  return <section className="series">
    <div className="title-row"><h3 className="board-subtitle" style={{ margin: 0 }}>Mes séries</h3><button className="link-btn" onClick={onAdd}>Saisie libre</button></div>
    <SeriesSearch existing={series} onCreate={onCreate} />
    <Segmented label="Séries" value={tab} onChange={setTab} options={(['En cours', 'À voir', 'Terminée'] as Status[]).map((s) => ({ value: s, label: s + ' · ' + series.filter((e) => s === 'Terminée' ? ['Terminée', 'Abandonnée'].includes(statusOf(e)) : s === 'En cours' ? ['En cours', 'En pause'].includes(statusOf(e)) : statusOf(e) === 'À voir').length }))} />
    {shown.length ? shown.map((e) => <SeriesCard key={e.id} entry={e} onUpdate={onUpdate} />)
      : <div className="empty-soft"><Tv size={26} /><p>{tab === 'À voir' ? 'Note les séries qu’on te recommande.' : tab === 'En cours' ? 'Aucune série en cours.' : 'Aucune série terminée pour l’instant.'}</p></div>}
  </section>;
}

function SeriesCard({ entry, onUpdate }: { entry: Entry; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> }) {
  // Épisodes réels de chaque saison quand la série vient de la base TVmaze, sinon un nombre identique par saison.
  const counts = Array.isArray(entry.data.seasonEpisodes) && entry.data.seasonEpisodes.length
    ? (entry.data.seasonEpisodes as unknown[]).map((x) => n(x, 10)) : Array.from({ length: n(entry.data.seasons, 1) }, () => n(entry.data.episodes, 10));
  const seasons = counts.length;
  const season = Math.min(seasons, n(entry.data.season, 1));
  const perSeason = counts[season - 1]!;
  const episode = Number(entry.data.episode) || 0;
  const total = counts.reduce((a, b) => a + b, 0);
  const watched = Math.min(total, counts.slice(0, season - 1).reduce((a, b) => a + b, 0) + episode);
  const status = statusOf(entry);
  const rating = Number(entry.data.rating) || 0;
  const save = (patch: Record<string, unknown>) => void onUpdate(entry, { ...entry.data, ...patch });

  const step = (dir: 1 | -1) => {
    let s = season, ep = episode + dir;
    if (ep > perSeason) { if (s < seasons) { s += 1; ep = 1; } else ep = perSeason; }
    if (ep < 0) { if (s > 1) { s -= 1; ep = counts[s - 1]!; } else ep = 0; }
    const finished = s === seasons && ep === counts[s - 1];
    save({ season: String(s), episode: String(ep), status: finished ? 'Terminée' : status === 'À voir' && ep > 0 ? 'En cours' : status, lastWatched: new Date().toLocaleDateString('en-CA') });
  };

  return <article className="series-card">
    <div className="series-head">
      {typeof entry.data.poster === 'string' && entry.data.poster.startsWith('https://static.tvmaze.com/')
        ? <img className="series-poster" src={entry.data.poster} alt="" loading="lazy" referrerPolicy="no-referrer" />
        : <span className="series-badge">{String(entry.data.platform || 'Série').slice(0, 1)}</span>}
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
    {!entry.data.tvmazeId && <LinkToBase entry={entry} onUpdate={onUpdate} />}
    <div className="gchips small">{['En cours', 'En pause', 'Terminée', 'Abandonnée'].filter((s) => s !== status && !(status === 'À voir' && s !== 'Abandonnée')).map((s) =>
      <button key={s} className="gchip" onClick={() => save({ status: s })}>{s}</button>)}</div>
  </article>;
}

/** Recherche dans la base TVmaze : liste déroulante de séries existantes, saisons et épisodes remplis automatiquement. */
function SeriesSearch({ existing, onCreate }: { existing: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<ShowHit[]>([]);
  const [error, setError] = useState('');
  const [picked, setPicked] = useState<ShowHit | null>(null);
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('À voir');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (q.trim().length < 2 || picked) { setHits([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(() => searchShows(q, ctrl.signal).then((r) => { setHits(r); setError(r.length ? '' : 'Aucune série trouvée.'); })
      .catch((e) => { if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : 'Recherche indisponible.'); }), 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q, picked]);
  const choose = (h: ShowHit) => { setPicked(h); setPlatform(platformOf(h.network, SERIES_PLATFORMS)); setHits([]); setError(''); };
  const add = async () => {
    if (!picked) return;
    setBusy(true); setError('');
    try {
      const d = await showDetails(picked.id);
      await onCreate({ module: 'passions', kind: 'series', title: picked.name, entry_date: null, data: {
        tvmazeId: picked.id, poster: picked.image, platform, genre: picked.genres.join(', '), status,
        seasons: String(Math.max(1, d.seasonEpisodes.length)), seasonEpisodes: d.seasonEpisodes, ...(status === 'En cours' ? { season: '1', episode: '0' } : {}) } });
      setPicked(null); setQ('');
    } catch { setError('Impossible d’ajouter cette série.'); }
    finally { setBusy(false); }
  };
  const already = picked && existing.some((e) => Number(e.data.tvmazeId) === picked.id);
  return <div className="series-search">
    {!picked && <label className="search-field-icon"><Search size={16} /><input type="search" value={q} onChange={(e) => setQ(e.target.value)}
      placeholder="Ajouter une série : tape son titre…" aria-label="Rechercher une série" role="combobox" aria-expanded={hits.length > 0} aria-controls="series-hits" /></label>}
    {hits.length > 0 && <ul className="series-hits" id="series-hits" role="listbox">{hits.map((h) => <li key={h.id} role="option" aria-selected="false">
      <button onClick={() => choose(h)}>
        {h.image ? <img src={h.image} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <span className="series-badge">{h.name.slice(0, 1)}</span>}
        <span><strong>{h.name}</strong><small>{[h.year, h.network, h.language].filter(Boolean).join(' · ')}</small></span>
      </button></li>)}</ul>}
    {picked && <div className="series-picked">
      <div className="series-head">{picked.image ? <img className="series-poster" src={picked.image} alt="" referrerPolicy="no-referrer" /> : <span className="series-badge">{picked.name.slice(0, 1)}</span>}
        <div className="series-title"><strong>{picked.name}</strong><small>{[picked.year, picked.network].filter(Boolean).join(' · ')}</small></div></div>
      <p className="eyebrow-s">Je la regarde sur</p>
      <div className="gchips small">{SERIES_PLATFORMS.map((p) => <button key={p} className={'gchip' + (platform === p ? ' on' : '')} onClick={() => setPlatform(p)}>{p}</button>)}</div>
      <p className="eyebrow-s">Statut</p>
      <div className="gchips small">{['À voir', 'En cours'].map((x) => <button key={x} className={'gchip' + (status === x ? ' on' : '')} onClick={() => setStatus(x)}>{x}</button>)}</div>
      {already && <p className="muted">Elle est déjà dans ta liste.</p>}
      <div className="button-group">
        <button className="button primary" disabled={busy || Boolean(already)} onClick={() => void add()}>{busy ? 'Ajout…' : 'Ajouter à mes séries'}</button>
        <button className="button ghost" onClick={() => setPicked(null)}>Changer</button>
      </div>
    </div>}
    {error && <p className="muted" role="status">{error}</p>}
    <p className="fineprint">Base de séries : TVmaze (seul le titre recherché leur est envoyé).</p>
  </div>;
}

/** Série ajoutée à la main : la relier à la base pour avoir les vraies saisons, épisodes et l'affiche. */
function LinkToBase({ entry, onUpdate }: { entry: Entry; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> }) {
  const [hits, setHits] = useState<ShowHit[] | null>(null);
  const [busy, setBusy] = useState(false);
  const link = async (h: ShowHit) => {
    setBusy(true);
    try {
      const d = await showDetails(h.id);
      await onUpdate(entry, { ...entry.data, tvmazeId: h.id, poster: h.image, seasons: String(Math.max(1, d.seasonEpisodes.length)), seasonEpisodes: d.seasonEpisodes,
        genre: entry.data.genre || h.genres.join(', ') });
    } finally { setBusy(false); setHits(null); }
  };
  if (!hits) return <button className="link-btn" disabled={busy} onClick={() => void searchShows(entry.title).then(setHits).catch(() => setHits([]))}>Compléter depuis la base de séries</button>;
  return <div className="series-hits inline">{hits.length ? hits.slice(0, 4).map((h) => <button key={h.id} disabled={busy} onClick={() => void link(h)}>
    {h.image ? <img src={h.image} alt="" referrerPolicy="no-referrer" /> : null}<span><strong>{h.name}</strong><small>{[h.year, h.network].filter(Boolean).join(' · ')}</small></span></button>)
    : <p className="muted">Aucune correspondance trouvée.</p>}<button className="link-btn" onClick={() => setHits(null)}>Annuler</button></div>;
}
