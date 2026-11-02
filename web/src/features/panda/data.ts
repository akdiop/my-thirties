import type { Domain } from './types';

export const PANDA_KIND = 'panda';
export const RULES_VERSION = 1;

/** Seuils d'XP cumulée (valeurs de départ, à ajuster). Au-delà du niveau 5, l'XP continue sans changer d'apparence. */
export const LEVELS = [
  { n: 1, name: 'Bébé panda', stage: 'Découverte', from: 0, unlock: 'Adoption, câlins et repas' },
  { n: 2, name: 'Panda curieux', stage: 'Exploration', from: 100, unlock: 'Jeux et premiers accessoires' },
  { n: 3, name: 'Panda équilibré', stage: 'Construction', from: 300, unlock: 'Coin lecture et décoration' },
  { n: 4, name: 'Panda épanoui', stage: 'Épanouissement', from: 700, unlock: 'Jardin et nouvelles activités' },
  { n: 5, name: 'Panda sage', stage: 'Accomplissement', from: 1500, unlock: 'Maison complète et souvenirs spéciaux' },
] as const;

/** Récompense par activité réelle : XP et bambous (valeurs initiales du cahier des charges). */
export const REWARD: Record<Domain, { xp: number; bamboo: number }> = {
  equilibre: { xp: 10, bamboo: 5 }, corps: { xp: 10, bamboo: 5 }, repos: { xp: 10, bamboo: 5 }, savoir: { xp: 10, bamboo: 5 },
  serenite: { xp: 10, bamboo: 5 }, cuisine: { xp: 10, bamboo: 5 }, objectifs: { xp: 20, bamboo: 10 }, voyages: { xp: 10, bamboo: 5 }, projets: { xp: 20, bamboo: 10 },
};
/** Plafonds quotidiens : pas de cumul artificiel, mais jamais de perte. */
export const DAILY_CAP = { xp: 80, bamboo: 40, careXp: 10, playXp: 15, playBamboo: 9, gameBamboo: 30 };
export const CARE = { pet: { xp: 5, bamboo: 0 }, feed: { xp: 5, bamboo: 0 }, play: { xp: 5, bamboo: 3 } };

export const DOMAINS: { id: Domain; module: string; reward: string; reaction: string }[] = [
  { id: 'equilibre', module: 'Mon équilibre', reward: 'Animation calme', reaction: 'respire avec toi' },
  { id: 'corps', module: 'Sport et bien-être', reward: 'Tapis de yoga', reaction: 'joue et s’étire' },
  { id: 'repos', module: 'Sommeil', reward: 'Coussin moelleux', reaction: 'aménage son coin repos' },
  { id: 'savoir', module: 'Lecture et apprentissage', reward: 'Livres pour sa bibliothèque', reaction: 'collectionne des livres' },
  { id: 'serenite', module: 'Spiritualité', reward: 'Décoration du jardin', reaction: 'rend son jardin paisible' },
  { id: 'cuisine', module: 'Cuisine', reward: 'Nouveaux aliments', reaction: 'goûte de nouvelles choses' },
  { id: 'objectifs', module: 'Défis et habitudes', reward: 'Bambous', reaction: 'gagne des bambous' },
  { id: 'voyages', module: 'Voyages', reward: 'Objets souvenirs', reaction: 'garde des souvenirs' },
  { id: 'projets', module: 'Mon projet personnel', reward: 'Objets pour la maison', reaction: 'construit sa maison' },
];

/** Bannière illustrée du panda pour chaque domaine (banner_<nom> dans public/panda/). */
export const DOMAIN_BANNER: Record<Domain, string> = {
  equilibre: 'bienetre', corps: 'sport', repos: 'sommeil', savoir: 'lecture', serenite: 'spiritualite',
  cuisine: 'cuisine', objectifs: 'organisation', voyages: 'voyages', projets: 'objectifs',
};

