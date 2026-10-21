import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Entry, ModuleId } from '../lib/cloud';
import { modules } from '../modules';
import { ModuleTile } from '../ui/kit';

export function Spaces({ entries, onGo, onOpen }: { entries: Entry[]; onGo: (s: ModuleId | 'assistant') => void; onOpen: (e: Entry) => void }) {
  const [q, setQ] = useState('');
  const found = q.trim() ? entries.filter((e) => e.title.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 20) : [];
  return <div className="screen">
    <header className="tab-head"><h1>Mes espaces</h1><p>Onze espaces, une seule vie</p></header>
    <label className="search-box"><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher dans My thirties" /></label>
    {q.trim() ? <div className="stack-8">{found.length ? found.map((e) => <button key={e.id} className="row-plain" onClick={() => onOpen(e)}>{e.title}<small>{modules.find((m) => m.id === e.module)?.name}</small></button>) : <p className="muted">Aucun résultat.</p>}</div>
      : <div className="tile-grid">
        {modules.map((m) => <ModuleTile key={m.id} id={m.id} onClick={() => onGo(m.id)} />)}
        <ModuleTile id="assistant" onClick={() => onGo('assistant')} />
      </div>}
  </div>;
}
