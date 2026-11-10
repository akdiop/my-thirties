import { SUGGESTED_TEMPLATES } from './challengeSuggestions';
import { circuit } from './exercises';

export type ChallengeCategory = 'Sport' | 'Cuisine' | 'Bien-être' | 'Habitudes' | 'Apprentissage' | 'Créativité' | 'Organisation';
export const CATEGORIES: ChallengeCategory[] = ['Sport', 'Cuisine', 'Bien-être', 'Habitudes', 'Apprentissage', 'Créativité', 'Organisation'];

export type ChallengeTemplate = {
  id: string;
  category: ChallengeCategory;
  discipline: string;
  title: string;
  tagline: string;
  tone: 'caramel' | 'sauge' | 'sable' | 'chocolat';
  /** Programme du jour ; null = jour de repos prévu. */
  day: (n: number) => string | null;
  /** Méthode à suivre chaque jour. */
  how?: string[];
  /** Parcours d'apprentissage associé (étape du jour affichée dans le défi). */
  pathId?: string;
  /** Plus proposé au démarrage, mais gardé pour les défis déjà commencés. */
  retired?: boolean;
};

const restEvery = (n: number, every: number) => n % every === 0;
/** Nombre de jours actifs écoulés jusqu'au jour n (les jours de repos ne comptent pas). */
const activeBefore = (n: number, every: number) => n - 1 - Math.floor((n - 1) / every);

const PILATES = ['The Hundred', 'Roll-up', 'Cercles de jambe', 'Pont (shoulder bridge)', 'Planche sur avant-bras', 'Swimming', 'Side kicks', 'Étirement de la colonne'];
const YOGA = ['Salutation au soleil', 'Chien tête en bas', 'Guerrier II', 'Arbre', 'Posture de l’enfant', 'Torsion assise', 'Pigeon', 'Relaxation finale'];

// Une petite action par jour pour un esprit plus serein (d'après le visuel « Challenge bien-être mental 30 jours » d'Aïda).
const MENTAL = ['Écris comment tu te sens aujourd’hui.', 'Passe 1 heure sans téléphone.', 'Sors prendre l’air au moins 20 minutes.', 'Note 3 choses positives de ta journée.',
  'Fais 5 minutes de respiration profonde.', 'Écoute une musique qui te fait du bien.', 'Fais une activité physique qui te plaît.', 'Écris 3 qualités que tu aimes chez toi.',
  'Contacte quelqu’un qui te fait du bien.', 'Lis quelques pages d’un livre inspirant.', 'Fais quelque chose de créatif.', 'Couche-toi un peu plus tôt ce soir.',
  'Range un petit espace autour de toi.', 'Passe une journée sans te comparer sur les réseaux.', 'Prends une vraie pause, sans culpabiliser.', 'Écris une inquiétude, puis ce que tu peux contrôler.',
  'Passe du temps dans la nature.', 'Fais-toi un compliment.', 'Bois suffisamment d’eau aujourd’hui.', 'Étire ton corps pendant 10 minutes.',
  'Note ce qui te rend vraiment heureuse.', 'Passe du temps avec une personne que tu aimes.', 'Essaie quelque chose de nouveau.', 'Concentre-toi sur le moment présent.',
  'Fais une bonne action, même petite.', 'Rappelle-toi : tu fais de ton mieux et c’est suffisant.', 'Crée un moment sans écran avant de dormir.', 'Note 3 choses dont tu es fière.',
  'Visualise la vie que tu veux et fais un petit pas vers elle.', 'Célèbre ces 30 jours et tout le chemin parcouru !'];

