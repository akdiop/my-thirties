import { SPORT_SESSION_IDEAS } from './sessionIdeas';
describe('suggestions de séances guidées', () => {
  it('contient trois séances pour chaque discipline', () => {
    expect(SPORT_SESSION_IDEAS).toHaveLength(9);
    for (const discipline of ['pilates', 'yoga', 'tennis']) {
      expect(SPORT_SESSION_IDEAS.filter((idea) => idea.discipline === discipline)).toHaveLength(3);
    }
  });
  it('fournit des instructions et des précautions', () => {
    for (const idea of SPORT_SESSION_IDEAS) {
      expect(idea.minutes).toBeGreaterThan(0);
      expect(idea.steps.length).toBeGreaterThanOrEqual(4);
      expect(idea.caution.length).toBeGreaterThan(10);
    }
  });
});
