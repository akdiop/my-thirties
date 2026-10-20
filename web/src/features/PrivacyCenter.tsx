import { useState } from 'react';
import { INTEGRATIONS, useIntegrationPrefs } from '../lib/integrations';

export function PrivacyCenter() {
  const { prefs, setPref } = useIntegrationPrefs();
  const [notice, setNotice] = useState('');
  const toggle = (id: keyof typeof prefs, enabled: boolean) => {
    setPref(id, enabled);
    setNotice(enabled
      ? id === 'sync' ? 'Préférence enregistrée. La synchronisation native n’est pas encore disponible.' : 'Autorisation enregistrée. Chaque action reste volontaire.'
      : 'Autorisation révoquée pour les prochaines opérations. Les données déjà transmises à un service externe ne peuvent pas être rappelées.');
  };
  return <section className="panel privacy-center">
    <h2>Mes intégrations et consentements</h2>
    <p className="muted">Toutes les intégrations facultatives sont désactivées par défaut. Les choix sont conservés uniquement dans ce navigateur, sans donnée de santé, de finance ou de journal. Ils ne remplacent pas les autorisations de ton iPhone.</p>
    <div className="privacy-integrations">
      {INTEGRATIONS.map((item) => <div className="privacy-integration" key={item.id}>
        <div><strong>{item.label}</strong><p>{item.details}</p><small>{item.external}</small></div>
        <label className="privacy-switch"><input type="checkbox" checked={prefs[item.id]} onChange={(e) => toggle(item.id, e.target.checked)}
          aria-label={'Autoriser ' + item.label} /><span>{prefs[item.id] ? 'Activé' : 'Désactivé'}</span></label>
      </div>)}
    </div>
    {notice && <p role="status">{notice}</p>}
    <button className="button secondary" onClick={() => {
      for (const item of INTEGRATIONS) setPref(item.id, false);
      setNotice('Toutes les autorisations facultatives ont été désactivées pour les prochaines opérations.');
    }}>Tout désactiver</button>
    <p className="fineprint">Révoquer une autorisation empêche les nouveaux envois via cette interface, mais ne supprime pas les informations déjà partagées avec un fournisseur externe. Les entrées enregistrées dans Supabase ne sont pas effacées.</p>
  </section>;
}
