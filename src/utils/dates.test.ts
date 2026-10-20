import { formatLongDate, greeting } from './dates';

describe('dates', () => {
  it('formats a French long date with a capital', () => {
    expect(formatLongDate(new Date('2026-10-20T12:00:00Z'), 'Africa/Dakar')).toBe('Mardi 20 octobre 2026');
  });

  it('greets by time of day', () => {
    expect(greeting(new Date(2026, 9, 20, 9))).toBe('Bonjour');
    expect(greeting(new Date(2026, 9, 20, 20))).toBe('Bonsoir');
  });
});
