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
      };
    },
  };
}

export type WellbeingRepository = ReturnType<typeof createWellbeingRepository>;
