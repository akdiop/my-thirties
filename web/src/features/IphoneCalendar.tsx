import { useEffect, useState } from 'react';
import { CalendarPlus, Copy, RefreshCw } from 'lucide-react';
import { cloud } from '../lib/cloud';

const newToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, '0')).join('');
const feedUrl = (token: string) => (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/+$/, '') + '/functions/v1/calendar-feed?token=' + token;

/** Abonnement du calendrier de l'iPhone à l'agenda My Thirties (lien privé, mis à jour automatiquement par l'iPhone). */
export function IphoneCalendar() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!cloud) return;
    void cloud.from('calendar_feeds').select('token').maybeSingle().then(({ data }) => setToken(data?.token ?? null));
  }, []);

  const create = async () => {
    if (!cloud) return;
    setBusy(true); setStatus('');
    try {
      const next = newToken();
      const { error } = await cloud.from('calendar_feeds').upsert({ token: next }, { onConflict: 'user_id' });
      if (error) throw error;
      setToken(next);
    } catch { setStatus('Impossible de créer le lien : la table du calendrier n’est pas encore installée sur Supabase.'); }
    finally { setBusy(false); }
  };
  const copy = async () => {
    if (!token) return;
    try { await navigator.clipboard.writeText(feedUrl(token)); setStatus('Lien copié.'); } catch { setStatus(feedUrl(token)); }
  };

  return <section className="soft-card iphone-cal">
    <h3><CalendarPlus size={18} /> Calendrier de l’iPhone</h3>
    {token ? <>
      <p className="muted">Ton agenda, tes rendez-vous et tes repas planifiés apparaissent dans l’app Calendrier et se mettent à jour automatiquement.</p>
      <a className="button primary wide" href={feedUrl(token).replace(/^https:/, 'webcal:')}>Ajouter à Calendrier</a>
      <div className="button-group">
        <button className="button ghost" onClick={() => void copy()}><Copy size={15} /> Copier le lien</button>
        <button className="button ghost" disabled={busy} onClick={() => { if (window.confirm('Créer un nouveau lien ? L’ancien abonnement cessera de fonctionner.')) void create(); }}><RefreshCw size={15} /> Nouveau lien</button>
      </div>
      <details className="challenge-more"><summary>Si le bouton ne marche pas</summary>
        <ol className="how-list"><li>Copie le lien.</li><li>Sur l’iPhone : Réglages › Calendrier › Comptes › Ajouter un compte › Autre › Ajouter un calendrier avec abonnement.</li><li>Colle le lien, puis Suivant › Enregistrer.</li><li>Dans « Actualiser », choisis « Toutes les heures » ou « Toutes les 15 minutes ».</li></ol>
      </details>
    </> : <>
      <p className="muted">Crée ton lien privé, puis ajoute-le en un geste au calendrier de l’iPhone.</p>
      <button className="button primary wide" disabled={busy} onClick={() => void create()}>Synchroniser avec l’iPhone</button>
    </>}
    {status && <p role="status" className="fineprint">{status}</p>}
  </section>;
}
