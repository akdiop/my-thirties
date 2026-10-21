import { useMemo, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';
import { DESTINATION_IDEAS } from '../lib/destinationIdeas';
import { destinationVisual, VISUALS } from '../lib/visuals';

export function TravelSuggestions({ entries, onCreate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const [style, setStyle] = useState('Toutes');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState('');
  const saved = new Set(entries.filter((e) => e.kind === 'destination').map((e) => String(e.data.suggestionId ?? '')));
  const ideas = useMemo(() => DESTINATION_IDEAS.filter((d) =>
    (style === 'Toutes' || d.style === style) &&
    [d.name, d.country, d.region, d.description].join(' ').toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr'))
  ), [style, search]);
  const save = async (d: (typeof DESTINATION_IDEAS)[number]) => {
    setBusy(d.id); setFeedback('');
    try {
      await onCreate({ module: 'decouvertes', kind: 'destination', title: d.name, entry_date: null,
        data: { suggestionId: d.id, country: d.country, style: d.style, season: 'À vérifier selon la période choisie', notes: d.description + '\nÀ découvrir : ' + d.highlights.join(', ') } });
      setFeedback(d.name + ' ajouté à tes envies de voyage.');
    } catch { setFeedback('Impossible d’enregistrer la destination.'); }
    finally { setBusy(''); }
  };
  return <section className="tool-card">
    <div className="editorial-cover"><img src={VISUALS.travel} alt="Rue colorée et animée à Lisbonne, photographie d'ambiance" loading="lazy" /><div><span className="eyebrow">ÉVASIONS ET DÉCOUVERTES</span><h3>Inspirations de voyage</h3><p>Des lieux à découvrir, des envies à garder.</p></div></div>
    <p className="muted">30 destinations pour imaginer tes prochains voyages. Enregistre celles qui t’attirent ; les durées sont des suggestions, pas des réservations.</p>
    <div className="recipe-filters">
      <label>Envie du moment<select value={style} onChange={(e) => setStyle(e.target.value)}>
        {['Toutes', 'Culture', 'Nature', 'Détente', 'Ville', 'Aventure'].map((x) => <option key={x}>{x}</option>)}
      </select></label>
      <label>Rechercher<input type="search" placeholder="Pays, ville, région…" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
    </div>
    <p className="muted">{ideas.length} destination(s)</p>
    <div className="lesson-grid">{ideas.map((d) => <article className="lesson-card" key={d.id}>
      {destinationVisual(d.name) && <img className="editorial-card-image" src={destinationVisual(d.name)} alt={'Vue de ' + d.name} loading="lazy" />}
      <h3>{d.name}</h3><p>{d.country} · {d.style} · {d.duration}</p>
      <p>{d.description}</p>
      <details><summary>À découvrir</summary><p>{d.highlights.join(' · ')}</p></details>
      <button className="button secondary" disabled={Boolean(busy) || saved.has(d.id)} onClick={() => void save(d)}>
        {saved.has(d.id) ? 'Dans mes envies' : busy === d.id ? 'Ajout…' : 'Ajouter à mes envies'}
      </button>
    </article>)}</div>
    {feedback && <p role="status">{feedback}</p>}
    <p className="fineprint">Avant de partir, vérifie les formalités d’entrée, la sécurité et les conseils sanitaires auprès des sources officielles. Aucun prix ni visa n’est supposé.</p>
  </section>;
}
