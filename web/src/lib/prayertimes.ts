import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import type { Entry } from './cloud';

/**
 * Horaires de prière calculés sur l'appareil (bibliothèque adhan), à partir d'une position enregistrée une seule fois.
 * Rien n'est envoyé à un service pour le calcul : seule la recherche du nom de la ville passe par le réseau.
 */
export const PRAYER_SETTINGS_KIND = 'prayer_settings';

export const METHODS = [
  { id: 'mwl', label: 'Ligue islamique mondiale' },
  { id: 'egypt', label: 'Autorité égyptienne' },
  { id: 'makkah', label: 'Umm al-Qura, La Mecque' },
  { id: 'isna', label: 'ISNA (Amérique du Nord)' },
  { id: 'france', label: 'France (UOIF)' },
  { id: 'karachi', label: 'Karachi' },
] as const;
export type MethodId = (typeof METHODS)[number]['id'];

export type PrayerSettings = { lat: number; lon: number; place: string; method: MethodId; hanafi: boolean; auto: boolean };

const params = (m: MethodId) => {
  switch (m) {
    case 'egypt': return CalculationMethod.Egyptian();
    case 'makkah': return CalculationMethod.UmmAlQura();
    case 'isna': return CalculationMethod.NorthAmerica();
    case 'karachi': return CalculationMethod.Karachi();
    case 'france': { const p = CalculationMethod.Other(); p.fajrAngle = 12; p.ishaAngle = 12; return p; }
    default: return CalculationMethod.MuslimWorldLeague();
  }
};

export function readSettings(entries: Entry[]): { entry: Entry; settings: PrayerSettings } | null {
  const entry = entries.filter((e) => e.kind === PRAYER_SETTINGS_KIND).sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  if (!entry) return null;
  const d = entry.data, lat = Number(d.lat), lon = Number(d.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  const method = METHODS.some((m) => m.id === d.method) ? (d.method as MethodId) : 'mwl';
  return { entry, settings: { lat, lon, place: typeof d.place === 'string' ? d.place : '', method, hanafi: d.hanafi === true || d.hanafi === 'true', auto: d.auto !== false && d.auto !== 'false' } };
}

const hhmm = (d: Date) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

/** Les 5 horaires du jour (heure de l'appareil), plus le lever du soleil. */
export function computeTimes(s: PrayerSettings, date = new Date()) {
  const p = params(s.method); p.madhab = s.hanafi ? Madhab.Hanafi : Madhab.Shafi;
  const t = new PrayerTimes(new Coordinates(s.lat, s.lon), date, p);
  return { Fajr: hhmm(t.fajr), Sunrise: hhmm(t.sunrise), Dhuhr: hhmm(t.dhuhr), Asr: hhmm(t.asr), Maghrib: hhmm(t.maghrib), Isha: hhmm(t.isha) };
}

/** Distance approximative en km entre deux positions (pour ne mettre à jour la ville qu'en cas de vrai déplacement). */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const r = Math.PI / 180, x = (b.lon - a.lon) * r * Math.cos(((a.lat + b.lat) / 2) * r), y = (b.lat - a.lat) * r;
  return Math.sqrt(x * x + y * y) * 6371;
}

/** Position actuelle, arrondie à ~1 km (largement assez précis pour les horaires). */
export function locate(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) { reject(new Error('La localisation n’est pas disponible sur cet appareil.')); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: Math.round(pos.coords.latitude * 100) / 100, lon: Math.round(pos.coords.longitude * 100) / 100 }),
      (err) => reject(new Error(err.code === 1 ? 'Localisation refusée. Autorise-la pour My Thirties dans Réglages › Safari › Position (ou cherche ta ville).' : 'Position introuvable pour le moment. Réessaie ou cherche ta ville.')),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 6 * 3600_000 });
  });
}

/** Nom de la ville pour une position (affichage seulement). */
export async function placeName(lat: number, lon: number): Promise<string> {
  try {
    const r = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=fr&latitude=' + lat + '&longitude=' + lon, { cache: 'no-store' });
    if (!r.ok) return '';
    const j = await r.json() as { city?: string; locality?: string; countryName?: string };
    return [j.city || j.locality, j.countryName].filter(Boolean).join(', ').slice(0, 80);
  } catch { return ''; }
}

/** Recherche d'une ville par son nom (si la localisation est refusée ou pour une autre ville). */
export async function searchCity(q: string): Promise<{ name: string; lat: number; lon: number }[]> {
  const r = await fetch('https://geocoding-api.open-meteo.com/v1/search?count=5&language=fr&name=' + encodeURIComponent(q.trim()), { cache: 'no-store' });
  if (!r.ok) throw new Error('Recherche indisponible pour le moment.');
  const j = await r.json() as { results?: { name: string; country?: string; admin1?: string; latitude: number; longitude: number }[] };
  return (j.results ?? []).map((c) => ({ name: [c.name, c.admin1 && c.admin1 !== c.name ? c.admin1 : '', c.country].filter(Boolean).join(', '), lat: Math.round(c.latitude * 100) / 100, lon: Math.round(c.longitude * 100) / 100 }));
}

/** Autorisation de localisation déjà accordée ? (pour la mise à jour silencieuse en voyage, sans redemander) */
export async function geoGranted() {
  try { return (await navigator.permissions?.query({ name: 'geolocation' as PermissionName }))?.state === 'granted'; } catch { return false; }
}
