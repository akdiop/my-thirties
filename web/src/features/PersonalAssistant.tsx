import { useMemo, useState } from 'react';
import { cloud, type Entry } from '../lib/cloud';
import { useIntegrationPrefs } from '../lib/integrations';

const date = () => new Date().toLocaleDateString('en-CA');
const eligible = (entry: Entry) => entry.module === 'quotidien' && ['task', 'routine', 'event'].includes(entry.kind)
  && Boolean(entry.entry_date) && entry.entry_date! >= date();

export function PersonalAssistant({ entries }: { entries: Entry[] }) {
  const { prefs } = useIntegrationPrefs();
  const [message, setMessage] = useState('');
  const [allowContext, setAllowContext] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const choices = useMemo(() => entries.filter(eligible).sort((a, b) =>
    (a.entry_date || '').localeCompare(b.entry_date || '')).slice(0, 30), [entries]);
  const context = choices.filter((e) => selected.includes(e.id)).slice(0, 8)
    .map((e) => ({ date: e.entry_date, title: e.title.slice(0, 120),
      time: typeof e.data.time === 'string' ? e.data.time.slice(0, 5) : '' }));
  const ask = async () => {
    if (!cloud || !prefs.assistant || message.trim().length < 2) return;
    setBusy(true); setAnswer(''); setStatus('');
    try {
      const { data, error } = await cloud.functions.invoke('personal-assistant', {
        body: { message: message.trim(), agenda: allowContext ? context : [] },
      });
      if (error) throw error;
      if (!data || typeof data.answer !== 'string') throw new Error('Assistant non configuré.');
      setAnswer(data.answer);
    } catch { setStatus('Assistant indisponible pour le moment. Réessaie un peu plus tard.'); }
    finally { setBusy(false); }
  };
  return <section className="tool-card ai-assistant">
    <h3>Mon assistant IA</h3>
    {!prefs.assistant && <p className="privacy-hint">L'assistant est désactivé. Active-le dans Profil → Centre de confidentialité.</p>}
    <label>Ma question<textarea rows={3} maxLength={1200} value={message} onChange={(e) => { setMessage(e.target.value); }}
      placeholder="Par exemple : aide-moi à organiser les activités de ma semaine." /></label>
    <label className="checklist-item"><input type="checkbox" checked={allowContext} disabled={!prefs.assistant}
      onChange={(e) => { setAllowContext(e.target.checked); if (!e.target.checked) setSelected([]); }} />
      Ajouter des événements de mon agenda à la question</label>
    {allowContext && <div className="assistant-agenda-picker">
      <p className="fineprint">Uniquement les tâches, routines et événements futurs. Les rendez-vous de santé et les autres espaces sont exclus. Maximum 8 éléments.</p>
      {choices.length ? choices.map((entry) => <label key={entry.id} className="checklist-item">
        <input type="checkbox" checked={selected.includes(entry.id)}
          disabled={!selected.includes(entry.id) && selected.length >= 8}
          onChange={(e) => { setSelected((s) => e.target.checked ? [...s, entry.id] : s.filter((id) => id !== entry.id)); }} />
        {entry.entry_date} · {entry.title}
      </label>) : <p className="muted">Aucun événement admissible.</p>}
      {context.length > 0 && <details><summary>Prévisualiser les éléments transmis ({context.length})</summary>
        <pre className="context-preview">{JSON.stringify(context, null, 2)}</pre></details>}
    </div>}
    <button className="button secondary" disabled={busy || !prefs.assistant || message.trim().length < 2}
      onClick={() => void ask()}>{busy ? 'Réflexion en cours…' : 'Poser ma question'}</button>
    {answer && <div className="ai-answer" role="status"><strong>Réponse</strong><p>{answer}</p></div>}
    {status && <p role="status">{status}</p>}
    <p className="fineprint">Aucun changement n'est effectué automatiquement.</p>
  </section>;
}
