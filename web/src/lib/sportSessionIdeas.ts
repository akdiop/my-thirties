export type SportSessionIdea = {
  id: string; discipline: 'pilates' | 'yoga' | 'tennis';
  title: string; minutes: number; focus: string; steps: string[]; caution: string;
};
/** Idées originales de séances modulables, sans objectif de transformation corporelle. */
export const SPORT_SESSION_IDEAS: SportSessionIdea[] = [
  {
    "id": "pilates-doux",
    "discipline": "pilates",
    "title": "Pilates doux et respiration",
    "minutes": 15,
    "focus": "Mobilité et contrôle",
    "steps": [
      "Commencer par quelques respirations naturelles, sans bloquer le souffle.",
      "Mobiliser doucement les épaules et le bassin.",
      "Faire quelques ponts de bassin lents, selon le confort.",
      "Terminer par une courte pause au sol ou assise."
    ],
    "caution": "Arrêter si une position est douloureuse et privilégier une variante confortable."
  },
  {
    "id": "pilates-stabilite",
    "discipline": "pilates",
    "title": "Pilates : stabilité et posture",
    "minutes": 20,
    "focus": "Stabilité et alignement",
    "steps": [
      "Commencer par une mobilisation douce de la colonne dans une amplitude confortable.",
      "Faire quelques mouvements alternés bras/jambes en gardant un appui stable.",
      "Essayer le pont de bassin ou sa variante plus simple.",
      "Terminer par un retour au calme et observer le ressenti."
    ],
    "caution": "Les mouvements peuvent être faits avec un encadrement si nécessaire."
  },
  {
    "id": "pilates-mobilite",
    "discipline": "pilates",
    "title": "Pilates : mobilité au quotidien",
    "minutes": 10,
    "focus": "Mobilité",
    "steps": [
      "Respirer confortablement en position assise.",
      "Mobiliser lentement les chevilles et les épaules.",
      "Faire des rotations douces du haut du dos sans forcer.",
      "Terminer par une minute de repos."
    ],
    "caution": "Ne pas chercher une amplitude maximale."
  },
  {
    "id": "yoga-matin",
    "discipline": "yoga",
    "title": "Yoga doux du matin",
    "minutes": 15,
    "focus": "Souffle et mobilité",
    "steps": [
      "Commencer assise ou debout par une respiration naturelle.",
      "Enchaîner quelques mouvements d’épaules et de bras.",
      "Explorer une posture debout stable, avec appui si nécessaire.",
      "Terminer par une courte pause confortable."
    ],
    "caution": "Adapter les postures et éviter toute douleur."
  },
  {
    "id": "yoga-soir",
    "discipline": "yoga",
    "title": "Yoga calme du soir",
    "minutes": 10,
    "focus": "Détente",
    "steps": [
      "S’installer dans une position confortable.",
      "Prendre quelques respirations lentes et naturelles.",
      "Faire une mobilité douce des poignets et de la nuque.",
      "Terminer par une pause calme."
    ],
    "caution": "Les positions au sol ne sont pas obligatoires."
  },
  {
    "id": "yoga-chaise",
    "discipline": "yoga",
    "title": "Yoga sur chaise",
    "minutes": 12,
    "focus": "Mobilité douce",
    "steps": [
      "S’asseoir sur une chaise stable, pieds au sol.",
      "Faire des mouvements d’épaules lents.",
      "Tourner doucement le buste à droite puis à gauche dans une amplitude confortable.",
      "Étendre et relâcher les jambes à tour de rôle."
    ],
    "caution": "Éviter les mouvements forcés."
  },
  {
    "id": "tennis-service",
    "discipline": "tennis",
    "title": "Tennis : précision du service",
    "minutes": 20,
    "focus": "Technique et coordination",
    "steps": [
      "S’échauffer doucement avec des mouvements d’épaules.",
      "S’exercer au lancer de balle sans frapper.",
      "Faire quelques services à rythme confortable en visant une zone.",
      "Noter ce qui a facilité la régularité."
    ],
    "caution": "Privilégier la technique plutôt que la puissance."
  },
  {
    "id": "tennis-regularite",
    "discipline": "tennis",
    "title": "Tennis : échanges réguliers",
    "minutes": 25,
    "focus": "Coordination",
    "steps": [
      "Commencer par des échanges tranquilles à courte distance.",
      "Choisir une zone large comme cible.",
      "Faire plusieurs échanges en privilégiant l’équilibre.",
      "Terminer par une observation technique à noter."
    ],
    "caution": "Faire des pauses selon les besoins."
  },
  {
    "id": "tennis-appuis",
    "discipline": "tennis",
    "title": "Tennis : appuis et placement",
    "minutes": 15,
    "focus": "Jeu de jambes",
    "steps": [
      "S’échauffer en marchant quelques minutes.",
      "Pratiquer de petits déplacements latéraux sans vitesse imposée.",
      "Revenir en position stable entre deux mouvements.",
      "Finir par des frappes faciles ou des gestes sans balle."
    ],
    "caution": "Utiliser une surface stable et éviter les mouvements douloureux."
  }
];
