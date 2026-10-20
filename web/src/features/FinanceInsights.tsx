import { useMemo, useState } from 'react';
import type { Entry } from '../lib/cloud';

const num = (v: unknown) => typeof v === 'number' || typeof v === 'string' ? Number(v) : NaN;
const currency = (e: Entry) => typeof e.data.currency === 'string' ? e.data.currency : 'XOF';
const format = (n: number, c: string) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: c === 'XOF' ? 0 : 2 }).format(n) + ' ' + c;
const currentMonth = () => new Date().toLocaleDateString('en-CA').slice(0, 7);

export function FinanceInsights({ entries }: { entries: Entry[] }) {
  const [month, setMonth] = useState(currentMonth);
  const [selectedCurrency, setSelectedCurrency] = useState('XOF');
  const summary = useMemo(() => {
    const income = entries.filter((e) => e.kind === 'income' && e.entry_date?.startsWith(month) && currency(e) === selectedCurrency);
    const expense = entries.filter((e) => e.kind === 'expense' && e.entry_date?.startsWith(month) && currency(e) === selectedCurrency);
    const total = (items: Entry[]) => items.reduce((sum, e) => sum + (Number.isFinite(num(e.data.amount)) ? Math.max(0, num(e.data.amount)) : 0), 0);
    const spending = total(expense);
    const categories = new Map<string, number>();
    for (const e of expense) {
      const key = String(e.data.category || 'Autres');
      categories.set(key, (categories.get(key) ?? 0) + Math.max(0, Number.isFinite(num(e.data.amount)) ? num(e.data.amount) : 0));
    }
    const budgets = entries.filter((e) => e.kind === 'budget' && currency(e) === selectedCurrency &&
      String(e.data.month || '').trim() === month);
    const goals = entries.filter((e) => e.kind === 'goal' && currency(e) === selectedCurrency);
    const subscriptions = entries.filter((e) => e.kind === 'subscription' && currency(e) === selectedCurrency);
    return { income: total(income), spending, categories: [...categories].sort((a, b) => b[1] - a[1]),
      budgets, goals, subscriptions };
  }, [entries, month, selectedCurrency]);
  return <section className="finance-insights">
    <div className="finance-filters"><label>Mois<input type="month" value={month} onChange={(e) => setMonth(e.target.value)} /></label>
      <label>Devise<select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
        {['XOF', 'EUR', 'USD'].map((c) => <option key={c}>{c}</option>)}</select></label></div>
    <div className="finance-stats">
      <div><span>Revenus</span><strong>{format(summary.income, selectedCurrency)}</strong></div>
      <div><span>Dépenses</span><strong>{format(summary.spending, selectedCurrency)}</strong></div>
      <div><span>Solde du mois</span><strong>{format(summary.income - summary.spending, selectedCurrency)}</strong></div>
    </div>
    {summary.categories.length > 0 && <div className="tool-card"><h3>Répartition des dépenses</h3>
      {summary.categories.map(([category, amount]) => <div key={category} className="finance-category">
        <div><span>{category}</span><strong>{format(amount, selectedCurrency)}</strong></div>
        <div className="progress-track"><div style={{ width: (summary.spending ? 100 * amount / summary.spending : 0) + '%' }} /></div>
      </div>)}</div>}
    {summary.budgets.length > 0 && <div className="tool-card"><h3>Mes budgets</h3>
      {summary.budgets.map((e) => {
        const cap = num(e.data.amount), cat = String(e.data.category || '').trim();
        const used = cat ? summary.categories.find(([key]) => key.toLowerCase() === cat.toLowerCase())?.[1] ?? 0 : summary.spending;
        return <div key={e.id} className="finance-category"><div><span>{e.title}</span><strong>{format(used, selectedCurrency)} / {format(cap, selectedCurrency)}</strong></div>
          <div className="progress-track"><div style={{ width: Math.min(100, cap > 0 ? used / cap * 100 : 0) + '%' }} /></div></div>;
      })}</div>}
    {summary.goals.length > 0 && <div className="tool-card"><h3>Objectifs d'épargne</h3>{summary.goals.map((e) => {
      const target = num(e.data.amount), saved = num(e.data.saved);
      return <div key={e.id} className="finance-category"><div><span>{e.title}</span><strong>{format(Number.isFinite(saved) ? saved : 0, selectedCurrency)} / {format(target, selectedCurrency)}</strong></div>
        <div className="progress-track"><div style={{ width: Math.min(100, target > 0 && Number.isFinite(saved) ? saved / target * 100 : 0) + '%' }} /></div></div>;
    })}</div>}
    {summary.subscriptions.length > 0 && <div className="tool-card"><h3>Abonnements</h3>{summary.subscriptions.map((e) =>
      <p key={e.id} className="subscription-row"><span>{e.title}</span><strong>{format(num(e.data.amount), selectedCurrency)} · {String(e.data.frequency || 'Période non définie')}</strong></p>)}</div>}
    <p className="fineprint">Les montants sont indicatifs et séparés par devise. Aucun taux de change ou conseil financier n'est généré automatiquement.</p>
  </section>;
}
