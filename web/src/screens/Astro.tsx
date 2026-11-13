import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Entry, EntryInput } from '../lib/cloud';
import { ASPECTS, aspectsOf, ASTRO_KIND, balanceOf, chartOf, cleDuJour, degLabel, ELEMENT_SENS, HOUSES, housesOf, lectureAspect, lectureGenerique, lectureMaison, lectureSigne, lonOf, MODE_SENS, parseEvozen,
  PISTES, PLANETS, planetOf, ROMAN, SIGNS, signOf, syntheseOf, coachTheme, HABITUDES_THEME, lunaisons, prochesCharts, solarReturn, synastry, TCC_THEME, type Chart, type HabitIdea, type Lecture, type Placement } from '../lib/astro';
import { HABIT_KIND, isoOf, NOTE_KIND, ruleData } from '../lib/rituals';
import { askAssistant } from '../lib/assistant';
import { useIntegrationPrefs } from '../lib/integrations';
import { ALLAH_NAMES } from '../lib/asmaUlHusna';
import { hijriLabel, hijriOf, spiritualDay } from '../lib/hijri';
import { ficheAffectif, ficheExpression, ficheIslam, numerologieOf, type Fiche, type MaNumerologie } from '../lib/numerologie';
import { Bar } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Tab = 'theme' | 'planetes' | 'maisons' | 'aspects' | 'numero' | 'lunes' | 'proches' | 'pistes' | 'comprendre';
type Go = (s: 'tcc' | 'boussole' | 'bilan' | 'habits' | 'agenda') => void;
type Write = (question: string, answer: string) => Promise<void>;

/** Mon thème astral : roue du ciel de naissance, planètes, maisons, aspects, pistes concrètes et repères pour comprendre. */
export function Astro({ entries, onCreate, onUpdate, onRemove, onGo }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; onGo: (s: 'tcc' | 'boussole' | 'bilan' | 'habits' | 'agenda') => void }) {
  const saved = chartOf(entries);
  const [tab, setTab] = useState<Tab>('theme');
  const [importing, setImporting] = useState(false);
  const [printing, setPrinting] = useState(false);
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
  const chart = saved.chart, numero = numerologieOf(saved.entry.data);
  const TABS: [Tab, string][] = [['theme', 'Thème'], ['planetes', 'Planètes'], ['maisons', 'Maisons'], ['aspects', 'Aspects'], ['numero', 'Numérologie'], ['lunes', 'Lunes'], ['proches', 'Proches'], ['pistes', 'Pistes'], ['comprendre', 'Repères']];
  return <div className="screen astro">
    <header className="tab-head"><h1>Mon thème astral</h1><p>{syntheseOf(chart).trio}</p></header>
    <div className="gchips small astro-tabs" role="tablist" aria-label="Thème astral">{TABS.map(([v, l]) =>
      <button key={v} type="button" role="tab" aria-selected={tab === v} className={'gchip' + (tab === v ? ' on' : '')} onClick={() => setTab(v)}>{l}</button>)}</div>
    {tab === 'theme' && <Overview chart={chart} today={today} onWrite={write} onReimport={() => setImporting(true)} onPrint={() => setPrinting(true)} onGo={onGo} />}
    {tab === 'planetes' && <Planets chart={chart} onWrite={write} />}
    {tab === 'maisons' && <Houses chart={chart} />}
    {tab === 'aspects' && <Aspects chart={chart} onWrite={write} />}
    {tab === 'numero' && <Numerologie numero={numero} />}
    {tab === 'lunes' && <Lunes chart={chart} onWrite={write} onCreate={onCreate} />}
    {tab === 'proches' && <Proches chart={chart} entries={entries} onCreate={onCreate} onRemove={onRemove} />}
    {tab === 'pistes' && <Pistes chart={chart} entries={entries} numero={numero} onWrite={write} onCreate={onCreate} onGo={onGo} />}
    {tab === 'comprendre' && <Reperes />}
    {printing && <PrintChart chart={chart} numero={numero} onDone={() => setPrinting(false)} />}
  </div>;
}

