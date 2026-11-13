import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { aspectsOf, balanceOf, bilanLunaire, cleDuJourKey, housesOf, lectureAspect, lectureMaison, lectureSigne, lunaisons, moonLongitude, moonPhaseOf, parseEvozen, solarReturn, sunLongitude, synastry, syntheseOf, transitsOf } from '../astro';
import { cheminDeVie, nombresDuNom } from '../numerologie';

const TEXTE = `Ascendant Lion
        Situé en Lion à 09°17
Planète             Position en signe           Maison    Planète        Aspect         Planète      Orbe
     Soleil               Capricorne 26°51         VI         Lune          Quinconce      Soleil     0.59
     Lune                 Gémeaux        26°16     XI         Pluton        Sextile        Soleil     4.33
     Mercure              Capricorne 11°06         VI         Lune          Quinconce      Pluton     3.74
     Vénus                Sagittaire     20°44     V          Ascendant     Semi-carré     Lune       1.97
     Mars                 Capricorne 06°11         V          Mars          Conjonct…      Mercure    4.91
     Jupiter     R        Vierge         14°06     II         Jupiter       Trigone        Mercure    3.01
     Saturne              Verseau        07°47     VI         Mercure                      Saturne
     Uranus               Capricorne 14°40         VI         Mercure                      Uranus
     Neptune              Capricorne 16°50         VI
     Pluton               Scorpion       22°31     IV
     Nœud nord            Capricorne 09°49         VI
     Nœud sud             Cancer         09°49     XII`;

describe('thème astral', () => {
  const chart = parseEvozen(TEXTE)!;
  it('lit le tableau Evozen et l’ascendant', () => {
    expect(chart.placements).toHaveLength(13);
    expect(chart.placements.find((p) => p.id === 'jupiter')).toMatchObject({ sign: 'vierge', house: 2, retro: true });
    expect(chart.placements.find((p) => p.id === 'ascendant')).toMatchObject({ sign: 'lion' });
    expect(parseEvozen('rien à lire')).toBeNull();
  });
  it('retrouve les aspects et leur puissance comme Evozen', () => {
    const a = aspectsOf(chart), find = (x: string, t: string, y: string) => a.find((k) => k.type.id === t && [k.a.id, k.b.id].sort().join() === [x, y].sort().join());
    expect(find('jupiter', 'trigone', 'uranus')?.power).toBe(89);
    expect(find('mars', 'semi-carre', 'pluton')?.power).toBe(73);
    expect(find('mars', 'semi-sextile', 'saturne')?.power).toBe(68);
    expect(find('lune', 'quinconce', 'soleil')?.orb).toBeCloseTo(0.58, 1);
    expect(a[0]!.power).toBeGreaterThanOrEqual(a[a.length - 1]!.power);
  });
  it('synthèse : Terre dominante, maison VI la plus habitée', () => {
    expect(balanceOf(chart).elements[0]![0]).toBe('Terre');
    expect(housesOf(chart)[0]![0]).toBe(6);
    expect(syntheseOf(chart).trio).toBe('Soleil en Capricorne · Lune en Gémeaux · Ascendant Lion');
  });
  it('trouve les lectures de chaque placement', () => {
    const p = (id: string) => chart.placements.find((x) => x.id === id)!;
    expect(lectureSigne(p('venus'))?.titre).toBe('Vénus en Sagittaire');
    expect(lectureMaison(p('lune'))?.titre).toBe('Lune en maison XI');
    expect(lectureAspect('uranus', 'trigone', 'jupiter')?.titre).toBe('Jupiter en trigone avec Uranus');
  });
});

describe('lunes, anniversaire solaire, compatibilité', () => {
  const chart = parseEvozen(TEXTE)!;
  it('nouvelles et pleines lunes à quelques minutes près', () => {
    const l = lunaisons(new Date('2024-04-01T00:00:00Z'), 2);
    expect(l[0]!.type).toBe('nouvelle');
    expect(Math.abs(l[0]!.date.getTime() - Date.parse('2024-04-08T18:21:00Z'))).toBeLessThan(20 * 60_000);
    expect(l[0]!.sign.id).toBe('belier');
    const p = lunaisons(new Date('2024-09-10T00:00:00Z'), 2).find((x) => x.type === 'pleine')!;
    expect(Math.abs(p.date.getTime() - Date.parse('2024-09-18T02:34:00Z'))).toBeLessThan(20 * 60_000);
    expect(p.sign.id).toBe('poissons');
  });
  it('anniversaire solaire', () => {
    expect(solarReturn({ ...chart, naissance: '17 janvier 1992 à 18h25 à Paris, France' }, '2026-11-13')).toEqual({ date: '2027-01-17', days: 65, age: 35 });
  });
  it('compatibilité : mêmes éléments et aspects', () => {
    const s = synastry(chart, chart);
    expect(s.score).toBe(5);
    expect(s.aspects[0]!.type.id).toBe('conjonction');
  });
});

describe('ciel du jour, bilan lunaire, nombres', () => {
  it('Lune pleine au moment de la pleine lune de septembre 2024', () => {
    const d = new Date('2024-09-18T02:34:00Z');
    expect(moonPhaseOf(d).phase).toBe('pleine');
    expect(moonPhaseOf(d).eclat).toBeGreaterThan(97);
    expect(Math.abs(((moonLongitude(d) - sunLongitude(d) + 360) % 360) - 180)).toBeLessThan(2);
  });
  it('transits et invocation du jour', () => {
    const chart = parseEvozen(TEXTE)!;
    const t = transitsOf(chart, new Date('2027-01-17T12:00:00Z'));
    expect(t.soleil.sign.id).toBe('capricorne');
    expect(t.transits.some((x) => x.astre === 'Soleil' && x.cible.id === 'soleil' && x.type.id === 'conjonction')).toBe(true);
    const k = cleDuJourKey(chart, '2026-11-13')!;
    expect(k.lecture).toBeTruthy();
  });
  it('bilan lunaire', () => {
    const e = (date: string, mood: string) => ({ id: date, kind: 'daily', module: 'quotidien', title: '', entry_date: date, data: { mood } }) as unknown as Entry;
    const b = bilanLunaire([e('2024-09-18', 'Rayonnante'), e('2024-10-02', 'Fatiguée'), e('2024-09-17', 'Bien')]);
    expect(b.total).toBe(3);
    expect(b.rows.find((r) => r.phase === 'pleine')!.moyenne).toBe(4.5);
    expect(b.rows.find((r) => r.phase === 'nouvelle')!.moyenne).toBe(2);
  });
  it('numérologie : chemin de vie et nombres du nom', () => {
    expect(cheminDeVie('1992-01-17')).toEqual({ n: 3 });
    expect(cheminDeVie('1990-09-29')).toEqual({ n: 3 });
    expect(nombresDuNom('Ana')).toEqual({ expression: { n: 7 }, intime: { n: 2 } });
    expect(nombresDuNom('Kkk')?.expression).toEqual({ n: 6 });
    expect(nombresDuNom('')).toBeNull();
  });
});
