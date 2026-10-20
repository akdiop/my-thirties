import { hashPin, INITIAL_LOCKOUT, isValidPin, registerFailure, remainingLockMs, shouldRelock, verifyPin } from './pin';

const SALT = '00112233445566778899aabbccddeeff';

describe('pin', () => {
  it('accepts only six digits', () => {
    expect(isValidPin('123456')).toBe(true);
    expect(isValidPin('12345')).toBe(false);
    expect(isValidPin('12345a')).toBe(false);
  });

  it('never stores the pin in clear and verifies it', async () => {
    const stored = await hashPin('482915', SALT, 1000);
    expect(JSON.stringify(stored)).not.toContain('482915');
    await expect(verifyPin('482915', stored)).resolves.toBe(true);
    await expect(verifyPin('482916', stored)).resolves.toBe(false);
  });

  it('salts the hash', async () => {
    const a = await hashPin('482915', SALT, 1000);
    const b = await hashPin('482915', 'ffeeddccbbaa99887766554433221100', 1000);
    expect(a.hash).not.toEqual(b.hash);
  });
});

describe('lockout', () => {
  it('allows four free failures then locks with growing delays', () => {
    let s = INITIAL_LOCKOUT;
    for (let i = 0; i < 4; i++) s = registerFailure(s, 0);
    expect(remainingLockMs(s, 0)).toBe(0);
    s = registerFailure(s, 0);
    expect(remainingLockMs(s, 0)).toBe(30_000);
    s = registerFailure(s, 0);
    expect(remainingLockMs(s, 0)).toBe(60_000);
  });

  it('caps the delay at fifteen minutes', () => {
    let s = INITIAL_LOCKOUT;
    for (let i = 0; i < 20; i++) s = registerFailure(s, 0);
    expect(remainingLockMs(s, 0)).toBe(15 * 60_000);
  });

  it('relocks after the configured background delay', () => {
    expect(shouldRelock(null, 10_000, 60_000)).toBe(false);
    expect(shouldRelock(0, 59_999, 60_000)).toBe(false);
    expect(shouldRelock(0, 60_000, 60_000)).toBe(true);
  });
});
