import { useState } from 'react';
import { cloud } from '../lib/cloud';

export function PersonalAssistant() {
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const ask = async () => {
    if (!cloud || !consent || message.trim().length < 2) return;
    setBusy(true); setAnswer(''); setStatus('');
    try {
      const { data, error } = await cloud.functions.invoke('personal-assistant', { body: { message: message.trim() } });
      if (error) throw error;
      if (!data || typeof data.answer !== 'string') throw new Error('Assistant non configuré.');
      setAnswer(data.answer);
    } catch { setStatus('Assistant IA indisponible. La fonction sécurisée doit être déployée et configurée avant utilisation.'); }
    finally { setBusy(false); }
  };
  return <section className="tool-card ai-assistant">
    <h3>Mon assistant IA</h3>
    <p className="muted">Pose une question pour préparer une journée, apprendre une notion ou organiser un projet. L'assistant n'accède pas automatiquement à tes données.</p>
    <label>Ma question<textarea rows={3} maxLength={1200} value={message} onChange={(e) => setMessage(e.target.value)}
      placeholder="Par exemple : propose-moi une façon de répartir mes activités cette semaine." /></label>
    <label className="checklist-item"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
      J'accepte d'envoyer uniquement le texte de cette question à un fournisseur d'IA externe.</label>
    <button className="button secondary" disabled={busy || !consent || message.trim().length < 2} onClick={() => void ask()}>
      {busy ? 'Réflexion en cours…' : 'Poser ma question'}</button>
    {answer && <div className="ai-answer" role="status"><strong>Réponse</strong><p>{answer}</p></div>}
    {status && <p role="status">{status}</p>}
    <p className="fineprint">Ne partage pas d'identifiants ni d'informations de santé ou financières confidentielles. Aucun accès automatique aux autres espaces, aucune modification de données et aucun historique de conversation enregistré dans l'application.</p>
  </section>;
}
