import { parseFrankfurter } from './fx';
import { convertMinor, formatMoney, monthlyCost, monthSummary, parseAmount, rollForward, toMinor } from './money';

const rates = { usdPerEur: 1.1, date: '2026-10-20' };

describe('money', () => {
  it('parses French amounts and respects currency decimals', () => {
    expect(parseAmount('25 000', 'XOF')).toBe(25000);
    expect(parseAmount('12,50', 'EUR')).toBe(1250);
    expect(parseAmount('12,5', 'XOF')).toBeNull();
    expect(parseAmount('-3', 'EUR')).toBeNull();
    expect(parseAmount('abc', 'EUR')).toBeNull();
  });

  it('converts with the fixed CFA parity and a dated USD rate', () => {
    expect(convertMinor(toMinor(1, 'EUR'), 'EUR', 'XOF', rates)).toBe(656);
    expect(convertMinor(655957, 'XOF', 'EUR', rates)).toBe(100000);
    expect(convertMinor(toMinor(110, 'USD'), 'USD', 'EUR', rates)).toBe(10000);
    expect(convertMinor(100, 'USD', 'EUR', { usdPerEur: null, date: null })).toBeNull();
  });

  it('formats in French', () => {
    expect(formatMoney(850000, 'XOF')).toBe('850 000 XOF');
    expect(formatMoney(47564, 'EUR')).toBe('475,64 EUR');
  });

  it('summarises a month in the main currency', () => {
    const s = monthSummary(
      [
        { date: '2026-10-01', kind: 'income', amountMinor: 850000, currency: 'XOF', category: 'Salaire' },
        { date: '2026-10-05', kind: 'expense', amountMinor: 200000, currency: 'XOF', category: 'Logement' },
        { date: '2026-10-06', kind: 'expense', amountMinor: 1000, currency: 'EUR', category: 'Abonnements' },
        { date: '2026-10-07', kind: 'expense', amountMinor: 500, currency: 'USD', category: 'Abonnements' },
        { date: '2026-09-30', kind: 'expense', amountMinor: 9999, currency: 'XOF', category: 'Autres' },
      ],
      '2026-10',
      'XOF',
      { usdPerEur: null, date: null },
    );
    expect(s.income).toBe(850000);
    expect(s.expense).toBe(206560);
    expect(s.unconverted).toBe(1);
    expect(s.categories[0]?.name).toBe('Logement');
  });

  it('rolls subscription dates forward and computes monthly cost', () => {
    expect(rollForward('2026-08-28', 'monthly', '2026-10-20')).toBe('2026-10-28');
    expect(rollForward('2026-10-28', 'monthly', '2026-10-20')).toBe('2026-10-28');
    expect(monthlyCost(12000, 'yearly')).toBe(1000);
    expect(monthlyCost(1200, 'weekly')).toBe(5200);
  });
});

describe('fx', () => {
  it('parses the ECB rate and rejects anything else', () => {
    expect(parseFrankfurter({ amount: 1, base: 'EUR', date: '2026-10-19', rates: { USD: 1.0842 } })).toEqual({ date: '2026-10-19', usdPerEur: 1.0842 });
    expect(() => parseFrankfurter({ rates: { USD: '1.08' } })).toThrow();
  });
});
