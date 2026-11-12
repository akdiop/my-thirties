/**
 * « Mes premiers mots » (Apprendre l'arabe facilement, apprendre-larabe-facilement.com) :
 * l'arabe vocalisé, la translittération et le sens tels que donnés dans le livret.
 */
import type { Famille, Mot } from './religieux';
const m = (ar: string, ph: string, fr: string): Mot => ({ ar, ph, fr });

export const PREMIERS_MOTS: Famille[] = [
  { id: 'couleurs', title: 'Les couleurs', words: [
    m('لَوْنٌ', 'lawnun', 'une couleur'), m('أَحْمَرُ', 'ahmaru', 'rouge'), m('أَزْرَقُ', 'azraqu', 'bleu'), m('أَخْضَرُ', 'akhdaru', 'vert'), m('أَصْفَرُ', 'asfaru', 'jaune'),
    m('أَبْيَضُ', 'abyadu', 'blanc'), m('أَسْوَدُ', 'aswadu', 'noir'), m('بُرْتُقَالِيٌّ', 'burtuqāliyyun', 'orange'), m('بُنِّيٌّ', 'bunniyyun', 'marron'),
    m('بَنَفْسَجِيٌّ', 'banafsajiyyun', 'violet'), m('وَرْدِيٌّ', 'wardiyyun', 'rose'), m('رَمَادِيٌّ', 'ramādiyyun', 'gris'), m('ذَهَبِيٌّ', 'dhahabiyyun', 'doré'), m('فِضِّيٌّ', 'fiddiyyun', 'argenté'),
  ] },
  { id: 'nombres', title: 'Les nombres de 0 à 10', words: [
    m('صِفْرٌ', 'sifrun', '0'), m('وَاحِدٌ', 'wāhidun', '1'), m('اِثْنَانِ', 'ithnāni', '2'), m('ثَلَاثَةٌ', 'thalāthatun', '3'), m('أَرْبَعَةٌ', 'arba‘atun', '4'), m('خَمْسَةٌ', 'khamsatun', '5'),
    m('سِتَّةٌ', 'sittatun', '6'), m('سَبْعَةٌ', 'sab‘atun', '7'), m('ثَمَانِيَةٌ', 'thamāniyatun', '8'), m('تِسْعَةٌ', 'tis‘atun', '9'), m('عَشَرَةٌ', '‘asharatun', '10'),
  ] },
  { id: 'onze', title: 'Les nombres de 11 à 19', words: [
    m('أَحَدَ عَشَرَ', 'ahada ‘ashara', '11'), m('اِثْنَا عَشَرَ', 'ithnā ‘ashara', '12'), m('ثَلَاثَةَ عَشَرَ', 'thalāthata ‘ashara', '13'), m('أَرْبَعَةَ عَشَرَ', 'arba‘ata ‘ashara', '14'),
    m('خَمْسَةَ عَشَرَ', 'khamsata ‘ashara', '15'), m('سِتَّةَ عَشَرَ', 'sittata ‘ashara', '16'), m('سَبْعَةَ عَشَرَ', 'sab‘ata ‘ashara', '17'), m('ثَمَانِيَةَ عَشَرَ', 'thamāniyata ‘ashara', '18'), m('تِسْعَةَ عَشَرَ', 'tis‘ata ‘ashara', '19'),
  ] },
  { id: 'dizaines', title: 'Les dizaines et au-delà', words: [
    m('عِشْرُونَ', '‘ishrūna', '20'), m('ثَلَاثُونَ', 'thalāthūna', '30'), m('أَرْبَعُونَ', 'arba‘ūna', '40'), m('خَمْسُونَ', 'khamsūna', '50'), m('سِتُّونَ', 'sittūna', '60'),
    m('سَبْعُونَ', 'sab‘ūna', '70'), m('ثَمَانُونَ', 'thamānūna', '80'), m('تِسْعُونَ', 'tis‘ūna', '90'), m('مِائَةٌ', 'mi’atun', '100'), m('أَلْفٌ', 'alfun', '1000'),
  ] },
  { id: 'pronoms', title: 'Les pronoms isolés', words: [
    m('أَنَا', 'anā', 'je'), m('نَحْنُ', 'nahnu', 'nous'), m('أَنْتَ', 'anta', 'tu, à un homme'), m('أَنْتِ', 'anti', 'tu, à une femme'), m('أَنْتُمَا', 'antumā', 'vous deux'),
    m('أَنْتُمْ', 'antum', 'vous, des hommes'), m('أَنْتُنَّ', 'antunna', 'vous, des femmes'), m('هُوَ', 'huwa', 'il'), m('هِيَ', 'hiya', 'elle'), m('هُمَا', 'humā', 'eux deux'),
    m('هُمْ', 'hum', 'ils'), m('هُنَّ', 'hunna', 'elles'),
  ] },
  { id: 'attaches', title: 'Les pronoms attachés', words: [
    m('كِتَابِي', 'kitābī', 'mon livre'), m('كِتَابُنَا', 'kitābunā', 'notre livre'), m('كِتَابُكَ', 'kitābuka', 'ton livre, à un homme'), m('كِتَابُكِ', 'kitābuki', 'ton livre, à une femme'),
    m('كِتَابُكُمَا', 'kitābukumā', 'votre livre, à vous deux'), m('كِتَابُكُمْ', 'kitābukum', 'votre livre, à des hommes'), m('كِتَابُكُنَّ', 'kitābukunna', 'votre livre, à des femmes'),
    m('كِتَابُهُ', 'kitābuhu', 'son livre, à lui'), m('كِتَابُهَا', 'kitābuhā', 'son livre, à elle'), m('كِتَابُهُمَا', 'kitābuhumā', 'leur livre, à eux deux'),
    m('كِتَابُهُمْ', 'kitābuhum', 'leur livre, à eux'), m('كِتَابُهُنَّ', 'kitābuhunna', 'leur livre, à elles'),
  ] },
  { id: 'jours', title: 'Les jours de la semaine', words: [
    m('الْأَحَدُ', 'al-ahadu', 'dimanche'), m('الْاِثْنَيْنِ', 'al-ithnayni', 'lundi'), m('الثُّلَاثَاءُ', 'ath-thulāthā’u', 'mardi'), m('الْأَرْبِعَاءُ', 'al-arbi‘ā’u', 'mercredi'),
    m('الْخَمِيسُ', 'al-khamīsu', 'jeudi'), m('الْجُمُعَةُ', 'al-jumu‘atu', 'vendredi'), m('السَّبْتُ', 'as-sabtu', 'samedi'), m('الْيَوْمَ', 'al-yawma', 'aujourd’hui'),
    m('أَمْسِ', 'amsi', 'hier'), m('غَدًا', 'ghadan', 'demain'), m('أُسْبُوعٌ', 'usbū‘un', 'une semaine'),
  ] },
  { id: 'questions', title: 'Poser une question', words: [
    m('مَنْ', 'man', 'qui'), m('مَا / مَاذَا', 'mā / mādhā', 'quoi'), m('أَيْنَ', 'ayna', 'où'), m('مِنْ أَيْنَ', 'min ayna', 'd’où'), m('إِلَى أَيْنَ', 'ilā ayna', 'vers où'),
    m('مَتَى', 'matā', 'quand'), m('كَيْفَ', 'kayfa', 'comment'), m('لِمَاذَا', 'limādhā', 'pourquoi'), m('أَيٌّ', 'ayyun', 'lequel'), m('هَلْ / أَ', 'hal / a', 'est-ce que'),
    m('كَمْ', 'kam', 'combien, la quantité'), m('بِكَمْ', 'bikam', 'combien, le prix'), m('مَا اسْمُكَ؟', 'ma smuka', 'quel est ton nom ?'), m('مَاذَا تَفْعَلُ؟', 'mādhā taf‘alu', 'que fais-tu ?'),
  ] },
  { id: 'salutations', title: 'Les salutations', words: [
    m('السَّلَامُ عَلَيْكُمْ', 'as-salāmu ‘alaykum', 'que la paix soit sur vous'), m('وَعَلَيْكُمُ السَّلَامُ', 'wa ‘alaykumu s-salāmu', 'et sur vous la paix'),
    m('أَهْلًا وَسَهْلًا', 'ahlan wa sahlan', 'sois le bienvenu'), m('صَبَاحُ الْخَيْرِ', 'sabāhu l-khayri', 'bonjour, le matin'), m('صَبَاحُ النُّورِ', 'sabāhu n-nūri', 'bonjour, en réponse'),
    m('مَسَاءُ الْخَيْرِ', 'masā’u l-khayri', 'bonsoir'), m('مَسَاءُ النُّورِ', 'masā’u n-nūri', 'bonsoir, en réponse'), m('كَيْفَ حَالُكَ؟', 'kayfa hāluka', 'comment vas-tu ?'),
    m('بِخَيْرٍ وَالْحَمْدُ لِلَّهِ', 'bikhayrin wa l-hamdu lillāhi', 'bien, louange à Allah'), m('وَأَنْتَ؟', 'wa anta', 'et toi ?'), m('إِلَى اللِّقَاءِ', 'ilā l-liqā’i', 'à bientôt'),
    m('أَرَاكَ غَدًا', 'arāka ghadan', 'à demain'), m('مَعَ السَّلَامَةِ', 'ma‘a s-salāmati', 'au revoir'), m('تُصْبِحُ عَلَى خَيْرٍ', 'tusbihu ‘alā khayrin', 'bonne nuit'),
  ] },
  { id: 'politesse', title: 'Les formules de politesse', words: [
    m('شُكْرًا', 'shukran', 'merci'), m('أَشْكُرُكَ', 'ashkuruka', 'je te remercie'), m('عَفْوًا', '‘afwan', 'de rien'), m('لَا عَلَيْكَ', 'lā ‘alayka', 'ce n’est rien'),
    m('لَا شُكْرَ عَلَى وَاجِبٍ', 'lā shukra ‘alā wājibin', 'il n’y a pas de quoi'), m('آسِفٌ', 'āsifun', 'désolé'), m('عُذْرًا / مَعْذِرَةً', '‘udhran / ma‘dhiratan', 'excuse-moi'),
    m('لَا بَأْسَ', 'lā ba’sa', 'ce n’est pas grave'), m('تَفَضَّلْ', 'tafaddal', 'je t’en prie'), m('مِنْ فَضْلِكَ', 'min fadlika', 's’il te plaît'), m('لَوْ سَمَحْتَ', 'law samahta', 'si tu permets'),
    m('بَعْدَ إِذْنِكَ', 'ba‘da idhnika', 'avec ta permission'), m('بِكُلِّ سُرُورٍ', 'bikulli surūrin', 'avec grand plaisir'), m('لَا مُشْكِلَةَ', 'lā mushkilata', 'pas de problème'),
  ] },
  { id: 'heure', title: 'Demander et donner l’heure', words: [
    m('كَمِ السَّاعَةُ؟', 'kami s-sā‘atu', 'quelle heure est-il ?'), m('السَّاعَةُ الْوَاحِدَةُ تَمَامًا', 'as-sā‘atu l-wāhidatu tamāman', 'il est une heure pile'),
    m('السَّاعَةُ الْوَاحِدَةُ وَالرُّبْعُ', 'as-sā‘atu l-wāhidatu wa r-rub‘u', 'il est une heure et quart'), m('السَّاعَةُ الْوَاحِدَةُ وَالثُّلْثُ', 'as-sā‘atu l-wāhidatu wa th-thulthu', 'il est une heure vingt'),
    m('السَّاعَةُ الْوَاحِدَةُ وَالنِّصْفُ', 'as-sā‘atu l-wāhidatu wa n-nisfu', 'il est une heure et demie'), m('السَّاعَةُ الْوَاحِدَةُ إِلَّا رُبْعًا', 'as-sā‘atu l-wāhidatu illā rub‘an', 'il est une heure moins le quart'),
    m('دَقِيقَةٌ', 'daqīqatun', 'une minute'), m('صَبَاحًا', 'sabāhan', 'le matin'), m('ظُهْرًا', 'zuhran', 'à midi'), m('مَسَاءً', 'masā’an', 'le soir'), m('لَيْلًا', 'laylan', 'la nuit'),
  ] },
  { id: 'ordinaux', title: 'Les ordinaux, de la première à la douzième', words: [
    m('الْوَاحِدَةُ', 'al-wāhidatu', 'la première'), m('الثَّانِيَةُ', 'ath-thāniyatu', 'la deuxième'), m('الثَّالِثَةُ', 'ath-thālithatu', 'la troisième'), m('الرَّابِعَةُ', 'ar-rābi‘atu', 'la quatrième'),
    m('الْخَامِسَةُ', 'al-khāmisatu', 'la cinquième'), m('السَّادِسَةُ', 'as-sādisatu', 'la sixième'), m('السَّابِعَةُ', 'as-sābi‘atu', 'la septième'), m('الثَّامِنَةُ', 'ath-thāminatu', 'la huitième'),
    m('التَّاسِعَةُ', 'at-tāsi‘atu', 'la neuvième'), m('الْعَاشِرَةُ', 'al-‘āshiratu', 'la dixième'), m('الْحَادِيَةَ عَشْرَةَ', 'al-hādiyata ‘ashrata', 'la onzième'), m('الثَّانِيَةَ عَشْرَةَ', 'ath-thāniyata ‘ashrata', 'la douzième'),
  ] },
  { id: 'invocations-pm', title: 'Les invocations', words: [
    m('بَارَكَ اللهُ فِيكَ', 'bāraka llāhu fīka', 'qu’Allah te bénisse'), m('جَزَاكَ اللهُ خَيْرًا', 'jazāka llāhu khayran', 'qu’Allah te rétribue en bien'), m('أَحْسَنَ اللهُ إِلَيْكَ', 'ahsana llāhu ilayka', 'qu’Allah soit bon envers toi'),
    m('نَفَعَ اللهُ بِكَ', 'nafa‘a llāhu bika', 'qu’Allah fasse profiter par toi'), m('رَحِمَكَ اللهُ', 'rahimaka llāhu', 'qu’Allah te fasse miséricorde'), m('حَفِظَكَ اللهُ', 'hafizaka llāhu', 'qu’Allah te préserve'),
    m('رَعَاكَ اللهُ', 'ra‘āka llāhu', 'qu’Allah te protège'), m('شَفَاكَ اللهُ', 'shafāka llāhu', 'qu’Allah te guérisse'), m('وَفَّقَكَ اللهُ', 'waffaqaka llāhu', 'qu’Allah t’accorde la réussite'),
    m('أَعَانَكَ اللهُ', 'a‘ānaka llāhu', 'qu’Allah te vienne en aide'), m('غَفَرَ اللهُ لَكَ', 'ghafara llāhu laka', 'qu’Allah te pardonne'), m('تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ', 'taqabbala llāhu minnā wa minkum', 'qu’Allah accepte de nous et de vous'),
  ] },
];
