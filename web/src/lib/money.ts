import type { Entry } from './cloud';

export const num = (v: unknown) => (typeof v === 'number' || typeof v === 'string' ? Number(v) : NaN);
export const amountOf = (e: Entry) => { const n = num(e.data.amount); return Number.isFinite(n) && n > 0 ? n : 0; };
export const currencyOf = (e: Entry) => (typeof e.data.currency === 'string' && e.data.currency ? e.data.currency : 'XOF');
export const fmt = (n: number, c: string) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: c === 'XOF' ? 0 : 2 }).format(n).replace(/ | /g, ' ') + ' ' + c;
export const XOF_PER_EUR = 655.957;

export const CATEGORY_COLORS = ['#7E7254', '#A9B8A2', '#B5A27A', '#C7C0B0', '#5F7A59', '#C3BEB4', '#3A3833'];

/** Bilan du mois dans une devise : dépenses par catégorie, revenus, budget prévu et reste. */
export function monthReport(entries: Entry[], month: string, currency: string) {
  const inMonth = (e: Entry) => e.entry_date?.startsWith(month) && currencyOf(e) === currency;
  const expenses = entries.filter((e) => e.kind === 'expense' && inMonth(e));
  const income = entries.filter((e) => e.kind === 'income' && inMonth(e)).reduce((s, e) => s + amountOf(e), 0);
  const spent = expenses.reduce((s, e) => s + amountOf(e), 0);
  const cats = new Map<string, number>();
  for (const e of expenses) {
    const k = (typeof e.data.category === 'string' && e.data.category.trim()) || 'Autres';
    cats.set(k, (cats.get(k) ?? 0) + amountOf(e));
  }
  const categories = [...cats].sort((a, b) => b[1] - a[1]).map(([name, total], i) => ({ name, total, share: spent ? total / spent : 0, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length]! }));
  const budget = entries
    .filter((e) => e.kind === 'budget' && currencyOf(e) === currency && (!String(e.data.month || '').trim() || String(e.data.month).trim() === month))
    .reduce((s, e) => s + amountOf(e), 0);
  return { spent, income, categories, budget, left: budget ? budget - spent : null, expenses };
}

/** Devise la plus utilisée dans les dépenses, à défaut XOF. */
export function mainCurrency(entries: Entry[]) {
  const counts = new Map<string, number>();
  for (const e of entries) if (e.module === 'finances') counts.set(currencyOf(e), (counts.get(currencyOf(e)) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'XOF';
}

/** Plafonds par catégorie de dépense, par devise (une entrée de réglages). */
export const BUDGETS_KIND = 'budgets_categories';
export type CategoryLimits = Record<string, Record<string, number>>;
export const limitsOf = (entries: Entry[]): CategoryLimits => {
  const v = entries.find((e) => e.kind === BUDGETS_KIND)?.data.limits;
  return v && typeof v === 'object' ? v as CategoryLimits : {};
};

/** Dépenses du mois face au plafond de chaque catégorie, les plus avancées d'abord. */
export function categoryBudgets(entries: Entry[], month: string, currency: string) {
  const limits = limitsOf(entries)[currency] ?? {};
  const r = monthReport(entries, month, currency);
  return Object.entries(limits).filter(([, v]) => Number(v) > 0).map(([name, v]) => {
    const limit = Number(v), spent = r.categories.find((c) => c.name === name)?.total ?? 0;
    return { name, limit, spent, share: spent / limit };
  }).sort((a, b) => b.share - a.share);
}
