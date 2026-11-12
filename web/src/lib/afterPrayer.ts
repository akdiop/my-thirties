/**
 * Invocations à réciter après les prières quotidiennes (الأذكار بعد الصلاة), d'après la fiche d'islamicbulletin.org
 * envoyée par Aïda : texte arabe, phonétique et traduction tels que donnés, et nombre de répétitions.
 */
export const AFTER_KIND = 'apres_priere';
export type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export const PRAYERS: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
export type Dhikr = { id: string; arabic: string; phonetic: string; french: string; times: (p: Prayer) => number; note?: string };

const always = (n: number) => () => n;
const fajrMaghrib = (yes: number, no: number) => (p: Prayer) => (p === 'Fajr' || p === 'Maghrib' ? yes : no);
const TAHLIL = 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ';
const TAHLIL_PH = 'Lâ ilâha illa Allah, wahdahou lâ shariKa laHou; laHou-l-Mulk walaHou-l-Hamd, waHouwa ‘ala kulli chayin Qadir.';
const TAHLIL_FR = 'Il n’y a point de divinité en dehors d’Allah, l’unique, Il n’a aucun d’associé, à Lui la Souveraineté, à Lui la Louange, Il est capable sur toute chose.';

export const AFTER_PRAYER: Dhikr[] = [
  { id: 'istighfar', arabic: 'أَسْتَغْفِرُ اللهَ', phonetic: 'Astaghfiroullah', french: 'Je demande pardon à Allah', times: always(3) },
  { id: 'salam', arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    phonetic: 'Allahoumma Anta-s-Salâm waminKa-s-Salâm. TabâraKa, yâ dha-l-Jalâli wa-l-Ikrâm.', french: 'Ô mon Dieu, Tu es la Paix, de Toi procède la paix. Sois béni, ô Toi qui es plein de Majesté et de Munificence.', times: always(1) },
  { id: 'tahlil', arabic: TAHLIL, phonetic: TAHLIL_PH, french: TAHLIL_FR, times: always(1) },
  { id: 'hawla', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ',
    phonetic: 'Lâ Hawlâ walâ quwwata illâ billah; Lâ ilâha illa Allah, wala na`budu illâ iyyâHou, laHou-n-Ni‘matou walaHou-l-Fadlou, walaHou-th-thanâ’ou-l-Hasanou.',
    french: 'Il n’y a ni force ni puissance qu’en Allah ; il n’y a pas de divinité en dehors d’Allah, nous n’adorons que Lui, à Lui le bienfait, la grâce et la meilleure louange.', times: always(1) },
  { id: 'mukhlisin', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ', phonetic: 'Lâ ilâha illâ Allah, moukhlisîna, laHou-d-dîna, walaw kariha-l-kafiroun.',
    french: 'Il n’y a pas de divinité en dehors d’Allah, en Lui rendant un culte pur en dépit des mécréants.', times: always(1) },
  { id: 'mania', arabic: 'اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    phonetic: 'Allahoumma lâ mani‘a limâ a‘tayta, walâ mu‘tiya limâ mana‘ta, walâ yanfa‘u dha-l-jaddi minka-l-jadd.',
    french: 'Ô mon Dieu, nul ne repousse ce que Tu donnes, ni donne ce que Tu retiens, et la fortune du riche ne lui servira à rien auprès de Toi sinon Ta miséricorde.', times: always(1) },
  { id: 'aini', arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', phonetic: 'Allahoumma a‘ini ‘ala dhikriKa wachoukriKa wahousni ‘ibadatiK',
    french: 'Ô Allah, aide-moi pour que je me souvienne toujours de Toi, pour que je T’exprime ma reconnaissance, pour que je T’adore de la meilleure façon.', times: always(1) },
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', phonetic: 'Soubhâna Allah', french: 'Gloire à Allah', times: always(33) },
  { id: 'hamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', phonetic: 'Alhamdoulillah', french: 'Louange à Allah', times: always(33) },
  { id: 'akbar', arabic: 'اللَّهُ أَكْبَرُ', phonetic: 'Allahou Akbar', french: 'Allah est le plus Grand', times: always(33) },
  { id: 'cent', arabic: TAHLIL, phonetic: TAHLIL_PH, french: TAHLIL_FR, times: always(1), note: 'Pour compléter la centaine.' },
  { id: 'kursi', arabic: 'آيَةُ الْكُرْسِيِّ', phonetic: 'Ayâtou-l-Koursiyy', french: 'Le verset du Trône (2. Al-Baqarah, 255), après chaque prière', times: always(1) },
  { id: 'ikhlas', arabic: 'سُورَةُ الْإِخْلَاصِ', phonetic: 'Al-Ikhlâs, n° 112', french: 'Une fois ; trois fois après Fajr et Maghrib', times: fajrMaghrib(3, 1) },
  { id: 'falaq', arabic: 'سُورَةُ الْفَلَقِ', phonetic: 'Al-Falaq, n° 113', french: 'Une fois ; trois fois après Fajr et Maghrib', times: fajrMaghrib(3, 1) },
  { id: 'nas', arabic: 'سُورَةُ النَّاسِ', phonetic: 'An-Nâs, n° 114', french: 'Une fois ; trois fois après Fajr et Maghrib', times: fajrMaghrib(3, 1) },
  { id: 'dix', arabic: TAHLIL, phonetic: TAHLIL_PH, french: TAHLIL_FR, times: fajrMaghrib(10, 0), note: 'Dix fois après Fajr et Maghrib.' },
];

export const SOURCE = 'Fiche « Invocations à réciter après les prières quotidiennes », islamicbulletin.org';

export type AfterData = { date?: string; done?: Partial<Record<Prayer, Record<string, number>>> };

/** Les invocations de cette prière (celles à 0 répétition sont retirées) et ce qui est déjà récité. */
export function afterProgress(data: AfterData, p: Prayer) {
  const items = AFTER_PRAYER.filter((d) => d.times(p) > 0);
  const done = data.done?.[p] ?? {};
  const complete = items.filter((d) => (done[d.id] ?? 0) >= d.times(p)).length;
  return { items, done, complete, total: items.length };
}

/** La dernière prière dont l'heure est passée (d'après les horaires, sinon l'heure de la journée). */
export function lastPrayer(times: { name: string; time: string }[], minutes: number): Prayer {
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const past = times.filter((t) => (PRAYERS as string[]).includes(t.name) && toMin(t.time) <= minutes);
  if (past.length) return past.at(-1)!.name as Prayer;
  if (times.length) return 'Isha';
  return minutes < 12 * 60 ? 'Fajr' : minutes < 15 * 60 + 30 ? 'Dhuhr' : minutes < 18 * 60 + 30 ? 'Asr' : minutes < 20 * 60 ? 'Maghrib' : 'Isha';
}