export type ItemId = 'tapis' | 'coussin' | 'plante' | 'lampe' | 'etagere' | 'panier' | 'guirlande' | 'tableau' | 'bonsai' | 'theiere' | 'yoga' | 'lanterne' | 'fleurs' | 'fontaine' | 'balancoire' | 'valise';
export type Item = { id: ItemId; name: string; price: number; level: number; room: 'maison' | 'jardin'; gift?: { domain: Domain; n: number } };
/** Objets : à acheter avec des bambous, ou offerts quand un module atteint un nombre d'activités. */
export const ITEMS: Item[] = [
  { id: 'tapis', name: 'Tapis tressé', price: 0, level: 1, room: 'maison' },
  { id: 'coussin', name: 'Coussin moelleux', price: 20, level: 1, room: 'maison', gift: { domain: 'repos', n: 3 } },
  { id: 'plante', name: 'Plante verte', price: 25, level: 1, room: 'maison' },
  { id: 'panier', name: 'Panier à sieste', price: 40, level: 1, room: 'maison', gift: { domain: 'repos', n: 10 } },
  { id: 'yoga', name: 'Tapis de yoga', price: 30, level: 2, room: 'maison', gift: { domain: 'corps', n: 3 } },
  { id: 'theiere', name: 'Théière et bambous', price: 25, level: 2, room: 'maison', gift: { domain: 'cuisine', n: 3 } },
  { id: 'lampe', name: 'Lampe douce', price: 35, level: 2, room: 'maison' },
  { id: 'etagere', name: 'Coin lecture', price: 45, level: 3, room: 'maison', gift: { domain: 'savoir', n: 3 } },
  { id: 'tableau', name: 'Tableau de mes projets', price: 40, level: 3, room: 'maison', gift: { domain: 'projets', n: 3 } },
  { id: 'valise', name: 'Valise souvenir', price: 40, level: 3, room: 'maison', gift: { domain: 'voyages', n: 1 } },
  { id: 'guirlande', name: 'Guirlande lumineuse', price: 50, level: 3, room: 'maison' },
  { id: 'bonsai', name: 'Bonsaï', price: 60, level: 3, room: 'maison' },
  { id: 'fleurs', name: 'Parterre de fleurs', price: 40, level: 4, room: 'jardin' },
  { id: 'lanterne', name: 'Lanterne paisible', price: 60, level: 4, room: 'jardin', gift: { domain: 'serenite', n: 5 } },
  { id: 'balancoire', name: 'Balançoire', price: 90, level: 4, room: 'jardin' },
  { id: 'fontaine', name: 'Petite fontaine', price: 120, level: 5, room: 'jardin' },
];
export const OUTFITS: { id: string; name: string; price: number; level: number }[] = [
  { id: 'aucune', name: 'Au naturel', price: 0, level: 1 },
  { id: 'noeud', name: 'Petit nœud', price: 15, level: 2 },
  { id: 'bandana', name: 'Bandana sport', price: 25, level: 2 },
  { id: 'echarpe', name: 'Écharpe douce', price: 30, level: 3 },
  { id: 'chapeau', name: 'Chapeau de paille', price: 40, level: 3 },
  { id: 'couronne', name: 'Couronne de fleurs', price: 50, level: 4 },
  { id: 'lunettes', name: 'Lunettes de sage', price: 60, level: 5 },
];
/** Aliments découverts grâce à la cuisine (un de plus toutes les 2 recettes ou repas). */
export const FOODS = ['Bambou frais', 'Pousse tendre', 'Pomme', 'Mangue', 'Riz', 'Thé au miel', 'Biscuit', 'Fraises', 'Patate douce', 'Thiakry', 'Bissap glacé', 'Gâteau'];

export const MESSAGES = {
  hello: ['Ton panda est content de te voir !', 'Aujourd’hui, on avance à notre rythme.', 'Je t’attendais, sans me presser.', 'Il fait bon dans notre cocon.', 'Un petit pas, c’est déjà un pas.', 'Tu fais de ton mieux, et c’est beaucoup.', 'J’ai gardé un bambou pour toi.', 'Même les journées tranquilles comptent.'],
  pet: ['Hihi, ça chatouille !', 'J’adore les câlins.', 'Encore un peu ?'], feed: ['Miam, merci !', 'Délicieux !', 'Mon repas préféré.'],
  play: ['On joue ? Attrape les bambous !', 'Youpi !'], rest: ['Une petite sieste…', 'Je me repose un moment.'],
  calm: 'Et si on prenait un moment calme ensemble ? Rien ne presse.', night: 'Je fais une petite sieste… À demain, doucement.',
};
export const pick = (list: readonly string[], seed: number) => list[Math.abs(seed) % list.length]!;
