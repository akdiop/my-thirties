import { useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';

const ideas = [
  {
    title: 'Poulet yassa doux',
    duration: '70', portions: '4',
    ingredients: '800 g poulet\n5 pièces oignons\n2 pièces citrons\n3 càs huile\n2 càs moutarde\n2 pièces gousses d’ail\n300 g riz\nSel et poivre',
    steps: '1. Émincer les oignons et hacher l’ail. Mélanger citron, moutarde, ail et un peu d’huile.\n2. Enrober le poulet de marinade et laisser reposer au frais.\n3. Faire revenir le poulet, puis les oignons, dans une casserole. Ajouter la marinade et un peu d’eau.\n4. Laisser mijoter jusqu’à cuisson complète du poulet, sans partie rosée à cœur.\n5. Cuire le riz séparément selon les indications du paquet. Servir avec la sauce aux oignons.',
    storage: 'Réfrigérer les restes rapidement, dans les deux heures, et les consommer dans les jours suivants selon les recommandations locales.',
  },
  {
    title: 'Riz aux légumes colorés',
    duration: '35', portions: '4',
    ingredients: '300 g riz\n2 pièces carottes\n1 pièce courgette\n1 pièce oignon\n2 càs huile\n600 ml eau\nSel, poivre et herbes',
    steps: '1. Rincer le riz. Couper les légumes en petits dés.\n2. Faire revenir l’oignon dans l’huile, puis ajouter les carottes et la courgette.\n3. Verser le riz et mélanger une minute. Ajouter l’eau et assaisonner.\n4. Couvrir et cuire doucement selon le temps indiqué pour le riz, en vérifiant l’eau.\n5. Laisser reposer quelques minutes avant de servir.',
    storage: 'Refroidir le riz cuit rapidement et le conserver au réfrigérateur. Éviter de le laisser longtemps à température ambiante.',
  },
  {
    title: 'Pâtes à la tomate et aux herbes',
    duration: '25', portions: '3',
    ingredients: '300 g pâtes\n400 g tomates concassées\n1 pièce oignon\n2 pièces gousses d’ail\n2 càs huile\n1 càc herbes séchées\nSel et poivre',
    steps: '1. Porter une grande casserole d’eau à ébullition et cuire les pâtes selon le paquet.\n2. Faire revenir l’oignon émincé dans l’huile, puis ajouter l’ail.\n3. Ajouter les tomates et les herbes, puis laisser mijoter 10 à 15 minutes.\n4. Mélanger les pâtes égouttées à la sauce. Ajouter un peu d’eau de cuisson si nécessaire.\n5. Goûter et ajuster l’assaisonnement.',
    storage: 'Conserver au réfrigérateur rapidement après refroidissement et réchauffer soigneusement avant de servir.',
  },
] as const;

export function RecipeIdeas({ entries, onCreate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const create = async (recipe: typeof ideas[number]) => {
    setBusy(recipe.title); setMessage('');
    try {
      await onCreate({ module: 'cuisine', kind: 'recipe', title: recipe.title, entry_date: null,
        data: { portions: recipe.portions, duration: recipe.duration, ingredients: recipe.ingredients,
          steps: recipe.steps, storage: recipe.storage } });
      setMessage('Recette ajoutée : ' + recipe.title);
    } catch { setMessage('Impossible d’ajouter cette recette.'); } finally { setBusy(''); }
  };
  return <section className="tool-card"><h3>Idées de recettes pour débuter</h3>
    <p className="muted">Des bases simples à adapter à tes goûts et aux ingrédients disponibles.</p>
    <div className="lesson-grid">{ideas.map((recipe) => {
      const exists = entries.some((e) => e.kind === 'recipe' && e.title === recipe.title);
      return <article className="lesson-card" key={recipe.title}>
        <h3>{recipe.title}</h3><p>{recipe.duration} min environ · {recipe.portions} portions</p>
        <details><summary>Voir les étapes</summary><p className="recipe-steps">{recipe.steps}</p></details>
        <button className="button secondary" disabled={Boolean(busy) || exists} onClick={() => void create(recipe)}>
          {exists ? 'Dans mes recettes' : 'Ajouter à mes recettes'}</button>
      </article>;
    })}</div>
    {message && <p role="status">{message}</p>}
    <p className="fineprint">Recettes indicatives : vérifier les allergènes, les températures et la cuisson des aliments selon les ingrédients utilisés.</p>
  </section>;
}
