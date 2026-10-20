import { defaultModuleStates, MODULES, orderedModules } from './registry';

describe('module registry', () => {
  it('lists the eleven spaces with unique ids', () => {
    expect(MODULES).toHaveLength(11);
    expect(new Set(MODULES.map((m) => m.id)).size).toBe(11);
  });

  it('marks only implemented spaces as partly built', () => {
    const built = MODULES.filter((m) => m.status !== 'not-developed').map((m) => m.id);
    expect(built).toEqual(['quotidien', 'challenges', 'listes']);
    expect(MODULES.filter((m) => m.route).map((m) => m.id)).toEqual(built);
  });

  it('hides disabled spaces and respects order', () => {
    const states = defaultModuleStates().map((s) =>
      s.moduleId === 'finances' ? { ...s, enabled: false } : s.moduleId === 'listes' ? { ...s, position: -1 } : s,
    );
    const visible = orderedModules(states);
    expect(visible).toHaveLength(10);
    expect(visible[0]?.module.id).toBe('listes');
    expect(visible.some((v) => v.module.id === 'finances')).toBe(false);
    expect(orderedModules(states, { includeDisabled: true })).toHaveLength(11);
  });

  it('keeps a space visible when its saved state is missing', () => {
    expect(orderedModules([])).toHaveLength(11);
  });
});
