import type { Entry } from './cloud';

/** Recherche plein texte : titre et tous les textes d'une entrée, sans tenir compte des accents ni des majuscules. */
export const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('fr');

function strings(v: unknown, out: string[], depth = 0) {
  if (depth > 3) return;
  if (typeof v === 'string') { if (v.length < 4000 && !/^(data:|https?:\/\/)/.test(v)) out.push(v); }
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out, depth + 1));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out, depth + 1));
}

export function fullText(e: Entry) { const out = [e.title]; strings(e.data, out); return out.join(' · '); }

/** Entrées qui contiennent la recherche, avec un extrait autour du passage trouvé. */
export function searchEntries(entries: Entry[], q: string, limit = 30) {
  const s = fold(q.trim());
  if (s.length < 2) return [];
  const res: { e: Entry; snippet: string }[] = [];
  for (const e of entries) {
    const text = fullText(e), i = fold(text).indexOf(s);
    if (i < 0) continue;
    const a = Math.max(0, i - 40), b = Math.min(text.length, i + s.length + 60);
    res.push({ e, snippet: (a ? '…' : '') + text.slice(a, b) + (b < text.length ? '…' : '') });
    if (res.length >= limit) break;
  }
  return res;
}
