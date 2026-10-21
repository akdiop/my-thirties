import { CHALLENGE_TEMPLATES, buildPlan } from './challenges';
import { LEARNING_CHALLENGE_TEMPLATES } from './learningTemplates';

describe('suggestions de challenges et apprentissage', () => {
  it('propose 20 programmes non sportifs et des durées adaptées', () => {
    expect(LEARNING_CHALLENGE_TEMPLATES).toHaveLength(20);
    expect(new Set(CHALLENGE_TEMPLATES.map((t) => t.id)).size).toBe(CHALLENGE_TEMPLATES.length);
    expect(LEARNING_CHALLENGE_TEMPLATES.some((t) => t.days === 14)).toBe(true);
    expect(LEARNING_CHALLENGE_TEMPLATES.some((t) => t.days === 21)).toBe(true);
    expect(LEARNING_CHALLENGE_TEMPLATES.some((t) => t.days === 30)).toBe(true);
  });
  it('fournit un programme mesurable sans escalade forcée', () => {
    for (const t of LEARNING_CHALLENGE_TEMPLATES) {
      expect(t.instructions.length).toBeGreaterThanOrEqual(3);
      expect(buildPlan(t)).toHaveLength(t.days);
      expect(buildPlan(t).every((v) => v === 10)).toBe(true);
    }
  });
});
