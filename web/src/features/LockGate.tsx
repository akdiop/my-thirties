import { useEffect, useState, type ReactNode } from 'react';
import { Lock, ScanFace } from 'lucide-react';
import { checkPin, isUnlocked, markUnlocked, readLock, unlockBiometric } from '../lib/journalLock';

/** Affiche le contenu seulement après le code (ou Face ID) quand le journal est verrouillé sur cet appareil. */
export function LockGate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(isUnlocked);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const bio = Boolean(readLock()?.credential);
  useEffect(() => { if (!open && bio) void unlockBiometric().then((ok) => ok && setOpen(true)); }, []);
  if (open) return <>{children}</>;
  const tryPin = async (value: string) => {
    setPin(value); setError('');
    if (value.length >= 4 && await checkPin(value)) { markUnlocked(); setOpen(true); }
    else if (value.length >= 6) { setError('Code incorrect.'); setPin(''); }
  };
  return <div className="screen lock-screen">
    <span className="lock-badge"><Lock size={28} /></span>
    <h1 className="serif">Mon journal est verrouillé</h1>
    <p className="muted">Saisis ton code pour l’ouvrir.</p>
    <input className="pin-input" type="password" inputMode="numeric" autoComplete="off" maxLength={6} autoFocus value={pin}
      aria-label="Code du journal" onChange={(e) => void tryPin(e.target.value.replace(/\D/g, ''))} />
    {error && <p className="error" role="alert">{error}</p>}
    {bio && <button className="button ghost" onClick={() => void unlockBiometric().then((ok) => ok ? setOpen(true) : setError('Face ID n’a pas abouti.'))}><ScanFace size={18} /> Face ID</button>}
  </div>;
}
