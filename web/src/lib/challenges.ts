import { SUGGESTED_TEMPLATES } from './challengeSuggestions';
import { circuit } from './exercises';

export type ChallengeCategory = 'Sport' | 'Bien-être' | 'Habitudes' | 'Apprentissage' | 'Créativité' | 'Organisation';
export const CATEGORIES: ChallengeCategory[] = ['Sport', 'Bien-être', 'Habitudes', 'Apprentissage', 'Créativité', 'Organisation'];

export type ChallengeTemplate = {
  id: string;
  category: ChallengeCategory;
  discipline: string;
  title: string;
  tagline: string;
  tone: 'caramel' | 'sauge' | 'sable' | 'chocolat';
  /** Programme du jour ; null = jour de repos prévu. */
  day: (n: number) => string | null;
};

const restEvery = (n: number, every: number) => n % every === 0;
/** Nombre de jours actifs écoulés jusqu'au jour n (les jours de repos ne comptent pas). */
const activeBefore = (n: number, every: number) => n - 1 - Math.floor((n - 1) / every);

const PILATES = ['The Hundred', 'Roll-up', 'Cercles de jambe', 'Pont (shoulder bridge)', 'Planche sur avant-bras', 'Swimming', 'Side kicks', 'Étirement de la colonne'];
const YOGA = ['Salutation au soleil', 'Chien tête en bas', 'Guerrier II', 'Arbre', 'Posture de l’enfant', 'Torsion assise', 'Pigeon', 'Relaxation finale'];

export const TEMPLATES: ChallengeTemplate[] = [
  ...SUGGESTED_TEMPLATES,
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

export const templateById = (id: unknown) => TEMPLATES.find((t) => t.id === id);

export const templateLength = (id: string) => { const match = id.match(/-(7|14|21|30)$/); return match ? Number(match[1]) : 30; };

/** Jour du défi (1 = premier jour) pour une date donnée, ou 0 s'il n'a pas commencé. */
export function dayNumber(start: string, today: string) {
  const ms = Date.parse(today + 'T12:00:00') - Date.parse(start + 'T12:00:00');
  return Number.isFinite(ms) && ms >= 0 ? Math.floor(ms / 86_400_000) + 1 : 0;
}
