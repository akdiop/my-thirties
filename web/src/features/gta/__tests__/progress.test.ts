import { describe, expect, it } from 'vitest';
import { GALLERY, MISSIONS, MONEY_PLACES, QUESTLINES, rewardOf } from '../data';
import { addCollection, emptyProgress, exportProgress, mergeProgress, migrateProgress, missionDone, missionStats, moneyTotals, parseExport, rewardLinks, setMission, setMoney, toggleStep } from '../progress';
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
    expect(rewardOf(MISSIONS.find((m) => m.id === 'C02-12')!)?.verified).toBe(false);
    expect(rewardOf(MISSIONS.find((m) => m.title.startsWith('Island Dreams'))!)?.verified).toBe(false);
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

describe('Calcul des gains', () => {
  const links = rewardLinks(MISSIONS, rewardOf);
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
    const island = MISSIONS.find((m) => m.title.startsWith('Island Dreams'))!;
    let p = setMission(emptyProgress(), island.id, { completed: true }, today);
    expect(moneyTotals(MONEY_PLACES, p, links)).toMatchObject({ verifiedRewards: 0, pendingRewards: 400 });
    p = setMission(p, vcia.id, { completed: true }, today);
    expect(moneyTotals(MONEY_PLACES, p, links).verifiedRewards).toBe(250000);
  });
});
