const capitalize = (s: string) => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

export const formatLongDate = (date: Date, timeZone?: string) =>
  capitalize(new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone }).format(date));

export function greeting(date: Date) {
  const h = date.getHours();
  return h >= 18 || h < 4 ? 'Bonsoir' : 'Bonjour';
}
