import { useState } from 'react';
import { Receipt, Repeat } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { EXPENSE_CATEGORIES } from '../modules';
import { str, todayIso } from '../lib/day';
import { amountOf, BUDGETS_KIND, categoryBudgets, currencyOf, fmt, limitsOf, mainCurrency, monthReport, num, XOF_PER_EUR } from '../lib/money';
import { Bar, Segmented, SectionTitle } from '../ui/kit';
import { MoneyLink } from '../features/MoneyLink';

const CURRENCIES = ['XOF', 'EUR', 'USD'] as const;

function Donut({ parts, total, currency }: { parts: { share: number; color: string }[]; total: number; currency: string }) {
  const r = 60, c = 2 * Math.PI * r;
  let acc = 0;
  return <div className="donut">
    <svg viewBox="0 0 150 150" width="150" height="150" aria-hidden="true">
      <circle cx="75" cy="75" r={r} fill="none" stroke="#EFE3DE" strokeWidth="18" />
      {parts.map((p, i) => { const len = p.share * c; const el = <circle key={i} cx="75" cy="75" r={r} fill="none" stroke={p.color} strokeWidth="18"
        strokeDasharray={`${Math.max(0, len - 2)} ${c}`} strokeDashoffset={-acc} transform="rotate(-90 75 75)" />; acc += len; return el; })}
    </svg>
    <div className="donut-center"><strong>{fmt(total, currency).replace(' ' + currency, '')}</strong><small>{currency} dépensés</small></div>
  </div>;
}

