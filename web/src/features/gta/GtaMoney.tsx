import { useState } from 'react';
import { AlertTriangle, Check, ChevronLeft, ExternalLink, Eye, KeyRound, MapPin } from 'lucide-react';
import { MISSIONS, MONEY_PLACES, MONEY_UNIT, REWARD_ROWS } from './data';
import { parseGrid } from './mapGrid';
import { MONEY_STATUS_LABEL, MONEY_STATUSES, missionDone, missionStats, moneyOf, moneyTotals, setMoney, toggleStep, type MoneyStatus } from './progress';
import { PELICAN, PELICAN_ID } from './pelican';
import type { GtaCtx } from './ctx';
import type { MoneyLocation } from './types';

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' ' + MONEY_UNIT;
const CATEGORY: Record<string, string> = { cache_et_enigme: 'Cache et énigme', entrepot: 'Entrepôt', cache: 'Cache', coffre: 'Coffre' };
const VERIF: Record<string, string> = { corroboré_guides_tiers: 'Recoupé par plusieurs guides tiers', corroboré_guides_tiers_montants_variables: 'Recoupé par des guides tiers, montants variables' };
const isSecret = (pl: MoneyLocation) => pl.category.includes('enigme') || Object.keys(pl.codes).length > 0;
const recovered = (ctx: GtaCtx, id: string) => { const m = moneyOf(ctx.p, id); return (m.cash_recovered ?? 0) > 0 || (m.converted_amount ?? 0) > 0 || ['butin', 'converti', 'termine'].includes(m.status); };

