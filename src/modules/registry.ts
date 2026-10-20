export type FeatureStatus = 'operational' | 'partial' | 'awaiting-config' | 'prototype' | 'not-developed';

export const STATUS_LABEL: Record<FeatureStatus, string> = {
  operational: 'Opérationnel',
  partial: 'Partiellement opérationnel',
  'awaiting-config': 'En attente de configuration',
  prototype: 'Prototype',
  'not-developed': 'Non développé',
};

export type ModuleId =
  | 'quotidien'
  | 'sante'
  | 'sport'
  | 'challenges'
  | 'equilibre'
  | 'spiritualite'
  | 'finances'
  | 'cuisine'
  | 'decouvertes'
  | 'passions'
  | 'listes';

export type ModuleDefinition = {
  id: ModuleId;
  label: string;
  description: string;
  icon: string;
  tone: 'sand' | 'sage' | 'blush';
  phase: 2 | 3 | 4;
  status: FeatureStatus;
  sensitive: boolean;
};

export const MODULES: readonly ModuleDefinition[] = [
  { id: 'quotidien', label: 'Mon quotidien', description: 'Tâches, routines et planification', icon: 'calendar-check', tone: 'blush', phase: 2, status: 'not-developed', sensitive: false },
  { id: 'sante', label: 'Ma santé', description: 'Cycle, sommeil, alimentation, rendez-vous', icon: 'heart', tone: 'sage', phase: 3, status: 'not-developed', sensitive: true },
  { id: 'sport', label: 'Mon sport', description: 'Tennis, Pilates, yoga et journal', icon: 'dumbbell', tone: 'sage', phase: 3, status: 'not-developed', sensitive: false },
  { id: 'challenges', label: 'Mes challenges', description: 'Calendriers de 30 jours en parallèle', icon: 'trophy', tone: 'sage', phase: 3, status: 'not-developed', sensitive: false },
  { id: 'equilibre', label: 'Mon équilibre', description: 'Axes, Booster, journaux, apaisement', icon: 'flower', tone: 'sand', phase: 3, status: 'not-developed', sensitive: true },
  { id: 'spiritualite', label: 'Ma spiritualité', description: 'Prières, Coran, dhikr, calendrier hégirien', icon: 'moon', tone: 'sand', phase: 3, status: 'not-developed', sensitive: true },
  { id: 'finances', label: 'Mes finances', description: 'Budget multidevise, abonnements, épargne', icon: 'wallet', tone: 'blush', phase: 4, status: 'not-developed', sensitive: true },
  { id: 'cuisine', label: 'Ma cuisine', description: 'Recettes et batch cooking', icon: 'cooking-pot', tone: 'blush', phase: 4, status: 'not-developed', sensitive: false },
  { id: 'decouvertes', label: 'Mes découvertes', description: 'Destinations et prochain voyage', icon: 'compass', tone: 'sage', phase: 4, status: 'not-developed', sensitive: false },
  { id: 'passions', label: 'Mes passions', description: 'Un hobby sur six ou douze mois', icon: 'brush', tone: 'sand', phase: 4, status: 'not-developed', sensitive: false },
  { id: 'listes', label: 'Mes listes', description: 'Courses, valise, livres, souhaits', icon: 'list', tone: 'blush', phase: 2, status: 'not-developed', sensitive: false },
];

export const getModule = (id: string) => MODULES.find((m) => m.id === id);

export type ModuleState = { moduleId: string; enabled: boolean; position: number };

export function defaultModuleStates(): ModuleState[] {
  return MODULES.map((m, i) => ({ moduleId: m.id, enabled: true, position: i }));
}

export function orderedModules(states: ModuleState[], { includeDisabled = false } = {}) {
  const byId = new Map(states.map((s) => [s.moduleId, s]));
  return MODULES.map((m, i) => ({ module: m, state: byId.get(m.id) ?? { moduleId: m.id, enabled: true, position: MODULES.length + i } }))
    .filter(({ state }) => includeDisabled || state.enabled)
    .sort((a, b) => a.state.position - b.state.position);
}
