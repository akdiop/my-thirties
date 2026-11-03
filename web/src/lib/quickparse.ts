/**
 * Ajout rapide en français courant : « dentiste jeudi 15h », « appeler maman demain », « réunion le 12 à 9h30 ».
 * Tout se fait sur le téléphone : on repère la date et l'heure, le reste devient le titre.
 */
export type Parsed = { title: string; date: string; time: string; kind: 'event' | 'task'; endTime?: string };

const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTHS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const iso = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const pad = (n: number) => String(n).padStart(2, '0');

export function parseQuick(raw: string, now = new Date()): Parsed | null {
  let text = ' ' + raw.trim().replace(/\s+/g, ' ') + ' ';
  if (text.trim().length < 2) return null;
  const low = () => strip(text);
  const cut = (re: RegExp) => { const m = re.exec(low()); if (!m) return null; text = text.slice(0, m.index) + ' ' + text.slice(m.index + m[0].length); return m; };
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let date: Date | null = null, time = '', endTime = '';

  // Heures : « de 14h à 16h », « à 15h30 », « 9h », « 9:30 », « midi », « minuit »
  const range = cut(/\s(?:de\s)?(\d{1,2})\s?(?:h|:)\s?(\d{2})?\s?(?:a|-)\s?(\d{1,2})\s?(?:h|:)\s?(\d{2})?(?=\s)/);
  if (range) { time = pad(+range[1]!) + ':' + (range[2] ?? '00'); endTime = pad(+range[3]!) + ':' + (range[4] ?? '00'); }
  else {
    const t = cut(/\s(?:a\s|vers\s)?(\d{1,2})\s?(?:h|:)\s?(\d{2})?(?=\s)/);
    if (t && +t[1]! < 24 && +(t[2] ?? 0) < 60) time = pad(+t[1]!) + ':' + (t[2] ?? '00');
    else if (cut(/\s(?:a\s)?midi(?=\s)/)) time = '12:00';
    else if (cut(/\s(?:a\s)?minuit(?=\s)/)) time = '00:00';
  }
  // Dates relatives
  if (cut(/\saujourd'?hui(?=\s)/) || cut(/\sce soir(?=\s)/)) date = base;
  else if (cut(/\sapres[- ]demain(?=\s)/)) date = new Date(base.getTime() + 2 * 86_400_000);
  else if (cut(/\sdemain(?=\s)/)) date = new Date(base.getTime() + 86_400_000);
  else { const m = cut(/\sdans (\d{1,2}) jours?(?=\s)/); if (m) date = new Date(base.getTime() + +m[1]! * 86_400_000); }
  // « lundi », « lundi prochain »
  if (!date) {
    const m = cut(new RegExp('\\s(?:ce\\s)?(' + DAYS.join('|') + ')(\\sprochain)?(?=\\s)'));
    if (m) { const diff = (DAYS.indexOf(m[1]!) - base.getDay() + 7) % 7 || 7; date = new Date(base.getTime() + diff * 86_400_000); }
  }
  // « le 12 novembre », « 12/11 », « le 12 »
  if (!date) {
    const m = cut(new RegExp('\\s(?:le\\s)?(\\d{1,2})(?:er)?\\s(' + MONTHS.join('|') + ')(?:\\s(\\d{4}))?(?=\\s)'));
    if (m) { date = new Date(m[3] ? +m[3] : base.getFullYear(), MONTHS.indexOf(m[2]!), +m[1]!); if (!m[3] && date < base) date.setFullYear(date.getFullYear() + 1); }
  }
  if (!date) {
    const m = cut(/\s(?:le\s)?(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?(?=\s)/);
    if (m) { const y = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : base.getFullYear(); date = new Date(y, +m[2]! - 1, +m[1]!); if (!m[3] && date < base) date.setFullYear(y + 1); }
  }
  if (!date) {
    const m = cut(/\sle (\d{1,2})(?:er)?(?=\s)/);
    if (m && +m[1]! >= 1 && +m[1]! <= 31) { date = new Date(base.getFullYear(), base.getMonth(), +m[1]!); if (date < base) date.setMonth(date.getMonth() + 1); }
  }
  const title = text.replace(/\s(a|à|le|vers|pour)\s*$/i, ' ').replace(/^\s*(a|à)\s/i, ' ').replace(/\s+/g, ' ').trim().replace(/^./, (c) => c.toUpperCase());
  if (!title) return null;
  // Avec une heure : un événement de l'agenda ; sans heure : une tâche du jour.
  const kind = time ? 'event' : 'task';
  return { title, date: iso(date ?? base), time, kind, ...(endTime ? { endTime } : {}) };
}
