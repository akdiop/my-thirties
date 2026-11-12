/**
 * « La grammaire simplifiée » (Apprendre l'arabe facilement, apprendre-larabe-facilement.com) : chaque fiche recopiée
 * en arabe tel que dans le livret, avec la phonétique et la traduction française ajoutées.
 */
export type Ligne = [ar: string, ph: string, fr: string];
export type Bloc = { titre?: Ligne; lignes: Ligne[] };
export type Chapitre = { id: string; titre: Ligne; blocs: Bloc[] };
const b = (titre: Ligne | undefined, ...lignes: Ligne[]): Bloc => ({ titre, lignes });

export const GRAMMAIRE_SIMPLIFIEE: Chapitre[] = [
  { id: 'kalam', titre: ['الكلام', 'al-kalâm', 'La parole'], blocs: [
    b(['في اللغة', 'fî l-lugha', 'Dans la langue'], ['النطق المفهم', 'an-nutqu l-mufhim', 'Le fait de prononcer quelque chose de compréhensible']),
    b(['في الاصطلاح', 'fî l-istilâh', 'En grammaire'], ['اللفظ المركب المفيد بالوضع', 'al-lafzu l-murakkabu l-mufîdu bi-l-wad‘', 'L’énoncé composé de plusieurs mots, qui donne un sens complet, dans la langue arabe']),
  ] },
  { id: 'aqsam', titre: ['أقسام الكلام', 'aqsâmu l-kalâm', 'Les catégories de mots'], blocs: [
    b(['أقسام الكلام ثلاثة', 'aqsâmu l-kalâmi thalâtha', 'Il y en a trois'],
      ['اسم · دَرْسٌ', 'ism · darsun', 'Le nom : une leçon'], ['فعل · كَتَبَ', 'fi‘l · kataba', 'Le verbe : il a écrit'], ['حرف جاء لمعنى · فِي', 'harfun jâ’a li-ma‘nâ · fî', 'La particule, qui apporte un sens : dans']),
  ] },
  { id: 'alamat-asma', titre: ['علامات الأسماء', '‘alâmâtu l-asmâ’', 'Les signes du nom'], blocs: [
    b(['التنوين', 'at-tanwîn', 'Le tanwin'], ['بَيْتٌ · بَيْتًا · بَيْتٍ', 'baytun · baytan · baytin', 'une maison']),
    b(['أل', 'al', 'L’article al'], ['الْبَيْتُ', 'al-baytu', 'la maison']),
    b(['الخفض', 'al-khafd', 'La terminaison en i'], ['بَيْتٍ · الْبَيْتِ', 'baytin · al-bayti', 'une maison, la maison (au cas indirect)']),
    b(['حروف الخفض', 'hurûfu l-khafd', 'Les prépositions'], ['فِي الْبَيْتِ', 'fî l-bayti', 'dans la maison']),
  ] },
  { id: 'alamat-afal', titre: ['علامات الأفعال', '‘alâmâtu l-af‘âl', 'Les signes du verbe'], blocs: [
    b(['تاء الفاعل', 'tâ’u l-fâ‘il', 'Le tâ’ du sujet'], ['كَتَبْتُ · كَتَبْتَ · كَتَبْتِ', 'katabtu · katabta · katabti', 'j’ai écrit · tu as écrit (masc.) · tu as écrit (fém.)'],
      ['كَتَبْتُمَا · كَتَبْتُمْ · كَتَبْتُنَّ', 'katabtumâ · katabtum · katabtunna', 'vous avez écrit (deux) · vous avez écrit (masc.) · vous avez écrit (fém.)']),
    b(['تاء التأنيث', 'tâ’u t-ta’nîth', 'Le tâ’ du féminin'], ['كَتَبَتْ', 'katabat', 'elle a écrit']),
    b(['قد', 'qad', 'Qad'], ['قد نجح زيد', 'qad najaha zayd', 'Zayd a réussi (c’est fait)'], ['قد ينجح زيد', 'qad yanjahu zayd', 'Zayd réussira peut-être']),
    b(['نون التوكيد', 'nûnu t-tawkîd', 'Le noun d’insistance'], ['زيد يكتُبَنَّ', 'zaydun yaktubanna', 'Zayd écrira, assurément'], ['اُكْتُبَنَّ', 'uktubanna', 'écris, absolument']),
  ] },
  { id: 'revision-1', titre: ['مراجعة لما سبق', 'murâja‘a limâ sabaq', 'Révision'], blocs: [
    b(['الكلمة', 'al-kalima', 'Le mot']),
    b(['اسم', 'ism', 'Le nom'], ['التنوين · أل · الخفض · حروف الخفض', 'at-tanwîn · al · al-khafd · hurûfu l-khafd', 'le tanwin, l’article, la terminaison en i, les prépositions']),
    b(['فعل', 'fi‘l', 'Le verbe'], ['تاء الفاعل · تاء التأنيث · قد · نون التوكيد', 'tâ’u l-fâ‘il · tâ’u t-ta’nîth · qad · nûnu t-tawkîd', 'le tâ’ du sujet, le tâ’ du féminin, qad, le noun d’insistance']),
    b(['حرف', 'harf', 'La particule'], ['لا يقبل علامات الاسم ولا علامات الفعل', 'lâ yaqbalu ‘alâmâti l-ismi wa lâ ‘alâmâti l-fi‘l', 'Elle n’accepte ni les signes du nom ni ceux du verbe']),
  ] },
  { id: 'irab', titre: ['الإعراب', 'al-i‘râb', 'La déclinaison'], blocs: [
    b(undefined, ['هو تغيير حركات أواخر الكلمات لفظا أو تقديرا', 'huwa taghyîru harakâti awâkhiri l-kalimâti lafzan aw taqdîran', 'C’est le changement de la voyelle finale des mots, visible ou sous-entendue']),
    b(['ظاهر', 'zâhir', 'Visible'], ['جاء محمدٌ', 'jâ’a muhammadun', 'Muhammad est venu'], ['رأيتُ محمدًا', 'ra’aytu muhammadan', 'J’ai vu Muhammad'], ['سلَّمتُ على محمدٍ', 'sallamtu ‘alâ muhammadin', 'J’ai salué Muhammad']),
    b(['أسباب الإعراب التقديري', 'asbâbu l-i‘râbi t-taqdîrî', 'Pourquoi la voyelle est sous-entendue'],
      ['سعى مصطفى · للتعذُّر', 'sa‘â mustafâ · li-t-ta‘adhdhur', 'Mustafâ s’est empressé : impossible à prononcer (finale en â)'],
      ['رأيتُ صديقي · للمناسبة', 'ra’aytu sadîqî · li-l-munâsaba', 'J’ai vu mon ami : le « î » de « mon » impose sa voyelle'],
      ['يجري القاضي · للثقل', 'yajrî l-qâdî · li-th-thiql', 'Le juge court : la voyelle serait trop lourde (finale en î)']),
  ] },
  { id: 'bina', titre: ['البناء', 'al-binâ’', 'L’invariabilité'], blocs: [
    b(undefined, ['ثبوت آخر الكلمة على حالة واحدة', 'thubûtu âkhiri l-kalimati ‘alâ hâlatin wâhida', 'La fin du mot reste toujours la même'], ['هو أربعة أنواع', 'huwa arba‘atu anwâ‘', 'Il y en a quatre sortes']),
    b(['بناء على الضم', 'binâ’un ‘alâ d-damm', 'Fixé sur « u »'], ['نحنُ', 'nahnu', 'nous']),
    b(['بناء على الفتح', 'binâ’un ‘alâ l-fath', 'Fixé sur « a »'], ['أنتَ', 'anta', 'tu (masc.)']),
    b(['بناء على الكسر', 'binâ’un ‘alâ l-kasr', 'Fixé sur « i »'], ['هذهِ', 'hâdhihi', 'celle-ci']),
    b(['بناء على السكون', 'binâ’un ‘alâ s-sukûn', 'Fixé sur le soukoun'], ['كَمْ', 'kam', 'combien']),
  ] },
  { id: 'asma-khamsa', titre: ['الأسماء الخمسة', 'al-asmâ’u l-khamsa', 'Les cinq noms'], blocs: [
    b(['مرفوع بالواو', 'marfû‘ bi-l-wâw', 'Au cas sujet : avec « û »'], ['أبُوكَ · أخُوكَ · حمُوكَ · فُوكَ · ذُو عِلْمٍ', 'abûka · akhûka · hamûka · fûka · dhû ‘ilm', 'ton père · ton frère · ton beau-père · ta bouche · doté de science']),
    b(['منصوب بالألف', 'mansûb bi-l-alif', 'Au cas direct : avec « â »'], ['أبَاكَ · أخَاكَ · حمَاكَ · فَاكَ · ذَا عِلْمٍ', 'abâka · akhâka · hamâka · fâka · dhâ ‘ilm', 'mêmes mots, au cas direct']),
    b(['مخفوض بالياء', 'makhfûd bi-l-yâ’', 'Au cas indirect : avec « î »'], ['أبِيكَ · أخِيكَ · حمِيكَ · فِيكَ · ذِي عِلْمٍ', 'abîka · akhîka · hamîka · fîka · dhî ‘ilm', 'mêmes mots, au cas indirect']),
  ] },
  { id: 'afal-khamsa', titre: ['الأفعال الخمسة', 'al-af‘âlu l-khamsa', 'Les cinq verbes'], blocs: [
    b(undefined, ['كل فعل مضارع اتصل به ألف الاثنين أو واو الجماعة أو ياء المخاطبة', 'kullu fi‘lin mudâri‘in ittasala bihi alifu l-ithnayni aw wâwu l-jamâ‘ati aw yâ’u l-mukhâtaba', 'Tout verbe au présent qui porte le alif du duel, le waw du pluriel ou le yâ’ du féminin « tu »']),
    b(['مرفوع', 'marfû‘', 'Au cas sujet : il garde son « n »'], ['يكتبان · تكتبان', 'yaktubâni · taktubâni', 'ils écrivent (deux) · vous écrivez (deux) : alif du duel'],
      ['يكتبون · تكتبون', 'yaktubûna · taktubûna', 'ils écrivent · vous écrivez : waw du pluriel'], ['تكتبين', 'taktubîna', 'tu écris (fém.) : yâ’ de la femme à qui l’on parle']),
    b(['منصوب · مجزوم', 'mansûb · majzûm', 'Au cas direct ou apocopé : le « n » tombe'], ['يكتبا · تكتبا · يكتبوا · تكتبوا · تكتبي', 'yaktubâ · taktubâ · yaktubû · taktubû · taktubî', 'les mêmes verbes, sans le « n » final']),
  ] },
  { id: 'mamnu', titre: ['الممنوع من الصرف', 'al-mamnû‘u mina s-sarf', 'Les noms diptotes'], blocs: [
    b(undefined, ['هو اسم معرب لا يجوز تنوينه', 'huwa ismun mu‘rabun lâ yajûzu tanwînuh', 'C’est un nom déclinable qui ne prend jamais le tanwin'], ['الأسماء التي تمنع من الصرف خمسة أنواع', 'al-asmâ’u llatî tumna‘u mina s-sarfi khamsatu anwâ‘', 'Il y en a cinq sortes']),
    b(['العلم', 'al-‘alam', 'Les noms propres'], ['عائشة · عثمان · إسحاق · عمر', '‘â’isha · ‘uthmân · ishâq · ‘umar', 'Aïcha, Othmân, Isaac, Omar']),
    b(['الصفة', 'as-sifa', 'Certains adjectifs'], ['غضبان · أحمر', 'ghadbân · ahmar', 'en colère, rouge']),
    b(['صيغة منتهى الجموع', 'sîghatu muntahâ l-jumû‘', 'Certains pluriels longs'], ['مساجد · مفاتيح', 'masâjid · mafâtîh', 'des mosquées, des clés']),
    b(['الاسم المنتهي بألف التأنيث المقصورة', 'al-ismu l-muntahî bi-alifi t-ta’nîthi l-maqsûra', 'Les noms finis par le « â » court du féminin'], ['ليلى · غضبى', 'laylâ · ghadbâ', 'Laylâ, en colère (fém.)']),
    b(['الاسم المنتهي بألف التأنيث الممدودة', 'al-ismu l-muntahî bi-alifi t-ta’nîthi l-mamdûda', 'Les noms finis par « â’ » du féminin'], ['صحراء · علماء', 'sahrâ’ · ‘ulamâ’', 'un désert, des savants']),
  ] },
  { id: 'ahkam-afal', titre: ['أحكام الأفعال', 'ahkâmu l-af‘âl', 'Le statut des verbes'], blocs: [
    b(['مبني', 'mabnî', 'Invariables'], ['الماضي · الأمر', 'al-mâdî · al-amr', 'le passé, l’impératif'], ['المضارع ذو النونين (نون التوكيد · نون النسوة)', 'al-mudâri‘u dhû n-nûnayn (nûnu t-tawkîd · nûnu n-niswa)', 'le présent avec le noun d’insistance ou le noun du féminin pluriel']),
    b(['معرب', 'mu‘rab', 'Déclinable : le présent'], ['مرفوع · منصوب · مجزوم', 'marfû‘ · mansûb · majzûm', 'au cas sujet, au cas direct, apocopé']),
  ] },
  { id: 'nawasib', titre: ['النواصب', 'an-nawâsib', 'Ce qui met le présent au cas direct'], blocs: [
    b(['أَنْ · لَنْ · إِذَنْ · كَيْ', 'an · lan · idhan · kay', 'que · ne… pas (futur) · alors · afin de'],
      ['أريد أن أدرسَ', 'urîdu an adrusa', 'Je veux étudier'], ['لن أجلسَ هنا', 'lan ajlisa hunâ', 'Je ne m’assiérai pas ici'],
      ['سأراجع جيدا · إذن تنجحَ', 'sa-urâji‘u jayyidan · idhan tanjaha', 'Je vais bien réviser · Alors tu réussiras'], ['سوف أسافر إلى مصر كي أتعلمَ اللغة العربية', 'sawfa usâfiru ilâ misra kay ata‘allama l-lughata l-‘arabiyya', 'Je partirai en Égypte afin d’apprendre l’arabe']),
  ] },
  { id: 'jawazim', titre: ['الجوازم', 'al-jawâzim', 'Ce qui met le présent à l’apocopé'], blocs: [
    b(['لَمْ · لَمَّا · لَامُ الْأَمْرِ · لَا النَّاهِيَة', 'lam · lammâ · lâmu l-amr · lâ n-nâhiya', 'ne… pas (passé) · pas encore · le lâm de l’ordre · le lâ de l’interdiction'],
      ['لَمْ يراجعْ زيد', 'lam yurâji‘ zayd', 'Zayd n’a pas révisé'], ['لَمَّا يراجعْ زيد', 'lammâ yurâji‘ zayd', 'Zayd n’a pas encore révisé'], ['لِتَكْتُبْ', 'li-taktub', 'Que tu écrives !'], ['لَا تفعلْ هذا', 'lâ taf‘al hâdhâ', 'Ne fais pas cela']),
  ] },
  { id: 'fail', titre: ['الفاعل', 'al-fâ‘il', 'Le sujet'], blocs: [
    b(undefined, ['هو اسم مرفوع يأتي بعد فعل مبني للمعلوم ويدل على الذي قام بالفعل', 'huwa ismun marfû‘un ya’tî ba‘da fi‘lin mabniyyin li-l-ma‘lûm wa yadullu ‘alâ lladhî qâma bi-l-fi‘l', 'Nom au cas sujet, après un verbe à la voix active : il désigne celui qui fait l’action'],
      ['سافر زيدٌ', 'sâfara zaydun', 'Zayd a voyagé'], ['سافرتُ', 'sâfartu', 'J’ai voyagé (le sujet est le « tu » final)']),
  ] },
  { id: 'naib-fail', titre: ['نائب الفاعل', 'nâ’ibu l-fâ‘il', 'Le sujet du verbe passif'], blocs: [
    b(undefined, ['هو اسم مرفوع يأتي بعد فعل مبني للمجهول ويدل على الذي وقع الفعل عليه', 'huwa ismun marfû‘un ya’tî ba‘da fi‘lin mabniyyin li-l-majhûl wa yadullu ‘alâ lladhî waqa‘a l-fi‘lu ‘alayh', 'Nom au cas sujet, après un verbe passif : il désigne celui qui subit l’action'],
      ['ضُرِبَ زيدٌ', 'duriba zaydun', 'Zayd a été frappé'], ['ضُرِبْتُ', 'duribtu', 'J’ai été frappé']),
  ] },
  { id: 'mubtada', titre: ['المبتدأ والخبر', 'al-mubtada’ wa l-khabar', 'Le sujet et l’attribut de la phrase nominale'], blocs: [
    b(['المبتدأ', 'al-mubtada’', 'Le sujet'], ['هو الاسم المرفوع الذي يقع في بداية الجملة الاسمية', 'huwa l-ismu l-marfû‘u lladhî yaqa‘u fî bidâyati l-jumlati l-ismiyya', 'Le nom au cas sujet qui ouvre la phrase nominale'], ['الطَّالِبُ مُجْتَهِدٌ', 'at-tâlibu mujtahidun', 'L’étudiant est assidu']),
    b(['الخبر', 'al-khabar', 'L’attribut'], ['هو الذي يصنع مع المبتدأ جملة مفيدة · وأنواعه ثلاثة', 'huwa lladhî yasna‘u ma‘a l-mubtada’i jumlatan mufîda · wa anwâ‘uhu thalâtha', 'Il forme avec le sujet une phrase complète · trois sortes'],
      ['خبر مفرد · الطالب مجتهد', 'khabar mufrad · at-tâlibu mujtahid', 'Un seul mot : l’étudiant est assidu'],
      ['خبر جملة · الطالب كتب الدرس · الطالب كتابه جديد', 'khabar jumla · at-tâlibu kataba d-dars · at-tâlibu kitâbuhu jadîd', 'Une phrase : l’étudiant a écrit la leçon · l’étudiant, son livre est neuf'],
      ['خبر شبه جملة · الطالب في الفصل · الطالب عند أحمد', 'khabar shibh jumla · at-tâlibu fî l-fasl · at-tâlibu ‘inda ahmad', 'Un complément : l’étudiant est en classe · l’étudiant est chez Ahmad']),
  ] },
  { id: 'kana', titre: ['كان وأخواتها', 'kâna wa akhawâtuhâ', 'Kâna et ses sœurs'], blocs: [
    b(undefined, ['كان وأخواتها أفعال ناقصة ناسخة تدخل على الجملة الاسمية فترفع المبتدأ ويسمى اسمها وتنصب الخبر ويسمى خبرها', 'kâna wa akhawâtuhâ af‘âlun nâqisatun nâsikha tadkhulu ‘alâ l-jumlati l-ismiyya fa-tarfa‘u l-mubtada’ wa yusammâ ismahâ wa tansibu l-khabar wa yusammâ khabarahâ', 'Verbes incomplets qui entrent sur la phrase nominale : le sujet reste au cas sujet (leur « nom »), l’attribut passe au cas direct (leur « attribut »)'],
      ['محمدٌ مجتهدٌ ← كان محمدٌ مجتهدًا', 'muhammadun mujtahidun ← kâna muhammadun mujtahidan', 'Muhammad est assidu → Muhammad était assidu']),
    b(['أخواتها', 'akhawâtuhâ', 'Ses sœurs'], ['كان · صار · أصبح · أضحى · أمسى · بات · ليس · ظل · مادام · مازال · مابرح · مافتيء · ما انفك', 'kâna · sâra · asbaha · adhâ · amsâ · bâta · laysa · zalla · mâ dâma · mâ zâla · mâ bariha · mâ fati’a · mâ nfakka', 'être · devenir · devenir au matin · au milieu de la matinée · au soir · passer la nuit · ne pas être · rester · tant que · ne pas cesser (quatre formes)']),
  ] },
  { id: 'inna', titre: ['إن وأخواتها', 'inna wa akhawâtuhâ', 'Inna et ses sœurs'], blocs: [
    b(undefined, ['إن وأخواتها حروف ناسخة تدخل على الجملة الاسمية وتنصب المبتدأ ويسمى اسمها وترفع الخبر ويسمى خبرها', 'inna wa akhawâtuhâ hurûfun nâsikha tadkhulu ‘alâ l-jumlati l-ismiyya wa tansibu l-mubtada’ wa yusammâ ismahâ wa tarfa‘u l-khabar wa yusammâ khabarahâ', 'Particules qui entrent sur la phrase nominale : le sujet passe au cas direct (leur « nom »), l’attribut reste au cas sujet (leur « attribut »)'],
      ['محمدٌ مجتهدٌ ← إنَّ محمدًا مجتهدٌ', 'muhammadun mujtahidun ← inna muhammadan mujtahidun', 'Muhammad est assidu → Certes, Muhammad est assidu']),
    b(['أخواتها', 'akhawâtuhâ', 'Ses sœurs'], ['إنَّ · أنَّ · لَيْتَ · لَعَلَّ · لَكِنَّ · كَأَنَّ', 'inna · anna · layta · la‘alla · lâkinna · ka’anna', 'certes · que · si seulement · peut-être · mais · comme si']),
  ] },
  { id: 'zanna', titre: ['ظن وأخواتها', 'zanna wa akhawâtuhâ', 'Zanna et ses sœurs'], blocs: [
    b(undefined, ['ظن وأخواتها أفعال ناسخة تدخل على الجملة الاسمية وتنصب المبتدأ على أنه مفعول أول وتنصب الخبر أيضا على أنه مفعول ثان', 'zanna wa akhawâtuhâ af‘âlun nâsikha tadkhulu ‘alâ l-jumlati l-ismiyya wa tansibu l-mubtada’a ‘alâ annahu maf‘ûlun awwal wa tansibu l-khabara aydan ‘alâ annahu maf‘ûlun thân', 'Verbes qui entrent sur la phrase nominale et mettent les deux mots au cas direct, comme deux compléments'],
      ['محمدٌ مريضٌ ← ظَنَنْتُ محمدًا مريضًا', 'muhammadun marîdun ← zanantu muhammadan marîdan', 'Muhammad est malade → J’ai pensé que Muhammad était malade']),
    b(['وهذه الأفعال ثلاثة أقسام', 'wa hâdhihi l-af‘âlu thalâthatu aqsâm', 'Trois groupes'],
      ['أفعال الظن · ظن · حسب · زعم · خال', 'af‘âlu z-zann · zanna · hasiba · za‘ama · khâla', 'Le doute : penser, croire, prétendre, s’imaginer'],
      ['أفعال اليقين · علم · رأى · وجد', 'af‘âlu l-yaqîn · ‘alima · ra’â · wajada', 'La certitude : savoir, voir, trouver'],
      ['أفعال التحويل · جعل · اتخذ', 'af‘âlu t-tahwîl · ja‘ala · ittakhadha', 'La transformation : rendre, prendre pour']),
  ] },
  { id: 'nat', titre: ['النعت', 'an-na‘t', 'L’adjectif'], blocs: [
    b(undefined, ['تابع مشتق يبين صفة في اسم قبله', 'tâbi‘un mushtaqqun yubayyinu sifatan fî smin qablah', 'Un mot qui suit, dérivé d’un autre mot, et qui décrit le nom qui le précède'],
      ['محمدٌ رجلٌ صالحٌ', 'muhammadun rajulun sâlihun', 'Muhammad est un homme vertueux'], ['رأيتُ الرجلَ الصالحَ', 'ra’aytu r-rajula s-sâliha', 'J’ai vu l’homme vertueux'], ['سلمتُ على رجلَيْنِ صالحَيْنِ', 'sallamtu ‘alâ rajulayni sâlihayn', 'J’ai salué deux hommes vertueux']),
    b(['النعت يجب أن يوافق المنعوت في كل شيء', 'an-na‘tu yajibu an yuwâfiqa l-man‘ûta fî kulli shay’', 'L’adjectif s’accorde en tout avec le nom'], ['الإعراب · النوع · العدد · التعريف والتنكير', 'al-i‘râb · an-naw‘ · al-‘adad · at-ta‘rîf wa t-tankîr', 'le cas, le genre, le nombre, défini ou indéfini']),
  ] },
  { id: 'atf', titre: ['العطف', 'al-‘atf', 'La coordination'], blocs: [
    b(undefined, ['تابع يكون بينه وبين متبوعه حرف من حروف العطف العشرة', 'tâbi‘un yakûnu baynahu wa bayna matbû‘ihi harfun min hurûfi l-‘atfi l-‘ashara', 'Un mot qui suit, relié au précédent par l’une des dix conjonctions'], ['جاء محمدٌ وزيدٌ', 'jâ’a muhammadun wa zaydun', 'Muhammad et Zayd sont venus']),
    b(['حروف العطف', 'hurûfu l-‘atf', 'Les dix conjonctions'], ['الواو · الفاء · ثم · أو · إما · أم · حتى · لا · لكن · بل', 'al-wâw · al-fâ’ · thumma · aw · immâ · am · hattâ · lâ · lâkin · bal', 'et · puis aussitôt · puis ensuite · ou · soit · ou bien · jusqu’à · non · mais · plutôt']),
  ] },
  { id: 'tawkid', titre: ['التوكيد', 'at-tawkîd', 'Le renforcement'], blocs: [
    b(['توكيد لفظي', 'tawkîd lafzî', 'Par répétition'], ['جاء زيد زيد', 'jâ’a zaydun zayd', 'Zayd, Zayd est venu'], ['جاء جاء زيد', 'jâ’a jâ’a zayd', 'Il est venu, il est venu, Zayd'], ['نعم نعم', 'na‘am na‘am', 'Oui, oui']),
    b(['توكيد معنوي', 'tawkîd ma‘nawî', 'Par un mot de renfort'], ['نفس / عين', 'nafs / ‘ayn', 'lui-même'], ['كل / جميع', 'kull / jamî‘', 'tous'], ['كلا / كلتا', 'kilâ / kiltâ', 'les deux'], ['أجمع / أكتع / أبصع / أبتع', 'ajma‘ / akta‘ / absa‘ / abta‘', 'tout entier']),
  ] },
  { id: 'badal', titre: ['البدل', 'al-badal', 'L’apposition'], blocs: [
    b(['البدل أربعة أنواع', 'al-badalu arba‘atu anwâ‘', 'Quatre sortes'],
      ['بدل مطابق · جاء زيد أخوك', 'badal mutâbiq · jâ’a zaydun akhûk', 'Identique : Zayd, ton frère, est venu'],
      ['بدل بعض من كل · قرأت الكتاب مقدمته', 'badal ba‘d min kull · qara’tu l-kitâba muqaddimatah', 'Une partie du tout : j’ai lu le livre, son introduction'],
      ['بدل اشتمال · أحب زيدا علمه', 'badal ishtimâl · uhibbu zaydan ‘ilmah', 'Ce que contient le nom : j’aime Zayd, sa science'],
      ['بدل غلط · جاء زيد أحمد', 'badal ghalat · jâ’a zaydun ahmad', 'Une correction : Zayd, euh, Ahmad est venu']),
  ] },
  { id: 'mafail', titre: ['المفاعيل الخمسة', 'al-mafâ‘îlu l-khamsa', 'Les cinq compléments'], blocs: [
    b(undefined, ['قرأتُ والسراجَ الكتابَ ليلا طلبًا للعلمِ قراءةً طويلا', 'qara’tu wa s-sirâja l-kitâba laylan talaban li-l-‘ilmi qirâ’atan tawîlan', 'J’ai lu, avec la lampe, le livre, la nuit, pour chercher la science, une longue lecture'],
      ['مفعول معه · والسراجَ', 'maf‘ûl ma‘ah · wa s-sirâja', 'Le complément d’accompagnement : avec la lampe'], ['مفعول به · الكتابَ', 'maf‘ûl bih · al-kitâba', 'Le complément d’objet : le livre'],
      ['مفعول فيه · ليلا', 'maf‘ûl fîh · laylan', 'Le complément de temps ou de lieu : la nuit'], ['مفعول له · طلبًا للعلم', 'maf‘ûl lah · talaban li-l-‘ilm', 'Le complément de but : pour chercher la science'],
      ['مفعول مطلق · قراءةً طويلا', 'maf‘ûl mutlaq · qirâ’atan tawîlan', 'Le complément absolu : une longue lecture']),
  ] },
  { id: 'hal', titre: ['الحال', 'al-hâl', 'Le complément d’état'], blocs: [
    b(undefined, ['اسم منصوب يبين هيئة الفعل وعلامته أنه جواب لسؤال يبدأ بـ(كيف)', 'ismun mansûbun yubayyinu hay’ata l-fi‘l wa ‘alâmatuhu annahu jawâbun li-su’âlin yabda’u bi-kayf', 'Nom au cas direct qui décrit l’état pendant l’action ; il répond à la question « comment ? »'],
      ['جاء زيد راكبا', 'jâ’a zaydun râkiban', 'Zayd est venu à cheval'], ['نام الطفل حزينا', 'nâma t-tiflu hazînan', 'L’enfant s’est endormi triste'], ['دخل المدير غاضبا', 'dakhala l-mudîru ghâdiban', 'Le directeur est entré en colère']),
  ] },
  { id: 'tamyiz', titre: ['التمييز', 'at-tamyîz', 'Le complément de précision'], blocs: [
    b(['التمييز نوعان', 'at-tamyîzu naw‘ân', 'Deux sortes'], ['تمييز المفرد · حضر عشرون طالبا', 'tamyîz al-mufrad · hadara ‘ishrûna tâliban', 'Il précise un mot : vingt étudiants sont venus'],
      ['تمييز الجملة · ازداد محمد علما', 'tamyîz al-jumla · izdâda muhammadun ‘ilman', 'Il précise la phrase : Muhammad a grandi en science']),
  ] },
  { id: 'mustathna', titre: ['المستثنى', 'al-mustathnâ', 'L’exception'], blocs: [
    b(undefined, ['هو إخراج شيء بـ(إلا) أو إحدى أخواتها', 'huwa ikhrâju shay’in bi-illâ aw ihdâ akhawâtihâ', 'Retirer quelque chose d’un ensemble avec « illâ » ou l’une de ses sœurs'],
      ['نجح الطلاب إلا زيدا', 'najaha t-tullâbu illâ zaydan', 'Les étudiants ont réussi, sauf Zayd'], ['نجح الطلاب غير زيد', 'najaha t-tullâbu ghayra zayd', 'Les étudiants ont réussi, sauf Zayd'], ['نجح الطلاب عدا زيدا', 'najaha t-tullâbu ‘adâ zaydan', 'Les étudiants ont réussi, excepté Zayd']),
    b(['أخوات (إلا)', 'akhawâtu illâ', 'Les sœurs de illâ'], ['إلا / غير / سوى / عدا / خلا / حاشا', 'illâ / ghayr / siwâ / ‘adâ / khalâ / hâshâ', 'sauf, excepté']),
  ] },
  { id: 'la-nafiya', titre: ['اسم لا النافية للجنس', 'ismu lâ n-nâfiya li-l-jins', 'Le lâ de négation absolue'], blocs: [
    b(undefined, ['لا النافية للجنس: حرف نفي يفيد نفي الخبر عن جنس الاسم أي عن كل أفراد الاسم', 'lâ n-nâfiyatu li-l-jins : harfu nafyin yufîdu nafya l-khabari ‘an jinsi l-ism, ay ‘an kulli afrâdi l-ism', 'Une négation qui vaut pour toute l’espèce désignée par le nom'],
      ['لا طالبَ حاضرٌ', 'lâ tâliba hâdirun', 'Aucun étudiant n’est présent'], ['لا مدرسَ غائبٌ', 'lâ mudarrisa ghâ’ibun', 'Aucun professeur n’est absent'], ['لا بائعَ في السوق', 'lâ bâ’i‘a fî s-sûq', 'Il n’y a aucun vendeur au marché']),
  ] },
  { id: 'munada', titre: ['المنادى', 'al-munâdâ', 'L’apostrophe'], blocs: [
    b(undefined, ['هو المطلوب إقباله بحرف يساوي الفعل (أدعو) في المعنى', 'huwa l-matlûbu iqbâluhu bi-harfin yusâwî l-fi‘la ad‘û fî l-ma‘nâ', 'Celui qu’on appelle, avec une particule qui veut dire « j’appelle »'], ['يا زيد', 'yâ zayd', 'Ô Zayd'], ['أ / أي / يا / أيا / هيا', 'a / ay / yâ / ayâ / hayâ', 'les particules d’appel']),
    b(['أنواع المنادى', 'anwâ‘u l-munâdâ', 'Les sortes d’apostrophe'], ['العلم المفرد · يا زيدُ', 'al-‘alamu l-mufrad · yâ zaydu', 'Un nom propre seul : ô Zayd'], ['النكرة المقصودة · يا أستاذُ', 'an-nakiratu l-maqsûda · yâ ustâdhu', 'Un nom précis : ô professeur'],
      ['النكرة غير المقصودة · يا رجلاً', 'an-nakiratu ghayru l-maqsûda · yâ rajulan', 'Un nom quelconque : ô un homme'], ['المضاف · يا طالبَ العلم', 'al-mudâf · yâ tâliba l-‘ilm', 'Un nom suivi d’un complément : ô chercheur de science'],
      ['شبه المضاف · يا جالسًا في الفصل', 'shibhu l-mudâf · yâ jâlisan fî l-fasl', 'Un nom avec un complément : ô toi assis en classe']),
  ] },
  { id: 'makhfudat', titre: ['المخفوضات', 'al-makhfûdât', 'Les mots au cas indirect'], blocs: [
    b(['ثلاثة أنواع', 'thalâthatu anwâ‘', 'Trois sortes'], ['مخفوض بالحرف · الطالب في الفصلِ', 'makhfûd bi-l-harf · at-tâlibu fî l-fasli', 'Par une préposition : l’étudiant est dans la classe'],
      ['مخفوض بالإضافة · كتاب الأستاذِ جديد', 'makhfûd bi-l-idâfa · kitâbu l-ustâdhi jadîd', 'Par l’annexion : le livre du professeur est neuf'], ['مخفوض بالتَّبَعِيَّة · سلمتُ على رجلٍ صالحٍ', 'makhfûd bi-t-taba‘iyya · sallamtu ‘alâ rajulin sâlihin', 'Parce qu’il suit un mot au cas indirect : j’ai salué un homme vertueux']),
    b(undefined, ['بسمِ اللهِ الرحمنِ الرحيمِ', 'bismi llâhi r-rahmâni r-rahîm', 'Les trois sortes à la fois : bi (préposition), Allâh (annexion), ar-Rahmân ar-Rahîm (qui suivent)']),
  ] },
];

