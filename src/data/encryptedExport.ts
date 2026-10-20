import { pbkdf2Async } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import { AESEncryptionKey, aesDecryptAsync, aesEncryptAsync, AESSealedData, getRandomBytes } from 'expo-crypto';

import { toHex } from '@/security/random';

const ITERATIONS = 210_000;
const FORMAT = 'my-thirties-encrypted-export';

const fromHex = (hex: string) => Uint8Array.from(hex.match(/.{2}/g) ?? [], (v) => parseInt(v, 16));

async function deriveKey(password: string, salt: Uint8Array, iterations: number) {
  const bytes = await pbkdf2Async(sha256, new TextEncoder().encode(password), salt, { c: iterations, dkLen: 32 });
  return AESEncryptionKey.import(bytes);
}

export type EncryptedExport = {
  format: typeof FORMAT;
  version: 1;
  kdf: 'PBKDF2-SHA256';
  iterations: number;
  salt: string;
  cipher: 'AES-256-GCM';
  data: string;
};

export const isStrongExportPassword = (password: string) =>
  password.length >= 12 && password.trim().length >= 12;

export async function encryptExport(payload: unknown, password: string): Promise<EncryptedExport> {
  if (!isStrongExportPassword(password)) throw new Error('La phrase secrète doit contenir au moins 12 caractères.');
  const salt = getRandomBytes(16);
  const key = await deriveKey(password, salt, ITERATIONS);
  const sealed = await aesEncryptAsync(new TextEncoder().encode(JSON.stringify(payload)), key);
  const data = await sealed.combined('base64');
  if (typeof data !== 'string') throw new Error('Format de chiffrement non pris en charge.');
  return { format: FORMAT, version: 1, kdf: 'PBKDF2-SHA256', iterations: ITERATIONS, salt: toHex(salt), cipher: 'AES-256-GCM', data };
}

export async function decryptExport(envelope: EncryptedExport, password: string): Promise<unknown> {
  if (envelope.format !== FORMAT || envelope.version !== 1 ||
      envelope.kdf !== 'PBKDF2-SHA256' || envelope.cipher !== 'AES-256-GCM' ||
      !/^[a-f0-9]{32}$/.test(envelope.salt) ||
      !Number.isInteger(envelope.iterations) || envelope.iterations < ITERATIONS ||
      typeof envelope.data !== 'string') {
    throw new Error('Format de sauvegarde non reconnu.');
  }
  const key = await deriveKey(password, fromHex(envelope.salt), envelope.iterations);
  const decrypted = await aesDecryptAsync(AESSealedData.fromCombined(envelope.data), key);
  if (!(decrypted instanceof Uint8Array)) throw new Error('Format de déchiffrement inattendu.');
  return JSON.parse(new TextDecoder().decode(decrypted));
}
