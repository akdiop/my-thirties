import type { CuratedRecipe } from './types';

/** Familles d'inspiration, pas une certification d'origine ou d'authenticité. */
export const CULINARY_STYLES = [
  { id: 'toutes', label: 'Toutes les inspirations' },
  { id: 'francaise', label: 'Française' },
  { id: 'senegalaise', label: 'Sénégalaise / ouest-africaine' },
  { id: 'italienne', label: 'Italienne' },
  { id: 'mediterraneenne', label: 'Méditerranéenne' },
  { id: 'asiatique', label: 'Asiatique' },
  { id: 'maison', label: 'Autres idées maison' },
] as const;

export type CulinaryStyle = (typeof CULINARY_STYLES)[number]['id'];
export function recipeStyle(recipe: Pick<CuratedRecipe, 'title' | 'origin'>): Exclude<CulinaryStyle, 'toutes'> {
  if (recipe.origin && CULINARY_STYLES.some((style) => style.id === recipe.origin)) {
    return recipe.origin as Exclude<CulinaryStyle, 'toutes'>;
  }
  const title = recipe.title.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/yassa|mafe|attieke|thieb|thiou|domoda|ceebu/.test(title)) return 'senegalaise';
  if (/risotto|lasagne|pizza|focaccia|bolognaise|mozzarella|pates sauce maison/.test(title)) return 'italienne';
  if (/curry|naan|nouilles sautees|riz saute/.test(title)) return 'asiatique';
  if (/couscous|houmous|feta|boulgour/.test(title)) return 'mediterraneenne';
  if (/quiche|gratin|veloute|crepe|clafoutis|flan|omelette|pain de mie/.test(title)) return 'francaise';
  return 'maison';
}
export const culinaryStyleLabel = (style: string) => CULINARY_STYLES.find((s) => s.id === style)?.label ?? 'Autres idées maison';