export const TEMPLATES: ChallengeTemplate[] = [
  {
    id: 'mental-30', category: 'Bien-être', discipline: 'Bien-être mental', title: 'Défi 30 jours Bien-être mental', tagline: 'Calme · Confiance · Sérénité', tone: 'sauge',
    day: (n) => MENTAL[(n - 1) % MENTAL.length]!,
  },
  {
    id: 'squats-30', category: 'Sport', discipline: 'Squats', title: 'Défi 30 jours Squats', tagline: 'Jambes · Fessiers · Posture', tone: 'chocolat',
    day: (n) => restEvery(n, 4) ? null : `3 séries de ${Math.min(40, 10 + 2 * Math.floor(activeBefore(n, 4) / 2))} squats, 1 min de pause entre les séries. Genoux dans l’axe des pieds.`,
  },
  {
    id: 'pilates-30', category: 'Sport', discipline: 'Pilates', title: 'Défi 30 jours Pilates', tagline: 'Renforcer · Équilibrer · Respirer', tone: 'caramel',
    day: (n) => {
      if (restEvery(n, 4)) return null;
      const minutes = Math.min(25, 10 + 3 * Math.floor(activeBefore(n, 4) / 5));
      const a = activeBefore(n, 4);
      const moves = [0, 1, 2, 3].map((i) => PILATES[(a + i * 2) % PILATES.length]).join(', ');
      return `${minutes} min au sol : ${moves}. Respire sans bloquer, garde le contrôle plutôt que l’amplitude.`;
    },
  },
  {
    id: 'gainage-30', category: 'Sport', discipline: 'Gainage', title: 'Défi 30 jours Gainage', tagline: 'Centre · Stabilité · Dos', tone: 'sable',
    day: (n) => restEvery(n, 4) ? null : `3 planches de ${Math.min(75, 20 + 5 * Math.floor(activeBefore(n, 4) / 2))} secondes sur les avant-bras. Bassin aligné, respiration fluide.`,
  },
  {
    id: 'abdos-30', category: 'Sport', discipline: 'Abdos', title: 'Défi 30 jours Abdos', tagline: 'Ventre · Centre · Posture', tone: 'sable',
    day: (n) => restEvery(n, 4) ? null : `2 tours : ${circuit('Abdos', activeBefore(n, 4), { reps: 10, sec: 20 }, { reps: 24, sec: 45 }).join(' · ')}. 45 s de pause entre les tours.`,
  },
  {
    id: 'bras-30', category: 'Sport', discipline: 'Bras', title: 'Défi 30 jours Bras', tagline: 'Tonifier · Renforcer · Sculpter', tone: 'chocolat',
    day: (n) => restEvery(n, 3) ? null : `2 tours : ${circuit('Bras', activeBefore(n, 3), { reps: 8, sec: 20 }, { reps: 20, sec: 40 }).join(' · ')}. Bouteilles d’eau ou haltères légers.`,
  },
  {
    id: 'fessiers-30', category: 'Sport', discipline: 'Fessiers', title: 'Défi 30 jours Fessiers', tagline: 'Galber · Stabiliser · Tonifier', tone: 'caramel',
    day: (n) => restEvery(n, 4) ? null : `2 tours : ${circuit('Jambes & fessiers', activeBefore(n, 4), { reps: 12, sec: 20 }, { reps: 30, sec: 60 }).join(' · ')}. Par jambe pour les fentes et les kicks.`,
  },
  {
    id: 'yoga-30', category: 'Sport', discipline: 'Yoga', title: 'Défi 30 jours Yoga', tagline: 'Souplesse · Souffle · Présence', tone: 'sauge',
    day: (n) => {
      if (restEvery(n, 7)) return 'Séance libre et douce, ou repos.';
      const a = activeBefore(n, 7);
      return `${Math.min(20, 10 + 2 * Math.floor(a / 6))} min : ${[0, 1, 2].map((i) => YOGA[(a + i) % YOGA.length]).join(', ')}, puis relaxation.`;
    },
  },
  {
    id: 'marche-30', category: 'Bien-être', discipline: 'Mobilité', title: '30 jours de marche', tagline: 'Bouger · Respirer · S’aérer', tone: 'sauge',
    day: (n) => `${Math.min(30, 15 + 5 * Math.floor((n - 1) / 7))} min de marche à ton rythme, idéalement dehors.`,
  },
  {
    id: 'respiration-21', category: 'Bien-être', discipline: 'Autre', title: '21 jours de respiration', tagline: 'Calme · Ancrage · Sommeil', tone: 'sable',
    day: () => '5 min de respiration lente : inspire 4 s, expire 6 s. Assise, épaules relâchées.',
  },
  {
    id: 'gratitude-30', category: 'Bien-être', discipline: 'Autre', title: '30 jours de gratitude', tagline: 'Remarquer · Remercier · Savourer', tone: 'caramel',
    day: () => 'Note trois choses positives de ta journée dans Mon équilibre.',
  },
  {
    id: 'lecture-30', category: 'Habitudes', discipline: 'Autre', title: '30 jours de lecture', tagline: 'Apprendre · S’évader · Ralentir', tone: 'chocolat',
    day: () => 'Lis 10 pages (ou 15 minutes) d’un livre de ton choix.',
  },
  {
    id: 'ecrans-21', category: 'Habitudes', discipline: 'Autre', title: '21 soirs sans écran', tagline: 'Déconnecter · Dormir · Récupérer', tone: 'sable',
    day: () => 'Pas d’écran dans les 30 minutes avant de dormir.',
  },
  {
    id: 'eau-30', category: 'Habitudes', discipline: 'Autre', title: '30 jours d’hydratation', tagline: 'Boire · Penser à soi · Régularité', tone: 'sauge',
    day: () => 'Garde une bouteille d’eau près de toi et bois régulièrement dans la journée.',
  },
];

