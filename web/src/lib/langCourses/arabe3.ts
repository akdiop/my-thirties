import type { LangCourse } from './types';

/** Arabe standard, niveau 3 : aisance. Grammaire B1, débats, textes longs. */
export const COURSE: LangCourse = {
  lessons: [
    { lesson: [
      'Donner son avis : في رَأْيي fî ra’yî (à mon avis), أَظُنُّ أَنَّ aDHunnu anna (je pense que), أَعْتَقِدُ أَنَّ a‘taqidu anna (je crois que).',
      'Après أَنَّ anna, le sujet prend un pronom attaché ou un nom à l’accusatif : أَظُنُّ أَنَّهُ صَحيح aDHunnu annahu SaHîH (je pense que c’est juste).',
      'Être d’accord : أَنا مُوافِقَة anâ muwâfiqa ; pas d’accord : لَسْتُ مُوافِقَة lastu muwâfiqa. لَيْسَ laysa = ne pas être (se conjugue : لَسْتُ lastu, لَسْتِ lasti, لَيْسَتْ laysat).',
      'Nuancer : مِنْ ناحِيَة… وَمِنْ ناحِيَة أُخْرى… min nâHiya… wa min nâHiya ukhrâ… (d’un côté… de l’autre…), لكِنْ lâkin (mais), مَعَ ذلِك ma‘a dhâlik (malgré cela).',
    ], vocab: [
      ['رَأْي', 'ra’y', 'avis, opinion'], ['في رَأْيي', 'fî ra’yî', 'à mon avis'], ['أَظُنُّ', 'aDHunnu', 'je pense'], ['أَعْتَقِدُ', 'a‘taqidu', 'je crois'],
      ['مُوافِقَة', 'muwâfiqa', 'd’accord (f.)'], ['صَحيح', 'SaHîH', 'juste, vrai'], ['خَطَأ', 'khaTa’', 'faux, erreur'], ['مُهِمّ', 'muhimm', 'important'],
      ['فِكْرَة', 'fikra', 'idée'], ['سَبَب', 'sabab', 'raison'], ['نَتيجَة', 'natîja', 'résultat'], ['مَعَ ذلِك', 'ma‘a dhâlik', 'malgré cela'],
    ], writing: ['Écris un paragraphe de 6 phrases : « Faut-il travailler depuis la maison ? »'],
    phrases: [['في رَأْيي، التَّعَلُّمُ كُلَّ يَوْمٍ أَهَمُّ مِنَ السُّرْعَة.', 'fî ra’yî, at-ta‘allumu kulla yawmin ahammu mina s-sur‘a.', 'À mon avis, apprendre chaque jour compte plus que la vitesse.'], ['لَسْتُ مُوافِقَة تَمامًا.', 'lastu muwâfiqa tamâman.', 'Je ne suis pas tout à fait d’accord.'], ['عِنْدَكِ حَقّ.', '‘indaki Haqq.', 'Tu as raison.'], ['ما رَأْيُكِ؟', 'mâ ra’yuki ?', 'Qu’en penses-tu ?']],
    dialogue: [
      ['سارة: ما رَأْيُكِ في العَمَلِ مِنَ البَيْت؟', 'Sâra : mâ ra’yuki fi l-‘amali mina l-bayt ?', 'Sara : Que penses-tu du travail à la maison ?'],
      ['عايدة: مِنْ ناحِيَة، هُوَ مُريحٌ وَنَرْبَحُ الوَقْت.', '‘Âyda : min nâHiya, huwa murîHun wa narbaHu l-waqt.', 'Aida : D’un côté, c’est confortable et on gagne du temps.'],
      ['عايدة: وَمِنْ ناحِيَة أُخْرى، نَفْتَقِدُ الزُّمَلاء.', '‘Âyda : wa min nâHiya ukhrâ, naftaqidu z-zumalâ’.', 'Aida : De l’autre, les collègues nous manquent.'],
      ['سارة: أَنا أَظُنُّ أَنَّ يَوْمَيْنِ في الأُسْبوعِ كافِيان.', 'Sâra : anâ aDHunnu anna yawmayni fi l-usbû‘i kâfiyân.', 'Sara : Moi je pense que deux jours par semaine suffisent.'],
      ['عايدة: أَنا مُوافِقَة، هذا حَلٌّ وَسَط.', '‘Âyda : anâ muwâfiqa, hâdhâ Hallun wasaT.', 'Aida : Je suis d’accord, c’est un juste milieu.'],
    ],
    reading: { title: 'Le téléphone : ami ou ennemi ?', lines: [
      ['يَسْتَعْمِلُ النّاسُ الهاتِفَ ساعاتٍ كُلَّ يَوْم.', 'yasta‘milu n-nâsu l-hâtifa sâ‘âtin kulla yawm.', 'Les gens utilisent leur téléphone des heures chaque jour.'],
      ['مِنْ ناحِيَة، يُساعِدُنا عَلى التَّواصُلِ وَالتَّعَلُّم.', 'min nâHiya, yusâ‘idunâ ‘ala t-tawâSuli wa t-ta‘allum.', 'D’un côté, il nous aide à communiquer et à apprendre.'],
      ['وَمِنْ ناحِيَة أُخْرى، يَسْرِقُ وَقْتَنا وَتَرْكيزَنا.', 'wa min nâHiya ukhrâ, yasriqu waqtanâ wa tarkîzanâ.', 'De l’autre, il nous vole notre temps et notre concentration.'],
      ['في رَأْيي، المُشْكِلَةُ لَيْسَتْ في الهاتِف، بَلْ في طَريقَةِ اسْتِعْمالِه.', 'fî ra’yî, al-mushkilatu laysat fi l-hâtif, bal fî Tarîqati sti‘mâlih.', 'À mon avis, le problème n’est pas le téléphone, mais la façon de l’utiliser.'],
      ['لِذلِكَ أُطْفِئُهُ ساعَةً قَبْلَ النَّوْم.', 'li-dhâlika uTfi’uhu sâ‘atan qabla n-nawm.', 'C’est pourquoi je l’éteins une heure avant de dormir.'],
    ] } },

    { lesson: [
      'Le comparatif se forme sur le schéma أَفْعَل af‘al : كَبير kabîr → أَكْبَر akbar (plus grand), صَغير → أَصْغَر, جَميل → أَجْمَل, سَهْل → أَسْهَل.',
      'Plus … que : أَفْعَل + مِنْ min : داكار أَكْبَرُ مِنْ سان لويس Dâkâr akbaru min Sân Lwî.',
      'Le superlatif : أَفْعَل + nom indéfini, ou ال + أَفْعَل : أَكْبَرُ مَدينَة akbaru madîna (la plus grande ville), هِيَ الأَكْبَر hiya l-akbar.',
      'Bon / mieux / meilleur : جَيِّد jayyid → أَفْضَل afDal ; beaucoup → أَكْثَر akthar (plus) ; peu → أَقَلّ aqall (moins).',
      'Autant que : مِثْل mithl (comme), نَفْس nafs (le même).',
    ], vocab: [
      ['أَكْبَر', 'akbar', 'plus grand'], ['أَصْغَر', 'aSghar', 'plus petit'], ['أَجْمَل', 'ajmal', 'plus beau'], ['أَسْهَل', 'ashal', 'plus facile'],
      ['أَصْعَب', 'aS‘ab', 'plus difficile'], ['أَغْلى', 'aghlâ', 'plus cher'], ['أَرْخَص', 'arkhaS', 'moins cher'], ['أَفْضَل', 'afDal', 'meilleur, mieux'],
      ['أَكْثَر', 'akthar', 'plus (quantité)'], ['أَقَلّ', 'aqall', 'moins'], ['مِثْل', 'mithl', 'comme'], ['نَفْس', 'nafs', 'le même'],
    ], writing: ['Écris 6 comparaisons entre Dakar et une autre ville.'],
    phrases: [['العَرَبِيَّةُ أَصْعَبُ مِنَ الإِسْبانِيَّة.', 'al-‘arabiyyatu aS‘abu mina l-isbâniyya.', 'L’arabe est plus difficile que l’espagnol.'], ['هذا أَفْضَلُ مَطْعَمٍ في المَدينَة.', 'hâdhâ afDalu maT‘amin fi l-madîna.', 'C’est le meilleur restaurant de la ville.'], ['أُخْتي أَطْوَلُ مِنّي.', 'ukhtî aTwalu minnî.', 'Ma sœur est plus grande que moi.']],
    dialogue: [
      ['سارة: أَيُّهُما أَجْمَل، داكار أَمِ الرِّباط؟', 'Sâra : ayyuhumâ ajmal, Dâkâr ami r-RibâT ?', 'Sara : Laquelle est la plus belle, Dakar ou Rabat ?'],
      ['عايدة: داكار أَكْبَرُ وَأَكْثَرُ حَرَكَة.', '‘Âyda : Dâkâr akbaru wa aktharu Haraka.', 'Aida : Dakar est plus grande et plus animée.'],
      ['سارة: وَالرِّباطُ أَهْدَأ وَأَنْظَف.', 'Sâra : wa r-RibâTu ahda’u wa anDHaf.', 'Sara : Et Rabat est plus calme et plus propre.'],
      ['عايدة: لكِنَّ شاطِئَ داكار أَجْمَلُ شاطِئٍ في العالَم!', '‘Âyda : lâkinna shâTi’a Dâkâr ajmalu shâTi’in fi l-‘âlam !', 'Aida : Mais la plage de Dakar est la plus belle du monde !'],
    ],
    reading: { title: 'Deux marchés', lines: [
      ['سوقُ صَنْدَقَة أَكْبَرُ سوقٍ في داكار.', 'sûqu Sandaqa akbaru sûqin fî Dâkâr.', 'Le marché Sandaga est le plus grand marché de Dakar.'],
      ['الأَسْعارُ فيهِ أَرْخَصُ، لكِنَّ الزِّحامَ أَكْثَر.', 'al-as‘âru fîhi arkhaSu, lâkinna z-ziHâma akthar.', 'Les prix y sont moins chers, mais il y a plus de monde.'],
      ['سوقُ كِرْمِل أَصْغَرُ وَأَهْدَأ.', 'sûqu Kirmil aSgharu wa ahda’.', 'Le marché Kermel est plus petit et plus calme.'],
      ['الخُضارُ هُناكَ أَغْلى قَليلًا، وَلكِنَّها أَجْمَل.', 'al-khuDâru hunâka aghlâ qalîlan, wa lâkinnahâ ajmal.', 'Les légumes y sont un peu plus chers, mais plus beaux.'],
      ['أَنا أُفَضِّلُ كِرْمِل، لِأَنَّني أُحِبُّ الهُدوء.', 'anâ ufaDDilu Kirmil, li-annanî uHibbu l-hudû’.', 'Je préfère Kermel, parce que j’aime le calme.'],
    ] } },

    { lesson: [
      'Condition réelle : إِذا idhâ + passé, puis le résultat : إِذا نَزَلَ المَطَرُ بَقيتُ في البَيْت idhâ nazala l-maTaru baqîtu fi l-bayt (s’il pleut, je reste à la maison). Le passé après idhâ a un sens présent ou futur.',
      'Condition irréelle : لَوْ law + passé, puis لَـ la- + passé : لَوْ كانَ عِنْدي وَقْت لَسافَرْتُ law kâna ‘indî waqt la-sâfartu (si j’avais le temps, je voyagerais).',
      'إِنْ in + présent apocopé, plus soutenu : إِنْ تَدْرُسي تَنْجَحي in tadrusî tanjaHî (si tu étudies, tu réussiras).',
      'Souhait : لَيْتَ layta (si seulement) : لَيْتَني أَتَكَلَّمُ العَرَبِيَّة بِطَلاقَة laytanî atakallamu l-‘arabiyya bi-Talâqa.',
    ], vocab: [
      ['إِذا', 'idhâ', 'si (réel)'], ['لَوْ', 'law', 'si (irréel)'], ['إِنْ', 'in', 'si (soutenu)'], ['لَيْتَ', 'layta', 'si seulement'],
      ['فُرْصَة', 'furSa', 'occasion'], ['حَظّ', 'HaDHDH', 'chance'], ['نَجَحَ', 'najaHa', 'réussir'], ['حَلُمَ', 'Haluma', 'rêver'],
      ['طَلاقَة', 'Talâqa', 'aisance (parler couramment)'], ['ثَرْوَة', 'tharwa', 'fortune'], ['مُسْتَقْبَل', 'mustaqbal', 'avenir'], ['ساعَدَ', 'sâ‘ada', 'aider'],
    ], writing: ['Écris 5 phrases avec لَوْ : « Si j’avais beaucoup d’argent… ».'],
    phrases: [['إِذا كانَ الجَوُّ جَميلًا ذَهَبْنا إلى البَحْر.', 'idhâ kâna l-jawwu jamîlan dhahabnâ ila l-baHr.', 'S’il fait beau, nous irons à la mer.'], ['لَوْ كُنْتُ غَنِيَّة لَبَنَيْتُ مَدْرَسَة.', 'law kuntu ghaniyya la-banaytu madrasa.', 'Si j’étais riche, je construirais une école.'], ['لَيْتَني أَعْرِفُ الجَواب.', 'laytanî a‘rifu l-jawâb.', 'Si seulement je connaissais la réponse.']],
    dialogue: [
      ['سارة: لَوْ رَبِحْتِ مِلْيونًا، ماذا تَفْعَلين؟', 'Sâra : law rabiHti milyûnan, mâdhâ taf‘alîn ?', 'Sara : Si tu gagnais un million, que ferais-tu ?'],
      ['عايدة: لَحَجَجْتُ مَعَ أُمّي أَوَّلًا.', '‘Âyda : la-Hajajtu ma‘a ummî awwalan.', 'Aida : D’abord, je ferais le pèlerinage avec ma mère.'],
      ['عايدة: ثُمَّ لَبَنَيْتُ بِئْرًا في قَرْيَةِ جَدَّتي.', '‘Âyda : thumma la-banaytu bi’ran fî qaryati jaddatî.', 'Aida : Puis je construirais un puits dans le village de ma grand-mère.'],
      ['سارة: ما شاءَ الله! وَلِنَفْسِكِ؟', 'Sâra : mâ shâ’a llâh ! wa li-nafsiki ?', 'Sara : Magnifique ! Et pour toi ?'],
      ['عايدة: لَسافَرْتُ إلى اليابان وَتَعَلَّمْتُ الرَّسْم.', '‘Âyda : la-sâfartu ila l-Yâbân wa ta‘allamtu r-rasm.', 'Aida : Je partirais au Japon et j’apprendrais la peinture.'],
    ],
    reading: { title: 'Si j’avais su', lines: [
      ['لَوْ عَرَفْتُ في العِشْرينَ ما أَعْرِفُهُ الآن،', 'law ‘araftu fi l-‘ishrîna mâ a‘rifuhu l-ân,', 'Si j’avais su à vingt ans ce que je sais maintenant,'],
      ['لَما خِفْتُ مِنْ رَأْيِ النّاس،', 'la-mâ khiftu min ra’yi n-nâs,', 'je n’aurais pas eu peur de l’avis des gens,'],
      ['وَلَبَدَأْتُ تَعَلُّمَ العَرَبِيَّة مُبَكِّرًا.', 'wa la-bada’tu ta‘allum al-‘arabiyya mubakkiran.', 'et j’aurais commencé l’arabe plus tôt.'],
      ['لكِنْ لا بَأْس، كُلُّ شَيْءٍ بِقَدَر.', 'lâkin lâ ba’s, kullu shay’in bi-qadar.', 'Mais ce n’est pas grave, tout est décrété.'],
      ['إِذا بَدَأْتُ اليَوْم، فَهُوَ أَفْضَلُ يَوْم.', 'idhâ bada’tu l-yawm, fa-huwa afDalu yawm.', 'Si je commence aujourd’hui, c’est le meilleur jour.'],
    ] } },

    { lesson: [
      'L’impératif se forme sur le présent sans préfixe : تَكْتُبينَ taktubîna → اُكْتُبي uktubî (écris, à une femme) ; تَجْلِسُ → اِجْلِسْ ijlis (assieds-toi, à un homme).',
      'Défense (ne… pas) : لا + présent apocopé : لا تَقْلَقي lâ taqlaqî (ne t’inquiète pas).',
      'Conseiller : يَجِبُ أَنْ yajibu an (il faut), مِنَ الأَفْضَلِ أَنْ mina l-afDali an (il vaut mieux), أَنْصَحُكِ بِـ anSaHuki bi- (je te conseille de).',
      'Demander poliment : مِنْ فَضْلِك, لَوْ سَمَحْتِ, هَلْ يُمْكِنُكِ أَنْ…؟ hal yumkinuki an… ? (pourrais-tu… ?).',
    ], vocab: [
      ['نَصيحَة', 'naSîHa', 'conseil'], ['أَنْصَحُكِ', 'anSaHuki', 'je te conseille'], ['اِسْتَريحي', 'istarîHî', 'repose-toi'], ['نامي', 'nâmî', 'dors'],
      ['اِشْرَبي', 'ishrabî', 'bois'], ['لا تَقْلَقي', 'lâ taqlaqî', 'ne t’inquiète pas'], ['لا تَنْسَيْ', 'lâ tansay', 'n’oublie pas'], ['تَعالَيْ', 'ta‘âlay', 'viens'],
      ['اِنْتَبِهي', 'intabihî', 'fais attention'], ['ساعِديني', 'sâ‘idînî', 'aide-moi'], ['مِنَ الأَفْضَل', 'mina l-afDal', 'il vaut mieux'], ['يُمْكِنُكِ', 'yumkinuki', 'tu peux'],
    ], writing: ['Écris 5 conseils à une amie stressée, à l’impératif féminin.'],
    phrases: [['اِسْتَريحي قَليلًا وَاشْرَبي ماءً.', 'istarîHî qalîlan washrabî mâ’an.', 'Repose-toi un peu et bois de l’eau.'], ['لا تَنْسَيْ صَلاةَ الفَجْر.', 'lâ tansay Salâta l-fajr.', 'N’oublie pas la prière de l’aube.'], ['هَلْ يُمْكِنُكِ أَنْ تُساعِديني؟', 'hal yumkinuki an tusâ‘idînî ?', 'Pourrais-tu m’aider ?'], ['أَنْصَحُكِ بِالمَشْيِ كُلَّ يَوْم.', 'anSaHuki bi-l-mashyi kulla yawm.', 'Je te conseille de marcher chaque jour.']],
    dialogue: [
      ['سارة: أَنا مُتْعَبَة جِدًّا هذِهِ الأَيّام.', 'Sâra : anâ mut‘aba jiddan hâdhihi l-ayyâm.', 'Sara : Je suis très fatiguée ces jours-ci.'],
      ['عايدة: نامي مُبَكِّرًا وَلا تَسْتَعْمِلي الهاتِفَ في السَّرير.', '‘Âyda : nâmî mubakkiran wa lâ tasta‘milî l-hâtifa fi s-sarîr.', 'Aida : Couche-toi tôt et n’utilise pas ton téléphone au lit.'],
      ['سارة: وَماذا أَيْضًا؟', 'Sâra : wa mâdhâ ayDan ?', 'Sara : Et quoi d’autre ?'],
      ['عايدة: اِمْشي نِصْفَ ساعَة كُلَّ صَباح، وَاقْرَئي أَذْكارَ الصَّباح.', '‘Âyda : imshî niSfa sâ‘a kulla SabâH, waqra’î adhkâra S-SabâH.', 'Aida : Marche une demi-heure chaque matin, et récite les invocations du matin.'],
      ['سارة: نَصيحَة جَميلَة، شُكْرًا.', 'Sâra : naSîHa jamîla, shukran.', 'Sara : Joli conseil, merci.'],
    ],
    reading: { title: 'Conseils d’une grand-mère', lines: [
      ['قالَتْ لي جَدَّتي:', 'qâlat lî jaddatî :', 'Ma grand-mère m’a dit :'],
      ['« يا اِبْنَتي، لا تَتَكَلَّمي كَثيرًا وَاسْمَعي أَكْثَر.', 'yâ bnatî, lâ tatakallamî kathîran wasma‘î akthar.', '« Ma fille, ne parle pas trop et écoute davantage.'],
      ['صِلي رَحِمَكِ وَلَوْ بِرِسالَة.', 'Silî raHimaki wa law bi-risâla.', 'Garde le lien avec ta famille, même par un message.'],
      ['اِبْتَسِمي، فَالاِبْتِسامَةُ صَدَقَة.', 'ibtasimî, fa-l-ibtisâmatu Sadaqa.', 'Souris, car le sourire est une aumône.'],
      ['وَتَوَكَّلي عَلى الله في كُلِّ أُمورِكِ. »', 'wa tawakkalî ‘ala llâhi fî kulli umûriki.', 'Et remets-toi à Allah dans toutes tes affaires. »'],
    ] } },

    { lesson: [
      'Habitude passée : كانَ kâna + présent : كُنْتُ أَلْعَبُ kuntu al‘abu (je jouais). كانَ se conjugue : كُنْتُ kuntu, كُنْتِ kunti, كانَتْ kânat, كُنّا kunnâ.',
      'Quand j’étais petite : عِنْدَما كُنْتُ صَغيرَة ‘indamâ kuntu Saghîra.',
      'Toujours / chaque : كُنّا نَذْهَبُ كُلَّ صَيْف kunnâ nadh-habu kulla Sayf (nous allions chaque été).',
      'Ne… plus : لَمْ أَعُدْ + présent lam a‘ud : لَمْ أَعُدْ أَلْعَبُ lam a‘ud al‘abu (je ne joue plus).',
    ], vocab: [
      ['طُفولَة', 'Tufûla', 'enfance'], ['ذِكْرَيات', 'dhikrayât', 'souvenirs'], ['قَرْيَة', 'qarya', 'village'], ['جَدَّة', 'jadda', 'grand-mère'],
      ['لَعِبَ', 'la‘iba', 'jouer'], ['حِكايَة', 'Hikâya', 'conte, récit'], ['كُتّاب', 'kuttâb', 'école coranique'], ['حَفِظَ', 'HafiDHa', 'mémoriser'],
      ['اِشْتاقَ', 'ishtâqa', 'regretter, manquer à'], ['قَديمًا', 'qadîman', 'autrefois'], ['كانَ', 'kâna', 'était'], ['ما زِلْتُ', 'mâ ziltu', 'je suis encore, toujours'],
    ], writing: ['Écris 8 phrases sur ton enfance avec كُنْتُ + présent.'],
    phrases: [['عِنْدَما كُنْتُ صَغيرَة كُنْتُ أَذْهَبُ إلى الكُتّاب.', '‘indamâ kuntu Saghîra kuntu adh-habu ila l-kuttâb.', 'Quand j’étais petite, j’allais à l’école coranique.'], ['كانَتْ جَدَّتي تَحْكي لَنا حِكايات.', 'kânat jaddatî taHkî lanâ Hikâyât.', 'Ma grand-mère nous racontait des histoires.'], ['ما زِلْتُ أَتَذَكَّرُ رائِحَةَ خُبْزِها.', 'mâ ziltu atadhakkaru râ’iHata khubzihâ.', 'Je me souviens encore de l’odeur de son pain.']],
    dialogue: [
      ['سارة: كَيْفَ كانَتْ طُفولَتُكِ؟', 'Sâra : kayfa kânat Tufûlatuki ?', 'Sara : Comment était ton enfance ?'],
      ['عايدة: كانَتْ جَميلَة. كُنّا نَعيشُ في بَيْتٍ كَبير مَعَ جَدَّتي.', '‘Âyda : kânat jamîla. kunnâ na‘îshu fî baytin kabîr ma‘a jaddatî.', 'Aida : Elle était belle. Nous vivions dans une grande maison avec ma grand-mère.'],
      ['سارة: وَماذا كُنْتِ تُحِبّين؟', 'Sâra : wa mâdhâ kunti tuHibbîn ?', 'Sara : Et qu’est-ce que tu aimais ?'],
      ['عايدة: كُنْتُ أُحِبُّ الرَّسْمَ عَلى الجُدْران!', '‘Âyda : kuntu uHibbu r-rasma ‘ala l-judrân !', 'Aida : J’adorais dessiner sur les murs !'],
      ['سارة: وَهَلْ ما زِلْتِ تَرْسُمين؟', 'Sâra : wa hal mâ zilti tarsumîn ?', 'Sara : Et tu dessines encore ?'],
      ['عايدة: نَعَم، لكِنْ عَلى الوَرَقِ الآن!', '‘Âyda : na‘am, lâkin ‘ala l-waraqi l-ân !', 'Aida : Oui, mais sur du papier maintenant !'],
    ],
    reading: { title: 'Les étés au village', lines: [
      ['كُلَّ صَيْف، كُنّا نُسافِرُ إلى قَرْيَةِ جَدّي.', 'kulla Sayf, kunnâ nusâfiru ilâ qaryati jaddî.', 'Chaque été, nous partions au village de mon grand-père.'],
      ['كُنّا نَسْتَيْقِظُ مَعَ الأَذان وَنَحْلِبُ البَقَرَة.', 'kunnâ nastayqiDHu ma‘a l-adhân wa naHlibu l-baqara.', 'Nous nous levions avec l’appel à la prière et nous traitions la vache.'],
      ['في المَساءِ كانَ الكِبارُ يَجْلِسونَ تَحْتَ الشَّجَرَة.', 'fi l-masâ’i kâna l-kibâru yajlisûna taHta sh-shajara.', 'Le soir, les grands s’asseyaient sous l’arbre.'],
      ['وَكانَتْ جَدَّتي تَحْكي لَنا قِصَصَ الأَنْبِياء.', 'wa kânat jaddatî taHkî lanâ qiSaSa l-anbiyâ’.', 'Et ma grand-mère nous racontait les histoires des prophètes.'],
      ['لَمْ أَعُدْ أَذْهَبُ كَثيرًا، لكِنَّني أَشْتاقُ إلى تِلْكَ الأَيّام.', 'lam a‘ud adh-habu kathîran, lâkinnanî ashtâqu ilâ tilka l-ayyâm.', 'Je n’y vais plus souvent, mais ces jours-là me manquent.'],
    ] } },

    { lesson: [
      'Les fêtes : عيدُ الفِطْر ‘îd al-fiTr (la Korité), عيدُ الأَضْحى ‘îd al-aD-Hâ (la Tabaski), المَوْلِد النَّبَوِيّ al-mawlid an-nabawiyy (le Gamou).',
      'Vœux : عيدٌ مُبارَك ‘îdun mubârak (bonne fête), كُلُّ عامٍ وَأَنْتِ بِخَيْر kullu ‘âmin wa anti bi-khayr (que chaque année te trouve en bien). رَمَضانُ كَريم RamaDânu karîm ; réponse : اللهُ أَكْرَم Allâhu akram.',
      'Le jeûne : صامَ يَصومُ Sâma yaSûmu (jeûner), الإِفْطار al-ifTâr (la rupture), السُّحور as-suHûr (le repas avant l’aube).',
      'Le verbe creux (avec â au milieu) perd son â quand la voyelle se ferme : صامَ Sâma → صُمْتُ Sumtu (j’ai jeûné).',
    ], vocab: [
      ['رَمَضان', 'RamaDân', 'Ramadan'], ['الصِّيام', 'aS-Siyâm', 'le jeûne'], ['الإِفْطار', 'al-ifTâr', 'la rupture du jeûne'], ['السُّحور', 'as-suHûr', 'le repas de l’aube'],
      ['التَّراويح', 'at-tarâwîH', 'prières de nuit du Ramadan'], ['الزَّكاة', 'az-zakâ', 'l’aumône obligatoire'], ['الصَّدَقَة', 'aS-Sadaqa', 'l’aumône'], ['العيد', 'al-‘îd', 'la fête'],
      ['أُضْحِيَة', 'uD-Hiya', 'mouton du sacrifice'], ['الحَجّ', 'al-Hajj', 'le pèlerinage'], ['دُعاء', 'du‘â’', 'invocation'], ['مُبارَك', 'mubârak', 'béni'],
    ], writing: ['Écris tes vœux de Korité à 3 personnes.', 'Raconte ta dernière Tabaski en 6 phrases.'],
    phrases: [['رَمَضانُ كَريم!', 'RamaDânu karîm !', 'Ramadan généreux !'], ['عيدٌ مُبارَك، كُلُّ عامٍ وَأَنْتِ بِخَيْر.', '‘îdun mubârak, kullu ‘âmin wa anti bi-khayr.', 'Bonne fête, que chaque année te trouve en bien.'], ['صُمْتُ اليَوْمَ وَالحَمْدُ لِله.', 'Sumtu l-yawma wa l-Hamdu lillâh.', 'J’ai jeûné aujourd’hui, Dieu merci.'], ['تَقَبَّلَ اللهُ مِنّا وَمِنْكُم.', 'taqabbala llâhu minnâ wa minkum.', 'Qu’Allah accepte de nous et de vous.']],
    dialogue: [
      ['سارة: كَيْفَ تَقْضينَ رَمَضان؟', 'Sâra : kayfa taqDîna RamaDân ?', 'Sara : Comment passes-tu le Ramadan ?'],
      ['عايدة: أَسْتَيْقِظُ لِلسُّحور، ثُمَّ أُصَلّي الفَجْرَ وَأَقْرَأُ القُرْآن.', '‘Âyda : astayqiDHu li-s-suHûr, thumma uSallî l-fajra wa aqra’u l-qur’ân.', 'Aida : Je me lève pour le suhûr, puis je prie le fajr et je lis le Coran.'],
      ['سارة: وَالإِفْطار؟', 'Sâra : wa l-ifTâr ?', 'Sara : Et la rupture ?'],
      ['عايدة: نُفْطِرُ بِالتَّمْرِ وَالماء، ثُمَّ نَأْكُلُ مَعَ العائِلَة.', '‘Âyda : nufTiru bi-t-tamri wa l-mâ’, thumma na’kulu ma‘a l-‘â’ila.', 'Aida : Nous rompons avec des dattes et de l’eau, puis nous mangeons en famille.'],
      ['سارة: وَفي اللَّيْل؟', 'Sâra : wa fi l-layl ?', 'Sara : Et la nuit ?'],
      ['عايدة: نَذْهَبُ إلى المَسْجِدِ لِصَلاةِ التَّراويح.', '‘Âyda : nadh-habu ila l-masjidi li-Salâti t-tarâwîH.', 'Aida : Nous allons à la mosquée pour les tarâwîh.'],
    ],
    reading: { title: 'La Tabaski à Dakar', lines: [
      ['قَبْلَ العيدِ بِأَيّام، يَشْتَري النّاسُ الأَضاحي.', 'qabla l-‘îdi bi-ayyâm, yashtarî n-nâsu l-aDâHî.', 'Quelques jours avant la fête, les gens achètent les moutons.'],
      ['صَباحَ العيد، يَلْبَسُ الجَميعُ ثِيابًا جَديدَة.', 'SabâHa l-‘îd, yalbasu l-jamî‘u thiyâban jadîda.', 'Le matin de la fête, tout le monde porte des habits neufs.'],
      ['يُصَلّونَ صَلاةَ العيد، ثُمَّ يَذْبَحونَ الأُضْحِيَة.', 'yuSallûna Salâta l-‘îd, thumma yadh-baHûna l-uD-Hiya.', 'Ils prient la prière de l’Aïd, puis sacrifient le mouton.'],
      ['تُطْبَخُ اللُّحومُ وَتُوَزَّعُ عَلى الجيرانِ وَالفُقَراء.', 'tuTbakhu l-luHûmu wa tuwazza‘u ‘ala l-jîrâni wa l-fuqarâ’.', 'La viande est cuisinée et partagée avec les voisins et les pauvres.'],
      ['وَفي المَساءِ يَزورُ النّاسُ بَعْضُهُمْ بَعْضًا وَيَطْلُبونَ المُسامَحَة.', 'wa fi l-masâ’i yazûru n-nâsu ba‘Duhum ba‘Dan wa yaTlubûna l-musâmaHa.', 'Et le soir, les gens se rendent visite et se demandent pardon.'],
    ] } },

    { lesson: [
      'La recette se dit à l’impératif ou au présent : ضَعي Da‘î (mets), اُطْبُخي uTbukhî (fais cuire), قَطِّعي qaTTi‘î (coupe), أَضيفي aDîfî (ajoute), اُتْرُكي utrukî (laisse).',
      'Quantités : مِلْعَقَة mil‘aqa (cuillère), كوب kûb (verre), كيلو، نِصْف، رُبْع rub‘ (quart), قَليل مِن qalîl min (un peu de).',
      'Temps de cuisson : لِمُدَّة li-mudda + durée : لِمُدَّةِ عِشْرينَ دَقيقَة (pendant vingt minutes).',
      'Le passif s’exprime souvent avec un verbe en يُـ / تُـ : يُطْبَخُ yuTbakhu (est cuit), تُقَدَّمُ tuqaddamu (est servie).',
    ], vocab: [
      ['وَصْفَة', 'waSfa', 'recette'], ['مَكَوِّنات', 'makawwinât', 'ingrédients'], ['بَصَل', 'baSal', 'oignon'], ['ثوم', 'thûm', 'ail'],
      ['طَماطِم', 'TamâTim', 'tomates'], ['زَيْت', 'zayt', 'huile'], ['مِلْح', 'milH', 'sel'], ['فُلْفُل', 'fulful', 'poivre, piment'],
      ['لَيْمون', 'laymûn', 'citron'], ['قِدْر', 'qidr', 'marmite'], ['فُرْن', 'furn', 'four'], ['مِلْعَقَة', 'mil‘aqa', 'cuillère'],
    ], writing: ['Écris ta recette préférée en arabe, étape par étape, à l’impératif féminin.'],
    phrases: [['قَطِّعي البَصَلَ قِطَعًا صَغيرَة.', 'qaTTi‘i l-baSala qiTa‘an Saghîra.', 'Coupe l’oignon en petits morceaux.'], ['أَضيفي مِلْعَقَةً مِنَ الزَّيْت.', 'aDîfî mil‘aqatan mina z-zayt.', 'Ajoute une cuillère d’huile.'], ['اُتْرُكيهِ عَلى النّارِ لِمُدَّةِ عِشْرينَ دَقيقَة.', 'utrukîhi ‘ala n-nâri li-muddati ‘ishrîna daqîqa.', 'Laisse-le sur le feu pendant vingt minutes.']],
    reading: { title: 'Le poulet yassa', lines: [
      ['المَكَوِّنات: دَجاجَة، خَمْسُ بَصَلات، ثَلاثُ لَيْمونات، خَرْدَل، زَيْت وَمِلْح.', 'al-makawwinât : dajâja, khamsu baSalât, thalâthu laymûnât, khardal, zayt wa milH.', 'Ingrédients : un poulet, cinq oignons, trois citrons, de la moutarde, de l’huile et du sel.'],
      ['أَوَّلًا، قَطِّعي البَصَلَ وَاخْلِطيهِ مَعَ عَصيرِ اللَّيْمونِ وَالخَرْدَل.', 'awwalan, qaTTi‘i l-baSala wakhliTîhi ma‘a ‘aSîri l-laymûni wa l-khardal.', 'D’abord, coupe les oignons et mélange-les avec le jus de citron et la moutarde.'],
      ['ضَعي الدَّجاجَ في هذا الخَليطِ لَيْلَةً كامِلَة.', 'Da‘i d-dajâja fî hâdha l-khalîTi laylatan kâmila.', 'Mets le poulet dans cette marinade toute une nuit.'],
      ['ثُمَّ اشْوي الدَّجاج، وَاطْبُخي البَصَلَ عَلى نارٍ هادِئَة.', 'thumma shwi d-dajâj, waTbukhi l-baSala ‘alâ nârin hâdi’a.', 'Puis grille le poulet, et fais cuire les oignons à feu doux.'],
      ['في النِّهايَة، يُقَدَّمُ الدَّجاجُ مَعَ البَصَلِ وَالأَرُزِّ الأَبْيَض.', 'fi n-nihâya, yuqaddamu d-dajâju ma‘a l-baSali wa l-aruzzi l-abyaD.', 'À la fin, le poulet est servi avec les oignons et du riz blanc.'],
    ] } },

    { lesson: [
      'Le pluriel des choses (non humaines) s’accorde au féminin singulier : السَّيّاراتُ كَثيرَة as-sayyârâtu kathîra (les voitures sont nombreuses).',
      'Rapporter une nouvelle : قالَ qâla (il a dit), أَعْلَنَ a‘lana (il a annoncé), حَسَبَ Hasaba (selon), وَفْقًا لِـ wafqan li- (d’après).',
      'Les nombres 3 à 10 prennent le genre inverse du nom : ثَلاثَةُ رِجال thalâthatu rijâl (trois hommes) / ثَلاثُ نِساء thalâthu nisâ’ (trois femmes).',
      'Le vocabulaire des médias : خَبَر khabar (nouvelle), أَخْبار akhbâr (informations), جَريدَة jarîda (journal), مَقال maqâl (article).',
    ], vocab: [
      ['خَبَر / أَخْبار', 'khabar / akhbâr', 'nouvelle / informations'], ['جَريدَة', 'jarîda', 'journal'], ['مَقال', 'maqâl', 'article'], ['حُكومَة', 'Hukûma', 'gouvernement'],
      ['مُجْتَمَع', 'mujtama‘', 'société'], ['سُكّان', 'sukkân', 'habitants'], ['زِحام', 'ziHâm', 'embouteillage, foule'], ['مَشْروع', 'mashrû‘', 'projet'],
      ['اِقْتِصاد', 'iqtiSâd', 'économie'], ['بيئَة', 'bî’a', 'environnement'], ['أَعْلَنَ', 'a‘lana', 'annoncer'], ['حَسَبَ', 'Hasaba', 'selon'],
    ], writing: ['Résume une nouvelle du jour en 5 phrases en arabe.'],
    phrases: [['ما الأَخْبار؟', 'ma l-akhbâr ?', 'Quelles sont les nouvelles ?'], ['حَسَبَ الجَريدَة، سَيَفْتَحُ القِطارُ الجَديدُ غَدًا.', 'Hasaba l-jarîda, sa-yaftaHu l-qiTâru l-jadîdu ghadan.', 'Selon le journal, le nouveau train ouvrira demain.'], ['الزِّحامُ في داكار مُشْكِلَةٌ كَبيرَة.', 'az-ziHâmu fî Dâkâr mushkilatun kabîra.', 'Les embouteillages sont un gros problème à Dakar.']],
    dialogue: [
      ['سارة: هَلْ قَرَأْتِ خَبَرَ القِطارِ السَّريع؟', 'Sâra : hal qara’ti khabara l-qiTâri s-sarî‘ ?', 'Sara : As-tu lu la nouvelle du train rapide ?'],
      ['عايدة: نَعَم، سَيَصِلُ إلى المَطارِ الجَديد.', '‘Âyda : na‘am, sa-yaSilu ila l-maTâri l-jadîd.', 'Aida : Oui, il ira jusqu’au nouvel aéroport.'],
      ['سارة: هذا جَيِّد، الطُّرُقُ مُزْدَحِمَةٌ جِدًّا.', 'Sâra : hâdhâ jayyid, aT-Turuqu muzdaHimatun jiddan.', 'Sara : C’est bien, les routes sont très encombrées.'],
      ['عايدة: صَحيح، وَهُوَ أَفْضَلُ لِلْبيئَة أَيْضًا.', '‘Âyda : SaHîH, wa huwa afDalu li-l-bî’a ayDan.', 'Aida : C’est vrai, et c’est mieux pour l’environnement aussi.'],
    ],
    reading: { title: 'Dakar grandit', lines: [
      ['يَسْكُنُ في داكار وَضَواحيها أَكْثَرُ مِنْ ثَلاثَةِ مَلايينِ شَخْص.', 'yaskunu fî Dâkâr wa Dawâhîhâ aktharu min thalâthati malâyîni shakhS.', 'Plus de trois millions de personnes vivent à Dakar et sa banlieue.'],
      ['المَدينَةُ تَكْبُرُ بِسُرْعَة، وَالبِناياتُ الجَديدَةُ كَثيرَة.', 'al-madînatu takburu bi-sur‘a, wa l-binâyâtu l-jadîdatu kathîra.', 'La ville grandit vite, et les nouveaux immeubles sont nombreux.'],
      ['لكِنَّ الزِّحامَ وَالتَّلَوُّثَ مِنْ أَكْبَرِ المَشاكِل.', 'lâkinna z-ziHâma wa t-talawwutha min akbari l-mashâkil.', 'Mais les embouteillages et la pollution sont parmi les plus gros problèmes.'],
      ['لِذلِكَ أَطْلَقَتِ الحُكومَةُ مَشاريعَ نَقْلٍ جَديدَة.', 'li-dhâlika aTlaqati l-Hukûmatu mashârî‘a naqlin jadîda.', 'C’est pourquoi le gouvernement a lancé de nouveaux projets de transport.'],
      ['يَأْمُلُ السُّكّانُ أَنْ تَصيرَ الحَياةُ أَسْهَل.', 'ya’mulu s-sukkânu an taSîra l-Hayâtu ashal.', 'Les habitants espèrent que la vie deviendra plus facile.'],
    ] } },

    { lesson: [
      'Mariage : مَبْروك mabrûk (félicitations). L’invocation du Prophète ﷺ pour le marié : بارَكَ اللهُ لَكَ وَبارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُما في خَيْر bâraka llâhu laka wa bâraka ‘alayka wa jama‘a baynakumâ fî khayr (qu’Allah te bénisse, répande Sa bénédiction sur toi et vous unisse dans le bien).',
      'Naissance : مَبْروك المَوْلود mabrûk al-mawlûd ; أَنْبَتَهُ اللهُ نَباتًا حَسَنًا anbatahu llâhu nabâtan Hasanan (qu’Allah le fasse bien grandir).',
      'Condoléances : إِنّا لِلّهِ وَإِنّا إِلَيْهِ راجِعون innâ lillâhi wa innâ ilayhi râji‘ûn ; أَحْسَنَ اللهُ عَزاءَكُم aHsana llâhu ‘azâ’akum (qu’Allah vous console) ; رَحِمَهُ الله raHimahu llâh / رَحِمَها الله raHimahâ llâh.',
      'Le duel (pour deux personnes) : لَكُما lakumâ (pour vous deux), لَهُما lahumâ (pour eux deux).',
    ], vocab: [
      ['زَواج / عُرْس', 'zawâj / ‘urs', 'mariage / noces'], ['عَروس', '‘arûs', 'mariée'], ['عَريس', '‘arîs', 'marié'], ['خُطوبَة', 'khuTûba', 'fiançailles'],
      ['مَوْلود', 'mawlûd', 'nouveau-né'], ['عَقيقَة', '‘aqîqa', 'baptême (sacrifice de naissance)'], ['تَعْزِيَة', 'ta‘ziya', 'condoléances'], ['صَداقَة', 'Sadâqa', 'amitié'],
      ['جيران', 'jîrân', 'voisins'], ['ضَيْف', 'Dayf', 'invité'], ['هَدِيَّة', 'hadiyya', 'cadeau'], ['مَبْروك', 'mabrûk', 'félicitations'],
    ], writing: ['Écris un message de félicitations pour un mariage et un de condoléances, avec les formules en arabe.'],
    phrases: [['مَبْروك! بارَكَ اللهُ لَكُما.', 'mabrûk ! bâraka llâhu lakumâ.', 'Félicitations ! Qu’Allah vous bénisse tous les deux.'], ['إِنّا لِلّهِ وَإِنّا إِلَيْهِ راجِعون.', 'innâ lillâhi wa innâ ilayhi râji‘ûn.', 'Nous sommes à Allah et c’est vers Lui que nous retournons.'], ['أَحْسَنَ اللهُ عَزاءَكُم.', 'aHsana llâhu ‘azâ’akum.', 'Qu’Allah vous console.']],
    dialogue: [
      ['سارة: هَلْ سَمِعْتِ؟ مَرْيَمُ سَتَتَزَوَّجُ الشَّهْرَ القادِم!', 'Sâra : hal sami‘ti ? Maryamu sa-tatazawwaju sh-shahra l-qâdim !', 'Sara : Tu as entendu ? Mariam se marie le mois prochain !'],
      ['عايدة: ما شاءَ الله! مَبْروك! مَنِ العَريس؟', '‘Âyda : mâ shâ’a llâh ! mabrûk ! mani l-‘arîs ?', 'Aida : Magnifique ! Félicitations ! Qui est le marié ?'],
      ['سارة: شابٌّ طَيِّبٌ مِنْ تيس.', 'Sâra : shâbbun Tayyibun min Tîs.', 'Sara : Un garçon bien, de Thiès.'],
      ['عايدة: سَأَشْتَري لَها هَدِيَّة. بارَكَ اللهُ لَهُما.', '‘Âyda : sa-ashtarî lahâ hadiyya. bâraka llâhu lahumâ.', 'Aida : Je vais lui acheter un cadeau. Qu’Allah les bénisse.'],
    ],
    reading: { title: 'Le mariage de Mariam', lines: [
      ['كانَ العُرْسُ يَوْمَ السَّبْتِ في بَيْتِ أَهْلِ العَروس.', 'kâna l-‘ursu yawma s-sabti fî bayti ahli l-‘arûs.', 'Les noces ont eu lieu samedi chez la famille de la mariée.'],
      ['بَدَأَ اليَوْمُ بِعَقْدِ النِّكاحِ في المَسْجِد.', 'bada’a l-yawmu bi-‘aqdi n-nikâHi fi l-masjid.', 'La journée a commencé par l’acte de mariage à la mosquée.'],
      ['ثُمَّ جاءَ الضُّيوفُ وَأَكَلوا وَفَرِحوا.', 'thumma jâ’a D-Duyûfu wa akalû wa fariHû.', 'Puis les invités sont venus, ont mangé et se sont réjouis.'],
      ['كانَتِ العَروسُ جَميلَةً جِدًّا في ثَوْبِها الأَبْيَض.', 'kânati l-‘arûsu jamîlatan jiddan fî thawbihâ l-abyaD.', 'La mariée était très belle dans sa robe blanche.'],
      ['دَعا الجَميعُ لَها بِالسَّعادَةِ وَالبَرَكَة.', 'da‘a l-jamî‘u lahâ bi-s-sa‘âdati wa l-baraka.', 'Tout le monde a invoqué pour elle le bonheur et la bénédiction.'],
    ] } },

    { lesson: [
      'Pour lire un texte long : une lecture sans traduction pour le sens général, une deuxième en cherchant les mots, une troisième à voix haute.',
      'Les mots arabes se rangent par racine : si tu connais ك ت ب (écrire), tu devines مَكْتَبَة maktaba (bibliothèque) et كاتِبَة kâtiba (écrivaine).',
      'Les schémas les plus utiles : فاعِل fâ‘il (celui qui fait : كاتِب), مَفْعول maf‘ûl (ce qui est fait : مَكْتوب), مَفْعَل maf‘al (le lieu : مَكْتَب).',
      'En conversation, n’aie pas peur de demander : أَعيدي مِنْ فَضْلِك (répète), ماذا تَقْصِدين؟ mâdhâ taqSidîn ? (que veux-tu dire ?), بِكَلِماتٍ أُخْرى bi-kalimâtin ukhrâ (en d’autres mots).',
    ], vocab: [
      ['كَتَبَ', 'kataba', 'écrire'], ['كاتِب / كاتِبَة', 'kâtib / kâtiba', 'écrivain / écrivaine'], ['مَكْتوب', 'maktûb', 'écrit, destin'], ['مَكْتَبَة', 'maktaba', 'bibliothèque, librairie'],
      ['عَلِمَ', '‘alima', 'savoir'], ['عالِم', '‘âlim', 'savant'], ['مَعْلومَة', 'ma‘lûma', 'information'], ['تَعَلُّم', 'ta‘allum', 'apprentissage'],
      ['ماذا تَقْصِدين؟', 'mâdhâ taqSidîn ?', 'que veux-tu dire ?'], ['بِالضَّبْط', 'bi-D-DabT', 'exactement'], ['طَبْعًا', 'Tab‘an', 'bien sûr'], ['في الحَقيقَة', 'fi l-Haqîqa', 'en réalité'],
    ], writing: ['Écris un texte d’une page : « Pourquoi j’apprends l’arabe ».'],
    phrases: [['ماذا تَقْصِدين بِالضَّبْط؟', 'mâdhâ taqSidîna bi-D-DabT ?', 'Que veux-tu dire exactement ?'], ['في الحَقيقَة، أَفْهَمُ أَكْثَرَ مِمّا أَتَكَلَّم.', 'fi l-Haqîqa, afhamu akthara mimmâ atakallam.', 'En réalité, je comprends plus que je ne parle.'], ['أُريدُ أَنْ أَقْرَأَ القُرْآنَ وَأَفْهَمَهُ بِدونِ تَرْجَمَة.', 'urîdu an aqra’a l-qur’âna wa afhamahu bi-dûni tarjama.', 'Je veux lire le Coran et le comprendre sans traduction.']],
    dialogue: [
      ['سارة: صارَتْ عَرَبِيَّتُكِ جَيِّدَةً جِدًّا!', 'Sâra : Sârat ‘arabiyyatuki jayyidatan jiddan !', 'Sara : Ton arabe est devenu très bon !'],
      ['عايدة: شُكْرًا، لكِنْ ما زِلْتُ أُخْطِئُ كَثيرًا.', '‘Âyda : shukran, lâkin mâ ziltu ukhTi’u kathîran.', 'Aida : Merci, mais je fais encore beaucoup d’erreurs.'],
      ['سارة: هذا طَبيعِيّ. الخَطَأُ طَريقُ التَّعَلُّم.', 'Sâra : hâdhâ Tabî‘iyy. al-khaTa’u Tarîqu t-ta‘allum.', 'Sara : C’est normal. L’erreur est le chemin de l’apprentissage.'],
      ['عايدة: صَدَقْتِ. هَدَفي أَنْ أَفْهَمَ خُطْبَةَ الجُمُعَة كُلَّها.', '‘Âyda : Sadaqti. hadafî an afhama khuTbata l-jumu‘a kullahâ.', 'Aida : Tu as raison. Mon but est de comprendre tout le sermon du vendredi.'],
      ['سارة: إِنْ شاءَ الله قَريبًا! هَيّا نَقْرَأُ نَصًّا مَعًا.', 'Sâra : in shâ’a llâh qarîban ! hayyâ naqra’u naSSan ma‘an.', 'Sara : Bientôt, si Dieu le veut ! Allez, lisons un texte ensemble.'],
    ],
    reading: { title: 'La lettre d’Aida (texte long)', lines: [
      ['بِسْمِ اللهِ الرَّحْمنِ الرَّحيم.', 'bismi llâhi r-raHmâni r-raHîm.', 'Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux.'],
      ['قَبْلَ سَنَة، كُنْتُ لا أَعْرِفُ إِلّا بَعْضَ الكَلِمات.', 'qabla sana, kuntu lâ a‘rifu illâ ba‘Da l-kalimât.', 'Il y a un an, je ne connaissais que quelques mots.'],
      ['كُنْتُ أَقْرَأُ الفاتِحَةَ في صَلاتي وَلا أَفْهَمُ مَعْناها جَيِّدًا.', 'kuntu aqra’u l-fâtiHata fî Salâtî wa lâ afhamu ma‘nâhâ jayyidan.', 'Je récitais la Fâtiha dans ma prière sans bien comprendre son sens.'],
      ['فَقَرَّرْتُ أَنْ أَتَعَلَّمَ قَليلًا كُلَّ يَوْم، عِشْرينَ دَقيقَةً فَقَط.', 'fa-qarrartu an ata‘allama qalîlan kulla yawm, ‘ishrîna daqîqatan faqaT.', 'Alors j’ai décidé d’apprendre un peu chaque jour, vingt minutes seulement.'],
      ['تَعَلَّمْتُ الحُروفَ، ثُمَّ الكَلِماتِ، ثُمَّ الجُمَل.', 'ta‘allamtu l-Hurûfa, thumma l-kalimâti, thumma l-jumal.', 'J’ai appris les lettres, puis les mots, puis les phrases.'],
      ['وَتَعَرَّفْتُ عَلى صَديقَةٍ مَغْرِبِيَّةٍ تَتَكَلَّمُ مَعي كُلَّ جُمُعَة.', 'wa ta‘arraftu ‘alâ Sadîqatin maghribiyyatin tatakallamu ma‘î kulla jumu‘a.', 'Et j’ai rencontré une amie marocaine qui parle avec moi chaque vendredi.'],
      ['اليَوْمَ أَفْهَمُ مُعْظَمَ ما أَقْرَأُ في صَلاتي.', 'al-yawma afhamu mu‘DHama mâ aqra’u fî Salâtî.', 'Aujourd’hui, je comprends l’essentiel de ce que je récite dans ma prière.'],
      ['وَأَشْعُرُ أَنَّ قَلْبي أَقْرَبُ إلى الله.', 'wa ash‘uru anna qalbî aqrabu ila llâh.', 'Et je sens que mon cœur est plus proche d’Allah.'],
      ['الطَّريقُ طَويل، لكِنَّ كُلَّ خُطْوَةٍ مُبارَكَة.', 'aT-Tarîqu Tawîl, lâkinna kulla khuTwatin mubâraka.', 'Le chemin est long, mais chaque pas est béni.'],
      ['وَالحَمْدُ لِلّهِ رَبِّ العالَمين.', 'wa l-Hamdu lillâhi rabbi l-‘âlamîn.', 'Et louange à Allah, Seigneur des mondes.'],
    ] } },
  ],
};
