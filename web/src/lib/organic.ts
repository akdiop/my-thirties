/**
 * Visuels « formes organiques » : des formes douces superposées aux couleurs de l'app, avec un grain papier.
 * Générés à partir d'un identifiant (toujours le même dessin pour le même sujet), sans aucune photo.
 */
const FONDS = ['#F1E6D8', '#EFE3D3', '#F4E9DF', '#EDE1D2'];
const PALETTES = [
  ['#C9744E', '#D9B48F', '#8A5A3C'],
  ['#C38380', '#E2C3A3', '#6A4D44'],
  ['#C48A5A', '#E8CDB5', '#9A5A3E'],
  ['#D08A68', '#CDB197', '#6E4430'],
  ['#B97A55', '#E6C9A8', '#A0583A'],
];
// Formes de base (dans un repère 0..100), déformées ensuite.
const FORMES = [
  'M50 2 C78 4 98 28 94 56 C90 84 62 100 36 94 C10 88 -2 62 6 36 C12 14 28 0 50 2Z',
  'M44 4 C70 -2 100 18 98 48 C96 80 72 98 44 96 C16 94 0 70 4 44 C8 20 22 8 44 4Z',
  'M56 6 C82 12 98 40 90 66 C82 92 50 102 26 88 C4 76 -2 46 12 24 C24 6 40 2 56 6Z',
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function rng(seed: number) {
  let t = seed;
  return () => { t = (t + 0x6D2B79F5) >>> 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
}

const cache = new Map<string, string>();

/** Image SVG (data URI) à utiliser en background-image. */
export function organicArt(id: string): string {
  const hit = cache.get(id);
  if (hit) return hit;
  const r = rng(hash(id));
  const fond = FONDS[Math.floor(r() * FONDS.length)]!;
  const pal = PALETTES[Math.floor(r() * PALETTES.length)]!;
  // Trois formes groupées à droite, pour laisser le titre lisible à gauche.
  const blobs = [
    { x: 250 + r() * 50, y: -30 + r() * 30, s: 1.5 + r() * 0.5, c: pal[0], o: 0.9 },
    { x: 245 + r() * 45, y: 85 + r() * 40, s: 1.2 + r() * 0.4, c: pal[1], o: 0.85 },
    { x: 320 + r() * 40, y: 30 + r() * 50, s: 0.55 + r() * 0.3, c: pal[2], o: 0.85 },
  ].map((b) => {
    const d = FORMES[Math.floor(r() * FORMES.length)]!;
    const rot = Math.round(r() * 360);
    return `<path d="${d}" fill="${b.c}" opacity="${b.o}" transform="translate(${b.x.toFixed(0)} ${b.y.toFixed(0)}) rotate(${rot} ${50 * b.s} ${50 * b.s}) scale(${b.s.toFixed(2)})"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">`
    + `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`
    + `<rect width="400" height="220" fill="${fond}"/>${blobs}<rect width="400" height="220" filter="url(#g)" opacity="0.14"/></svg>`;
  const uri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  cache.set(id, uri);
  return uri;
}