const pick = <T,>(list: readonly T[], n: number) => list[(n - 1) % list.length]!;
const STRETCH = ['Chat-vache', 'Fente basse', 'Papillon', 'Pince assise', 'Torsion allongée', 'Chien tête en bas', 'Étirement des épaules', 'Posture de l’enfant'];
const SENEGAL = ['Thiéboudienne', 'Yassa poulet', 'Mafé', 'Soupou kandja', 'Thiou', 'Domoda', 'Caldou', 'Thiakry', 'Ndambé', 'Pastels', 'Accara', 'Bissap maison', 'Bouye (jus de pain de singe)', 'Lakh', 'Fataya', 'Dibi', 'Ceebu yapp', 'Mbakhal', 'Couscous de mil', 'Salade niébé'];
const WORLD = ['Italie · risotto', 'Maroc · tajine', 'Japon · donburi', 'Liban · taboulé et houmous', 'Mexique · tacos', 'Inde · dal', 'Thaïlande · curry vert', 'Côte d’Ivoire · attiéké poisson', 'Grèce · moussaka', 'Corée · bibimbap', 'Éthiopie · injera et lentilles', 'Pérou · ceviche', 'Espagne · tortilla', 'Vietnam · rouleaux de printemps', 'Cameroun · ndolé', 'Turquie · menemen', 'Ghana · jollof', 'France · ratatouille', 'Brésil · feijoada', 'Tunisie · chakchouka'];
const VEG = ['Courgette', 'Aubergine', 'Gombo', 'Épinards', 'Patate douce', 'Carotte', 'Chou', 'Poivron', 'Brocoli', 'Potiron', 'Haricots verts', 'Betterave', 'Manioc', 'Petits pois', 'Chou-fleur'];
const BREAKFAST = ['Porridge banane cannelle', 'Œufs brouillés et avocat', 'Yaourt, fruits et granola maison', 'Pancakes à la banane', 'Tartine complète et œuf', 'Smoothie bowl mangue', 'Bouillie de mil', 'Omelette aux légumes', 'Chia pudding coco'];
const SMOOTHIES = ['Mangue · banane · gingembre', 'Épinards · ananas · citron', 'Fruits rouges · avoine', 'Bissap · fraise', 'Papaye · citron vert', 'Bouye · banane', 'Avocat · cacao · datte'];

