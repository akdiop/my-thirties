import { addMonths, monthGrid, startOfWeek } from './dates';
import { describeRule, nextOccurrenceAfter, occurrencesBetween } from './recurrence';

describe('dates', () => {
  it('clamps month arithmetic to the last day', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2028-01-31', 1)).toBe('2028-02-29');
  });

  it('starts weeks on Monday', () => {
    expect(startOfWeek('2026-10-20')).toBe('2026-10-19');
    expect(startOfWeek('2026-10-25')).toBe('2026-10-19');
  });

  it('builds a full Monday-first month grid', () => {
    const grid = monthGrid('2026-10-20');
    expect(grid[0]).toBe('2026-09-28');
    expect(grid.length % 7).toBe(0);
    expect(grid).toContain('2026-10-31');
  });
});

describe('recurrence', () => {
  it('returns a single date without rule', () => {
    expect(occurrencesBetween('2026-10-20', null, '2026-10-01', '2026-10-31')).toEqual(['2026-10-20']);
    expect(occurrencesBetween('2026-10-20', null, '2026-11-01', '2026-11-30')).toEqual([]);
  });

  it('expands daily rules inside the range only', () => {
    expect(occurrencesBetween('2026-10-01', { freq: 'daily', interval: 2 }, '2026-10-05', '2026-10-10')).toEqual(['2026-10-05', '2026-10-07', '2026-10-09']);
  });

  it('expands weekly rules on chosen weekdays', () => {
    const r = occurrencesBetween('2026-10-20', { freq: 'weekly', interval: 1, weekdays: [2, 4] }, '2026-10-19', '2026-11-01');
    expect(r).toEqual(['2026-10-20', '2026-10-22', '2026-10-27', '2026-10-29']);
  });

  it('respects count, until and exceptions', () => {
    expect(occurrencesBetween('2026-10-20', { freq: 'daily', interval: 1, count: 3 }, '2026-10-01', '2026-12-31')).toHaveLength(3);
    expect(occurrencesBetween('2026-10-20', { freq: 'daily', interval: 1, until: '2026-10-22' }, '2026-10-01', '2026-12-31')).toHaveLength(3);
    expect(occurrencesBetween('2026-10-20', { freq: 'daily', interval: 1 }, '2026-10-20', '2026-10-22', ['2026-10-21'])).toEqual(['2026-10-20', '2026-10-22']);
  });

  it('keeps monthly dates on the same day when possible', () => {
    expect(occurrencesBetween('2026-01-31', { freq: 'monthly', interval: 1 }, '2026-01-01', '2026-04-30')).toEqual(['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30']);
  });

  it('handles a start date long before the range', () => {
    expect(occurrencesBetween('2001-01-01', { freq: 'daily', interval: 1 }, '2026-10-20', '2026-10-21')).toEqual(['2026-10-20', '2026-10-21']);
    expect(occurrencesBetween('2001-01-02', { freq: 'weekly', interval: 1 }, '2026-10-19', '2026-10-25')).toEqual(['2026-10-20']);
  });

  it('finds the next occurrence', () => {
    expect(nextOccurrenceAfter('2026-10-20', { freq: 'weekly', interval: 1 }, '2026-10-20')).toBe('2026-10-27');
  });

  it('describes rules in French', () => {
    expect(describeRule({ freq: 'weekly', interval: 2 })).toBe('Toutes les 2 semaines');
    expect(describeRule(null)).toBe('Ne se répète pas');
  });
});
