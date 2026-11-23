/**
 * Fiche détaillée de la station de recherche de Pelican Valley, rédigée à partir de GUIDE_ARGENT_ET_MARAIS.md (kit du 23/11/2026).
 * Rien n'est ajouté au-delà du guide : les montants sont ceux rapportés par des guides tiers, en GTA$ fictifs.
 */
export const PELICAN_ID = 'pelican-crab-outpost';

export const PELICAN = {
  secteur: 'Gullet Marsh, Mariana County : petite île des marécages, à l’ouest de l’indication « Pelican Valley » sur la carte du jeu, au nord des Keys.',
  repere: 'Sur ta carte, Pelican Valley est dans la partie centre-sud. Vérifie le repère exact en jeu : aucun marqueur précis n’est posé ici.',
  itineraire: [
    'Depuis Key Lento, remonter vers les marécages et rejoindre un accès à l’eau.',
    'Départ possible : le ponton de Stillwater Path, au nord-est du secteur.',
    'Naviguer jusqu’à la petite station isolée.',
  ],
  batiments: [
    { nom: 'Maison principale', detail: 'Véranda et antennes. Le boîtier électrique est à l’extérieur, près du tuyau vert ; l’ordinateur et le coffre sont à l’intérieur.' },
    { nom: 'Chambre', detail: 'Un mot est inscrit au sol.' },
    { nom: 'Dépendance de recherche', detail: 'Bâtiment avec des bassins ; une note y mentionne le spécimen réussi.' },
    { nom: 'Ponton et bâtiment fermé', detail: 'Long ponton en bois menant à une bâtisse fermée par un code.' },
  ],
  /** Les indices disent où chercher ; les codes restent masqués tant qu'Aïda ne choisit pas de les révéler. */
  indices: [
    { ou: 'Sol de la chambre', indice: 'Un mot à saisir sur l’ordinateur', code: 'CLEAVES', pour: 'ordinateur' },
    { ou: 'Écran de l’ordinateur', indice: '« double success » : doubler le numéro du spécimen réussi', code: null, pour: null },
    { ou: 'Note de la dépendance', indice: 'Le numéro du spécimen réussi, à doubler', code: '0072', pour: 'coffre' },
    { ou: 'Coffre de la maison', indice: 'Le code de la bâtisse au bout du ponton', code: '0212', pour: 'ponton' },
  ],
  /** Ventilation : deux catégories à ne jamais additionner comme argent disponible. */
  gains: [
    { label: 'Espèces du coffre', montant: 1100, nature: 'cash' as const, detail: 'Environ 1 100 GTA$ récupérables en espèces.' },
    { label: 'Sac de billets marqués', montant: 10000, nature: 'nominal' as const, detail: 'Valeur nominale annoncée ; pas immédiatement assimilable à du cash disponible.' },
  ],
  attention: 'Ne pas afficher 11 100 GTA$ comme somme disponible : 1 100 GTA$ d’espèces et 10 000 GTA$ de billets marqués (valeur nominale) sont deux catégories différentes.',
  derniereVerification: '23 novembre 2026',
};