TEMPLATES.push(
  {
    id: 'pompes-30', category: 'Sport', discipline: 'Bras', title: 'Défi 30 jours Pompes', tagline: 'Bras · Poitrine · Gainage', tone: 'sable',
    day: (n) => restEvery(n, 3) ? null : `3 séries de ${Math.min(15, 4 + Math.floor(activeBefore(n, 3) / 2))} pompes (sur les genoux ou inclinées au début), 1 min de pause.`,
  },
  {
    id: 'cardio-30', category: 'Sport', discipline: 'Cardio', title: 'Défi 30 jours Cardio maison', tagline: 'Souffle · Énergie · Endurance', tone: 'caramel',
    day: (n) => restEvery(n, 3) ? null : `${Math.min(6, 3 + Math.floor(activeBefore(n, 3) / 4))} tours de 40 s d’effort / 20 s de repos : jumping jacks, montées de genoux, squats, mountain climbers.`,
  },
  {
    id: 'course-30', category: 'Sport', discipline: 'Course', title: 'Défi 30 jours Je cours 20 minutes', tagline: 'Débuter · Progresser · Tenir', tone: 'sauge',
    day: (n) => {
      if (n % 2 === 0) return null;
      const w = Math.floor((n - 1) / 7);
      return [`8 × (1 min de course + 2 min de marche)`, `6 × (2 min de course + 1 min 30 de marche)`, `4 × (4 min de course + 1 min de marche)`, `2 × (8 min de course + 2 min de marche)`, `20 min de course lente sans t’arrêter`][Math.min(4, w)]! + ', avec 5 min de marche avant et après.';
    },
  },
  {
    id: 'pas-30', category: 'Sport', discipline: 'Marche', title: 'Défi 30 jours Pas', tagline: 'Bouger · Respirer · S’aérer', tone: 'sauge',
    day: (n) => `Objectif ${new Intl.NumberFormat('fr-FR').format(Math.min(10000, 5000 + 500 * Math.floor((n - 1) / 4))).replace(/ | /g, ' ')} pas aujourd’hui.`,
  },
  {
    id: 'souplesse-30', category: 'Sport', discipline: 'Souplesse', title: 'Défi 30 jours Souplesse', tagline: 'Mobilité · Détente · Posture', tone: 'sable',
    day: (n) => `${Math.min(15, 8 + Math.floor((n - 1) / 6))} min d’étirements : ${[0, 1, 2, 3].map((i) => STRETCH[(n + i * 2) % STRETCH.length]).join(', ')}. Tiens 30 s, sans douleur.`,
  },
  {
    id: 'dos-21', category: 'Sport', discipline: 'Dos', title: '21 jours Dos et posture', tagline: 'Redresser · Soulager · Renforcer', tone: 'chocolat',
    day: (n) => restEvery(n, 4) ? null : `${2 + Math.floor(n / 8)} tours : Superman 10 · Chat-vache 10 · Pont fessier 12 · Rowing avec bouteilles 12. Mouvements lents.`,
  },
  {
    id: 'corde-30', category: 'Sport', discipline: 'Cardio', title: 'Défi 30 jours Corde à sauter', tagline: 'Rythme · Coordination · Cardio', tone: 'caramel',
    day: (n) => restEvery(n, 3) ? null : `${Math.min(10, 3 + Math.floor(activeBefore(n, 3) / 2))} séries de 30 s de corde, 30 s de repos. Petits sauts sur l’avant du pied.`,
  },
  {
    id: 'tennis-30', category: 'Sport', discipline: 'Tennis', title: 'Défi 30 jours Tennis', tagline: 'Service · Coups · Jeu de jambes', tone: 'sauge',
    day: (n) => restEvery(n, 3) ? null : pick([
      '20 lancers de balle au même endroit, bras tendu, puis 10 services lents.',
      'Shadow coup droit : 3 × 15 gestes complets devant un miroir.',
      'Shadow revers : 3 × 15 gestes, en tournant bien les épaules.',
      'Jeu de jambes : 4 × 30 s de pas chassés et retour au centre.',
      'Contre un mur : 50 échanges en coup droit, puis 50 en revers.',
      'Volées : 3 × 10 volées douces contre un mur, raquette devant soi.',
    ], activeBefore(n, 3) + 1),
  },
  {
    id: 'fullbody-28', category: 'Sport', discipline: 'Renforcement', title: '28 jours Full body', tagline: 'Tout le corps · 20 minutes', tone: 'chocolat',
    day: (n) => restEvery(n, 4) ? null : `3 tours : ${circuit('Jambes & fessiers', activeBefore(n, 4), { reps: 12, sec: 20 }, { reps: 24, sec: 45 })[0]} · ${circuit('Bras', activeBefore(n, 4), { reps: 8, sec: 20 }, { reps: 16, sec: 40 })[0]} · ${circuit('Abdos', activeBefore(n, 4), { reps: 10, sec: 20 }, { reps: 20, sec: 40 })[0]} · ${circuit('Gainage', activeBefore(n, 4), { reps: 10, sec: 20 }, { reps: 16, sec: 50 })[0]}.`,
  },
  {
    id: 'danse-21', category: 'Sport', discipline: 'Danse', title: '21 jours Je danse', tagline: 'Joie · Cardio · Lâcher-prise', tone: 'caramel',
    day: (n) => restEvery(n, 7) ? null : `${Math.min(30, 10 + 5 * Math.floor((n - 1) / 7))} min de danse sur ta playlist préférée (afrobeat, mbalax, zumba…).`,
  },
  // ---------- Cuisine ----------
  {
    id: 'senegal-30', category: 'Cuisine', discipline: 'Cuisine', title: '30 jours Saveurs du Sénégal', tagline: 'Transmettre · Goûter · Partager', tone: 'caramel',
    day: (n) => n % 3 === 0 ? `Cuisine aujourd’hui : ${SENEGAL[(n / 3 - 1) % SENEGAL.length]}. Note la recette dans Ma cuisine.` : n % 3 === 1 ? `Prépare la liste de courses pour : ${SENEGAL[(Math.floor(n / 3)) % SENEGAL.length]}.` : 'Jour de restes ou de repos : réchauffe et savoure.',
  },
  {
    id: 'monde-30', category: 'Cuisine', discipline: 'Cuisine', title: 'Tour du monde en 10 plats', tagline: 'Voyager · Découvrir · Épicer', tone: 'sauge',
    day: (n) => n % 3 === 0 ? `Plat du jour : ${WORLD[(n / 3 - 1) % WORLD.length]}.` : null,
  },
  {
    id: 'maison-21', category: 'Cuisine', discipline: 'Cuisine', title: '21 jours 100 % fait maison', tagline: 'Simple · Frais · Économique', tone: 'sable',
    day: (n) => pick(['Aucun plat préparé aujourd’hui : cuisine un repas simple.', 'Prépare ton déjeuner de demain ce soir.', 'Fais une sauce ou une vinaigrette maison.', 'Cuisine un plat en double portion pour demain.', 'Remplace un snack acheté par un fait maison.', 'Utilise les restes du frigo avant d’acheter.', 'Teste une nouvelle épice.'], n),
  },
  {
    id: 'legumes-30', category: 'Cuisine', discipline: 'Cuisine', title: '30 jours Un légume à l’honneur', tagline: 'Couleurs · Saisons · Vitamines', tone: 'sauge',
    day: (n) => `Mets à l’honneur : ${pick(VEG, n)}. Rôti, en soupe, en salade ou sauté.`,
  },
  {
    id: 'batch-28', category: 'Cuisine', discipline: 'Cuisine', title: '4 semaines de batch cooking', tagline: 'Organiser · Cuisiner · Souffler', tone: 'chocolat',
    day: (n) => n % 7 === 0 ? 'Session batch cooking : 3 recettes, 2 heures, boîtes étiquetées.' : n % 7 === 6 ? 'Planifie le menu de la semaine et génère tes courses dans Ma cuisine.' : n % 7 === 1 ? 'Fais les courses de la semaine.' : null,
  },
  {
    id: 'petitdej-21', category: 'Cuisine', discipline: 'Cuisine', title: '21 petits-déjeuners maison', tagline: 'Bien commencer · Varier · Savourer', tone: 'caramel',
    day: (n) => `Petit-déjeuner : ${pick(BREAKFAST, n)}.`,
  },
  {
    id: 'smoothie-14', category: 'Cuisine', discipline: 'Cuisine', title: '14 jours Smoothie du matin', tagline: 'Fruits · Fraîcheur · Énergie', tone: 'sauge',
    day: (n) => `Smoothie : ${pick(SMOOTHIES, n)}.`,
  },
  {
    id: 'antigaspi-21', category: 'Cuisine', discipline: 'Cuisine', title: '21 jours Zéro gaspillage', tagline: 'Restes · Économies · Créativité', tone: 'sable',
    day: (n) => pick(['Fais l’inventaire du frigo et cuisine ce qui doit partir.', 'Transforme le pain sec (pain perdu, chapelure).', 'Congèle ce que tu ne mangeras pas à temps.', 'Utilise les fanes et épluchures (bouillon, chips).', 'Cuisine un plat « vide-frigo ».', 'Range le frigo : ce qui expire bientôt devant.', 'Prépare des portions adaptées pour éviter les restes.'], n),
  },
  {
    id: 'epices-14', category: 'Cuisine', discipline: 'Cuisine', title: '14 jours Épices du monde', tagline: 'Goût · Curiosité · Couleur', tone: 'caramel',
    day: (n) => `Épice du jour : ${pick(['Cumin', 'Curcuma', 'Gingembre', 'Poivre de Selim (diar)', 'Cannelle', 'Paprika fumé', 'Cardamome', 'Ras el hanout', 'Piment d’Espelette', 'Sumac', 'Garam masala', 'Clou de girofle', 'Muscade', 'Za’atar'], n)}. Ajoute-la à un plat simple.`,
  },
  // ---------- Bien-être / Habitudes ----------
  {
    id: 'meditation-21', category: 'Bien-être', discipline: 'Autre', title: '21 jours de méditation', tagline: 'Présence · Calme · Concentration', tone: 'sauge',
    day: (n) => `${Math.min(15, 3 + Math.floor((n - 1) / 3))} min assise en silence, attention sur le souffle.`,
  },
  {
    id: 'sommeil-21', category: 'Bien-être', discipline: 'Autre', title: '21 jours Mieux dormir', tagline: 'Rituel · Régularité · Repos', tone: 'chocolat',
    day: (n) => pick(['Couchée à heure fixe ce soir.', 'Tisane et lumière douce 30 min avant de dormir.', 'Téléphone hors de la chambre.', 'Note 3 choses qui te tracassent puis ferme le carnet.', 'Lève-toi à la même heure demain.', 'Pas de caféine après 15 h.', 'Chambre aérée et fraîche.'], n),
  },
  {
    id: 'ecriture-30', category: 'Habitudes', discipline: 'Autre', title: '30 jours d’écriture', tagline: 'Écrire · Se découvrir · Créer', tone: 'sable',
    day: (n) => `Écris 10 minutes : ${pick(['un souvenir d’enfance', 'ta journée idéale à 35 ans', 'une lettre à toi-même', 'un lieu que tu aimes', 'une conversation entendue', 'ce qui t’a fait sourire', 'une recette de famille et son histoire', 'un rêve récent', 'une personne qui t’inspire', 'ce que tu ferais sans peur'], n)}.`,
  },
  {
    id: 'rangement-30', category: 'Habitudes', discipline: 'Autre', title: '30 jours de désencombrement', tagline: 'Alléger · Ranger · Respirer', tone: 'sauge',
    day: (n) => `Trie : ${pick(['un tiroir', 'les produits de beauté', 'la penderie (5 pièces)', 'les papiers', 'les photos du téléphone', 'les applications inutiles', 'la cuisine (placard)', 'les chaussures', 'les sacs', 'les e-mails', 'la salle de bain', 'la table de nuit'], n)}.`,
  },
  {
    id: 'economie-30', category: 'Habitudes', discipline: 'Autre', title: '30 jours d’économies', tagline: 'Budget · Conscience · Épargne', tone: 'caramel',
    day: (n) => pick(['Note toutes tes dépenses du jour dans Mes finances.', 'Journée sans dépense non essentielle.', 'Vérifie un abonnement : le garder ou le résilier ?', 'Mets de côté une petite somme dans ton objectif d’épargne.', 'Prépare ton repas au lieu d’acheter.', 'Compare un achat prévu avant de payer.', 'Fais le point du budget de la semaine.'], n),
  },
);

// Suggestions d'apprentissage, de créativité et d'organisation (reprises de la PR #10).
TEMPLATES.push(...SUGGESTED_TEMPLATES);

export const templateById = (id: unknown) => TEMPLATES.find((t) => t.id === id);

export const templateLength = (id: string) => { const m = /-(\d+)$/.exec(id); return m ? Math.min(30, Number(m[1])) : 30; };

/** Jour du défi (1 = premier jour) pour une date donnée, ou 0 s'il n'a pas commencé. */
export function dayNumber(start: string, today: string) {
  const ms = Date.parse(today + 'T12:00:00') - Date.parse(start + 'T12:00:00');
  return Number.isFinite(ms) && ms >= 0 ? Math.floor(ms / 86_400_000) + 1 : 0;
}
