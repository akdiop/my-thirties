import { useMemo, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';
import { DESTINATION_IDEAS } from '../lib/destinationIdeas';
import { adviceUrl, DESTINATION_GUIDES } from '../lib/destinationGuides';
import { EditorialPhoto, useDestinationPhotos } from './EditorialPhoto';
import { HiddenNote, useHidden } from '../lib/hidden';

export function TravelSuggestions({ entries, onCreate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const [style, setStyle] = useState('Toutes');
  const destinationPhotos = useDestinationPhotos();
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState('');
  const saved = new Set(entries.filter((e) => e.kind === 'destination').map((e) => String(e.data.suggestionId ?? '')));
  const { ids: hidden, hide } = useHidden();
  const ideas = useMemo(() => DESTINATION_IDEAS.filter((d) => !hidden.has('destination:' + d.id) &&
    (style === 'Toutes' || d.style === style) &&
    [d.name, d.country, d.region, d.description].join(' ').toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr'))
  ), [style, search, hidden]);
  const save = async (d: (typeof DESTINATION_IDEAS)[number]) => {
    setBusy(d.id); setFeedback('');
    try {
      await onCreate({ module: 'decouvertes', kind: 'destination', title: d.name, entry_date: null,
        data: { suggestionId: d.id, country: d.country, style: d.style, season: DESTINATION_GUIDES[d.id]?.bestTime ?? '',
          notes: [d.description, 'À découvrir : ' + d.highlights.join(', '), ...(DESTINATION_GUIDES[d.id]?.itinerary ?? [])].join('\n') } });
      setFeedback(d.name + ' ajouté à tes envies de voyage.');
    } catch { setFeedback('Impossible d’enregistrer la destination.'); }
    finally { setBusy(''); }
  };
  return <section className="tool-card">
    <h3>Inspirations de voyage</h3>
    <p className="muted">30 destinations avec leur fiche complète : quand partir, comment y aller, où dormir, programme jour par jour, quoi goûter.</p>
    <div className="recipe-filters">
      <label>Envie du moment<select value={style} onChange={(e) => setStyle(e.target.value)}>
        {['Toutes', 'Culture', 'Nature', 'Détente', 'Ville', 'Aventure'].map((x) => <option key={x}>{x}</option>)}
      </select></label>
      <label>Rechercher<input type="search" placeholder="Pays, ville, région…" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
    </div>
    <p className="muted">{ideas.length} destination(s)</p>
    <div className="lesson-grid">{ideas.map((d) => <article className="lesson-card" key={d.id}>
      <EditorialPhoto src={destinationPhotos[d.id]?.src} alt={'Vue de ' + d.name + ' (Wikimedia Commons)'} className="editorial-card-photo" />
      {destinationPhotos[d.id] && <a className="editorial-photo-credit" href={destinationPhotos[d.id].creditUrl} target="_blank" rel="noopener noreferrer">Crédit photo · Wikimedia Commons ↗</a>}
      <h3>{d.name}</h3><p>{d.country} · {d.style} · {d.duration}</p>
      <p>{d.description}</p>
      <Guide id={d.id} highlights={d.highlights} />
      <button className="button secondary" disabled={Boolean(busy) || saved.has(d.id)} onClick={() => void save(d)}>
        {saved.has(d.id) ? 'Dans mes envies' : busy === d.id ? 'Ajout…' : 'Ajouter à mes envies'}
      </button>
      <button className="button ghost" onClick={() => void hide('destination:' + d.id, d.name)}>Ne plus me proposer</button>
    </article>)}</div>
    <HiddenNote prefix="destination:" />
    {feedback && <p role="status">{feedback}</p>}
  </section>;
}

function Guide({ id, highlights }: { id: string; highlights: string[] }) {
  const g = DESTINATION_GUIDES[id];
  if (!g) return <details><summary>À découvrir</summary><p>{highlights.join(' · ')}</p></details>;
  return <details className="dest-guide"><summary>Voir la fiche complète</summary>
    <dl className="dest-facts">
      <dt>Quand partir</dt><dd>{g.bestTime}</dd>
      <dt>Climat</dt><dd>{g.climate}</dd>
      <dt>Y aller</dt><dd>{g.getThere}</dd>
      <dt>Langue</dt><dd>{g.language}</dd>
      <dt>Monnaie</dt><dd>{g.currency}</dd>
      <dt>Budget sur place</dt><dd>{g.budget}</dd>
      <dt>Où dormir</dt><dd>{g.stay}</dd>
    </dl>
    <h4>À ne pas manquer</h4><p>{highlights.join(' · ')}</p>
    <h4>Programme jour par jour</h4><ol className="how-list">{g.itinerary.map((x) => <li key={x}>{x}</li>)}</ol>
    <h4>À goûter</h4><ul className="how-list">{g.food.map((x) => <li key={x}>{x}</li>)}</ul>
    <h4>Bons plans</h4><ul className="how-list">{g.tips.map((x) => <li key={x}>{x}</li>)}</ul>
    <a className="text-link" href={adviceUrl(g.advice)} target="_blank" rel="noreferrer">Formalités, visa et santé à jour (France Diplomatie) ↗</a>
  </details>;
}
