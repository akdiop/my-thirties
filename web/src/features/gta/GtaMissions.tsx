import { useMemo, useState } from 'react';
import { AlertTriangle, Check, ChevronLeft, ChevronRight, ExternalLink, Eye, EyeOff, MapPin, Star } from 'lucide-react';
import { DETAILS, DETAILS_DATE, LOCATIONS, MISSIONS, QUESTLINES, REGION_PLACE, SIDE_MISSIONS, missionMissable, missionOptional, missionVerified, rewardOf } from './data';
import { cellsRect } from './mapGrid';
import { missionDone, normalize, pushRecent, setMission } from './progress';
import type { GtaCtx } from './ctx';
import type { Mission, SideMission } from './types';

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' GTA$';
const heistOf = (m: Mission) => /^\[([^\]]+)\]/.exec(m.title)?.[1] ?? null;
const cleanTitle = (m: Mission) => m.title.replace(/^\[[^\]]+\]\s*/, '');
const characterLabel = (m: Mission) => DETAILS[m.id]?.perso || (m.character.startsWith('À vérifier') ? null : m.character);
const placeRect = (m: Mission) => {
  const name = REGION_PLACE[m.region]; const loc = name ? LOCATIONS.find((l) => l.name === name) : undefined;
  return loc ? { rect: cellsRect(loc.grid_row_approx, loc.grid_row_approx, Number(loc.grid_col_approx), Number(loc.grid_col_approx)), label: loc.name } : null;
};

type Filters = { q: string; chapter: number; type: 'toutes' | 'principales' | 'facultatives'; status: 'tous' | 'a-faire' | 'faites'; missable: boolean; favorites: boolean; region: string; character: string };
const INIT: Filters = { q: '', chapter: 0, type: 'toutes', status: 'tous', missable: false, favorites: false, region: '', character: '' };
const REGIONS = [...new Set(MISSIONS.map((m) => m.region))];
const CHARACTERS = [...new Set(MISSIONS.map(characterLabel).filter((c): c is string => Boolean(c)))];