const PR: [string, string, string, string, string, string, string, string][] = [
  ['أَنَا', 'anâ', 'je', 'دَرَسْتُ', 'darastu', 'أَدْرُسُ', 'adrusu', ''], ['نَحْنُ', 'nahnu', 'nous', 'دَرَسْنَا', 'darasnâ', 'نَدْرُسُ', 'nadrusu', ''],
  ['أَنْتَ', 'anta', 'tu (masc.)', 'دَرَسْتَ', 'darasta', 'تَدْرُسُ', 'tadrusu', 'اُدْرُسْ · udrus'], ['أَنْتِ', 'anti', 'tu (fém.)', 'دَرَسْتِ', 'darasti', 'تَدْرُسِينَ', 'tadrusîna', 'اُدْرُسِي · udrusî'],
  ['أَنْتُمَا', 'antumâ', 'vous deux', 'دَرَسْتُمَا', 'darastumâ', 'تَدْرُسَانِ', 'tadrusâni', 'اُدْرُسَا · udrusâ'], ['أَنْتُمْ', 'antum', 'vous (masc.)', 'دَرَسْتُمْ', 'darastum', 'تَدْرُسُونَ', 'tadrusûna', 'اُدْرُسُوا · udrusû'],
  ['أَنْتُنَّ', 'antunna', 'vous (fém.)', 'دَرَسْتُنَّ', 'darastunna', 'تَدْرُسْنَ', 'tadrusna', 'اُدْرُسْنَ · udrusna'], ['هُوَ', 'huwa', 'il', 'دَرَسَ', 'darasa', 'يَدْرُسُ', 'yadrusu', ''],
  ['هِيَ', 'hiya', 'elle', 'دَرَسَتْ', 'darasat', 'تَدْرُسُ', 'tadrusu', ''], ['هُمَا', 'humâ', 'eux deux', 'دَرَسَا', 'darasâ', 'يَدْرُسَانِ', 'yadrusâni', ''],
  ['هُمَا', 'humâ', 'elles deux', 'دَرَسَتَا', 'darasatâ', 'تَدْرُسَانِ', 'tadrusâni', ''], ['هُمْ', 'hum', 'ils', 'دَرَسُوا', 'darasû', 'يَدْرُسُونَ', 'yadrusûna', ''],
  ['هُنَّ', 'hunna', 'elles', 'دَرَسْنَ', 'darasna', 'يَدْرُسْنَ', 'yadrusna', ''],
];
const POSS: Ligne[] = [['دَرْسِي', 'darsî', 'ma leçon'], ['دَرْسُنَا', 'darsunâ', 'notre leçon'], ['دَرْسُكَ', 'darsuka', 'ta leçon (masc.)'], ['دَرْسُكِ', 'darsuki', 'ta leçon (fém.)'],
  ['دَرْسُكُمَا', 'darsukumâ', 'votre leçon (deux)'], ['دَرْسُكُمْ', 'darsukum', 'votre leçon (masc.)'], ['دَرْسُكُنَّ', 'darsukunna', 'votre leçon (fém.)'], ['دَرْسُهُ', 'darsuhu', 'sa leçon (à lui)'],
  ['دَرْسُهَا', 'darsuhâ', 'sa leçon (à elle)'], ['دَرْسُهُمَا', 'darsuhumâ', 'leur leçon (deux)'], ['دَرْسُهُمْ', 'darsuhum', 'leur leçon (masc.)'], ['دَرْسُهُنَّ', 'darsuhunna', 'leur leçon (fém.)']];

