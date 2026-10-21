export type IngredientSource = { lines: string; multiplier: number };

type Parsed = { amount: number; unit: string; name: string; key: string };
const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr-FR');
const knownUnits: Record<string, { unit: string; factor: number }> = {
  kg: { unit: 'g', factor: 1000 }, g: { unit: 'g', factor: 1 },
  l: { unit: 'ml', factor: 1000 }, ml: { unit: 'ml', factor: 1 }, cl: { unit: 'ml', factor: 10 },
  'càs': { unit: 'càs', factor: 1 }, 'càc': { unit: 'càc', factor: 1 },
  'pièce': { unit: 'pièce', factor: 1 }, 'pièces': { unit: 'pièce', factor: 1 },
};

function parse(line: string, multiplier: number): Parsed | null {
  const match = line.trim().match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|ml|cl|l|càs|càc|pièces?)?\s+(.+)$/i);
  if (!match) return null;
  const quantity = Number((match[1] ?? '').replace(',', '.'));
  const unitInput = (match[2] ?? '').toLowerCase();
  const name = (match[3] ?? '').trim();
  const conversion = knownUnits[unitInput] ?? { unit: 'unité', factor: 1 };
  if (!Number.isFinite(quantity) || quantity <= 0 || !name) return null;
  return { amount: quantity * multiplier * conversion.factor, unit: conversion.unit, name, key: normalize(name) + '|' + conversion.unit };
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(n);
function label(ingredient: Parsed) {
  if (ingredient.unit === 'g' && ingredient.amount >= 1000) return fmt(ingredient.amount / 1000) + ' kg ' + ingredient.name;
  if (ingredient.unit === 'ml' && ingredient.amount >= 1000) return fmt(ingredient.amount / 1000) + ' l ' + ingredient.name;
  return fmt(ingredient.amount) + (ingredient.unit === 'unité' ? ' ' : ' ' + ingredient.unit + ' ') + ingredient.name;
}

/** Consolidates matching ingredients and compatible units; never guesses conversions for unknown units. */
export function consolidateIngredients(sources: IngredientSource[]) {
  const quantities = new Map<string, Parsed>();
  const freeText = new Map<string, string>();
  for (const source of sources) {
    const multiplier = Number.isFinite(source.multiplier) && source.multiplier > 0 ? source.multiplier : 1;
    for (const line of source.lines.split('\n').map((x) => x.trim()).filter(Boolean)) {
      const parsed = parse(line, multiplier);
      if (!parsed) { freeText.set(normalize(line), line); continue; }
      const existing = quantities.get(parsed.key);
      if (existing) existing.amount += parsed.amount;
      else quantities.set(parsed.key, parsed);
    }
  }
  return [...Array.from(quantities.values(), label), ...freeText.values()];
}

/* ---------- Liste de courses automatique de la semaine ---------- */
type MealLike = { id: string; kind: string; module: string; entry_date: string | null; data: Record<string, unknown> };
export type ListItem = { id: string; text: string; checked: boolean };
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const isoDay = (d: Date) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');

/** Lundi de la semaine d'une date AAAA-MM-JJ. */
export function weekStart(date: string) {
  const d = new Date(date + 'T12:00:00');
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return isoDay(d);
}
export const weekEnd = (start: string) => { const d = new Date(start + 'T12:00:00'); d.setDate(d.getDate() + 6); return isoDay(d); };
export const groceryTitle = (start: string) => 'Courses · semaine du ' + new Date(start + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

/** Ingrédients regroupés de tous les repas planifiés de la semaine (recette enregistrée ou ingrédients copiés dans le repas). */
export function weekGroceryItems(entries: MealLike[], start: string) {
  const end = weekEnd(start);
  const meals = entries.filter((e) => e.module === 'cuisine' && e.kind === 'meal' && e.entry_date && e.entry_date >= start && e.entry_date <= end);
  const bySource = new Map<string, IngredientSource>();
  for (const meal of meals) {
    const recipe = entries.find((r) => r.kind === 'recipe' && r.id === str(meal.data.recipeId));
    const lines = str(meal.data.ingredients) || (recipe ? str(recipe.data.ingredients) : '');
    if (!lines) continue;
    const key = str(meal.data.recipeId) || str(meal.data.libraryId) || lines;
    const current = bySource.get(key);
    if (current) current.multiplier += 1; else bySource.set(key, { lines, multiplier: 1 });
  }
  return consolidateIngredients([...bySource.values()]);
}

/** Remplace les articles générés automatiquement, garde les articles ajoutés à la main et ce qui est déjà coché. */
export function mergeGroceryItems(existing: ListItem[], previousAuto: string[], fresh: string[], newId: () => string): ListItem[] {
  const manual = existing.filter((i) => !previousAuto.includes(i.text) && !fresh.includes(i.text));
  const auto = fresh.map((text) => {
    const old = existing.find((i) => i.text === text);
    return { id: old?.id ?? newId(), text, checked: old?.checked ?? false };
  });
  return [...auto, ...manual];
}
