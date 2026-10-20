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