function ImportChart({ onSave, onCancel, title = 'Importer mon thème', withName }: { onSave: (c: Chart, nom: string) => Promise<void>; onCancel?: () => void; title?: string; withName?: boolean }) {
  const [nom, setNom] = useState('');
  const [text, setText] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const preview = useMemo(() => (text.trim() ? parseEvozen(text) : null), [text]);
  return <div className="stack-8">
    <section className="ritual-card form-stack">
      <p className="ritual-label">{title}</p>
      {withName && <label>Prénom<input value={nom} maxLength={40} onChange={(e) => setNom(e.target.value)} /></label>}
      <p className="muted">Copie le texte de ton thème Evozen (au minimum le tableau « Planètes du ciel de naissance » et la ligne de l’ascendant), puis colle-le ici. Il reste dans tes données privées.</p>
      <textarea rows={8} value={text} aria-label="Texte du thème" placeholder={'Ascendant Lion\nSitué en Lion à 09°17\n…\nSoleil Capricorne 26°51 VI\nLune Gémeaux 26°16 XI\n…'} onChange={(e) => { setText(e.target.value); setError(''); }} />
      {preview && <p className="muted">{preview.placements.length} positions reconnues : {preview.placements.map((p) => planetOf(p.id)!.label + ' en ' + signOf(p.sign)!.label).join(', ')}.</p>}
      {error && <p className="fineprint" role="alert">{error}</p>}
      <div className="button-group">
        <button className="button primary" disabled={busy || !text.trim() || (withName && !nom.trim())} onClick={async () => {
          if (!preview) { setError('Je ne reconnais pas assez de positions. Vérifie que le tableau des planètes est bien copié.'); return; }
          setBusy(true); try { await onSave(preview, nom.trim()); } catch { setError('Enregistrement impossible pour le moment.'); } finally { setBusy(false); } }}>{busy ? 'Enregistrement…' : 'Enregistrer mon thème'}</button>
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

function Overview({ chart, today, onWrite, onReimport, onPrint, onGo }: { chart: Chart; today: string; onWrite: Write; onReimport: () => void; onPrint: () => void; onGo: Go }) {
  const solaire = solarReturn(chart, today);
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
    {solaire && <section className="ritual-card"><p className="ritual-label">Mon anniversaire solaire</p>
      <p className="astro-essentiel">{solaire.days === 0 ? 'Joyeux anniversaire : ta nouvelle année solaire commence aujourd’hui.' : 'Ta nouvelle année solaire commence dans ' + solaire.days + ' jour' + (solaire.days > 1 ? 's' : '') + ', le ' + new Date(solaire.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) + ' : tes ' + solaire.age + ' ans.'}</p>
      {solaire.days <= 45 && <>{SOLAIRE_QUESTIONS.map((q) => <details key={q} className="astro-q"><summary>{q}</summary><LectureCard l={{ titre: q, essentiel: '', forces: [], vigilance: [], conseil: 'Prends le temps : quelques lignes suffisent.', question: q }} onWrite={onWrite} /></details>)}</>}
      <div className="button-group"><button className="button secondary small" onClick={() => onGo('boussole')}>Ma boussole et ma vision</button><button className="button ghost small" onClick={() => onGo('bilan')}>Mon bilan</button></div></section>}
    <div className="button-group"><button className="button secondary small" onClick={onPrint}>Exporter mon thème en PDF</button><button className="link-btn small" onClick={onReimport}>Mettre à jour mon thème</button></div>
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

function Pistes({ chart, entries, numero, onWrite, onCreate, onGo }: { chart: Chart; entries: Entry[]; numero: MaNumerologie; onWrite: Write; onCreate: (i: EntryInput) => Promise<void>; onGo: Go }) {
  const questions = chart.placements.flatMap((p) => [lectureSigne(p), lectureMaison(p)]).filter((l): l is Lecture => Boolean(l));
  const habits = new Set(entries.filter((e) => e.kind === HABIT_KIND).map((e) => e.title));
  const [added, setAdded] = useState<string[]>([]);
  const add = async (h: HabitIdea) => {
    await onCreate({ module: 'quotidien', kind: HABIT_KIND, title: h.title, entry_date: null, data: { templateId: '', icon: h.icon, tint: 'sauge', why: h.why + ' (' + h.source + ')', level: 'Douce', ...ruleData(h.freq === 'daily' ? { type: 'daily', n: 1 } : { type: 'week', n: h.n ?? 1 }), done: {} } });
    setAdded((a) => [...a, h.title]);
  };
  return <div className="stack-8">
    {PISTES.map((p) => <section key={p.domaine} className="ritual-card"><p className="ritual-label">{p.domaine}</p><ul className="astro-list">{p.points.map((x) => <li key={x}>{x}</li>)}</ul></section>)}
    <section className="ritual-card"><p className="ritual-label">Des habitudes inspirées de mon thème</p>
      {HABITUDES_THEME.map((h) => { const on = habits.has(h.title) || added.includes(h.title);
        return <div key={h.title} className="astro-habit"><span className="workout-title"><strong>{h.title}</strong><small>{h.why} · {h.source} · {h.freq === 'daily' ? 'chaque jour' : h.n + ' fois par semaine'}</small></span>
          <button className="button ghost small" disabled={on} onClick={() => void add(h)}>{on ? 'Ajoutée' : 'Ajouter'}</button></div>; })}
      <button className="link-btn small" onClick={() => onGo('habits')}>Voir mes habitudes</button></section>
    <section className="ritual-card"><p className="ritual-label">Mes points de vigilance, avec mes outils TCC</p>
      {TCC_THEME.map((t) => <div key={t.vigilance} className="astro-def"><strong>{t.vigilance}</strong><small className="muted">{t.source}</small><p>Piège de pensée à repérer : <em>{t.distorsion}</em>. Outil : <strong>{t.outil}</strong>.</p>
        {(() => { const n = ALLAH_NAMES.find((x) => x.tr === t.nom); return n ? <p className="astro-nom">Un Nom d’Allah à méditer : <span lang="ar" dir="rtl">{n.ar}</span> <strong>{n.tr}</strong>, {n.fr.charAt(0).toLowerCase() + n.fr.slice(1)}</p> : null; })()}</div>)}
      <button className="button secondary small" onClick={() => onGo('tcc')}>Ouvrir mes outils TCC</button></section>
    <CoachTheme chart={chart} numero={numero} />
    <section className="ritual-card"><p className="ritual-label">Questions pour mon journal</p>
      {questions.map((l) => <details key={l.titre} className="astro-q"><summary>{l.question}</summary><LectureCard l={{ ...l, forces: [], vigilance: [], details: [] }} onWrite={onWrite} /></details>)}</section>
  </div>;
}

/** Le coach IA de mon thème : seulement à ma demande, avec l'assistant existant. */
function CoachTheme({ chart, numero }: { chart: Chart; numero: MaNumerologie }) {
  const { prefs } = useIntegrationPrefs();
  const [q, setQ] = useState(''), [answer, setAnswer] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState('');
  const num = [numero.expression && 'expression ' + numero.expression.n + (numero.expression.maitre ? ' (maître ' + numero.expression.maitre + ')' : ''), numero.affectif && 'vie affective ' + numero.affectif.n + (numero.affectif.maitre ? ' (maître ' + numero.affectif.maitre + ')' : '')].filter(Boolean).join(', ');
  return <section className="ritual-card form-stack"><p className="ritual-label">Mon coach thème astral</p>
    {!prefs.assistant ? <p className="privacy-hint">Le coach utilise l’assistant IA. Active-le dans Profil → Centre de confidentialité pour lui poser une question.</p> : <>
      <p className="muted">Il lit ton thème (positions et lectures) seulement quand tu lui poses une question.</p>
      <input value={q} maxLength={300} placeholder="Ex. Comment éviter de me surmener avec mon thème ?" aria-label="Question au coach" onChange={(e) => setQ(e.target.value)} />
      <button className="button secondary small" disabled={busy || !q.trim()} onClick={async () => { setBusy(true); setErr('');
        try { setAnswer(await askAssistant(q.trim(), { context: coachTheme(chart, num) })); } catch { setErr('Le coach n’a pas pu répondre. Réessaie dans un moment.'); } finally { setBusy(false); } }}>{busy ? 'Le coach réfléchit…' : 'Demander'}</button>
      {err && <p className="fineprint" role="alert">{err}</p>}
      {answer && <p className="coach-answer">{answer}</p>}</>}
  </section>;
}

const SOLAIRE_QUESTIONS = ['Qu’est-ce que cette année m’a appris sur moi ?', 'De quoi suis-je fière ?', 'Qu’est-ce que je laisse derrière moi ?', 'Quelle intention je pose pour ma nouvelle année ?'];

/** Ma numérologie : chiffre d'expression et chiffre de vie affective. */
function Numerologie({ numero }: { numero: MaNumerologie }) {
  const blocs = [{ titre: 'Mon chiffre d’expression', n: numero.expression, fiche: ficheExpression }, { titre: 'Mon chiffre de vie affective', n: numero.affectif, fiche: ficheAffectif }];
  if (!numero.expression && !numero.affectif) return <p className="muted">Ta numérologie n’est pas encore enregistrée.</p>;
  return <div className="stack-8">{blocs.map((b) => b.n && <section key={b.titre} className="ritual-card">
    <p className="ritual-label">{b.titre}</p>
    <div className="astro-numero"><strong>{b.n.n}</strong>{b.n.maitre && <span>Nombre maître {b.n.maitre}</span>}</div>
    {[b.fiche(b.n.n), b.fiche(b.n.maitre)].filter((f): f is Fiche => Boolean(f)).map((f) => <details key={f.titre} className="soft-card" open={f === b.fiche(b.n!.n)}><summary className="ritual-label">{f.titre}</summary>
      {f.devise && <p className="astro-essentiel"><em>{f.devise}</em></p>}
      {f.reperes && <div className="astro-reperes">{f.reperes.map(([k, v]) => <span key={k}><small className="muted">{k}</small>{v}</span>)}</div>}
      {f.sections.map((x) => <div key={x.titre} className="astro-detail"><p className="ritual-label">{x.titre}</p><p>{x.texte}</p></div>)}
      {f.offrir && <><p className="ritual-label">Ce qui me touche comme cadeau</p><ul className="astro-list">{f.offrir.map((o) => <li key={o}>{o}</li>)}</ul></>}
    </details>)}
  </section>)}
    {ficheIslam(numero.expression?.n ?? numero.affectif?.n) && (() => { const f = ficheIslam(numero.expression?.n ?? numero.affectif?.n)!;
      return <section className="ritual-card"><p className="ritual-label">Dans la tradition islamique</p><p className="astro-essentiel"><strong>{f.titre}</strong></p>
        {f.sections.map((x) => <div key={x.titre} className="astro-detail"><p className="ritual-label">{x.titre}</p><p>{x.texte}</p></div>)}</section>; })()}
  </div>;
}

/** Nouvelles et pleines lunes à venir : signe, planètes de mon thème touchées, intention et agenda. */
function Lunes({ chart, onWrite, onCreate }: { chart: Chart; onWrite: Write; onCreate: (i: EntryInput) => Promise<void> }) {
  const list = useMemo(() => lunaisons(new Date(Date.now() - 86_400_000), 8, chart), [chart]);
  const [added, setAdded] = useState<string[]>([]);
  return <div className="stack-8"><p className="muted">Dates calculées par l’app (calcul astronomique), à l’heure de ton téléphone. La nouvelle lune invite à poser une intention, la pleine lune à faire le bilan et à lâcher.</p>
    {list.map((l) => { const iso = isoOf(l.date), hm = l.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), key = l.type + iso;
      const titre = (l.type === 'nouvelle' ? 'Nouvelle lune' : 'Pleine lune') + ' en ' + l.sign.label;
      const q = l.type === 'nouvelle' ? 'Quelle intention je pose pour ce cycle (' + l.sign.mots.join(', ') + ') ?' : 'Qu’est-ce que je récolte, et qu’est-ce que je lâche ?';
      return <section key={key} className="ritual-card"><div className="astro-lune"><span className={'astro-moon ' + l.type} aria-hidden="true" /><span className="workout-title"><strong>{titre}</strong>
        <small>{l.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {hm}{l.touche.length ? ' · touche ton ' + l.touche.map((p) => planetOf(p.id)!.label).join(', ton ') : ''}</small></span></div>
        <IslamLune iso={iso} type={l.type} />
        <LectureCard l={{ titre, essentiel: '', forces: [], vigilance: [], conseil: l.type === 'nouvelle' ? 'Un nouveau départ dans le domaine du ' + l.sign.label + ' : ' + l.sign.essence.toLowerCase() : 'Un moment pour accueillir ce qui a mûri et relâcher ce qui pèse.', question: q }} onWrite={onWrite} />
        <button className="link-btn small" disabled={added.includes(key)} onClick={async () => { await onCreate({ module: 'quotidien', kind: 'event', title: titre, entry_date: iso, data: { date: iso, time: hm } }); setAdded((a) => [...a, key]); }}>{added.includes(key) ? 'Ajoutée à mon agenda' : 'Ajouter à mon agenda'}</button>
      </section>; })}
  </div>;
}

/** Le lien avec le calendrier hégirien : la nouvelle lune ouvre le mois, la pleine lune tombe sur les jours blancs. */
function IslamLune({ iso, type }: { iso: string; type: 'nouvelle' | 'pleine' }) {
  const h = hijriOf(iso);
  if (!h) return null;
  const days = Array.from({ length: 4 }, (_, i) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + (type === 'pleine' ? i - 2 : i)); return d.toISOString().slice(0, 10); });
  const blancs = days.filter((d) => (spiritualDay(d)?.fasts ?? []).some((f) => f.startsWith('Jour blanc')));
  const cle = days.map((d) => spiritualDay(d)?.key?.name).find(Boolean);
  return <p className="astro-nom">{type === 'nouvelle'
    ? <>Calendrier hégirien : {hijriLabel(h)}. Le nouveau mois commence autour de cette nouvelle lune, selon l’observation du croissant.</>
    : <>Calendrier hégirien : {hijriLabel(h)}.{blancs.length ? ' Jours blancs (jeûne recommandé) : ' + blancs.map((d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })).join(', ') + '.' : ''}</>}
    {cle && <> {cle}.</>}</p>;
}

