import { useMemo, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';
import { PERSONALIZED_RECIPES } from '../recipes/recipeIndex';
import type { CuratedCategory } from '../recipes/types';
import { CULINARY_STYLES, culinaryStyleLabel, recipeStyle, type CulinaryStyle } from '../recipes/recipeStyles';
import { recipeVisual, VISUALS } from '../lib/visuals';

const categories: { id: CuratedCategory; label: string }[] = [
  { id: 'petit-dejeuner', label: 'Petit-déjeuner' },
  { id: 'dejeuner', label: 'Déjeuner' },
  { id: 'diner', label: 'Dîner' },
  { id: 'casse-croute', label: 'Casse-croûte' },
  { id: 'smoothie', label: 'Smoothie' },
  { id: 'shot', label: 'Shot' },
  { id: 'boulangerie', label: 'Boulangerie maison' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'base-maison', label: 'Bases et sauces' },
];
const PAGE_SIZE = 12;

const SLOTS = ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'];
const defaultSlot = (c: CuratedCategory) => c === 'petit-dejeuner' || c === 'smoothie' ? 'Petit-déjeuner' : c === 'diner' ? 'Dîner' : c === 'dejeuner' ? 'Déjeuner' : 'Collation';

export function RecipeIdeas({ entries, onCreate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const [category, setCategory] = useState<CuratedCategory>('petit-dejeuner');
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState<CulinaryStyle>('toutes');
  const [maxMinutes, setMaxMinutes] = useState('toutes');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const filtered = useMemo(() => PERSONALIZED_RECIPES.filter((r) =>
    r.category === category && (style === 'toutes' || recipeStyle(r) === style) &&
    (maxMinutes === 'toutes' || r.prepMin + r.cookMin <= Number(maxMinutes)) &&
    (r.title + ' ' + r.ingredients).toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr'))
  ), [category, search, style, maxMinutes]);
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const existing = new Set(entries.filter((e) => e.kind === 'recipe').map((e) => String(e.data.libraryId ?? '')));
  const [planning, setPlanning] = useState('');
  const [planDay, setPlanDay] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [planSlot, setPlanSlot] = useState(defaultSlot(category));
  /** Planifie la recette : le repas garde ses ingrédients, la liste de courses de la semaine se met à jour. */
  const plan = async (recipe: (typeof PERSONALIZED_RECIPES)[number]) => {
    setBusy(recipe.id); setMessage('');
    try {
      await onCreate({ module: 'cuisine', kind: 'meal', title: planSlot + ' · ' + recipe.title, entry_date: planDay,
        data: { date: planDay, slot: planSlot, recipe: recipe.title, libraryId: recipe.id, ingredients: recipe.ingredients.split(';').join('\n') } });
      setPlanning('');
      setMessage(recipe.title + ' planifié le ' + new Date(planDay + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + '. Liste de courses mise à jour.');
    } catch { setMessage('Impossible de planifier cette recette.'); }
    finally { setBusy(''); }
  };
  const create = async (recipe: (typeof PERSONALIZED_RECIPES)[number]) => {
    setBusy(recipe.id); setMessage('');
    try {
      await onCreate({
        module: 'cuisine', kind: 'recipe', title: recipe.title, entry_date: null,
        data: { libraryId: recipe.id, category: recipe.category, origin: recipeStyle(recipe), portions: String(recipe.servings),
          duration: String(recipe.prepMin + recipe.cookMin),
          ingredients: recipe.ingredients.split(';').join('\n'),
          steps: recipe.steps.map((step, index) => String(index + 1) + '. ' + step).join('\n'),
          storage: recipe.storage },
      });
      setMessage('Recette ajoutée : ' + recipe.title);
    } catch { setMessage('Impossible d’ajouter cette recette.'); }
    finally { setBusy(''); }
  };
  return <section className="tool-card">
    <div className="editorial-cover"><img src={VISUALS.cooking} alt="Cuisine maison : préparation d'un repas, photo d'ambiance" loading="lazy" /><div><span className="eyebrow">CUISINER ET DÉCOUVRIR</span><h3>Ma bibliothèque de {PERSONALIZED_RECIPES.length} recettes</h3><p>Des idées pour chaque moment de la journée.</p></div></div>
    <p className="muted">300 idées de repas et boissons, plus 15 recettes originales de boulangerie, desserts et bases maison. Pois chiches et lait de coco inclus. Les shots sont des boissons plaisir, sans promesse de détox.</p>
    <h3>Ma bibliothèque de {PERSONALIZED_RECIPES.length} recettes</h3>
    <p className="muted">300 idées de repas et boissons, plus 15 recettes originales de boulangerie, desserts et bases maison. Pois chiches et lait de coco inclus.</p>
    <div className="recipe-filters">
      <label>Catégorie
        <select value={category} onChange={(e) => { setCategory(e.target.value as CuratedCategory); setPage(1); }}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label} ({PERSONALIZED_RECIPES.filter((r) => r.category === c.id).length})</option>)}
        </select>
      </label>
      <label>Inspiration culinaire
        <select value={style} onChange={(e) => { setStyle(e.target.value as CulinaryStyle); setPage(1); }}>
          {CULINARY_STYLES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <label>Temps disponible
        <select value={maxMinutes} onChange={(e) => { setMaxMinutes(e.target.value); setPage(1); }}>
          <option value="toutes">Toutes les durées</option>
          <option value="15">15 minutes maximum</option>
          <option value="30">30 minutes maximum</option>
          <option value="60">1 heure maximum</option>
        </select>
      </label>
      <label>Rechercher
        <input type="search" value={search} placeholder="Ex. poulet, mangue…" onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </label>
    </div>
    <p className="muted">{filtered.length} recette(s) dans cette sélection</p>
    <div className="lesson-grid">{visible.map((recipe) => {
      const isAdded = existing.has(recipe.id);
      return <article className="lesson-card" key={recipe.id}>
        {recipeVisual(recipe.title) && <img className="editorial-card-image" src={recipeVisual(recipe.title)} alt="Illustration du type de plat (photo d’ambiance, non contractuelle)" loading="lazy" />}
        <h3>{recipe.title}</h3>
        <p>{recipe.prepMin + recipe.cookMin} min environ · {recipe.servings} portions · {culinaryStyleLabel(recipeStyle(recipe))}</p>
        <details><summary>Ingrédients et préparation</summary>
          <p className="recipe-steps">{recipe.ingredients.split(';').join('\n')}</p>
          <p className="recipe-steps">{recipe.steps.map((step, i) => String(i + 1) + '. ' + step).join('\n')}</p>
        </details>
        <div className="button-group">
          <button className="button secondary" disabled={Boolean(busy)} onClick={() => setPlanning(planning === recipe.id ? '' : recipe.id)}>Planifier</button>
          <button className="button ghost" disabled={Boolean(busy) || isAdded} onClick={() => void create(recipe)}>
            {isAdded ? 'Dans mes recettes' : busy === recipe.id ? 'Ajout…' : 'Ajouter à mes recettes'}
          </button>
        </div>
        {planning === recipe.id && <div className="plan-inline">
          <label>Jour<input type="date" value={planDay} onChange={(e) => setPlanDay(e.target.value)} /></label>
          <label>Moment<select value={planSlot} onChange={(e) => setPlanSlot(e.target.value)}>{SLOTS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <button className="button primary" disabled={Boolean(busy) || !planDay} onClick={() => void plan(recipe)}>Ajouter au planning</button>
        </div>}
      </article>;
    })}</div>
    {visible.length < filtered.length && <button className="button secondary" onClick={() => setPage((p) => p + 1)}>Afficher 12 recettes de plus</button>}
    {message && <p role="status">{message}</p>}
  </section>;
}
