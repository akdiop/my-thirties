import { isoWeekday, type ISODate } from './dates';

export const ROUTINE_KINDS = [
  { id: 'matin', label: 'Matin', defaultName: 'Routine du matin', weekdays: [1, 2, 3, 4, 5, 6, 7], time: '07:00', items: ['Verre d’eau', 'Étirements', 'Prière', 'Revoir mes 3 priorités'] },
  { id: 'soir', label: 'Soir', defaultName: 'Routine du soir', weekdays: [1, 2, 3, 4, 5, 6, 7], time: '21:30', items: ['Préparer demain', 'Bilan du jour', 'Lecture'] },
  { id: 'travail', label: 'Travail', defaultName: 'Routine de travail', weekdays: [1, 2, 3, 4, 5], time: '09:00', items: ['Boîte de réception', 'Bloc de concentration', 'Point de fin de journée'] },
  { id: 'weekend', label: 'Week-end', defaultName: 'Routine du week-end', weekdays: [6, 7], time: '10:00', items: ['Ménage', 'Courses', 'Batch cooking'] },
  { id: 'perso', label: 'Personnalisée', defaultName: '', weekdays: [1, 2, 3, 4, 5, 6, 7], time: null, items: [] },
] as const;

export const routineKind = (id: string) => ROUTINE_KINDS.find((k) => k.id === id) ?? ROUTINE_KINDS[ROUTINE_KINDS.length - 1]!;

export const isScheduledOn = (weekdays: number[], date: ISODate) => weekdays.includes(isoWeekday(date));

export function routineProgress(itemIds: string[], checked: Set<string>) {
  const done = itemIds.filter((id) => checked.has(id)).length;
  return { done, total: itemIds.length, ratio: itemIds.length ? done / itemIds.length : 0 };
}

const DAY_NAMES = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];

export function describeWeekdays(weekdays: number[]) {
  const set = [...new Set(weekdays)].sort();
  if (set.length === 7) return 'Tous les jours';
  if (set.join() === '1,2,3,4,5') return 'En semaine';
  if (set.join() === '6,7') return 'Le week-end';
  if (!set.length) return 'Aucun jour';
  return set.map((d) => DAY_NAMES[d - 1]).join(' ');
}
