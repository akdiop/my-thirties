import { useState } from 'react';
import { Check, ExternalLink, PiggyBank, Plus, Sparkles, Trash2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { EXPENSE_CATEGORIES } from '../modules';
import { fmt, mainCurrency } from '../lib/money';
import { Bar } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
export const WISH_KIND = 'envie';
const CURRENCIES = ['XOF', 'EUR', 'USD'];
const safeLink = (v: unknown) => (typeof v === 'string' && /^https:\/\/[^\s]+$/i.test(v) ? v : '');

/** Mes envies : ce que je veux m'offrir, avec une jauge d'épargne pour chacune. */
export function Wishes({ entries, onCreate, onUpdate, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const all = entries.filter((e) => e.kind === WISH_KIND);
  const open = all.filter((e) => !e.data.bought), done = all.filter((e) => e.data.bought);
  const [adding, setAdding] = useState(!all.length);
  const [title, setTitle] = useState(''), [price, setPrice] = useState(''), [currency, setCurrency] = useState(() => mainCurrency(entries)), [link, setLink] = useState(''), [category, setCategory] = useState('Shopping');
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const totalLeft = open.filter((e) => e.data.currency === currency).reduce((s, e) => s + Math.max(0, Number(e.data.price) - Number(e.data.saved || 0)), 0);

  const add = async () => {
    await onCreate({ module: 'finances', kind: WISH_KIND, title: title.trim().slice(0, 120), entry_date: null,
      data: { price: Number(price) || 0, currency, saved: 0, link: safeLink(link.trim()), category } });
    setTitle(''); setPrice(''); setLink(''); setAdding(false);
  };
  const putAside = (e: Entry) => { const n = Number(amounts[e.id]); if (!(n > 0)) return; void onUpdate(e, { ...e.data, saved: Number(e.data.saved || 0) + n }); setAmounts((a) => ({ ...a, [e.id]: '' })); };
  const bought = async (e: Entry) => {
    const asExpense = Number(e.data.price) > 0 && confirm('Bravo ! Ajouter aussi « ' + e.title + ' » à tes dépenses du jour (' + fmt(Number(e.data.price), String(e.data.currency)) + ') ?');
    if (asExpense) await onCreate({ module: 'finances', kind: 'expense', title: e.title, entry_date: isoOf(new Date()), data: { date: isoOf(new Date()), amount: Number(e.data.price), currency: e.data.currency, category: e.data.category || 'Shopping', note: 'Une envie réalisée' } });
    await onUpdate(e, { ...e.data, bought: isoOf(new Date()) });
  };

  return <div className="screen wishes">
    <header className="tab-head"><h1>Mes envies</h1><p>{open.length ? open.length + ' envie' + (open.length > 1 ? 's' : '') + (totalLeft ? ' · encore ' + fmt(totalLeft, currency) + ' à mettre de côté' : '') : 'Ce que j’ai envie de m’offrir'}</p></header>
    <img className="screen-cover" src="/modules/envies.webp" alt="Sac, parfum et vêtements" loading="lazy" />
    <div className="stack-8">{open.map((e) => {
      const p = Number(e.data.price) || 0, s = Number(e.data.saved) || 0, cur = String(e.data.currency || 'XOF'), url = safeLink(e.data.link);
      return <article key={e.id} className="wish-card">
        <div className="goal-head"><div><strong>{e.title}</strong><small className="muted">{p ? fmt(p, cur) : 'Prix à définir'}{e.data.category ? ' · ' + String(e.data.category) : ''}</small></div>
          <button className="icon-btn" aria-label={'Supprimer ' + e.title} onClick={() => { if (confirm('Supprimer « ' + e.title + ' » ?')) void onRemove(e); }}><Trash2 size={16} /></button></div>
        {p > 0 && <><Bar value={Math.min(1, s / p)} tone="caramel" /><small className="muted">{fmt(s, cur)} de côté{s >= p ? ' · c’est prêt !' : ' · reste ' + fmt(p - s, cur)}</small></>}
        <div className="chip-other">
          <input inputMode="decimal" placeholder="Montant" value={amounts[e.id] ?? ''} onChange={(ev) => setAmounts((a) => ({ ...a, [e.id]: ev.target.value.replace(',', '.').replace(/[^\d.]/g, '') }))} />
          <button className="button secondary" disabled={!(Number(amounts[e.id]) > 0)} onClick={() => putAside(e)}><PiggyBank size={16} /> Mettre de côté</button>
        </div>
        <div className="button-group">
          <button className="button ghost small" onClick={() => void bought(e)}><Check size={14} /> Je me l’offre</button>
          {url && <a className="link-btn small" href={url} target="_blank" rel="noreferrer noopener"><ExternalLink size={14} /> Voir</a>}
        </div>
      </article>; })}</div>

    {adding ? <section className="ritual-card form-stack">
      <p className="ritual-label">Nouvelle envie</p>
      <label>Quoi ?<input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="Un sac, un week-end à Saly, des cours de padel…" /></label>
      <div className="two-inputs">
        <label>Prix<input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(',', '.').replace(/[^\d.]/g, ''))} /></label>
        <label>Devise<select value={currency} onChange={(e) => setCurrency(e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></label>
      </div>
      <label>Catégorie<select value={category} onChange={(e) => setCategory(e.target.value)}>{EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
      <label>Lien (facultatif)<input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" /></label>
      <div className="button-group"><button className="button primary" disabled={!title.trim()} onClick={() => void add()}>Ajouter</button>
        {all.length > 0 && <button className="button ghost" onClick={() => setAdding(false)}>Annuler</button>}</div>
    </section> : <button className="button secondary wide" onClick={() => setAdding(true)}><Plus size={16} /> Ajouter une envie</button>}

    {done.length > 0 && <section><h3 className="habit-group"><Sparkles size={14} /> Envies réalisées</h3>
      {done.map((e) => <div key={e.id} className="goal-done"><Check size={16} /> <span>{e.title} · {new Date(String(e.data.bought) + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span></div>)}</section>}
  </div>;
}
