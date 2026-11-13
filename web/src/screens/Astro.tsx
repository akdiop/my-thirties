import { useMemo, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';
import { ASPECTS, aspectsOf, ASTRO_KIND, balanceOf, chartOf, cleDuJour, degLabel, ELEMENT_SENS, HOUSES, housesOf, lectureAspect, lectureGenerique, lectureMaison, lectureSigne, lonOf, MODE_SENS, parseEvozen,
  PISTES, PLANETS, planetOf, ROMAN, SIGNS, signOf, syntheseOf, type Chart, type Lecture, type Placement } from '../lib/astro';
import { isoOf, NOTE_KIND } from '../lib/rituals';
import { Bar, Segmented } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Tab = 'theme' | 'planetes' | 'maisons' | 'aspects' | 'pistes' | 'comprendre';
type Write = (question: string, answer: string) => Promise<void>;

/** Mon thème astral : roue du ciel de naissance, planètes, maisons, aspects, pistes concrètes et repères pour comprendre. */
export function Astro({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const saved = chartOf(entries);
  const [tab, setTab] = useState<Tab>('theme');
  const [importing, setImporting] = useState(false);
  const today = isoOf(new Date());
  const write: Write = async (question, answer) => {
    await onCreate({ module: 'equilibre', kind: NOTE_KIND, title: 'Mon thème · ' + question.slice(0, 120), entry_date: today,
      data: { noteId: crypto.randomUUID(), type: 'insight', heading: 'Mon thème · ' + question.slice(0, 120), body: question + '\n\n' + answer, folder: 'journal', mood: '', media: [], updated: new Date().toISOString() } });
  };
  const store = async (chart: Chart) => {
    const data = { placements: chart.placements, naissance: chart.naissance ?? '', label: 'Mon thème astral' };
    if (saved) await onUpdate(saved.entry, { ...saved.entry.data, ...data }); else await onCreate({ module: 'equilibre', kind: ASTRO_KIND, title: 'Mon thème astral', entry_date: null, data });
    setImporting(false);
  };
  if (!saved || importing) return <div className="screen astro">
    <header className="tab-head"><h1>Mon thème astral</h1><p>Mon ciel de naissance, pour mieux me connaître</p></header>
    <ImportChart onSave={store} onCancel={saved ? () => setImporting(false) : undefined} />
  </div>;
  const chart = saved.chart;
  return <div className="screen astro">
    <header className="tab-head"><h1>Mon thème astral</h1><p>{syntheseOf(chart).trio}</p></header>
    <Segmented label="Thème astral" value={tab} onChange={setTab} options={[{ value: 'theme', label: 'Thème' }, { value: 'planetes', label: 'Planètes' }, { value: 'maisons', label: 'Maisons' },
      { value: 'aspects', label: 'Aspects' }, { value: 'pistes', label: 'Pistes' }, { value: 'comprendre', label: 'Repères' }]} />
    {tab === 'theme' && <Overview chart={chart} today={today} onWrite={write} onReimport={() => setImporting(true)} />}
    {tab === 'planetes' && <Planets chart={chart} onWrite={write} />}
    {tab === 'maisons' && <Houses chart={chart} />}
    {tab === 'aspects' && <Aspects chart={chart} onWrite={write} />}
    {tab === 'pistes' && <Pistes chart={chart} onWrite={write} />}
    {tab === 'comprendre' && <Reperes />}
  </div>;
}

function ImportChart({ onSave, onCancel }: { onSave: (c: Chart) => Promise<void>; onCancel?: () => void }) {
  const [text, setText] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const preview = useMemo(() => (text.trim() ? parseEvozen(text) : null), [text]);
  return <div className="stack-8">
    <section className="ritual-card form-stack">
      <p className="ritual-label">Importer mon thème</p>
      <p className="muted">Copie le texte de ton thème Evozen (au minimum le tableau « Planètes du ciel de naissance » et la ligne de l’ascendant), puis colle-le ici. Il reste dans tes données privées.</p>
      <textarea rows={8} value={text} aria-label="Texte du thème" placeholder={'Ascendant Lion\nSitué en Lion à 09°17\n…\nSoleil Capricorne 26°51 VI\nLune Gémeaux 26°16 XI\n…'} onChange={(e) => { setText(e.target.value); setError(''); }} />
      {preview && <p className="muted">{preview.placements.length} positions reconnues : {preview.placements.map((p) => planetOf(p.id)!.label + ' en ' + signOf(p.sign)!.label).join(', ')}.</p>}
      {error && <p className="fineprint" role="alert">{error}</p>}
      <div className="button-group">
        <button className="button primary" disabled={busy || !text.trim()} onClick={async () => {
          if (!preview) { setError('Je ne reconnais pas assez de positions. Vérifie que le tableau des planètes est bien copié.'); return; }
          setBusy(true); try { await onSave(preview); } catch { setError('Enregistrement impossible pour le moment.'); } finally { setBusy(false); } }}>{busy ? 'Enregistrement…' : 'Enregistrer mon thème'}</button>
        {onCancel && <button className="button ghost" onClick={onCancel}>Annuler</button>}
      </div>
    </section>
  </div>;
}

/** La roue du ciel de naissance : signes, planètes et aspects, ascendant à gauche. */
function Wheel({ chart }: { chart: Chart }) {
  const asc = chart.placements.find((p) => p.id === 'ascendant');
  const ascLon = asc ? lonOf(asc) : 0, C = 160;
  const pt = (lon: number, r: number) => { const t = ((180 + lon - ascLon) * Math.PI) / 180; return { x: C + r * Math.cos(t), y: C - r * Math.sin(t) }; };
  const planets = chart.placements.filter((p) => p.id !== 'ascendant' && p.id !== 'noeud_sud').sort((a, b) => lonOf(a) - lonOf(b));
  // Étiquettes écartées d'au moins 9° pour rester lisibles quand plusieurs planètes se suivent ; un trait les relie à leur position.
  const labels = planets.map(lonOf);
  for (let pass = 0; pass < 30; pass++) for (let i = 1; i < labels.length; i++) { const gap = labels[i]! - labels[i - 1]!; if (gap < 9) { const push = (9 - gap) / 2; labels[i - 1]! -= push; labels[i]! += push; } }
  const tone = { fluide: '#5F7A59', tendu: '#B08A6E', ajustement: '#C2B48C', fusion: '#7E7254' } as const;
  return <svg className="astro-wheel" viewBox="0 0 320 320" role="img" aria-label="Roue de mon thème astral">
    <circle cx={C} cy={C} r={152} className="w-outer" /><circle cx={C} cy={C} r={124} className="w-ring" /><circle cx={C} cy={C} r={64} className="w-inner" />
    {SIGNS.map((s, i) => { const a = pt(i * 30, 124), b = pt(i * 30, 152), m = pt(i * 30 + 15, 138);
      return <g key={s.id}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="w-tick" /><text x={m.x} y={m.y} className={'w-sign el-' + s.element.toLowerCase()}>{s.abbr}</text></g>; })}
    {aspectsOf(chart).filter((x) => x.type.nature !== 'fusion' && x.a.id !== 'ascendant' && x.b.id !== 'ascendant').map((x) => { const a = pt(lonOf(x.a), 64), b = pt(lonOf(x.b), 64);
      return <line key={x.a.id + x.b.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={tone[x.type.nature]} strokeOpacity={0.25 + x.power / 160} strokeWidth={1.2} />; })}
    {asc && (() => { const a = pt(ascLon, 152), d = pt(ascLon + 180, 152); return <><line x1={a.x} y1={a.y} x2={d.x} y2={d.y} className="w-axis" /><text x={a.x + 4} y={a.y - 6} className="w-asc">AS</text></>; })()}
    {planets.map((p, i) => { const at = pt(labels[i]!, 100), dot = pt(lonOf(p), 120), lead = pt(labels[i]!, 109);
      return <g key={p.id}><circle cx={dot.x} cy={dot.y} r={2.4} className="w-dot" /><line x1={dot.x} y1={dot.y} x2={lead.x} y2={lead.y} className="w-lead" /><text x={at.x} y={at.y} className="w-planet">{planetOf(p.id)!.abbr}</text></g>; })}
  </svg>;
}

function LectureCard({ l, onWrite }: { l: Lecture; onWrite?: Write }) {
  const [answer, setAnswer] = useState(''), [open, setOpen] = useState(false), [done, setDone] = useState(false);
  return <div className="astro-lecture">
    <p className="astro-essentiel">{l.essentiel}</p>
    {l.details?.map((d) => <div key={d.titre} className="astro-detail"><p className="ritual-label">{d.titre}</p><p>{d.texte}</p></div>)}
    {l.forces.length > 0 && <><p className="ritual-label">Mes forces</p><ul className="astro-list">{l.forces.map((f) => <li key={f}>{f}</li>)}</ul></>}
    {l.vigilance.length > 0 && <><p className="ritual-label">Points de vigilance</p><ul className="astro-list soft">{l.vigilance.map((f) => <li key={f}>{f}</li>)}</ul></>}
    <p className="astro-conseil"><strong>Conseil</strong> {l.conseil}</p>
    {onWrite && (done ? <p className="muted">Ajouté à ton journal.</p> : open ? <div className="form-stack">
      <label>{l.question}<textarea rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} /></label>
      <button className="button secondary small" disabled={!answer.trim()} onClick={async () => { await onWrite(l.question, answer.trim()); setDone(true); }}>Garder dans mon journal</button></div>
      : <button className="link-btn small" onClick={() => setOpen(true)}>Question pour moi : {l.question}</button>)}
  </div>;
}

function Overview({ chart, today, onWrite, onReimport }: { chart: Chart; today: string; onWrite: Write; onReimport: () => void }) {
  const s = syntheseOf(chart), b = balanceOf(chart), cle = cleDuJour(chart, today);
  const big = (['soleil', 'lune', 'ascendant'] as const).map((id) => chart.placements.find((p) => p.id === id)).filter((p): p is Placement => Boolean(p));
  const max = Math.max(...b.elements.map(([, n]) => n));
  return <div className="stack-8">
    <section className="ritual-card astro-wheel-card"><Wheel chart={chart} />
      <p className="fineprint">Ascendant à gauche · lignes vertes : aspects fluides · lignes caramel : tensions · {chart.naissance}</p></section>
    {cle && <section className="ritual-card"><p className="ritual-label">Ma clé du jour</p><p className="astro-essentiel">{cle.conseil}</p><small className="muted">{cle.titre}</small></section>}
    <div className="astro-trio">{big.map((p) => { const sg = signOf(p.sign)!; return <div key={p.id} className="soft-card">
      <small className="ritual-label">{planetOf(p.id)!.label}</small><strong>{sg.label}</strong><small className="muted">{sg.mots.join(' · ')}</small></div>; })}</div>
    <section className="ritual-card"><p className="ritual-label">Ma synthèse</p>
      <p className="astro-essentiel">Un thème dominé par l’élément <strong>{s.element}</strong> ({ELEMENT_SENS[s.element]}), puis {s.element2} ({ELEMENT_SENS[s.element2]}), et par le mode <strong>{s.mode}</strong> ({MODE_SENS[s.mode]}).
        {s.maison && <> La maison la plus habitée est la <strong>{HOUSES[s.maison.n - 1]!.nom}</strong> ({s.maison.planetes.join(', ')}) : {HOUSES[s.maison.n - 1]!.domaine.charAt(0).toLowerCase() + HOUSES[s.maison.n - 1]!.domaine.slice(1)}</>}</p>
      {b.elements.map(([el, n]) => <div key={el} className="habit-rate"><span>{el}</span><Bar value={n / max} tone={el === 'Terre' ? 'olive' : el === 'Eau' ? 'sauge' : 'caramel'} /><small>{n}</small></div>)}
      <p className="fineprint">Planètes personnelles et ascendant comptent double.</p></section>
    {big.map((p) => { const l = lectureSigne(p) ?? lectureGenerique(p); return <details key={p.id} className="soft-card"><summary className="ritual-label">{l.titre}</summary><LectureCard l={l} onWrite={onWrite} /></details>; })}
    <button className="link-btn small" onClick={onReimport}>Mettre à jour mon thème</button>
  </div>;
}

function Planets({ chart, onWrite }: { chart: Chart; onWrite: Write }) {
  const order = PLANETS.map((p) => p.id);
  const list = [...chart.placements].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return <div className="stack-8">
    {list.map((p) => { const pl = planetOf(p.id)!, sg = signOf(p.sign)!, ls = lectureSigne(p) ?? lectureGenerique(p), lm = lectureMaison(p);
      return <details key={p.id} className="soft-card astro-planet"><summary><span className="astro-abbr">{pl.abbr}</span><span className="workout-title"><strong>{pl.label} en {sg.label}{p.retro ? ' (rétrograde)' : ''}</strong>
        <small>{degLabel(p.deg)}{p.house ? ' · ' + HOUSES[p.house - 1]!.nom : ''} · {pl.domaine}</small></span></summary>
        <LectureCard l={ls} onWrite={onWrite} />
        {lm && <><p className="ritual-label astro-sub">{lm.titre}</p><LectureCard l={lm} onWrite={onWrite} /></>}
      </details>; })}
  </div>;
}

function Houses({ chart }: { chart: Chart }) {
  const byHouse = new Map(housesOf(chart));
  return <div className="stack-8"><p className="muted">Les maisons sont les douze domaines de la vie. Celles qui accueillent des planètes sont les plus actives dans ton thème.</p>
    {HOUSES.map((h) => { const ps = byHouse.get(h.n) ?? [];
      return <div key={h.n} className={'soft-card astro-house' + (ps.length ? ' on' : '')}><span className="astro-abbr">{ROMAN[h.n]}</span><span className="workout-title"><strong>{h.domaine}</strong>
        <small>{ps.length ? ps.map((p) => planetOf(p.id)!.label + ' en ' + signOf(p.sign)!.label).join(' · ') : 'Aucune planète'}</small></span></div>; })}</div>;
}

function Aspects({ chart, onWrite }: { chart: Chart; onWrite: Write }) {
  const list = aspectsOf(chart);
  return <div className="stack-8"><p className="muted">Les aspects sont les dialogues entre tes planètes. Plus l’angle est exact, plus l’aspect est puissant.</p>
    {list.map((x) => { const l = lectureAspect(x.a.id, x.type.id, x.b.id);
      return <details key={x.a.id + x.b.id} className="soft-card"><summary className="astro-sum"><span className="workout-title"><strong>{planetOf(x.a.id)!.label} {x.type.label.toLowerCase()} {planetOf(x.b.id)!.label}</strong>
        <small>{x.type.nature === 'fluide' ? 'Aspect fluide' : x.type.nature === 'tendu' ? 'Aspect tendu' : x.type.nature === 'fusion' ? 'Fusion' : 'Ajustement'} · puissance {x.power} %</small></span></summary>
        <Bar value={x.power / 100} tone={x.type.nature === 'fluide' ? 'sauge' : 'caramel'} />
        {l ? <LectureCard l={l} onWrite={onWrite} /> : <p className="astro-essentiel">{x.type.sens} Ici entre {planetOf(x.a.id)!.domaine.toLowerCase()} et {planetOf(x.b.id)!.domaine.toLowerCase()}</p>}
      </details>; })}</div>;
}

function Pistes({ chart, onWrite }: { chart: Chart; onWrite: Write }) {
  const questions = chart.placements.flatMap((p) => [lectureSigne(p), lectureMaison(p)]).filter((l): l is Lecture => Boolean(l));
  return <div className="stack-8">
    {PISTES.map((p) => <section key={p.domaine} className="ritual-card"><p className="ritual-label">{p.domaine}</p><ul className="astro-list">{p.points.map((x) => <li key={x}>{x}</li>)}</ul></section>)}
    <section className="ritual-card"><p className="ritual-label">Questions pour mon journal</p>
      {questions.map((l) => <details key={l.titre} className="astro-q"><summary>{l.question}</summary><LectureCard l={{ ...l, forces: [], vigilance: [] }} onWrite={onWrite} /></details>)}</section>
  </div>;
}

function Reperes() {
  return <div className="stack-8">
    <details className="soft-card"><summary className="ritual-label">Les 12 signes</summary>{SIGNS.map((s) => <div key={s.id} className="astro-def"><strong>{s.label}</strong><small className="muted">{s.element} · {s.mode} · maître : {s.maitre}</small><p>{s.essence} <em>Ombre : {s.ombre}</em></p></div>)}</details>
    <details className="soft-card"><summary className="ritual-label">Les planètes et les points</summary>{PLANETS.map((p) => <div key={p.id} className="astro-def"><strong>{p.label}</strong><p>{p.domaine} <em>{p.question}</em></p></div>)}</details>
    <details className="soft-card"><summary className="ritual-label">Les 12 maisons</summary>{HOUSES.map((h) => <div key={h.n} className="astro-def"><strong>{h.nom}</strong><p>{h.domaine}</p></div>)}</details>
    <details className="soft-card"><summary className="ritual-label">Les aspects</summary>{ASPECTS.map((a) => <div key={a.id} className="astro-def"><strong>{a.label} ({a.angle}°)</strong><p>{a.sens}</p></div>)}</details>
    <details className="soft-card"><summary className="ritual-label">Éléments et modes</summary>
      {(Object.entries(ELEMENT_SENS) as [string, string][]).map(([k, v]) => <div key={k} className="astro-def"><strong>{k}</strong><p>{v}</p></div>)}
      {(Object.entries(MODE_SENS) as [string, string][]).map(([k, v]) => <div key={k} className="astro-def"><strong>{k}</strong><p>{v}</p></div>)}</details>
  </div>;
}
