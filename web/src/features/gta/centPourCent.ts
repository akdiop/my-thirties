/**
 * Liste des 100 % de GTA VI, reformulée en français d'après le guide PowerPyx
 * « GTA 6 100% Completion Checklist Guide » (consulté le 23/11/2026).
 * La liste apparaît dans le jeu après l'histoire (Progression > Statistiques > 100 %) ; rien n'est manquable.
 */
export const CENT_SOURCE = { url: 'https://www.powerpyx.com/gta-6-100-completion-checklist-guide/', consulte: '2026-11-23' };

export type CentCategory = 'histoire' | 'exploration' | 'decouverte';
export const CENT_CATEGORIES: { id: CentCategory; label: string }[] = [
  { id: 'histoire', label: 'Histoire et tâches' },
  { id: 'exploration', label: 'Exploration et activités' },
  { id: 'decouverte', label: 'Découverte' },
];

/** `need` : ce que demande le 100 % ; `total` : ce qui existe dans le jeu ; `money` : montant en dollars du jeu à saisir. */
export type CentItem = { id: string; category: CentCategory; label: string; need: number; total?: number; money?: boolean; tip: string; link?: 'missions' };

export const CENT_ITEMS: CentItem[] = [
  { id: 'story', category: 'histoire', label: 'Terminer l’histoire', need: 1, link: 'missions', tip: 'Il suffit de finir toutes les missions principales. Se coche tout seul quand les 5 chapitres sont bouclés.' },
  { id: 'optional', category: 'histoire', label: 'Tâches facultatives', need: 100, link: 'missions', tip: 'Icônes à fond noir et lettres roses, plus les icônes violettes. Il en existe bien plus de 100 : on les atteint naturellement en jouant.' },
  { id: 'gangs', category: 'histoire', label: 'Opérations de gang nettoyées', need: 39, total: 39, tip: 'Icônes jaunes. Il faut récupérer tous les objets de valeur clés de chaque lieu (le nombre s’affiche en survolant l’icône).' },
  { id: 'banks', category: 'histoire', label: 'Braquages de banques complets', need: 22, total: 22, tip: 'Débloqués après « Credit Check » (chapitre 3) avec le brouilleur d’encre. Filtre de la carte : icône de banque verte.' },
  { id: 'payday', category: 'histoire', label: 'Agences de prêt sur salaire', need: 7, total: 7, tip: 'Même déblocage que les banques (« Credit Check »). Icône de main verte sur la carte.' },
  { id: 'smash', category: 'histoire', label: 'Smash ’N’ Grab (prêteurs sur gage, bijouteries)', need: 34, total: 35, tip: 'Braquer chaque boutique au moins une fois, sans oublier le coffre de l’arrière-boutique : la vitrine seule peut ne pas compter.' },
  { id: 'stickups', category: 'histoire', label: 'Braquages de commerces', need: 50, total: 91, tip: 'N’importe quels 50 sur 91.' },
  { id: 'narcotics', category: 'histoire', label: 'Stupéfiants revendus', need: 100000, money: true, tip: 'Butin des opérations de gang et des flamants à cocaïne, à vendre à un receleur. Vient naturellement.' },
  { id: 'jewelry', category: 'histoire', label: 'Bijoux revendus', need: 100000, money: true, tip: 'Butin des bijouteries (après « Yasmani’s Jewelry Jobs », chapitre 3), à vendre à un receleur.' },
  { id: 'bills', category: 'histoire', label: 'Billets marqués revendus', need: 250000, money: true, tip: 'Butin des banques et agences de prêt. Une grande banque peut rapporter jusqu’à 205 000 en une fois.' },
  { id: 'vaults', category: 'histoire', label: 'Chambres fortes', need: 8, total: 8, tip: 'Une par grande banque, en fin de jeu, après la mission facultative « That’s Where The Money Is… » (chapitre 4).' },
  { id: 'vehicles', category: 'histoire', label: 'Véhicules revendus', need: 200000, money: true, tip: 'Après « Moses » (chapitre 2) : voitures sans traceur au garage de Port Gellhorn, puis avec traceur standard dans un Pay ’n’ Spray (chapitre 3).' },

  { id: 'kenton', category: 'exploration', label: 'Séries de Kenton', need: 5, total: 7, tip: 'Quête de Kenton (« KR » vert à Key Lento) après « Island Dreams ». Il disparaît après le chapitre 1 puis revient entre les chapitres 2 et 3.' },
  { id: 'cards', category: 'exploration', label: 'Séries de cartes à collectionner', need: 15, total: 18, tip: '480 cartes réparties en 18 séries ; il faut compléter 15 séries. Suivi : Progression > Collections > Cartes.' },
  { id: 'waink', category: 'exploration', label: 'Lieux scannés avec WAiNK', need: 100, tip: 'À pied, une alerte signale un lieu scannable à proximité (monuments, sculptures…).' },
  { id: 'underwater', category: 'exploration', label: 'Découvertes sous-marines', need: 33, total: 33, tip: 'Épaves englouties, liées à la quête de Kenton.' },
  { id: 'magazines', category: 'exploration', label: 'Magazines, livres et BD', need: 30, total: 34, tip: 'Seuls les exemplaires uniques comptent. Les 7 échanges de livres comptent aussi.' },
  { id: 'meditation', category: 'exploration', label: 'Lieux de méditation', need: 15, total: 18, tip: '10 lieux ; méditer avec Lucia et avec Jason compte double. Appeler son partenaire et y aller ensemble.' },
  { id: 'flamingos', category: 'exploration', label: 'Flamants à cocaïne détruits', need: 100, total: 125, tip: 'Les reconnaître à leur bec noir et blanc (les décoratifs ont un bec jaune et noir). Tirer dessus libère un paquet.' },
  { id: 'playlists', category: 'exploration', label: 'Playlists uniques', need: 2, total: 2, tip: 'En scannant certaines affiches.' },
  { id: 'styles', category: 'exploration', label: 'Styles découverts', need: 70, total: 79, tip: 'Tatouages des magazines (scannés avec WAiNK) et 34 montres de luxe, souvent dans les opérations de gang.' },
  { id: 'races', category: 'exploration', label: 'Courses uniques gagnées', need: 30, total: 40, tip: 'Icônes bleues à moins de 100 m. Filtre : Carte > Activités > Courses.' },
  { id: 'raceGold', category: 'exploration', label: 'Médailles d’or aux défis de course', need: 10, total: 13, tip: 'Choisir les 10 plus faciles.' },
  { id: 'shooting', category: 'exploration', label: 'Médailles d’or au stand de tir', need: 42, total: 42, tip: 'Deux stands : Griffin et Rodgers Ranch. Parler au vendeur de la boutique pour accéder aux défis.' },
  { id: 'videogames', category: 'exploration', label: 'Jeux vidéo joués', need: 4, total: 4, tip: 'Trois sur la console du salon (inaccessible au chapitre 2, de retour au chapitre 3) ; le quatrième ailleurs.' },
  { id: 'pool', category: 'exploration', label: 'Adversaires de billard battus', need: 5, total: 7, tip: 'Dans des bars, tavernes et cafés.' },
  { id: 'minigolf', category: 'exploration', label: 'Parcours de minigolf joués', need: 2, total: 3, tip: 'King Gator, Frontier ou Dino Golf. Les deux grands golfs ne comptent pas.' },
  { id: 'hoops', category: 'exploration', label: 'Paniers de basket', need: 90, total: 100, tip: 'Un panier réussi par lieu différent. Filtre : Carte > Exploration > Points d’intérêt.' },
  { id: 'drones', category: 'exploration', label: 'Courses de drone', need: 42, total: 42, tip: '14 lieux, 3 courses chacun. Battre le temps des deux premières ; la troisième se valide en la finissant.' },
  { id: 'stunts', category: 'exploration', label: 'Cascades', need: 300, total: 397, tip: 'Au choix parmi 130 sauts, 202 passages sous les ponts, 40 vols en lame de couteau et 25 sauts en parachute.' },
  { id: 'challenges', category: 'exploration', label: 'Défis', need: 70, total: 80, tip: '8 catégories de 10, tous disponibles dès le début. Suivi : Progression > Défis.' },
  { id: 'bret', category: 'exploration', label: 'Cibles de Bret', need: 15, total: 15, tip: 'Quête de Bret Vogel, réservée à Jason, après « Coffee Break » (chapitre 2), dans le comté de Lummox.' },

  { id: 'scanVehicles', category: 'decouverte', label: 'Véhicules scannés', need: 200, total: 277, tip: 'Scanner avec WAiNK au bord des routes passantes : chaque région a ses modèles (voitures de luxe à Ocean Beach, utilitaires à Port Gellhorn).' },
  { id: 'weapons', category: 'decouverte', label: 'Armes trouvées', need: 50, total: 66, tip: 'Le plus simple : les acheter chez Ammu-Nation (les boutiques « Expanded » ont tout le catalogue).' },
  { id: 'animals', category: 'decouverte', label: 'Animaux étudiés', need: 100, total: 255, tip: 'Aux jumelles, sans chasser. 100 sur 255 suffisent.' },
];

/** Avancement d'un élément : `story` se déduit des missions, le reste vient des compteurs d'Aïda. */
export const centValue = (item: CentItem, counts: Record<string, number>, storyDone: boolean) => (item.id === 'story' ? (storyDone ? 1 : 0) : counts[item.id] ?? 0);
export const centDone = (item: CentItem, counts: Record<string, number>, storyDone: boolean) => centValue(item, counts, storyDone) >= item.need;