const FORMES_AUG: Ligne[] = [
  ['أَفْعَلَ يُفْعِلُ أَفْعِلْ إِفْعَال', 'af‘ala yuf‘ilu af‘il if‘âl', 'ex. أَخْرَجَ يُخْرِجُ أَخْرِجْ إِخْرَاج, akhraja : faire sortir · أَدْخَلَ يُدْخِلُ أَدْخِلْ إِدْخَال, adkhala : faire entrer'],
  ['فَاعَلَ يُفَاعِلُ فَاعِلْ مُفَاعَلَة', 'fâ‘ala yufâ‘ilu fâ‘il mufâ‘ala', 'forme à alif ajouté'], ['فَعَّلَ يُفَعِّلُ فَعِّلْ تَفْعِيل', 'fa‘‘ala yufa‘‘ilu fa‘‘il taf‘îl', 'forme à 2e lettre doublée'],
  ['اِنْفَعَلَ يَنْفَعِلُ اِنْفَعِلْ اِنْفِعَال', 'infa‘ala yanfa‘ilu infa‘il infi‘âl', 'forme à « in » ajouté'], ['اِفْتَعَلَ يَفْتَعِلُ اِفْتَعِلْ اِفْتِعَال', 'ifta‘ala yafta‘ilu ifta‘il ifti‘âl', 'forme à « ta » ajouté'],
  ['تَفَاعَلَ يَتَفَاعَلُ تَفَاعَلْ تَفَاعُل', 'tafâ‘ala yatafâ‘alu tafâ‘al tafâ‘ul', 'forme à « ta » et alif ajoutés'], ['تَفَعَّلَ يَتَفَعَّلُ تَفَعَّلْ تَفَعُّل', 'tafa‘‘ala yatafa‘‘alu tafa‘‘al tafa‘‘ul', 'forme à « ta » ajouté et 2e lettre doublée'],
  ['اِفْعَلَّ يَفْعَلُّ اِفْعَلِلْ اِفْعِلَال', 'if‘alla yaf‘allu if‘alil if‘ilâl', 'forme à dernière lettre doublée'], ['اِسْتَفْعَلَ يَسْتَفْعِلُ اِسْتَفْعِلْ اِسْتِفْعَال', 'istaf‘ala yastaf‘ilu istaf‘il istif‘âl', 'forme à « ista » ajouté'],
];

