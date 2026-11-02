import { cloud } from './cloud';

export type Turn = { role: 'user' | 'assistant'; content: string };

/** Appelle la fonction personal-assistant (session requise). Lève une erreur si l'assistant ne répond pas. */
export async function askAssistant(message: string, opts: { context?: string; actions?: boolean; history?: Turn[] } = {}): Promise<string> {
  if (!cloud) throw new Error('Connexion non configurée.');
  const { data, error } = await cloud.functions.invoke('personal-assistant', { body: {
    message: message.trim().slice(0, 1200),
    ...(opts.context ? { context: opts.context } : {}),
    ...(opts.actions ? { actions: true } : {}),
    ...(opts.history?.length ? { history: opts.history.slice(-8).map((t) => ({ role: t.role, content: t.content.slice(0, 3000) })) } : {}),
  } });
  if (error || !data || typeof data.answer !== 'string') throw new Error('Assistant indisponible.');
  return data.answer;
}

/** Lit une liste d'étapes renvoyée par l'IA : tableau JSON de textes, sinon une ligne par étape. */
export function parseSteps(raw: string): string[] {
  const a = raw.indexOf('['), b = raw.lastIndexOf(']');
  if (a >= 0 && b > a) {
    try { const v = JSON.parse(raw.slice(a, b + 1)); if (Array.isArray(v)) return v.filter((x) => typeof x === 'string').map((x) => x.trim().slice(0, 160)).filter(Boolean).slice(0, 12); } catch { /* lignes */ }
  }
  return raw.split('\n').map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/\*\*/g, '').trim()).filter((l) => l.length > 3 && l.length <= 160).slice(0, 12);
}
