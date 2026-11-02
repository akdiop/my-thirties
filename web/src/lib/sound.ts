/** Cloche douce générée par le navigateur (aucun fichier son, rien n'est envoyé). */
let ctx: AudioContext | null = null;

export function bell(times = 1) {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    for (let i = 0; i < times; i++) {
      const t0 = ctx.currentTime + i * 1.6;
      // Une fondamentale et deux harmoniques qui s'éteignent lentement, comme un bol chantant.
      for (const [f, g] of [[528, 0.32], [1056, 0.12], [1584, 0.06]] as const) {
        const o = ctx.createOscillator(), v = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        v.gain.setValueAtTime(0.0001, t0); v.gain.exponentialRampToValueAtTime(g, t0 + 0.02); v.gain.exponentialRampToValueAtTime(0.0001, t0 + 4);
        o.connect(v).connect(ctx.destination); o.start(t0); o.stop(t0 + 4.1);
      }
    }
  } catch { /* son indisponible : la séance continue en silence */ }
}

/** À appeler sur un geste de l'utilisateur pour que l'iPhone autorise le son ensuite. */
export function unlockSound() {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch { /* rien */ }
}