/** « 30 fawâ’id indispensables dans la grammaire et la conjugaison » (apprendre-larabe-facilement.com), recopiées fiche par fiche. */
export const FAWAID: Chapitre[] = [
  { id: 'f1', titre: ['أَقْسَامُ الْكَلِمَةِ', 'aqsâmu l-kalima', 'Les catégories de mots'], blocs: [b(undefined, ['اِسْم', 'ism', 'le nom'], ['فِعْل', 'fi‘l', 'le verbe'], ['حَرْف', 'harf', 'la particule'])] },
  { id: 'f2', titre: ['الْمَعْرِفَةُ وَ النَّكِرَةُ', 'al-ma‘rifa wa n-nakira', 'Le défini et l’indéfini'], blocs: [
    b(['الْمَعْرِفَةُ', 'al-ma‘rifa', 'Le défini'], ['الْبَيْتُ', 'al-baytu', 'la maison'], ['كِتَابُ الْأُسْتَاذِ', 'kitâbu l-ustâdhi', 'le livre du professeur']),
    b(['مُضَافٌ إِلَيْهِ', 'mudâfun ilayh', 'Le complément de nom'], ['الْأُسْتَاذِ', 'al-ustâdhi', 'Un mot défini qui précise le mot précédent et le rend ainsi défini']),
    b(['النَّكِرَةُ', 'an-nakira', 'L’indéfini'], ['بَيْتٌ', 'baytun', 'une maison']),
  ] },
  { id: 'f3', titre: ['أَنْوَاعُ الْأَفْعَالِ', 'anwâ‘u l-af‘âl', 'Les catégories de verbes'], blocs: [
    b(undefined, ['الْمَاضِي', 'al-mâdî', 'le passé : l’action est faite dans le passé'], ['الْمُضَارِعِ', 'al-mudâri‘', 'l’inaccompli : l’action se fait dans le présent ou le futur'], ['الْأَمْر', 'al-amr', 'l’impératif : pour donner un ordre']),
    b(['الْأَزْمَانُ الثَّلَاثَةُ', 'al-azmânu th-thalâtha', 'Les trois temps'], ['الْمَاضِي', 'al-mâdî', 'le passé'], ['الْحَال', 'al-hâl', 'le présent'], ['الْمُسْتَقْبَل', 'al-mustaqbal', 'le futur'],
      ['مُسْتَقْبَل قَرِيب · سَأَكْتُبُ', 'mustaqbal qarîb · sa-aktubu', 'le futur proche : je vais écrire'], ['مُسْتَقْبَل بَعِيد · سَوْفَ أُسَافِرُ', 'mustaqbal ba‘îd · sawfa usâfiru', 'le futur lointain : je voyagerai']),
  ] },
  { id: 'f4', titre: ['الْحُرُوف', 'al-hurûf', 'Les lettres et les particules'], blocs: [
    b(['حُرُوف مَبْنَى', 'hurûf mabnâ', 'Les lettres de l’alphabet'], ['أ ب ت ث ج ح …', 'alif, bâ’, tâ’, thâ’, jîm, hâ’…', 'elles construisent les mots, sans sens propre']),
    b(['حُرُوف مَعْنَى', 'hurûf ma‘nâ', 'Les particules : elles portent un sens'], ['سَأَكْتُبُ', 'sa-aktubu', 'je vais écrire'], ['لَمْ أَكْتُبْ', 'lam aktub', 'je n’ai pas écrit']),
  ] },
  { id: 'f5', titre: ['الْجُمْلَة', 'al-jumla', 'La phrase'], blocs: [
    b(['الْجُمْلَةُ الاسْمِيَّةُ', 'al-jumlatu l-ismiyya', 'La phrase nominale'], ['الطَّالِبُ جَمِيلٌ', 'at-tâlibu jamîlun', 'L’étudiant est beau : الْمُبْتَدَأ (le sujet) + الْخَبَر (l’attribut)']),
    b(['الْجُمْلَةُ الْفِعْلِيَّةُ', 'al-jumlatu l-fi‘liyya', 'La phrase verbale']),
  ] },
  { id: 'f5b', titre: ['الْجُمْلَةُ الْفِعْلِيَّةُ', 'al-jumlatu l-fi‘liyya', 'La phrase verbale'], blocs: [
    b(undefined, ['كَتَبَ مُحَمَّدٌ الدَّرْسَ', 'kataba muhammadun ad-darsa', 'Muhammad a écrit la leçon : الْفِعْل (le verbe) + الْفَاعِل (le sujet) + مَفْعُولٌ بِه (le complément d’objet direct)']),
  ] },
  { id: 'f6', titre: ['حُرُوفُ الْجَرِّ', 'hurûfu l-jarr', 'Les prépositions'], blocs: [b(undefined,
    ['مِنْ · أَنَا مِنْ فَرَنْسَا', 'min · anâ min faransâ', 'de, du : je suis de France'], ['عَنْ · اِبْتَعِدْ عَنِ الشَّرِّ', '‘an · ibta‘id ‘ani sh-sharr', 'de, du : éloigne-toi du mal'],
    ['فِي · أَنَا فِي الْبَيْتِ', 'fî · anâ fî l-bayt', 'dans : je suis dans la maison'], ['إِلَى · ذَهَبْتُ إِلَى الْمَسْجِدِ', 'ilâ · dhahabtu ilâ l-masjid', 'vers : je suis allé à la mosquée'],
    ['اللَّام · الْقَلَمُ لَكَ / الْقَلَمُ لِي', 'al-lâm · al-qalamu laka / al-qalamu lî', 'l’appartenance : le stylo est à toi, le stylo est à moi'], ['الْبَاء · أَكْتُبُ بِالْقَلَمِ', 'al-bâ’ · aktubu bi-l-qalam', 'avec, en : j’écris avec le stylo'],
    ['الْكَاف · أَنْتَ كَالْأَسَدِ', 'al-kâf · anta ka-l-asad', 'la ressemblance : tu es comme le lion'], ['عَلَى · الْقَلَمُ عَلَى الْمَكْتَبِ', '‘alâ · al-qalamu ‘alâ l-maktab', 'sur : le stylo est sur le bureau'])] },
  { id: 'f7', titre: ['الظُّرُوف', 'az-zurûf', 'Les adverbes de temps et de lieu'], blocs: [
    b(['ظَرْفُ الزَّمَان', 'zarfu z-zamân', 'De temps'], ['قَبْلَ ، بَعْدَ …', 'qabla, ba‘da…', 'avant, après…']),
    b(['ظَرْفُ الْمَكَان', 'zarfu l-makân', 'De lieu'], ['فَوْقَ ، تَحْتَ …', 'fawqa, tahta…', 'au-dessus, en dessous…']),
    b(['À retenir', '', ''], ['ظَرْف · فَتْحَة', 'zarf · fatha', 'Le zarf se finit toujours par une fatha'], ['مُضَافٌ إِلَيْه', 'mudâfun ilayh', 'Le mot qui vient après un zarf est toujours un complément de nom']),
  ] },
  { id: 'f8', titre: ['أَنْوَاعُ الْخَبَرِ', 'anwâ‘u l-khabar', 'Les sortes d’attribut'], blocs: [
    b(['خَبَر مُفْرَد', 'khabar mufrad', 'Un seul mot'], ['الطَّالِبُ جَمِيلٌ', 'at-tâlibu jamîlun', 'l’étudiant est beau']),
    b(['خَبَر جُمْلَة', 'khabar jumla', 'Une phrase'], ['خَبَر جُمْلَة فِعْلِيَّة · الطَّالِبُ كَتَبَ الدَّرْسَ', 'khabar jumla fi‘liyya · at-tâlibu kataba d-darsa', 'verbale : l’étudiant a écrit la leçon'], ['خَبَر جُمْلَة اِسْمِيَّة · الطَّالِبُ كِتَابُهُ جَدِيدٌ', 'khabar jumla ismiyya · at-tâlibu kitâbuhu jadîdun', 'nominale : l’étudiant, son livre est neuf']),
    b(['خَبَر شِبْه جُمْلَة', 'khabar shibh jumla', 'Un complément'], ['خَبَر جَرّ وَمَجْرُور · الطَّالِبُ فِي الْفَصْلِ', 'khabar jarr wa majrûr · at-tâlibu fî l-fasl', 'préposition + nom : l’étudiant est en classe'], ['خَبَر ظَرْف وَمُضَاف إِلَيْه · الطَّالِبُ فَوْقَ الْبَيْتِ', 'khabar zarf wa mudâf ilayh · at-tâlibu fawqa l-bayt', 'adverbe + complément : l’étudiant est sur la maison']),
  ] },
  { id: 'f9', titre: ['الْإِعْرَاب', 'al-i‘râb', 'Tableau récapitulatif'], blocs: [
    b(['مَرْفُوع · مَنْصُوب · مَجْرُور · مَجْزُوم', 'marfû‘ · mansûb · majrûr · majzûm', 'Les quatre cas : voyelle « u », « a », « i », soukoun']),
    b(undefined, ['الطَّالِبُ جَمِيلٌ · مُبْتَدَأ · مَرْفُوع', 'at-tâlibu · mubtada’ · marfû‘', 'le sujet de la phrase nominale : cas « u »'], ['الطَّالِبُ جَمِيلٌ · خَبَر · مَرْفُوع', 'jamîlun · khabar · marfû‘', 'l’attribut : cas « u »'],
      ['كَتَبَ الطَّالِبُ الدَّرْسَ · فَاعِل · مَرْفُوع', 'at-tâlibu · fâ‘il · marfû‘', 'le sujet du verbe : cas « u »'], ['كَتَبَ الطَّالِبُ الدَّرْسَ · مَفْعُولٌ بِه · مَنْصُوب', 'ad-darsa · maf‘ûlun bih · mansûb', 'le complément d’objet : cas « a »'],
      ['الطَّالِبُ فِي الْفَصْلِ · اِسْم مَجْرُور · مَجْرُور', 'al-fasli · ism majrûr · majrûr', 'le nom après une préposition : cas « i »'], ['الطَّالِبُ فَوْقَ الْبَيْتِ · مُضَافٌ إِلَيْه · مَجْرُور', 'al-bayti · mudâfun ilayh · majrûr', 'le complément de nom : cas « i »']),
  ] },
  { id: 'f10', titre: ['أَنْوَاعُ الْاِسْمِ', 'anwâ‘u l-ism', 'Singulier, duel, pluriel'], blocs: [
    b(['مُفْرَد · مُثَنَّى · جَمْع', 'mufrad · muthannâ · jam‘', 'Le singulier, le duel, le pluriel']),
    b(['مُفْرَد', 'mufrad', 'Le singulier'], ['الطَّالِبُ جَمِيلٌ', 'at-tâlibu jamîlun', 'sujet et attribut au cas sujet : marque, la damma'],
      ['رَأَيْتُ الطَّالِبَ', 'ra’aytu t-tâliba', 'complément d’objet au cas direct : marque, la fatha'], ['سَلَّمْتُ عَلَى الطَّالِبِ', 'sallamtu ‘alâ t-tâlibi', 'nom au cas indirect : marque, la kasra']),
  ] },
  { id: 'f11', titre: ['مُثَنَّى', 'muthannâ', 'Le duel'], blocs: [
    b(['Former le duel', '', ''], ['طَالِبَانِ', 'tâlibâni', 'au cas sujet : on ajoute « âni »'], ['طَالِبَيْنِ', 'tâlibayni', 'au cas direct ou indirect : on ajoute « ayni »']),
    b(['إِعْرَابُ الْمُثَنَّى', 'i‘râbu l-muthannâ', 'La déclinaison du duel'], ['الطَّالِبَانِ جَمِيلَانِ', 'at-tâlibâni jamîlâni', 'sujet au cas sujet : marque, le alif, car c’est un duel'],
      ['رَأَيْتُ الطَّالِبَيْنِ', 'ra’aytu t-tâlibayni', 'complément d’objet au cas direct : marque, le yâ’, car c’est un duel'], ['سَلَّمْتُ عَلَى الطَّالِبَيْنِ', 'sallamtu ‘alâ t-tâlibayni', 'nom au cas indirect : marque, le yâ’, car c’est un duel']),
  ] },
  { id: 'f12', titre: ['الْجَمْعُ', 'al-jam‘', 'Le pluriel masculin'], blocs: [
    b(['جَمْعُ الْمُذَكَّرِ السَّالِم · جَمْعُ الْمُؤَنَّثِ السَّالِم · جَمْعُ التَّكْسِير', 'jam‘ al-mudhakkar as-sâlim · jam‘ al-mu’annath as-sâlim · jam‘ at-taksîr', 'Le pluriel masculin, le pluriel féminin, le pluriel brisé']),
    b(['Former le pluriel masculin', '', ''], ['مُسْلِم ← مُسْلِمُونَ', 'muslim ← muslimûna', 'au cas sujet : on ajoute « ûna »'], ['مُسْلِم ← مُسْلِمِينَ', 'muslim ← muslimîna', 'au cas direct ou indirect : on ajoute « îna »']),
    b(['إِعْرَابُ جَمْعِ الْمُذَكَّرِ السَّالِمِ', 'i‘râbu jam‘i l-mudhakkari s-sâlim', 'La déclinaison du pluriel masculin'], ['الْمُسْلِمُونَ فِي الْمَسْجِدِ', 'al-muslimûna fî l-masjid', 'sujet au cas sujet : marque, le waw, car c’est un pluriel masculin'],
      ['رَأَيْتُ الْمُسْلِمِينَ', 'ra’aytu l-muslimîna', 'complément au cas direct : marque, le yâ’'], ['سَلَّمْتُ عَلَى الْمُسْلِمِينَ', 'sallamtu ‘alâ l-muslimîna', 'nom au cas indirect : marque, le yâ’']),
  ] },
  { id: 'f13', titre: ['الْجَمْعُ الْمُؤَنَّثُ السَّالِم', 'al-jam‘u l-mu’annathu s-sâlim', 'Le pluriel féminin'], blocs: [
    b(undefined, ['ات', 'ât', 'On ajoute « ât » à la fin du mot. Au cas sujet, la dernière lettre porte une damma ; au cas direct ou indirect, une kasra']),
    b(undefined, ['الْمُسْلِمَاتُ فِي الْمَسْجِدِ', 'al-muslimâtu fî l-masjid', 'sujet au cas sujet : marque, la damma'], ['رَأَيْتُ الْمُسْلِمَاتِ', 'ra’aytu l-muslimâti', 'complément au cas direct : marque, la kasra'], ['سَلَّمْتُ عَلَى الْمُسْلِمَاتِ', 'sallamtu ‘alâ l-muslimâti', 'nom au cas indirect : marque, la kasra']),
  ] },
  { id: 'f14', titre: ['الْجَمْعُ التَّكْسِيرِ', 'al-jam‘u t-taksîr', 'Le pluriel brisé'], blocs: [
    b(undefined, ['رَجُل ← رِجَال', 'rajul ← rijâl', 'un homme, des hommes'], ['اِمْرَأَة ← نِسَاء', 'imra’a ← nisâ’', 'une femme, des femmes']),
    b(undefined, ['النِّسَاءُ جَمِيلَاتٌ', 'an-nisâ’u jamîlâtun', 'sujet au cas sujet : marque, la damma'], ['رَأَيْتُ النِّسَاءَ', 'ra’aytu n-nisâ’a', 'complément au cas direct : marque, la fatha'], ['سَلَّمْتُ عَلَى النِّسَاءِ', 'sallamtu ‘alâ n-nisâ’i', 'nom au cas indirect : marque, la kasra']),
  ] },
  { id: 'f15', titre: ['الْأَسْمَاءُ الْإِشَارَةِ', 'asmâ’u l-ishâra', 'Les démonstratifs'], blocs: [b(['pour le proche · pour le lointain', '', ''],
    ['هَذَا · ذَلِكَ · هَذَا رَجُلٌ', 'hâdhâ · dhâlika · hâdhâ rajul', 'masculin singulier : voici un homme'],
    ['هَذِهِ · تِلْكَ · هَذِهِ بِنْتٌ · هَذِهِ كُتُبٌ / نَوَافِذُ', 'hâdhihi · tilka · hâdhihi bint · hâdhihi kutub / nawâfidh', 'féminin singulier, et pluriel de choses : voici une fille, voici des livres, des fenêtres'],
    ['هَذَانِ · ذَانِكَ · هَذَانِ طَالِبَانِ', 'hâdhâni · dhânika · hâdhâni tâlibâni', 'masculin duel : voici deux étudiants'], ['هَاتَانِ · تَانِكَ · هَاتَانِ طَالِبَتَانِ', 'hâtâni · tânika · hâtâni tâlibatâni', 'féminin duel : voici deux étudiantes'],
    ['هَؤُلَاءِ · أُولَئِكَ · هَؤُلَاءِ مُسْلِمُونَ / مُسْلِمَاتٌ', 'hâ’ulâ’i · ulâ’ika · hâ’ulâ’i muslimûna / muslimât', 'pluriel de personnes : voici des musulmans, des musulmanes'])] },
  { id: 'f16', titre: ['الْأَسْمَاءُ الْمَوْصُولَةِ', 'al-asmâ’u l-mawsûla', 'Les relatifs'], blocs: [b(undefined,
    ['الَّذِي · رَأَيْتُ الطَّالِبَ الَّذِي نَجَحَ', 'alladhî · ra’aytu t-tâliba lladhî najah', 'masculin singulier : j’ai vu l’étudiant qui a réussi'], ['الَّتِي · رَأَيْتُ الطَّالِبَةَ الَّتِي نَجَحَتْ', 'allatî · ra’aytu t-tâlibata llatî najahat', 'féminin singulier : l’étudiante qui a réussi'],
    ['اللَّذَانِ · رَأَيْتُ الطَّالِبَيْنِ اللَّذَيْنِ نَجَحَا', 'alladhâni · ra’aytu t-tâlibayni lladhayni najahâ', 'masculin duel : les deux étudiants qui ont réussi'], ['اللَّتَانِ · رَأَيْتُ الطَّالِبَتَيْنِ اللَّتَيْنِ نَجَحَتَا', 'allatâni · ra’aytu t-tâlibatayni llatayni najahatâ', 'féminin duel : les deux étudiantes qui ont réussi'],
    ['الَّذِينَ · رَأَيْتُ الطُّلَّابَ الَّذِينَ نَجَحُوا', 'alladhîna · ra’aytu t-tullâba lladhîna najahû', 'masculin pluriel : les étudiants qui ont réussi'], ['اللَّاتِي · رَأَيْتُ الطَّالِبَاتِ اللَّاتِي نَجَحْنَ', 'allâtî · ra’aytu t-tâlibâti llâtî najahna', 'féminin pluriel : les étudiantes qui ont réussi'])] },
  { id: 'f17', titre: ['أَدَوَاتُ الْاِسْتِفْهَامِ', 'adawâtu l-istifhâm', 'Les mots interrogatifs'], blocs: [b(undefined,
    ['مَنْ · مَنْ هُوَ؟', 'man · man huwa ?', 'qui : qui est-il ?'], ['مَا · مَا هَذَا؟', 'mâ · mâ hâdhâ ?', 'quoi : qu’est-ce que c’est ?'], ['مَاذَا · مَاذَا تَفْعَلُ؟', 'mâdhâ · mâdhâ taf‘alu ?', 'que : que fais-tu ?'],
    ['أَيْنَ · أَيْنَ الْأَخُ سُفْيَانُ؟', 'ayna · ayna l-akhu sufyân ?', 'où : où est le frère Sufyân ?'], ['مَتَى · مَتَى تَرْجِعُ؟', 'matâ · matâ tarji‘u ?', 'quand : quand reviens-tu ?'], ['لِمَاذَا · لِمَاذَا فَعَلْتَ هَذَا؟', 'limâdhâ · limâdhâ fa‘alta hâdhâ ?', 'pourquoi : pourquoi as-tu fait cela ?'],
    ['كَمْ · كَمْ دَرْسًا دَرَسْتَ؟', 'kam · kam darsan darasta ?', 'combien : combien de leçons as-tu étudiées ?'], ['بِكَمْ · بِكَمْ هَذَا؟', 'bikam · bikam hâdhâ ?', 'à combien : combien ça coûte ?'],
    ['هَلْ · هَلْ تَعْرِفُ هَذَا؟', 'hal · hal ta‘rifu hâdhâ ?', 'est-ce que : connais-tu cela ?'], ['أَ · أَأَنْتَ مُسْلِمٌ؟', 'a · a-anta muslim ?', 'est-ce que : es-tu musulman ?'], ['كَيْفَ · كَيْفَ حَالُكَ؟', 'kayfa · kayfa hâluka ?', 'comment : comment vas-tu ?'])] },
  { id: 'f18', titre: ['الضَّمَائِرُ الْمُنْفَصِلَةُ', 'ad-damâ’iru l-munfasila', 'Les pronoms isolés'], blocs: [b(undefined, ...PR.map(([ar, ph, fr]) => [ar, ph, fr] as Ligne))] },
  { id: 'f19', titre: ['الضَّمَائِرُ الْمُتَّصِلَةُ', 'ad-damâ’iru l-muttasila', 'Les pronoms attachés'], blocs: [
    b(['دَرَسَ', 'darasa', 'Le passé : il a étudié'], ...PR.map(([p, pph, , a, aph]) => [p + ' · ' + a, pph + ' · ' + aph, ''] as Ligne)),
    b(['يَدْرُسُ', 'yadrusu', 'L’inaccompli : il étudie'], ...PR.map(([p, pph, , , , m, mph]) => [p + ' · ' + m, pph + ' · ' + mph, ''] as Ligne)),
    b(['اُدْرُسْ', 'udrus', 'L’impératif : étudie'], ...PR.filter((r) => r[7]).map(([p, pph, , , , , , imp]) => [p + ' · ' + imp.split(' · ')[0], pph + ' · ' + imp.split(' · ')[1], ''] as Ligne)),
    b(['دَرْسٌ', 'darsun', 'Avec un nom : une leçon'], ...POSS),
  ] },
  { id: 'f20', titre: ['', '', 'Grammaire et conjugaison : ce qui les distingue'], blocs: [b(undefined,
    ['النَّحْو · الصَّرْف', 'an-nahw · as-sarf', 'La grammaire est une science plus longue que la conjugaison.'],
    ['', '', 'Les règles de grammaire sont en général plus simples que les leçons de conjugaison.'],
    ['', '', 'La grammaire dit quelle voyelle mettre à la fin d’un mot ; la conjugaison explique pourquoi le mot est construit ainsi.'],
    ['', '', 'Pour appliquer les règles de grammaire, le mot doit être dans une phrase ; en conjugaison, ce n’est pas nécessaire.'])] },
  { id: 'f21', titre: ['الْوَزْن', 'al-wazn', 'Le schème'], blocs: [
    b(['ف ع ل', 'fâ’ · ‘ayn · lâm', 'Chaque lettre de la racine prend la place de ف, ع et ل'], ['كَتَبَ · فَعَلَ', 'kataba · fa‘ala', 'il a écrit'], ['شَرِبَ · فَعِلَ', 'shariba · fa‘ila', 'il a bu'], ['طَهُرَ · فَعُلَ', 'tahura · fa‘ula', 'il a été pur']),
    b(['Du même verbe', '', ''], ['كَاتِب · فَاعِل', 'kâtib · fâ‘il', 'celui qui écrit'], ['كِتَاب · فِعَال', 'kitâb · fi‘âl', 'un livre']),
  ] },
  { id: 'f22', titre: ['', '', 'Les règles à apprendre : les verbes augmentés'], blocs: [
    b(undefined, ['', '', 'Les verbes de 3 lettres au passé n’ont pas de règle pour leur conjugaison : il faut les apprendre.'], ['', '', 'Les verbes de 4, 5 et 6 lettres au passé ont des règles.'], ['', '', 'Les lettres ajoutées donnent soit un sens en plus, soit une nuance au verbe.']),
    b(['passé · inaccompli · impératif · nom d’action', '', ''], ...FORMES_AUG),
  ] },
  { id: 'f23', titre: ['اِسْمُ الْفَاعِل / اِسْمُ الْمَفْعُول', 'ismu l-fâ‘il / ismu l-maf‘ûl', 'Le participe actif et le participe passif'], blocs: [
    b(undefined, ['اسم الفاعل: الذي يفعل الفعل', 'ismu l-fâ‘il : alladhî yaf‘alu l-fi‘l', 'Le participe actif : celui qui fait l’action'], ['اسم المفعول: الذي فعل عليه الفعل', 'ismu l-maf‘ûl : alladhî fu‘ila ‘alayhi l-fi‘l', 'Le participe passif : celui qui subit l’action']),
    b(['الفعل · اسم الفاعل · اسم المفعول', '', ''], ['كَتَبَ · كَاتِب · مَكْتُوب', 'kataba · kâtib · maktûb', 'écrire · celui qui écrit · écrit'], ['شَرِبَ · شَارِب · مَشْرُوب', 'shariba · shârib · mashrûb', 'boire · celui qui boit · une boisson'],
      ['نَظَّفَ · مُنَظِّف · مُنَظَّف', 'nazzafa · munazzif · munazzaf', 'nettoyer · celui qui nettoie · nettoyé'], ['اِسْتَخْدَمَ · مُسْتَخْدِم · مُسْتَخْدَم', 'istakhdama · mustakhdim · mustakhdam', 'utiliser · celui qui utilise · utilisé']),
  ] },
  { id: 'f24', titre: ['فِعْلُ الْأَمْر', 'fi‘lu l-amr', 'La voyelle de l’alif de l’impératif'], blocs: [b(undefined,
    ['', '', 'Il suffit de regarder la voyelle de la 3e lettre.'], ['خْرُجْ ← اُخْرُجْ', 'khruj ← ukhruj', 'Si c’est une damma, on met une damma sur l’alif : sors'],
    ['اِشْرَبْ · اِنْزِلْ', 'ishrab · inzil', 'Si c’est une fatha ou une kasra, l’impératif commence par une kasra : bois, descends'], ['ا · أ', 'alif · hamza', 'Attention à ne pas confondre l’alif et la hamza'])] },
  { id: 'f25', titre: ['التَّصْغِير', 'at-tasghîr', 'Le diminutif'], blocs: [
    b(['فُعَيْل', 'fu‘ayl', 'Pour les mots de 3 lettres'], ['قَلَم ← قُلَيْم', 'qalam ← qulaym', 'un stylo, un petit stylo'], ['جَبَل ← جُبَيْل', 'jabal ← jubayl', 'une montagne, une petite montagne'], ['عَبْد ← عُبَيْد', '‘abd ← ‘ubayd', 'un serviteur, un petit serviteur']),
    b(['فُعَيْعِل', 'fu‘ay‘il', 'Pour les mots de 4 lettres'], ['جَعْفَر ← جُعَيْفِر', 'ja‘far ← ju‘ayfir', 'un ruisseau, un petit ruisseau'], ['دَفْتَر ← دُفَيْتِر', 'daftar ← dufaytir', 'un cahier, un petit cahier']),
    b(['فُعَيْعِيل', 'fu‘ay‘îl', 'Pour les mots de 5 lettres'], ['مِفْتَاح ← مُفَيْتِيح', 'miftâh ← mufaytîh', 'une clé, une petite clé']),
  ] },
  { id: 'f26', titre: ['نُونُ التَّوْكِيد', 'nûnu t-tawkîd', 'Le noun d’insistance'], blocs: [
    b(['الْخَفِيفَة', 'al-khafîfa', 'Le léger'], ['يَدْرُسُ ← زَيْدٌ يَدْرُسَنْ', 'yadrusu ← zaydun yadrusan', 'Zayd étudiera, sûrement'], ['أُخْرُجْ ← اُخْرُجَنْ', 'ukhruj ← ukhrujan', 'sors, vraiment']),
    b(['الثَّقِيلَة', 'ath-thaqîla', 'Le lourd'], ['زَيْدٌ يَدْرُسَنَّ', 'zaydun yadrusanna', 'Zayd étudiera, assurément'], ['اُخْرُجَنَّ', 'ukhrujanna', 'sors, absolument']),
  ] },
  { id: 'f27', titre: ['النَّسَب', 'an-nasab', 'L’adjectif d’appartenance'], blocs: [b(undefined,
    ['مِصْر ← مِصْرِيّ', 'misr ← misriyy', 'l’Égypte, égyptien'], ['سُنَّة ← سُنِّيّ', 'sunna ← sunniyy', 'la sunna, sunnite'], ['مَكَّة ← مَكِّيّ', 'makka ← makkiyy', 'La Mecque, mecquois'], ['قَاهِرَة ← قَاهِرِيّ', 'qâhira ← qâhiriyy', 'Le Caire, cairote'],
    ['ة', 'tâ’ marbûta', 'Si le mot finit par un tâ’ marbûta, on l’efface'])] },
  { id: 'f28', titre: ['', '', 'Trouver la racine d’un mot'], blocs: [b(['Il y a 3 manières', '', ''],
    ['يَضْرِبُ ← ضَرَبَ · ضَرْب', 'yadribu ← daraba · darb', '1. Revenir au nom d’action ou au passé'], ['أَقْلَام ← قَلَم', 'aqlâm ← qalam', '2. Revenir au singulier'],
    ['ضَرَبَ · يَضْرِبُ · اِضْرِبْ · ضَرْب', 'daraba · yadribu · idrib · darb', '3. Regarder tous les dérivés du mot et garder les lettres toujours présentes : ض ر ب'])] },
  { id: 'f29', titre: ['اِسْمُ الزَّمَان وَ اسْمُ الْمَكَان', 'ismu z-zamân wa smu l-makân', 'Le nom de temps et de lieu'], blocs: [b(['مَفْعَل أَوْ مَفْعِل', 'maf‘al aw maf‘il', 'Le moment ou l’endroit où l’action se produit'],
    ['طَبَخَ ← مَطْبَخ', 'tabakha ← matbakh', 'cuisiner, une cuisine'], ['سَجَدَ ← مَسْجِد', 'sajada ← masjid', 'se prosterner, une mosquée'], ['وُلِدَ ← مَوْلِد', 'wulida ← mawlid', 'naître, une naissance'],
    ['دَرَسَ ← مَدْرَسَة', 'darasa ← madrasa', 'étudier, une école'], ['لَعِبَ ← مَلْعَب', 'la‘iba ← mal‘ab', 'jouer, un terrain de jeu'], ['جَلَسَ ← مَجْلِس', 'jalasa ← majlis', 's’asseoir, une assemblée'])] },
];
