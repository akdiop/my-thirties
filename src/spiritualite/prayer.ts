import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';

export const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerName = (typeof PRAYERS)[number];

export const PRAYER_LABEL: Record<PrayerName, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export const METHODS = [
  { id: 'MuslimWorldLeague', label: 'Ligue islamique mondiale' },
  { id: 'Egyptian', label: 'Autorité égyptienne' },
  { id: 'Karachi', label: 'Université de Karachi' },
  { id: 'UmmAlQura', label: 'Umm al-Qura (La Mecque)' },
  { id: 'Dubai', label: 'Dubaï' },
  { id: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { id: 'NorthAmerica', label: 'ISNA (Amérique du Nord)' },
  { id: 'Kuwait', label: 'Koweït' },
  { id: 'Qatar', label: 'Qatar' },
  { id: 'Singapore', label: 'Singapour' },
  { id: 'Turkey', label: 'Turquie (Diyanet)' },
] as const;

export type MethodId = (typeof METHODS)[number]['id'];

export const CITIES = [
  { id: 'dakar', label: 'Dakar', latitude: 14.6928, longitude: -17.4467 },
  { id: 'thies', label: 'Thiès', latitude: 14.7886, longitude: -16.926 },
  { id: 'saint-louis', label: 'Saint-Louis', latitude: 16.0326, longitude: -16.4818 },
  { id: 'touba', label: 'Touba', latitude: 14.8667, longitude: -15.8833 },
  { id: 'ziguinchor', label: 'Ziguinchor', latitude: 12.5833, longitude: -16.2667 },
  { id: 'paris', label: 'Paris', latitude: 48.8566, longitude: 2.3522 },
] as const;

export type PrayerSettings = {
  method: MethodId;
  madhab: 'shafi' | 'hanafi';
  latitude: number;
  longitude: number;
  placeLabel: string;
  adjustments: Record<PrayerName, number>;
  showInAgenda: boolean;
  remind: PrayerName[];
};

export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = {
  method: 'MuslimWorldLeague',
  madhab: 'shafi',
  latitude: 14.6928,
  longitude: -17.4467,
  placeLabel: 'Dakar',
  adjustments: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  showInAgenda: true,
  remind: [],
};

export type DayPrayers = { name: PrayerName; at: Date }[];

export function prayerTimes(date: Date, s: PrayerSettings): DayPrayers {
  const params = CalculationMethod[s.method]();
  params.madhab = s.madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  params.adjustments = { ...params.adjustments, ...s.adjustments };
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const t = new PrayerTimes(new Coordinates(s.latitude, s.longitude), day, params);
  return PRAYERS.map((name) => ({ name, at: t[name] }));
}

export function nextPrayer(now: Date, s: PrayerSettings) {
  const today = prayerTimes(now, s).find((p) => p.at > now);
  if (today) return today;
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return prayerTimes(tomorrow, s)[0]!;
}

export const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.round(ms / 60_000));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`;
}
