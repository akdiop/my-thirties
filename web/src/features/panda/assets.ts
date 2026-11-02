/**
 * Bibliothèque graphique du panda (images créées par Aïda, PNG transparents dans public/panda/).
 * Quand une image existe, elle remplace le dessin SVG de secours. Ajouter son nom ici quand le fichier est livré.
 * Convention : voir docs/panda-assets.md.
 */
export const PANDA_ASSETS = new Set<string>([
  'panda_idle', 'panda_happy', 'panda_playful', 'panda_sleepy', 'panda_calm', 'panda_curious',
  'panda_surprised', 'panda_proud', 'panda_eating', 'panda_reading', 'panda_tea',
  'banner_lecture', 'banner_organisation', 'banner_cuisine', 'banner_bienetre', 'banner_objectifs',
  'banner_spiritualite', 'banner_sport', 'banner_voyages', 'banner_sommeil',
]);
export const assetUrl = (name: string) => (PANDA_ASSETS.has(name) ? '/panda/' + name + '.webp' : '');
