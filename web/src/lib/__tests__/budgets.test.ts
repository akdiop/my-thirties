import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { BUDGETS_KIND, categoryBudgets } from '../money';

const e = (kind: string, data: Record<string, unknown>, entry_date: string | null = '2026-11-05'): Entry =>
  ({ id: kind + Math.random(), module: 'finances', kind, title: kind, entry_date, data, created_at: '', updated_at: '' } as Entry);

describe('budgets par catégorie', () => {
  it('compare les dépenses du mois au plafond', () => {
    const entries = [
      e(BUDGETS_KIND, { limits: { XOF: { Shopping: 50000, Loisirs: 20000 } } }, null),
      e('expense', { amount: 45000, currency: 'XOF', category: 'Shopping' }),
      e('expense', { amount: 5000, currency: 'XOF', category: 'Loisirs' }),
      e('expense', { amount: 99999, currency: 'XOF', category: 'Shopping' }, '2026-10-02'),
    ];
    const r = categoryBudgets(entries, '2026-11', 'XOF');
    expect(r[0]).toMatchObject({ name: 'Shopping', spent: 45000, limit: 50000 });
    expect(r[0]!.share).toBeCloseTo(0.9);
    expect(r[1]!.name).toBe('Loisirs');
    expect(categoryBudgets(entries, '2026-11', 'EUR')).toEqual([]);
  });
});
