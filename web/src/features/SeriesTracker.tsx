import { useEffect, useState } from 'react';
import { CalendarDays, Check, Minus, Plus, Search, Star, Trash2, Tv, X } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { Bar, Segmented } from '../ui/kit';
import { SERIES_PLATFORMS } from '../modules';
import { epCode, platformOf, searchShows, showData, showDetails, type Episode, type ShowData, type ShowHit } from '../lib/tvmaze';

type Tab = 'À regarder' | 'Prochainement' | 'Mes séries';
const n = (v: unknown, d: number) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : d; };
const statusOf = (e: Entry) => (typeof e.data.status === 'string' && e.data.status ? e.data.status : 'À voir');
const todayIso = () => new Date().toLocaleDateString('en-CA');
const aired = (ep: Episode) => Boolean(ep.airdate) && ep.airdate <= todayIso();
const frDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
const tvId = (e: Entry) => Number(e.data.tvmazeId) || 0;
type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;

/** Épisodes vus d'une série TVmaze (ids) ; pour une série reliée avant ce suivi, déduits de la saison et de l'épisode notés. */
function watchedOf(e: Entry, show: ShowData | undefined): Set<number> {
  if (Array.isArray(e.data.watched)) return new Set((e.data.watched as unknown[]).map(Number).filter(Boolean));
  if (!show) return new Set();
  const s = n(e.data.season, 1), ep = Number(e.data.episode) || 0;
  return new Set(show.episodes.filter((x) => x.season < s || (x.season === s && x.number <= ep)).map((x) => x.id));
}

/** Charge la fiche et les épisodes de chaque série reliée à TVmaze. */
function useShows(series: Entry[]) {
  const ids = [...new Set(series.map(tvId).filter(Boolean))].sort().join(',');
  const [shows, setShows] = useState<Record<number, ShowData>>({});
  useEffect(() => {
    let active = true;
    for (const id of ids ? ids.split(',').map(Number) : []) {
      showData(id).then((d) => { if (active) setShows((cur) => ({ ...cur, [id]: d })); }).catch(() => { /* série indisponible pour l'instant */ });
    }
    return () => { active = false; };
  }, [ids]);
  return shows;
}

/** Enregistre la liste des épisodes vus et en déduit la saison, l'épisode et le statut. */
function saveWatched(entry: Entry, show: ShowData, watched: Set<number>, onUpdate: Save) {
  const seen = show.episodes.filter((x) => watched.has(x.id));
  const last = seen[seen.length - 1];
  const allAired = show.episodes.filter(aired).every((x) => watched.has(x.id));
  const status = statusOf(entry);
  const next = allAired && show.status === 'Ended' && seen.length ? 'Terminée'
    : seen.length && (status === 'À voir' || status === 'Terminée') ? 'En cours' : status;
  return onUpdate(entry, { ...entry.data, watched: [...watched], season: String(last?.season ?? 1), episode: String(last?.number ?? 0), status: next, lastWatched: todayIso() });
}

