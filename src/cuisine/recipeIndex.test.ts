import { PERSONALIZED_RECIPES } from './recipeIndex';
import { parseCuratedIngredient } from './recipeParser';

describe('bibliothèque personnalisée', () => {
  const categories = ['petit-dejeuner', 'dejeuner', 'diner', 'casse-croute', 'smoothie', 'shot'];
  it('contient exactement 50 recettes dans chacune des 6 catégories', () => {
    expect(PERSONALIZED_RECIPES).toHaveLength(300);
    for (const category of categories) {
      expect(PERSONALIZED_RECIPES.filter((r) => r.category === category)).toHaveLength(50);
    }
  });
  it('contient des identifiants et des titres uniques dans chaque catégorie', () => {
    expect(new Set(PERSONALIZED_RECIPES.map((r) => r.id)).size).toBe(300);
    for (const category of categories) {
      const rows = PERSONALIZED_RECIPES.filter((r) => r.category === category);
      expect(new Set(rows.map((r) => r.title)).size).toBe(50);
    }
  });
  it('contient des ingrédients, des étapes et des portions', () => {
    for (const r of PERSONALIZED_RECIPES) {
      expect(r.servings).toBeGreaterThan(0);
      expect(r.ingredients.split(';').length).toBeGreaterThanOrEqual(2);
      expect(r.steps.length).toBeGreaterThanOrEqual(3);
      expect(r.prepMin).toBeGreaterThan(0);
    }
  });
  it('lit les quantités des ingrédients pour les listes de courses', () => {
    expect(parseCuratedIngredient('200 ml lait')).toEqual({ name: 'lait', qty: 200, unit: 'ml' });
    expect(parseCuratedIngredient('1.5 c. à s. huile')).toEqual({ name: 'huile', qty: 1.5, unit: 'c. à s.' });
    expect(parseCuratedIngredient('2 œufs')).toEqual({ name: 'œufs', qty: 2, unit: '' });
  });
});
