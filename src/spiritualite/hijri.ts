const MONTHS = [
  'mouharram',
  'safar',
  'rabi al-awwal',
  'rabi ath-thani',
  'joumada al-oula',
  'joumada ath-thania',
  'rajab',
  'chaabane',
  'ramadan',
  'chawwal',
  'dhou al-qi’da',
  'dhou al-hijja',
];

export type HijriDate = { day: number; month: number; year: number };

export function tabularHijri(date: Date): HijriDate {
  const jdn = Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000) + 2440588;
  const l0 = jdn - 1948440 + 10632;
  const n = Math.floor((l0 - 1) / 10631);
  const l1 = l0 - 10631 * n + 354;
  const j = Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) + Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
  const l2 = l1 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l2) / 709);
  const day = l2 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month, year };
}

export function intlHijri(date: Date): HijriDate | null {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(date);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const h = { day: get('day'), month: get('month'), year: get('year') };
    return Number.isFinite(h.day) && Number.isFinite(h.month) && Number.isFinite(h.year) && h.year > 1300 ? h : null;
  } catch {
    return null;
  }
}

export const hijriOf = (date: Date) => intlHijri(date) ?? tabularHijri(date);

export const formatHijri = (h: HijriDate) => `${h.day} ${MONTHS[h.month - 1] ?? ''} ${h.year}`;
