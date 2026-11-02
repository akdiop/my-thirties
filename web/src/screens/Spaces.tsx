import { useState } from 'react';
import { PawPrint, Search } from 'lucide-react';
import type { Entry, ModuleId } from '../lib/cloud';
import { modules } from '../modules';
import { ModuleTile } from '../ui/kit';
import { searchEntries } from '../lib/search';

export function Spaces({ entries, onGo, onOpen }: { entries: Entry[]; onGo: (s: ModuleId | 'assistant' | 'panda') => void; onOpen: (e: Entry) => void }) {
  const [q, setQ] = useState('');
  const found = searchEntries(entries, q);
  return <div className="screen">
    <header className="tab-head"><h1>Mes espaces</h1><p>Des espaces pour toutes les facettes de ta vie</p></header>
    <label className="search-box"><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher partout (titres et textes)" /></label>
    {q.trim() ? <div className="stack-8">{found.length ? found.map(({ e, snippet }) => <button key={e.id} className="row-plain search-hit" onClick={() => onOpen(e)}><span>{e.title}</span><small>{modules.find((m) => m.id === e.module)?.name}</small><span className="snippet">{snippet}</span></button>) : <p className="muted">Aucun résultat.</p>}</div>
      : <div className="tile-grid">
        {modules.map((m) => <ModuleTile key={m.id} id={m.id} onClick={() => onGo(m.id)} />)}
        <button className="module-tile" style={{ background: '#E8DCD6' }} onClick={() => onGo('panda')}>
          <PawPrint size={28} color="#6B3F2E" strokeWidth={1.6} /><span>Mon panda</span>
        </button>
        <ModuleTile id="assistant" onClick={() => onGo('assistant')} />
      </div>}
  </div>;
}
