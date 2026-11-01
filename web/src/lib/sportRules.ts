/** Règles officielles résumées (tennis : règles ITF ; padel : règlement FIP). */
export type RuleSection = { titre: string; points: string[] };

export const TENNIS_RULES: RuleSection[] = [
  { titre: 'Le terrain', points: [
    'Simple : 23,77 m × 8,23 m. Double : 23,77 m × 10,97 m (on ajoute les couloirs).',
    'Le filet mesure 0,914 m au centre.',
    'Les lignes font partie du terrain : une balle qui touche la ligne est bonne.',
  ] },
  { titre: 'Compter les points', points: [
    'Dans un jeu : 0 (« zéro »), 15, 30, 40, puis jeu.',
    'À 40-40, c’est « égalité ». Le point suivant donne « avantage » ; si le même joueur gagne encore, il gagne le jeu. S’il perd, on revient à égalité.',
    'Certains formats jouent sans avantage : à 40-40, un seul point décisif ; le relanceur choisit de quel côté recevoir.',
  ] },
  { titre: 'Sets et match', points: [
    'Un set se gagne à 6 jeux avec au moins 2 jeux d’écart (6-4, 7-5…).',
    'À 6-6, on joue un jeu décisif (tie-break) : le premier à 7 points avec 2 points d’écart gagne le set 7-6.',
    'Un match se joue en général au meilleur des 3 sets (2 sets gagnants) ; en Grand Chelem, les hommes jouent au meilleur des 5.',
    'Le 3e set peut être remplacé par un super tie-break en 10 points (avec 2 points d’écart).',
  ] },
  { titre: 'Le service', points: [
    'On sert derrière la ligne de fond, entre la marque centrale et la ligne de côté, sans toucher la ligne avec les pieds avant la frappe (sinon : faute de pied).',
    'La balle doit tomber dans le carré de service en diagonale.',
    'Deux essais : si les deux sont fautes, c’est une double faute et le point est perdu.',
    'Let : si la balle touche le filet puis tombe dans le bon carré, le service est à rejouer (sans limite).',
    'Le premier point d’un jeu se sert du côté droit, puis on alterne droite-gauche à chaque point.',
    'Le serveur change à chaque jeu.',
  ] },
  { titre: 'Pendant l’échange', points: [
    'La balle ne peut rebondir qu’une fois de ton côté avant que tu la renvoies.',
    'La volée (frapper avant le rebond) est permise, sauf sur le retour de service : le retour doit laisser rebondir la balle.',
    'Tu perds le point si : la balle rebondit deux fois, ta frappe sort ou va dans le filet, la balle te touche, tu touches le filet ou le terrain adverse pendant que la balle est en jeu, ou tu frappes la balle avant qu’elle ait passé le filet.',
    'Une balle qui touche le filet pendant l’échange et passe de l’autre côté reste en jeu.',
  ] },
  { titre: 'Changements de côté', points: [
    'On change de côté après le 1er, le 3e, le 5e jeu… (les jeux impairs) de chaque set.',
    'Pendant un tie-break : changement de côté tous les 6 points.',
    'Dans le tie-break, le premier joueur sert 1 point, puis chacun sert 2 points à tour de rôle.',
  ] },
  { titre: 'En double', points: [
    'Après le service, les couloirs font partie du terrain. Pour le service lui-même, le carré est le même qu’en simple.',
    'Chaque équipe fixe son ordre de service pour le set ; les joueurs servent à tour de rôle, un jeu chacun.',
    'Au retour, chaque joueur garde le même côté (droite ou gauche) pendant tout le set.',
    'N’importe quel joueur de l’équipe peut frapper la balle pendant l’échange (sauf pour le retour de service).',
  ] },
];

export const PADEL_RULES: RuleSection[] = [
  { titre: 'Le terrain', points: [
    'Toujours en double, sur un terrain de 20 m × 10 m entouré de vitres et de grillage.',
    'Le filet mesure 0,88 m au centre et 0,92 m sur les côtés.',
    'Les lignes de service sont à 6,95 m du filet. Les lignes font partie du terrain.',
  ] },
  { titre: 'Compter les points', points: [
    'Comme au tennis : 15, 30, 40, jeu ; à 40-40, égalité puis avantage.',
    'Beaucoup de tournois jouent le « point en or » : à 40-40, un seul point décisif, et l’équipe qui reçoit choisit le joueur qui relance.',
    'Un set se gagne à 6 jeux avec 2 jeux d’écart ; à 6-6, jeu décisif en 7 points (2 points d’écart).',
    'Un match se joue au meilleur des 3 sets ; le 3e set peut être remplacé par un super tie-break en 10 points.',
  ] },
  { titre: 'Le service', points: [
    'Le service se fait à la cuillère : on laisse rebondir la balle au sol derrière la ligne de service, puis on la frappe à hauteur de la taille ou en dessous.',
    'Au moment de la frappe, les pieds restent derrière la ligne de service et au moins un pied touche le sol.',
    'La balle doit tomber dans le carré de service en diagonale.',
    'Après le rebond dans le carré, la balle peut toucher la vitre : le service est bon. Si elle touche le grillage, c’est une faute.',
    'Si la balle touche le filet et tombe dans le bon carré, le service est à rejouer, sauf si elle touche ensuite le grillage : c’est alors une faute.',
    'Deux essais par point, comme au tennis. On commence à droite, puis on alterne.',
  ] },
  { titre: 'Pendant l’échange', points: [
    'La balle doit d’abord rebondir au sol dans le camp adverse avant de toucher une vitre ou le grillage. Si elle touche directement la vitre ou le grillage adverse, le point est perdu.',
    'Après le rebond au sol, la balle peut toucher les vitres (et le grillage) de ton côté : tu peux encore la jouer, tant qu’elle n’a pas rebondi deux fois au sol.',
    'Tu peux renvoyer la balle en la faisant frapper contre tes propres vitres pour qu’elle passe le filet.',
    'La volée est permise, sauf sur le retour de service : le relanceur doit laisser rebondir la balle.',
    'Tu perds le point si la balle te touche, si tu touches le filet, ou si la balle rebondit deux fois de ton côté.',
    'Si la balle sort du terrain par-dessus les vitres après un rebond correct, le point est gagné par celui qui l’a frappée (sauf si le terrain permet de sortir la jouer et que l’adversaire la renvoie).',
  ] },
  { titre: 'Changements de côté et équipement', points: [
    'On change de côté après les jeux impairs de chaque set, comme au tennis.',
    'La raquette est pleine (sans cordage), percée de trous ; la dragonne est obligatoire au poignet.',
    'La balle ressemble à une balle de tennis, un peu moins gonflée.',
  ] },
];

export type VideoSearch = { q: string; title: string };
/** Recherches YouTube (les résultats s'ouvrent sur YouTube). */
export const PADEL_VIDEO_SEARCHES: VideoSearch[] = [
  { q: 'padel débutant règles explication', title: 'Les règles du padel expliquées' },
  { q: 'padel service technique débutant', title: 'Le service au padel' },
  { q: 'padel jeu avec les vitres tutoriel', title: 'Jouer avec les vitres' },
  { q: 'padel bandeja tutoriel', title: 'La bandeja' },
  { q: 'padel volée tutoriel', title: 'La volée au padel' },
  { q: 'padel placement double tutoriel', title: 'Se placer en double' },
];
