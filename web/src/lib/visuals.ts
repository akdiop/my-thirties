import { templateById } from './challenges';

/**
 * Visuels par défaut de la maquette validée (fichiers WebP de 1280 px de large dans public/visuels).
 * Une photo personnelle choisie avec « Ma photo » passe toujours avant.
 * `position` garde le visage dans le cadre quel que soit le format (mobile, ordinateur, vignette).
 */
export type Visual = { file: string; position: string; missing?: boolean };

export const VISUALS = {
  cuisine: { file: 'cuisine', position: '70% 15%' },
  pilates: { file: 'pilates', position: '80% 20%' },
  yoga: { file: 'yoga', position: '62% 8%' },
  tennis: { file: 'tennis', position: '48% 15%' },
  passions: { file: 'passions', position: '42% 30%', missing: true },
  voyage: { file: 'voyage', position: '40% 60%' },
  bienetre: { file: 'bien-etre', position: '50% 55%' },
  organisation: { file: 'organisation', position: '45% 55%' },
  apprentissage: { file: 'apprentissage', position: '50% 50%', missing: true },
} satisfies Record<string, Visual>;

/** Visuel par défaut d'un emplacement de photo, ou undefined (dégradé de la palette). */
export function defaultVisual(slot: string): Visual | undefined {
  const v = pick(slot);
  return v && !v.missing ? v : undefined;
}

function pick(slot: string): Visual | undefined {
  if (slot === 'module-cuisine') return VISUALS.cuisine;
  if (slot === 'module-decouvertes') return VISUALS.voyage;
  if (slot === 'sport-pilates') return VISUALS.pilates;
  if (slot === 'sport-yoga') return VISUALS.yoga;
  if (slot === 'sport-tennis') return VISUALS.tennis;
  if (slot.startsWith('recipe-')) return VISUALS.cuisine;
  if (slot.startsWith('destination-') || slot.startsWith('trip-')) return VISUALS.voyage;
  if (slot.startsWith('path-')) return VISUALS.passions;
  if (slot.startsWith('challenge-')) {
    const t = templateById(slot.slice('challenge-'.length));
    if (!t) return undefined;
    if (t.discipline === 'Pilates') return VISUALS.pilates;
    if (t.discipline === 'Yoga') return VISUALS.yoga;
    if (t.discipline === 'Tennis') return VISUALS.tennis;
    if (t.category === 'Cuisine') return VISUALS.cuisine;
    if (t.category === 'Bien-être') return VISUALS.bienetre;
    if (t.category === 'Organisation') return VISUALS.organisation;
    if (t.category === 'Habitudes') return VISUALS.organisation;
    if (t.category === 'Apprentissage') return VISUALS.apprentissage;
    if (t.category === 'Créativité') return VISUALS.passions;
  }
  return undefined;
}

/** Fond CSS : un WebP de 1280 px (net sur les écrans haute densité, mis en cache entre grands et petits formats). */
export const visualBackground = (v: Visual) => `url("/visuels/${v.file}.webp")`;
/**
 * Images d'ambiance libres d'utilisation sur Pexels (pages sources dans docs/PHOTOS_AMBIANCE.md).
 * Les photos illustrent un thème et ne prétendent pas montrer la personne ou la recette enregistrée.
 * Les images externes sont chargées uniquement dans les espaces visuels publics de l'interface.
 */
const pexels = (id: number, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const VISUALS = {
  pilates: pexels(6303481),
  yoga: pexels(6303431),
  tennis: pexels(19349790),
  cooking: pexels(12911570),
  quiche: pexels(34318142),
  pasta: pexels(17804216),
  travel: pexels(1753121),
  dakar: pexels(33432833),
  lisbon: pexels(35435858),
  reading: pexels(5311633),
  learning: pexels(7584771),
  creativity: pexels(5033997),
  wellbeing: pexels(6303446),
} as const;

export const MODULE_VISUALS: Record<string, string> = {
  sport: VISUALS.tennis,
  cuisine: VISUALS.cooking,
  decouvertes: VISUALS.travel,
  passions: VISUALS.reading,
  challenges: VISUALS.wellbeing,
};

export function destinationVisual(name: string): string | undefined {
  const normalized = name.toLocaleLowerCase('fr');
  if (/dakar/.test(normalized)) return VISUALS.dakar;
  if (/lisbonne|lisbon/.test(normalized)) return VISUALS.lisbon;
  return undefined; // Ne jamais présenter une ville différente comme la destination demandée.
}

export function recipeVisual(title: string): string | undefined {
  const normalized = title.toLocaleLowerCase('fr');
  if (/quiche/.test(normalized)) return VISUALS.quiche;
  if (/pâtes|pates|spaghetti|pasta|linguine|penne/.test(normalized)) return VISUALS.pasta;
  return undefined; // Pas de fausse photo du plat : conserver le fond neutre ou une photo personnelle.
}

export function defaultHeroVisual(slot: string, label: string): string | undefined {
  if (slot === 'sport-pilates') return VISUALS.pilates;
  if (slot === 'sport-yoga') return VISUALS.yoga;
  if (slot === 'sport-tennis') return VISUALS.tennis;
  if (slot.startsWith('path-')) return VISUALS.learning;
  if (slot.startsWith('recipe-')) return recipeVisual(label);
  if (slot.startsWith('destination-') || slot.startsWith('trip-')) return destinationVisual(label);
  return undefined;
}
