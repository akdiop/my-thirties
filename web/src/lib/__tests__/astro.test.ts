import { describe, expect, it } from 'vitest';
import { aspectsOf, balanceOf, housesOf, lectureAspect, lectureMaison, lectureSigne, parseEvozen, syntheseOf } from '../astro';

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
