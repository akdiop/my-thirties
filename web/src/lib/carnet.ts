/** Mon carnet de vœux : une page par mois (pensées, mot du mois, humeur) et des souhaits suivis dans le temps (signes, personnes, réalisés). */
import type { Entry } from './cloud';
import { writingWindow, type CarnetSettings } from '../../supabase/functions/push-reminders/carnet';

export const CARNET_PAGE = 'carnet_page';
export const VOEU = 'voeu';
export const CARNET_SETTINGS = 'carnet_reglages';
export const TAGS = ['Moi', 'Famille', 'Travail', 'Foi', 'Santé', 'Argent'] as const;
export type Tag = (typeof TAGS)[number];
export type Sign = { d: string; t: string };
export type Person = { d: string; n: string };
export type Wish = { entry: Entry; text: string; tag: Tag | ''; done: boolean; realisedOn: string; month: string; signs: Sign[]; people: Person[]; duaId: string };

const arr = <T>(v: unknown) => (Array.isArray(v) ? v as T[] : []);
export const monthOf = (iso: string) => iso.slice(0, 7);
export const monthLabel = (month: string) => new Date(month + '-01T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

export function wishOf(entry: Entry): Wish {
  const d = entry.data;
  return { entry, text: entry.title, tag: (TAGS as readonly string[]).includes(String(d.tag)) ? d.tag as Tag : '', done: d.status === 'realise',
    realisedOn: String(d.realisedOn ?? ''), month: String(d.month ?? entry.entry_date ?? '').slice(0, 7),
    signs: arr<Sign>(d.signs).filter((s) => s && s.t), people: arr<Person>(d.people).filter((p) => p && p.n), duaId: String(d.duaId ?? '') };
}
export const wishes = (entries: Entry[]) => entries.filter((e) => e.kind === VOEU).map(wishOf).sort((a, b) => b.month.localeCompare(a.month) || a.text.localeCompare(b.text));
export const pageOf = (entries: Entry[], month: string) => entries.find((e) => e.kind === CARNET_PAGE && e.data.month === month);
export const settingsOf = (entries: Entry[]) => (entries.find((e) => e.kind === CARNET_SETTINGS)?.data ?? {}) as CarnetSettings;

/** Fenêtre d'écriture du mois, d'après les débuts de règles notés (ou le jour choisi). */
export function carnetWindow(entries: Entry[], today: string) {
  const starts = entries.filter((e) => e.kind === 'cycle' && e.entry_date).map((e) => e.entry_date!);
  return writingWindow(starts, settingsOf(entries), today);
}

/** Mot du mois en cours, s'il a été choisi. */
export const wordOfMonth = (entries: Entry[], today: string) => String(pageOf(entries, monthOf(today))?.data.word ?? '').trim();

/** Le chemin, mois par mois : la page, les souhaits posés, les signes notés et les souhaits réalisés ce mois-là. */
export function pathByMonth(entries: Entry[], year?: string) {
  const all = wishes(entries);
  const months = new Set<string>([...entries.filter((e) => e.kind === CARNET_PAGE).map((e) => String(e.data.month)),
    ...all.map((w) => w.month), ...all.flatMap((w) => [...w.signs.map((s) => monthOf(s.d)), ...(w.done && w.realisedOn ? [monthOf(w.realisedOn)] : [])])]);
  return [...months].filter((m) => /^\d{4}-\d{2}$/.test(m) && (!year || m.startsWith(year))).sort().reverse().map((month) => ({
    month, page: pageOf(entries, month),
    posed: all.filter((w) => w.month === month),
    signs: all.flatMap((w) => w.signs.filter((s) => monthOf(s.d) === month).map((s) => ({ ...s, wish: w.text }))),
    realised: all.filter((w) => w.done && monthOf(w.realisedOn) === month),
  }));
}

/** Répartition des souhaits par étiquette (sans étiquette à part). */
export function tagCounts(list: Wish[]) {
  return TAGS.map((tag) => ({ tag, total: list.filter((w) => w.tag === tag).length, done: list.filter((w) => w.tag === tag && w.done).length })).filter((t) => t.total);
}

/** Souhaits réalisés entre deux dates incluses (bilan de la semaine, chiffres de l'année, il y a un an). */
export const realisedBetween = (entries: Entry[], from: string, to: string) => wishes(entries).filter((w) => w.done && w.realisedOn >= from && w.realisedOn <= to);
