import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { AlertTriangle, Car, Coins, Compass, Download, Play, Upload } from 'lucide-react';
import { DATA_VERSION, MISSIONS, MONEY_PLACES, MONEY_UNIT, missionMissable, rewardOf } from './data';
import { exportProgress, mergeProgress, missionDone, missionStats, moneyOf, moneyTotals, parseExport, rewardLinks } from './progress';
import { PELICAN_ID } from './pelican';
import type { GtaCtx } from './ctx';

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const clean = (t: string) => t.replace(/^\[[^\]]+\]\s*/, '');

export function GtaHome(ctx: GtaCtx) {
  const { p } = ctx;
  const stats = missionStats(MISSIONS, p);
  const totals = moneyTotals(MONEY_PLACES, p, useMemo(() => rewardLinks(MISSIONS, rewardOf), []));
  const next = MISSIONS.find((m) => m.chapter === stats.current && !missionDone(p, m.id)) ?? MISSIONS.find((m) => !missionDone(p, m.id));
  const resume = p.recent.map((id) => MISSIONS.find((m) => m.id === id)).find((m) => m && !missionDone(p, m.id)) ?? next;
  const missables = MISSIONS.filter((m) => missionMissable(m) && !missionDone(p, m.id) && m.chapter <= stats.current);
  const recent = p.recent.map((id) => MISSIONS.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => Boolean(m)).slice(0, 4);
  const progress = pct(stats.done, stats.total);
  const pel = moneyOf(p, PELICAN_ID), pelPlace = MONEY_PLACES.find((x) => x.id === PELICAN_ID);
  return <>
    <section className="g-hero" aria-labelledby="g-hero-title">
      <div className="g-hero-card">
        <p className="g-label">Carnet de voyage · Leonida</p>
        <h1 id="g-hero-title" className="g-title">Chapitre {stats.current}</h1>
        <p>{stats.done} missions bouclées sur {stats.total} : {progress} % du road trip.</p>
        <div className="g-road" role="img" aria-label={'Progression : ' + progress + ' %, chapitre ' + stats.current + ' sur 5'}>
          <div className="g-road-track" /><div className="g-road-fill" style={{ width: progress + '%' }} />
          {stats.byChapter.map((c, i) => <span key={c.chapter} className={'g-road-stop' + (c.total && c.done === c.total ? ' done' : '')} style={{ left: (i / 4) * 100 + '%' }}>{c.chapter}</span>)}
          <Car className="g-road-car" size={24} style={{ left: progress + '%' }} aria-hidden="true" />
        </div>
      </div>
    </section>
    <div className="g-row">
      {resume && <button className="g-btn" onClick={() => ctx.openMission(resume.id)}><Play size={16} /> Reprendre</button>}
      <button className="g-btn ghost" onClick={() => ctx.go('missions')}><Compass size={16} /> Explorer</button>
    </div>
    {resume && <p className="g-muted">Prochaine étape : <b>{clean(resume.title)}</b> (ch. {resume.chapter})</p>}
    <div className="g-stats">
      <div className="g-stat"><b>{stats.done}</b><small>terminées</small></div>
      <div className="g-stat"><b>{stats.total - stats.done}</b><small>disponibles</small></div>
      <div className="g-stat"><b>{totals.confirmed.toLocaleString('fr-FR')}</b><small>{MONEY_UNIT} confirmés</small></div>
    </div>
    <section className="g-card"><p className="g-label">Par chapitre</p>
      {stats.byChapter.map((c) => <div key={c.chapter} className="g-field"><span>Chapitre {c.chapter} · {c.done}/{c.total} · {pct(c.done, c.total)} %</span><div className="g-bar"><span style={{ width: pct(c.done, c.total) + '%' }} /></div></div>)}
    </section>
    {missables.length > 0 && <section className="g-card" aria-labelledby="g-missables"><p className="g-label" id="g-missables"><AlertTriangle size={14} aria-hidden="true" /> Potentiellement manquable</p>
      {missables.map((m) => <button key={m.id} className="g-reveal" onClick={() => ctx.openMission(m.id)}><b>{clean(m.title)}</b> · chapitre {m.chapter}</button>)}
    </section>}
    {pelPlace && <button className="g-place featured" onClick={() => ctx.openMoney(PELICAN_ID)}>
      <span className="g-row" style={{ gap: 4 }}><Coins size={16} aria-hidden="true" /><span className="g-badge ok">Fiche détaillée</span></span>
      <strong className="g-title">{pelPlace.title}</strong>
      <span className="g-muted">Énigme en {pelPlace.steps.length} étapes : {pel.steps.length} faite{pel.steps.length > 1 ? 's' : ''}.</span>
    </button>}
    {recent.length > 0 && <section className="g-card"><p className="g-label">Consultées récemment</p>
      {recent.map((m) => <button key={m.id} className="g-reveal" onClick={() => ctx.openMission(m.id)}>{clean(m.title)} · ch. {m.chapter}{missionDone(p, m.id) ? ' · terminée' : ''}</button>)}
    </section>}
    {stats.orphans.length > 0 && <p className="g-alert info">{stats.orphans.length} mission(s) cochée(s) ne figurent plus dans les données : ta progression est conservée.</p>}
    <Backup ctx={ctx} />
  </>;
}

/** Sauvegarde et restauration de la progression (fichier JSON), sans écraser l'état actuel. */
function Backup({ ctx }: { ctx: GtaCtx }) {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const download = () => {
    const blob = new Blob([exportProgress(ctx.p, DATA_VERSION)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'gta-vi-progression-' + ctx.today + '.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const load = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = ''; if (!f) return;
    try { const incoming = parseExport(await f.text()); ctx.update((p) => mergeProgress(p, incoming)); setMsg('Progression importée et fusionnée.'); }
    catch (x) { setMsg(x instanceof Error ? x.message : 'Import impossible.'); }
  };
  return <section className="g-card"><p className="g-label">Sauvegarde de ma progression</p>
    <p className="g-muted">Ta progression est enregistrée avec tes autres données My Thirties, y compris hors connexion. Tu peux aussi l’exporter en fichier.</p>
    <div className="g-row"><button className="g-btn ghost" onClick={download}><Download size={16} /> Exporter</button>
      <button className="g-btn ghost" onClick={() => input.current?.click()}><Upload size={16} /> Importer</button>
      <input ref={input} type="file" accept="application/json,.json" hidden style={{ display: 'none' }} onChange={(e) => void load(e)} /></div>
    {msg && <p className="g-muted" role="status">{msg}</p>}
  </section>;
}
