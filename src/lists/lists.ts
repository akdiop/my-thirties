export const LIST_TYPES = [
  { id: 'courses', label: 'Courses' },
  { id: 'valise', label: 'Valise' },
  { id: 'voyage', label: 'Voyage' },
  { id: 'achats', label: 'Achats' },
  { id: 'livres', label: 'Livres' },
  { id: 'films', label: 'Films' },
  { id: 'cadeaux', label: 'Cadeaux' },
  { id: 'projets', label: 'Projets' },
  { id: 'souhaits', label: 'Souhaits' },
  { id: 'perso', label: 'Personnalisée' },
] as const;

export type ListType = (typeof LIST_TYPES)[number]['id'];

export const listTypeLabel = (id: string) => LIST_TYPES.find((t) => t.id === id)?.label ?? 'Personnalisée';

export type TemplateItem = { title: string; quantity?: string };

export const LIST_TEMPLATES: { id: string; title: string; type: ListType; items: TemplateItem[] }[] = [
  {
    id: 'courses-base',
    title: 'Courses de base',
    type: 'courses',
    items: [{ title: 'Riz' }, { title: 'Oignons' }, { title: 'Huile' }, { title: 'Œufs' }, { title: 'Fruits' }, { title: 'Légumes' }, { title: 'Eau' }],
  },
  {
    id: 'valise-plage',
    title: 'Valise · séjour au soleil',
    type: 'valise',
    items: [
      { title: 'Passeport et documents' },
      { title: 'Maillots de bain', quantity: '2' },
      { title: 'Crème solaire' },
      { title: 'Lunettes de soleil' },
      { title: 'Chargeurs et adaptateur' },
      { title: 'Trousse de toilette' },
      { title: 'Médicaments habituels' },
    ],
  },
  { id: 'livres', title: 'Livres à lire', type: 'livres', items: [] },
  { id: 'cadeaux', title: 'Idées cadeaux', type: 'cadeaux', items: [] },
];

export type Positioned = { id: string; position: number };

export function move<T extends Positioned>(items: T[], id: string, direction: -1 | 1) {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  const i = sorted.findIndex((x) => x.id === id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= sorted.length) return [];
  const a = sorted[i]!;
  const b = sorted[j]!;
  return [
    { id: a.id, position: b.position },
    { id: b.id, position: a.position },
  ];
}

export const nextPosition = (items: Positioned[]) => items.reduce((m, x) => Math.max(m, x.position), -1) + 1;

export function progress(items: { checked: boolean }[]) {
  const done = items.filter((i) => i.checked).length;
  return { done, total: items.length, ratio: items.length ? done / items.length : 0 };
}

export const duplicateTitle = (title: string) => (/\(copie\)$/.test(title) ? title : `${title} (copie)`);
