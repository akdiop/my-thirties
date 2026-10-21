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
