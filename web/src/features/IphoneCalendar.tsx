import { useEffect, useState } from 'react';
import { CalendarPlus, Copy, Download, RefreshCw } from 'lucide-react';
import { cloud } from '../lib/cloud';

const newToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, '0')).join('');
const feedUrl = (token: string) => (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/+$/, '') + '/functions/v1/calendar-feed?token=' + token;

/** Abonnement du calendrier de l'iPhone à l'agenda My Thirties (lien privé, mis à jour automatiquement par l'iPhone). */
export function IphoneCalendar({ onImported }: { onImported?: () => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [importUrl, setImportUrl] = useState('');
  const [linked, setLinked] = useState(false);
  const [importedAt, setImportedAt] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!cloud) return;
    void cloud.from('calendar_feeds').select('token,import_url,imported_at').maybeSingle().then(({ data }) => {
      setToken(data?.token ?? null);
      setImportUrl(data?.import_url ?? ''); setLinked(Boolean(data?.import_url)); setImportedAt(data?.imported_at ?? null);
      // Import automatique à l'ouverture de l'Agenda si le dernier date de plus de 15 minutes.
      if (data?.import_url && (!data.imported_at || Date.now() - Date.parse(data.imported_at) > 15 * 60_000)) void runImport(true);
    });
  }, []);

  /** iPhone → My Thirties : la fonction serveur lit le calendrier iCloud public et met l'Agenda à jour. */
  const runImport = async (quiet = false) => {
    if (!cloud) return;
    if (!quiet) setImportStatus('Import en cours…');
    try {
      const { data, error } = await cloud.functions.invoke('calendar-import', { body: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } });
      if (error || !data) throw error;
      setImportedAt(new Date().toISOString());
      setImportStatus(data.added || data.updated || data.removed || !quiet ? `iPhone → My Thirties : ${data.added} ajouté(s), ${data.updated} modifié(s), ${data.removed} retiré(s).` : '');
      if (data.added || data.updated || data.removed) onImported?.();
    } catch { if (!quiet) setImportStatus('Import impossible : vérifie le lien du calendrier iCloud.'); }
  };
  const saveImport = async () => {
    if (!cloud) return;
    const url = importUrl.trim();
    if (!/^(webcal|https):\/\//i.test(url)) { setImportStatus('Colle le lien qui commence par webcal:// (calendrier public iCloud).'); return; }
    setBusy(true);
    try {
      const { error } = await cloud.from('calendar_feeds').upsert({ import_url: url }, { onConflict: 'user_id' });
      if (error) throw error;
      setLinked(true); await runImport();
    } catch { setImportStatus('Impossible d’enregistrer ce lien.'); }
    finally { setBusy(false); }
  };
  const unlink = async () => {
    if (!cloud || !window.confirm('Ne plus importer le calendrier de l’iPhone ? Les événements déjà importés restent dans l’Agenda.')) return;
    await cloud.from('calendar_feeds').update({ import_url: null }).not('user_id', 'is', null);
    setLinked(false); setImportUrl(''); setImportStatus('');
  };

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

    <h4 className="iphone-cal-sub"><Download size={16} /> iPhone → My Thirties</h4>
    {linked ? <>
      <p className="muted">Tes événements de l’iPhone arrivent dans l’Agenda (marqués « iPhone »), à chaque ouverture de l’Agenda.{importedAt ? ' Dernier import : ' + new Date(importedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) + '.' : ''}</p>
      <div className="button-group">
        <button className="button secondary" onClick={() => void runImport()}>Importer maintenant</button>
        <button className="button ghost" onClick={() => void unlink()}>Délier</button>
      </div>
    </> : <>
      <ol className="how-list">
        <li>Sur l’iPhone, ouvre Calendrier › Calendriers (en bas).</li>
        <li>Touche le ⓘ à côté de ton calendrier iCloud.</li>
        <li>Active « Calendrier public », puis « Partager le lien… » › Copier.</li>
        <li>Colle le lien ici :</li>
      </ol>
      <input type="url" inputMode="url" placeholder="webcal://p…-caldav.icloud.com/published/…" value={importUrl} onChange={(e) => setImportUrl(e.target.value)} />
      <button className="button primary wide" disabled={busy || !importUrl.trim()} onClick={() => void saveImport()}>Relier mon calendrier iPhone</button>
      <p className="fineprint">Un calendrier public iCloud est lisible par toute personne qui a le lien : ne le partage qu’ici.</p>
    </>}
    {importStatus && <p role="status" className="fineprint">{importStatus}</p>}
  </section>;
}
