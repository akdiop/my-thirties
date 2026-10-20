import { and, asc, desc, eq, gte, isNull, lte } from 'drizzle-orm';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

import { formatQty, RECIPE_LIBRARY, type Ingredient, type ShoppingLine } from '@/cuisine/cuisine';
import { PACKING_ITEMS, PREPARATION_ITEMS, type TripItemKind, type TripStatus } from '@/decouvertes/trips';
import type { Database } from '@/db/client';
import {
  budget,
  event,
  fxRate,
  list,
  listItem,
  mealPlan,
  moneyTx,
  pantryItem,
  passion,
  passionLog,
  passionStep,
  recipe,
  savingsGoal,
  subscription,
  trip,
  tripItem,
} from '@/db/schema';
import { nextDue, type Currency, type Frequency } from '@/finances/money';
import { nextPosition } from '@/lists/lists';
import { defaultPath } from '@/passions/passions';
import { uuid } from '@/security/random';
import { created, nowIso, touched } from './stamp';

const alive = (t: { deletedAt: AnySQLiteColumn }) => isNull(t.deletedAt);

export type TxInput = { date: string; kind: 'income' | 'expense'; amountMinor: number; currency: Currency; category: string; label: string | null; notes: string | null; tripId: string | null };
export type SubscriptionInput = { name: string; amountMinor: number; currency: Currency; frequency: Frequency; nextDate: string; category: string; remindDays: number | null };
export type GoalInput = { title: string; targetMinor: number; currency: Currency; deadline: string | null };
export type RecipeInput = {
  title: string;
  origin: string;
  category: string;
  servings: number;
  prepMin: number | null;
  cookMin: number | null;
  ingredients: Ingredient[];
  steps: string[];
  storage: string | null;
  notes: string | null;
};
export type TripInput = { title: string; destination: string; startDate: string | null; endDate: string | null; status: TripStatus; budgetMinor: number | null; currency: Currency; notes: string | null };
export type TripItemInput = { kind: TripItemKind; date: string | null; time: string | null; title: string; notes: string | null };