/** Les thèmes de mes proches et nos affinités. */
function Proches({ chart, entries, onCreate, onRemove }: { chart: Chart; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onRemove: (e: Entry) => Promise<void> }) {
  const list = prochesCharts(entries);
  const [adding, setAdding] = useState(false);
  const ELEM: Record<string, string> = { soleil: 'Soleil', lune: 'Lune', ascendant: 'Ascendant', venus: 'Vénus', mars: 'Mars' };
  return <div className="stack-8">
    {list.map(({ entry, nom, chart: c }) => { const s = synastry(chart, c);
      return <details key={entry.id} className="soft-card"><summary className="astro-sum"><span className="astro-abbr">{nom.slice(0, 2)}</span><span className="workout-title"><strong>{nom}</strong><small>{syntheseOf(c).trio} · {s.score}/{s.pairs.length} affinités d’éléments</small></span></summary>
        {s.pairs.map((p) => <p key={p.id} className="astro-essentiel">{ELEM[p.id]} : toi en {signOf(p.a.sign)!.label}, {nom} en {signOf(p.b.sign)!.label}, {p.accord ? 'des éléments qui s’entendent (' + signOf(p.a.sign)!.element + ' et ' + signOf(p.b.sign)!.element + ').' : 'des éléments différents, à apprivoiser (' + signOf(p.a.sign)!.element + ' et ' + signOf(p.b.sign)!.element + ').'}</p>)}
        {s.aspects.length > 0 && <><p className="ritual-label">Vos liens les plus forts</p><ul className="astro-list">{s.aspects.slice(0, 6).map((x) => <li key={x.a.id + x.b.id}>Ton {planetOf(x.a.id)!.label} {x.type.label.toLowerCase()} son {planetOf(x.b.id)!.label} ({x.power} %) : {x.type.sens.charAt(0).toLowerCase() + x.type.sens.slice(1)}</li>)}</ul></>}
        <button className="link-btn small" onClick={() => void onRemove(entry)}>Retirer ce thème</button>
      </details>; })}
    {adding ? <ImportChart title="Ajouter le thème d’un proche" withName onCancel={() => setAdding(false)} onSave={async (c, nom) => {
      await onCreate({ module: 'equilibre', kind: ASTRO_KIND, title: 'Thème de ' + nom, entry_date: null, data: { proche: nom, placements: c.placements, naissance: c.naissance ?? '' } }); setAdding(false); }} />
      : <button className="button secondary" onClick={() => setAdding(true)}>Ajouter le thème d’un proche</button>}
    {!list.length && !adding && <p className="muted">Colle le texte d’un thème Evozen d’un proche pour découvrir vos affinités : éléments du Soleil, de la Lune, de l’ascendant, de Vénus et de Mars, et les liens entre vos planètes.</p>}
  </div>;
}

