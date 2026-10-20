export const EVENT_CATEGORIES = [
  { id: 'perso', label: 'Personnel', color: '#B68F72' },
  { id: 'travail', label: 'Travail', color: '#6B3F2E' },
  { id: 'sante', label: 'Santé', color: '#8F9F7A' },
  { id: 'sport', label: 'Sport', color: '#5E7A5F' },
  { id: 'spiritualite', label: 'Spiritualité', color: '#4A6350' },
  { id: 'social', label: 'Proches', color: '#D4B483' },
  { id: 'autre', label: 'Autre', color: '#9C8576' },
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number]['id'];

export const categoryOf = (id: string) => EVENT_CATEGORIES.find((c) => c.id === id) ?? EVENT_CATEGORIES[EVENT_CATEGORIES.length - 1]!;
