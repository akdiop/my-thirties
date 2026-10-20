import { duplicateTitle, LIST_TEMPLATES, LIST_TYPES, move, nextPosition, progress } from './lists';

describe('lists', () => {
  const items = [{ id: 'a', position: 0 }, { id: 'b', position: 1 }, { id: 'c', position: 5 }];

  it('swaps positions with the neighbour', () => {
    expect(move(items, 'b', 1)).toEqual([{ id: 'b', position: 5 }, { id: 'c', position: 1 }]);
    expect(move(items, 'a', -1)).toEqual([]);
  });

  it('appends after the last position', () => {
    expect(nextPosition(items)).toBe(6);
    expect(nextPosition([])).toBe(0);
  });

  it('measures progress', () => {
    expect(progress([{ checked: true }, { checked: false }])).toEqual({ done: 1, total: 2, ratio: 0.5 });
    expect(progress([]).ratio).toBe(0);
  });

  it('marks duplicates once', () => {
    expect(duplicateTitle('Courses')).toBe('Courses (copie)');
    expect(duplicateTitle('Courses (copie)')).toBe('Courses (copie)');
  });

  it('only uses known list types in templates', () => {
    const ids = new Set<string>(LIST_TYPES.map((t) => t.id));
    expect(LIST_TEMPLATES.every((t) => ids.has(t.type))).toBe(true);
  });
});
