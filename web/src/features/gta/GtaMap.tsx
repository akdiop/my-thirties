import { useMemo, useState } from 'react';
import { MapPin, Plus, Trash2, X } from 'lucide-react';
import { LOCATIONS, MONEY_PLACES } from './data';
import { cellAt, cellsRect, gridLines, parseGrid, type Rect } from './mapGrid';
import { MARKER_CATEGORIES, type MarkerCategory } from './progress';
import { ZoomView } from './ZoomView';
import { ImportSlot } from './GtaGallery';
import type { GtaCtx, MapFocus } from './ctx';

const CAT_LABEL: Record<MarkerCategory, string> = { repere: 'Repère', argent: 'Argent', mission: 'Mission', perso: 'Perso' };
type Layer = 'lieux' | 'argent' | 'mes';

export function GtaMap(ctx: GtaCtx & { focus: MapFocus | null }) {
  const src = ctx.images.urlFor('leonida-map');
  const [chapter, setChapter] = useState(5);
  const [layers, setLayers] = useState<Set<Layer>>(new Set(['lieux', 'argent', 'mes']));
  const [grid, setGrid] = useState(true);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{ x: number; y: number; label: string; note: string; category: MarkerCategory } | null>(null);
  const [cell, setCell] = useState<string | null>(null);
  const [focus, setFocus] = useState<Rect | null>(ctx.focus?.rect ?? null);
  const [focusLabel, setFocusLabel] = useState(ctx.focus?.label ?? '');
  const lines = useMemo(gridLines, []);
  const toggle = (l: Layer) => setLayers((s) => { const n = new Set(s); if (n.has(l)) n.delete(l); else n.add(l); return n; });

  if (!src) return <section className="g-import">
    <h2 className="g-title" style={{ margin: 0, fontSize: '1.1rem' }}>Ma carte de Leonida</h2>
    <p>Importe ta carte une fois sur cet appareil : elle reste ici, hors ligne, et n’est publiée nulle part.</p>
    <p className="g-muted">Pourquoi pas directement dans l’app ? La carte ressemble à une création officielle dont les droits ne sont pas confirmés : la mettre dans l’app la rendrait accessible en ligne. Choisis « Leonida_Map_Poster.jpg » dans le dossier du kit.</p>
    <ImportSlot ctx={ctx} assetId="leonida-map" label="Importer la carte complète" />
  </section>;

  const places = LOCATIONS.filter((l) => l.first_chapter_relevant <= chapter);
  const money = MONEY_PLACES.filter((m) => m.chapter_min <= chapter);
  const onTap = (x: number, y: number) => {
    setCell(cellAt(x, y));
    if (adding) { setDraft({ x, y, label: '', note: '', category: 'perso' }); setAdding(false); }
  };
  const saveDraft = () => {
    if (!draft || !draft.label.trim()) return;
    const marker = { id: 'm-' + Date.now().toString(36), x: draft.x, y: draft.y, label: draft.label.trim().slice(0, 80), note: draft.note.trim() || undefined, category: draft.category, createdAt: new Date().toISOString() };
    ctx.update((p) => ({ ...p, markers: [...p.markers, marker] }));
    setDraft(null);
  };
  const markers = ctx.p.markers;
  return <>
    {ctx.focus && focusLabel && <p className="g-alert info" role="status"><MapPin size={16} aria-hidden="true" /> {focusLabel} : zone approximative d’après la grille, pas un point précis.</p>}
    <ZoomView src={src} alt="Ma carte de Leonida" focus={focus} onTap={onTap}
      hint={adding ? 'Touche la carte à l’endroit du repère.' : cell ? 'Case ' + cell + ' · quadrillage approximatif' : 'Quadrillage A–M × 1–9 approximatif. Touche la carte pour lire la case.'}>
      {grid && <>{lines.cols.map((x) => <i key={'c' + x} className="g-gridline v" style={{ left: x + '%' }} />)}{lines.rows.map((y) => <i key={'r' + y} className="g-gridline h" style={{ top: y + '%' }} />)}</>}
      {layers.has('lieux') && places.filter((l) => !focusLabel || l.name === focusLabel).map((l) => { const r = cellsRect(l.grid_row_approx, l.grid_row_approx, Number(l.grid_col_approx), Number(l.grid_col_approx));
        return r && <div key={l.name} className="g-zone" style={{ left: r.x + '%', top: r.y + '%', width: r.w + '%', height: r.h + '%', borderStyle: 'dashed' }}><span>{l.name}</span></div>; })}
      {layers.has('argent') && money.filter((m) => !focusLabel || m.title === focusLabel).map((m) => { const r = parseGrid(m.grid);
        return r && <div key={m.id} className="g-zone" style={{ left: r.x + '%', top: r.y + '%', width: r.w + '%', height: r.h + '%' }}><span>{m.title}</span></div>; })}
      {layers.has('mes') && markers.map((m) => <i key={m.id} className={'g-pin ' + m.category} style={{ left: m.x + '%', top: m.y + '%' }}><span>{m.label}</span></i>)}
      {draft && <i className="g-pin perso" style={{ left: draft.x + '%', top: draft.y + '%' }} />}
    </ZoomView>
    {draft && <section className="g-card" aria-label="Nouveau repère">
      <p className="g-label">Nouveau repère · case {cellAt(draft.x, draft.y) ?? 'hors grille'}</p>
      <input autoFocus value={draft.label} maxLength={80} placeholder="Nom du repère" aria-label="Nom du repère" onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
      <textarea rows={2} value={draft.note} maxLength={500} placeholder="Note (facultatif)" aria-label="Note du repère" onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
      <div className="g-chips">{MARKER_CATEGORIES.map((c) => <button key={c} className="g-chip" aria-pressed={draft.category === c} onClick={() => setDraft({ ...draft, category: c })}>{CAT_LABEL[c]}</button>)}</div>
      <div className="g-row"><button className="g-btn" disabled={!draft.label.trim()} onClick={saveDraft}>Enregistrer</button><button className="g-btn ghost" onClick={() => setDraft(null)}><X size={14} /> Annuler</button></div>
    </section>}
    <section className="g-card">
      <div className="g-row"><button className="g-btn" aria-pressed={adding} onClick={() => { setAdding(!adding); setDraft(null); }}><Plus size={16} /> {adding ? 'Touche la carte…' : 'Ajouter un repère'}</button>
        <button className="g-btn ghost" onClick={() => { setFocus(null); setFocusLabel(''); }}>Toute la carte</button></div>
      <p className="g-label">Afficher</p>
      <div className="g-chips">
        <button className="g-chip" aria-pressed={layers.has('lieux')} onClick={() => toggle('lieux')}>Lieux clés</button>
        <button className="g-chip" aria-pressed={layers.has('argent')} onClick={() => toggle('argent')}>Argent et trésors</button>
        <button className="g-chip" aria-pressed={layers.has('mes')} onClick={() => toggle('mes')}>Mes repères</button>
        <button className="g-chip" aria-pressed={grid} onClick={() => setGrid(!grid)}>Quadrillage</button>
      </div>
      <p className="g-label">Jusqu’au chapitre</p>
      <div className="g-chips">{[1, 2, 3, 4, 5].map((c) => <button key={c} className="g-chip" aria-pressed={chapter === c} onClick={() => setChapter(c)}>Ch. {c}</button>)}</div>
    </section>
    <section className="g-card"><p className="g-label">Lieux et zones (approximatifs)</p>
      <div className="g-table">
        {places.map((l) => { const r = cellsRect(l.grid_row_approx, l.grid_row_approx, Number(l.grid_col_approx), Number(l.grid_col_approx));
          return <div key={l.name}><span><b>{l.name}</b> · {l.grid_row_approx}{l.grid_col_approx}<br /><span className="g-muted">{l.context} · dès le ch. {l.first_chapter_relevant}</span></span>
            {r && <button className="g-icon" aria-label={'Centrer sur ' + l.name} onClick={() => { setFocus({ ...r }); setFocusLabel(l.name); window.scrollTo(0, 0); }}><MapPin size={16} /></button>}</div>; })}
        {money.map((m) => { const r = parseGrid(m.grid);
          return <div key={m.id}><span><b>{m.title}</b><br /><span className="g-muted">{m.grid}</span></span>
            {r && <button className="g-icon" aria-label={'Centrer sur ' + m.title} onClick={() => { setFocus({ ...r }); setFocusLabel(m.title); window.scrollTo(0, 0); }}><MapPin size={16} /></button>}</div>; })}
      </div>
    </section>
    <section className="g-card"><p className="g-label">Mes repères ({markers.length})</p>
      {!markers.length && <p className="g-muted">Touche « Ajouter un repère » puis la carte : nom, note et catégorie restent dans ta progression.</p>}
      <div className="g-table">{markers.map((m) => <div key={m.id}><span><b>{m.label}</b> · {CAT_LABEL[m.category]} · case {cellAt(m.x, m.y) ?? '—'}{m.note && <><br /><span className="g-muted">{m.note}</span></>}</span>
        <span className="g-row" style={{ flexWrap: 'nowrap' }}><button className="g-icon" aria-label={'Centrer sur ' + m.label} onClick={() => { setFocus({ x: m.x - 2, y: m.y - 1.5, w: 4, h: 3 }); setFocusLabel(m.label); window.scrollTo(0, 0); }}><MapPin size={16} /></button>
          <button className="g-icon" aria-label={'Supprimer ' + m.label} onClick={() => { if (confirm('Supprimer le repère « ' + m.label + ' » ?')) ctx.update((p) => ({ ...p, markers: p.markers.filter((x) => x.id !== m.id) })); }}><Trash2 size={16} /></button></span></div>)}</div>
    </section>
  </>;
}
