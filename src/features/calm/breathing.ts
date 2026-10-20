export type BreathPhase = 'inhale' | 'exhale';

export const INHALE_MS = 4000;
export const EXHALE_MS = 6000;
export const CYCLES = 6;

export function breathAt(elapsedMs: number) {
  const cycleMs = INHALE_MS + EXHALE_MS;
  const cycle = Math.floor(elapsedMs / cycleMs);
  if (cycle >= CYCLES) return { done: true, cycle: CYCLES, phase: 'exhale' as BreathPhase, secondsLeft: 0 };
  const inCycle = elapsedMs - cycle * cycleMs;
  const phase: BreathPhase = inCycle < INHALE_MS ? 'inhale' : 'exhale';
  const phaseEnd = phase === 'inhale' ? INHALE_MS : cycleMs;
  return { done: false, cycle: cycle + 1, phase, secondsLeft: Math.ceil((phaseEnd - inCycle) / 1000) };
}
