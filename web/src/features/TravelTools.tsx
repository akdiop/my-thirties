import type { Entry } from '../lib/cloud';

export function TravelTools({ entries, onGenerate }: {
  entries: Entry[];
  onGenerate: (title: string, items: string[]) => Promise<void>;
}) {
  const trips = entries.filter((e) => e.kind === 'trip' && typeof e.data.packing === 'string' && e.data.packing.trim());
  if (!trips.length) return null;
  return <section className="tool-card">
    <h3>Préparer ma valise</h3>
    <p className="muted">Génère une checklist à partir des affaires notées pour ton voyage.</p>
    {trips.map((trip) => <div key={trip.id} className="travel-row">
      <span>{trip.title}</span>
      <button className="button secondary" onClick={() => void onGenerate('Valise · ' + trip.title,
        String(trip.data.packing).split('\n').map((x) => x.trim()).filter(Boolean))}>Créer ma liste</button>
    </div>)}
  </section>;
}
