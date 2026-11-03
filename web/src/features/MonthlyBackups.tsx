import { useEffect, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { downloadMonthly, listBackups, saveBackupNow } from '../lib/autoBackup';

/** Profil › Mes données : les sauvegardes faites automatiquement chaque mois, à télécharger quand je veux. */
export function MonthlyBackups({ entries }: { entries: Entry[] }) {
  const [list, setList] = useState<{ name: string; month: string; size: number }[] | null>(null);
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState('');
  const load = () => listBackups().then(setList).catch(() => { setList([]); setMsg('Sauvegardes indisponibles pour le moment.'); });
  useEffect(() => { void load(); }, []);
  const now = async () => {
    setBusy(true); setMsg('');
    try { await saveBackupNow(entries); await load(); setMsg('Sauvegarde du mois mise à jour.'); }
    catch { setMsg('Sauvegarde impossible pour le moment.'); } finally { setBusy(false); }
  };
  const label = (m: string) => new Date(m + '-15T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return <section className="panel form-stack">
    <h2>Sauvegardes automatiques</h2>
    <p>Chaque mois, toutes tes données sont copiées dans un espace privé. Les 12 derniers mois sont gardés ; tu peux les télécharger et les restaurer ci-dessous (sans phrase secrète).</p>
    {list === null ? <p className="muted">Chargement…</p> : list.length ? <div className="backup-list">{list.map((b) => <div key={b.name} className="backup-row">
      <span><strong>{label(b.month).replace(/^./, (c) => c.toUpperCase())}</strong>{b.size ? <small className="muted"> · {Math.max(1, Math.round(b.size / 1024))} Ko</small> : null}</span>
      <button className="button ghost small" onClick={() => void downloadMonthly(b.name).catch(() => setMsg('Téléchargement impossible.'))}><Download size={15} /> Télécharger</button></div>)}</div>
      : <p className="muted">La première sauvegarde se fera automatiquement à ta prochaine ouverture de l’app.</p>}
    <button className="button secondary" disabled={busy} onClick={() => void now()}><RefreshCw size={15} /> {busy ? 'Sauvegarde…' : 'Sauvegarder maintenant'}</button>
    {msg && <p role="status" className="fineprint">{msg}</p>}
  </section>;
}
