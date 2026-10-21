import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Field } from '../modules';

const fmtNum = (n: number) => String(n).replace('.', ',');

/** Champ guidé : puces, échelle, compteur ; le texte libre reste réservé aux notes facultatives. */
export function GuidedField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState('');
  const options = field.options ?? [];

  if (field.type === 'select' || (field.type === 'chips' && options.length >= 4)) {
    const extra = value && !options.includes(value) ? [value] : [];
    return <div className="gfield">
      <label htmlFor={'select-' + field.id}>{field.label}{field.optional && <small> (facultatif)</small>}</label>
      <select id={'select-' + field.id} value={customOpen ? '__other__' : value}
        onChange={(e) => {
          if (e.target.value === '__other__') { setCustom(value && !options.includes(value) ? value : ''); setCustomOpen(true); }
          else { setCustomOpen(false); onChange(e.target.value); }
        }}>
        <option value="">Choisir dans la liste…</option>
        {[...options, ...extra].map((o) => <option key={o} value={o}>{o}</option>)}
        {field.other && <option value="__other__">Autre (préciser)</option>}
      </select>
      {customOpen && <div className="gcustom">
        <input autoFocus value={custom} maxLength={120} onChange={(e) => setCustom(e.target.value)} placeholder="Préciser…" aria-label={'Préciser : ' + field.label} />
        <button type="button" className="button ghost" disabled={!custom.trim()} onClick={() => { onChange(custom.trim()); setCustomOpen(false); }}>Valider</button>
        <button type="button" className="button ghost" onClick={() => setCustomOpen(false)}>Annuler</button>
      </div>}
    </div>;
  }

  if (field.type === 'chips') {
    const extra = value && !options.includes(value) ? [value] : [];
    return <fieldset className="gfield"><legend>{field.label}</legend>
      <div className="gchips">
        {[...options, ...extra].map((o) => <button type="button" key={o} className={'gchip' + (o === value ? ' on' : '')} aria-pressed={o === value} onClick={() => onChange(o === value ? '' : o)}>{o}</button>)}
        {field.other && !customOpen && <button type="button" className="gchip add" onClick={() => setCustomOpen(true)}>+ Autre</button>}
      </div>
      {customOpen && <div className="gcustom"><input autoFocus value={custom} maxLength={60} onChange={(e) => setCustom(e.target.value)} placeholder="Préciser…" />
        <button type="button" className="button ghost" onClick={() => { if (custom.trim()) onChange(custom.trim()); setCustom(''); setCustomOpen(false); }}>OK</button></div>}
    </fieldset>;
  }

  if (field.type === 'multi') {
    const selected = value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const toggle = (o: string) => onChange((selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o]).join(', '));
    const extra = selected.filter((s) => !options.includes(s));
    return <fieldset className="gfield"><legend>{field.label} <small>plusieurs choix possibles</small></legend>
      <div className="gchips">
        {[...options, ...extra].map((o) => <button type="button" key={o} className={'gchip' + (selected.includes(o) ? ' on' : '')} aria-pressed={selected.includes(o)} onClick={() => toggle(o)}>{o}</button>)}
        {field.other && !customOpen && <button type="button" className="gchip add" onClick={() => setCustomOpen(true)}>+ Autre</button>}
      </div>
      {customOpen && <div className="gcustom"><input autoFocus value={custom} maxLength={60} onChange={(e) => setCustom(e.target.value)} placeholder="Préciser…" />
        <button type="button" className="button ghost" onClick={() => { if (custom.trim()) toggle(custom.trim()); setCustom(''); setCustomOpen(false); }}>OK</button></div>}
    </fieldset>;
  }

  if (field.type === 'scale') {
    const n = Number(value) || 0;
    return <fieldset className="gfield"><legend>{field.label}</legend>
      <div className="gscale">{[1, 2, 3, 4, 5].map((i) => <button type="button" key={i} className={'gdot' + (i <= n ? ' on' : '')} aria-label={`${i} sur 5`} aria-pressed={i === n} onClick={() => onChange(i === n ? '' : String(i))}>{i}</button>)}</div>
      {(field.low || field.high) && <div className="gscale-legend"><span>{field.low}</span><span>{field.high}</span></div>}
    </fieldset>;
  }

  if (field.type === 'stepper' || field.type === 'number') {
    const step = field.step ?? 1;
    const n = value === '' ? null : Number(value);
    const clamp = (x: number) => Math.min(field.max ?? Infinity, Math.max(field.min ?? 0, Math.round(x / step) * step));
    const set = (x: number) => onChange(String(clamp(x)));
    return <fieldset className="gfield"><legend>{field.label}</legend>
      <div className="gstepper">
        <button type="button" aria-label="Moins" onClick={() => set((n ?? 0) - step)}><Minus size={18} /></button>
        <input inputMode="decimal" value={n === null ? '' : fmtNum(n)} placeholder="—" aria-label={field.label}
          onChange={(e) => { const raw = e.target.value.replace(/\s/g, '').replace(',', '.'); if (raw === '') onChange(''); else if (!Number.isNaN(Number(raw))) onChange(raw); }} />
        {field.unit && <span className="gunit">{field.unit}</span>}
        <button type="button" aria-label="Plus" onClick={() => set((n ?? 0) + step)}><Plus size={18} /></button>
      </div>
      {field.presets && <div className="gchips small">{field.presets.map((p) => <button type="button" key={p} className={'gchip' + (n === p ? ' on' : '')} onClick={() => onChange(String(p))}>
        {p >= 1000 ? new Intl.NumberFormat('fr-FR').format(p).replace(/ | /g, ' ') : fmtNum(p)}{field.unit ? ' ' + field.unit : ''}</button>)}</div>}
    </fieldset>;
  }

  if (field.type === 'textarea' && field.optional) {
    return <details className="gnote" open={Boolean(value)}><summary>{field.label}</summary>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ''} /></details>;
  }

  return <label className="gfield">{field.label}{field.optional && <small> (facultatif)</small>}
    {field.type === 'textarea'
      ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ''} />
      : <input type={field.type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ''} />}
  </label>;
}
