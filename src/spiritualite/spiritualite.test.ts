import { tap, startCounter, currentDhikr, DHIKR_ROUTINES } from './dhikr';
import { formatHijri, intlHijri, tabularHijri } from './hijri';
import { DEFAULT_PRAYER_SETTINGS, formatCountdown, nextPrayer, prayerTimes } from './prayer';

describe('prayer times', () => {
  const day = new Date(2026, 9, 20);
  const times = prayerTimes(day, DEFAULT_PRAYER_SETTINGS);

  it('returns the five prayers in order on the same day', () => {
    expect(times.map((p) => p.name)).toEqual(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']);
    for (let i = 1; i < times.length; i++) expect(times[i]!.at.getTime()).toBeGreaterThan(times[i - 1]!.at.getTime());
  });

  it('applies manual adjustments in minutes', () => {
    const shifted = prayerTimes(day, { ...DEFAULT_PRAYER_SETTINGS, adjustments: { ...DEFAULT_PRAYER_SETTINGS.adjustments, isha: 5 } });
    expect(shifted[4]!.at.getTime() - times[4]!.at.getTime()).toBe(5 * 60_000);
  });

  it('Hanafi Asr is later than Shafi Asr', () => {
    const hanafi = prayerTimes(day, { ...DEFAULT_PRAYER_SETTINGS, madhab: 'hanafi' });
    expect(hanafi[2]!.at.getTime()).toBeGreaterThan(times[2]!.at.getTime());
  });

  it('rolls over to tomorrow’s Fajr after Isha', () => {
    const late = new Date(times[4]!.at.getTime() + 60_000);
    expect(nextPrayer(late, DEFAULT_PRAYER_SETTINGS).name).toBe('fajr');
    expect(nextPrayer(late, DEFAULT_PRAYER_SETTINGS).at.getDate()).toBe(21);
  });

  it('formats countdowns', () => {
    expect(formatCountdown(72 * 60_000)).toBe('1 h 12');
    expect(formatCountdown(9 * 60_000)).toBe('9 min');
  });
});

describe('hijri', () => {
  it('stays within a day of Umm al-Qura with the tabular fallback', () => {
    const index = (h: { day: number; month: number; year: number }) => h.year * 354.37 + (h.month - 1) * 29.53 + h.day;
    for (let i = 0; i < 400; i += 7) {
      const d = new Date(2026, 0, 1 + i);
      const reference = intlHijri(d);
      expect(reference).not.toBeNull();
      expect(Math.abs(index(tabularHijri(d)) - index(reference!))).toBeLessThan(2.5);
    }
    expect(tabularHijri(new Date(2026, 9, 20))).toMatchObject({ month: 5, year: 1448 });
  });

  it('formats in French', () => {
    expect(formatHijri({ day: 9, month: 5, year: 1448 })).toBe('9 joumada al-oula 1448');
  });
});

describe('dhikr counter', () => {
  it('counts freely without a goal', () => {
    let s = { ...startCounter(null), reachedGoal: false };
    for (let i = 0; i < 150; i++) s = tap(s);
    expect(s.count).toBe(150);
    expect(s.done).toBe(false);
  });

  it('walks through a routine step by step and finishes', () => {
    const routine = DHIKR_ROUTINES[0]!;
    let s = { ...startCounter(routine.id), reachedGoal: false };
    for (let i = 0; i < 33; i++) s = tap(s);
    expect(s.reachedGoal).toBe(true);
    expect(currentDhikr(s).id).toBe('hamd');
    for (let i = 0; i < 33 + 33 + 1; i++) s = tap(s);
    expect(s.done).toBe(true);
    expect(s.total).toBe(100);
    expect(tap(s).total).toBe(100);
  });
});
