export const EXPORT_FORMAT = 'my-thirties-export';
export const EXPORT_VERSION = 1;

export type ExportTables = Record<string, readonly unknown[]>;

export function buildExport(tables: ExportTables, exportedAt: Date, appVersion: string) {
  const counts = Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.length]));
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    appVersion,
    exportedAt: exportedAt.toISOString(),
    counts,
    tables,
  };
}

export const exportFileName = (date: Date) => `my-thirties-export-${date.toISOString().slice(0, 10)}.json`;