export function FinanceTop({ entries, onAdd, onOpen, onUpdate, onCreate }: { entries: Entry[]; onAdd: (kind: string) => void; onOpen: (e: Entry) => void; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; onCreate: (i: EntryInput) => Promise<void> }) {
  const recurring = entries.filter((e) => e.kind === 'recurring').sort((a, b) => (num(a.data.day) || 1) - (num(b.data.day) || 1));
  const save = async () => { if (!goal) return; const v = window.prompt('Combien veux-tu ajouter à ton épargne ? (' + currencyOf(goal) + ')'); const n = Number(String(v ?? '').replace(/[^\d.,]/g, '').replace(',', '.')); if (n > 0) await onUpdate(goal, { ...goal.data, saved: (num(goal.data.saved) || 0) + n }); };
  const [currency, setCurrency] = useState<string>(() => mainCurrency(entries));
  const [month, setMonth] = useState(todayIso().slice(0, 7));
  const [list, setList] = useState<'expense' | 'income'>('expense');
  const r = monthReport(entries, month, currency);
  const goal = entries.filter((e) => e.kind === 'goal' && currencyOf(e) === currency)[0];
  const goalShare = goal && amountOf(goal) ? Math.min(1, (num(goal.data.saved) || 0) / amountOf(goal)) : null;
  const subs = entries.filter((e) => e.kind === 'subscription').sort((a, b) => str(a, 'nextDate').localeCompare(str(b, 'nextDate'))).slice(0, 4);
  const rows = entries.filter((e) => e.kind === list && e.entry_date?.startsWith(month) && currencyOf(e) === currency).sort((a, b) => b.entry_date!.localeCompare(a.entry_date!));
  const [y, m] = month.split('-').map(Number) as [number, number];
  const label = new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const shift = (d: number) => { const n = new Date(y, m - 1 + d, 1); setMonth(`${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`); };
  const eurOfLeft = r.left !== null && currency === 'XOF' ? r.left / XOF_PER_EUR : null;

  return <div className="module-top">
    <div className="title-row">
      <div className="month-nav"><button onClick={() => shift(-1)} aria-label="Mois précédent">‹</button>{label.charAt(0).toUpperCase() + label.slice(1)}<button onClick={() => shift(1)} aria-label="Mois suivant">›</button></div>
      <div className="currency-switch">{CURRENCIES.map((c) => <button key={c} className={c === currency ? 'on' : ''} onClick={() => setCurrency(c)}>{c}</button>)}</div>
    </div>
    <div className="donut-row">
      <Donut parts={r.categories} total={r.spent} currency={currency} />
      <div className="donut-legend">{r.categories.length ? r.categories.slice(0, 6).map((c) => <div key={c.name}><i style={{ background: c.color }} /><span>{c.name}</span><small>{Math.round(c.share * 100)} %</small></div>)
        : <p className="muted">Aucune dépense ce mois-ci.</p>}</div>
    </div>
    <div className="two-cards">
      <div className="mini-card sauge"><span>Budget restant</span><strong>{r.left !== null ? fmt(r.left, currency) : '—'}</strong>
        <small>{eurOfLeft !== null ? `≈ ${fmt(eurOfLeft, 'EUR')} (parité fixe)` : r.left === null ? 'Ajoute un budget mensuel' : `Revenus : ${fmt(r.income, currency)}`}</small></div>
      <div className="mini-card sable"><span>Épargne{goal ? ' · ' + goal.title : ''}</span><strong>{goalShare !== null ? Math.round(goalShare * 100) + ' %' : '—'}</strong>
        {goalShare !== null ? <><div className="mini-bar"><div style={{ width: goalShare * 100 + '%' }} /></div>
          <small>{fmt(num(goal!.data.saved) || 0, currencyOf(goal!))} sur {fmt(amountOf(goal!), currencyOf(goal!))}</small>
          <button className="link-btn small" onClick={() => void save()}>+ Épargner</button></>
          : <button className="link-btn small" onClick={() => onAdd('goal')}>+ Créer un objectif d’épargne</button>}</div>
    </div>
    <CategoryBudgets entries={entries} month={month} currency={currency} onCreate={onCreate} onUpdate={onUpdate} />
    <SectionTitle action="Ajouter" onAction={() => onAdd('recurring')}>Dépenses récurrentes</SectionTitle>
    <div className="line-list">{recurring.length ? recurring.map((s) => <button key={s.id} className="line-row" onClick={() => onOpen(s)}>
      <span className="line-icon"><Repeat size={17} /></span>
      <span className="line-text"><strong>{s.title}</strong><small>le {num(s.data.day) || 1} de chaque mois · ajoutée automatiquement</small></span>
      <span className="line-amount">{fmt(amountOf(s), currencyOf(s))}</span></button>)
      : <p className="muted">Loyer, transport, tontine… Ajoute-les une fois : elles seront comptées chaque mois automatiquement.</p>}</div>
    <SectionTitle action="Abonnements" onAction={() => onAdd('subscription')}>Prochains prélèvements</SectionTitle>
    <div className="line-list">{subs.length ? subs.map((s) => <button key={s.id} className="line-row" onClick={() => onOpen(s)}>
      <span className="line-icon"><Repeat size={17} /></span>
      <span className="line-text"><strong>{s.title}</strong><small>{(str(s, 'frequency') || 'Mensuelle').toLowerCase()}{str(s, 'nextDate') ? ' · ' + new Date(str(s, 'nextDate') + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}</small></span>
      <span className="line-amount">{fmt(amountOf(s), currencyOf(s))}</span></button>) : <p className="muted">Aucun abonnement suivi.</p>}</div>
    <Segmented label="Opérations" value={list} onChange={setList} options={[{ value: 'expense', label: 'Dépenses' }, { value: 'income', label: 'Revenus' }]} />
    <div className="line-list">{rows.length ? rows.slice(0, 12).map((e) => <button key={e.id} className="line-row" onClick={() => onOpen(e)}>
      <span className="line-icon"><Receipt size={17} /></span>
      <span className="line-text"><strong>{e.title}</strong><small>{new Date(e.entry_date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}{str(e, 'category') ? ' · ' + str(e, 'category') : ''}</small></span>
      <span className={'line-amount' + (list === 'income' ? ' plus' : '')}>{list === 'expense' ? '−' : '+'}{fmt(amountOf(e), currency)}</span></button>)
      : <p className="muted">Rien ce mois-ci.</p>}</div>
    <button className="big-btn" onClick={() => onAdd(list)}>+ Ajouter {list === 'expense' ? 'une dépense' : 'un revenu'}</button>
    <MoneyLink />
  </div>;
}

/** Budgets par catégorie : un plafond mensuel par catégorie et une alerte douce à 80 %. */
function CategoryBudgets({ entries, month, currency, onCreate, onUpdate }: { entries: Entry[]; month: string; currency: string;
  onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> }) {
  const rows = categoryBudgets(entries, month, currency);
  const limits = limitsOf(entries);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const open = () => { setDraft(Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, limits[currency]?.[c] ? String(limits[currency]![c]) : '']))); setEditing(true); };
  const save = async () => {
    const mine = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, Number(v.replace(/\s/g, '').replace(',', '.')) || 0]).filter(([, v]) => Number(v) > 0));
    const next = { ...limits, [currency]: mine }, cfg = entries.find((e) => e.kind === BUDGETS_KIND);
    await (cfg ? onUpdate(cfg, { ...cfg.data, limits: next }) : onCreate({ module: 'finances', kind: BUDGETS_KIND, title: 'Budgets par catégorie', entry_date: null, data: { limits: next } }));
    setEditing(false);
  };
  return <>
    <SectionTitle action={editing ? undefined : rows.length ? 'Modifier' : 'Définir'} onAction={editing ? undefined : open}>Budgets par catégorie</SectionTitle>
    {editing ? <div className="soft-card budget-edit">
      <p className="muted small">Plafond mensuel en {currency}. Laisse vide pour ne pas suivre une catégorie.</p>
      {EXPENSE_CATEGORIES.map((c) => <label key={c} className="budget-line"><span>{c}</span>
        <input type="text" inputMode="decimal" placeholder="—" value={draft[c] ?? ''} onChange={(e) => setDraft({ ...draft, [c]: e.target.value })} /></label>)}
      <div className="button-group"><button className="button primary" onClick={() => void save()}>Enregistrer</button><button className="button ghost" onClick={() => setEditing(false)}>Annuler</button></div>
    </div> : rows.length ? <div className="soft-card budget-list">{rows.map((b) => <div key={b.name} className={'budget-row' + (b.share >= 1 ? ' over' : b.share >= 0.8 ? ' near' : '')}>
      <div className="budget-head"><strong>{b.name}</strong><small>{fmt(b.spent, currency)} / {fmt(b.limit, currency)}</small></div>
      <Bar value={b.share} tone={b.share >= 0.8 ? 'caramel' : 'sauge'} />
      {b.share >= 1 ? <small className="budget-note">Plafond dépassé de {fmt(b.spent - b.limit, currency)}</small>
        : b.share >= 0.8 ? <small className="budget-note">Plus que {fmt(b.limit - b.spent, currency)} ce mois-ci</small> : null}
    </div>)}</div> : <p className="muted">Fixe un plafond pour les catégories que tu veux surveiller (shopping, sorties…).</p>}
  </>;
}
