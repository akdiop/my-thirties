import { useState } from 'react';
import type { Entry } from '../lib/cloud';

const text = (e: Entry, field: string) => typeof e.data[field] === 'string' ? e.data[field] as string : '';
const money = (n: number, currency: string) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: currency === 'XOF' ? 0 : 2 }).format(n) + ' ' + currency;
const safe = (n: unknown) => typeof n === 'string' || typeof n === 'number' ? Number(n) : NaN;

export function TravelPlanner({ entries, onUpdate }: {
  entries: Entry[];
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  const trips = entries.filter((e) => e.kind === 'trip');
  const [chosen, setChosen] = useState('');
  const [newStep, setNewStep] = useState('');
  const [error, setError] = useState('');
  if (!trips.length) return <section className="tool-card"><h3>Mon prochain voyage</h3>
    <p className="muted">Ajoute un voyage pour organiser les préparatifs, le budget et l'itinéraire.</p></section>;
  const trip = trips.find((e) => e.id === chosen) ?? trips[0]!;
  const currency = text(trip, 'currency') || 'XOF';
  const budget = safe(trip.data.amount);
  const checklist = Array.isArray(trip.data.preparations) ? trip.data.preparations as { id: string; text: string; done: boolean }[] : [];
  const save = async (data: Record<string, unknown>) => {
    setError('');
    try { await onUpdate(trip, data); } catch { setError('Enregistrement impossible.'); }
  };
  const addStep = async () => {
    const label = newStep.trim().slice(0, 180);
    if (!label || checklist.length >= 100) return;
    await save({ ...trip.data, preparations: [...checklist, { id: crypto.randomUUID(), text: label, done: false }] });
    setNewStep('');
  };
  return <section className="tool-card">
    <h3>Mon prochain voyage</h3>
    <label>Voyage<select value={trip.id} onChange={(e) => { setChosen(e.target.value); setNewStep(''); }}>
      {trips.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></label>
    <div className="travel-summary">
      <div><span>Départ</span><strong>{trip.entry_date || 'À définir'}</strong></div>
      <div><span>Retour</span><strong>{text(trip, 'endDate') || 'À définir'}</strong></div>
      <div><span>Budget prévisionnel</span><strong>{Number.isFinite(budget) ? money(budget, currency) : 'À définir'}</strong></div>
    </div>
    {text(trip, 'itinerary') && <div className="travel-itinerary"><h4>Itinéraire envisagé</h4><p>{text(trip, 'itinerary')}</p></div>}
    <h4>Préparatifs</h4>
    <p className="muted">À adapter à la destination : documents, transport, hébergement, assurance et santé du voyage.</p>
    <div className="checklist">{checklist.map((item) => <div className="travel-check" key={item.id}>
      <label className="checklist-item"><input type="checkbox" checked={item.done} onChange={(e) => void save({
        ...trip.data, preparations: checklist.map((x) => x.id === item.id ? { ...x, done: e.target.checked } : x),
      })} /><span className={item.done ? 'checked' : ''}>{item.text}</span></label>
      <button className="icon-button" aria-label={'Retirer ' + item.text} onClick={() => void save({
        ...trip.data, preparations: checklist.filter((x) => x.id !== item.id),
      })}>×</button>
    </div>)}</div>
    <div className="planner-form"><label>Ajouter un préparatif<input maxLength={180} value={newStep} onChange={(e) => setNewStep(e.target.value)} placeholder="Ex. vérifier les formalités officielles" /></label>
      <button className="button secondary" disabled={!newStep.trim()} onClick={() => void addStep()}>Ajouter</button></div>
    {error && <p className="error" role="alert">{error}</p>}
  </section>;
}
