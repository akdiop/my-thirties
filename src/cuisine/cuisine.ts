export type Ingredient = { name: string; qty: number | null; unit: string };

export type RecipeLike = {
  id: string;
  title: string;
  servings: number;
  prepMin: number | null;
  cookMin: number | null;
  ingredients: Ingredient[];
  storage: string | null;
};

export const UNITS = ['', 'g', 'kg', 'ml', 'l', 'c. à s.', 'c. à c.', 'pincée', 'botte', 'boîte'] as const;

export const ORIGINS = [
  { id: 'senegalaise', label: 'Sénégalaise' },
  { id: 'africaine', label: 'Africaine' },
  { id: 'internationale', label: 'Internationale' },
  { id: 'maison', label: 'Maison' },
] as const;

export const CATEGORIES = [
  { id: 'plat', label: 'Plat' },
  { id: 'accompagnement', label: 'Accompagnement' },
  { id: 'petit-dejeuner', label: 'Petit-déjeuner' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'boisson', label: 'Boisson' },
] as const;

export const SLOT_LABEL = { dejeuner: 'Déjeuner', diner: 'Dîner' } as const;

const BASE: Record<string, { unit: string; factor: number }> = { kg: { unit: 'g', factor: 1000 }, l: { unit: 'ml', factor: 1000 } };

export const normalizeName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/s$/, '');

function toBase(qty: number | null, unit: string) {
  const b = BASE[unit];
  return b ? { qty: qty === null ? null : qty * b.factor, unit: b.unit } : { qty, unit };
}

function fromBase(qty: number, unit: string) {
  if (unit === 'g' && qty >= 1000) return { qty: qty / 1000, unit: 'kg' };
  if (unit === 'ml' && qty >= 1000) return { qty: qty / 1000, unit: 'l' };
  return { qty, unit };
}

const round = (n: number) => (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10);

export function scaleIngredients(r: Pick<RecipeLike, 'servings' | 'ingredients'>, portions: number): Ingredient[] {
  const factor = portions / Math.max(1, r.servings);
  return r.ingredients.map((i) => ({ ...i, qty: i.qty === null ? null : round(i.qty * factor) }));
}

export function formatQty(i: Pick<Ingredient, 'qty' | 'unit'>) {
  if (i.qty === null) return i.unit;
  const n = String(i.qty).replace('.', ',');
  return i.unit ? `${n} ${i.unit}` : n;
}

export type ShoppingLine = { name: string; qty: number | null; unit: string; recipes: string[] };

