import { buildExport, exportFileName } from './exportData';

describe('export', () => {
  it('wraps every table with counts and metadata', () => {
    const out = buildExport({ profile: [{ id: '1' }], preference: [] }, new Date('2026-10-20T10:00:00Z'), '0.1.0');
    expect(out).toMatchObject({
      format: 'my-thirties-export',
      version: 1,
      exportedAt: '2026-10-20T10:00:00.000Z',
      counts: { profile: 1, preference: 0 },
    });
    expect(JSON.parse(JSON.stringify(out)).tables.profile).toEqual([{ id: '1' }]);
  });

  it('names the file with the date', () => {
    expect(exportFileName(new Date('2026-10-20T23:00:00Z'))).toBe('my-thirties-export-2026-10-20.json');
  });
});
