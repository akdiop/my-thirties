/**
 * L'alphabet tel que présenté dans « Apprendre à lire l'arabe » (Apprendre l'arabe facilement) : nom de chaque lettre,
 * avec le son ajouté en phonétique, et les lettres lunaires et solaires du livret.
 */
export type Lettre = { ar: string; name: string; ph: string; hint: string; solar: boolean };
const l = (ar: string, name: string, ph: string, hint: string, solar = false): Lettre => ({ ar, name, ph, hint, solar });

export const ALPHABET: Lettre[] = [
  l('ا', 'èlif', 'a', 'support de voyelle, allonge le « a »'), l('ب', 'bè', 'b', 'b de « bol »'), l('ت', 'tè', 't', 't de « table »', true),
  l('ث', 'thè', 'th', 'th anglais de « think »', true), l('ج', 'djim', 'j', 'dj de « djellaba »'), l('ح', 'ha', 'h', 'h soufflé du fond de la gorge'),
  l('خ', 'kha', 'kh', 'jota espagnole'), l('د', 'dèl', 'd', 'd de « dame »', true), l('ذ', 'zèl', 'dh', 'th anglais de « this »', true),
  l('ر', 'ra', 'r', 'r roulé', true), l('ز', 'zey', 'z', 'z de « zèbre »', true), l('س', 'sin', 's', 's de « sel »', true),
  l('ش', 'shin', 'sh', 'ch de « chat »', true), l('ص', 'sad', 's', 's emphatique, bouche arrondie', true), l('ض', 'dad', 'd', 'd emphatique', true),
  l('ط', 'ta', 't', 't emphatique', true), l('ظ', 'za', 'z', 'dh emphatique', true), l('ع', '‘ain', '‘', 'son serré du fond de la gorge'),
  l('غ', 'ghain', 'gh', 'r grasseyé'), l('ف', 'fè', 'f', 'f de « fil »'), l('ق', 'qaf', 'q', 'k profond, au fond de la gorge'),
  l('ك', 'kèf', 'k', 'k de « kilo »'), l('ل', 'lèm', 'l', 'l de « lune »', true), l('م', 'mim', 'm', 'm de « mer »'),
  l('ن', 'noun', 'n', 'n de « nuit »', true), l('ه', 'hè', 'h', 'h expiré, léger'), l('و', 'waw', 'w', 'w de « wagon » ; allonge le « ou »'),
  l('ي', 'yè', 'y', 'y de « yaourt » ; allonge le « i »'),
];

/** Les voyelles du livret : fatha, kasra, damma, soukoun, puis les allongements (madd) et le tanwin. */
export const HARAKAT = [
  { id: 'fatha', mark: 'َ', name: 'La fatha', sound: (p: string) => p + 'a', rule: 'Petit trait au-dessus de la lettre : son « a ».' },
  { id: 'kasra', mark: 'ِ', name: 'La kasra', sound: (p: string) => p + 'i', rule: 'Petit trait sous la lettre : son « i ».' },
  { id: 'damma', mark: 'ُ', name: 'La damma', sound: (p: string) => p + 'u', rule: 'Petit waw au-dessus de la lettre : son « ou ».' },
  { id: 'soukoun', mark: 'ْ', name: 'Le soukoun', sound: (p: string) => p, rule: 'Petit rond : la lettre se prononce sans voyelle.' },
  { id: 'madd-a', mark: 'َا', name: 'Madd bil-èlif', sound: (p: string) => p + 'â', rule: 'Fatha suivie d’un alif : « a » long, deux temps.' },
  { id: 'madd-i', mark: 'ِي', name: 'Madd bil-yè', sound: (p: string) => p + 'î', rule: 'Kasra suivie d’un yè : « i » long, deux temps.' },
  { id: 'madd-u', mark: 'ُو', name: 'Madd bil-waw', sound: (p: string) => p + 'û', rule: 'Damma suivie d’un waw : « ou » long, deux temps.' },
  { id: 'tanwin', mark: 'ً', name: 'Le tanwin', sound: (p: string) => p + 'an', rule: 'Voyelle doublée en fin de mot : « an », « in », « oun ».' },
] as const;

/** Une lettre portant une voyelle, avec sa lecture : بَ → ba. L'alif porte une hamza pour les voyelles brèves. */
export function vocalise(x: Lettre, h: (typeof HARAKAT)[number]) {
  const base = x.ar === 'ا' ? (h.id === 'kasra' ? 'إ' : 'أ') : x.ar;
  const ph = x.ar === 'ا' ? h.sound('') || 'a' : h.sound(x.ph);
  return { ar: base + h.mark, ph };
}

export const SOURCE_ARABE = 'Apprendre l’arabe facilement (apprendre-larabe-facilement.com)';
