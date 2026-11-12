/**
 * « Vocabulaire religieux » (fiches Apprendre l'arabe facilement, apprendre-larabe-facilement.com) :
 * le mot arabe et sa traduction tels que donnés dans les fiches, avec la phonétique ajoutée.
 */
export type Mot = { ar: string; ph: string; fr: string };
export type Famille = { id: string; title: string; words: Mot[]; note?: string };
const m = (ar: string, ph: string, fr: string): Mot => ({ ar, ph, fr });

export const RELIGIEUX: Famille[] = [
  { id: 'invocations', title: 'Les invocations', note: 'La réponse à chaque invocation est donnée après « → ».', words: [
    m('بَارَكَ اللهُ فِيكَ', 'bâraka llâhu fîk → wa fîk (وَفِيكَ)', 'Qu’Allah te bénisse'),
    m('جَزَاكَ اللهُ خَيْرًا', 'jazâka llâhu khayran → wa jazâk (وَجَزَاكَ)', 'Qu’Allah te rétribue en bien'),
    m('حَيَّاكَ اللهُ عَلَى طَاعَتِهِ', 'hayyâka llâhu ‘alâ tâ‘atih → hayyâka wa bayyâk (حَيَّاكَ وَبَيَّاكَ)', 'Qu’Allah te fasse vivre sur Son obéissance'),
    m('أَحْسَنَ اللهُ إِلَيْكَ', 'ahsana llâhu ilayk → wa ilayk (وَإِلَيْكَ)', 'Qu’Allah soit bon envers toi'),
    m('زَادَكَ اللهُ حِرْصًا', 'zâdaka llâhu hirsan → wa iyyâk (وَإِيَّاكَ)', 'Qu’Allah t’augmente en motivation'),
    m('نَفَعَ اللهُ بِكَ', 'nafa‘a llâhu bik → wa bik (وَبِكَ)', 'Qu’Allah fasse profiter par toi'),
    m('رَحِمَكَ اللهُ', 'rahimaka llâh → wa iyyâk (وَإِيَّاكَ)', 'Qu’Allah te fasse miséricorde'),
    m('حَفِظَكَ اللهُ', 'hafizaka llâh → wa iyyâk (وَإِيَّاكَ)', 'Qu’Allah te préserve'),
    m('رَعَاكَ اللهُ', 'ra‘âka llâh → wa iyyâk (وَإِيَّاكَ)', 'Qu’Allah te protège'),
    m('شَفَاكَ اللهُ', 'shafâka llâh → wa iyyâk (وَإِيَّاكَ)', 'Qu’Allah te guérisse'),
    m('وَفَّقَكَ اللهُ', 'waffaqaka llâh → wa iyyâk (وَإِيَّاكَ)', 'Qu’Allah t’accorde la réussite'),
  ] },
  { id: 'piliers-islam', title: 'Les 5 piliers de l’islam', words: [
    m('الشَّهَادَتَان', 'ash-shahâdatân', 'Les deux attestations de foi'), m('الصَّلَاة', 'as-salâh', 'La prière'), m('الزَّكَاة', 'az-zakâh', 'La zakat'),
    m('الصِّيَام', 'as-siyâm', 'Le jeûne'), m('الْحَجّ', 'al-hajj', 'Le pèlerinage'),
  ] },
  { id: 'piliers-foi', title: 'Les 6 piliers de la foi', words: [
    m('الْإِيمَانُ بِاللهِ', 'al-îmânu bi-llâh', 'La foi en Allah'), m('الْإِيمَانُ بِالْمَلَائِكَةِ', 'al-îmânu bi-l-malâ’ika', 'La foi en les anges'),
    m('الْإِيمَانُ بِالْكُتُبِ', 'al-îmânu bi-l-kutub', 'La foi en les Livres'), m('الْإِيمَانُ بِالرُّسُلِ', 'al-îmânu bi-r-rusul', 'La foi en les messagers'),
    m('الْإِيمَانُ بِالْيَوْمِ الْآخِرِ', 'al-îmânu bi-l-yawmi l-âkhir', 'La foi en le Jour dernier'),
    m('الْإِيمَانُ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ', 'al-îmânu bi-l-qadari khayrihi wa sharrih', 'La foi en le destin, bon et mauvais'),
  ] },
  { id: 'conditions', title: 'Les 7 conditions de l’attestation de foi', words: [
    m('الْعِلْم', 'al-‘ilm', 'La connaissance'), m('الْيَقِين', 'al-yaqîn', 'La certitude'), m('الْقَبُول', 'al-qabûl', 'L’acceptation'),
    m('الْانْقِيَاد', 'al-inqiyâd', 'La soumission'), m('الصِّدْق', 'as-sidq', 'La véracité'), m('الْإِخْلَاص', 'al-ikhlâs', 'La sincérité'), m('الْمَحَبَّة', 'al-mahabba', 'L’amour'),
  ] },
  { id: 'purification', title: 'Vocabulaire de la purification', words: [
    m('الطَّهَارَة', 'at-tahâra', 'La purification'), m('الْوُضُوء', 'al-wudû’', 'La petite ablution'), m('الْغُسْل', 'al-ghusl', 'La grande ablution'),
    m('التَّيَمُّم', 'at-tayammum', 'L’ablution sèche'), m('الْمَسْح', 'al-mash', 'L’essuyage'), m('الْغَسْل', 'al-ghasl', 'Le lavage'),
    m('الْمَضْمَضَة', 'al-madmada', 'Le rinçage de la bouche'), m('الِاسْتِنْشَاق', 'al-istinshâq', 'L’aspiration de l’eau par les narines'),
    m('الِاسْتِنْثَار', 'al-istinthâr', 'L’expiration de l’eau par les narines'), m('إِزَالَةُ النَّجَاسَة', 'izâlatu n-najâsa', 'L’enlèvement de l’impureté'),
  ] },
  { id: 'priere', title: 'Vocabulaire de la prière', words: [
    m('الصَّلَاة', 'as-salâh', 'La prière'), m('الْمُصَلِّي', 'al-musallî', 'Le prieur'), m('تَكْبِيرَةُ الْإِحْرَام', 'takbîratu l-ihrâm', 'La parole « Allâhu akbar » en début de prière'),
    m('قِرَاءَةُ الْفَاتِحَة', 'qirâ’atu l-fâtiha', 'La lecture de la Fâtiha'), m('الْقِيَام', 'al-qiyâm', 'La position debout'), m('الرُّكُوع', 'ar-rukû‘', 'L’inclinaison'),
    m('السُّجُود', 'as-sujûd', 'La prosternation'), m('الْجُلُوس', 'al-julûs', 'La position assise'), m('التَّسْلِيم', 'at-taslîm', 'La salutation'), m('الرَّكْعَة', 'ar-rak‘a', 'L’unité de prière'),
  ] },
  { id: 'mosquee', title: 'Vocabulaire de la mosquée', words: [
    m('الْمَسْجِد', 'al-masjid', 'La mosquée'), m('الْمِئْذَنَة', 'al-mi’dhana', 'Le minaret'), m('الْأَذَان', 'al-adhân', 'L’appel à la prière'), m('الْإِقَامَة', 'al-iqâma', 'L’iqâma'),
    m('الْمِحْرَاب', 'al-mihrâb', 'Le mihrab'), m('الْمِنْبَر', 'al-minbar', 'Le minbar'), m('الصَّفّ', 'as-saff', 'Le rang'), m('الْمُؤَذِّن', 'al-mu’adhdhin', 'Le muezzin'),
    m('الْإِمَام', 'al-imâm', 'L’imam'), m('الْمَأْمُوم', 'al-ma’mûm', 'Celui qui prie derrière l’imam'),
  ] },
  { id: 'cinq-prieres', title: 'Les 5 prières quotidiennes', words: [
    m('الْفَجْر', 'al-fajr', 'Le Fajr'), m('الظُّهْر', 'az-zuhr', 'Le Dhuhr'), m('الْعَصْر', 'al-‘asr', 'Le Asr'), m('الْمَغْرِب', 'al-maghrib', 'Le Maghrib'), m('الْعِشَاء', 'al-‘ishâ’', 'Le Isha'),
  ] },
  { id: 'zakat', title: 'Vocabulaire de la zakat', words: [
    m('الزَّكَاة', 'az-zakâh', 'La zakat'), m('النِّصَاب', 'an-nisâb', 'Le nisab'), m('الذَّهَب', 'adh-dhahab', 'L’or'), m('الْفِضَّة', 'al-fidda', 'L’argent (métal)'),
    m('الْحُلِيّ', 'al-huliyy', 'Les bijoux'), m('الصَّدَقَة', 'as-sadaqa', 'L’aumône'), m('الْغَنِيّ', 'al-ghaniyy', 'Le riche'), m('الْفَقِير', 'al-faqîr', 'Le pauvre'),
    m('الْأَمْوَال', 'al-amwâl', 'Les biens'), m('النُّقُود', 'an-nuqûd', 'L’argent (monnaie)'),
  ] },
  { id: 'jeune', title: 'Vocabulaire du jeûne', words: [
    m('الصِّيَام / الصَّوْم', 'as-siyâm / as-sawm', 'Le jeûne'), m('رُؤْيَةُ الْهِلَال', 'ru’yatu l-hilâl', 'La vision de la lune'), m('السُّحُور', 'as-suhûr', 'Le repas de l’aube'),
    m('الصَّائِم', 'as-sâ’im', 'Le jeûneur'), m('الْقُرْآن', 'al-qur’ân', 'Le Coran'), m('لَيْلَةُ الْقَدْر', 'laylatu l-qadr', 'La nuit du Destin'),
    m('التَّرَاوِيح', 'at-tarâwîh', 'La prière de la nuit pendant le Ramadan'), m('الْقِرَاءَة', 'al-qirâ’a', 'La lecture'),
    m('الِاعْتِكَاف', 'al-i‘tikâf', 'La retraite spirituelle à la mosquée'), m('عِيدُ الْفِطْر', '‘îdu l-fitr', 'La fête de la rupture'),
  ] },
  { id: 'hajj', title: 'Vocabulaire du Hajj', words: [
    m('الْحَجّ', 'al-hajj', 'Le pèlerinage'), m('الْعُمْرَة', 'al-‘umra', 'Le petit pèlerinage'), m('الْإِحْرَام', 'al-ihrâm', 'L’état de sacralisation'),
    m('الْمِيقَات', 'al-mîqât', 'Le lieu de la sacralisation'), m('الْكَعْبَة', 'al-ka‘ba', 'La Ka‘ba'), m('الطَّوَاف', 'at-tawâf', 'Les sept tours autour de la Ka‘ba'),
    m('السَّعْي', 'as-sa‘y', 'Les sept trajets entre as-Safâ et al-Marwa'), m('عَرَفَة', '‘arafa', '‘Arafa'), m('مُزْدَلِفَة', 'muzdalifa', 'Muzdalifa'), m('رَمْيُ الْجِمَار', 'ramyu l-jimâr', 'Le jet des cailloux'),
  ] },
  { id: 'adorations', title: 'Les adorations', words: [
    m('الدُّعَاء', 'ad-du‘â’', 'L’invocation'), m('الْخَوْف', 'al-khawf', 'La crainte'), m('الرَّجَاء', 'ar-rajâ’', 'L’espoir'), m('التَّوَكُّل', 'at-tawakkul', 'La confiance'),
    m('التَّوْبَة', 'at-tawba', 'Le repentir'), m('الِاسْتِعَانَة', 'al-isti‘âna', 'La demande d’aide'), m('الِاسْتِعَاذَة', 'al-isti‘âdha', 'La demande de protection'),
    m('الِاسْتِغَاثَة', 'al-istighâtha', 'La demande de secours'), m('الذَّبْح', 'adh-dhabh', 'Le sacrifice'), m('النَّذْر', 'an-nadhr', 'Le vœu'),
  ] },
  { id: 'comportements', title: 'Les bons comportements', words: [
    m('الرِّفْق', 'ar-rifq', 'La douceur'), m('الْعَدْل', 'al-‘adl', 'La justice'), m('التَّعَاوُن', 'at-ta‘âwun', 'L’entraide'), m('التَّوَاضُع', 'at-tawâdu‘', 'La modestie'),
    m('الْكَرَم', 'al-karam', 'La générosité'), m('حُسْنُ الظَّنّ', 'husnu z-zann', 'La bonne opinion'), m('الْحِكْمَة', 'al-hikma', 'La sagesse'),
    m('الرَّحْمَة', 'ar-rahma', 'La miséricorde'), m('الشَّجَاعَة', 'ash-shajâ‘a', 'Le courage'), m('الصَّبْر', 'as-sabr', 'La patience'),
  ] },
];
