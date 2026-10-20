export type Discipline = 'tennis' | 'pilates' | 'yoga';

export type SportFiche = {
  id: string;
  discipline: Discipline;
  section: string;
  title: string;
  summary: string;
  steps: string[];
  errors?: string[];
  drills?: string[];
  tips?: string[];
  cautions?: string;
  alternative?: string;
  minutes?: number;
};

export const SPORT_NOTICE = 'Fiches pédagogiques à relire. Les vidéos de démonstration seront choisies avec vous. En cas de douleur, arrêtez et demandez un avis médical.';

export const DISCIPLINE_LABEL: Record<Discipline, string> = { tennis: 'Tennis', pilates: 'Pilates', yoga: 'Yoga' };

export const FICHES: SportFiche[] = [
  {
    id: 'tennis-points',
    discipline: 'tennis',
    section: 'Règles',
    title: 'Compter les points',
    summary: 'Un jeu se gagne en 4 points, avec 2 points d’écart.',
    steps: ['Les points se comptent 0, 15, 30, 40, puis jeu.', 'À 40-40 (égalité), il faut deux points d’affilée : avantage, puis jeu.', 'Un set se gagne à 6 jeux avec 2 jeux d’écart (6-4, 7-5).', 'À 6-6, un tie-break se joue en 7 points avec 2 points d’écart.', 'Un match se joue le plus souvent en 2 sets gagnants.'],
    tips: ['Annoncez le score de la serveuse en premier.'],
  },
  {
    id: 'tennis-service-regles',
    discipline: 'tennis',
    section: 'Règles',
    title: 'Service et fautes',
    summary: 'Deux balles pour servir en diagonale dans le carré de service.',
    steps: ['On sert derrière la ligne de fond, en diagonale.', 'Premier point du jeu à droite, puis on alterne.', 'Balle hors du carré : faute. Deux fautes : double faute, le point est perdu.', 'Balle qui touche le filet puis tombe dans le carré : let, on rejoue la balle.', 'On change de côté après chaque jeu impair (1, 3, 5…).'],
  },
  {
    id: 'tennis-simple-double',
    discipline: 'tennis',
    section: 'Règles',
    title: 'Simple et double',
    summary: 'Le double utilise les couloirs latéraux, sauf au service.',
    steps: ['En simple, le terrain s’arrête aux lignes intérieures.', 'En double, les couloirs comptent pendant l’échange.', 'Au service, le carré est le même en simple et en double.', 'En double, l’ordre de service tourne entre les quatre joueuses.'],
    tips: ['En double, la joueuse au filet couvre son couloir et le centre.'],
  },
  {
    id: 'tennis-coup-droit',
    discipline: 'tennis',
    section: 'Techniques',
    title: 'Coup droit',
    summary: 'Le coup de base : préparation tôt, frappe devant soi, accompagnement.',
    steps: ['Prise semi-western ou eastern.', 'Épaules qui tournent dès que la balle part de l’autre côté.', 'Frappe devant le corps, à hauteur de hanche.', 'Transfert du poids de la jambe arrière vers l’avant.', 'Accompagnement jusqu’à l’épaule opposée.'],
    errors: ['Préparer trop tard.', 'Frapper la balle à côté du corps.', 'Bloquer le geste après l’impact.'],
    drills: ['Lancers à la main par une partenaire, 3 séries de 15.', 'Échanges en diagonale, 10 balles sans faute.'],
    tips: ['Regardez la balle jusqu’à la raquette.'],
  },
  {
    id: 'tennis-revers',
    discipline: 'tennis',
    section: 'Techniques',
    title: 'Revers',
    summary: 'À une ou deux mains : la rotation des épaules fait la puissance.',
    steps: ['Changez de prise dès que la balle arrive côté revers.', 'Épaule avant tournée vers le filet.', 'Frappe devant le corps, bras tendu (une main) ou guidé (deux mains).', 'Finissez haut, raquette au-dessus de l’épaule.'],
    errors: ['Frapper avec le bras seul, sans tourner.', 'Se placer trop près de la balle.'],
    drills: ['Ombre (sans balle) 20 gestes lents.', 'Lancers à la main côté revers, 3 × 12.'],
  },
  {
    id: 'tennis-service',
    discipline: 'tennis',
    section: 'Techniques',
    title: 'Service',
    summary: 'Un lancer régulier est la clé d’un service fiable.',
    steps: ['Prise continentale.', 'Lancer de balle devant, légèrement à droite (droitière).', 'Raquette dans le dos en position de « boucle ».', 'Frappe au point le plus haut, bras tendu.', 'Le poids passe vers l’avant, retombée dans le terrain.'],
    errors: ['Lancer irrégulier.', 'Frapper bras plié.'],
    drills: ['Lancer seul 20 fois, la balle doit retomber au même endroit.', 'Service sans vitesse, 3 séries de 10 dans chaque carré.'],
  },
  {
    id: 'tennis-volee',
    discipline: 'tennis',
    section: 'Techniques',
    title: 'Volée',
    summary: 'Un geste court, raquette devant, sans grand armé.',
    steps: ['Prise continentale.', 'Raquette haute, devant le corps.', 'Petit pas vers la balle.', 'Bloquez la balle, sans élan.'],
    errors: ['Faire un grand geste comme un coup droit.', 'Rester sur place.'],
    drills: ['Volées à la main avec une partenaire, 3 × 15.'],
  },
  {
    id: 'tennis-smash',
    discipline: 'tennis',
    section: 'Techniques',
    title: 'Smash',
    summary: 'Un service sans lancer, sur une balle haute.',
    steps: ['Pivotez de profil.', 'Main libre pointée vers la balle.', 'Reculez en pas chassés.', 'Frappez au point haut, devant.'],
    errors: ['Reculer en marche arrière (risque de chute).'],
    drills: ['Balles hautes lancées doucement, 3 × 8.'],
    cautions: 'Ne reculez jamais en marchant à reculons.',
  },
  {
    id: 'tennis-deplacements',
    discipline: 'tennis',
    section: 'Techniques',
    title: 'Déplacements et placement',
    summary: 'Un petit saut d’appel avant chaque frappe adverse, puis replacement au centre.',
    steps: ['Saut d’appel au moment où l’adversaire frappe.', 'Pas chassés pour les petits déplacements.', 'Course croisée pour les balles éloignées.', 'Replacement au centre de la ligne de fond après chaque coup.'],
    drills: ['Échelle de rythme 5 minutes.', 'Navettes ligne à ligne, 6 × 20 s.'],
    tips: ['Jouez en diagonale pour vous laisser le temps de revenir.'],
  },

  {
    id: 'pilates-fondamentaux',
    discipline: 'pilates',
    section: 'Fondamentaux',
    title: 'Respiration et centre',
    summary: 'Inspirer par le nez dans les côtes, expirer en engageant le centre.',
    steps: ['Mains sur les côtes : inspirez, les côtes s’écartent sur les côtés.', 'Expirez par la bouche, nombril vers la colonne.', 'Bassin neutre : ni creusé, ni rentré.', 'Épaules basses, nuque longue.'],
    tips: ['Contrôle et précision avant le nombre de répétitions.'],
    minutes: 5,
  },
  {
    id: 'pilates-hundred',
    discipline: 'pilates',
    section: 'Au sol',
    title: 'The Hundred',
    summary: 'Échauffement respiratoire : 10 cycles de 10 battements de bras.',
    steps: ['Allongée, jambes en table (genoux au-dessus des hanches).', 'Enroulez la tête et les épaules.', 'Bras tendus le long du corps, battements courts.', 'Inspirez sur 5 battements, expirez sur 5.'],
    errors: ['Tirer sur la nuque.', 'Creuser le bas du dos.'],
    cautions: 'Nuque fragile : gardez la tête au sol.',
    alternative: 'Pieds au sol, tête posée.',
    minutes: 2,
  },
  {
    id: 'pilates-rollup',
    discipline: 'pilates',
    section: 'Au sol',
    title: 'Roll-up',
    summary: 'S’enrouler vertèbre par vertèbre.',
    steps: ['Allongée, bras au-dessus de la tête.', 'Inspirez, bras vers le plafond.', 'Expirez, enroulez-vous jusqu’à être assise penchée.', 'Déroulez lentement vers le sol.'],
    alternative: 'Genoux pliés, ou demi roll-back assise.',
    cautions: 'Évitez en cas de hernie discale sans avis médical.',
    minutes: 2,
  },
  {
    id: 'pilates-single-leg',
    discipline: 'pilates',
    section: 'Au sol',
    title: 'Single leg stretch',
    summary: 'Alternance des jambes, centre stable.',
    steps: ['Tête et épaules enroulées.', 'Un genou vers la poitrine, l’autre jambe tendue en diagonale.', 'Changez de jambe en expirant.', '8 à 10 par côté.'],
    alternative: 'Jambe tendue plus haute, tête au sol.',
    minutes: 2,
  },
  {
    id: 'pilates-bridge',
    discipline: 'pilates',
    section: 'Au sol',
    title: 'Pont articulé',
    summary: 'Mobilité de la colonne et fessiers.',
    steps: ['Allongée, pieds au sol largeur de hanches.', 'Expirez, enroulez le bassin et montez vertèbre par vertèbre.', 'Inspirez en haut.', 'Expirez en déroulant.'],
    minutes: 2,
  },
  {
    id: 'pilates-swimming',
    discipline: 'pilates',
    section: 'Au sol',
    title: 'Swimming',
    summary: 'Renforcement du dos.',
    steps: ['Allongée sur le ventre, bras devant.', 'Décollez légèrement bras et jambes.', 'Battements alternés bras et jambes opposés.', 'Respirez sur 5 battements.'],
    alternative: 'Un bras et la jambe opposée seulement.',
    minutes: 1,
  },
  {
    id: 'pilates-side-kick',
    discipline: 'pilates',
    section: 'Au sol',
    title: 'Side kick',
    summary: 'Stabilité latérale et hanches.',
    steps: ['Sur le côté, corps aligné.', 'Jambe du dessus à hauteur de hanche.', 'Balancez vers l’avant en deux temps, puis vers l’arrière.', '10 par côté.'],
    minutes: 3,
  },
  {
    id: 'pilates-reformer',
    discipline: 'pilates',
    section: 'Reformer',
    title: 'Découvrir le Reformer',
    summary: 'Le Reformer ajoute la résistance de ressorts. Les premières séances se font avec une ou un professeur.',
    steps: ['Footwork : poussées des pieds sur la barre, ressorts moyens.', 'Bridging : pont sur le chariot.', 'Leg circles : cercles de jambes dans les sangles.', 'Rowing : tirages assise, ressort léger.'],
    cautions: 'Réglez toujours les ressorts avec la professeure. Ne descendez jamais du chariot en mouvement.',
    minutes: 45,
  },

  {
    id: 'yoga-montagne',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Montagne (Tadasana)',
    summary: 'Posture d’ancrage debout.',
    steps: ['Pieds parallèles, poids réparti.', 'Genoux souples, bassin neutre.', 'Épaules basses, sommet du crâne vers le haut.', '5 respirations.'],
    minutes: 1,
  },
  {
    id: 'yoga-chat-vache',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Chat-vache',
    summary: 'Mobilité douce de la colonne.',
    steps: ['À quatre pattes, mains sous les épaules.', 'Inspirez, creusez le dos, regard devant.', 'Expirez, arrondissez le dos.', '8 cycles.'],
    minutes: 2,
  },
  {
    id: 'yoga-chien',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Chien tête en bas',
    summary: 'Étirement de tout l’arrière du corps.',
    steps: ['Depuis quatre pattes, poussez les hanches vers le haut.', 'Genoux fléchis si besoin, dos long.', 'Talons vers le sol sans forcer.', '5 respirations.'],
    cautions: 'Poignets ou tension élevée : préférez la posture de l’enfant.',
    alternative: 'Mains sur une chaise.',
    minutes: 1,
  },
  {
    id: 'yoga-guerrier2',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Guerrier II',
    summary: 'Force des jambes et ouverture.',
    steps: ['Grand écart des pieds, pied avant tourné vers l’avant.', 'Genou avant au-dessus de la cheville.', 'Bras à l’horizontale, regard sur la main avant.', '5 respirations par côté.'],
    errors: ['Genou qui dépasse la cheville.'],
    minutes: 2,
  },
  {
    id: 'yoga-arbre',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Arbre',
    summary: 'Équilibre et concentration.',
    steps: ['Pied sur la cheville, le mollet ou la cuisse, jamais sur le genou.', 'Mains jointes devant la poitrine.', 'Regard fixe sur un point.', '5 respirations par côté.'],
    alternative: 'Une main sur un mur.',
    minutes: 2,
  },
  {
    id: 'yoga-cobra',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Cobra doux',
    summary: 'Extension douce du dos.',
    steps: ['Sur le ventre, mains sous les épaules.', 'Inspirez, décollez la poitrine sans pousser fort sur les bras.', 'Épaules loin des oreilles.', '3 à 5 respirations.'],
    cautions: 'Douleur lombaire : restez en sphinx sur les avant-bras.',
    minutes: 1,
  },
  {
    id: 'yoga-enfant',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Posture de l’enfant',
    summary: 'Repos et détente du dos.',
    steps: ['Genoux écartés, fesses vers les talons.', 'Front au sol ou sur un coussin.', 'Bras devant ou le long du corps.', '1 à 3 minutes.'],
    minutes: 2,
  },
  {
    id: 'yoga-pont',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Pont',
    summary: 'Ouverture du bassin et renforcement.',
    steps: ['Allongée, pieds au sol.', 'Montez le bassin en inspirant.', 'Mains jointes sous le dos si confortable.', '5 respirations.'],
    minutes: 1,
  },
  {
    id: 'yoga-relaxation',
    discipline: 'yoga',
    section: 'Postures',
    title: 'Relaxation (Savasana)',
    summary: 'Intégration en fin de séance.',
    steps: ['Allongée, jambes et bras relâchés.', 'Yeux fermés.', 'Laissez la respiration se faire seule.', '3 à 5 minutes.'],
    minutes: 4,
  },
  {
    id: 'yoga-styles',
    discipline: 'yoga',
    section: 'Styles',
    title: 'Hatha, Yin, Vinyasa, doux, restauratif',
    summary: 'Cinq approches pour cinq besoins.',
    steps: ['Hatha : postures tenues, rythme posé, idéal pour apprendre.', 'Vinyasa : postures enchaînées sur le souffle, plus dynamique.', 'Yin : postures au sol tenues 3 à 5 minutes, étirements profonds.', 'Yoga doux : mouvements simples, accessible les jours de fatigue.', 'Restauratif : postures soutenues par des coussins, pour récupérer.'],
  },
];

