/**
 * @jest-environment node
 */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import type { Database as AppDatabase } from '@/db/client';
import * as schema from '@/db/schema';
import { shoppingList } from '@/cuisine/cuisine';
import { createLifeRepository } from './life';
import { createOrganisationRepository } from './organisation';

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


describe('life repository (SQLite)', () => {
  let life: ReturnType<typeof createLifeRepository>;
  let org: ReturnType<typeof createOrganisationRepository>;
  beforeEach(() => {
    const db = openTestDb();
    life = createLifeRepository(db, 'device-test');
    org = createOrganisationRepository(db, 'device-test');
  });

  it('records a subscription payment as an expense and rolls the due date', () => {
    const id = life.saveSubscription({ name: 'Musique', amountMinor: 1099, currency: 'EUR', frequency: 'monthly', nextDate: '2026-10-31', category: 'Abonnements', remindDays: 2 });
    life.paySubscription(id, '2026-10-31');
    expect(life.getSubscription(id)?.nextDate).toBe('2026-11-30');
    expect(life.listTx('2026-10-01', '2026-10-31')).toMatchObject([{ kind: 'expense', amountMinor: 1099, label: 'Musique', subscriptionId: id }]);
  });

  it('upserts budgets per category and clears them', () => {
    life.setBudget('Alimentation', 150000, 'XOF');
    life.setBudget('Alimentation', 120000, 'XOF');
    expect(life.listBudgets()).toMatchObject([{ category: 'Alimentation', amountMinor: 120000 }]);
    life.setBudget('Alimentation', null, 'XOF');
    expect(life.listBudgets()).toEqual([]);
  });

  it('never lets savings go negative', () => {
    const id = life.saveGoal({ title: 'Voyage', targetMinor: 500000, currency: 'XOF', deadline: null });
    life.addToGoal(id, 20000);
    life.addToGoal(id, -50000);
    expect(life.listGoals()[0]?.savedMinor).toBe(0);
  });

  it('imports a library recipe once and builds the shopping list without overwriting checked items', () => {
    const a = life.importRecipe('mafe');
    expect(life.importRecipe('mafe')).toBe(a);
    life.planMeal('2026-10-19', 'diner', a, 'Mafé', 2);
    life.planMeal('2026-10-19', 'diner', a, 'Mafé', 4);
    expect(life.mealsBetween('2026-10-19', '2026-10-25')).toHaveLength(1);
    const rec = life.getRecipe(a)!;
    const listId = life.syncShoppingList('2026-10-19', shoppingList([{ recipe: rec, portions: 4 }], []));
    const items = org.listItems(listId);
    expect(items.find((i) => i.title === 'Riz')?.quantity).toBe('400 g');
    org.updateListItem(items[0]!.id, { checked: true });
    expect(life.syncShoppingList('2026-10-19', shoppingList([{ recipe: rec, portions: 8 }], []))).toBe(listId);
    const after = org.listItems(listId);
    expect(after.filter((i) => i.title === items[0]!.title)).toHaveLength(1);
    expect(after.find((i) => i.title === 'Riz')?.quantity).toBe('800 g');
  });

  it('links trip lists, expenses and agenda events', () => {
    const id = life.saveTrip({ title: 'Lisbonne', destination: 'Lisbonne', startDate: '2026-12-20', endDate: '2026-12-27', status: 'planned', budgetMinor: 80000, currency: 'EUR', notes: null });
    const listId = life.tripList(id, 'packing');
    expect(life.tripList(id, 'packing')).toBe(listId);
    org.deleteList(listId);
    expect(life.tripList(id, 'packing')).not.toBe(listId);
    life.saveTx({ date: '2026-11-02', kind: 'expense', amountMinor: 23000, currency: 'EUR', category: 'Voyages', label: 'Vol', notes: null, tripId: id });
    expect(life.tripTx(id)).toHaveLength(1);
    life.addTripToAgenda(id);
    life.addTripToAgenda(id);
    expect(org.listEvents().map((e) => e.title)).toEqual(['Départ · Lisbonne', 'Retour · Lisbonne']);
  });

  it('creates a passion with its path, logs and materials list', () => {
    const id = life.createPassion('Céramique', 'Créer de mes mains', 6, '2026-10-20');
    expect(life.passionSteps(id)).toHaveLength(6);
    life.addPassionLog(id, '2026-10-20', 90, 'Premier atelier');
    expect(life.passionLogs(id)[0]).toMatchObject({ minutes: 90 });
    expect(org.getList(life.materialsList(id))?.title).toBe('Matériel · Céramique');
  });
});
