/** Types du module Mon Panda. */
export type PandaMood = 'happy' | 'calm' | 'sleepy' | 'curious' | 'playful' | 'proud' | 'surprised' | 'eating' | 'reading' | 'tea' | 'idle';
export type Domain = 'equilibre' | 'corps' | 'repos' | 'savoir' | 'serenite' | 'cuisine' | 'objectifs' | 'voyages' | 'projets';
export type Room = 'maison' | 'jardin';

/** Un événement utile venu d'un module existant, avec un identifiant stable (une activité ne rapporte qu'une fois). */
export interface PandaEvent { id: string; domain: Domain; date: string; xp: number; bamboo: number }

export interface PandaPreferences { linkPersonalActivities: boolean; useMoodContext: boolean; animationsEnabled: boolean }

/** Ce qui est enregistré (dans une seule fiche « panda » de mes données, synchronisée et sauvegardée comme le reste). */
export interface PandaState {
  name: string; createdAt: string;
  xpPeak: number;                 // XP acquise : ne redescend jamais (même si une activité est supprimée)
  spent: number;                  // bambous dépensés en boutique
  care: Record<string, number>;   // interactions par jour (caresser, nourrir, jouer…), pour les plafonds
  games: Record<string, number>;  // bambous gagnés en mini-jeu par jour
  unlocked: string[]; equipped: string[]; outfit: string; room: Room;
  levelSeen: number; memories: { date: string; text: string }[];
  prefs: PandaPreferences; rulesVersion: number;
}
