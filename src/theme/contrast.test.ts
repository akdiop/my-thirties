import { contrastRatio } from './contrast';
import { colors } from './tokens';

describe('theme contrast', () => {
  it.each(['light', 'dark'] as const)('%s text pairs meet WCAG AA', (scheme) => {
    const c = colors[scheme];
    expect(contrastRatio(c.text, c.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(c.text, c.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(c.textMuted, c.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(c.onPrimary, c.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(c.onSecondary, c.secondary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(c.accent, c.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('computes the known chocolate on cream ratio', () => {
    expect(contrastRatio('#6B3F2E', '#FAF7F2')).toBeCloseTo(8.27, 1);
  });
});
