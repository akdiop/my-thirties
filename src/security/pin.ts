import { pbkdf2Async } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';

import { toHex } from './random';

export const PIN_LENGTH = 6;
export const PBKDF2_ITERATIONS = 60_000;

export type StoredPin = { v: 1; salt: string; hash: string; iterations: number };

export const isValidPin = (pin: string) => new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);

const fromHex = (hex: string) => Uint8Array.from(hex.match(/.{2}/g) ?? [], (b) => parseInt(b, 16));

export async function hashPin(pin: string, saltHex: string, iterations = PBKDF2_ITERATIONS): Promise<StoredPin> {
  if (!isValidPin(pin)) throw new Error('Le code doit contenir 6 chiffres.');
  const derived = await pbkdf2Async(sha256, pin, fromHex(saltHex), { c: iterations, dkLen: 32 });
  return { v: 1, salt: saltHex, hash: toHex(derived), iterations };
}

const constantTimeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

export async function verifyPin(pin: string, stored: StoredPin) {
  if (!isValidPin(pin)) return false;
  const candidate = await hashPin(pin, stored.salt, stored.iterations);
  return constantTimeEqual(candidate.hash, stored.hash);
}

export type LockoutState = { failures: number; lockedUntil: number | null };

export const INITIAL_LOCKOUT: LockoutState = { failures: 0, lockedUntil: null };

const FREE_ATTEMPTS = 5;
const BASE_DELAY_MS = 30_000;
const MAX_DELAY_MS = 15 * 60_000;

export function registerFailure(state: LockoutState, now: number): LockoutState {
  const failures = state.failures + 1;
  if (failures < FREE_ATTEMPTS) return { failures, lockedUntil: null };
  const delay = Math.min(BASE_DELAY_MS * 2 ** (failures - FREE_ATTEMPTS), MAX_DELAY_MS);
  return { failures, lockedUntil: now + delay };
}

export const remainingLockMs = (state: LockoutState, now: number) =>
  state.lockedUntil && state.lockedUntil > now ? state.lockedUntil - now : 0;

export const shouldRelock = (backgroundedAt: number | null, now: number, delayMs: number) =>
  backgroundedAt !== null && now - backgroundedAt >= delayMs;
