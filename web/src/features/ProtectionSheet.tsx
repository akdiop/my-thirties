import { X } from 'lucide-react';
import { DUAS } from '../lib/duas';
import { RepeatCounter } from './Duas';
import { AvecCoran } from '../ui/CoranLien';

const FIRST = ['laqad', 'kursi', 'baqara-fin'];
const PROTECTION = [...FIRST.flatMap((id) => DUAS.filter((d) => d.id === id)), ...DUAS.filter((d) => d.category === 'Protection' && !FIRST.includes(d.id))];

/** Accès rapide depuis l'accueil aux invocations de protection (avant de prendre la route, en sortant…). */
export function ProtectionSheet({ onClose }: { onClose: () => void }) {
  return <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Invocations de protection" onClick={onClose}>
    <div className="editor protection-sheet" onClick={(e) => e.stopPropagation()}>
      <button className="icon-btn preview-close" aria-label="Fermer" onClick={onClose}><X size={20} /></button>
      <h2>Protection</h2>
      <div className="stack-8">{PROTECTION.map((d) => <article key={d.id} className="dua-card">
        <div className="dua-head"><div><strong>{d.title}</strong>{d.repeat ? <small className="muted"> · {d.repeat} fois</small> : null}</div></div>
        <p className="dua-ar" lang="ar" dir="rtl">{d.arabic}</p>
        <p className="dua-ph">{d.phonetic}</p>
        <p className="dua-fr">{d.french}</p>
        <small className="muted"><AvecCoran texte={[d.ref, d.source].filter(Boolean).join(' · ')} /></small>
        {d.repeat && <RepeatCounter total={d.repeat} />}
      </article>)}</div>
    </div>
  </div>;
}
