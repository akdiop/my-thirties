import { intensitySuggestion } from './suggestion';

describe('intensity suggestion', () => {
  it('suggests rest with strong pain, gentle with low energy, nothing otherwise', () => {
    expect(intensitySuggestion({ energy: 4, pain: 3, inPeriod: false })?.level).toBe('repos');
    expect(intensitySuggestion({ energy: 2, pain: 0, inPeriod: false })?.level).toBe('doux');
    expect(intensitySuggestion({ energy: 4, pain: 2, inPeriod: true })?.level).toBe('doux');
    expect(intensitySuggestion({ energy: 4, pain: 1, inPeriod: false })).toBeNull();
    expect(intensitySuggestion({ energy: null, pain: null, inPeriod: false })).toBeNull();
  });
});
