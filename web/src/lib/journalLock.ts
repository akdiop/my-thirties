/**
 * Verrou du journal sur cet appareil : code à 4-6 chiffres (empreinte SHA-256 salée, jamais le code en clair)
 * et, en option, Face ID / Touch ID via WebAuthn (clé de l'appareil). Rien n'est envoyé au serveur.
 * Le journal reste déverrouillé pendant l'utilisation et se reverrouille après 2 minutes en arrière-plan.
 */
const KEY = 'my-thirties-journal-lock-v1';
type Lock = { salt: string; hash: string; credential?: string };

const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const b64 = (b: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(b)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
async function digest(pin: string, salt: string) { return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pin))); }

export function readLock(): Lock | null {
  try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && typeof v.hash === 'string' && typeof v.salt === 'string' ? v : null; } catch { return null; }
}
const writeLock = (l: Lock | null) => { try { if (l) localStorage.setItem(KEY, JSON.stringify(l)); else localStorage.removeItem(KEY); } catch { /* stockage indisponible */ } };

export async function setPin(pin: string) {
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  writeLock({ salt, hash: await digest(pin, salt), credential: readLock()?.credential });
  unlocked = true;
}
export const removeLock = () => { writeLock(null); unlocked = true; };
export async function checkPin(pin: string) {
  const l = readLock();
  return Boolean(l && (await digest(pin, l.salt)) === l.hash);
}

export const biometricSupported = () => typeof PublicKeyCredential !== 'undefined' && window.isSecureContext;
/** Enregistre la clé Face ID / Touch ID de cet appareil pour déverrouiller le journal. */
export async function enableBiometric() {
  const cred = await navigator.credentials.create({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { name: 'My Thirties' },
    user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'journal', displayName: 'Mon journal' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' }, timeout: 60000,
  } }) as PublicKeyCredential | null;
  const l = readLock();
  if (!cred || !l) throw new Error('Face ID indisponible.');
  writeLock({ ...l, credential: b64(cred.rawId) });
}
export const disableBiometric = () => { const l = readLock(); if (l) writeLock({ salt: l.salt, hash: l.hash }); };
export async function unlockBiometric() {
  const l = readLock();
  if (!l?.credential) return false;
  const ok = await navigator.credentials.get({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type: 'public-key', id: unb64(l.credential) }],
    userVerification: 'required', timeout: 60000,
  } }).then(Boolean).catch(() => false);
  if (ok) unlocked = true;
  return ok;
}

let unlocked = false;
let hiddenAt = 0;
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
  if (document.hidden) hiddenAt = Date.now();
  else if (hiddenAt && Date.now() - hiddenAt > 120_000) unlocked = false;
});
export const isUnlocked = () => unlocked || !readLock();
export const markUnlocked = () => { unlocked = true; };
export const lockNow = () => { unlocked = false; };
