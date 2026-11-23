/**
 * Quadrillage A–M (lignes) × 1–9 (colonnes) imprimé sur la carte fournie. Les marges ont été mesurées sur
 * Leonida_Map_Poster.jpg (1496 × 2048) : les positions sont approximatives et ne valent pas des coordonnées du jeu.
 */
export const ROWS = 'ABCDEFGHIJKLM'.split('');
export const COLS = 9;
export const FRAME = { left: 3.22, right: 96.71, top: 2.35, bottom: 97.65 };
export const MAP_RATIO = 2048 / 1496;

export type Rect = { x: number; y: number; w: number; h: number };
const cw = (FRAME.right - FRAME.left) / COLS;
const rh = (FRAME.bottom - FRAME.top) / ROWS.length;

/** Rectangle (en % de l'image) couvrant les lignes r1..r2 et colonnes c1..c2. */
export function cellsRect(r1: string, r2: string, c1: number, c2: number): Rect | null {
  const a = ROWS.indexOf(r1.toUpperCase()), b = ROWS.indexOf(r2.toUpperCase());
  if (a < 0 || b < 0 || c1 < 1 || c2 > COLS || c1 > c2 || a > b) return null;
  return { x: FRAME.left + (c1 - 1) * cw, y: FRAME.top + a * rh, w: (c2 - c1 + 1) * cw, h: (b - a + 1) * rh };
}

/** Lit « Zone J–K / 4–6 environ » ou « L6 » ; renvoie null si le texte ne contient pas de case lisible. */
export function parseGrid(text: string): Rect | null {
  const range = /([A-M])\s*[–-]\s*([A-M])\s*\/\s*(\d)\s*[–-]\s*(\d)/i.exec(text);
  if (range) return cellsRect(range[1]!, range[2]!, Number(range[3]), Number(range[4]));
  const one = /\b([A-M])\s*\/?\s*(\d)\b/i.exec(text);
  return one ? cellsRect(one[1]!, one[1]!, Number(one[2]), Number(one[2])) : null;
}

/** Case de la grille sous un point (en % de l'image), pour l'affichage « Case J5 (approximatif) ». */
export function cellAt(x: number, y: number): string | null {
  if (x < FRAME.left || x > FRAME.right || y < FRAME.top || y > FRAME.bottom) return null;
  const c = Math.min(COLS, Math.floor((x - FRAME.left) / cw) + 1), r = Math.min(ROWS.length - 1, Math.floor((y - FRAME.top) / rh));
  return ROWS[r]! + c;
}

export const gridLines = () => ({
  cols: Array.from({ length: COLS + 1 }, (_, i) => FRAME.left + i * cw),
  rows: Array.from({ length: ROWS.length + 1 }, (_, i) => FRAME.top + i * rh),
});
