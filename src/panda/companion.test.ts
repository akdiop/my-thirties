import { isCareDone, nextStage, pandaProgress, stageFromPoints, type PandaState } from './companion';

const empty: PandaState = {
  name: 'Mochi', adoptedAt: '2026-11-02', moments: [], linkHabits: false, bestLevel: 0,
};

describe('panda companion', () => {
  it('starts at stage zero and grows by small positive actions', () => {
    expect(stageFromPoints(0)).toBe(0);
    expect(stageFromPoints(3)).toBe(1);
    expect(stageFromPoints(9)).toBe(2);
    expect(stageFromPoints(18)).toBe(3);
    expect(stageFromPoints(30)).toBe(4);
    expect(nextStage(4)).toBeNull();
  });
  it('does not require a daily streak or subtract progress for rest days', () => {
    const state: PandaState = { ...empty, moments: [
      { day: '2026-11-02', action: 'repos' },
      { day: '2026-11-09', action: 'pause' },
      { day: '2026-11-14', action: 'creativite' },
    ] };
    expect(pandaProgress(state, []).stage).toBe(1);
    expect(pandaProgress(state, []).daysTogether).toBe(3);
    expect(isCareDone(state, '2026-11-02', 'repos')).toBe(true);
    expect(isCareDone(state, '2026-11-02', 'pause')).toBe(false);
  });
  it('counts optional linked activities once per day and only after adoption', () => {
    const state = { ...empty, linkHabits: true };
    expect(pandaProgress(state, ['2026-11-01', '2026-11-02', '2026-11-02', '2026-11-03'])).toMatchObject({
      points: 2, linkedDays: 2, daysTogether: 2,
    });
  });
  it('preserves an unlocked level when linkage is disabled', () => {
    const state = { ...empty, bestLevel: 3, linkHabits: false };
    expect(pandaProgress(state, []).stage).toBe(3);
  });
});
