/**
 * Calendrier hégirien (Umm al-Qura, calculé par le navigateur) : jeûnes recommandés et dates importantes.
 * Le début des mois peut varier d'un jour selon l'observation de la lune dans le pays.
 */
export const HIJRI_MONTHS = ['Mouharram', 'Safar', 'Rabi‘ al-awwal', 'Rabi‘ ath-thani', 'Joumada al-oula', 'Joumada ath-thania',
  'Rajab', 'Cha‘bane', 'Ramadan', 'Chawwal', 'Dhou al-qa‘da', 'Dhou al-hijja'];

const fmt = (() => { try { return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' }); } catch { return null; } })();

/** Jour, mois (1-12) et année hégiriens d'une date civile (AAAA-MM-JJ). */
export function hijriOf(iso: string) {
  if (!fmt) return null;
  const p = Object.fromEntries(fmt.formatToParts(new Date(iso + 'T12:00:00Z')).map((x) => [x.type, x.value]));
  const day = parseInt(p.day ?? '', 10), month = parseInt(p.month ?? '', 10), year = parseInt(p.year ?? '', 10);
  return day && month && year ? { day, month, year } : null;
}
export const hijriLabel = (h: { day: number; month: number; year: number }) => `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year}`;

/** Dates marquantes (jour, mois hégirien). */
export const KEY_DATES: { d: number; m: number; name: string; note?: string }[] = [
  { d: 1, m: 1, name: 'Nouvel an hégirien' },
  { d: 10, m: 1, name: 'Achoura', note: 'Jeûne recommandé (avec le 9 ou le 11)' },
  { d: 12, m: 3, name: 'Mawlid (Gamou)' },
  { d: 27, m: 7, name: 'Isra wa Mi‘raj' },
  { d: 15, m: 8, name: 'Mi-Cha‘bane' },
  { d: 1, m: 9, name: 'Début du Ramadan' },
  { d: 21, m: 9, name: 'Les 10 dernières nuits du Ramadan', note: 'Recherche de Laylat al-Qadr' },
  { d: 1, m: 10, name: 'Aïd al-Fitr (Korité)' },
  { d: 2, m: 10, name: 'Six jours de Chawwal', note: 'Jeûne recommandé, à faire dans le mois' },
  { d: 1, m: 12, name: 'Les 10 premiers jours de Dhou al-hijja' },
  { d: 9, m: 12, name: 'Jour de ‘Arafat', note: 'Jeûne recommandé' },
  { d: 10, m: 12, name: 'Aïd al-Adha (Tabaski)' },
];

/** Ce que ce jour a de particulier : jeûne surérogatoire possible et/ou date marquante. */
export function spiritualDay(iso: string) {
  const h = hijriOf(iso);
  if (!h) return null;
  const weekday = new Date(iso + 'T12:00:00Z').getUTCDay();
  const ramadan = h.month === 9, eid = (h.month === 10 && h.day === 1) || (h.month === 12 && h.day >= 10 && h.day <= 13);
  const fasts: string[] = [];
  if (!ramadan && !eid) {
    if (weekday === 1) fasts.push('Jeûne du lundi');
    if (weekday === 4) fasts.push('Jeûne du jeudi');
    if (h.day >= 13 && h.day <= 15) fasts.push('Jour blanc (' + h.day + ')');
  }
  const key = KEY_DATES.find((k) => k.d === h.day && k.m === h.month);
  if (key?.note?.startsWith('Jeûne') && !fasts.length) fasts.push(key.name);
  return { hijri: h, fasts, key: key ?? null, ramadan };
}

/** Prochaines dates marquantes à partir d'aujourd'hui (sur un peu plus d'un an). */
export function upcomingKeyDates(fromIso: string, count = 6) {
  const out: { iso: string; name: string; note?: string; hijri: string }[] = [];
  const d = new Date(fromIso + 'T12:00:00Z');
  for (let i = 0; i < 400 && out.length < count; i++) {
    const iso = d.toISOString().slice(0, 10), h = hijriOf(iso);
    const k = h && KEY_DATES.find((x) => x.d === h.day && x.m === h.month);
    if (k && h) out.push({ iso, name: k.name, note: k.note, hijri: hijriLabel(h) });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}
