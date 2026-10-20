import { breathAt, CYCLES } from './breathing';

describe('breathing guide', () => {
  it('alternates 4 s in and 6 s out', () => {
    expect(breathAt(0)).toMatchObject({ phase: 'inhale', cycle: 1, secondsLeft: 4 });
    expect(breathAt(3500)).toMatchObject({ phase: 'inhale', secondsLeft: 1 });
    expect(breathAt(4000)).toMatchObject({ phase: 'exhale', cycle: 1, secondsLeft: 6 });
    expect(breathAt(10_000)).toMatchObject({ phase: 'inhale', cycle: 2 });
  });

  it('ends after six cycles', () => {
    expect(breathAt(CYCLES * 10_000).done).toBe(true);
  });
});
