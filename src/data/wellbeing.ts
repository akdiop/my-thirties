import { and, asc, desc, eq, isNull } from 'drizzle-orm';

import type { Database } from '@/db/client';
import { challenge, challengeDay, journalEntry, sportSession } from '@/db/schema';
import { uuid } from '@/security/random';
import { created, touched } from './stamp';

export type DayState = 'done' | 'rest' | 'not_done';
export type JournalKind = 'emotion' | 'gratitude';

export function createWellbeingRepository(db: Database, deviceId: string) {
  return {
    listChallenges() {
      return db.select().from(challenge).where(isNull(challenge.deletedAt)).orderBy(desc(challenge.createdAt)).all();
    },
    getChallenge(id: string) {
      return db.select().from(challenge).where(and(eq(challenge.id, id), isNull(challenge.deletedAt))).get();
    },
    createChallenge(title: string, discipline: string, startDate: string, days: number) {
      if (!title.trim() || ![7, 14, 30].includes(days)) throw new Error('Programme invalide.');
      const id = uuid();
      db.insert(challenge).values({ id, title: title.trim(), discipline, startDate, days, ...created(deviceId) }).run();
      return id;
    },
    setChallengeStatus(id: string, status: 'active' | 'completed' | 'archived') {
      db.update(challenge).set({ status, ...touched(deviceId) }).where(eq(challenge.id, id)).run();
    },
    listDays(challengeId: string) {
      return db.select().from(challengeDay).where(and(eq(challengeDay.challengeId, challengeId), isNull(challengeDay.deletedAt))).orderBy(asc(challengeDay.dayNumber)).all();
    },
    setDay(challengeId: string, dayNumber: number, state: DayState, plan?: string) {
      const parent = db.select().from(challenge).where(and(eq(challenge.id, challengeId), isNull(challenge.deletedAt))).get();
      if (!parent || dayNumber < 1 || dayNumber > parent.days || !Number.isInteger(dayNumber)) throw new Error('Jour invalide.');
      const existing = db.select().from(challengeDay).where(and(eq(challengeDay.challengeId, challengeId), eq(challengeDay.dayNumber, dayNumber))).get();
      if (existing) {
        db.update(challengeDay).set({ state, ...(plan !== undefined ? { plan } : {}), deletedAt: null, ...touched(deviceId) }).where(eq(challengeDay.id, existing.id)).run();
      } else {
        db.insert(challengeDay).values({ id: uuid(), challengeId, dayNumber, state, plan: plan ?? null, ...created(deviceId) }).run();
      }
    },
    listJournal(kind: JournalKind) {
      return db.select().from(journalEntry).where(and(eq(journalEntry.kind, kind), isNull(journalEntry.deletedAt))).orderBy(desc(journalEntry.entryDate), desc(journalEntry.createdAt)).all();
    },
    addJournal(kind: JournalKind, entryDate: string, input: { emotion?: string; trigger?: string; reaction?: string; reflection: string }) {
      if (!input.reflection.trim()) throw new Error('Une note est nécessaire.');
      const id = uuid();
      db.insert(journalEntry).values({ id, kind, entryDate, emotion: input.emotion || null, trigger: input.trigger || null, reaction: input.reaction || null, reflection: input.reflection.trim(), ...created(deviceId) }).run();
      return id;
    },
    deleteJournal(id: string) {
      db.update(journalEntry).set({ deletedAt: new Date().toISOString(), ...touched(deviceId) }).where(eq(journalEntry.id, id)).run();
    },
    listSportSessions() {
      return db.select().from(sportSession).where(isNull(sportSession.deletedAt)).orderBy(desc(sportSession.sessionDate), desc(sportSession.createdAt)).all();
    },
    addSportSession(discipline: string, sessionDate: string, durationMinutes: number | null, notes: string) {
      if (durationMinutes !== null && (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 300)) throw new Error('Durée invalide.');
      const id = uuid();
      db.insert(sportSession).values({ id, discipline, sessionDate, durationMinutes, notes: notes.trim() || null, ...created(deviceId) }).run();
      return id;
    },
    deleteSportSession(id: string) {
      db.update(sportSession).set({ deletedAt: new Date().toISOString(), ...touched(deviceId) }).where(eq(sportSession.id, id)).run();
    },
    dumpAll() {
      return {
        challenge: db.select().from(challenge).all(),
        challengeDay: db.select().from(challengeDay).all(),
        journalEntry: db.select().from(journalEntry).all(),
        sportSession: db.select().from(sportSession).all(),
import { and, asc, desc, eq, gte, isNull, lte } from 'drizzle-orm';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

import { buildPlan, postponeFrom, templateById, type ChallengeUnit, type DayStatus } from '@/challenges/challenges';
import type { Database } from '@/db/client';
import {
  challenge,
  challengeDay,
  dailyHealth,
  dhikrSession,
  emotionEntry,
  foodEntry,
  gratitudeEntry,
  monthlyReflection,
  period,
  prayerLog,
  programCheck,
  programEnrollment,
  sleepEntry,
  spiritualJournal,
  workoutSession,
} from '@/db/schema';
import { uuid } from '@/security/random';
import { created, nowIso, touched } from './stamp';

const alive = (t: { deletedAt: AnySQLiteColumn }) => isNull(t.deletedAt);

export type DailyHealthInput = { mood: number | null; energy: number | null; pain: number | null; symptoms: string[]; water: number; steps: number | null; notes: string | null };
export type WorkoutInput = { date: string; discipline: string; title: string; durationMin: number | null; intensity: number | null; feeling: string | null; notes: string | null };
export type EmotionInput = {
  at: string;
  emotion: string;
  intensity: number;
  situation: string | null;
  trigger: string | null;
  thoughts: string | null;
  reaction: string | null;
  strategy: string | null;
  outcome: string | null;
  notes: string | null;
};
export type GratitudeInput = { things: string[]; learned: string | null; success: string | null; reflection: string | null; intention: string | null; freeText: string | null };
export type ReflectionInput = { helped: string | null; difficult: string | null; strategies: string | null; learnings: string | null; intentions: string | null };
export type CustomChallengeInput = { title: string; exercise: string; unit: ChallengeUnit; start: number; step: number; stepEvery: number; restEvery: number; days: number; sets: number };

export function createWellbeingRepository(db: Database, deviceId: string) {
  return {
    listPeriods() {
      return db.select().from(period).where(alive(period)).orderBy(asc(period.startDate)).all();
    },
    startPeriod(date: string) {
      const open = db.select().from(period).where(and(alive(period), isNull(period.endDate))).all();
      for (const p of open) if (p.startDate < date) db.update(period).set({ endDate: p.startDate, ...touched(deviceId) }).where(eq(period.id, p.id)).run();
      db.insert(period).values({ id: uuid(), startDate: date, endDate: null, notes: null, ...created(deviceId) }).run();
    },
    endPeriod(id: string, date: string) {
      db.update(period).set({ endDate: date, ...touched(deviceId) }).where(eq(period.id, id)).run();
    },
    deletePeriod(id: string) {
      db.update(period).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(period.id, id)).run();
    },

    getDailyHealth(date: string) {
      return db.select().from(dailyHealth).where(eq(dailyHealth.date, date)).get();
    },
    saveDailyHealth(date: string, input: Partial<DailyHealthInput>) {
      db.insert(dailyHealth)
        .values({ id: uuid(), date, symptoms: [], water: 0, ...input, ...created(deviceId) })
        .onConflictDoUpdate({ target: dailyHealth.date, set: { ...input, deletedAt: null, ...touched(deviceId) } })
        .run();
    },
    dailyHealthRange(from: string, to: string) {
      return db.select().from(dailyHealth).where(and(gte(dailyHealth.date, from), lte(dailyHealth.date, to), alive(dailyHealth))).orderBy(asc(dailyHealth.date)).all();
    },

    listSleep(from: string, to: string) {
      return db.select().from(sleepEntry).where(and(gte(sleepEntry.date, from), lte(sleepEntry.date, to), alive(sleepEntry))).orderBy(desc(sleepEntry.date)).all();
    },
    saveSleep(date: string, bedTime: string, wakeTime: string, quality: number | null) {
      db.insert(sleepEntry)
        .values({ id: uuid(), date, bedTime, wakeTime, quality, ...created(deviceId) })
        .onConflictDoUpdate({ target: sleepEntry.date, set: { bedTime, wakeTime, quality, deletedAt: null, ...touched(deviceId) } })
        .run();
    },

    listFood(date: string) {
      return db.select().from(foodEntry).where(and(eq(foodEntry.date, date), alive(foodEntry))).orderBy(asc(foodEntry.createdAt)).all();
    },
    addFood(date: string, meal: string, description: string, feeling: string | null) {
      db.insert(foodEntry).values({ id: uuid(), date, meal, description: description.trim(), feeling, ...created(deviceId) }).run();
    },
    deleteFood(id: string) {
      db.update(foodEntry).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(foodEntry.id, id)).run();
    },

    listWorkouts(limit = 60) {
      return db.select().from(workoutSession).where(alive(workoutSession)).orderBy(desc(workoutSession.date), desc(workoutSession.createdAt)).limit(limit).all();
    },
    getWorkout(id: string) {
      return db.select().from(workoutSession).where(eq(workoutSession.id, id)).get();
    },
    saveWorkout(input: WorkoutInput, id?: string) {
      if (id) {
        db.update(workoutSession).set({ ...input, ...touched(deviceId) }).where(eq(workoutSession.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(workoutSession).values({ id: newId, ...input, ...created(deviceId) }).run();
      return newId;
    },
    deleteWorkout(id: string) {
      db.transaction((tx) => {
        tx.update(workoutSession).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(workoutSession.id, id)).run();
        tx.update(challengeDay).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(challengeDay.workoutSessionId, id)).run();
      });
    },

    listChallenges(status?: string) {
      const all = db.select().from(challenge).where(alive(challenge)).orderBy(desc(challenge.startDate)).all();
      return status ? all.filter((c) => c.status === status) : all;
    },
    getChallenge(id: string) {
      return db.select().from(challenge).where(eq(challenge.id, id)).get();
    },
    startChallenge(templateId: string, startDate: string, easier = false) {
      const t = templateById(templateId);
      if (!t) throw new Error('Modèle de challenge inconnu.');
      const plan = buildPlan(easier ? { ...t, step: Math.max(1, Math.round(t.step * 0.6)) } : t);
      const id = uuid();
      db.insert(challenge)
        .values({ id, templateId, title: t.title, exercise: t.exercise, unit: t.unit, startDate, plan, sets: t.sets, status: 'active', reminderTime: null, ...created(deviceId) })
        .run();
      return id;
    },
    startCustomChallenge(input: CustomChallengeInput, startDate: string) {
      const id = uuid();
      db.insert(challenge)
        .values({
          id,
          templateId: null,
          title: input.title.trim(),
          exercise: input.exercise.trim(),
          unit: input.unit,
          startDate,
          plan: buildPlan(input),
          sets: input.sets,
          status: 'active',
          reminderTime: null,
          ...created(deviceId),
        })
        .run();
      return id;
    },
    setChallengeStatus(id: string, status: 'active' | 'paused' | 'archived') {
      db.update(challenge).set({ status, ...touched(deviceId) }).where(eq(challenge.id, id)).run();
    },
    setChallengeReminder(id: string, reminderTime: string | null) {
      db.update(challenge).set({ reminderTime, ...touched(deviceId) }).where(eq(challenge.id, id)).run();
    },
    deleteChallenge(id: string) {
      db.update(challenge).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(challenge.id, id)).run();
    },
    challengeDays(challengeId: string) {
      return db.select().from(challengeDay).where(and(eq(challengeDay.challengeId, challengeId), alive(challengeDay))).all();
    },
    setDayStatus(challengeId: string, day: number, status: DayStatus) {
      db.insert(challengeDay)
        .values({ id: uuid(), challengeId, day, status, workoutSessionId: null, adjustedValue: null, note: null, ...created(deviceId) })
        .onConflictDoUpdate({ target: [challengeDay.challengeId, challengeDay.day], set: { status, deletedAt: null, ...touched(deviceId) } })
        .run();
    },
    clearDayStatus(challengeId: string, day: number) {
      db.update(challengeDay).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(and(eq(challengeDay.challengeId, challengeId), eq(challengeDay.day, day))).run();
    },
    completeChallengeDay(challengeId: string, day: number, date: string, value: number) {
      const c = this.getChallenge(challengeId);
      if (!c) return;
      const amount = c.unit === 'reps' ? `${c.sets} × ${value}` : `${c.sets > 1 ? `${c.sets} × ` : ''}${value} ${c.unit === 'seconds' ? 's' : 'min'}`;
      db.transaction((tx) => {
        const sessionId = uuid();
        tx.insert(workoutSession)
          .values({
            id: sessionId,
            date,
            discipline: 'challenge',
            title: `${c.exercise} · ${amount}`,
            durationMin: c.unit === 'minutes' ? value * c.sets : null,
            intensity: null,
            feeling: null,
            notes: `${c.title}, jour ${day}`,
            ...created(deviceId),
          })
          .run();
        tx.insert(challengeDay)
          .values({ id: uuid(), challengeId, day, status: 'done', workoutSessionId: sessionId, adjustedValue: null, note: null, ...created(deviceId) })
          .onConflictDoUpdate({ target: [challengeDay.challengeId, challengeDay.day], set: { status: 'done', workoutSessionId: sessionId, deletedAt: null, ...touched(deviceId) } })
          .run();
      });
    },
    adaptChallengeDay(challengeId: string, day: number, value: number) {
      db.insert(challengeDay)
        .values({ id: uuid(), challengeId, day, status: 'planned', workoutSessionId: null, adjustedValue: value, note: null, ...created(deviceId) })
        .onConflictDoUpdate({ target: [challengeDay.challengeId, challengeDay.day], set: { adjustedValue: value, deletedAt: null, ...touched(deviceId) } })
        .run();
    },
    adjustedValue(challengeId: string, day: number) {
      return db.select().from(challengeDay).where(and(eq(challengeDay.challengeId, challengeId), eq(challengeDay.day, day), alive(challengeDay))).get()?.adjustedValue ?? null;
    },
    recordedStatuses(challengeId: string) {
      const map = new Map<number, DayStatus>();
      for (const d of this.challengeDays(challengeId)) if (d.status === 'done' || d.status === 'rest' || d.status === 'missed') map.set(d.day, d.status);
      return map;
    },
    postponeChallengeDay(challengeId: string, day: number) {
      const c = this.getChallenge(challengeId);
      if (!c) return;
      db.update(challenge).set({ plan: postponeFrom(c.plan, day), ...touched(deviceId) }).where(eq(challenge.id, challengeId)).run();
    },
    restartChallenge(id: string, startDate: string) {
      const c = this.getChallenge(id);
      if (!c) return null;
      const newId = uuid();
      db.insert(challenge).values({ ...c, id: newId, startDate, status: 'active', ...created(deviceId) }).run();
      return newId;
    },

    listEmotions(limit = 200) {
      return db.select().from(emotionEntry).where(alive(emotionEntry)).orderBy(desc(emotionEntry.at)).limit(limit).all();
    },
    getEmotion(id: string) {
      return db.select().from(emotionEntry).where(eq(emotionEntry.id, id)).get();
    },
    saveEmotion(input: EmotionInput, id?: string) {
      if (id) {
        db.update(emotionEntry).set({ ...input, ...touched(deviceId) }).where(eq(emotionEntry.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(emotionEntry).values({ id: newId, ...input, ...created(deviceId) }).run();
      return newId;
    },
    deleteEmotion(id: string) {
      db.update(emotionEntry).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(emotionEntry.id, id)).run();
    },

    getGratitude(date: string) {
      return db.select().from(gratitudeEntry).where(and(eq(gratitudeEntry.date, date), alive(gratitudeEntry))).get();
    },
    listGratitude(limit = 60) {
      return db.select().from(gratitudeEntry).where(alive(gratitudeEntry)).orderBy(desc(gratitudeEntry.date)).limit(limit).all();
    },
    saveGratitude(date: string, input: GratitudeInput) {
      db.insert(gratitudeEntry)
        .values({ id: uuid(), date, ...input, ...created(deviceId) })
        .onConflictDoUpdate({ target: gratitudeEntry.date, set: { ...input, deletedAt: null, ...touched(deviceId) } })
        .run();
    },

    activeEnrollment(programId: string) {
      return db
        .select()
        .from(programEnrollment)
        .where(and(eq(programEnrollment.programId, programId), eq(programEnrollment.status, 'active'), alive(programEnrollment)))
        .get();
    },
    enroll(programId: string, startDate: string) {
      const existing = this.activeEnrollment(programId);
      if (existing) return existing.id;
      const id = uuid();
      db.insert(programEnrollment).values({ id, programId, startDate, status: 'active', ...created(deviceId) }).run();
      return id;
    },
    endEnrollment(id: string, status: 'completed' | 'stopped') {
      db.update(programEnrollment).set({ status, ...touched(deviceId) }).where(eq(programEnrollment.id, id)).run();
    },
    programChecks(enrollmentId: string) {
      return db.select().from(programCheck).where(and(eq(programCheck.enrollmentId, enrollmentId), alive(programCheck))).all();
    },
    toggleProgramStep(enrollmentId: string, day: number, step: number, checked: boolean) {
      if (checked) {
        db.insert(programCheck)
          .values({ id: uuid(), enrollmentId, day, step, journal: null, ...created(deviceId) })
          .onConflictDoUpdate({ target: [programCheck.enrollmentId, programCheck.day, programCheck.step], set: { deletedAt: null, ...touched(deviceId) } })
          .run();
      } else {
        db.update(programCheck)
          .set({ deletedAt: nowIso(), ...touched(deviceId) })
          .where(and(eq(programCheck.enrollmentId, enrollmentId), eq(programCheck.day, day), eq(programCheck.step, step)))
          .run();
      }
    },
    saveProgramJournal(enrollmentId: string, day: number, journal: string) {
      db.insert(programCheck)
        .values({ id: uuid(), enrollmentId, day, step: -1, journal, ...created(deviceId) })
        .onConflictDoUpdate({ target: [programCheck.enrollmentId, programCheck.day, programCheck.step], set: { journal, deletedAt: null, ...touched(deviceId) } })
        .run();
    },

    getReflection(month: string) {
      return db.select().from(monthlyReflection).where(eq(monthlyReflection.month, month)).get();
    },
    saveReflection(month: string, input: ReflectionInput) {
      db.insert(monthlyReflection)
        .values({ id: uuid(), month, ...input, ...created(deviceId) })
        .onConflictDoUpdate({ target: monthlyReflection.month, set: { ...input, deletedAt: null, ...touched(deviceId) } })
        .run();
    },

    prayersDone(date: string) {
      return new Set(
        db
          .select({ prayer: prayerLog.prayer })
          .from(prayerLog)
          .where(and(eq(prayerLog.date, date), alive(prayerLog)))
          .all()
          .map((r) => r.prayer),
      );
    },
    togglePrayer(date: string, prayer: string, done: boolean) {
      if (done) {
        db.insert(prayerLog)
          .values({ id: uuid(), date, prayer, ...created(deviceId) })
          .onConflictDoUpdate({ target: [prayerLog.date, prayerLog.prayer], set: { deletedAt: null, ...touched(deviceId) } })
          .run();
      } else {
        db.update(prayerLog).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(and(eq(prayerLog.date, date), eq(prayerLog.prayer, prayer))).run();
      }
    },

    saveDhikr(date: string, routineId: string | null, total: number) {
      if (total <= 0) return;
      db.insert(dhikrSession).values({ id: uuid(), date, routineId, total, ...created(deviceId) }).run();
    },
    dhikrTotal(from: string, to: string) {
      return db
        .select()
        .from(dhikrSession)
        .where(and(gte(dhikrSession.date, from), lte(dhikrSession.date, to), alive(dhikrSession)))
        .all()
        .reduce((s, r) => s + r.total, 0);
    },

    listJournal(limit = 100) {
      return db.select().from(spiritualJournal).where(alive(spiritualJournal)).orderBy(desc(spiritualJournal.date), desc(spiritualJournal.createdAt)).limit(limit).all();
    },
    addJournal(date: string, text: string) {
      db.insert(spiritualJournal).values({ id: uuid(), date, text: text.trim(), ...created(deviceId) }).run();
    },
    deleteJournal(id: string) {
      db.update(spiritualJournal).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(spiritualJournal.id, id)).run();
    },

    dumpAll() {
      return {
        period: db.select().from(period).all(),
        dailyHealth: db.select().from(dailyHealth).all(),
        sleepEntry: db.select().from(sleepEntry).all(),
        foodEntry: db.select().from(foodEntry).all(),
        workoutSession: db.select().from(workoutSession).all(),
        challenge: db.select().from(challenge).all(),
        challengeDay: db.select().from(challengeDay).all(),
        emotionEntry: db.select().from(emotionEntry).all(),
        gratitudeEntry: db.select().from(gratitudeEntry).all(),
        programEnrollment: db.select().from(programEnrollment).all(),
        programCheck: db.select().from(programCheck).all(),
        monthlyReflection: db.select().from(monthlyReflection).all(),
        prayerLog: db.select().from(prayerLog).all(),
        dhikrSession: db.select().from(dhikrSession).all(),
        spiritualJournal: db.select().from(spiritualJournal).all(),
      };
    },
  };
}

export type WellbeingRepository = ReturnType<typeof createWellbeingRepository>;
