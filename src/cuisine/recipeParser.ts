const UNITS = ['c. à s.', 'c. à c.', 'tranches', 'tranche', 'feuilles', 'gousses', 'glaçons', 'pincée', 'boîte', 'botte', 'kg', 'ml', 'g', 'l'];
export function parseCuratedIngredient(line: string) {
  const pieces = line.trim().split(' ');
  const n = Number(pieces[0]);
  if (!Number.isFinite(n)) return { name: line.trim(), qty: null, unit: '' };
  const rest = pieces.slice(1).join(' ');
  const unit = UNITS.find((u) => rest.startsWith(u + ' '));
  return { name: (unit ? rest.slice(unit.length) : rest).trim(), qty: n, unit: unit ?? '' };
}
