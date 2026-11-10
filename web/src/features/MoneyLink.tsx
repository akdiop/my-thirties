import { useState } from 'react';
import { ChevronDown, Copy, Smartphone } from 'lucide-react';
import { useShortcutLink } from './HealthLink';

/** Wave et Orange Money : un raccourci iPhone transmet le SMS de paiement, la dépense ou le revenu s'ajoute seul. */
export function MoneyLink() {
  const { token, status, busy, create, copy } = useShortcutLink('money-import');
  const [open, setOpen] = useState(false);
  return <section className="soft-card iphone-cal">
    <button className="fold-head" aria-expanded={open} onClick={() => setOpen(!open)}><Smartphone size={18} />
      <span><strong>Wave et Orange Money automatiques</strong><small className="muted">{token ? 'Lien créé' : 'Tes paiements notés depuis leurs SMS'}</small></span>
      <ChevronDown size={18} className={open ? 'flip' : ''} /></button>
    {open && <>
      <p className="muted small">Quand un SMS de paiement arrive, le raccourci l’envoie ici : le montant et le bénéficiaire deviennent une dépense (ou un revenu) en catégorie « Autres », à reclasser si tu veux. Le texte du SMS n’est pas gardé.</p>
      {token ? <button className="button primary" onClick={() => void copy()}><Copy size={15} /> Copier le lien</button>
        : <button className="button primary wide" disabled={busy} onClick={() => void create()}>Créer mon lien</button>}
      <ol className="how-list">
        <li>Dans l’app Raccourcis : Automatisation › Nouvelle automatisation › Message.</li>
        <li>Expéditeur : choisis Wave (ou Orange Money), tel qu’il apparaît dans Messages. Le message contient : F. Puis « Exécuter immédiatement ».</li>
        <li>Ajoute « Obtenir le contenu de l’URL » : colle ton lien, méthode POST, corps Fichier, et choisis « Message » (contenu de la variable).</li>
        <li>Refais la même automatisation pour l’autre opérateur.</li>
      </ol>
      <p className="fineprint">Le raccourci répond par exemple « dépense de 12 500 XOF ajoutée ». Si un SMS n’est pas reconnu, rien n’est ajouté.</p>
    </>}
    {status && <p role="status" className="fineprint">{status}</p>}
  </section>;
}
