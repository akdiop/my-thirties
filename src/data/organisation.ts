import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

import { nextRecurringDue, postpone, type TaskLike } from '@/agenda/tasks';
import type { RecurrenceRule } from '@/agenda/recurrence';
import type { Database } from '@/db/client';
import { event, list, listItem, routine, routineCheck, routineItem, subtask, task } from '@/db/schema';
import { duplicateTitle, LIST_TEMPLATES, nextPosition } from '@/lists/lists';
import { uuid } from '@/security/random';
import { created, nowIso, touched } from './stamp';

export type EventInput = {
  title: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  category: string;
  location: string | null;
  notes: string | null;
  recurrence: RecurrenceRule | null;
  reminderMinutes: number | null;
};

export type TaskInput = {
  title: string;
  notes: string | null;
  dueDate: string | null;
  dueTime: string | null;
  priority: number;
  recurrence: RecurrenceRule | null;
  reminderMinutes: number | null;
};

export type RoutineInput = { name: string; kind: string; weekdays: number[]; time: string | null; remind: boolean; items: string[] };

const alive = (t: { deletedAt: AnySQLiteColumn }) => isNull(t.deletedAt);

export function createOrganisationRepository(db: Database, deviceId: string) {
  return {
    listEvents() {
      return db.select().from(event).where(alive(event)).all();
    },
    getEvent(id: string) {
      return db.select().from(event).where(eq(event.id, id)).get();
    },
    saveEvent(input: EventInput, id?: string) {
      if (id) {
        db.update(event).set({ ...input, ...touched(deviceId) }).where(eq(event.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(event).values({ id: newId, ...input, exceptions: [], ...created(deviceId) }).run();
      return newId;
    },
    deleteEvent(id: string) {
      db.update(event).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(event.id, id)).run();
    },
    skipOccurrence(id: string, date: string) {
      const e = this.getEvent(id);
      if (!e) return;
      db.update(event).set({ exceptions: [...new Set([...e.exceptions, date])], ...touched(deviceId) }).where(eq(event.id, id)).run();
    },

    listTasks() {
      return db.select().from(task).where(alive(task)).all();
    },
    getTask(id: string) {
      return db.select().from(task).where(eq(task.id, id)).get();
    },
    listSubtasks(taskId: string) {
      return db.select().from(subtask).where(and(eq(subtask.taskId, taskId), alive(subtask))).orderBy(asc(subtask.position)).all();
    },
    saveTask(input: TaskInput, id?: string) {
      if (id) {
        db.update(task).set({ ...input, ...touched(deviceId) }).where(eq(task.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(task).values({ id: newId, ...input, ...created(deviceId) }).run();
      return newId;
    },
    deleteTask(id: string) {
      db.update(task).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(task.id, id)).run();
    },
    completeTask(t: TaskLike, today: string) {
      db.transaction((tx) => {
        tx.update(task).set({ completedAt: nowIso(), ...touched(deviceId) }).where(eq(task.id, t.id)).run();
        const next = nextRecurringDue(t, today);
        if (!next) return;
        const source = tx.select().from(task).where(eq(task.id, t.id)).get();
        if (!source) return;
        const newId = uuid();
        tx.insert(task)
          .values({ ...source, id: newId, dueDate: next, focusDate: null, completedAt: null, postponedCount: 0, ...created(deviceId) })
          .run();
        const subs = tx.select().from(subtask).where(and(eq(subtask.taskId, t.id), alive(subtask))).all();
        if (subs.length) tx.insert(subtask).values(subs.map((s) => ({ ...s, id: uuid(), taskId: newId, done: false, ...created(deviceId) }))).run();
      });
    },
    reopenTask(id: string, today: string) {
      db.transaction((tx) => {
        const t = tx.select().from(task).where(eq(task.id, id)).get();
        if (!t?.completedAt) return;
        const next = nextRecurringDue(t, today);
        if (next) {
          const spawned = tx
            .select()
            .from(task)
            .where(and(eq(task.title, t.title), eq(task.dueDate, next), isNull(task.completedAt), alive(task)))
            .all()
            .find((x) => x.createdAt >= t.completedAt!);
          if (spawned) tx.update(task).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(task.id, spawned.id)).run();
        }
        tx.update(task).set({ completedAt: null, ...touched(deviceId) }).where(eq(task.id, id)).run();
      });
    },
    postponeTask(t: TaskLike, today: string) {
      db.update(task).set({ ...postpone(t, today), ...touched(deviceId) }).where(eq(task.id, t.id)).run();
    },
    setFocus(id: string, date: string | null) {
      db.update(task).set({ focusDate: date, ...touched(deviceId) }).where(eq(task.id, id)).run();
    },
    addSubtask(taskId: string, title: string) {
      const existing = this.listSubtasks(taskId);
      db.insert(subtask).values({ id: uuid(), taskId, title, done: false, position: nextPosition(existing), ...created(deviceId) }).run();
    },
    toggleSubtask(id: string, done: boolean) {
      db.update(subtask).set({ done, ...touched(deviceId) }).where(eq(subtask.id, id)).run();
    },
    deleteSubtask(id: string) {
      db.update(subtask).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(subtask.id, id)).run();
    },

    listRoutines() {
      return db.select().from(routine).where(alive(routine)).orderBy(asc(routine.position)).all();
    },
    getRoutine(id: string) {
      return db.select().from(routine).where(eq(routine.id, id)).get();
    },
    listRoutineItems(routineId: string) {
      return db.select().from(routineItem).where(and(eq(routineItem.routineId, routineId), alive(routineItem))).orderBy(asc(routineItem.position)).all();
    },
    checksFor(routineId: string, date: string) {
      const items = this.listRoutineItems(routineId);
      if (!items.length) return new Set<string>();
      const rows = db
        .select({ itemId: routineCheck.routineItemId })
        .from(routineCheck)
        .where(and(eq(routineCheck.date, date), alive(routineCheck), inArray(routineCheck.routineItemId, items.map((i) => i.id))))
        .all();
      return new Set(rows.map((r) => r.itemId));
    },
    toggleRoutineItem(itemId: string, date: string, checked: boolean) {
      if (checked) {
        db.insert(routineCheck)
          .values({ id: uuid(), routineItemId: itemId, date, ...created(deviceId) })
          .onConflictDoUpdate({ target: [routineCheck.routineItemId, routineCheck.date], set: { deletedAt: null, ...touched(deviceId) } })
          .run();
      } else {
        db.update(routineCheck)
          .set({ deletedAt: nowIso(), ...touched(deviceId) })
          .where(and(eq(routineCheck.routineItemId, itemId), eq(routineCheck.date, date)))
          .run();
      }
    },
    saveRoutine(input: RoutineInput, id?: string) {
      return db.transaction((tx) => {
        const { items, ...fields } = input;
        let routineId = id;
        if (routineId) {
          tx.update(routine).set({ ...fields, ...touched(deviceId) }).where(eq(routine.id, routineId)).run();
        } else {
          routineId = uuid();
          const count = tx.select({ id: routine.id }).from(routine).all().length;
          tx.insert(routine).values({ id: routineId, ...fields, position: count, ...created(deviceId) }).run();
        }
        const current = tx.select().from(routineItem).where(and(eq(routineItem.routineId, routineId), alive(routineItem))).orderBy(asc(routineItem.position)).all();
        const titles = items.map((t) => t.trim()).filter(Boolean);
        titles.forEach((title, position) => {
          const existing = current[position];
          if (existing) tx.update(routineItem).set({ title, position, ...touched(deviceId) }).where(eq(routineItem.id, existing.id)).run();
          else tx.insert(routineItem).values({ id: uuid(), routineId: routineId!, title, position, ...created(deviceId) }).run();
        });
        for (const extra of current.slice(titles.length)) {
          tx.update(routineItem).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(routineItem.id, extra.id)).run();
        }
        return routineId;
      });
    },
    deleteRoutine(id: string) {
      db.update(routine).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(routine.id, id)).run();
    },

    listLists({ archived = false } = {}) {
      return db
        .select()
        .from(list)
        .where(alive(list))
        .orderBy(asc(list.position))
        .all()
        .filter((l) => (archived ? l.archivedAt !== null : l.archivedAt === null));
    },
    getList(id: string) {
      return db.select().from(list).where(eq(list.id, id)).get();
    },
    listItems(listId: string) {
      return db.select().from(listItem).where(and(eq(listItem.listId, listId), alive(listItem))).orderBy(asc(listItem.position)).all();
    },
    allListItems() {
      return db.select({ listId: listItem.listId, checked: listItem.checked }).from(listItem).where(alive(listItem)).all();
    },
    createList(title: string, type: string, templateId?: string) {
      const id = uuid();
      const position = nextPosition(this.listLists());
      const template = LIST_TEMPLATES.find((t) => t.id === templateId);
      db.transaction((tx) => {
        tx.insert(list).values({ id, title: title.trim(), type, position, ...created(deviceId) }).run();
        if (template?.items.length) {
          tx.insert(listItem)
            .values(template.items.map((it, i) => ({ id: uuid(), listId: id, title: it.title, quantity: it.quantity ?? null, position: i, isUserEdited: false, ...created(deviceId) })))
            .run();
        }
      });
      return id;
    },
    updateList(id: string, patch: { title?: string; notes?: string | null; type?: string }) {
      db.update(list).set({ ...patch, ...touched(deviceId) }).where(eq(list.id, id)).run();
    },
    archiveList(id: string, archived: boolean) {
      db.update(list).set({ archivedAt: archived ? nowIso() : null, ...touched(deviceId) }).where(eq(list.id, id)).run();
    },
    deleteList(id: string) {
      db.update(list).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(list.id, id)).run();
    },
    duplicateList(id: string) {
      const source = this.getList(id);
      if (!source) return null;
      const newId = uuid();
      const items = this.listItems(id);
      db.transaction((tx) => {
        tx.insert(list)
          .values({ ...source, id: newId, title: duplicateTitle(source.title), archivedAt: null, position: nextPosition(this.listLists()), ...created(deviceId) })
          .run();
        if (items.length) tx.insert(listItem).values(items.map((it) => ({ ...it, id: uuid(), listId: newId, checked: false, ...created(deviceId) }))).run();
      });
      return newId;
    },
    addListItem(listId: string, title: string, quantity: string | null) {
      const position = nextPosition(this.listItems(listId));
      db.insert(listItem).values({ id: uuid(), listId, title: title.trim(), quantity, position, ...created(deviceId) }).run();
    },
    updateListItem(id: string, patch: { title?: string; quantity?: string | null; notes?: string | null; checked?: boolean }) {
      const edits = patch.title !== undefined || patch.quantity !== undefined || patch.notes !== undefined ? { isUserEdited: true } : {};
      db.update(listItem).set({ ...patch, ...edits, ...touched(deviceId) }).where(eq(listItem.id, id)).run();
    },
    deleteListItem(id: string) {
      db.update(listItem).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(listItem.id, id)).run();
    },
    setPositions(table: 'list' | 'listItem', updates: { id: string; position: number }[]) {
      const t = table === 'list' ? list : listItem;
      db.transaction((tx) => {
        for (const u of updates) tx.update(t).set({ position: u.position, ...touched(deviceId) }).where(eq(t.id, u.id)).run();
      });
    },
    clearChecked(listId: string) {
      db.update(listItem).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(and(eq(listItem.listId, listId), eq(listItem.checked, true))).run();
    },

    dumpAll() {
      return {
        event: db.select().from(event).all(),
        task: db.select().from(task).all(),
        subtask: db.select().from(subtask).all(),
        routine: db.select().from(routine).all(),
        routineItem: db.select().from(routineItem).all(),
        routineCheck: db.select().from(routineCheck).all(),
        list: db.select().from(list).all(),
        listItem: db.select().from(listItem).all(),
      };
    },
  };
}

export type OrganisationRepository = ReturnType<typeof createOrganisationRepository>;
