import { useState } from 'react';
import type { Entry } from '../lib/cloud';

const numberOfMonths = (e: Entry) => String(e.data.duration || '').startsWith('12') ? 12 : 6;
const stages = [
  'Explorer le sujet et choisir des ressources',
  'Apprendre les bases à ton rythme',
  'Pratiquer avec un premier petit projet',
  'Approfondir une technique',
  'Créer un projet personnel',
  'Faire le bilan et célébrer les acquis',
];

export function PassionPath({ entries, onUpdate }: {
  entries: Entry[];
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  const hobbies = entries.filter((e) => e.kind === 'hobby');
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!hobbies.length) return <section className="tool-card"><h3>Mon parcours d'apprentissage</h3>
    <p className="muted">Crée un hobby pour construire un parcours sur six ou douze mois.</p></section>;
  const entry = hobbies.find((e) => e.id === selected) ?? hobbies[0]!;
  const months = numberOfMonths(entry);
  const milestones = entry.data.milestones && typeof entry.data.milestones === 'object'
    ? entry.data.milestones as Record<string, { title?: string; completed?: boolean; notes?: string }> : {};
  const completed = Array.from({ length: months }, (_, i) => milestones[String(i + 1)]?.completed).filter(Boolean).length;
  const save = async (month: number, patch: { title?: string; completed?: boolean; notes?: string }) => {
    setBusy(true); setError('');
    try { await onUpdate(entry, { ...entry.data, milestones: {
      ...milestones, [month]: { ...milestones[String(month)], ...patch },
    } }); } catch { setError('Modification impossible.'); } finally { setBusy(false); }
  };
  return <section className="tool-card">
    <h3>Mon parcours d'apprentissage</h3>
    <label>Mon hobby<select value={entry.id} onChange={(e) => { setSelected(e.target.value); }}>
      {hobbies.map((h) => <option key={h.id} value={h.id}>{h.title}</option>)}</select></label>
    <p className="muted">{months} mois · {completed} étape(s) cochée(s). Les étapes sont personnalisables.</p>
    <div className="progress-track"><div style={{ width: (completed / months * 100) + '%' }} /></div>
    <div className="path-grid">{Array.from({ length: months }, (_, i) => {
      const month = i + 1, stage = milestones[String(month)];
      const title = stage?.title || stages[i % stages.length]!;
      return <div className="path-month" key={month}>
        <label className="checklist-item"><input type="checkbox" checked={stage?.completed === true} disabled={busy}
          onChange={(e) => void save(month, { completed: e.target.checked })} />
          <span><strong>Mois {month}</strong> · {title}</span></label>
        <MonthEditor key={entry.id + '-' + month} month={month} suggestion={stages[i % stages.length]!}
          title={stage?.title || ''} notes={stage?.notes || ''} busy={busy} onSave={save} />
      </div>;
    })}</div>
    {error && <p className="error" role="alert">{error}</p>}
    <p className="fineprint">Suggestions générales : choisis tes propres ressources, adapte les objectifs et prends des pauses si nécessaire.</p>
  </section>;
}

function MonthEditor({ month, suggestion, title, notes, busy, onSave }: {
  month: number; suggestion: string; title: string; notes: string; busy: boolean;
  onSave: (month: number, patch: { title?: string; notes?: string }) => Promise<void>;
}) {
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftNotes, setDraftNotes] = useState(notes);
  return <details><summary>Personnaliser / notes</summary>
    <label>Objectif du mois<input maxLength={180} value={draftTitle} placeholder={suggestion}
      onChange={(e) => setDraftTitle(e.target.value)} /></label>
    <button className="button ghost" disabled={busy} onClick={() => void onSave(month, { title: draftTitle.trim() })}>Enregistrer l'objectif</button>
    <label>Mes notes<textarea rows={2} value={draftNotes} onChange={(e) => setDraftNotes(e.target.value)} /></label>
    <button className="button ghost" disabled={busy} onClick={() => void onSave(month, { notes: draftNotes })}>Enregistrer les notes</button>
  </details>;
}