/** Suivi des séries façon TV Time : prochain épisode à regarder, sorties à venir, fiches épisode par épisode, statistiques. */
export function SeriesTracker({ entries, onUpdate, onAdd, onCreate, onRemove }: { entries: Entry[]; onUpdate: Save; onAdd: () => void; onCreate: (i: EntryInput) => Promise<void>; onRemove?: (e: Entry) => Promise<boolean> }) {
  const series = entries.filter((e) => e.kind === 'series');
  const shows = useShows(series);
  const [tab, setTab] = useState<Tab>('À regarder');
  const [open, setOpen] = useState<string | null>(null);
  const opened = series.find((e) => e.id === open);
  const following = series.filter((e) => !['Terminée', 'Abandonnée'].includes(statusOf(e)));

  // Statistiques : épisodes cochés et temps passé (durée réelle de chaque épisode quand elle est connue).
  let episodes = 0, minutes = 0;
  for (const e of series) {
    const show = shows[tvId(e)];
    if (show) { const w = watchedOf(e, show); for (const ep of show.episodes) if (w.has(ep.id)) { episodes++; minutes += ep.runtime || show.runtime || 0; } }
  }

  const upNext = following.flatMap((e) => {
    const show = shows[tvId(e)];
    if (!show || statusOf(e) === 'À voir') return [];
    const w = watchedOf(e, show);
    const ep = show.episodes.find((x) => aired(x) && !w.has(x.id));
    return ep ? [{ e, show, ep, left: show.episodes.filter((x) => aired(x) && !w.has(x.id)).length }] : [];
  }).sort((a, b) => String(b.e.data.lastWatched ?? '').localeCompare(String(a.e.data.lastWatched ?? '')));
  const upToDate = following.filter((e) => shows[tvId(e)] && statusOf(e) !== 'À voir' && !upNext.some((u) => u.e.id === e.id));
  const toStart = following.filter((e) => statusOf(e) === 'À voir');
  const manual = following.filter((e) => !tvId(e) && statusOf(e) !== 'À voir');
  const soon = following.flatMap((e) => (shows[tvId(e)]?.episodes ?? []).filter((x) => x.airdate > todayIso()).slice(0, 3).map((ep) => ({ e, ep })))
    .sort((a, b) => a.ep.airdate.localeCompare(b.ep.airdate)).slice(0, 40);

  const markNext = (e: Entry, show: ShowData, ep: Episode) => { const w = watchedOf(e, show); w.add(ep.id); return saveWatched(e, show, w, onUpdate); };

  return <section className="series tvtime">
    <img className="screen-cover" src="/modules/series.webp" alt="Soirée séries : popcorn et plaid" loading="lazy" />
    <div className="title-row"><h3 className="board-subtitle" style={{ margin: 0 }}>Mes séries</h3><button className="link-btn" onClick={onAdd}>Saisie libre</button></div>
    <SeriesSearch existing={series} onCreate={onCreate} />
    <div className="tv-stats">
      <div><strong>{episodes}</strong><small>épisodes vus</small></div>
      <div><strong>{minutes >= 1440 ? Math.floor(minutes / 1440) + ' j ' + Math.round(minutes % 1440 / 60) + ' h' : Math.round(minutes / 60) + ' h'}</strong><small>devant l’écran</small></div>
      <div><strong>{following.length}</strong><small>séries suivies</small></div>
    </div>
    <Segmented label="Séries" value={tab} onChange={setTab} options={(['À regarder', 'Prochainement', 'Mes séries'] as Tab[]).map((t) => ({ value: t, label: t }))} />

    {tab === 'À regarder' && <>
      {upNext.map(({ e, show, ep, left }) => <article key={e.id} className="tv-next">
        <button className="tv-next-main" onClick={() => setOpen(e.id)}>
          <Poster entry={e} big />
          <span className="tv-next-text"><strong>{e.title}</strong><span className="tv-code">{epCode(ep)}</span><small>{ep.name}</small>
            <small className="muted">{left > 1 ? left + ' épisodes à rattraper' : 'Dernier épisode sorti'}</small></span>
        </button>
        <button className="tv-check" aria-label={'Marquer ' + epCode(ep) + ' comme vu'} onClick={() => void markNext(e, show, ep)}><Check size={22} strokeWidth={3} /></button>
      </article>)}
      {manual.map((e) => <SeriesCard key={e.id} entry={e} onUpdate={onUpdate} />)}
      {upToDate.length > 0 && <><p className="eyebrow-s">À jour</p>
        <div className="tv-row">{upToDate.map((e) => <button key={e.id} className="tv-mini" onClick={() => setOpen(e.id)}><Poster entry={e} /><small>{e.title}</small></button>)}</div></>}
      {toStart.length > 0 && <><p className="eyebrow-s">Pas encore commencées</p>
        <div className="tv-row">{toStart.map((e) => <button key={e.id} className="tv-mini" onClick={() => setOpen(e.id)}><Poster entry={e} /><small>{e.title}</small></button>)}</div></>}
      {!upNext.length && !manual.length && !upToDate.length && !toStart.length && <div className="empty-soft"><Tv size={26} /><p>Ajoute une série avec la recherche ci-dessus.</p></div>}
    </>}

    {tab === 'Prochainement' && (soon.length ? <div className="tv-soon">{soon.map(({ e, ep }, i) => <div key={e.id + ep.id}>
      {(i === 0 || soon[i - 1]!.ep.airdate !== ep.airdate) && <p className="eyebrow-s">{frDate(ep.airdate)}</p>}
      <button className="tv-soon-item" onClick={() => setOpen(e.id)}><Poster entry={e} /><span><strong>{e.title}</strong><small>{epCode(ep)}{ep.name ? ' · ' + ep.name : ''}</small></span></button>
    </div>)}</div> : <div className="empty-soft"><CalendarDays size={26} /><p>Aucun épisode annoncé pour tes séries suivies.</p></div>)}

    {tab === 'Mes séries' && <div className="tv-grid">{series.map((e) => {
      const show = shows[tvId(e)];
      const total = show ? show.episodes.filter(aired).length : 0;
      const done = show ? show.episodes.filter((x) => aired(x) && watchedOf(e, show).has(x.id)).length : 0;
      return <button key={e.id} className="tv-tile" onClick={() => setOpen(e.id)}>
        <Poster entry={e} big /><strong>{e.title}</strong>
        <small>{statusOf(e)}{total ? ' · ' + done + '/' + total : ''}</small>
        {total > 0 && <Bar value={done / total} tone="caramel" />}
      </button>;
    })}</div>}

    {opened && <ShowSheet entry={opened} show={shows[tvId(opened)]} onUpdate={onUpdate} onClose={() => setOpen(null)}
      onRemove={onRemove && (async () => { if (await onRemove(opened)) setOpen(null); })} />}
  </section>;
}