export function GtaMissions(ctx: GtaCtx & { openId: string | null; setOpenId: (id: string | null) => void }) {
  const [view, setView] = useState<'histoire' | 'annexes' | 'arcs'>('histoire');
  const [f, setF] = useState<Filters>(INIT);
  const { p } = ctx;
  const list = useMemo(() => {
    const q = normalize(f.q);
    return MISSIONS.filter((m) => (!f.chapter || m.chapter === f.chapter)
      && (f.type === 'toutes' || (f.type === 'facultatives') === missionOptional(m))
      && (f.status === 'tous' || (f.status === 'faites') === missionDone(p, m.id))
      && (!f.missable || missionMissable(m)) && (!f.favorites || p.missions[m.id]?.favorite)
      && (!f.region || m.region === f.region) && (!f.character || characterLabel(m) === f.character)
      && (!q || normalize([m.title, m.description_fr, m.location_details_fr, m.missable_reward_notes_fr, m.region, m.character, p.missions[m.id]?.personalNotes ?? ''].join(' ')).includes(q)));
  }, [f, p]);

  if (ctx.openId) { const m = MISSIONS.find((x) => x.id === ctx.openId); if (m) return <MissionSheet ctx={ctx} m={m} onClose={() => ctx.setOpenId(null)} />; }
  const set = (patch: Partial<Filters>) => setF((x) => ({ ...x, ...patch }));
  const active = JSON.stringify(f) !== JSON.stringify(INIT);
  return <>
    <div className="g-row" role="tablist" aria-label="Missions">
      <button role="tab" className="g-chip" aria-pressed={view === 'histoire'} aria-selected={view === 'histoire'} onClick={() => setView('histoire')}>Histoire et annexes</button>
      <button role="tab" className="g-chip" aria-pressed={view === 'annexes'} aria-selected={view === 'annexes'} onClick={() => setView('annexes')}>Strangers & Freaks</button>
      <button role="tab" className="g-chip" aria-pressed={view === 'arcs'} aria-selected={view === 'arcs'} onClick={() => setView('arcs')}>Arcs par personnage</button>
    </div>
    {view === 'arcs' ? <Questlines ctx={ctx} /> : view === 'annexes' ? <SideList ctx={ctx} /> : <>
      <section className="g-card">
        <input type="search" value={f.q} placeholder="Chercher : titre, lieu, personnage, note…" aria-label="Chercher une mission" onChange={(e) => set({ q: e.target.value })} />
        <div className="g-chips" aria-label="Chapitre">{[0, 1, 2, 3, 4, 5].map((c) => <button key={c} className="g-chip" aria-pressed={f.chapter === c} onClick={() => set({ chapter: c })}>{c ? 'Ch. ' + c : 'Tous'}</button>)}</div>
        <div className="g-chips">
          {(['toutes', 'principales', 'facultatives'] as const).map((t) => <button key={t} className="g-chip" aria-pressed={f.type === t} onClick={() => set({ type: t })}>{t === 'toutes' ? 'Tous types' : t[0]!.toUpperCase() + t.slice(1)}</button>)}
          {(['a-faire', 'faites'] as const).map((s) => <button key={s} className="g-chip" aria-pressed={f.status === s} onClick={() => set({ status: f.status === s ? 'tous' : s })}>{s === 'faites' ? 'Faites' : 'À faire'}</button>)}
          <button className="g-chip" aria-pressed={f.missable} onClick={() => set({ missable: !f.missable })}>Manquables</button>
          <button className="g-chip" aria-pressed={f.favorites} onClick={() => set({ favorites: !f.favorites })}>Favoris</button>
        </div>
        <div className="g-fields">
          <label className="g-field"><span>Région</span><select value={f.region} onChange={(e) => set({ region: e.target.value })}><option value="">Toutes</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></label>
          <label className="g-field"><span>Personnage jouable</span><select value={f.character} onChange={(e) => set({ character: e.target.value })}><option value="">Tous</option>{CHARACTERS.map((c) => <option key={c}>{c}</option>)}</select></label>
        </div>
        <div className="g-row"><span className="g-muted" aria-live="polite">{list.length} entrée{list.length > 1 ? 's' : ''}</span>{active && <button className="g-btn ghost" onClick={() => setF(INIT)}>Effacer les filtres</button>}</div>
      </section>
      {[1, 2, 3, 4, 5].map((c) => { const items = list.filter((m) => m.chapter === c); if (!items.length) return null;
        const all = MISSIONS.filter((m) => m.chapter === c), done = all.filter((m) => missionDone(p, m.id)).length;
        return <section key={c} className="g-card" aria-labelledby={'g-ch-' + c}>
          <div className="g-chapter-head"><h2 id={'g-ch-' + c} className="g-title" style={{ margin: 0, fontSize: '1.1rem' }}>Chapitre {c}</h2><span className="g-muted">{done}/{all.length} · {Math.round((done / all.length) * 100)} %</span></div>
          <div className="g-bar" aria-hidden="true"><span style={{ width: (done / all.length) * 100 + '%' }} /></div>
          <div className="g-list">{items.map((m) => <MissionRow key={m.id} m={m} ctx={ctx} />)}</div>
        </section>; })}
      {!list.length && <p className="g-muted">Aucune mission ne correspond à ces filtres.</p>}
    </>}
  </>;
}

function MissionRow({ m, ctx }: { m: Mission; ctx: GtaCtx & { setOpenId: (id: string | null) => void } }) {
  const done = missionDone(ctx.p, m.id), heist = heistOf(m);
  return <div className={'g-mission' + (done ? ' done' : '')}>
    <span className="g-num" aria-hidden="true">{m.order}</span>
    <button className="g-open" onClick={() => { ctx.update((p) => pushRecent(p, m.id)); ctx.setOpenId(m.id); }}>
      <strong>{cleanTitle(m)}</strong>
      <span className="g-row" style={{ gap: 4 }}>
        {heist && <span className="g-badge info">{heist}</span>}
        {missionOptional(m) && <span className="g-badge">Facultative</span>}
        {missionMissable(m) && <span className="g-badge warn">Manquable</span>}
        {characterLabel(m) && <span className="g-badge">{characterLabel(m)}</span>}
        {missionVerified(m) && <span className="g-badge ok">Fiche vérifiée</span>}
        {ctx.p.missions[m.id]?.favorite && <Star size={12} aria-label="Favori" fill="currentColor" />}
      </span>
    </button>
    <button className="g-check" aria-pressed={done} aria-label={(done ? 'Décocher : ' : 'Terminée : ') + cleanTitle(m)} onClick={() => ctx.update((p) => setMission(p, m.id, { completed: !done }, ctx.today))}>{done && <Check size={20} strokeWidth={3} />}</button>
  </div>;
}

