import { swatchOf } from '../lib/rituals';

/** Vignette de couleur (palette de l'app) avec un symbole : remplace les photos des recettes, destinations et défis. */
export function ColorTile({ seed, emoji, label, badge }: { seed: string; emoji: string; label: string; badge?: string }) {
  const [bg, ink] = swatchOf(seed);
  return <div className="color-tile" style={{ background: `linear-gradient(135deg, ${bg} 0%, ${bg} 55%, ${ink}33 100%)`, color: ink }} role="img" aria-label={label}>
    <span className="color-tile-emoji" aria-hidden="true">{emoji}</span>
    {badge && <span className="color-tile-badge" aria-hidden="true">{badge}</span>}
    <span className="color-tile-ring" style={{ borderColor: ink + '33' }} aria-hidden="true" />
  </div>;
}

export const RECIPE_EMOJI: Record<string, string> = {
  'petit-dejeuner': '🥣', dejeuner: '🥗', diner: '🍲', 'casse-croute': '🥪', smoothie: '🥤', shot: '🧃',
  boulangerie: '🥖', dessert: '🍰', 'base-maison': '🫙',
};
/** Symbole du plat d'après le titre (sinon celui de la catégorie). */
export function dishEmoji(title: string, category: string) {
  const t = title.toLowerCase();
  const rules: [RegExp, string][] = [[/smoothie/, '🥤'], [/^shot/, '🧃'], [/porridge|bouillie|avoine/, '🥣'], [/crêpe|crepe|pancake/, '🥞'], [/omelette|œuf|oeuf/, '🍳'],
    [/poisson|thi[ée]b|thon|saumon|crevette/, '🐟'], [/poulet|yassa|dinde/, '🍗'], [/bœuf|boeuf|agneau|viande/, '🥩'], [/riz/, '🍚'], [/pâtes|spaghetti|lasagne|nouilles/, '🍝'],
    [/soupe|velouté/, '🍜'], [/salade/, '🥗'], [/pizza/, '🍕'], [/wrap|tacos|sandwich|tartine/, '🌯'], [/pain|focaccia|naan|pita/, '🍞'], [/gâteau|cake|muffin|cookie|flan|clafoutis/, '🧁'],
    [/curry|mafé|maf[eé]/, '🍛'], [/patate|légume|gratin/, '🥕'], [/yaourt|compote/, '🍨'], [/pop-corn/, '🍿']];
  return rules.find(([re]) => re.test(t))?.[1] ?? RECIPE_EMOJI[category] ?? '🍽️';
}

const FLAGS: Record<string, string> = {
  Maroc: '🇲🇦', Sénégal: '🇸🇳', 'Cap-Vert': '🇨🇻', Portugal: '🇵🇹', Espagne: '🇪🇸', Turquie: '🇹🇷', Grèce: '🇬🇷', Italie: '🇮🇹', Danemark: '🇩🇰',
  'Pays-Bas': '🇳🇱', Japon: '🇯🇵', Indonésie: '🇮🇩', Tanzanie: '🇹🇿', Rwanda: '🇷🇼', 'Afrique du Sud': '🇿🇦', Jordanie: '🇯🇴', 'Émirats arabes unis': '🇦🇪',
  Canada: '🇨🇦', 'États-Unis': '🇺🇸', Brésil: '🇧🇷',
};
export const flagOf = (country: string) => FLAGS[country] ?? '';
export const STYLE_EMOJI: Record<string, string> = { Culture: '🏛️', Nature: '🌿', Détente: '🏝️', Ville: '🏙️', Aventure: '🧭' };
