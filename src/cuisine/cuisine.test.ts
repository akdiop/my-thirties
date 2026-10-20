import { ingredientLine, parseIngredientLine, prepOrder, RECIPE_LIBRARY, scaleIngredients, shoppingList, type RecipeLike } from './cuisine';

const r = (id: string, servings: number, ingredients: RecipeLike['ingredients'], cookMin: number | null = 30): RecipeLike => ({ id, title: id, servings, prepMin: 10, cookMin, ingredients, storage: null });

describe('cuisine', () => {
  it('scales portions', () => {
    expect(scaleIngredients(r('a', 4, [{ name: 'Riz', qty: 400, unit: 'g' }, { name: 'Sel', qty: null, unit: '' }]), 6)).toEqual([
      { name: 'Riz', qty: 600, unit: 'g' },
      { name: 'Sel', qty: null, unit: '' },
    ]);
  });

  it('aggregates across recipes, converts units and subtracts the pantry', () => {
    const lines = shoppingList(
      [
        { recipe: r('Mafé', 4, [{ name: 'Oignons', qty: 2, unit: '' }, { name: 'Riz', qty: 400, unit: 'g' }]), portions: 4 },
        { recipe: r('Yassa', 4, [{ name: 'oignon', qty: 6, unit: '' }, { name: 'Riz', qty: 0.8, unit: 'kg' }]), portions: 2 },
      ],
      [{ name: 'Oignons', qty: 1, unit: '' }],
    );
    expect(lines).toEqual([
      { name: 'Oignons', qty: 4, unit: '', recipes: ['Mafé', 'Yassa'] },
      { name: 'Riz', qty: 800, unit: 'g', recipes: ['Mafé', 'Yassa'] },
    ]);
  });

  it('drops an item fully covered by the pantry', () => {
    expect(shoppingList([{ recipe: r('a', 1, [{ name: 'Lait', qty: 500, unit: 'ml' }]), portions: 1 }], [{ name: 'lait', qty: 1, unit: 'l' }])).toEqual([]);
  });

  it('orders long cooking first', () => {
    const { steps, estimateMin } = prepOrder([r('Dal', 4, [], 25), r('Bissap', 4, [], 0), r('Mafé', 4, [], 75)]);
    expect(steps[0]).toContain('Mafé');
    expect(steps[2]).toContain('Bissap');
    expect(estimateMin).toBe(30 + 75);
  });

  it('library recipes have ingredients and steps', () => {
    for (const x of RECIPE_LIBRARY) {
      expect(x.ingredients.length).toBeGreaterThanOrEqual(2);
      expect(x.steps.length).toBeGreaterThan(1);
    }
  });
});

describe('ingredient lines', () => {
  it('parses quantity, unit and name', () => {
    expect(parseIngredientLine('400 g riz')).toEqual({ name: 'Riz', qty: 400, unit: 'g' });
    expect(parseIngredientLine('2 c. à s. de moutarde')).toEqual({ name: 'Moutarde', qty: 2, unit: 'c. à s.' });
    expect(parseIngredientLine('1,5 l eau')).toEqual({ name: 'Eau', qty: 1.5, unit: 'l' });
    expect(parseIngredientLine('3 oignons')).toEqual({ name: 'Oignons', qty: 3, unit: '' });
    expect(parseIngredientLine('- sel')).toEqual({ name: 'sel', qty: null, unit: '' });
    expect(parseIngredientLine('  ')).toBeNull();
    expect(ingredientLine({ name: 'Eau', qty: 1.5, unit: 'l' })).toBe('1,5 l Eau');
  });
});
