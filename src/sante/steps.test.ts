import { formatSteps, stepAverage, stepProgress } from './steps';

describe('steps', () => {
  it('measures progress toward the goal', () => {
    expect(stepProgress(6000, 8000)).toEqual({ steps: 6000, goal: 8000, ratio: 0.75, reached: false });
    expect(stepProgress(9000, 8000)?.ratio).toBe(1);
    expect(stepProgress(null, 8000)).toBeNull();
  });

  it('averages only known days', () => {
    expect(stepAverage([{ steps: 4000 }, { steps: null }, { steps: 6000 }])).toBe(5000);
    expect(stepAverage([{ steps: null }])).toBeNull();
  });

  it('formats with a thin space', () => {
    expect(formatSteps(12345)).toBe('12 345');
  });
});
