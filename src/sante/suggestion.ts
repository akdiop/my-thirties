export type HealthSignal = { energy: number | null; pain: number | null; inPeriod: boolean };

export function intensitySuggestion(s: HealthSignal) {
  if (s.pain !== null && s.pain >= 3) return { level: 'repos' as const, text: 'Douleurs marquées aujourd’hui : un jour de repos ou de la respiration est une bonne option.' };
  if ((s.energy !== null && s.energy <= 2) || (s.inPeriod && (s.pain ?? 0) >= 2)) {
    return { level: 'doux' as const, text: 'Énergie basse : une séance de yoga doux de 10 minutes, ou la version adaptée du challenge.' };
  }
  return null;
}