export function GtaMoney(ctx: GtaCtx & { openId: string | null; setOpenId: (id: string | null) => void }) {
  const [filter, setFilter] = useState<'tous' | 'recupere' | 'non' | 'secrets'>('tous');
  const totals = moneyTotals(MONEY_PLACES, ctx.p, REWARD_ROWS);
  const current = missionStats(MISSIONS, ctx.p).current;
  const open = ctx.openId ? MONEY_PLACES.find((x) => x.id === ctx.openId) : undefined;
  if (open) return open.id === PELICAN_ID ? <PelicanSheet ctx={ctx} pl={open} onClose={() => ctx.setOpenId(null)} /> : <PlaceSheet ctx={ctx} pl={open} onClose={() => ctx.setOpenId(null)} />;
  const list = MONEY_PLACES.filter((pl) => filter === 'tous' || (filter === 'secrets' ? isSecret(pl) : (filter === 'recupere') === recovered(ctx, pl.id)))
    .sort((a, b) => Number(b.id === PELICAN_ID) - Number(a.id === PELICAN_ID) || a.chapter_min - b.chapter_min);
  const now = list.filter((pl) => pl.chapter_min <= current), later = list.filter((pl) => pl.chapter_min > current);
  return <>
    <section className="g-card" aria-labelledby="g-money-total">
      <p className="g-label" id="g-money-total">Mes gains confirmés</p>
      <div className="g-money"><b>{fmt(totals.confirmed)}</b><span className="g-muted">Espèces récupérées {fmt(totals.cash)} · valeur convertie {fmt(totals.converted)} · récompenses vérifiées {fmt(totals.verifiedRewards)}</span></div>
      <p className="g-muted">Seuls comptent ce que tu as saisi et les récompenses vérifiées de missions terminées. Les estimations des guides restent à part.</p>
      <div className="g-amounts">
        <div className="g-money"><span className="g-label">Espèces annoncées (non comptées)</span><b style={{ fontSize: '1rem' }}>{fmt(totals.reportedCash)}</b></div>
        <div className="g-money nominal"><span className="g-label">Valeur nominale (non convertie)</span><b style={{ fontSize: '1rem' }}>{fmt(totals.nominal)}</b></div>
      </div>
      {totals.pendingRewards > 0 && <p className="g-muted">Récompenses à confirmer sur des missions terminées : {fmt(totals.pendingRewards)} (non comptées).</p>}
    </section>
    <p className="g-alert info"><AlertTriangle size={16} aria-hidden="true" /> Emplacements et cases de grille indicatifs, sans coordonnées GPS. Argent fictif du jeu uniquement.</p>
    <div className="g-chips" aria-label="Filtrer les caches">
      {([['tous', 'Tous'], ['non', 'Pas récupéré'], ['recupere', 'Récupéré'], ['secrets', 'Secrets et énigmes']] as const).map(([k, l]) => <button key={k} className="g-chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>)}
    </div>
    {now.length > 0 && <><h2 className="g-title" style={{ margin: 0, fontSize: '1.05rem' }}>Disponible dès maintenant</h2>{now.map((pl) => <PlaceCard key={pl.id} pl={pl} ctx={ctx} />)}</>}
    {later.length > 0 && <><h2 className="g-title" style={{ margin: 0, fontSize: '1.05rem' }}>Plus tard dans l’histoire</h2>{later.map((pl) => <PlaceCard key={pl.id} pl={pl} ctx={ctx} />)}</>}
    {!list.length && <p className="g-muted">Aucune cache dans ce filtre.</p>}
    <section className="g-card"><p className="g-label">Récompenses de missions</p>
      <div className="g-table">{REWARD_ROWS.map((r) => { const inKit = MISSIONS.some((x) => x.id === r.missionId);
        return <div key={r.missionId}><span>{inKit ? <button className="link-btn" style={{ textAlign: 'left', minHeight: 44 }} onClick={() => ctx.openMission(r.missionId)}>{r.title}</button> : <b>{r.title}</b>}<br /><span className="g-muted">{r.chapter ? 'Ch. ' + r.chapter : 'Tous chapitres'}{inKit ? '' : ' · annexe'} · <a href={r.source} target="_blank" rel="noreferrer">source</a>{missionDone(ctx.p, r.missionId) ? ' · terminée' : ''}</span></span>
          <span style={{ textAlign: 'right' }}>{fmt(r.amount)}<br />{r.verified ? <span className="g-badge ok">vérifiée</span> : <span className="g-badge warn">à confirmer</span>}</span></div>; })}</div>
    </section>
  </>;
}

function PlaceCard({ pl, ctx }: { pl: MoneyLocation; ctx: GtaCtx & { setOpenId: (id: string | null) => void } }) {
  const m = moneyOf(ctx.p, pl.id);
  return <button className={'g-place' + (pl.id === PELICAN_ID ? ' featured' : '')} onClick={() => ctx.setOpenId(pl.id)}>
    <span className="g-row" style={{ gap: 4 }}><span className="g-badge">{CATEGORY[pl.category] ?? pl.category}</span><span className="g-badge info">{MONEY_STATUS_LABEL[m.status]}</span>{pl.id === PELICAN_ID && <span className="g-badge ok">Fiche détaillée</span>}</span>
    <strong className="g-title" style={{ fontSize: '1.05rem' }}>{pl.title}</strong>
    <span className="g-muted">{pl.region} · {pl.grid}</span>
    <span className="g-amounts">
      <span className="g-money"><span className="g-label">Espèces annoncées</span>{pl.amount_cash_reported !== null ? '≈ ' + fmt(pl.amount_cash_reported) : <em className="g-unverified">non précisé</em>}</span>
      <span className="g-money nominal"><span className="g-label">Autre valeur nominale</span>{pl.amount_other_nominal !== null ? '≈ ' + fmt(pl.amount_other_nominal) : '—'}</span>
    </span>
    <span className="g-muted">Étapes : {m.steps.length}/{pl.steps.length}{m.cash_recovered ? ' · récupéré ' + fmt(m.cash_recovered) : ''}</span>
  </button>;
}

/** Masque les codes (et les nombres à 4 chiffres) dans un texte tant qu'Aïda ne les a pas révélés. */
const maskCodes = (text: string, codes: string[]) => [...codes].sort((a, b) => b.length - a.length).reduce((t, c) => t.split(c).join('•'.repeat(Math.min(c.length, 7))), text).replace(/\b\d{4}\b/g, '••••');

function Steps({ ctx, pl }: { ctx: GtaCtx; pl: MoneyLocation }) {
  const m = moneyOf(ctx.p, pl.id);
  const codes = Object.values(pl.codes);
  const [reveal, setReveal] = useState(false);
  const hasHidden = pl.steps.some((s) => maskCodes(s, codes) !== s);
  return <>
    <ol className="g-steps">{pl.steps.map((s, i) => { const on = m.steps.includes(i);
      return <li key={i}><button aria-pressed={on} onClick={() => ctx.update((p) => toggleStep(p, pl.id, i))}><span className="tick">{on && <Check size={16} strokeWidth={3} />}</span><span className="txt">{i + 1}. {reveal ? s : maskCodes(s, codes)}</span></button></li>; })}</ol>
    {hasHidden && <button className="g-btn ghost" style={{ alignSelf: 'flex-start' }} aria-pressed={reveal} onClick={() => setReveal(!reveal)}><Eye size={14} /> {reveal ? 'Masquer les codes' : 'Afficher les codes dans les étapes'}</button>}
  </>;
}

/** Saisie des gains réellement obtenus : seule source du total confirmé. */
function MyGains({ ctx, pl }: { ctx: GtaCtx; pl: MoneyLocation }) {
  const m = moneyOf(ctx.p, pl.id);
  const [notes, setNotes] = useState(m.notes ?? '');
  const num = (v: string) => { const n = Math.round(Number(v.replace(/\s/g, ''))); return Number.isFinite(n) && n > 0 ? n : undefined; };
  return <section className="g-card" aria-labelledby={'g-gains-' + pl.id}>
    <p className="g-label" id={'g-gains-' + pl.id}>Mes gains confirmés ici</p>
    <div className="g-fields">
      <label className="g-field"><span>Statut</span><select value={m.status} onChange={(e) => ctx.update((p) => setMoney(p, pl.id, { status: e.target.value as MoneyStatus }))}>{MONEY_STATUSES.map((s) => <option key={s} value={s}>{MONEY_STATUS_LABEL[s]}</option>)}</select></label>
      <label className="g-field"><span>Visité le</span><input type="date" value={m.visited_at ?? ''} onChange={(e) => ctx.update((p) => setMoney(p, pl.id, { visited_at: e.target.value || undefined }))} /></label>
      <label className="g-field"><span>Espèces récupérées ({MONEY_UNIT})</span><input inputMode="numeric" defaultValue={m.cash_recovered ?? ''} placeholder="Montant réel" onBlur={(e) => ctx.update((p) => setMoney(p, pl.id, { cash_recovered: num(e.target.value) }))} /></label>
      <label className="g-field"><span>Valeur convertie ({MONEY_UNIT})</span><input inputMode="numeric" defaultValue={m.converted_amount ?? ''} placeholder="Après revente ou blanchiment" onBlur={(e) => ctx.update((p) => setMoney(p, pl.id, { converted_amount: num(e.target.value) }))} /></label>
    </div>
    <label className="g-field"><span>Mes notes</span><textarea rows={2} value={notes} maxLength={2000} onChange={(e) => setNotes(e.target.value)} onBlur={() => ctx.update((p) => setMoney(p, pl.id, { notes: notes.trim() || undefined }))} /></label>
  </section>;
}

function Sources({ pl }: { pl: MoneyLocation }) {
  return <section className="g-card"><p className="g-label">Vérification et sources</p>
    <p>{VERIF[pl.verification] ?? pl.verification}{pl.amount_is_estimate ? ' · montants estimés' : ''}</p>
    <ul style={{ margin: 0, paddingLeft: 18 }}>{pl.sources.map((s) => <li key={s}><a href={s} target="_blank" rel="noreferrer">{new URL(s).hostname.replace(/^www\./, '')} <ExternalLink size={12} /></a></li>)}</ul>
    <p className="g-muted">Sources consultées par le kit le 23/11/2026. Montants en argent fictif du jeu.</p>
  </section>;
}

function MapButton({ ctx, pl }: { ctx: GtaCtx; pl: MoneyLocation }) {
  const rect = parseGrid(pl.grid);
  return rect ? <button className="g-btn soft" onClick={() => ctx.showOnMap(rect, pl.title)}><MapPin size={16} /> Voir la zone sur la carte</button> : null;
}

function PlaceSheet({ ctx, pl, onClose }: { ctx: GtaCtx; pl: MoneyLocation; onClose: () => void }) {
  return <>
    <article className="g-card">
      <button className="g-btn ghost" style={{ alignSelf: 'flex-start' }} onClick={onClose}><ChevronLeft size={16} /> Argent et trésors</button>
      <p className="g-label">{CATEGORY[pl.category] ?? pl.category} · dès le chapitre {pl.chapter_min} · difficulté {pl.difficulty}</p>
      <h2 className="g-title" style={{ margin: 0 }}>{pl.title}</h2>
      <p className="g-muted">{pl.region} · {pl.grid}</p>
      <div className="g-row"><MapButton ctx={ctx} pl={pl} /></div>
      <div className="g-field"><span>Accès</span><p>{pl.access}</p></div>
      <div className="g-field"><span>Repères</span><ul style={{ margin: 0, paddingLeft: 18 }}>{pl.landmarks.map((l) => <li key={l}>{l}</li>)}</ul></div>
      <div className="g-amounts">
        <div className="g-money"><span className="g-label">Espèces annoncées</span><b>{pl.amount_cash_reported !== null ? '≈ ' + fmt(pl.amount_cash_reported) : '—'}</b></div>
        <div className="g-money nominal"><span className="g-label">Valeur nominale annoncée</span><b>{pl.amount_other_nominal !== null ? '≈ ' + fmt(pl.amount_other_nominal) : '—'}</b></div>
      </div>
      {pl.notes.map((n) => <p key={n} className="g-alert"><AlertTriangle size={16} aria-hidden="true" /> {n}</p>)}
      <p className="g-label">Étapes à cocher</p><Steps ctx={ctx} pl={pl} />
    </article>
    <MyGains ctx={ctx} pl={pl} />
    <Sources pl={pl} />
  </>;
}

/** Fiche exemplaire : station de recherche de Pelican Valley. */
function PelicanSheet({ ctx, pl, onClose }: { ctx: GtaCtx; pl: MoneyLocation; onClose: () => void }) {
  const [shown, setShown] = useState<Set<number>>(new Set());
  const crop = ctx.images.urlFor('pelican-swamps-overview');
  const m = moneyOf(ctx.p, pl.id);
  return <>
    <article className="g-card">
      <button className="g-btn ghost" style={{ alignSelf: 'flex-start' }} onClick={onClose}><ChevronLeft size={16} /> Argent et trésors</button>
      <p className="g-label">Cache et énigme · dès le chapitre {pl.chapter_min} · difficulté {pl.difficulty}</p>
      <h2 className="g-title" style={{ margin: 0, fontSize: '1.4rem' }}>{pl.title}</h2>
      <p>Une station oubliée au milieu des marais, quatre codes et deux butins qu’il ne faut surtout pas confondre. Carnet de bord ci-dessous.</p>
      <div className="g-bar" aria-label={'Énigme : ' + m.steps.length + ' étapes sur ' + pl.steps.length}><span style={{ width: (m.steps.length / pl.steps.length) * 100 + '%' }} /></div>
      {crop ? <button className="g-tile wide" onClick={() => ctx.go('galerie')} aria-label="Ouvrir le recadrage des marais dans la galerie"><img src={crop} alt="Recadrage des marais de Pelican Valley, d’après ma carte" /><span className="g-cap">Repérage approximatif · recadrage de ma carte</span></button>
        : <p className="g-alert info">Le recadrage des marais n’est pas encore importé sur cet appareil : ajoute-le dans la galerie.</p>}
      <p className="g-alert info"><MapPin size={16} aria-hidden="true" /> Repérage approximatif : {PELICAN.repere}</p>
      <div className="g-row"><MapButton ctx={ctx} pl={pl} /><span className="g-muted">{pl.grid}</span></div>
    </article>
    <section className="g-card"><p className="g-label">Secteur</p><p>{PELICAN.secteur}</p>
      <p className="g-label">Itinéraire</p><ol style={{ margin: 0, paddingLeft: 20 }}>{PELICAN.itineraire.map((s) => <li key={s}>{s}</li>)}</ol>
      <p className="g-label">Repères</p><ul style={{ margin: 0, paddingLeft: 18 }}>{pl.landmarks.map((l) => <li key={l}>{l}</li>)}</ul>
    </section>
    <section className="g-card"><p className="g-label">Les bâtiments</p>
      {PELICAN.batiments.map((b) => <div key={b.nom} className="g-field"><span>{b.nom}</span><p>{b.detail}</p></div>)}
    </section>
    <section className="g-card" aria-labelledby="g-pel-codes"><p className="g-label" id="g-pel-codes">Indices et codes</p>
      <p className="g-muted">Les codes restent cachés : touche « Révéler » seulement si tu bloques.</p>
      {PELICAN.indices.map((x, i) => <div key={x.ou} className="g-field"><span>{x.ou}</span><p>{x.indice}</p>
        {x.code && (shown.has(i) ? <p><KeyRound size={14} aria-hidden="true" /> {x.pour} : <span className="g-code">{x.code}</span></p>
          : <button className="g-reveal" onClick={() => setShown((s) => new Set(s).add(i))}><Eye size={14} /> Révéler le code {x.pour ? 'du ' + x.pour : ''}</button>)}</div>)}
    </section>
    <section className="g-card"><p className="g-label">Énigme pas à pas</p><Steps ctx={ctx} pl={pl} /></section>
    <section className="g-card"><p className="g-label">Récompenses annoncées</p>
      <div className="g-amounts">{PELICAN.gains.map((g) => <div key={g.label} className={'g-money' + (g.nature === 'nominal' ? ' nominal' : '')}><span className="g-label">{g.label}</span><b>≈ {fmt(g.montant)}</b><span className="g-muted">{g.detail}</span></div>)}</div>
      <p className="g-alert"><AlertTriangle size={16} aria-hidden="true" /> {PELICAN.attention}</p>
      {pl.notes.map((n) => <p key={n} className="g-muted">{n}</p>)}
    </section>
    <MyGains ctx={ctx} pl={pl} />
    <Sources pl={pl} />
  </>;
}