function MissionSheet({ ctx, m, onClose }: { ctx: GtaCtx & { setOpenId: (id: string | null) => void }; m: Mission; onClose: () => void }) {
  const { p, update } = ctx;
  const st = p.missions[m.id], done = st?.completed === true;
  const [reveal, setReveal] = useState(false);
  const [notes, setNotes] = useState(st?.personalNotes ?? '');
  const hidden = p.settings.hideSpoilers && m.spoiler_level === 'important' && !reveal;
  const reward = rewardOf(m), place = placeRect(m), verified = missionVerified(m), d = DETAILS[m.id];
  const placeholder = m.description_fr.startsWith('Cette entrée correspond à');
  const synopsis = placeholder && d?.synopsis ? d.synopsis : m.description_fr;
  const idx = MISSIONS.findIndex((x) => x.id === m.id), prev = MISSIONS[idx - 1], next = MISSIONS[idx + 1];
  const go = (id: string) => { update((x) => pushRecent(x, id)); ctx.setOpenId(id); window.scrollTo(0, 0); };
  const heist = heistOf(m);
  return <article className="g-card" aria-labelledby="g-mission-title" key={m.id}>
    <button className="g-btn ghost" style={{ alignSelf: 'flex-start' }} onClick={onClose}><ChevronLeft size={16} /> Toutes les missions</button>
    <p className="g-label">Chapitre {m.chapter} · n° {m.order}{heist ? ' · ' + heist : ''}</p>
    <h2 id="g-mission-title" className="g-title" style={{ margin: 0, fontSize: '1.35rem' }}>{cleanTitle(m)}</h2>
    <div className="g-row" style={{ gap: 4 }}>
      <span className="g-badge">{missionOptional(m) ? 'Facultative' : 'Principale'}</span>
      {verified ? <span className="g-badge ok">Fiche détaillée</span> : <span className="g-badge warn">Détails non vérifiés</span>}
      {m.spoiler_level === 'important' && <span className="g-badge info">Spoiler important</span>}
    </div>
    {m.id === 'C02-27' && !done && <button className="g-reveal" onClick={() => ctx.go('astuces')}><AlertTriangle size={14} /> Avant de lancer : la liste de préparation (2 cartes manquables au motel)</button>}
    {missionMissable(m) && <p className="g-alert" role="note"><AlertTriangle size={16} aria-hidden="true" /> Potentiellement manquable. {d?.manquable ? d.condition.split('. ').filter((x) => /anquable/.test(x)).join('. ') || d.recompense : m.missable_reward_notes_fr}</p>}
    <div className="g-row">
      <button className="g-btn" aria-pressed={done} onClick={() => update((x) => setMission(x, m.id, { completed: !done }, ctx.today))}><Check size={16} /> {done ? 'Terminée' + (st?.dateCompleted ? ' le ' + new Date(st.dateCompleted + 'T12:00:00').toLocaleDateString('fr-FR') : '') : 'Marquer terminée'}</button>
      <button className="g-icon" aria-pressed={Boolean(st?.favorite)} aria-label={st?.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => update((x) => setMission(x, m.id, { favorite: !st?.favorite }, ctx.today))}><Star size={18} fill={st?.favorite ? 'currentColor' : 'none'} /></button>
    </div>
    <section className="g-field"><span>Synopsis</span>
      {hidden ? <button className="g-reveal" onClick={() => setReveal(true)}><Eye size={14} /> Spoiler important : toucher pour afficher le résumé</button>
        : <p>{synopsis}{placeholder && !d?.synopsis && <> <em className="g-unverified">(détails à compléter)</em></>}</p>}
      {reveal && <button className="g-btn ghost" style={{ alignSelf: 'flex-start' }} onClick={() => setReveal(false)}><EyeOff size={14} /> Masquer</button>}
    </section>
    <div className="g-fields">
      <div className="g-field"><span>Personnage</span><p>{characterLabel(m) ?? <em className="g-unverified">non vérifié</em>}</p></div>
      <div className="g-field"><span>Point de départ</span><p>{d?.lieu ?? m.location_details_fr}</p></div>
      {d && <div className="g-field"><span>Donnée par</span><p>{d.donneur}</p></div>}
      <div className="g-field"><span>Pour la débloquer</span><p>{d?.condition ?? <em className="g-unverified">non renseigné dans les sources</em>}</p></div>
      <div className="g-field"><span>Récompense</span><p>{d ? d.recompense : reward ? <>{fmt(reward.amount)} <span className="g-badge warn">à confirmer</span></> : <em className="g-unverified">non vérifiée</em>}{d && reward && <> <span className="g-badge ok">{fmt(reward.amount)} vérifiés</span></>}</p></div>
      {!d && <div className="g-field"><span>Objets et points d’intérêt</span><p>{m.missable_reward_notes_fr}</p></div>}
      {d && <div className="g-field"><span>Lieux (kit)</span><p>{m.location_details_fr}</p></div>}
    </div>
    <section className="g-field"><span>Objectifs</span>
      {d?.etapes.length ? (hidden ? <p className="g-muted">Masqués avec les spoilers.</p> : <ol style={{ margin: 0, paddingLeft: 20 }}>{d.etapes.map((s) => <li key={s}>{s}</li>)}</ol>)
        : <p><em className="g-unverified">{d ? 'Aucun objectif listé sur la fiche.' : 'Objectifs non vérifiés : pas de fiche individuelle.'}</em></p>}
    </section>
    {place?.rect ? <div className="g-row"><button className="g-btn soft" onClick={() => ctx.showOnMap(place.rect!, place.label)}><MapPin size={16} /> Voir la zone sur la carte</button><span className="g-muted">{place.label}, zone approximative</span></div>
      : <p className="g-muted"><MapPin size={14} aria-hidden="true" /> {m.map_precision}</p>}
    <details className="g-field"><summary className="g-label" style={{ minHeight: 44, display: 'flex', alignItems: 'center' }}>Vérification et sources</summary>
      <p><b>Statut :</b> {m.status_verification}</p>
      <p><b>Confiance :</b> {m.confidence}</p>
      {m.verified_scope && <p><b>Portée :</b> {m.verified_scope}</p>}
      <p><b>Niveau de détail :</b> {m.detail_level} · <b>Contrôlé le</b> {new Date(m.verification_date + 'T12:00:00').toLocaleDateString('fr-FR')}</p>
      <p><a href={m.source_index} target="_blank" rel="noreferrer">Index des missions <ExternalLink size={12} /></a>{(d?.url ?? m.source_detail_url) && <> · <a href={d?.url ?? m.source_detail_url!} target="_blank" rel="noreferrer">Fiche individuelle <ExternalLink size={12} /></a></>}</p>
      {d && <p className="g-muted">Fiche PowerPyx consultée le {new Date(DETAILS_DATE + 'T12:00:00').toLocaleDateString('fr-FR')} : faits traduits et reformulés, pas recopiés.</p>}
    </details>
    <label className="g-field"><span>Mes notes</span><textarea rows={3} value={notes} maxLength={2000} placeholder="Ce que j’ai trouvé, ce qu’il me reste à faire…" onChange={(e) => setNotes(e.target.value)} onBlur={() => { if (notes !== (st?.personalNotes ?? '')) update((x) => setMission(x, m.id, { personalNotes: notes.trim() || undefined }, ctx.today)); }} /></label>
    <div className="g-row" style={{ justifyContent: 'space-between' }}>
      {prev ? <button className="g-btn ghost" onClick={() => go(prev.id)}><ChevronLeft size={16} /> Précédente</button> : <span />}
      {next && <button className="g-btn ghost" onClick={() => go(next.id)}>Suivante <ChevronRight size={16} /></button>}
    </div>
  </article>;
}