function Poster({ entry, big }: { entry: Entry; big?: boolean }) {
  const src = typeof entry.data.poster === 'string' && entry.data.poster.startsWith('https://static.tvmaze.com/') ? entry.data.poster : '';
  return src ? <img className={'tv-poster' + (big ? ' big' : '')} src={src} alt="" loading="lazy" referrerPolicy="no-referrer" />
    : <span className={'series-badge tv-poster' + (big ? ' big' : '')}>{entry.title.slice(0, 1)}</span>;
}

/** Fiche d'une série : résumé, statut, note et toutes les saisons, épisode par épisode. */
function ShowSheet({ entry, show, onUpdate, onClose, onRemove }: { entry: Entry; show: ShowData | undefined; onUpdate: Save; onClose: () => void; onRemove?: () => Promise<void> }) {
  const status = statusOf(entry);
  const rating = Number(entry.data.rating) || 0;
  const watched = watchedOf(entry, show);
  const seasons = show ? [...new Set(show.episodes.map((x) => x.season))] : [];
  const firstOpen = show ? (show.episodes.find((x) => aired(x) && !watched.has(x.id))?.season ?? seasons[seasons.length - 1]) : undefined;
  const [season, setSeason] = useState<number | undefined>(firstOpen);
  const set = (ids: number[], on: boolean) => { if (!show) return; const w = new Set(watched); ids.forEach((id) => on ? w.add(id) : w.delete(id)); void saveWatched(entry, show, w, onUpdate); };
  const upTo = (ep: Episode) => set(show!.episodes.filter((x) => aired(x) && (x.season < ep.season || (x.season === ep.season && x.number <= ep.number))).map((x) => x.id), true);
  return <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={entry.title} onClick={onClose}>
    <div className="editor tv-sheet" onClick={(e) => e.stopPropagation()}>
      <button className="icon-btn preview-close" aria-label="Fermer" onClick={onClose}><X size={20} /></button>
      <div className="tv-sheet-head"><Poster entry={entry} big /><div><h2>{entry.title}</h2>
        <small>{[entry.data.platform, entry.data.genre, show?.status === 'Ended' ? 'Série terminée' : show?.status === 'Running' ? 'En diffusion' : ''].filter(Boolean).join(' · ')}</small>
        {tvId(entry) > 0 && <div className="stars" aria-label="Ma note">{[1, 2, 3, 4, 5].map((i) => <button key={i} aria-label={i + ' étoiles'} onClick={() => void onUpdate(entry, { ...entry.data, rating: String(i === rating ? 0 : i) })}>
          <Star size={18} fill={i <= rating ? '#D8B69F' : 'none'} color="#C9A08C" /></button>)}</div>}</div></div>
      {show?.summary && <p className="tv-summary">{show.summary} <small className="muted">(résumé TVmaze, en anglais)</small></p>}
      {tvId(entry) > 0 ? <div className="gchips small">{['À voir', 'En cours', 'En pause', 'Terminée', 'Abandonnée'].map((s) => <button key={s} className={'gchip' + (s === status ? ' on' : '')} onClick={() => void onUpdate(entry, { ...entry.data, status: s })}>{s}</button>)}</div>
        : <SeriesCard entry={entry} onUpdate={onUpdate} />}
      {tvId(entry) > 0 && !show && <p className="muted">Chargement des épisodes…</p>}
      {show && <>
        <div className="tv-seasons">{seasons.map((s) => {
          const eps = show.episodes.filter((x) => x.season === s), out = eps.filter(aired), done = out.filter((x) => watched.has(x.id)).length;
          return <button key={s} className={'tv-season' + (season === s ? ' on' : '') + (out.length && done === out.length ? ' done' : '')} onClick={() => setSeason(s)}>S{s}<small>{done}/{out.length || eps.length}</small></button>;
        })}</div>
        {season !== undefined && (() => {
          const eps = show.episodes.filter((x) => x.season === season), out = eps.filter(aired), all = out.length > 0 && out.every((x) => watched.has(x.id));
          return <>
            <div className="tv-season-actions"><strong>Saison {season}</strong>
              {out.length > 0 && <button className="link-btn" onClick={() => set(out.map((x) => x.id), !all)}>{all ? 'Tout décocher' : 'Toute la saison vue'}</button>}</div>
            <ol className="tv-episodes">{eps.map((ep) => {
              const on = watched.has(ep.id), released = aired(ep);
              return <li key={ep.id} className={on ? 'on' : ''}>
                <button className="tv-ep-check" disabled={!released} aria-pressed={on} aria-label={(on ? 'Décocher ' : 'Marquer vu ') + epCode(ep)} onClick={() => set([ep.id], !on)}>{on ? <Check size={16} strokeWidth={3} /> : null}</button>
                <span className="tv-ep-text"><strong>{ep.number}. {ep.name || 'Épisode ' + ep.number}</strong>
                  <small>{ep.airdate ? (released ? frDate(ep.airdate) : 'Sortie le ' + frDate(ep.airdate)) : 'Date inconnue'}{ep.runtime ? ' · ' + ep.runtime + ' min' : ''}</small></span>
                {released && !on && <button className="link-btn tv-upto" onClick={() => upTo(ep)}>Vu jusqu’ici</button>}
              </li>;
            })}</ol>
          </>;
        })()}
      </>}
      {onRemove && <button className="link-btn small" onClick={() => void onRemove()}><Trash2 size={14} /> Retirer cette série</button>}
    </div>
  </div>;
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
        <button key={i} aria-label={i + ' étoiles'} onClick={() => save({ rating: String(i === rating ? 0 : i) })}><Star size={18} fill={i <= rating ? '#D8B69F' : 'none'} color="#C9A08C" /></button>)}</div>}
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
