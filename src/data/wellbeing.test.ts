/**
 * @jest-environment node
 */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { summary } from '@/challenges/challenges';
import type { Database as AppDatabase } from '@/db/client';
import * as schema from '@/db/schema';
import { createWellbeingRepository } from './wellbeing';

jest.mock('@/security/random', () => ({ uuid: () => crypto.randomUUID(), randomHex: () => '00', toHex: () => '' }));

function openTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  const dir = join(__dirname, '../db/migrations');
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    for (const statement of readFileSync(join(dir, file), 'utf8').split('--> statement-breakpoint')) if (statement.trim()) sqlite.exec(statement);
  }
  return drizzle(sqlite, { schema }) as unknown as AppDatabase;
}

describe('wellbeing repository (SQLite)', () => {
  let well: ReturnType<typeof createWellbeingRepository>;
  beforeEach(() => {
    well = createWellbeingRepository(openTestDb(), 'device-test');
  });

  it('opens and closes periods; a new start closes a forgotten open one', () => {
    well.startPeriod('2026-09-15');
    well.startPeriod('2026-10-12');
    const [a, b] = well.listPeriods();
    expect(a).toMatchObject({ startDate: '2026-09-15', endDate: '2026-09-15' });
    expect(b?.endDate).toBeNull();
    well.endPeriod(b!.id, '2026-10-16');
    expect(well.listPeriods()[1]?.endDate).toBe('2026-10-16');
  });

  it('upserts the daily health entry field by field', () => {
    well.saveDailyHealth('2026-10-20', { mood: 4 });
    well.saveDailyHealth('2026-10-20', { water: 3, symptoms: ['Fatigue'] });
    expect(well.getDailyHealth('2026-10-20')).toMatchObject({ mood: 4, water: 3, symptoms: ['Fatigue'] });
  });

  it('records a challenge day as a workout session and never resets progress', () => {
    const id = well.startChallenge('squats', '2026-10-07');
    well.completeChallengeDay(id, 1, '2026-10-07', 15);
    well.setDayStatus(id, 2, 'missed');
    well.completeChallengeDay(id, 3, '2026-10-09', 20);
    const c = well.getChallenge(id)!;
    expect(summary(c.plan, 14, well.recordedStatuses(id))).toMatchObject({ done: 2 });
    expect(well.listWorkouts().map((w) => w.title)).toEqual(['Squats · 3 × 20', 'Squats · 3 × 15']);
  });

  it('adapts a day without marking it, and postpones by shifting the plan', () => {
    const id = well.startChallenge('squats', '2026-10-07');
    well.adaptChallengeDay(id, 14, 32);
    expect(well.adjustedValue(id, 14)).toBe(32);
    expect(well.recordedStatuses(id).has(14)).toBe(false);
    const before = well.getChallenge(id)!.plan;
    well.postponeChallengeDay(id, 14);
    const after = well.getChallenge(id)!.plan;
    expect(after.length).toBe(before.length + 1);
    expect(after[13]).toBe(0);
    expect(after[14]).toBe(before[13]);
  });

  it('removes the challenge mark when its workout is deleted', () => {
    const id = well.startChallenge('gainage', '2026-10-20');
    well.completeChallengeDay(id, 1, '2026-10-20', 20);
    well.deleteWorkout(well.listWorkouts()[0]!.id);
    expect(well.recordedStatuses(id).size).toBe(0);
  });

  it('tracks a Booster program and its journal', () => {
    const e = well.enroll('anxiete-7', '2026-10-16');
    expect(well.enroll('anxiete-7', '2026-10-20')).toBe(e);
    well.toggleProgramStep(e, 1, 0, true);
    well.toggleProgramStep(e, 1, 1, true);
    well.toggleProgramStep(e, 1, 1, false);
    well.saveProgramJournal(e, 1, 'Réunion de jeudi');
    const checks = well.programChecks(e);
    expect(checks.filter((c) => c.step >= 0)).toHaveLength(1);
    expect(checks.find((c) => c.step === -1)?.journal).toBe('Réunion de jeudi');
  });

  it('logs prayers and dhikr', () => {
    well.togglePrayer('2026-10-20', 'fajr', true);
    well.togglePrayer('2026-10-20', 'dhuhr', true);
    well.togglePrayer('2026-10-20', 'dhuhr', false);
    expect([...well.prayersDone('2026-10-20')]).toEqual(['fajr']);
    well.saveDhikr('2026-10-20', 'r5', 100);
    well.saveDhikr('2026-10-20', null, 0);
    expect(well.dhikrTotal('2026-10-01', '2026-10-31')).toBe(100);
  });

  it('keeps one gratitude entry per day', () => {
    const input = { things: ['Soleil', 'Appel de maman', 'Pilates'], learned: null, success: null, reflection: null, intention: 'Dormir tôt', freeText: null };
    well.saveGratitude('2026-10-20', input);
    well.saveGratitude('2026-10-20', { ...input, intention: 'Marcher' });
    expect(well.listGratitude()).toHaveLength(1);
    expect(well.getGratitude('2026-10-20')?.intention).toBe('Marcher');
  });
});
