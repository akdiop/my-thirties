import * as Crypto from 'expo-crypto';

export const toHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

export const randomHex = (byteCount: number) => toHex(Crypto.getRandomBytes(byteCount));

export const uuid = () => Crypto.randomUUID();
