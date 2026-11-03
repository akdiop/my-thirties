import { describe, expect, it } from 'vitest';
import { planFromText } from '../workoutTimer';

describe('minuteur des défis', () => {
  it('séries à répétitions : série à valider puis repos', () => {
    const s = planFromText('3 séries de 14 squats, 1 min de pause entre les séries. Genoux dans l’axe des pieds.');
    expect(s.map((x) => x.kind)).toEqual(['manual', 'rest', 'manual', 'rest', 'manual']);
    expect(s[1]!.sec).toBe(60);
    expect(s[0]!.label).toBe('Série 1/3 · 14 squats');
  });
  it('effort / repos chronométrés', () => {
    const s = planFromText('4 tours de 40 s d’effort / 20 s de repos : jumping jacks, squats.');
    expect(s.filter((x) => x.kind === 'work')).toHaveLength(4);
    expect(s[0]!.sec).toBe(40); expect(s[1]!.sec).toBe(20);
  });
  it('planches en secondes', () => {
    const s = planFromText('3 planches de 25 secondes sur les avant-bras.');
    expect(s.filter((x) => x.kind === 'work').map((x) => x.sec)).toEqual([25, 25, 25]);
  });
  it('circuit mêlant répétitions et secondes', () => {
    const s = planFromText('2 tours : Crunch 12 · Planche 30 s · Pont 15. 45 s de pause entre les tours.');
    expect(s.filter((x) => x.kind === 'manual')).toHaveLength(4);
    expect(s.filter((x) => x.kind === 'work').map((x) => x.sec)).toEqual([30, 30]);
    expect(s.find((x) => x.label === 'Repos entre les tours')!.sec).toBe(45);
  });
  it('séance en minutes et texte sans durée', () => {
    expect(planFromText('12 min d’étirements : chat-vache. Tiens 30 s.')[0]!.sec).toBe(720);
    expect(planFromText('Lis un chapitre')).toEqual([]);
  });
});
