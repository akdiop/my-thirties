import type { LangCourse } from './types';

export const COURSE: LangCourse = {
  script: { title: 'L’alphabet arabe', points: [
    '28 lettres, écrites de droite à gauche. Chaque lettre change un peu de forme selon sa place (début, milieu, fin, seule).',
    'On écrit surtout les consonnes et les voyelles longues (ا â, و û, ي î). Les voyelles courtes sont de petits signes : fatha « a » (ـَ), kasra « i » (ـِ), damma « ou » (ـُ). Elles sont notées dans le Coran et les manuels.',
    'Soukoûn (ـْ) : pas de voyelle. Chadda (ـّ) : lettre doublée.',
    'Six lettres ne s’attachent jamais à la suivante : ا د ذ ر ز و.',
    'Commence par apprendre les lettres par familles de même forme : ب ت ث (b, t, th), ج ح خ (j, H, kh), د ذ (d, dh), ر ز (r, z), س ش (s, sh), ص ض (S, D), ط ظ (T, DH), ع غ (‘, gh).',
  ], table: [
    ['ا', 'alif · « a » long', 'باب bâb (porte)'],
    ['ب', 'bâ · « b »', 'بيت bayt (maison)'],
    ['ت / ث', 'tâ « t » / thâ « th » de « think »', 'تمر tamr (dattes)'],
    ['ج', 'jîm · « dj »', 'جميل jamîl (beau)'],
    ['ح', 'Hâ · « h » soufflé du fond de la gorge', 'حب Hubb (amour)'],
    ['خ', 'khâ · « kh » comme la jota', 'خبز khubz (pain)'],
    ['د / ذ', 'dâl « d » / dhâl « th » de « this »', 'ذهب dhahab (or)'],
    ['ر / ز', 'râ « r » roulé / zây « z »', 'زيت zayt (huile)'],
    ['س / ش', 'sîn « s » / shîn « ch »', 'شمس shams (soleil)'],
    ['ص / ض', 'Sâd « s » lourd / Dâd « d » lourd', 'صباح SabâH (matin)'],
    ['ط / ظ', 'Tâ « t » lourd / DHâ « z » lourd', 'طعام Ta‘âm (nourriture)'],
    ['ع', '‘ayn · son serré de la gorge', 'عين ‘ayn (œil)'],
    ['غ', 'ghayn · « r » grasseyé', 'غدا ghadan (demain)'],
    ['ف / ق', 'fâ « f » / qâf « k » du fond', 'قلب qalb (cœur)'],
    ['ك / ل / م / ن', '« k », « l », « m », « n »', 'كتاب kitâb (livre)'],
    ['ه', 'hâ · « h » léger', 'هذا hâdhâ (ceci)'],
    ['و / ي', 'wâw « w » ou « û » / yâ « y » ou « î »', 'يوم yawm (jour)'],
    ['ة', 'tâ marbûta · « a » en fin de mot (féminin)', 'مدرسة madrasa (école)'],
  ] },
  lessons: [
    { lesson: [
      'Il y a des sons sans équivalent en français : ح (h soufflé), خ (kh), ع (‘ayn), غ (gh), ق (q profond) et les quatre lettres « lourdes » ص ض ط ظ.',
      'Les voyelles longues (â, î, û) durent deux temps, les courtes un seul : كَتَبَ kataba (il a écrit) / كاتِب kâtib (écrivain).',
      'Ce cours enseigne l’arabe standard (fus-ha), compris partout et proche de la langue du Coran.',
      'Astuce : lis chaque mot lettre par lettre, puis d’un trait, comme dans la méthode Nûrâniyya.',
    ], vocab: [
      ['نَعَم', 'na‘am', 'oui'], ['لا', 'lâ', 'non'], ['شُكْرًا', 'shukran', 'merci'], ['مِنْ فَضْلِك', 'min faDlik', 's’il te plaît (à une femme)'],
      ['عَفْوًا', '‘afwan', 'pardon, de rien'], ['ماء', 'mâ’', 'eau'], ['بَيْت', 'bayt', 'maison'], ['امْرَأة', 'imra’a', 'femme'],
      ['رَجُل', 'rajul', 'homme'], ['وَلَد', 'walad', 'enfant, garçon'], ['مَدِينَة', 'madîna', 'ville'], ['كِتاب', 'kitâb', 'livre'],
    ], writing: ['Écris chaque lettre du tableau 5 fois, de droite à gauche.', 'Écris ton prénom en arabe : عايدة (‘Âyda).'],
    phrases: [['السَّلامُ عَلَيْكُم', 'as-salâmu ‘alaykum', 'Que la paix soit sur vous (bonjour)'], ['وَعَلَيْكُمُ السَّلام', 'wa ‘alaykumu s-salâm', 'Et sur vous la paix (réponse)'], ['شُكْرًا', 'shukran', 'Merci.'], ['لا أَفْهَم', 'lâ afham', 'Je ne comprends pas.'], ['أَعِدْ مِنْ فَضْلِك', 'a‘id min faDlik', 'Répète, s’il te plaît.']] },

    { lesson: [
      'L’arabe distingue toujours masculin et féminin, même pour « tu » : أَنْتَ anta (à un homme), أَنْتِ anti (à une femme).',
      'Pas de verbe « être » au présent : أنا عايدة anâ ‘Âyda = « je (suis) Aida ».',
      'Pronoms : أنا anâ (je), أنتَ / أنتِ anta / anti (tu), هو huwa (il), هي hiya (elle), نحن naHnu (nous).',
      'Le féminin se forme souvent avec ة : سِنِغالِيّ sinighâlî (Sénégalais) / سِنِغالِيَّة sinighâliyya (Sénégalaise).',
      'Possessif collé au nom : اسْمي ismî (mon nom), اسْمُكِ ismuki (ton nom, à une femme).',
    ], vocab: [
      ['مَرْحَبًا', 'marHaban', 'bonjour, bienvenue'], ['صَباحُ الخَيْر', 'SabâHu l-khayr', 'bonjour (matin)'], ['مَساءُ الخَيْر', 'masâ’u l-khayr', 'bonsoir'], ['كَيْفَ حالُكِ؟', 'kayfa Hâluki', 'comment vas-tu ? (à une femme)'],
      ['بِخَيْر، الحَمْدُ لِله', 'bi-khayr, al-Hamdu lillâh', 'bien, Dieu merci'], ['اسْمي', 'ismî', 'mon nom est'], ['أنا مِن', 'anâ min', 'je viens de'], ['أَسْكُنُ في', 'askunu fî', 'j’habite à'],
      ['أَعْمَلُ في', 'a‘malu fî', 'je travaille dans'], ['صَدِيقَة', 'Sadîqa', 'amie'], ['تَشَرَّفْنا', 'tasharrafnâ', 'enchantée'], ['مَعَ السَّلامَة', 'ma‘a s-salâma', 'au revoir'],
    ], writing: ['Écris ta présentation en arabe avec la phonétique dessous.', 'Repère le ة du féminin dans les mots.'],
    phrases: [['اِسْمي عايدة', 'ismî ‘Âyda', 'Je m’appelle Aida.'], ['أنا مِنَ السِّنِغال', 'anâ mina s-Sinighâl', 'Je viens du Sénégal.'], ['أَسْكُنُ في داكار', 'askunu fî Dâkâr', 'J’habite à Dakar.'], ['وَأَنْتِ؟', 'wa anti', 'Et toi ? (à une femme)'], ['تَشَرَّفْنا', 'tasharrafnâ', 'Enchantée.']] },

    { lesson: [
      '1 à 10 : واحِد wâHid, اِثْنان ithnân, ثَلاثَة thalâtha, أَرْبَعَة arba‘a, خَمْسَة khamsa, سِتَّة sitta, سَبْعَة sab‘a, ثَمانِيَة thamâniya, تِسْعَة tis‘a, عَشَرَة ‘ashara.',
      'Chiffres arabes orientaux : ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ (0 à 9). Ils s’écrivent de gauche à droite comme les nôtres.',
      'Dizaines : عِشْرون ‘ishrûn (20), ثَلاثون thalâthûn (30), أَرْبَعون arba‘ûn (40)… مِئَة mi’a (100). 21 = واحِد وَعِشْرون wâHid wa ‘ishrûn (un et vingt).',
      'L’heure : السّاعَة as-sâ‘a + nombre ordinal : السّاعَة العاشِرَة as-sâ‘a l-‘âshira (dix heures). وَالنِّصْف wa n-niSf (et demie).',
      'Prix : بِكَمْ هذا؟ bikam hâdhâ ? (combien ça coûte ?).',
    ], vocab: [
      ['واحِد، اِثْنان، ثَلاثَة', 'wâHid, ithnân, thalâtha', '1, 2, 3'], ['أَرْبَعَة، خَمْسَة', 'arba‘a, khamsa', '4, 5'], ['سِتَّة، سَبْعَة', 'sitta, sab‘a', '6, 7'], ['ثَمانِيَة، تِسْعَة، عَشَرَة', 'thamâniya, tis‘a, ‘ashara', '8, 9, 10'],
      ['عِشْرون', '‘ishrûn', '20'], ['مِئَة', 'mi’a', '100'], ['السّاعَة', 'as-sâ‘a', 'l’heure'], ['السِّعْر', 'as-si‘r', 'le prix'],
      ['رَخيص', 'rakhîS', 'pas cher'], ['غالٍ', 'ghâlin', 'cher'], ['اليَوْم', 'al-yawm', 'aujourd’hui'], ['دَقيقَة', 'daqîqa', 'minute'],
    ], writing: ['Écris les chiffres ٠ à ٩ et les nombres 1 à 10 en lettres.'],
    phrases: [['كَمِ السّاعَة؟', 'kami s-sâ‘a', 'Quelle heure est-il ?'], ['السّاعَة العاشِرَة', 'as-sâ‘a l-‘âshira', 'Il est dix heures.'], ['بِكَمْ هذا؟', 'bikam hâdhâ', 'Combien ça coûte ?'], ['هذا غالٍ جِدًّا', 'hâdhâ ghâlin jiddan', 'C’est très cher.']] },

    { lesson: [
      'Possessifs collés : ـي -î (mon), ـكَ -ka / ـكِ -ki (ton), ـهُ -hu (son, à lui), ـها -hâ (son, à elle).',
      'Avec ة, on prononce le t : أُخْت ukht → أُخْتي ukhtî ; عَمَّة ‘amma → عَمَّتي ‘ammatî (ma tante).',
      '« Avoir » se dit « chez moi » : عِنْدي ‘indî. عِنْدي أَخَوان ‘indî akhawân (j’ai deux frères).',
      'L’adjectif suit le nom et s’accorde : أُخْتي طَويلَة ukhtî Tawîla (ma sœur est grande).',
    ], vocab: [
      ['أُمّ', 'umm', 'mère'], ['أَب', 'ab', 'père'], ['أُخْت', 'ukht', 'sœur'], ['أَخ', 'akh', 'frère'],
      ['بِنْت', 'bint', 'fille'], ['اِبْن', 'ibn', 'fils'], ['جَدَّة', 'jadda', 'grand-mère'], ['زَوْج', 'zawj', 'mari'],
      ['عائِلَة', '‘â’ila', 'famille'], ['طَويل / طَويلَة', 'Tawîl / Tawîla', 'grand / grande'], ['لَطيف / لَطيفَة', 'laTîf / laTîfa', 'gentil / gentille'], ['مَرِح / مَرِحَة', 'mariH / mariHa', 'drôle'],
    ], writing: ['Écris ton arbre familial avec أمّي (ma mère), أبي (mon père), أختي (ma sœur).'],
    phrases: [['هذِهِ أُخْتي', 'hâdhihi ukhtî', 'Voici ma sœur.'], ['عِنْدي أَخَوان', '‘indî akhawân', 'J’ai deux frères.'], ['أُمّي لَطيفَة جِدًّا', 'ummî laTîfa jiddan', 'Ma mère est très gentille.']] },

    { lesson: [
      'Le verbe au présent se forme avec des préfixes : أَ a- (je), تَـ ta- (tu, elle), يَـ ya- (il), نَـ na- (nous).',
      'Exemple avec ذَهَبَ dhahaba (aller) : أَذْهَبُ adh-habu (je vais), تَذْهَبينَ tadh-habîna (tu vas, à une femme), يَذْهَبُ yadh-habu (il va).',
      'La plupart des mots viennent d’une racine de 3 consonnes : k-t-b (écrire) donne كَتَبَ kataba, كِتاب kitâb, مَكْتَب maktab (bureau).',
      'Repères : صَباحًا SabâHan (le matin), مَساءً masâ’an (le soir), ثُمَّ thumma (ensuite), دائِمًا dâ’iman (toujours).',
    ], vocab: [
      ['أَسْتَيْقِظُ', 'astayqiDHu', 'je me réveille'], ['أُصَلّي', 'uSallî', 'je prie'], ['أَفْطِرُ', 'afTiru', 'je prends le petit-déjeuner'], ['أَعْمَلُ', 'a‘malu', 'je travaille'],
      ['آكُلُ', 'âkulu', 'je mange'], ['أَشْرَبُ', 'ashrabu', 'je bois'], ['أَذْهَبُ', 'adh-habu', 'je vais'], ['أَطْبُخُ', 'aTbukhu', 'je cuisine'],
      ['أَقْرَأُ', 'aqra’u', 'je lis'], ['أَنامُ', 'anâmu', 'je dors'], ['ثُمَّ', 'thumma', 'ensuite'], ['كُلَّ يَوْم', 'kulla yawm', 'chaque jour'],
    ], writing: ['Écris ta routine du matin en 5 phrases.', 'Entoure la racine de 3 lettres dans chaque verbe.'],
    phrases: [['أَسْتَيْقِظُ في السّاعَة السّابِعَة', 'astayqiDHu fi s-sâ‘a s-sâbi‘a', 'Je me réveille à sept heures.'], ['أَذْهَبُ إلى العَمَل', 'adh-habu ila l-‘amal', 'Je vais au travail.'], ['في المَساءِ أَقْرَأُ قَليلًا', 'fi l-masâ’i aqra’u qalîlan', 'Le soir je lis un peu.']] },

    { lesson: [
      'Demander : أُريدُ… urîdu (je veux), مِنْ فَضْلِك min faDlik (s’il te plaît).',
      'L’article « al » (ال) : القَهْوَة al-qahwa (le café). Devant les lettres solaires le l disparaît : الشّاي ash-shây (le thé).',
      'Au restaurant : القائِمَة al-qâ’ima (le menu), الحِساب al-Hisâb (l’addition).',
      'Quantités : كيلو kîlû, نِصْف كيلو niSf kîlû, قِنّينَة qinnîna (bouteille).',
    ], vocab: [
      ['دَجاج', 'dajâj', 'poulet'], ['سَمَك', 'samak', 'poisson'], ['أَرُزّ', 'aruzz', 'riz'], ['خُضار', 'khuDâr', 'légumes'],
      ['فَواكِه', 'fawâkih', 'fruits'], ['خُبْز', 'khubz', 'pain'], ['جُبْن', 'jubn', 'fromage'], ['عَصير', '‘aSîr', 'jus'],
      ['قَهْوَة', 'qahwa', 'café'], ['شاي', 'shây', 'thé'], ['الحِساب', 'al-Hisâb', 'l’addition'], ['لَذيذ', 'ladhîdh', 'délicieux'],
    ], writing: ['Écris ta liste de courses en arabe, avec « al » devant chaque mot.'],
    phrases: [['أُريدُ قَهْوَة مِنْ فَضْلِك', 'urîdu qahwa min faDlik', 'Je voudrais un café, s’il te plaît.'], ['الحِساب مِنْ فَضْلِك', 'al-Hisâb min faDlik', 'L’addition, s’il te plaît.'], ['الطَّعامُ لَذيذ', 'aT-Ta‘âmu ladhîdh', 'La nourriture est délicieuse.']] },

    { lesson: [
      'Où est… ? أَيْنَ…؟ ayna… ?',
      'Directions : عَلى اليَمين ‘ala l-yamîn (à droite), عَلى اليَسار ‘ala l-yasâr (à gauche), إلى الأَمام ila l-amâm (tout droit).',
      'Lieu : قَريب qarîb (près), بَعيد ba‘îd (loin), بِجانِب bi-jânib (à côté de), أَمامَ amâma (devant).',
      'Transports : بِالسَّيّارَة bi-s-sayyâra (en voiture), بِالحافِلَة bi-l-Hâfila (en bus), مَشْيًا mashyan (à pied).',
    ], vocab: [
      ['شارِع', 'shâri‘', 'rue'], ['مَحَطَّة', 'maHaTTa', 'gare, station'], ['مَطار', 'maTâr', 'aéroport'], ['شاطِئ', 'shâTi’', 'plage'],
      ['صَيْدَلِيَّة', 'Saydaliyya', 'pharmacie'], ['مَسْجِد', 'masjid', 'mosquée'], ['قَريب', 'qarîb', 'près'], ['بَعيد', 'ba‘îd', 'loin'],
      ['يَمين', 'yamîn', 'droite'], ['يَسار', 'yasâr', 'gauche'], ['تَذْكِرَة', 'tadhkira', 'billet'], ['فُنْدُق', 'funduq', 'hôtel'],
    ], writing: ['Écris le trajet de chez toi à la mosquée la plus proche.'],
    phrases: [['أَيْنَ المَحَطَّة؟', 'ayna l-maHaTTa', 'Où est la gare ?'], ['عَلى اليَمين', '‘ala l-yamîn', 'À droite.'], ['هَلْ هُوَ بَعيد؟', 'hal huwa ba‘îd', 'C’est loin ?']] },

    { lesson: [
      'Le passé se forme avec des terminaisons : ذَهَبْتُ dhahabtu (je suis allée), ذَهَبْتِ dhahabti (tu es allée, à une femme), ذَهَبَ dhahaba (il est allé), ذَهَبَتْ dhahabat (elle est allée).',
      'Autres verbes : أَكَلْتُ akaltu (j’ai mangé), شَرِبْتُ sharibtu (j’ai bu), رَأَيْتُ ra’aytu (j’ai vu), زُرْتُ zurtu (j’ai visité).',
      'Repères : أَمْس ams (hier), الأُسْبوع الماضي al-usbû‘ al-mâDî (la semaine dernière), بَعْدَ ذلِك ba‘da dhâlik (après cela).',
    ], vocab: [
      ['أَمْس', 'ams', 'hier'], ['نِهايَة الأُسْبوع', 'nihâyat al-usbû‘', 'le week-end'], ['ذَهَبْتُ', 'dhahabtu', 'je suis allée'], ['أَكَلْتُ', 'akaltu', 'j’ai mangé'],
      ['رَأَيْتُ', 'ra’aytu', 'j’ai vu'], ['زُرْتُ', 'zurtu', 'j’ai visité'], ['اسْتَمْتَعْتُ', 'istamta‘tu', 'j’ai apprécié'], ['بَعْدَ ذلِك', 'ba‘da dhâlik', 'ensuite'],
    ], writing: ['Écris 5 phrases sur ton dernier week-end.'],
    phrases: [['أَمْس ذَهَبْتُ إلى السّوق', 'ams dhahabtu ila s-sûq', 'Hier je suis allée au marché.'], ['كانَ يَوْمًا جَميلًا', 'kâna yawman jamîlan', 'C’était une belle journée.'], ['ماذا فَعَلْتِ في نِهايَة الأُسْبوع؟', 'mâdhâ fa‘alti fî nihâyat al-usbû‘', 'Qu’as-tu fait ce week-end ? (à une femme)']] },

    { lesson: [
      'Futur : سَـ sa- ou سَوْفَ sawfa devant le présent. سَأُسافِرُ sa-usâfiru (je vais voyager).',
      'Envie : أُريدُ أَنْ… urîdu an… (je veux…), أَتَمَنّى أَنْ… atamannâ an… (je souhaite…).',
      'Insha’Allah : إِنْ شاءَ الله in shâ’a llâh, à ajouter à tout projet.',
      'Repères : غَدًا ghadan (demain), السَّنَة القادِمَة as-sana l-qâdima (l’an prochain), يَوْمًا ما yawman mâ (un jour).',
    ], vocab: [
      ['مَشْروع', 'mashrû‘', 'projet'], ['حُلْم', 'Hulm', 'rêve'], ['أُسافِرُ', 'usâfiru', 'je voyage'], ['أَتَعَلَّمُ', 'ata‘allamu', 'j’apprends'],
      ['أَدَّخِرُ', 'addakhiru', 'j’économise'], ['حَجّ', 'Hajj', 'pèlerinage'], ['غَدًا', 'ghadan', 'demain'], ['السَّنَة القادِمَة', 'as-sana l-qâdima', 'l’an prochain'],
    ], writing: ['Écris tes 3 projets de l’année avec سَـ et إن شاء الله.'],
    phrases: [['سَأُسافِرُ إلى مَكَّة إِنْ شاءَ الله', 'sa-usâfiru ilâ Makka in shâ’a llâh', 'J’irai à La Mecque, si Dieu le veut.'], ['أُريدُ أَنْ أَتَعَلَّمَ القُرْآن', 'urîdu an ata‘allama l-qur’ân', 'Je veux apprendre le Coran.'], ['ما هي مَشاريعُكِ؟', 'mâ hiya mashârî‘uki', 'Quels sont tes projets ? (à une femme)']] },

    { lesson: [
      'Relancer : وَأَنْتِ؟ wa anti ? (et toi ?), حَقًّا؟ Haqqan ? (vraiment ?), ما شاءَ الله mâ shâ’a llâh (formidable).',
      'Demander de l’aide : كَيْفَ نَقولُ…؟ kayfa naqûlu… ? (comment dit-on… ?), ما مَعْنى…؟ mâ ma‘nâ… ? (que veut dire… ?), بِبُطْء bi-buT’ (lentement).',
      'Donner son avis : أَظُنُّ أَنَّ aDHunnu anna (je pense que), أَنا مُوافِقَة anâ muwâfiqa (je suis d’accord).',
    ], vocab: [
      ['سُؤال', 'su’âl', 'question'], ['جَواب', 'jawâb', 'réponse'], ['رُبَّما', 'rubbamâ', 'peut-être'], ['أَيْضًا', 'ayDan', 'aussi'],
      ['طَبْعًا', 'Tab‘an', 'bien sûr'], ['بِبُطْء', 'bi-buT’', 'lentement'], ['أُحِبُّ', 'uHibbu', 'j’aime'], ['إلى اللِّقاء', 'ila l-liqâ’', 'à bientôt'],
    ], writing: ['Prépare tes 10 questions par écrit, en arabe et en phonétique.'],
    phrases: [['ماذا تَعْمَلين؟', 'mâdhâ ta‘malîn', 'Que fais-tu dans la vie ? (à une femme)'], ['كَيْفَ نَقولُ « joie » بِالعَرَبِيَّة؟', 'kayfa naqûlu … bi-l-‘arabiyya', 'Comment dit-on « joie » en arabe ?'], ['تَكَلَّمي بِبُطْء مِنْ فَضْلِك', 'takallamî bi-buT’ min faDlik', 'Parle lentement, s’il te plaît.'], ['إلى اللِّقاء', 'ila l-liqâ’', 'À bientôt.']] },
  ],
};
