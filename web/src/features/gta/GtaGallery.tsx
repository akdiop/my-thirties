import { useRef, useState, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, ImagePlus, Trash2, X } from 'lucide-react';
import { validateMedia } from '../../lib/mediaLibrary';
import { GALLERY } from './data';

import { ZoomView } from './ZoomView';
import type { GtaCtx } from './ctx';

/** Ajout de captures personnelles, gardées seulement sur cet appareil. */
function ImportSlot({ ctx, label }: { ctx: GtaCtx; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])]; e.target.value = '';
    for (const f of files) {
      const err = validateMedia(f); if (err || !f.type.startsWith('image/')) { setMsg(err ?? 'Choisis une image.'); continue; }
      try { await ctx.images.save(f); setMsg('Image enregistrée sur cet appareil.'); } catch (x) { setMsg(x instanceof Error ? x.message : 'Import impossible.'); }
    }
  };
  return <span className="g-row">
    <button type="button" className="g-btn soft" onClick={() => input.current?.click()}><ImagePlus size={16} /> {label}</button>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple hidden style={{ display: 'none' }} onChange={(e) => void pick(e)} />
    {msg && <span className="g-muted" role="status">{msg}</span>}
  </span>;
}

export function GtaGallery(ctx: GtaCtx) {
  const [open, setOpen] = useState<{ src: string; title: string; credit: string } | null>(null);
  const local = GALLERY.filter((g) => g.local_file), external = GALLERY.filter((g) => g.external_url);
  return <>
    {ctx.images.error && <p className="g-alert" role="alert">{ctx.images.error}</p>}
    <div className="g-mosaic">
      {local.map((g, i) => { const src = ctx.images.urlFor(g.id);
        return src && <div key={g.id} className={'g-tile' + (i === 0 ? ' wide' : '')} style={{ cursor: 'default' }}>
          <button style={{ all: 'unset', display: 'block', width: '100%', height: '100%', cursor: 'zoom-in' }} aria-label={'Agrandir : ' + g.label} onClick={() => setOpen({ src, title: g.label, credit: g.rights })}><img src={src} alt={g.label} loading="lazy" /></button>
          <span className="g-cap">{g.label}{g.precision === 'regional_only' ? ' · repérage approximatif' : ''}</span>
        </div>; })}
    </div>
    <section className="g-card"><p className="g-label">Crédits et droits</p>
      <div className="g-table">{local.map((g) => <div key={g.id}><span><b>{g.label}</b> · {g.category}<br /><span className="g-muted">{g.rights}{g.caption ? ' · ' + g.caption : ''}{g.source ? ' · ' + g.source : ''}</span></span><span className="g-muted">{g.local_file}</span></div>)}</div>
    </section>
    <section className="g-card"><p className="g-label">Sources Rockstar</p>
      <p className="g-muted">Captures officielles consultables sur le site de Rockstar Games : elles ne sont pas copiées dans l’app.</p>
      {external.map((g) => <a key={g.id} className="g-btn ghost" href={g.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', justifyContent: 'space-between' }}>{g.label} <ExternalLink size={14} /></a>)}
    </section>
    <section className="g-card"><p className="g-label">Mes images</p>
      <ImportSlot ctx={ctx} label="Ajouter mes captures" />
      <div className="g-mosaic">{ctx.images.personal.map((x) => <div key={x.id} className="g-tile">
        {x.url && <button style={{ all: 'unset', display: 'block', width: '100%', height: '100%', cursor: 'zoom-in' }} aria-label={'Agrandir : ' + x.name} onClick={() => setOpen({ src: x.url!, title: x.name, credit: 'Image personnelle' })}><img src={x.url} alt={x.name} loading="lazy" /></button>}
        <button className="g-icon" style={{ position: 'absolute', top: 6, right: 6 }} aria-label={'Supprimer ' + x.name} onClick={() => { if (confirm('Supprimer cette image de l’appareil ?')) void ctx.images.remove(x.id); }}><Trash2 size={16} /></button>
      </div>)}</div>
    </section>
    {open && createPortal(<div className="g-lightbox" role="dialog" aria-modal="true" aria-label={open.title}>
      <div className="g-row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}><strong>{open.title}</strong><button className="g-icon" aria-label="Fermer" autoFocus onClick={() => setOpen(null)}><X size={18} /></button></div>
      <ZoomView src={open.src} alt={open.title} />
      <p className="g-muted">{open.credit}</p>
    </div>, document.body)}
  </>;
}
