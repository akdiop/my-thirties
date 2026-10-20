import type { Entry } from './cloud';

export const PROFILE_KIND = 'profile';

export const SITUATIONS = ['Célibataire', 'En couple', 'Fiancée', 'Pacsée', 'Mariée', 'Séparée', 'Divorcée', 'Veuve', 'Je préfère ne pas le dire'];

export type ProfileData = {
  firstName: string;
  lastName: string;
  photo: string;
  birthDate: string;
  city: string;
  country: string;
  situation: string;
  children: string;
  job: string;
  hobbies: string[];
  languages: string[];
  values: string[];
  intention: string;
};

export const EMPTY_PROFILE: ProfileData = {
  firstName: '', lastName: '', photo: '', birthDate: '', city: '', country: '', situation: '', children: '',
  job: '', hobbies: [], languages: [], values: [], intention: '',
};

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((x) => x.slice(0, 60)).slice(0, 30) : []);

/** Lit la fiche profil depuis une entrée, en ignorant tout champ inattendu. */
export function readProfile(entry: Entry | undefined): ProfileData {
  const d = entry?.data ?? {};
  const photo = str(d.photo, 60000);
  return {
    firstName: str(d.firstName, 60), lastName: str(d.lastName, 60),
    photo: /^data:image\/(jpeg|png|webp);base64,/.test(photo) ? photo : '',
    birthDate: /^\d{4}-\d{2}-\d{2}$/.test(str(d.birthDate, 10)) ? str(d.birthDate, 10) : '',
    city: str(d.city, 80), country: str(d.country, 80), situation: str(d.situation, 60), children: str(d.children, 200),
    job: str(d.job, 120), hobbies: list(d.hobbies), languages: list(d.languages), values: list(d.values), intention: str(d.intention, 500),
  };
}

export const splitTags = (text: string) => [...new Set(text.split(/[,;\n]/).map((t) => t.trim()).filter(Boolean))].slice(0, 30);

export function ageOn(birthDate: string, today: Date) {
  const [y, m, d] = birthDate.split('-').map(Number) as [number, number, number];
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
  return age;
}

/** Jours avant le prochain anniversaire (0 = aujourd’hui). Un 29 février est fêté le 28 les années non bissextiles. */
export function daysToBirthday(birthDate: string, today: Date) {
  const [, m, d] = birthDate.split('-').map(Number) as [number, number, number];
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const at = (year: number) => {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return new Date(year, m - 1, m === 2 && d === 29 && !leap ? 28 : d);
  };
  let next = at(start.getFullYear());
  if (next < start) next = at(start.getFullYear() + 1);
  return Math.round((next.getTime() - start.getTime()) / 86_400_000);
}

export function birthdayLine(birthDate: string, today: Date) {
  if (!birthDate) return '';
  const age = ageOn(birthDate, today);
  const days = daysToBirthday(birthDate, today);
  if (days === 0) return `Joyeux anniversaire : ${age} ans aujourd’hui !`;
  return `${age} ans · anniversaire dans ${days} jour${days > 1 ? 's' : ''}`;
}

/** Réduit la photo dans le navigateur (carré 256 px, JPEG) pour qu’elle tienne dans la fiche, sans l’envoyer à un autre service. */
export async function shrinkPhoto(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) throw new Error('Choisis une image JPEG, PNG ou WebP.');
  if (file.size > 15_000_000) throw new Error('Image trop lourde (15 Mo maximum).');
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Traitement de l’image impossible.');
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256);
  bitmap.close();
  for (const quality of [0.82, 0.7, 0.55, 0.4]) {
    const url = canvas.toDataURL('image/jpeg', quality);
    if (url.length < 45_000) return url;
  }
  throw new Error('Image trop détaillée : essaie une autre photo.');
}
