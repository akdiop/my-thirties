/**
 * Bibliothèque graphique du panda (images créées par Aïda, PNG transparents dans public/panda/).
 * Quand une image existe, elle remplace le dessin SVG de secours. Ajouter son nom ici quand le fichier est livré.
 * Convention : voir docs/panda-assets.md.
 */
export const PANDA_ASSETS = new Set<string>([
  // ex. 'panda_idle', 'panda_happy', 'acc_chapeau', 'item_coussin', 'bg_maison_automne'
]);
export const assetUrl = (name: string) => (PANDA_ASSETS.has(name) ? '/panda/' + name + '.png' : '');
