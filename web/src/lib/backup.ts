import type { Entry } from './cloud';

type Envelope = {
  format: 'my-thirties-web-encrypted';
  version: 1;
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
};

const iterations = 250_000;
const enc = new TextEncoder();
const dec = new TextDecoder();
const hex = (bytes: Uint8Array) => Array.from(bytes, (v) => v.toString(16).padStart(2, '0')).join('');
const fromHex = (s: string) => new Uint8Array(s.match(/.{2}/g)!.map((x) => parseInt(x, 16)));

async function derive(password: string, salt: Uint8Array, count: number) {
  const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt as BufferSource, iterations: count, hash: 'SHA-256' },
    material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

export async function makeEncryptedBackup(entries: Entry[], password: string) {
  if (password.trim().length < 12) throw new Error('Choisissez une phrase secrète d’au moins 12 caractères.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derive(password, salt, iterations);
  const plaintext = enc.encode(JSON.stringify({
    format: 'my-thirties-web-backup', version: 1, createdAt: new Date().toISOString(),
    entries: entries.map(({ module, kind, title, entry_date, data }) => ({ module, kind, title, entry_date, data })),
  }));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext));
  const envelope: Envelope = {
    format: 'my-thirties-web-encrypted', version: 1, iterations,
    salt: hex(salt), iv: hex(iv), ciphertext: hex(ciphertext),
  };
  return JSON.stringify(envelope);
}

export async function parseEncryptedBackup(content: string, password: string) {
  const envelope: Envelope = JSON.parse(content);
  if (envelope.format !== 'my-thirties-web-encrypted' || envelope.version !== 1 ||
    envelope.iterations !== iterations || !/^[0-9a-f]{32}$/.test(envelope.salt) ||
    !/^[0-9a-f]{24}$/.test(envelope.iv) || !/^[0-9a-f]+$/.test(envelope.ciphertext) ||
    envelope.ciphertext.length > 15_000_000) throw new Error('Fichier de sauvegarde invalide.');
  const key = await derive(password, fromHex(envelope.salt), iterations);
  const bytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromHex(envelope.iv) }, key, fromHex(envelope.ciphertext));
  const parsed: unknown = JSON.parse(dec.decode(bytes));
  if (!parsed || typeof parsed !== 'object' || !('format' in parsed) ||
    parsed.format !== 'my-thirties-web-backup' || !('entries' in parsed) ||
    !Array.isArray(parsed.entries)) throw new Error('Contenu de sauvegarde invalide.');
  return parsed.entries as unknown[];
}

export function downloadBackup(content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-thirties-' + new Date().toISOString().slice(0, 10) + '.encrypted.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
