import { useEffect, useRef, useState } from 'react';
import type { Entry } from './cloud';

/**
 * Enregistre un brouillon automatiquement, une seconde après la dernière frappe.
 * Sans entrée existante, `create` est appelé une seule fois ; quand l'entrée arrive, les frappes faites
 * entre-temps sont enregistrées par une mise à jour.
 */
export function useAutosave(entry: Entry | undefined, draft: Record<string, unknown> | null,
  create: () => Promise<void>, update: (e: Entry, data: Record<string, unknown>) => Promise<void>) {
  const creating = useRef(false);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  useEffect(() => {
    if (!draft) return;
    const same = entry && Object.entries(draft).every(([k, v]) => JSON.stringify(entry.data[k] ?? '') === JSON.stringify(v ?? ''));
    if (same) return;
    const t = setTimeout(async () => {
      if (!entry && creating.current) return;
      setState('saving');
      try {
        if (entry) await update(entry, { ...entry.data, ...draft });
        else { creating.current = true; await create(); }
        setState('saved');
      } catch { setState('error'); }
      finally { creating.current = false; }
    }, 900);
    return () => clearTimeout(t);
  }, [draft, entry]);
  return state;
}

export const saveLabel = (s: ReturnType<typeof useAutosave>) => s === 'saving' ? 'Enregistrement…' : s === 'saved' ? 'Enregistré ✓' : s === 'error' ? 'Pas enregistré, réessaie' : '';
