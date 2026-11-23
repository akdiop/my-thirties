/**
 * Astuces tirées des infographies partagées par Aïda le 23/11/2026 (comptes GTA6News, GTASLATEST, GTA6TRACKER, GTA6HERE).
 * Traduites et reformulées ; ce sont des sources communautaires non vérifiées. Quand une ligne était illisible, elle est signalée.
 */
export const ASTUCES_SOURCE = 'Infographies communautaires partagées par Aïda (GTA6News, GTASLATEST, GTA6TRACKER), non vérifiées';

export type Astuce = { id: string; titre: string; texte: string };
export const CONSEILS: Astuce[] = [
  { id: 'c01', titre: 'Repérer les bâtiments ouverts', texte: 'Sur la minicarte, les bâtiments bleu foncé avec un petit trait blanc se visitent.' },
  { id: 'c02', titre: 'Vérifier les portes en mode Focus', texte: 'Blanc : on peut entrer. Rouge : la porte est sous alarme.' },
  { id: 'c03', titre: 'Poser un point de passage', texte: 'Maintenir la croix directionnelle bas pour voir les lieux proches, puis le stick droit pour poser le point.' },
  { id: 'c04', titre: 'Utiliser les applis du téléphone', texte: 'Snapmatic et l’appli News ajoutent de nouveaux points d’intérêt sur la carte.' },
  { id: 'c05', titre: 'Faire une sauvegarde manuelle', texte: 'Pause > Jeu > Sauvegarder, et garder un autre emplacement en secours.' },
  { id: 'c06', titre: 'Reprendre au point de contrôle', texte: 'Si une mission tourne mal, choisir « Reprendre au point de contrôle ».' },
  { id: 'c07', titre: 'Cacher son argent tôt', texte: 'Les lattes de plancher mal fixées dans la chambre de Jason servent de cachette avant de partir.' },
  { id: 'c08', titre: 'Mettre son argent à la banque', texte: 'Une fois BuckMe débloqué, déposer l’argent à un distributeur : il est protégé si tu es tuée ou arrêtée.' },
  { id: 'c09', titre: 'Garder une tenue de rechange', texte: 'Enregistrer une tenue en cabine d’essayage, puis se changer depuis le coffre de sa voiture personnelle.' },
  { id: 'c10', titre: 'Ranger ses armes longues', texte: 'Ouvrir le coffre et choisir « Ranger » ; on les reprend plus tard au coffre.' },
  { id: 'c11', titre: 'Réparer son véhicule', texte: 'À la pompe, ouvrir Services > Réparer et vérifier le devis avant de payer.' },
  { id: 'c12', titre: 'Surveiller l’essence', texte: 'Faire le plein à une station : tomber en panne laisse en rade.' },
  { id: 'c13', titre: 'Manger et boire', texte: 'Un en-cas ou une boisson donne un bonus temporaire de santé, d’endurance ou de Focus.' },
  { id: 'c14', titre: 'Faire des réserves de Zombix', texte: 'Le vendeur d’une supérette en propose : en garder sur soi pour se soigner.' },
  { id: 'c15', titre: 'Travailler ses statistiques', texte: 'La musculation augmente la force et la santé maximale ; la course développe le cardio et l’endurance.' },
  { id: 'c16', titre: 'Caresser un chien ou un chat', texte: 'Face à l’animal, maintenir L2 (PS5) ou LT (Xbox) et choisir l’interaction.' },
  { id: 'c17', titre: 'Écourter un trajet en taxi', texte: 'À l’arrière, maintenir L2 / LT pour viser le chauffeur et appuyer sur Triangle / Y pour sauter le trajet (100 $).' },
  { id: 'c18', titre: 'Dormir pour passer le temps', texte: 'Au lit, choisir l’heure ; viser le matin pour les boutiques fermées la nuit.' },
  { id: 'c19', titre: 'Scanner les véhicules', texte: 'Ouvrir WAINK (croix haut), viser et maintenir R1 / RB : bateaux et avions comptent aussi.' },
  { id: 'c20', titre: 'Étudier la faune', texte: 'Prendre les jumelles, zoomer (croix haut) et maintenir R1 / RB pour enregistrer l’animal ; voir Progression > Animaux.' },
];

export const REGLAGES: (Astuce & { valeur: string })[] = [
  { id: 'r01', titre: 'Tremblement de caméra', valeur: 'Désactivé', texte: 'Moins de mouvements à l’écran.' },
  { id: 'r02', titre: 'Flou de mouvement', valeur: '0 ou 3', texte: '0 pour une image nette, 3 pour un léger flou.' },
  { id: 'r03', titre: 'Mode jeu de la télé', valeur: 'Activé', texte: 'Sur le téléviseur, pour réduire la latence.' },
  { id: 'r04', titre: 'Noms des rues', valeur: 'Activé', texte: 'Garder les noms visibles pendant l’exploration.' },
  { id: 'r05', titre: 'Schéma de commandes', valeur: 'Classique', texte: 'La disposition habituelle des GTA.' },
  { id: 'r06', titre: 'Sensibilité de visée', valeur: '9 à 10', texte: 'Un bon point de départ ; baisser si tu dépasses la cible.' },
  { id: 'r07', titre: 'Accélération de visée', valeur: 'Au plus haut', texte: 'La baisser si le suivi semble saccadé.' },
  { id: 'r08', titre: 'Trajectoire des grenades', valeur: 'Toujours', texte: 'Affiche l’arc du lancer.' },
  { id: 'r09', titre: 'Distance', valeur: 'Métrique', texte: 'Mètres et kilomètres.' },
  { id: 'r10', titre: 'Poids', valeur: 'Kilogrammes', texte: 'Poids en kg.' },
  { id: 'r11', titre: 'Température', valeur: 'Celsius', texte: 'Températures en °C.' },
  { id: 'r12', titre: 'Format de l’heure', valeur: '24 heures', texte: 'Heure du jeu sans a.m. / p.m.' },
];

