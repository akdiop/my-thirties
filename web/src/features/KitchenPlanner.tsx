import { useMemo, useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';
import { consolidateIngredients } from '../lib/groceries';

const iso = (date: Date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
const startOfWeek = (date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};
const add = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const read = (e: Entry, key: string) => typeof e.data[key] === 'string' ? e.data[key] as string : '';

export function KitchenPlanner({ entries, onCreate, onGenerate }: {
  entries: Entry[];
  onCreate: (input: EntryInput) => Promise<void>;
  onGenerate: (title: string, items: string[]) => Promise<void>;
}) {
  const recipes = entries.filter((e) => e.kind === 'recipe');
  const meals = entries.filter((e) => e.kind === 'meal');
  const [week, setWeek] = useState(() => iso(startOfWeek(new Date())));
  const [day, setDay] = useState(() => iso(new Date()));
  const [recipeId, setRecipeId] = useState('');
  const [slot, setSlot] = useState('Déjeuner');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => add(new Date(week + 'T12:00:00'), i)), [week]);
  const weekMeals = meals.filter((m) => m.entry_date && m.entry_date >= iso(weekDays[0]!) && m.entry_date <= iso(weekDays[6]!));
  const create = async () => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe || !day) return;
    setBusy(true); setMessage('');
    try {
      await onCreate({ module: 'cuisine', kind: 'meal', title: slot + ' · ' + recipe.title,
        entry_date: day, data: { date: day, recipe: recipe.title, recipeId, slot } });
      setMessage('Repas ajouté au calendrier.');
    } catch { setMessage('Impossible de planifier ce repas.'); } finally { setBusy(false); }
  };
  const shopping = async () => {
    const ids = [...new Set(weekMeals.map((m) => read(m, 'recipeId')).filter(Boolean))];
    const sources = ids.map((id) => recipes.find((r) => r.id === id)).filter((r): r is Entry => Boolean(r))
      .map((r) => ({ lines: read(r, 'ingredients'), multiplier: weekMeals.filter((m) => read(m, 'recipeId') === r.id).length }));
    const items = consolidateIngredients(sources);
    if (!items.length) { setMessage('Ajoute des recettes avec des ingrédients quantifiés pour préparer les courses.'); return; }
    setBusy(true); setMessage('');
    try { await onGenerate('Courses · semaine du ' + week, items); }
    catch { setMessage('Impossible de créer la liste.'); } finally { setBusy(false); }
  };
  return <section className="tool-card">
    <div className="section-row"><h3>Mes repas de la semaine</h3>
      <div className="button-group"><button className="button ghost" onClick={() => setWeek(iso(add(new Date(week + 'T12:00:00'), -7)))}>‹</button>
        <button className="button ghost" onClick={() => setWeek(iso(startOfWeek(new Date())))}>Cette semaine</button>
        <button className="button ghost" onClick={() => setWeek(iso(add(new Date(week + 'T12:00:00'), 7)))}>›</button></div>
    </div>
    <div className="meal-week">{weekDays.map((d) => {
      const date = iso(d);
      const scheduled = weekMeals.filter((m) => m.entry_date === date);
      return <div key={date} className="meal-day"><strong>{d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}</strong>
        {scheduled.map((m) => <p key={m.id}>{m.title}</p>)}{!scheduled.length && <small>Libre</small>}</div>;
    })}</div>
    {recipes.length ? <div className="planner-form">
      <label>Jour<input type="date" value={day} onChange={(e) => setDay(e.target.value)} /></label>
      <label>Moment<select value={slot} onChange={(e) => setSlot(e.target.value)}><option>Petit-déjeuner</option><option>Déjeuner</option><option>Dîner</option><option>Collation</option></select></label>
      <label>Recette<select value={recipeId} onChange={(e) => setRecipeId(e.target.value)}>
        <option value="">Choisir une recette</option>{recipes.map((r) => <option value={r.id} key={r.id}>{r.title}</option>)}</select></label>
      <button className="button secondary" disabled={busy || !recipeId} onClick={() => void create()}>Planifier</button>
    </div> : <p className="muted">Crée d'abord une recette pour planifier tes repas.</p>}
    <button className="button ghost" disabled={busy || !weekMeals.length} onClick={() => void shopping()}>Courses pour cette semaine</button>
    <p className="fineprint">La liste regroupe les ingrédients des recettes planifiées. Les quantités sont multipliées par le nombre de repas, sans supposer le nombre de portions consommées : ajuste-les avant les courses.</p>
    {message && <p role="status">{message}</p>}
  </section>;
}
