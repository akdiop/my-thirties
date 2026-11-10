import { useEffect, useState } from 'react';
import { ChevronDown, Copy, HeartPulse, RefreshCw } from 'lucide-react';
import { cloud } from '../lib/cloud';
import { fmtMin } from '../lib/sleepAnalysis';
import { STAGE_LABEL, type HealthNight, type Stage } from '../../supabase/functions/health-import/sleep';

const newToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, '0')).join('');
const functionUrl = (fn: string, token: string) => (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/+$/, '') + '/functions/v1/' + fn + '?token=' + token;

/** Lien privé des raccourcis iPhone (Santé, paiements mobiles) : un seul jeton, régénérable. */
export function useShortcutLink(fn: string) {
  const [token, setToken] = useState<string | null>(null);
  const [importedAt, setImportedAt] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!cloud) return;
    void cloud.from('health_imports').select('token,imported_at').maybeSingle().then(({ data }) => { setToken(data?.token ?? null); setImportedAt(data?.imported_at ?? null); });
  }, []);
  const create = async () => {
    if (!cloud) return;
    setBusy(true); setStatus('');
    try {
      const next = newToken();
      const { error } = await cloud.from('health_imports').upsert({ token: next }, { onConflict: 'user_id' });
      if (error) throw error;
      setToken(next);
    } catch { setStatus('Impossible de créer le lien : la table des raccourcis n’est pas encore installée sur Supabase.'); }
    finally { setBusy(false); }
  };
  const copy = async () => {
    if (!token) return;
    try { await navigator.clipboard.writeText(functionUrl(fn, token)); setStatus('Lien copié.'); } catch { setStatus(functionUrl(fn, token)); }
  };
  return { token, importedAt, status, busy, create, copy };
}

/** Relier l'app Santé : un raccourci iPhone envoie chaque matin la nuit (Sleep Cycle, montre), les pas, les séances et les règles. */
export function HealthLink() {
  const { token, importedAt, status, busy, create, copy } = useShortcutLink('health-import');
  const [open, setOpen] = useState(false);

  return <section className="soft-card iphone-cal">
    <button className="fold-head" aria-expanded={open} onClick={() => setOpen(!open)}><HeartPulse size={18} />
      <span><strong>Relier l’app Santé</strong><small className="muted">{importedAt ? 'Dernier import : ' + new Date(importedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : token ? 'Lien créé' : 'Sleep Cycle, pas, sport et cycle dans My Thirties'}</small></span>
      <ChevronDown size={18} className={open ? 'flip' : ''} /></button>
    {open && <>
      <ol className="how-list">
        <li>Dans Sleep Cycle : Réglages › Santé, active l’envoi de l’analyse du sommeil.</li>
        <li>{token ? 'Copie ton lien privé :' : 'Crée ton lien privé :'}</li>
      </ol>
      {token ? <div className="button-group">
        <button className="button primary" onClick={() => void copy()}><Copy size={15} /> Copier le lien</button>
        <button className="button ghost" disabled={busy} onClick={() => { if (window.confirm('Créer un nouveau lien ? Tes raccourcis (Santé, paiements) devront utiliser le nouveau.')) void create(); }}><RefreshCw size={15} /> Nouveau lien</button>
      </div> : <button className="button primary wide" disabled={busy} onClick={() => void create()}>Créer mon lien</button>}
      <ol className="how-list" start={3}>
        <li>Dans l’app Raccourcis : Automatisation › Nouvelle automatisation › Heure de la journée (par exemple 10:00, tous les jours) › Exécuter immédiatement.</li>
        <li>Sommeil : « Rechercher des échantillons de santé », type Analyse du sommeil, date de début dans les 2 derniers jours. Puis « Répéter avec chaque élément », et dedans un « Texte » : Date de début | Date de fin | Valeur | Source (les deux dates au format ISO 8601), suivi de « Ajouter à la variable » Lignes.</li>
        <li>Pas (facultatif) : « Rechercher des échantillons de santé », type Pas, 2 derniers jours, regroupés par Jour. Dans la boucle, le Texte : PAS | Date de début | Valeur, ajouté à Lignes.</li>
        <li>Sport (facultatif) : « Rechercher des entraînements » des 2 derniers jours. Dans la boucle, le Texte : SPORT | Date de début | Date de fin | Type | Source, ajouté à Lignes.</li>
        <li>Cycle (facultatif) : « Rechercher des échantillons de santé », type Règles, 7 derniers jours. Dans la boucle, le Texte : REGLES | Date de début | Valeur, ajouté à Lignes.</li>
        <li>À la fin : « Combiner le texte » Lignes avec « Nouvelle ligne », puis « Obtenir le contenu de l’URL » : colle ton lien, méthode POST, corps Fichier, et choisis le texte combiné.</li>
      </ol>
      <p className="fineprint">Lance le raccourci une fois à la main pour vérifier : il répond par exemple « My Thirties : 1 nuit, pas de 2 jours importés ». Ce lien permet d’envoyer des nuits dans ton compte : ne le partage pas.</p>
    </>}
    {status && <p role="status" className="fineprint">{status}</p>}
  </section>;
}

const ROW: Stage[] = ['eveil', 'paradoxal', 'leger', 'endormie', 'profond'];
const Y: Partial<Record<Stage, number>> = { eveil: 8, paradoxal: 22, leger: 36, endormie: 36, profond: 56 };
const COLOR: Partial<Record<Stage, string>> = { eveil: '#D9B48F', paradoxal: '#C9A08C', leger: '#9FB5AA', endormie: '#9FB5AA', profond: '#6F8A80' };

/** Nuit venue de Santé : durées et, si Sleep Cycle ou la montre les fournissent, les phases. */
export function HealthReport({ n }: { n: HealthNight }) {
  const W = 320, x = (m: number) => (m / Math.max(1, n.inBed)) * W;
  const stages = ROW.filter((s) => n.stages[s]);
  return <div className="sleep-report">
    <div className="sleep-quality"><strong>{fmtMin(n.asleep)}</strong><span>de sommeil{n.sources.length ? ' · ' + n.sources.join(', ') : ''}</span></div>
    {n.segments.length > 0 && <svg className="hypno" viewBox={`0 0 ${W} 72`} role="img" aria-label="Phases de sommeil">
      {n.segments.map(([s, d, st], i) => <rect key={i} x={x(s)} y={Y[st] ?? 36} width={Math.max(0.8, x(d))} height={68 - (Y[st] ?? 36)} rx={1} fill={COLOR[st] ?? '#9FB5AA'} />)}
    </svg>}
    {stages.length > 0 && <div className="sleep-legend">{stages.map((s) => <span key={s}><i style={{ background: COLOR[s] }} />{STAGE_LABEL[s]} · {fmtMin(n.stages[s]!)}</span>)}</div>}
    <dl className="sleep-stats">
      <div><dt>Au lit</dt><dd>{n.bed} – {n.wake}</dd></div>
      <div><dt>Temps au lit</dt><dd>{fmtMin(n.inBed)}</dd></div>
      {n.inBed > 0 && <div><dt>Efficacité</dt><dd>{Math.round(100 * n.asleep / n.inBed)} %</dd></div>}
    </dl>
  </div>;
}
