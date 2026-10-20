import { addMonths, addDays, type ISODate } from '@/agenda/dates';

export type Currency = 'XOF' | 'EUR' | 'USD';

export const CURRENCIES: Currency[] = ['XOF', 'EUR', 'USD'];

export const DECIMALS: Record<Currency, number> = { XOF: 0, EUR: 2, USD: 2 };

export const XOF_PER_EUR = 655.957;

export type Rates = { usdPerEur: number | null; date: string | null };

export const toMinor = (amount: number, currency: Currency) => Math.round(amount * 10 ** DECIMALS[currency]);

export const fromMinor = (minor: number, currency: Currency) => minor / 10 ** DECIMALS[currency];

export function parseAmount(input: string, currency: Currency): number | null {
  const cleaned = input.replace(/\s| | /g, '').replace(',', '.');
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (DECIMALS[currency] === 0 && !Number.isInteger(value)) return null;
  return toMinor(value, currency);
}

function eurValue(amount: number, currency: Currency, rates: Rates) {
  if (currency === 'EUR') return amount;
  if (currency === 'XOF') return amount / XOF_PER_EUR;
  return rates.usdPerEur ? amount / rates.usdPerEur : null;
}

export function convertMinor(minor: number, from: Currency, to: Currency, rates: Rates): number | null {
  if (from === to) return minor;
  const eur = eurValue(fromMinor(minor, from), from, rates);
  if (eur === null) return null;
  const target = to === 'EUR' ? eur : to === 'XOF' ? eur * XOF_PER_EUR : rates.usdPerEur ? eur * rates.usdPerEur : null;
  return target === null ? null : toMinor(target, to);
}

export function formatMoney(minor: number, currency: Currency) {
  const value = fromMinor(minor, currency);
  const text = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: DECIMALS[currency], maximumFractionDigits: DECIMALS[currency] }).format(value);
  return `${text.replace(/ | /g, ' ')} ${currency}`;
}

export const EXPENSE_CATEGORIES = ['Logement', 'Transport', 'Alimentation', 'Santé', 'Shopping', 'Loisirs', 'Voyages', 'Abonnements', 'Famille', 'Autres'] as const;
export const INCOME_CATEGORIES = ['Salaire', 'Revenus complémentaires', 'Revenus ponctuels', 'Autres'] as const;

export type TxLike = { date: string; kind: 'income' | 'expense'; amountMinor: number; currency: Currency; category: string };

export function monthSummary(txs: TxLike[], month: string, target: Currency, rates: Rates) {
  let income = 0;
  let expense = 0;
  let unconverted = 0;
  const byCategory = new Map<string, number>();
  for (const t of txs) {
    if (!t.date.startsWith(month)) continue;
    const v = convertMinor(t.amountMinor, t.currency, target, rates);
    if (v === null) {
      unconverted++;
      continue;
    }
    if (t.kind === 'income') income += v;
    else {
      expense += v;
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + v);
    }
  }
  const categories = [...byCategory.entries()].map(([name, total]) => ({ name, total, share: expense ? total / expense : 0 })).sort((a, b) => b.total - a.total);
  return { income, expense, balance: income - expense, categories, unconverted };
}

export type Frequency = 'weekly' | 'monthly' | 'yearly';

export const FREQUENCY_LABEL: Record<Frequency, string> = { weekly: 'Hebdomadaire', monthly: 'Mensuel', yearly: 'Annuel' };

export function nextDue(date: ISODate, frequency: Frequency) {
  return frequency === 'weekly' ? addDays(date, 7) : frequency === 'monthly' ? addMonths(date, 1) : addMonths(date, 12);
}

export function rollForward(date: ISODate, frequency: Frequency, today: ISODate) {
  let d = date;
  while (d < today) d = nextDue(d, frequency);
  return d;
}

export const monthlyCost = (amountMinor: number, frequency: Frequency) =>
  frequency === 'monthly' ? amountMinor : frequency === 'yearly' ? Math.round(amountMinor / 12) : Math.round((amountMinor * 52) / 12);

export function goalProgress(savedMinor: number, targetMinor: number) {
  return targetMinor > 0 ? Math.min(1, savedMinor / targetMinor) : 0;
}