/** Arcs secondaires par personnage, avec les missions du référentiel dont le titre correspond à une activité citée. */
function Questlines({ ctx }: { ctx: GtaCtx & { setOpenId: (id: string | null) => void } }) {
  return <>{QUESTLINES.map((q) => {
    const parts = q.activities.split('/').map((s) => normalize(s.replace('?', ''))).filter((s) => s.length > 3);
    // Reliées si le titre cite une activité de l'arc ou le prénom du personnage (mot entier).
    const name = new RegExp('\\b' + normalize(q.character.split(' ')[0]!.replace('.', '')) + '\\b');
    const linked = MISSIONS.filter((m) => parts.some((part) => normalize(m.title).includes(part)) || name.test(normalize(m.title)));
    const sides = SIDE_MISSIONS.filter((x) => x.arc === q.character || name.test(normalize(x.arc)));
    return <section key={q.character} className="g-card">
      <div className="g-chapter-head"><h3 className="g-title" style={{ margin: 0 }}>{q.character}</h3><span className="g-badge">{q.chapter}</span></div>
      <p>{q.activities}</p>
      <p className="g-muted">{q.note}</p>
      {linked.length > 0 && <div className="g-list">{linked.map((m) => <MissionRow key={m.id} m={m} ctx={ctx} />)}</div>}
      {sides.length > 0 && <div className="g-list">{sides.map((x) => <SideRow key={x.id} x={x} ctx={ctx} />)}</div>}
      {!linked.length && !sides.length && <p className="g-muted"><em className="g-unverified">Aucune mission reliée : arc à documenter.</em></p>}
    </section>; })}</>;
}

