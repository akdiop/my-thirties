import { createContext, useContext, type ReactNode } from 'react';
import { EyeOff } from 'lucide-react';
import type { Entry } from './cloud';

/** Suggestions masquées (parcours, défis, destinations, recettes), gardées dans une seule entrée privée. */
export const HIDDEN_KIND = 'hidden';
export type HiddenItem = { id: string; label: string };
export type Hidden = { items: HiddenItem[]; ids: Set<string>; hide: (id: string, label: string) => Promise<void>; restore: (ids: string[]) => Promise<void> };

export function readHidden(entry: Entry | undefined): HiddenItem[] {
  const raw = entry?.data.items;
  return Array.isArray(raw) ? raw.flatMap((x) => x && typeof x.id === 'string' && typeof x.label === 'string'
    ? [{ id: x.id.slice(0, 120), label: x.label.slice(0, 120) }] : []).slice(-800) : [];
}

const HiddenContext = createContext<Hidden>({ items: [], ids: new Set(), hide: async () => {}, restore: async () => {} });
export const HiddenProvider = ({ value, children }: { value: Hidden; children: ReactNode }) =>
  <HiddenContext.Provider value={value}>{children}</HiddenContext.Provider>;
export const useHidden = () => useContext(HiddenContext);

/** Bouton « Masquer » d'une suggestion ; elle se rétablit depuis la liste ou depuis Profil. */
export function HideButton({ id, label }: { id: string; label: string }) {
  const { hide } = useHidden();
  return <button className="icon-btn hide-btn" aria-label={'Masquer ' + label} title="Ne plus me proposer"
    onClick={() => void hide(id, label)}><EyeOff size={17} /></button>;
}

/** « N masquée(s) · Tout rétablir » sous une liste de suggestions (préfixe : 'path:', 'recipe:'…). */
export function HiddenNote({ prefix }: { prefix: string }) {
  const { items, restore } = useHidden();
  const mine = items.filter((x) => x.id.startsWith(prefix));
  if (!mine.length) return null;
  return <p className="hidden-note muted">{mine.length} suggestion(s) masquée(s) : {mine.slice(0, 4).map((x) => x.label).join(', ')}{mine.length > 4 ? '…' : ''}
    {' '}<button className="link-btn" onClick={() => void restore(mine.map((x) => x.id))}>Tout rétablir</button></p>;
}
