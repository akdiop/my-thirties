export function stepProgress(steps: number | null, goal: number) {
  if (steps === null) return null;
  return { steps, goal, ratio: goal > 0 ? Math.min(1, steps / goal) : 0, reached: steps >= goal };
}

export function stepAverage(days: { steps: number | null }[]) {
  const known = days.map((d) => d.steps).filter((s): s is number => s !== null);
  return known.length ? Math.round(known.reduce((a, b) => a + b, 0) / known.length) : null;
}

export const formatSteps = (n: number) => n.toLocaleString('fr-FR').replace(/ | /g, ' ');
