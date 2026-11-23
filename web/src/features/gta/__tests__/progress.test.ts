import { describe, expect, it } from 'vitest';
import { DETAILS, GALLERY, MISSIONS, MONEY_PLACES, QUESTLINES, REWARD_ROWS, SIDE_MISSIONS, rewardOf } from '../data';
import { toggleCheck, addCollection, emptyProgress, exportProgress, mergeProgress, migrateProgress, missionDone, missionStats, moneyTotals, parseExport, setCount, setMission, setMoney, toggleStep } from '../progress';
import { CENT_ITEMS, centDone, centValue } from '../centPourCent';
import { PELICAN, PELICAN_ID } from '../pelican';

const today = '2026-11-23';

describe('Référentiel GTA VI', () => {
  it('charge les 148 missions des chapitres 1 à 5 avec des identifiants uniques', () => {
    expect(MISSIONS).toHaveLength(148);
    expect(new Set(MISSIONS.map((m) => m.id)).size).toBe(148);
    expect(new Set(MISSIONS.map((m) => m.chapter))).toEqual(new Set([1, 2, 3, 4, 5]));
  });
  it('charge les 17 arcs, les 4 caches et la galerie', () => {
    expect(QUESTLINES).toHaveLength(17);
    expect(MONEY_PLACES.map((p) => p.id)).toContain(PELICAN_ID);
    expect(GALLERY.find((g) => g.id === 'pelican-swamps-overview')?.local_file).toBe('carte_marais_pelican_valley.jpg');
  });
  it('ne déclare vérifiée qu’une récompense confirmée par la source', () => {
    const vcia = MISSIONS.find((m) => m.id === 'C04-34')!;
    expect(rewardOf(vcia)).toMatchObject({ amount: 250000, verified: true });
    expect(rewardOf(MISSIONS.find((m) => m.title.startsWith('Thrillbillies'))!)).toMatchObject({ amount: 2500, verified: false });
    expect(rewardOf(MISSIONS.find((m) => m.title.startsWith('Island Dreams'))!)).toMatchObject({ amount: 400, verified: true });
  });
  it('relie les fiches PowerPyx traduites aux missions et ajoute les annexes', () => {
    expect(Object.keys(DETAILS).every((id) => MISSIONS.some((m) => m.id === id))).toBe(true);
    expect(Object.keys(DETAILS).length).toBeGreaterThanOrEqual(140);
    expect(new Set(SIDE_MISSIONS.map((x) => x.id)).size).toBe(SIDE_MISSIONS.length);
    expect(SIDE_MISSIONS.every((x) => !MISSIONS.some((m) => m.id === x.id))).toBe(true);
    expect(REWARD_ROWS.some((r) => r.missionId.startsWith('SF-') && r.verified)).toBe(true);
  });
});

describe('Progression', () => {
  it('reprise : 12 missions cochées survivent à la fermeture, à une mise à jour des données et à l’export/import', () => {
    let p = emptyProgress();
    const ids = MISSIONS.slice(0, 12).map((m) => m.id);
    for (const id of ids) p = setMission(p, id, { completed: true }, today);
    // « fermer / rouvrir » : la donnée enregistrée est du JSON relu par migrateProgress
    const reopened = migrateProgress(JSON.parse(JSON.stringify(p)));
    expect(ids.every((id) => missionDone(reopened, id))).toBe(true);
    // « mise à jour du JSON » : le référentiel change (mission retirée, mission ajoutée) sans toucher l’état
    const updated = [...MISSIONS.slice(1), { ...MISSIONS[0]!, id: 'C06-01', chapter: 5 }];
    const stats = missionStats(updated, reopened);
    expect(stats.done).toBe(11);
    expect(stats.orphans).toEqual([ids[0]]);
    expect(missionDone(reopened, ids[0]!)).toBe(true);
    // export puis import dans un état vide
    const restored = mergeProgress(emptyProgress(), parseExport(exportProgress(reopened, '0.3.0')));
    expect(ids.every((id) => missionDone(restored, id))).toBe(true);
    expect(restored.missions[ids[0]!]?.dateCompleted).toBe(today);
  });
  it('décocher retire la date, garder une note garde l’entrée', () => {
    let p = setMission(emptyProgress(), 'C01-01', { completed: true, personalNotes: 'caravane' }, today);
    p = setMission(p, 'C01-01', { completed: false }, today);
    expect(p.missions['C01-01']).toEqual({ completed: false, personalNotes: 'caravane' });
  });
  it('garde les cases des astuces après réouverture et import', () => {
    const p = toggleCheck(toggleCheck(emptyProgress(), 'astuce:co02'), 'astuce:v5');
    const reopened = migrateProgress(JSON.parse(JSON.stringify(p)));
    expect(reopened.checks).toEqual({ 'astuce:co02': true, 'astuce:v5': true });
    expect(toggleCheck(reopened, 'astuce:v5').checks).toEqual({ 'astuce:co02': true });
    expect(mergeProgress(emptyProgress(), reopened).checks['astuce:co02']).toBe(true);
  });
  it('refuse un fichier qui n’est pas une sauvegarde', () => {
    expect(() => parseExport('{"a":1}')).toThrow();
    expect(() => parseExport('pas du json')).toThrow();
  });
  it('dédoublonne les collections (casse et accents ignorés)', () => {
    let { progress } = addCollection(emptyProgress(), 'Trophée Skunk Ape', 'trophée');
    const again = addCollection(progress, 'trophee skunk  ape', 'trophée');
    expect(again.duplicate).toBe(true);
    progress = addCollection(progress, 'Trophée Skunk Ape', 'objet').progress;
    expect(progress.collections).toHaveLength(2);
  });
  it('mémorise les étapes d’énigme et passe la cache en « découverte »', () => {
    let p = toggleStep(emptyProgress(), PELICAN_ID, 2);
    p = toggleStep(p, PELICAN_ID, 0);
    const reopened = migrateProgress(JSON.parse(JSON.stringify(p)));
    expect(reopened.money[PELICAN_ID]).toMatchObject({ steps: [0, 2], status: 'decouvert' });
  });
});