export const YOGA_SESSIONS: { minutes: 10 | 20 | 30 | 45; title: string; ficheIds: string[] }[] = [
  { minutes: 10, title: 'Réveil doux', ficheIds: ['yoga-montagne', 'yoga-chat-vache', 'yoga-chien', 'yoga-enfant', 'yoga-relaxation'] },
  { minutes: 20, title: 'Ancrage', ficheIds: ['yoga-montagne', 'yoga-chat-vache', 'yoga-chien', 'yoga-guerrier2', 'yoga-arbre', 'yoga-enfant', 'yoga-relaxation'] },
  { minutes: 30, title: 'Force et souplesse', ficheIds: ['yoga-montagne', 'yoga-chat-vache', 'yoga-chien', 'yoga-guerrier2', 'yoga-arbre', 'yoga-cobra', 'yoga-pont', 'yoga-enfant', 'yoga-relaxation'] },
  { minutes: 45, title: 'Séance complète', ficheIds: ['yoga-montagne', 'yoga-chat-vache', 'yoga-chien', 'yoga-guerrier2', 'yoga-arbre', 'yoga-cobra', 'yoga-pont', 'yoga-enfant', 'yoga-relaxation'] },
];

export const ficheById = (id: string) => FICHES.find((f) => f.id === id);

export function fichesBySection(discipline: Discipline) {
  const map = new Map<string, SportFiche[]>();
  for (const f of FICHES.filter((x) => x.discipline === discipline)) map.set(f.section, [...(map.get(f.section) ?? []), f]);
  return [...map.entries()];
}
