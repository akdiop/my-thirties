import { useMemo, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';
import { PERSONALIZED_RECIPES } from '../recipes/recipeIndex';
import type { CuratedCategory } from '../recipes/types';

const categories: { id: CuratedCategory; label: string }[] = [
  { id: 'petit-dejeuner', label: 'Petit-déjeuner' },
  { id: 'dejeuner', label: 'Déjeuner' },
  { id: 'diner', label: 'Dîner' },
  { id: 'casse-croute', label: 'Casse-croûte' },
  { id: 'smoothie', label: 'Smoothie' },
  { id: 'shot', label: 'Shot' },
];
const PAGE_SIZE = 12;

export function RecipeIdeas({ entries, onCreate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const [category, setCategory] = useState<CuratedCategory>('petit-dejeuner');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const filtered = useMemo(() => PERSONALIZED_RECIPES.filter((r) =>
    r.category === category && r.title.toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr'))
  ), [category, search]);
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const existing = new Set(entries.filter((e) => e.kind === 'recipe').map((e) => String(e.data.libraryId ?? '')));
  const create = async (recipe: (typeof PERSONALIZED_RECIPES)[number]) => {
    setBusy(recipe.id); setMessage('');
    try {
      await onCreate({
        module: 'cuisine', kind: 'recipe', title: recipe.title, entry_date: null,
        data: { libraryId: recipe.id, category: recipe.category, portions: String(recipe.servings),
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
    <h3>Ma bibliothèque de 300 recettes</h3>
    <p className="muted">50 recettes par catégorie, adaptées à tes goûts. Pois chiches et lait de coco inclus. Les shots sont des boissons plaisir, sans promesse de détox.</p>
    <div className="recipe-filters">
      <label>Catégorie
        <select value={category} onChange={(e) => { setCategory(e.target.value as CuratedCategory); setPage(1); }}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label} (50)</option>)}
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
        <h3>{recipe.title}</h3>
        <p>{recipe.prepMin + recipe.cookMin} min environ · {recipe.servings} portions</p>
        <details><summary>Ingrédients et préparation</summary>
          <p className="recipe-steps">{recipe.ingredients.split(';').join('\n')}</p>
          <p className="recipe-steps">{recipe.steps.map((step, i) => String(i + 1) + '. ' + step).join('\n')}</p>
        </details>
        <button className="button secondary" disabled={Boolean(busy) || isAdded} onClick={() => void create(recipe)}>
          {isAdded ? 'Dans mes recettes' : busy === recipe.id ? 'Ajout…' : 'Ajouter à mes recettes'}
        </button>
      </article>;
    })}</div>
    {visible.length < filtered.length && <button className="button secondary" onClick={() => setPage((p) => p + 1)}>Afficher 12 recettes de plus</button>}
    {message && <p role="status">{message}</p>}
    <p className="fineprint">Quantités indicatives à adapter au nombre de personnes. Vérifier allergènes, conservation et cuisson des ingrédients.</p>
  </section>;
}
