export const DHIKR = {
  subhan: { phrase: 'SubhanAllah', arabic: 'سُبْحَانَ ٱللَّٰهِ', meaning: 'Gloire à Allah' },
  hamd: { phrase: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', meaning: 'Louange à Allah' },
  akbar: { phrase: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', meaning: 'Allah est le plus grand' },
  tahlil: { phrase: 'La ilaha illa Allah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', meaning: 'Pas de divinité en dehors d’Allah' },
  istighfar: { phrase: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', meaning: 'Je demande pardon à Allah' },
  salawat: { phrase: 'Salawat', arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', meaning: 'Prière sur le Prophète ﷺ' },
} as const;

export type DhikrId = keyof typeof DHIKR;

export type DhikrRoutine = { id: string; name: string; steps: [DhikrId, number][] };

export const DHIKR_ROUTINES: DhikrRoutine[] = [
  { id: 'r5', name: 'Routine 5 minutes', steps: [['subhan', 33], ['hamd', 33], ['akbar', 33], ['tahlil', 1]] },
  { id: 'r10', name: 'Routine 10 minutes', steps: [['istighfar', 100], ['salawat', 50], ['subhan', 33], ['hamd', 33], ['akbar', 33]] },
  { id: 'r30', name: 'Routine 30 minutes', steps: [['istighfar', 100], ['tahlil', 100], ['subhan', 33], ['hamd', 33], ['akbar', 33], ['salawat', 100]] },
];

export type CounterState = { routineId: string | null; step: number; count: number; total: number; done: boolean };

export const startCounter = (routineId: string | null): CounterState => ({ routineId, step: 0, count: 0, total: 0, done: false });

export function tap(state: CounterState): CounterState & { reachedGoal: boolean } {
  if (state.done) return { ...state, reachedGoal: false };
  const routine = DHIKR_ROUTINES.find((r) => r.id === state.routineId);
  const count = state.count + 1;
  const total = state.total + 1;
  if (!routine) return { ...state, count, total, reachedGoal: false };
  const goal = routine.steps[state.step]?.[1] ?? Infinity;
  if (count < goal) return { ...state, count, total, reachedGoal: false };
  if (state.step + 1 < routine.steps.length) return { ...state, step: state.step + 1, count: 0, total, reachedGoal: true };
  return { ...state, count, total, done: true, reachedGoal: true };
}

export const currentDhikr = (state: CounterState) => {
  const routine = DHIKR_ROUTINES.find((r) => r.id === state.routineId);
  const step = routine?.steps[state.step];
  return { routine, id: (step?.[0] ?? 'subhan') as DhikrId, goal: step?.[1] ?? null };
};
