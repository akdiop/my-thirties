import { describe, expect, it } from 'vitest';
import { fastingSummary, ramadanStatus, targetPage } from '../ramadan';

describe('mode Ramadan', () => {
  it('trouve le prochain Ramadan ou le jour en cours', () => {
    const before = ramadanStatus('2026-11-10');
    expect(before && !before.active && before.daysUntil > 0).toBe(true);
    if (before && !before.active) {
      const first = ramadanStatus(before.startIso);
      expect(first && first.active && first.day).toBe(1);
    }
  });
  it('plan de lecture : 604 pages en 30 jours', () => {
    expect(targetPage(1)).toBe(21);
    expect(targetPage(15)).toBe(302);
    expect(targetPage(30)).toBe(604);
  });
  it('jeûnes à rattraper', () => {
    expect(fastingSummary({ fasted: { a: true, b: false, c: false }, madeUp: 1 })).toEqual({ fasted: 1, missed: 2, toMakeUp: 1 });
  });
});
