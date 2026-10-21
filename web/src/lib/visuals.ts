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
  // Les fiches de recettes, destinations et voyages ne doivent pas afficher
  // une photo générique comme s'il s'agissait du plat ou du lieu exact.
  if (slot.startsWith('recipe-') || slot.startsWith('destination-') || slot.startsWith('trip-')) return undefined;
  // Pas de portrait de lecture pour un parcours de langue ou d'écriture.
  if (slot.startsWith('path-')) return undefined;
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
