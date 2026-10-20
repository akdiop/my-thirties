/**
 * @jest-environment node
 */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import type { Database as AppDatabase } from '@/db/client';
import * as schema from '@/db/schema';
import { createOrganisationRepository } from './organisation';

jest.mock('@/security/random', () => ({ uuid: () => crypto.randomUUID(), randomHex: () => '00', toHex: () => '' }));

function openTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  const dir = join(__dirname, '../db/migrations');
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    for (const statement of readFileSync(join(dir, file), 'utf8').split('--> statement-breakpoint')) {
      if (statement.trim()) sqlite.exec(statement);
    }
  }
  return drizzle(sqlite, { schema }) as unknown as AppDatabase;
}

describe('organisation repository (SQLite)', () => {
  let org: ReturnType<typeof createOrganisationRepository>;
  beforeEach(() => {
    org = createOrganisationRepository(openTestDb(), 'device-test');
  });

  const taskInput = { title: 'Payer le loyer', notes: null, dueDate: '2026-10-20', dueTime: null, priority: 3, recurrence: null, reminderMinutes: null };

  it('persists events with JSON recurrence and occurrence exceptions', () => {
    const id = org.saveEvent({ title: 'Pilates', date: '2026-10-20', startTime: '18:00', endTime: '18:30', category: 'sport', location: null, notes: null, recurrence: { freq: 'weekly', interval: 1 }, reminderMinutes: 30 });
    org.skipOccurrence(id, '2026-10-27');
    const e = org.getEvent(id);
    expect(e?.recurrence).toEqual({ freq: 'weekly', interval: 1 });
    expect(e?.exceptions).toEqual(['2026-10-27']);
    org.deleteEvent(id);
    expect(org.listEvents()).toHaveLength(0);
  });

  it('creates the next instance when a recurring task is completed, with its subtasks', () => {
    const id = org.saveTask({ ...taskInput, recurrence: { freq: 'monthly', interval: 1 } });
    org.addSubtask(id, 'Virement');
    const task = org.getTask(id)!;
    org.completeTask(task, '2026-10-20');
    const tasks = org.listTasks();
    expect(tasks).toHaveLength(2);
    const next = tasks.find((t) => !t.completedAt)!;
    expect(next.dueDate).toBe('2026-11-20');
    expect(org.listSubtasks(next.id).map((s) => [s.title, s.done])).toEqual([['Virement', false]]);
  });

  it('undoes the next instance when a recurring task is unchecked again', () => {
    const id = org.saveTask({ ...taskInput, recurrence: { freq: 'weekly', interval: 1 } });
    org.completeTask(org.getTask(id)!, '2026-10-20');
    org.reopenTask(id, '2026-10-20');
    expect(org.listTasks().map((t) => [t.dueDate, t.completedAt])).toEqual([['2026-10-20', null]]);
  });

  it('postpones a task and keeps the count', () => {
    const id = org.saveTask(taskInput);
    org.postponeTask(org.getTask(id)!, '2026-10-20');
    expect(org.getTask(id)).toMatchObject({ dueDate: '2026-10-21', postponedCount: 1 });
  });

  it('checks routine steps per day and keeps history', () => {
    const id = org.saveRoutine({ name: 'Routine du matin', kind: 'matin', weekdays: [1, 2, 3, 4, 5], time: '07:00', remind: false, items: ['Eau', 'Étirements'] });
    const [a, b] = org.listRoutineItems(id);
    org.toggleRoutineItem(a!.id, '2026-10-20', true);
    org.toggleRoutineItem(b!.id, '2026-10-20', true);
    org.toggleRoutineItem(b!.id, '2026-10-20', false);
    org.toggleRoutineItem(b!.id, '2026-10-20', true);
    expect(org.checksFor(id, '2026-10-20').size).toBe(2);
    expect(org.checksFor(id, '2026-10-21').size).toBe(0);
  });

  it('edits routine steps in place and removes extra ones', () => {
    const id = org.saveRoutine({ name: 'Soir', kind: 'soir', weekdays: [1], time: null, remind: false, items: ['A', 'B', 'C'] });
    org.saveRoutine({ name: 'Soir', kind: 'soir', weekdays: [1], time: null, remind: false, items: ['A2', 'B'] }, id);
    expect(org.listRoutineItems(id).map((i) => i.title)).toEqual(['A2', 'B']);
  });

  it('creates lists from templates, duplicates, archives and clears checked items', () => {
    const id = org.createList('Valise Zanzibar', 'valise', 'valise-plage');
    const items = org.listItems(id);
    expect(items.length).toBeGreaterThan(3);
    expect(items.every((i) => !i.isUserEdited)).toBe(true);
    org.updateListItem(items[0]!.id, { checked: true });
    org.updateListItem(items[1]!.id, { title: 'Passeport' });
    expect(org.listItems(id)[1]!.isUserEdited).toBe(true);

    const copy = org.duplicateList(id)!;
    expect(org.getList(copy)?.title).toBe('Valise Zanzibar (copie)');
    expect(org.listItems(copy).every((i) => !i.checked)).toBe(true);

    org.clearChecked(id);
    expect(org.listItems(id)).toHaveLength(items.length - 1);

    org.archiveList(id, true);
    expect(org.listLists().map((l) => l.id)).toEqual([copy]);
    expect(org.listLists({ archived: true }).map((l) => l.id)).toEqual([id]);
  });

  it('reorders list items', () => {
    const id = org.createList('Courses', 'courses');
    org.addListItem(id, 'Riz', null);
    org.addListItem(id, 'Oignons', '1 kg');
    const [riz, oignons] = org.listItems(id);
    org.setPositions('listItem', [
      { id: riz!.id, position: oignons!.position },
      { id: oignons!.id, position: riz!.position },
    ]);
    expect(org.listItems(id).map((i) => i.title)).toEqual(['Oignons', 'Riz']);
  });
});
