export const SITUATIONS = ['Célibataire', 'En couple', 'Fiancée', 'Pacsée', 'Mariée', 'Séparée', 'Divorcée', 'Veuve', 'Je préfère ne pas le dire'] as const;

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

export function birthdayLine(birthDate: string | null, today: Date) {
  if (!birthDate) return '';
  const age = ageOn(birthDate, today);
  const days = daysToBirthday(birthDate, today);
  if (days === 0) return `Joyeux anniversaire : ${age} ans aujourd’hui !`;
  return `${age} ans · anniversaire dans ${days} jour${days > 1 ? 's' : ''}`;
}
