import { useHidden } from '../lib/hidden';
import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Entry, ModuleId } from '../lib/cloud';
import { modules } from '../modules';
import { ModuleTile } from '../ui/kit';
import { searchEntries } from '../lib/search';

export function Spaces({ entries, onGo, onOpen }: { entries: Entry[]; onGo: (s: ModuleId | 'assistant') => void; onOpen: (e: Entry) => void }) {
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(false);
  const { ids, hide, restore } = useHidden();
  const found = searchEntries(entries, q);
  const shown = modules.filter((m) => !ids.has('space:' + m.id));
  const hiddenCount = modules.length - shown.length;
  return <div className="screen">
    <header className="tab-head"><h1>Mes espaces</h1><p>{shown.length} espace{shown.length > 1 ? 's' : ''}, une seule vie</p></header>
    <label className="search-box"><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher partout (titres et textes)" /></label>
    {q.trim() ? <div className="stack-8">{found.length ? found.map(({ e, snippet }) => <button key={e.id} className="row-plain search-hit" onClick={() => onOpen(e)}><span>{e.title}</span><small>{modules.find((m) => m.id === e.module)?.name}</small><span className="snippet">{snippet}</span></button>) : <p className="muted">Aucun résultat.</p>}</div>
      : edit ? <div className="soft-card space-edit"><strong>Mes espaces affichés</strong>
          <p className="muted small">Masquer un espace ne supprime rien : tu peux le remettre quand tu veux.</p>
          {modules.map((m) => { const on = !ids.has('space:' + m.id);
            return <label key={m.id} className="opt-row space-opt"><input type="checkbox" checked={on} onChange={() => void (on ? hide('space:' + m.id, m.name) : restore(['space:' + m.id]))} /> {m.name}</label>; })}
          <button className="button primary wide" onClick={() => setEdit(false)}>Terminé</button></div>
      : <><div className="tile-grid">
        {shown.map((m) => <ModuleTile key={m.id} id={m.id} onClick={() => onGo(m.id)} />)}
        <ModuleTile id="assistant" onClick={() => onGo('assistant')} />
      </div>
      <button className="link-btn small center-btn" onClick={() => setEdit(true)}>{hiddenCount ? 'Gérer mes espaces (' + hiddenCount + ' masqué' + (hiddenCount > 1 ? 's' : '') + ')' : 'Gérer mes espaces'}</button></>}
  </div>;
}