/** Mon thème en page imprimable : le navigateur propose « Enregistrer en PDF ». Rien n'est envoyé. */
function PrintChart({ chart, numero, onDone }: { chart: Chart; numero: MaNumerologie; onDone: () => void }) {
  useEffect(() => {
    const done = () => onDone();
    window.addEventListener('afterprint', done);
    const t = setTimeout(() => window.print(), 300);
    return () => { clearTimeout(t); window.removeEventListener('afterprint', done); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const s = syntheseOf(chart);
  const lectures = chart.placements.flatMap((p) => [lectureSigne(p), lectureMaison(p)]).filter((l): l is Lecture => Boolean(l));
  return createPortal(<div className="print-area">
    <h1>Mon thème astral</h1><p>{s.trio} · {chart.naissance}</p>
    <h2>Positions</h2><p>{chart.placements.map((p) => planetOf(p.id)!.label + ' en ' + signOf(p.sign)!.label + ' ' + degLabel(p.deg) + (p.house ? ' (maison ' + ROMAN[p.house] + ')' : '')).join(' · ')}</p>
    <h2>Aspects principaux</h2><p>{aspectsOf(chart).slice(0, 12).map((x) => planetOf(x.a.id)!.label + ' ' + x.type.label.toLowerCase() + ' ' + planetOf(x.b.id)!.label + ' (' + x.power + ' %)').join(' · ')}</p>
    {lectures.map((l) => <article key={l.titre}><h2>{l.titre}</h2><p>{l.essentiel}</p>{l.details?.map((d) => <p key={d.titre}><b>{d.titre} :</b> {d.texte}</p>)}<p><b>Conseil :</b> {l.conseil}</p></article>)}
    {[ficheExpression(numero.expression?.n), ficheAffectif(numero.affectif?.n)].filter((f): f is Fiche => Boolean(f)).map((f) => <article key={f.titre}><h2>{f.titre}</h2>{f.sections.map((x) => <p key={x.titre}><b>{x.titre} :</b> {x.texte}</p>)}</article>)}
  </div>, document.body);
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
