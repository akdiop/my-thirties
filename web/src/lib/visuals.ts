import { templateById } from './challenges';

/**
 * Visuels par défaut de la maquette validée (fichiers WebP de 1280 px de large dans public/visuels).
 * Une photo personnelle choisie avec « Ma photo » passe toujours avant.
 * `position` garde le visage dans le cadre quel que soit le format (mobile, ordinateur, vignette).
 */
export type Visual = { file: string; position: string };

export const VISUALS = {
  cuisine: { file: 'cuisine', position: '58% 30%' },
  pilates: { file: 'pilates', position: '78% 35%' },
  yoga: { file: 'yoga', position: '50% 28%' },
  tennis: { file: 'tennis', position: '44% 30%' },
  passions: { file: 'passions', position: '42% 30%' },
  voyage: { file: 'voyage', position: '35% 50%' },
  bienetre: { file: 'bien-etre', position: '50% 50%' },
  organisation: { file: 'organisation', position: '50% 50%' },
  agenda: { file: 'agenda', position: '50% 50%' },
} satisfies Record<string, Visual>;

/** Visuel par défaut d'un emplacement de photo, ou undefined (dégradé de la palette). */
export function defaultVisual(slot: string): Visual | undefined {
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
    if (t.category === 'Habitudes') return VISUALS.agenda;
    if (t.category === 'Apprentissage' || t.category === 'Créativité') return VISUALS.passions;
  }
  return undefined;
}

/** Fond CSS : un WebP de 1280 px (net sur les écrans haute densité, mis en cache entre grands et petits formats). */
export const visualBackground = (v: Visual) => `url("/visuels/${v.file}.webp")`;