/** Missions annexes (Strangers & Freaks) : cochables comme les autres, détails sous un dépliant. */
function SideList({ ctx }: { ctx: GtaCtx }) {
  const done = SIDE_MISSIONS.filter((x) => missionDone(ctx.p, x.id)).length;
  return <section className="g-card">
    <div className="g-chapter-head"><h2 className="g-title" style={{ margin: 0, fontSize: '1.1rem' }}>Strangers & Freaks</h2><span className="g-muted">{done}/{SIDE_MISSIONS.length}</span></div>
    <p className="g-muted">Missions annexes absentes de l’index du kit, complétées d’après les fiches individuelles PowerPyx.</p>
    <div className="g-list">{SIDE_MISSIONS.map((x) => <SideRow key={x.id} x={x} ctx={ctx} />)}</div>
  </section>;
}

function SideRow({ x, ctx }: { x: SideMission; ctx: GtaCtx }) {
  const done = missionDone(ctx.p, x.id);
  return <div className={'g-mission' + (done ? ' done' : '')} style={{ alignItems: 'flex-start' }}>
    <details className="g-open" style={{ display: 'block' }}>
      <summary style={{ minHeight: 44, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}><strong>{x.titre}</strong>
        <span className="g-row" style={{ gap: 4 }}><span className="g-badge info">{x.arc}</span><span className="g-badge">{x.chapitre ? 'Ch. ' + x.chapitre : 'Tous chapitres'}</span>{x.montant ? <span className="g-badge ok">{fmt(x.montant)}</span> : null}</span></summary>
      <div className="g-fields" style={{ marginTop: 8 }}>
        <div className="g-field"><span>Synopsis</span><p>{x.synopsis}</p></div>
        <div className="g-field"><span>Point de départ</span><p>{x.lieu}</p></div>
        <div className="g-field"><span>Pour la débloquer</span><p>{x.condition}</p></div>
        <div className="g-field"><span>Personnage</span><p>{x.perso}</p></div>
        <div className="g-field"><span>Récompense</span><p>{x.recompense}</p></div>
      </div>
      {x.etapes.length > 0 && <ol style={{ margin: '6px 0', paddingLeft: 20 }}>{x.etapes.map((s) => <li key={s}>{s}</li>)}</ol>}
      <p className="g-muted"><a href={x.url} target="_blank" rel="noreferrer">Fiche individuelle <ExternalLink size={12} /></a></p>
    </details>
    <button className="g-check" aria-pressed={done} aria-label={(done ? 'Décocher : ' : 'Terminée : ') + x.titre} onClick={() => ctx.update((p) => setMission(p, x.id, { completed: !done }, ctx.today))}>{done && <Check size={20} strokeWidth={3} />}</button>
  </div>;
}
