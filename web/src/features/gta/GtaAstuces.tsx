import { Check, Info } from 'lucide-react';
import { ASTUCES_SOURCE, AVANT_CHECKING_OUT, CHECKING_OUT_ID, CONSEILS, GARDER_VOITURE, REGLAGES, VOITURES_RARES } from './astuces';
import { missionDone, toggleCheck } from './progress';
import type { GtaCtx } from './ctx';

function CheckRow({ ctx, id, title, children, badge }: { ctx: GtaCtx; id: string; title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  const on = Boolean(ctx.p.checks[id]);
  return <div className={'g-mission' + (on ? ' done' : '')} style={{ alignItems: 'flex-start' }}>
    <div className="g-open" style={{ cursor: 'default', paddingTop: 6 }}><strong>{title}</strong>{badge}<span className="g-muted">{children}</span></div>
    <button className="g-check" aria-pressed={on} aria-label={(on ? 'Décocher : ' : 'Fait : ') + title} onClick={() => ctx.update((p) => toggleCheck(p, id))}>{on && <Check size={20} strokeWidth={3} />}</button>
  </div>;
}

/** Astuces communautaires : préparatifs avant « Checking Out », voitures rares, conseils de départ et réglages. */
export function GtaAstuces(ctx: GtaCtx) {
  const before = AVANT_CHECKING_OUT.filter((x) => ctx.p.checks['astuce:' + x.id]).length;
  const cars = VOITURES_RARES.filter((x) => ctx.p.checks['astuce:' + x.id]).length;
  return <>
    <p className="g-alert info"><Info size={16} aria-hidden="true" /> {ASTUCES_SOURCE}. Traduites et reformulées : à confirmer en jeu.</p>
    <section className="g-card" aria-labelledby="g-checkout">
      <div className="g-chapter-head"><h2 id="g-checkout" className="g-title" style={{ margin: 0, fontSize: '1.05rem' }}>Avant « Checking Out »</h2><span className="g-muted">{before}/{AVANT_CHECKING_OUT.length}</span></div>
      <p className="g-muted">Fin du chapitre 2, au Starlet Motel. Les cartes de Vicki et de Victor sont les seuls objets manquables signalés.{missionDone(ctx.p, CHECKING_OUT_ID) ? ' Tu as déjà terminé cette mission.' : ''}</p>
      <button className="g-btn ghost" style={{ alignSelf: 'flex-start' }} onClick={() => ctx.openMission(CHECKING_OUT_ID)}>Voir la mission « Checking Out »</button>
      <div className="g-list">{AVANT_CHECKING_OUT.map((x) => <CheckRow key={x.id} ctx={ctx} id={'astuce:' + x.id} title={x.titre} badge={x.manquable ? <span className="g-badge warn">Manquable</span> : undefined}>{x.texte}</CheckRow>)}</div>
    </section>
    <section className="g-card" aria-labelledby="g-cars">
      <div className="g-chapter-head"><h2 id="g-cars" className="g-title" style={{ margin: 0, fontSize: '1.05rem' }}>8 voitures rares à voler</h2><span className="g-muted">{cars}/{VOITURES_RARES.length} dans mon garage</span></div>
      <div className="g-list">{VOITURES_RARES.map((v) => <CheckRow key={v.id} ctx={ctx} id={'astuce:' + v.id} title={v.nom}
        badge={<span className="g-row" style={{ gap: 4 }}><span className="g-badge info">{v.zone}</span>{!v.lisible && <span className="g-badge warn">Lecture partielle</span>}</span>}>
        {v.look}. Où : {v.ou} {v.note}</CheckRow>)}</div>
      <p className="g-label">Pour garder une voiture volée</p>
      <ol style={{ margin: 0, paddingLeft: 20 }}>{GARDER_VOITURE.map((g) => <li key={g.id}><b>{g.titre}</b> : {g.texte}</li>)}</ol>
    </section>
    <details className="g-card"><summary className="g-title" style={{ minHeight: 44, display: 'flex', alignItems: 'center', fontSize: '1.05rem', cursor: 'pointer' }}>20 conseils pour bien démarrer</summary>
      <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>{CONSEILS.map((c) => <li key={c.id}><b>{c.titre}</b> : {c.texte}</li>)}</ol>
    </details>
    <details className="g-card"><summary className="g-title" style={{ minHeight: 44, display: 'flex', alignItems: 'center', fontSize: '1.05rem', cursor: 'pointer' }}>12 réglages à changer</summary>
      <div className="g-table">{REGLAGES.map((r) => <div key={r.id}><span><b>{r.titre}</b><br /><span className="g-muted">{r.texte}</span></span><span className="g-badge ok">{r.valeur}</span></div>)}</div>
    </details>
  </>;
}