/** Additionne les ingrédients du plan, soustrait le placard et renvoie ce qu’il reste à acheter. */
export function shoppingList(planned: { recipe: RecipeLike; portions: number }[], pantry: Ingredient[]): ShoppingLine[] {
  const lines = new Map<string, ShoppingLine>();
  for (const { recipe, portions } of planned) {
    for (const ing of scaleIngredients(recipe, portions)) {
      const base = toBase(ing.qty, ing.unit);
      const key = `${normalizeName(ing.name)}|${base.unit}`;
      const line = lines.get(key);
      if (line) {
        line.qty = line.qty === null || base.qty === null ? null : line.qty + base.qty;
        if (!line.recipes.includes(recipe.title)) line.recipes.push(recipe.title);
      } else lines.set(key, { name: ing.name.trim(), qty: base.qty, unit: base.unit, recipes: [recipe.title] });
    }
  }
  for (const p of pantry) {
    const base = toBase(p.qty, p.unit);
    const line = lines.get(`${normalizeName(p.name)}|${base.unit}`);
    if (!line) continue;
    if (base.qty === null || line.qty === null) lines.delete(`${normalizeName(p.name)}|${base.unit}`);
    else {
      line.qty -= base.qty;
      if (line.qty <= 0) lines.delete(`${normalizeName(p.name)}|${base.unit}`);
    }
  }
  return [...lines.values()]
    .map((l) => (l.qty === null ? l : { ...l, ...fromBase(round(l.qty), l.unit) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

/** Ordre de préparation d’une session : les cuissons longues d’abord, les préparations à froid pendant qu’elles mijotent. */
export function prepOrder(recipes: RecipeLike[]) {
  const sorted = [...recipes].sort((a, b) => (b.cookMin ?? 0) - (a.cookMin ?? 0) || (b.prepMin ?? 0) - (a.prepMin ?? 0));
  const steps: string[] = [];
  const cooking = sorted.filter((r) => (r.cookMin ?? 0) > 0);
  const cold = sorted.filter((r) => !(r.cookMin ?? 0));
  for (const [i, r] of cooking.entries()) {
    steps.push(`${i === 0 ? 'Commencer par' : 'Puis'} ${r.title} : préparation ${r.prepMin ?? '?'} min, cuisson ${r.cookMin} min.`);
  }
  if (cold.length) steps.push(`Pendant les cuissons : ${cold.map((r) => r.title).join(', ')}.`);
  steps.push('Laisser refroidir avant de fermer les boîtes, puis étiqueter avec le nom et la date.');
  const active = sorted.reduce((s, r) => s + (r.prepMin ?? 0), 0);
  const longest = cooking[0]?.cookMin ?? 0;
  return { steps, estimateMin: active + longest };
}

export type LibraryRecipe = Omit<RecipeLike, 'id'> & { libraryId: string; origin: string; category: string; steps: string[] };

/** Recettes de base à adapter : quantités indicatives, à ajuster à vos goûts et à votre matériel. */
export const RECIPE_LIBRARY: LibraryRecipe[] = [
  {
    libraryId: 'yassa-poulet',
    title: 'Yassa au poulet',
    origin: 'senegalaise',
    category: 'plat',
    servings: 4,
    prepMin: 25,
    cookMin: 50,
    ingredients: [
      { name: 'Cuisses de poulet', qty: 4, unit: '' },
      { name: 'Oignons', qty: 6, unit: '' },
      { name: 'Citrons', qty: 3, unit: '' },
      { name: 'Moutarde', qty: 2, unit: 'c. à s.' },
      { name: 'Ail', qty: 3, unit: '' },
      { name: 'Huile', qty: 4, unit: 'c. à s.' },
      { name: 'Riz', qty: 400, unit: 'g' },
    ],
    steps: [
      'Mariner le poulet avec le jus de citron, l’ail, la moutarde et les oignons émincés (idéalement la veille).',
      'Faire dorer le poulet, réserver.',
      'Faire fondre les oignons de la marinade jusqu’à ce qu’ils soient tendres.',
      'Remettre le poulet, mouiller d’un peu d’eau et laisser mijoter 30 minutes.',
      'Servir avec le riz.',
    ],
    storage: '3 jours au réfrigérateur, 2 mois au congélateur (sans le riz).',
  },
  {
    libraryId: 'mafe',
    title: 'Mafé',
    origin: 'senegalaise',
    category: 'plat',
    servings: 4,
    prepMin: 20,
    cookMin: 75,
    ingredients: [
      { name: 'Bœuf en morceaux', qty: 600, unit: 'g' },
      { name: 'Pâte d’arachide', qty: 200, unit: 'g' },
      { name: 'Concentré de tomate', qty: 2, unit: 'c. à s.' },
      { name: 'Oignons', qty: 2, unit: '' },
      { name: 'Patate douce', qty: 1, unit: '' },
      { name: 'Carottes', qty: 2, unit: '' },
      { name: 'Riz', qty: 400, unit: 'g' },
    ],
    steps: [
      'Faire revenir la viande et les oignons.',
      'Ajouter le concentré de tomate, puis la pâte d’arachide délayée dans de l’eau chaude.',
      'Ajouter les légumes en morceaux et laisser mijoter à feu doux en remuant souvent.',
      'Servir avec le riz.',
    ],
    storage: '3 jours au réfrigérateur, 2 mois au congélateur.',
  },
  {
    libraryId: 'thieboudienne',
    title: 'Thiéboudienne',
    origin: 'senegalaise',
    category: 'plat',
    servings: 6,
    prepMin: 45,
    cookMin: 90,
    ingredients: [
      { name: 'Poisson (thiof ou mérou)', qty: 1, unit: 'kg' },
      { name: 'Riz brisé', qty: 750, unit: 'g' },
      { name: 'Concentré de tomate', qty: 3, unit: 'c. à s.' },
      { name: 'Persil', qty: 1, unit: 'botte' },
      { name: 'Ail', qty: 4, unit: '' },
      { name: 'Oignons', qty: 2, unit: '' },
      { name: 'Chou', qty: 1, unit: '' },
      { name: 'Carottes', qty: 3, unit: '' },
      { name: 'Aubergines', qty: 2, unit: '' },
      { name: 'Manioc', qty: 1, unit: '' },
      { name: 'Huile', qty: 10, unit: 'c. à s.' },
    ],
    steps: [
      'Farcir le poisson d’un mélange persil, ail et piment, puis le faire dorer.',
      'Faire revenir les oignons et le concentré de tomate, mouiller et cuire les légumes.',
      'Retirer poisson et légumes, cuire le riz lavé dans le bouillon.',
      'Servir le riz avec les légumes et le poisson.',
    ],
    storage: '2 jours au réfrigérateur ; le poisson se congèle moins bien.',
  },
  {
    libraryId: 'thiakry',
    title: 'Thiakry',
    origin: 'senegalaise',
    category: 'dessert',
    servings: 4,
    prepMin: 15,
    cookMin: 15,
    ingredients: [
      { name: 'Couscous de mil', qty: 250, unit: 'g' },
      { name: 'Yaourt nature', qty: 500, unit: 'g' },
      { name: 'Lait concentré sucré', qty: 4, unit: 'c. à s.' },
      { name: 'Sucre vanillé', qty: 1, unit: '' },
      { name: 'Muscade', qty: 1, unit: 'pincée' },
    ],
    steps: ['Cuire le couscous de mil à la vapeur, laisser refroidir.', 'Mélanger le yaourt, le lait concentré, la vanille et la muscade.', 'Incorporer le mil et servir frais.'],
    storage: '2 jours au réfrigérateur.',
  },
  {
    libraryId: 'bissap',
    title: 'Jus de bissap',
    origin: 'senegalaise',
    category: 'boisson',
    servings: 6,
    prepMin: 10,
    cookMin: 0,
    ingredients: [
      { name: 'Fleurs d’hibiscus séchées', qty: 100, unit: 'g' },
      { name: 'Eau', qty: 1.5, unit: 'l' },
      { name: 'Sucre', qty: 150, unit: 'g' },
      { name: 'Menthe', qty: 1, unit: 'botte' },
    ],
    steps: ['Laisser infuser les fleurs dans l’eau froide plusieurs heures (ou rincer puis infuser à chaud).', 'Filtrer, sucrer à votre goût, ajouter la menthe.', 'Servir très frais.'],
    storage: '3 jours au réfrigérateur.',
  },
  {
    libraryId: 'poulet-dg',
    title: 'Poulet DG',
    origin: 'africaine',
    category: 'plat',
    servings: 4,
    prepMin: 25,
    cookMin: 45,
    ingredients: [
      { name: 'Poulet en morceaux', qty: 1, unit: 'kg' },
      { name: 'Bananes plantain mûres', qty: 3, unit: '' },
      { name: 'Carottes', qty: 2, unit: '' },
      { name: 'Haricots verts', qty: 200, unit: 'g' },
      { name: 'Poivron', qty: 1, unit: '' },
      { name: 'Oignons', qty: 2, unit: '' },
      { name: 'Tomates', qty: 2, unit: '' },
    ],
    steps: ['Dorer le poulet, réserver.', 'Frire les plantains en rondelles.', 'Faire revenir oignons, tomates et légumes, remettre le poulet et mijoter.', 'Ajouter les plantains en fin de cuisson.'],
    storage: '3 jours au réfrigérateur.',
  },
  {
    libraryId: 'dal-corail',
    title: 'Dal de lentilles corail',
    origin: 'internationale',
    category: 'plat',
    servings: 4,
    prepMin: 10,
    cookMin: 25,
    ingredients: [
      { name: 'Lentilles corail', qty: 300, unit: 'g' },
      { name: 'Lait de coco', qty: 400, unit: 'ml' },
      { name: 'Tomates concassées', qty: 1, unit: 'boîte' },
      { name: 'Oignons', qty: 1, unit: '' },
      { name: 'Curry', qty: 2, unit: 'c. à c.' },
      { name: 'Gingembre', qty: 1, unit: 'c. à c.' },
    ],
    steps: ['Faire revenir l’oignon et les épices.', 'Ajouter lentilles rincées, tomates, lait de coco et un peu d’eau.', 'Cuire à feu doux jusqu’à ce que les lentilles fondent.'],
    storage: '4 jours au réfrigérateur, 3 mois au congélateur.',
  },
  {
    libraryId: 'chili-sin-carne',
    title: 'Chili sin carne',
    origin: 'internationale',
    category: 'plat',
    servings: 4,
    prepMin: 15,
    cookMin: 35,
    ingredients: [
      { name: 'Haricots rouges', qty: 2, unit: 'boîte' },
      { name: 'Tomates concassées', qty: 1, unit: 'boîte' },
      { name: 'Poivron', qty: 1, unit: '' },
      { name: 'Oignons', qty: 1, unit: '' },
      { name: 'Maïs', qty: 150, unit: 'g' },
      { name: 'Cumin', qty: 1, unit: 'c. à c.' },
    ],
    steps: ['Faire revenir oignon et poivron.', 'Ajouter tomates, haricots égouttés, maïs et épices.', 'Laisser mijoter jusqu’à épaississement.'],
    storage: '4 jours au réfrigérateur, 3 mois au congélateur.',
  },
  {
    libraryId: 'overnight-oats',
    title: 'Porridge de la veille',
    origin: 'internationale',
    category: 'petit-dejeuner',
    servings: 1,
    prepMin: 5,
    cookMin: 0,
    ingredients: [
      { name: 'Flocons d’avoine', qty: 50, unit: 'g' },
      { name: 'Lait ou boisson végétale', qty: 150, unit: 'ml' },
      { name: 'Yaourt nature', qty: 50, unit: 'g' },
      { name: 'Fruits', qty: 1, unit: '' },
    ],
    steps: ['Mélanger avoine, lait et yaourt dans un bocal.', 'Laisser une nuit au réfrigérateur.', 'Ajouter les fruits le matin.'],
    storage: '3 jours au réfrigérateur (sans les fruits).',
  },
];

export const originLabel = (id: string) => ORIGINS.find((o) => o.id === id)?.label ?? 'Maison';
export const categoryLabel = (id: string) => CATEGORIES.find((o) => o.id === id)?.label ?? 'Plat';

/** « 400 g riz », « 2 oignons », « sel » → ingrédient. */
export function parseIngredientLine(line: string): Ingredient | null {
  const text = line.trim().replace(/^[-•·]\s*/, '');
  if (!text) return null;
  const m = text.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!m) return { name: text, qty: null, unit: '' };
  const qty = Number(m[1]!.replace(',', '.'));
  const rest = m[2]!.trim();
  const unit = [...UNITS].filter(Boolean).sort((a, b) => b.length - a.length).find((u) => rest.toLowerCase().startsWith(`${u} `));
  const name = (unit ? rest.slice(unit.length) : rest).trim().replace(/^d[e’']\s*/i, '');
  return name ? { name: name.charAt(0).toUpperCase() + name.slice(1), qty, unit: unit ?? '' } : null;
}

export const ingredientLine = (i: Ingredient) => [formatQty(i), i.name].filter(Boolean).join(' ');
