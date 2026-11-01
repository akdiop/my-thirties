import { Glyph, TINTS, type GlyphName, type Tint } from './Glyph';

const TINT_NAMES = Object.keys(TINTS) as Tint[];
const tintOf = (seed: string) => TINT_NAMES[[...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 3) % TINT_NAMES.length]!;

/** Vignette de couleur (palette de l'app) avec une icône : remplace les photos des recettes, destinations et défis. */
export function ColorTile({ seed, icon, label, badge }: { seed: string; icon: GlyphName; label: string; badge?: string }) {
  const tint = tintOf(seed), [bg, ink] = TINTS[tint];
  return <div className="color-tile" style={{ background: `linear-gradient(135deg, ${bg} 0%, ${bg} 55%, ${ink}2e 100%)` }} role="img" aria-label={label}>
    <span className="color-tile-icon" style={{ background: '#fffaf5cc' }}><Glyph name={icon} tint={tint} size={34} /></span>
    {badge && <span className="color-tile-badge" style={{ color: ink, borderColor: ink + '55' }}>{badge}</span>}
    <span className="color-tile-ring" style={{ borderColor: ink + '26' }} aria-hidden="true" />
  </div>;
}

const RECIPE_ICON: Record<string, GlyphName> = {
  'petit-dejeuner': 'coffee', dejeuner: 'salad', diner: 'soup', 'casse-croute': 'sandwich', smoothie: 'drink', shot: 'citrus',
  boulangerie: 'croissant', dessert: 'cake', 'base-maison': 'pot', quiches: 'eggFried', poulet: 'drumstick', automne: 'soup',
};
/** Icône du plat d'après le titre (sinon celle de la catégorie). */
export function dishIcon(title: string, category: string): GlyphName {
  const t = title.toLowerCase();
  const rules: [RegExp, GlyphName][] = [[/smoothie/, 'drink'], [/^shot/, 'citrus'], [/porridge|bouillie|avoine/, 'wheat'], [/crêpe|crepe|pancake/, 'eggFried'], [/omelette|œuf|oeuf/, 'egg'],
    [/poisson|thi[ée]b|thon|saumon|crevette/, 'fish'], [/poulet|yassa|dinde/, 'drumstick'], [/bœuf|boeuf|agneau|viande/, 'beef'], [/riz|curry|maf[ée]/, 'pot'],
    [/pâtes|spaghetti|lasagne|nouilles|soupe|velouté/, 'soup'], [/salade/, 'salad'], [/pizza/, 'pizza'], [/wrap|tacos|sandwich|tartine/, 'sandwich'],
    [/pain|focaccia|naan|pita/, 'wheat'], [/gâteau|cake|muffin|flan|clafoutis/, 'cake'], [/cookie/, 'cookie'], [/patate|légume|gratin|carotte/, 'carrot'],
    [/yaourt|lait/, 'milk'], [/compote|pomme/, 'apple'], [/pop-corn/, 'popcorn']];
  return rules.find(([re]) => re.test(t))?.[1] ?? RECIPE_ICON[category] ?? 'utensils';
}

const CODES: Record<string, string> = {
  Maroc: 'MA', Sénégal: 'SN', 'Cap-Vert': 'CV', Portugal: 'PT', Espagne: 'ES', Turquie: 'TR', Grèce: 'GR', Italie: 'IT', Danemark: 'DK',
  'Pays-Bas': 'NL', Japon: 'JP', Indonésie: 'ID', Tanzanie: 'TZ', Rwanda: 'RW', 'Afrique du Sud': 'ZA', Jordanie: 'JO', 'Émirats arabes unis': 'AE',
  Canada: 'CA', 'États-Unis': 'US', Brésil: 'BR',
};
export const countryCode = (country: string) => CODES[country] ?? '';
export const STYLE_ICON: Record<string, GlyphName> = { Culture: 'landmark', Nature: 'mountain', Détente: 'palm', Ville: 'city', Aventure: 'compass' };
