import { describe, expect, it } from 'vitest';
import { ALPHABET, HARAKAT, vocalise } from '../arabe/alphabet';
import { addXp, arabicWordOfDay, boxOf, grade, mastered, PAQUETS, question, session, streak } from '../arabe/jeux';
import { VERBES } from '../arabe/verbes';
import { LESSONS } from '../lessons';

const harf = (id: string) => HARAKAT.find((h) => h.id === id)!;

describe('alphabet et voyelles', () => {
  it('a 28 lettres, dont 14 solaires', () => {
    expect(ALPHABET).toHaveLength(28);
    expect(ALPHABET.filter((x) => x.solar)).toHaveLength(14);
  });
  it('lit chaque lettre vocalisée', () => {
    const ba = ALPHABET[1]!;
    expect(vocalise(ba, harf('fatha'))).toEqual({ ar: 'بَ', ph: 'ba' });
    expect(vocalise(ba, harf('madd-i')).ph).toBe('bî');
    expect(vocalise(ALPHABET[0]!, harf('kasra'))).toEqual({ ar: 'إِ', ph: 'i' });
  });
});

describe('paquets et révisions', () => {
  it('ne contient que des cartes complètes et des identifiants uniques', () => {
    const all = PAQUETS.flatMap((p) => p.cards);
    expect(new Set(all.map((c) => c.id)).size).toBe(all.length);
    for (const c of all) expect(c.ar && c.ph && c.fr).toBeTruthy();
    expect(VERBES).toHaveLength(50);
    for (const v of VERBES) expect(v.ph.every(Boolean)).toBe(true);
  });
  it('monte d’une boîte si je savais, revient à zéro sinon', () => {
    let d = grade({}, 'x', true); d = grade(d, 'x', true); d = grade(d, 'x', true);
    expect(boxOf(d, 'x')).toBe(3); expect(mastered(d)).toBe(1);
    expect(boxOf(grade(d, 'x', false), 'x')).toBe(0);
  });
  it('présente d’abord les cartes à revoir', () => {
    const deck = PAQUETS[1]!.cards;
    const d = Object.fromEntries(deck.map((c, i) => [c.id, i === 2 ? 0 : 4]));
    expect(session({ boxes: d }, deck, 3)[0]!.id).toBe(deck[2]!.id);
  });
  it('propose quatre réponses distinctes dont la bonne', () => {
    const deck = PAQUETS.find((p) => p.id === 'verbes')!.cards;
    const q = question(deck[0]!, deck);
    expect(q).toHaveLength(4);
    expect(q).toContain(deck[0]);
    expect(new Set(q.map((c) => c.fr)).size).toBe(4);
  });
  it('compte les points et la série de jours', () => {
    let d = addXp({}, 5, '2026-11-10'); d = addXp(d, 3, '2026-11-11'); d = addXp(d, 2, '2026-11-12', 9);
    expect(d.xp).toBe(10); expect(d.best).toBe(9);
    expect(streak(d, '2026-11-12')).toBe(3);
    expect(streak(d, '2026-11-13')).toBe(3);
    expect(streak(d, '2026-11-14')).toBe(0);
  });
  it('garde le même mot toute la journée', () => {
    expect(arabicWordOfDay('2026-11-12')).toBe(arabicWordOfDay('2026-11-12'));
    expect(arabicWordOfDay('2026-11-12')).not.toBe(arabicWordOfDay('2026-11-13'));
  });
});

describe('dou’â de Moussa', () => {
  it('cite le verset 28:24', () => {
    const l = LESSONS.find((x) => x.id === 'rabbi-inni')!;
    expect(l.parts[0]!.arabic).toBe('رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ');
    expect(l.sub).toContain('28:24');
  });
});

describe('livrets de grammaire recopiés', () => {
  it('contient les 30 fiches de chaque livret, avec phonétique ou traduction partout', async () => {
    const { FAWAID, GRAMMAIRE_SIMPLIFIEE } = await import('../arabe/grammaire');
    expect(GRAMMAIRE_SIMPLIFIEE).toHaveLength(30);
    expect(FAWAID).toHaveLength(30);
    const all = [...GRAMMAIRE_SIMPLIFIEE, ...FAWAID];
    expect(new Set(all.map((c) => c.id)).size).toBe(60);
    for (const c of all) for (const b of c.blocs) for (const [ar, ph, fr] of b.lignes) {
      if (/[؀-ۿ]/.test(ar)) expect(ph || fr).toBeTruthy();
      expect(ar || fr).toBeTruthy();
    }
    expect(PAQUETS.find((p) => p.id === 'grammaire')!.cards.length).toBeGreaterThan(40);
  });
});