/** À faire avant « Checking Out » (fin du chapitre 2) ; les deux cartes sont les seuls objets manquables signalés. */
export const CHECKING_OUT_ID = 'C02-27';
export const AVANT_CHECKING_OUT: (Astuce & { manquable?: boolean })[] = [
  { id: 'co01', titre: 'Faire une sauvegarde à part', texte: 'Utiliser un nouvel emplacement de sauvegarde avant de lancer « Checking Out ».' },
  { id: 'co02', titre: 'Carte de Vicki', texte: 'Starlet Motel : toilettes du bureau du motel, par terre près des toilettes.', manquable: true },
  { id: 'co03', titre: 'Carte de Victor Maravilla', texte: 'Starlet Motel : cuisine du motel, sur le réfrigérateur.', manquable: true },
  { id: 'co04', titre: 'Magazine de la réception', texte: '« Help Me Help You Help Me », sur une table. La zone ferme ensuite, mais d’autres exemplaires existent ailleurs.' },
  { id: 'co05', titre: 'Magazine de la cafétéria', texte: '« Wizard Wang », sur une table de la cafétéria. Un autre exemplaire se trouve plus tard.' },
  { id: 'co06', titre: 'Passer au Delights pour Harley', texte: 'La carte de Harley est dans un box contre le mur est. On peut revenir quand le club rouvre.' },
  { id: 'co07', titre: 'Jouer au billard au Delights', texte: 'Défier l’adversaire du club tant que tu es dans le coin ; il revient plus tard.' },
  { id: 'co08', titre: 'Récupérer la voiture de Lucia', texte: 'Si un véhicule en fourrière apparaît sur la carte, le reprendre à Port Gellhorn.' },
  { id: 'co09', titre: 'Mettre les 15 000 $ à l’abri', texte: '« Checking Out » demande au moins 15 000 $ : les déposer sur BuckMe.' },
  { id: 'co10', titre: 'S’équiper avant de partir', texte: 'Recharger le gilet pare-balles et prendre de quoi se soigner avant le final au motel.' },
];

/** Voitures rares : repérages de joueurs, à vérifier en jeu. « lisible » = false quand l'infographie était trop floue pour une ligne. */
export const VOITURES_RARES: { id: string; nom: string; look: string; zone: string; ou: string; note: string; lisible: boolean }[] = [
  { id: 'v1', nom: '’97 Penumbra FF', look: 'Verte, clin d’œil à Fast & Furious', zone: 'Vespucci Island', ou: 'Garage de la villa juste au nord de la Rubio Causeway ; entrer par la porte latérale.', note: 'Le boîtier d’alarme et l’interrupteur du rideau sont sur le mur du fond.', lisible: true },
  { id: 'v2', nom: 'Royal Ruby Emerus', look: 'Supercar de projet rouge et noire', zone: 'Rubio Causeway', ou: 'Une allée fermée par un portail, près de la jonction du pont.', note: 'Repérée à côté d’un SUV noir ; la suite de la note est illisible sur l’infographie.', lisible: false },
  { id: 'v3', nom: 'Devil’s Rope Gauntlet', look: 'Muscle car Bravado noire', zone: 'Ambrosia', ou: 'Le club-house du Final Chapter.', note: 'La voiture est dans le garage du club-house ; le reste de la note est illisible.', lisible: false },
  { id: 'v4', nom: 'Bolide bleu et orange', look: 'Trouvaille de garage façon « Flipper »', zone: 'Capri', ou: 'Les garages à la pointe nord-est de Capri, vers Capri Sound.', note: 'Jantes orange, livrée course bleue et grand aileron arrière.', lisible: true },
  { id: 'v5', nom: 'Big Cat Furia', look: 'Pfister imprimé léopard, plaque POUNCE', zone: 'Starfish Island', ou: 'Au bout de la route vers la pointe nord-est, la villa à l’allée ovale.', note: 'La Furia est devant ; prendre le Key Cloner et vérifier son traceur avancé.', lisible: true },
  { id: 'v6', nom: 'Supercar orange', look: 'Coupé orange en forme de coin', zone: 'Starfish Island', ou: 'Le garage aux murs verts, à côté de l’allée de la même villa.', note: 'D’autres voitures ont aussi été trouvées dans ce garage.', lisible: true },
  { id: 'v7', nom: 'Sportive vert citron', look: 'Vert vif, panneau arrière noir', zone: 'Stockyard', ou: 'Stockyard, juste au nord de Bayside, côté front de mer.', note: 'Repérage d’un joueur : affiner avec la carte.', lisible: true },
  { id: 'v8', nom: 'Lustrous Toros', look: 'SUV Pegassi doré, plaque CASHFLOS', zone: 'Casanova Island', ou: 'Depuis Vespucci Island vers l’est, la grande maison au milieu de Casanova.', note: 'Regarder le garage côté sud : carrosserie dorée et plaque personnalisée.', lisible: true },
];
export const GARDER_VOITURE: Astuce[] = [
  { id: 'g1', titre: 'Scanner avec WAINK', texte: 'Avant de prendre la voiture : comment entrer, quel traceur est installé et le prix d’enregistrement.' },
  { id: 'g2', titre: 'Passer chez Moses au chapitre 2', texte: 'À Port Gellhorn, il reprend les voitures sans traceur ; le premier enregistrement est offert.' },
  { id: 'g3', titre: 'Plus d’options au chapitre 3', texte: 'Randy s’occupe des traceurs standard ; son Key Cloner ouvre les voitures sans clé. Les traceurs avancés demandent un déblocage plus tard.' },
];