export function createLifeRepository(db: Database, deviceId: string) {
  const softDelete = <T extends typeof moneyTx | typeof subscription | typeof savingsGoal | typeof recipe | typeof mealPlan | typeof pantryItem | typeof trip | typeof tripItem | typeof passion | typeof passionStep | typeof passionLog>(
    table: T,
    id: string,
  ) => {
    // Toutes ces tables partagent id et deletedAt ; drizzle ne sait pas typer la mise à jour sur l’union.
    const t = table as unknown as typeof moneyTx;
    db.update(t).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(t.id, id)).run();
  };

  function createLinkedList(title: string, type: string, items: string[], sourceType: string, sourceId: string) {
    const id = uuid();
    const position = nextPosition(db.select({ id: list.id, position: list.position }).from(list).where(alive(list)).all());
    db.transaction((tx) => {
      tx.insert(list).values({ id, title, type, position, sourceType, sourceId, ...created(deviceId) }).run();
      if (items.length) tx.insert(listItem).values(items.map((t, i) => ({ id: uuid(), listId: id, title: t, position: i, isUserEdited: false, ...created(deviceId) }))).run();
    });
    return id;
  }

  const listAlive = (id: string | null) => (id ? db.select().from(list).where(and(eq(list.id, id), alive(list))).get() : undefined);

  function addEvent(title: string, date: string, startTime: string | null, notes: string | null, sourceType: string, sourceId: string, category = 'perso') {
    const id = uuid();
    db.insert(event)
      .values({ id, title, date, startTime, endTime: null, category, location: null, notes, recurrence: null, exceptions: [], reminderMinutes: startTime ? 60 : null, sourceType, sourceId, ...created(deviceId) })
      .run();
    return id;
  }

  return {
    // Finances
    listTx(from: string, to: string) {
      return db.select().from(moneyTx).where(and(gte(moneyTx.date, from), lte(moneyTx.date, to), alive(moneyTx))).orderBy(desc(moneyTx.date), desc(moneyTx.createdAt)).all();
    },
    getTx(id: string) {
      return db.select().from(moneyTx).where(eq(moneyTx.id, id)).get();
    },
    saveTx(input: TxInput, id?: string) {
      if (id) {
        db.update(moneyTx).set({ ...input, ...touched(deviceId) }).where(eq(moneyTx.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(moneyTx).values({ id: newId, ...input, subscriptionId: null, ...created(deviceId) }).run();
      return newId;
    },
    deleteTx(id: string) {
      softDelete(moneyTx, id);
    },
    tripTx(tripId: string) {
      return db.select().from(moneyTx).where(and(eq(moneyTx.tripId, tripId), alive(moneyTx))).orderBy(desc(moneyTx.date)).all();
    },

    listSubscriptions({ ended = false } = {}) {
      return db
        .select()
        .from(subscription)
        .where(alive(subscription))
        .orderBy(asc(subscription.nextDate))
        .all()
        .filter((s) => (ended ? s.endedAt !== null : s.endedAt === null));
    },
    getSubscription(id: string) {
      return db.select().from(subscription).where(eq(subscription.id, id)).get();
    },
    saveSubscription(input: SubscriptionInput, id?: string) {
      if (id) {
        db.update(subscription).set({ ...input, ...touched(deviceId) }).where(eq(subscription.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(subscription).values({ id: newId, ...input, endedAt: null, ...created(deviceId) }).run();
      return newId;
    },
    /** Enregistre le prélèvement comme dépense et avance l’échéance. */
    paySubscription(id: string, date: string) {
      const s = this.getSubscription(id);
      if (!s) return;
      db.transaction((tx) => {
        tx.insert(moneyTx)
          .values({ id: uuid(), date, kind: 'expense', amountMinor: s.amountMinor, currency: s.currency, category: s.category, label: s.name, notes: null, subscriptionId: s.id, tripId: null, ...created(deviceId) })
          .run();
        tx.update(subscription).set({ nextDate: nextDue(s.nextDate, s.frequency), ...touched(deviceId) }).where(eq(subscription.id, id)).run();
      });
    },
    endSubscription(id: string, date: string | null) {
      db.update(subscription).set({ endedAt: date, ...touched(deviceId) }).where(eq(subscription.id, id)).run();
    },
    deleteSubscription(id: string) {
      softDelete(subscription, id);
    },

    listBudgets() {
      return db.select().from(budget).where(alive(budget)).all();
    },
    setBudget(category: string, amountMinor: number | null, currency: Currency) {
      if (amountMinor === null) {
        db.update(budget).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(budget.category, category)).run();
        return;
      }
      db.insert(budget)
        .values({ id: uuid(), category, amountMinor, currency, ...created(deviceId) })
        .onConflictDoUpdate({ target: budget.category, set: { amountMinor, currency, deletedAt: null, ...touched(deviceId) } })
        .run();
    },

    listGoals() {
      return db.select().from(savingsGoal).where(alive(savingsGoal)).orderBy(asc(savingsGoal.createdAt)).all();
    },
    saveGoal(input: GoalInput, id?: string) {
      if (id) {
        db.update(savingsGoal).set({ ...input, ...touched(deviceId) }).where(eq(savingsGoal.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(savingsGoal).values({ id: newId, ...input, savedMinor: 0, ...created(deviceId) }).run();
      return newId;
    },
    addToGoal(id: string, deltaMinor: number) {
      const g = db.select().from(savingsGoal).where(eq(savingsGoal.id, id)).get();
      if (!g) return;
      db.update(savingsGoal).set({ savedMinor: Math.max(0, g.savedMinor + deltaMinor), ...touched(deviceId) }).where(eq(savingsGoal.id, id)).run();
    },
    deleteGoal(id: string) {
      softDelete(savingsGoal, id);
    },

    latestRate() {
      return db.select().from(fxRate).where(alive(fxRate)).orderBy(desc(fxRate.date)).get();
    },
    saveRate(date: string, usdPerEur: number, source: string) {
      db.insert(fxRate)
        .values({ date, usdPerEur, source, ...created(deviceId) })
        .onConflictDoUpdate({ target: fxRate.date, set: { usdPerEur, source, deletedAt: null, ...touched(deviceId) } })
        .run();
    },

    // Cuisine
    listRecipes() {
      return db.select().from(recipe).where(alive(recipe)).orderBy(asc(recipe.title)).all();
    },
    getRecipe(id: string) {
      return db.select().from(recipe).where(eq(recipe.id, id)).get();
    },
    saveRecipe(input: RecipeInput, id?: string) {
      if (id) {
        db.update(recipe).set({ ...input, ...touched(deviceId) }).where(eq(recipe.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(recipe).values({ id: newId, ...input, batchFriendly: true, libraryId: null, ...created(deviceId) }).run();
      return newId;
    },
    importRecipe(libraryId: string) {
      const existing = db.select().from(recipe).where(and(eq(recipe.libraryId, libraryId), alive(recipe))).get();
      if (existing) return existing.id;
      const r = RECIPE_LIBRARY.find((x) => x.libraryId === libraryId);
      if (!r) throw new Error('Recette introuvable.');
      const id = uuid();
      db.insert(recipe).values({ id, ...r, batchFriendly: true, notes: null, ...created(deviceId) }).run();
      return id;
    },
    deleteRecipe(id: string) {
      softDelete(recipe, id);
    },

    mealsBetween(from: string, to: string) {
      return db.select().from(mealPlan).where(and(gte(mealPlan.date, from), lte(mealPlan.date, to), alive(mealPlan))).orderBy(asc(mealPlan.date), asc(mealPlan.slot)).all();
    },
    planMeal(date: string, slot: 'dejeuner' | 'diner', recipeId: string | null, title: string, portions: number) {
      const existing = db.select().from(mealPlan).where(and(eq(mealPlan.date, date), eq(mealPlan.slot, slot), alive(mealPlan))).get();
      if (existing) {
        db.update(mealPlan).set({ recipeId, title, portions, ...touched(deviceId) }).where(eq(mealPlan.id, existing.id)).run();
        return existing.id;
      }
      const id = uuid();
      db.insert(mealPlan).values({ id, date, slot, recipeId, title, portions, ...created(deviceId) }).run();
      return id;
    },
    deleteMeal(id: string) {
      softDelete(mealPlan, id);
    },

    listPantry() {
      return db.select().from(pantryItem).where(alive(pantryItem)).orderBy(asc(pantryItem.name)).all();
    },
    savePantryItem(name: string, qty: number | null, unit: string) {
      db.insert(pantryItem).values({ id: uuid(), name: name.trim(), qty, unit, ...created(deviceId) }).run();
    },
    deletePantryItem(id: string) {
      softDelete(pantryItem, id);
    },

    /** Crée (ou complète) la liste de courses de la semaine dans Mes listes, sans toucher aux articles déjà cochés ou modifiés. */
    syncShoppingList(weekStart: string, lines: ShoppingLine[]) {
      const existing = db.select().from(list).where(and(eq(list.sourceType, 'batch'), eq(list.sourceId, weekStart), alive(list))).get();
      if (!existing) {
        const id = createLinkedList(`Courses batch · semaine du ${weekStart.slice(8, 10)}/${weekStart.slice(5, 7)}`, 'courses', [], 'batch', weekStart);
        db.insert(listItem)
          .values(lines.map((l, i) => ({ id: uuid(), listId: id, title: l.name, quantity: formatQty(l) || null, position: i, isUserEdited: false, ...created(deviceId) })))
          .run();
        return id;
      }
      const items = db.select().from(listItem).where(and(eq(listItem.listId, existing.id), alive(listItem))).all();
      const keep = new Set(items.filter((i) => i.checked || i.isUserEdited).map((i) => i.title.toLowerCase()));
      db.transaction((tx) => {
        for (const i of items) if (!i.checked && !i.isUserEdited) tx.update(listItem).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(listItem.id, i.id)).run();
        let position = nextPosition(items);
        for (const l of lines) {
          if (keep.has(l.name.toLowerCase())) continue;
          tx.insert(listItem).values({ id: uuid(), listId: existing.id, title: l.name, quantity: formatQty(l) || null, position: position++, isUserEdited: false, ...created(deviceId) }).run();
        }
      });
      return existing.id;
    },
    scheduleBatch(date: string, time: string | null, notes: string, weekStart: string) {
      return addEvent('Session batch cooking', date, time, notes, 'batch', weekStart);
    },

    // Découvertes
    listTrips() {
      return db.select().from(trip).where(alive(trip)).orderBy(asc(trip.startDate), asc(trip.createdAt)).all();
    },
    getTrip(id: string) {
      return db.select().from(trip).where(eq(trip.id, id)).get();
    },
    saveTrip(input: TripInput, id?: string) {
      if (id) {
        db.update(trip).set({ ...input, ...touched(deviceId) }).where(eq(trip.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(trip).values({ id: newId, ...input, checklistId: null, packingListId: null, ...created(deviceId) }).run();
      return newId;
    },
    deleteTrip(id: string) {
      softDelete(trip, id);
    },
    /** Ouvre (ou recrée si supprimée) la liste liée au voyage. */
    tripList(id: string, which: 'checklist' | 'packing') {
      const t = this.getTrip(id);
      if (!t) throw new Error('Voyage introuvable.');
      const current = which === 'checklist' ? t.checklistId : t.packingListId;
      if (listAlive(current)) return current!;
      const listId =
        which === 'checklist'
          ? createLinkedList(`Préparatifs · ${t.title}`, 'voyage', PREPARATION_ITEMS, 'trip', id)
          : createLinkedList(`Valise · ${t.title}`, 'valise', PACKING_ITEMS, 'trip', id);
      db.update(trip)
        .set({ ...(which === 'checklist' ? { checklistId: listId } : { packingListId: listId }), ...touched(deviceId) })
        .where(eq(trip.id, id))
        .run();
      return listId;
    },
    addTripToAgenda(id: string) {
      const t = this.getTrip(id);
      if (!t?.startDate) return;
      const already = db.select().from(event).where(and(eq(event.sourceType, 'trip'), eq(event.sourceId, id), alive(event))).all();
      for (const e of already) db.update(event).set({ deletedAt: nowIso(), ...touched(deviceId) }).where(eq(event.id, e.id)).run();
      addEvent(`Départ · ${t.destination}`, t.startDate, null, t.title, 'trip', id);
      if (t.endDate && t.endDate !== t.startDate) addEvent(`Retour · ${t.destination}`, t.endDate, null, t.title, 'trip', id);
    },

    tripItems(tripId: string) {
      return db.select().from(tripItem).where(and(eq(tripItem.tripId, tripId), alive(tripItem))).orderBy(asc(tripItem.date), asc(tripItem.time), asc(tripItem.createdAt)).all();
    },
    saveTripItem(tripId: string, input: TripItemInput, id?: string) {
      if (id) {
        db.update(tripItem).set({ ...input, ...touched(deviceId) }).where(eq(tripItem.id, id)).run();
        return id;
      }
      const newId = uuid();
      db.insert(tripItem).values({ id: newId, tripId, ...input, done: false, ...created(deviceId) }).run();
      return newId;
    },
    toggleTripItem(id: string, done: boolean) {
      db.update(tripItem).set({ done, ...touched(deviceId) }).where(eq(tripItem.id, id)).run();
    },
    deleteTripItem(id: string) {
      softDelete(tripItem, id);
    },

    // Passions
    listPassions() {
      return db.select().from(passion).where(alive(passion)).orderBy(asc(passion.createdAt)).all();
    },
    getPassion(id: string) {
      return db.select().from(passion).where(eq(passion.id, id)).get();
    },
    createPassion(title: string, why: string | null, horizonMonths: 6 | 12, startDate: string) {
      const id = uuid();
      db.transaction((tx) => {
        tx.insert(passion).values({ id, title: title.trim(), why, horizonMonths, startDate, status: 'active', materialsListId: null, ...created(deviceId) }).run();
        tx.insert(passionStep)
          .values(defaultPath(horizonMonths, startDate).map((s, i) => ({ id: uuid(), passionId: id, title: s.title, targetDate: s.targetDate, doneAt: null, position: i, ...created(deviceId) })))
          .run();
      });
      return id;
    },
    updatePassion(id: string, patch: { title?: string; why?: string | null; status?: 'active' | 'paused' | 'done' }) {
      db.update(passion).set({ ...patch, ...touched(deviceId) }).where(eq(passion.id, id)).run();
    },
    deletePassion(id: string) {
      softDelete(passion, id);
    },
    passionSteps(passionId: string) {
      return db.select().from(passionStep).where(and(eq(passionStep.passionId, passionId), alive(passionStep))).orderBy(asc(passionStep.position)).all();
    },
    addPassionStep(passionId: string, title: string, targetDate: string | null) {
      const position = nextPosition(this.passionSteps(passionId));
      db.insert(passionStep).values({ id: uuid(), passionId, title: title.trim(), targetDate, doneAt: null, position, ...created(deviceId) }).run();
    },
    updatePassionStep(id: string, patch: { title?: string; targetDate?: string | null; doneAt?: string | null }) {
      db.update(passionStep).set({ ...patch, ...touched(deviceId) }).where(eq(passionStep.id, id)).run();
    },
    deletePassionStep(id: string) {
      softDelete(passionStep, id);
    },
    passionLogs(passionId: string) {
      return db.select().from(passionLog).where(and(eq(passionLog.passionId, passionId), alive(passionLog))).orderBy(desc(passionLog.date), desc(passionLog.createdAt)).all();
    },
    addPassionLog(passionId: string, date: string, minutes: number | null, text: string) {
      db.insert(passionLog).values({ id: uuid(), passionId, date, minutes, text: text.trim(), ...created(deviceId) }).run();
    },
    deletePassionLog(id: string) {
      softDelete(passionLog, id);
    },
    materialsList(id: string) {
      const p = this.getPassion(id);
      if (!p) throw new Error('Passion introuvable.');
      if (listAlive(p.materialsListId)) return p.materialsListId!;
      const listId = createLinkedList(`Matériel · ${p.title}`, 'achats', [], 'passion', id);
      db.update(passion).set({ materialsListId: listId, ...touched(deviceId) }).where(eq(passion.id, id)).run();
      return listId;
    },
    schedulePassionSession(id: string, date: string, time: string | null) {
      const p = this.getPassion(id);
      if (!p) return;
      addEvent(p.title, date, time, null, 'passion', id);
    },

    dumpAll() {
      return {
        moneyTx: db.select().from(moneyTx).all(),
        subscription: db.select().from(subscription).all(),
        budget: db.select().from(budget).all(),
        savingsGoal: db.select().from(savingsGoal).all(),
        fxRate: db.select().from(fxRate).all(),
        recipe: db.select().from(recipe).all(),
        mealPlan: db.select().from(mealPlan).all(),
        pantryItem: db.select().from(pantryItem).all(),
        trip: db.select().from(trip).all(),
        tripItem: db.select().from(tripItem).all(),
        passion: db.select().from(passion).all(),
        passionStep: db.select().from(passionStep).all(),
        passionLog: db.select().from(passionLog).all(),
      };
    },
  };
}

export type LifeRepository = ReturnType<typeof createLifeRepository>;