describe('Checklist 100 %', () => {
  it('reprend les 35 objectifs du guide avec des identifiants uniques', () => {
    expect(CENT_ITEMS).toHaveLength(35);
    expect(new Set(CENT_ITEMS.map((i) => i.id)).size).toBe(35);
    expect(CENT_ITEMS.every((i) => i.need > 0 && (!i.total || i.total >= i.need))).toBe(true);
  });
  it('garde les compteurs après réouverture et import, borne les valeurs', () => {
    let p = setCount(emptyProgress(), 'flamingos', 42);
    p = setCount(p, 'bills', 205000);
    p = setCount(p, 'stunts', -5);
    const reopened = migrateProgress(JSON.parse(JSON.stringify(p)));
    expect(reopened.counts).toEqual({ flamingos: 42, bills: 205000 });
    expect(setCount(reopened, 'flamingos', 0).counts).toEqual({ bills: 205000 });
    expect(mergeProgress(emptyProgress(), parseExport(exportProgress(reopened, '0.3.0'))).counts.flamingos).toBe(42);
    expect(migrateProgress({ counts: { a: 'x', b: -1, c: 3.6 } }).counts).toEqual({ c: 4 });
  });
  it('l’histoire se déduit des missions, le reste des compteurs', () => {
    const story = CENT_ITEMS.find((i) => i.id === 'story')!;
    const flam = CENT_ITEMS.find((i) => i.id === 'flamingos')!;
    expect(centDone(story, {}, true)).toBe(true);
    expect(centValue(story, { story: 9 }, false)).toBe(0);
    expect(centDone(flam, { flamingos: 99 }, true)).toBe(false);
    expect(centDone(flam, { flamingos: 100 }, true)).toBe(true);
  });
});

describe('Calcul des gains', () => {
  const links = REWARD_ROWS;
  it('10 000 de billets marqués ne sont pas 10 000 en cash disponible', () => {
    const p = setMoney(emptyProgress(), PELICAN_ID, { status: 'butin', cash_recovered: 1100 });
    const t = moneyTotals(MONEY_PLACES, p, links);
    expect(PELICAN.gains.find((g) => g.nature === 'nominal')!.montant).toBe(10000);
    expect(t.cash).toBe(1100);
    expect(t.confirmed).toBe(1100);
    expect(t.nominal).toBeGreaterThanOrEqual(10000);
  });
  it('une valeur convertie ne compte que si Aïda la saisit', () => {
    const p = setMoney(emptyProgress(), PELICAN_ID, { cash_recovered: 1100, converted_amount: 6000 });
    expect(moneyTotals(MONEY_PLACES, p, links).confirmed).toBe(7100);
  });
  it('les estimations des guides n’entrent jamais dans le total réel', () => {
    expect(moneyTotals(MONEY_PLACES, emptyProgress(), links).confirmed).toBe(0);
  });
  it('une récompense compte seulement si elle est vérifiée et la mission terminée', () => {
    const vcia = MISSIONS.find((m) => m.id === 'C04-34')!;
    const thrill = MISSIONS.find((m) => m.title.startsWith('Thrillbillies'))!;
    let p = setMission(emptyProgress(), thrill.id, { completed: true }, today);
    expect(moneyTotals(MONEY_PLACES, p, links)).toMatchObject({ verifiedRewards: 0, pendingRewards: 2500 });
    p = setMission(p, vcia.id, { completed: true }, today);
    expect(moneyTotals(MONEY_PLACES, p, links).verifiedRewards).toBe(250000);
  });
});
