export const EMOTIONS = ['Anxiété', 'Nervosité', 'Colère', 'Tristesse', 'Frustration', 'Fatigue', 'Joie', 'Calme', 'Gratitude', 'Fierté'] as const;

export const STRATEGIES = ['Respiration', 'Ancrage 5-4-3-2-1', 'Faits ou suppositions', 'Méthode STOP', 'Marche', 'Écrire', 'En parler', 'Prière ou dhikr', 'Pause', 'Autre'] as const;

export const OUTCOMES = [
  { value: 'mieux', label: 'Ça m’a aidée' },
  { value: 'pareil', label: 'Pas de changement' },
  { value: 'moins-bien', label: 'C’était plus difficile' },
] as const;

export type EmotionEntryLike = { at: string; emotion: string; intensity: number; trigger: string | null; strategy: string | null; outcome: string | null };

export function emotionTrends(entries: EmotionEntryLike[], since: string) {
  const recent = entries.filter((e) => e.at >= since);
  const count = new Map<string, number>();
  const triggers = new Map<string, number>();
  const strategy = new Map<string, { used: number; helped: number }>();
  for (const e of recent) {
    count.set(e.emotion, (count.get(e.emotion) ?? 0) + 1);
    const t = e.trigger?.trim().toLowerCase();
    if (t) triggers.set(t, (triggers.get(t) ?? 0) + 1);
    if (e.strategy) {
      const s = strategy.get(e.strategy) ?? { used: 0, helped: 0 };
      s.used++;
      if (e.outcome === 'mieux') s.helped++;
      strategy.set(e.strategy, s);
    }
  }
  const sortDesc = <T,>(m: Map<string, T>, key: (v: T) => number) => [...m.entries()].sort((a, b) => key(b[1]) - key(a[1]));
  return {
    total: recent.length,
    averageIntensity: recent.length ? Math.round((recent.reduce((s, e) => s + e.intensity, 0) / recent.length) * 10) / 10 : null,
    emotions: sortDesc(count, (v) => v).map(([name, n]) => ({ name, n })),
    triggers: sortDesc(triggers, (v) => v)
      .filter(([, n]) => n >= 2)
      .slice(0, 3)
      .map(([name, n]) => ({ name, n })),
    helpful: sortDesc(strategy, (v) => v.helped)
      .filter(([, v]) => v.helped > 0)
      .slice(0, 3)
      .map(([name, v]) => ({ name, ...v })),
  };
}
