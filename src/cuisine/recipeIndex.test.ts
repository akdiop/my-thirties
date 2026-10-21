import { PERSONALIZED_RECIPES } from './recipeIndex';
import { parseCuratedIngredient } from './recipeParser';
import { recipeStyle } from './recipeStyles';

describe('bibliothèque personnalisée', () => {
  const categories = ['petit-dejeuner', 'dejeuner', 'diner', 'casse-croute', 'smoothie', 'shot'];
  it('conserve 50 recettes dans les 6 catégories initiales et ajoute 15 recettes originales', () => {
    expect(PERSONALIZED_RECIPES).toHaveLength(315);
    for (const category of categories) {
      expect(PERSONALIZED_RECIPES.filter((r) => r.category === category)).toHaveLength(50);
    }
    for (const category of ['boulangerie', 'dessert', 'base-maison']) {
      expect(PERSONALIZED_RECIPES.filter((r) => r.category === category)).toHaveLength(5);
    }
  });
  it('contient des identifiants et des titres uniques dans chaque catégorie', () => {
    expect(new Set(PERSONALIZED_RECIPES.map((r) => r.id)).size).toBe(315);
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
  it('filtre les recettes selon leur inspiration culinaire', () => {
    expect(recipeStyle({ title: 'Yassa de poulet' })).toBe('senegalaise');
    expect(recipeStyle({ title: 'Quiche sans pâte aux légumes' })).toBe('francaise');
    expect(recipeStyle({ title: 'Risotto aux champignons' })).toBe('italienne');
    expect(recipeStyle({ title: 'Curry au lait de coco' })).toBe('asiatique');
    expect(recipeStyle({ title: 'Pain maison', origin: 'francaise' })).toBe('francaise');
  });
  it('lit les quantités des ingrédients pour les listes de courses', () => {
    expect(parseCuratedIngredient('200 ml lait')).toEqual({ name: 'lait', qty: 200, unit: 'ml' });
    expect(parseCuratedIngredient('1.5 c. à s. huile')).toEqual({ name: 'huile', qty: 1.5, unit: 'c. à s.' });
    expect(parseCuratedIngredient('2 œufs')).toEqual({ name: 'œufs', qty: 2, unit: '' });
  });
});
