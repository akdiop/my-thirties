import { useState } from 'react';
import { Lock, ScanFace } from 'lucide-react';
import { biometricSupported, disableBiometric, enableBiometric, readLock, removeLock, setPin } from '../lib/journalLock';

const YEAR_KEY = 'my-thirties-year-ago-v1';
export const yearAgoOn = () => { try { return localStorage.getItem(YEAR_KEY) !== 'off'; } catch { return true; } };

/** Paramètres du journal : code de verrouillage, Face ID, « Il y a un an ». Tout reste sur cet appareil. */
export function JournalSettings() {
  const [lock, setLock] = useState(readLock);
  const [pin, setPinValue] = useState(''), [confirm, setConfirm] = useState('');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [year, setYear] = useState(yearAgoOn);
  const refresh = () => setLock(readLock());
  const save = async () => {
    if (!/^\d{4,6}$/.test(pin)) return setMsg('Le code doit faire 4 à 6 chiffres.');
    if (pin !== confirm) return setMsg('Les deux codes ne correspondent pas.');
    await setPin(pin); setPinValue(''); setConfirm(''); setEditing(false); refresh(); setMsg('Journal verrouillé sur cet appareil.');
  };
  return <section className="panel form-stack">
    <h2><Lock size={18} /> Mon journal</h2>
    <p className="muted">Le code protège Mon jour, Mon journal et le bilan sur cet appareil. Il n’est jamais envoyé ni enregistré en clair. Si tu l’oublies, déconnecte-toi puis reconnecte-toi pour le réinitialiser.</p>
    {lock && !editing ? <div className="button-group">
      <span className="pill-ok">Verrouillé par un code</span>
      <button className="button ghost small" onClick={() => setEditing(true)}>Changer le code</button>
      <button className="button ghost small" onClick={() => { if (window.confirm('Retirer le verrouillage du journal ?')) { removeLock(); refresh(); setMsg('Verrouillage retiré.'); } }}>Retirer</button>
    </div> : <>
      <label>Code (4 à 6 chiffres)<input type="password" inputMode="numeric" maxLength={6} autoComplete="new-password" value={pin} onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))} /></label>
      <label>Confirmer le code<input type="password" inputMode="numeric" maxLength={6} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ''))} /></label>
      <button className="button primary" onClick={() => void save()}>{lock ? 'Enregistrer le nouveau code' : 'Verrouiller mon journal'}</button>
    </>}
    {lock && biometricSupported() && <div className="toggle-row"><span><strong><ScanFace size={16} /> Face ID / Touch ID</strong><small>Ouvrir le journal sans taper le code.</small></span>
      <button className={'switch' + (lock.credential ? ' on' : '')} role="switch" aria-checked={Boolean(lock.credential)} aria-label="Face ID"
        onClick={async () => { try { if (lock.credential) disableBiometric(); else await enableBiometric(); refresh(); setMsg(''); } catch { setMsg('Face ID n’a pas pu être activé sur cet appareil.'); } }}><span /></button></div>}
    <div className="toggle-row"><span><strong>« Il y a un an… »</strong><small>Revoir ta journée et tes notes à la même date l’an dernier.</small></span>
      <button className={'switch' + (year ? ' on' : '')} role="switch" aria-checked={year} aria-label="Il y a un an"
        onClick={() => { const v = !year; setYear(v); try { localStorage.setItem(YEAR_KEY, v ? 'on' : 'off'); } catch { /* stockage indisponible */ } }}><span /></button></div>
    {msg && <p role="status" className="fineprint">{msg}</p>}
  </section>;
}
