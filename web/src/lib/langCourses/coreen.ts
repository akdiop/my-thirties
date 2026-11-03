import type { LangCourse } from './types';

export const COURSE: LangCourse = {
  script: { title: 'L’alphabet coréen (hangeul)', points: [
    'Le hangeul est un vrai alphabet : 14 consonnes et 10 voyelles de base, qu’on apprend en quelques jours.',
    'Les lettres se regroupent en blocs-syllabes : ㅎ h + ㅏ a + ㄴ n = 한 han. Toujours consonne d’abord ; si la syllabe commence par une voyelle, on met ㅇ (muet) devant : 아 a.',
    'On lit chaque bloc de gauche à droite et de haut en bas.',
    'Consonnes doublées (ㄲ ㄸ ㅃ ㅆ ㅉ) : son tendu, sans souffle. Consonnes aspirées (ㅋ ㅌ ㅍ ㅊ) : avec un souffle.',
    'Ton prénom : 아이다 (A-i-da).',
  ], table: [
    ['ㄱ ㄴ ㄷ ㄹ', 'g/k, n, d/t, r/l', '가 ga, 나 na, 다 da, 라 ra'],
    ['ㅁ ㅂ ㅅ ㅇ', 'm, b/p, s, muet (ou « ng » en fin)', '마 ma, 바 ba, 사 sa, 아 a'],
    ['ㅈ ㅊ ㅋ ㅌ', 'dj, tch soufflé, k soufflé, t soufflé', '자 dja, 차 tcha, 카 ka, 타 ta'],
    ['ㅍ ㅎ', 'p soufflé, h', '파 pa, 하 ha'],
    ['ㅏ ㅓ', 'a, o ouvert (comme « or »)', '아 a, 어 eo'],
    ['ㅗ ㅜ', 'o fermé, ou', '오 o, 우 ou'],
    ['ㅡ ㅣ', 'eu (lèvres étirées), i', '으 eu, 이 i'],
    ['ㅐ ㅔ', 'è, é (presque pareils)', '애 ae, 에 e'],
    ['ㅑ ㅕ ㅛ ㅠ', 'ya, yeo, yo, you', '야 ya, 여 yeo'],
    ['ㅘ ㅝ ㅢ', 'wa, wo, eui', '와 wa, 의 eui'],
  ] },
  lessons: [
    { lesson: [
      'Le son de certaines consonnes change selon la place : ㄱ est « g » entre voyelles, « k » en fin de syllabe.',
      'ㄹ se dit « r » léger au début et entre voyelles, « l » en fin de syllabe : 서울 Seoul.',
      'ㅓ (eo) est un « o » ouvert, à ne pas confondre avec ㅗ (o fermé).',
      'Pas d’accent tonique : chaque syllabe a la même force.',
    ], vocab: [
      ['네', 'né', 'oui'], ['아니요', 'aniyo', 'non'], ['감사합니다', 'gammsahammnida', 'merci'], ['주세요', 'djousséyo', 's’il vous plaît (donnez-moi)'],
      ['죄송합니다', 'djwéssonghammnida', 'pardon, désolée'], ['물', 'moul', 'eau'], ['집', 'djip', 'maison'], ['여자', 'yeodja', 'femme'],
      ['남자', 'nammdja', 'homme'], ['아이', 'aï', 'enfant'], ['도시', 'dochi', 'ville'], ['책', 'tchèk', 'livre'],
    ], writing: ['Écris chaque consonne et chaque voyelle du tableau 10 fois.', 'Compose les blocs 가 나 다 라 마 바 사 아.'],
    phrases: [['안녕하세요', 'annyeonghasséyo', 'Bonjour.'], ['감사합니다', 'gammsahammnida', 'Merci.'], ['괜찮아요', 'gwènntchanayo', 'Pas de souci, ça va.'], ['모르겠어요', 'moreuguèssoyo', 'Je ne sais pas, je ne comprends pas.'], ['다시 말해 주세요', 'dachi malhè djousséyo', 'Répétez, s’il vous plaît.']] },

    { lesson: [
      'Ordre de la phrase : sujet, complément, verbe à la fin.',
      'Particules de thème : 은 eun (après consonne) / 는 neun (après voyelle). 저는 jeoneun = « moi, quant à moi ».',
      'Être : 이에요 -ieyo (après consonne) / 예요 -yeyo (après voyelle). 저는 아이다예요 jeoneun Aida-yeyo.',
      'Niveau poli courant : verbes en -요 -yo. Toujours poli avec les inconnus.',
      'Venir de : 에서 왔어요 -eseo wasseoyo.',
    ], vocab: [
      ['안녕하세요', 'annyeonghasséyo', 'bonjour'], ['잘 지내요?', 'djal djinèyo', 'comment ça va ?'], ['잘 지내요', 'djal djinèyo', 'ça va bien'], ['저', 'djo', 'je (poli)'],
      ['이름', 'ireum', 'nom'], ['〜에서 왔어요', '… éssso wassoyo', 'je viens de…'], ['〜에 살아요', '… é sarayo', 'j’habite à…'], ['일', 'il', 'travail'],
      ['친구', 'tchinngou', 'ami(e)'], ['반가워요', 'banngawoyo', 'enchantée'], ['안녕히 계세요', 'annyeonghi gyésséyo', 'au revoir (quand tu pars)'], ['안녕히 가세요', 'annyeonghi gasséyo', 'au revoir (à celui qui part)'],
    ], writing: ['Écris ta présentation en hangeul, ton prénom 아이다.'],
    phrases: [['저는 아이다예요', 'djoneun aïdayéyo', 'Je suis Aida.'], ['세네갈에서 왔어요', 'sénégaréssso wassoyo', 'Je viens du Sénégal.'], ['다카르에 살아요', 'dakareué sarayo', 'J’habite à Dakar.'], ['반가워요', 'banngawoyo', 'Enchantée.']] },

    { lesson: [
      'Deux séries de nombres. Nombres sino-coréens (prix, minutes, dates) : 일 il, 이 i, 삼 sam, 사 sa, 오 o, 육 yuk, 칠 tchil, 팔 pal, 구 gu, 십 sip ; 20 = 이십 isip, 100 = 백 baek.',
      'Nombres coréens (âge, objets, heures) : 하나 hana, 둘 dul, 셋 set, 넷 net, 다섯 daseot, 여섯 yeoseot, 일곱 ilgop, 여덟 yeodeol, 아홉 ahop, 열 yeol.',
      'L’heure : heure en nombres coréens + 시 si, minutes en sino-coréens + 분 bun. 열 시 yeol si (10 h), 반 ban (et demie).',
      'Prix en wons (원 won) : 만 원 man won (10 000 wons). 얼마예요? eolmayeyo ? (combien ?).',
    ], vocab: [
      ['일, 이, 삼', 'il, i, samm', '1, 2, 3 (sino)'], ['하나, 둘, 셋', 'hana, doul, sèt', '1, 2, 3 (coréen)'], ['넷, 다섯', 'nèt, dassot', '4, 5'], ['여섯, 일곱', 'yeossot, ilgop', '6, 7'],
      ['여덟, 아홉, 열', 'yeodol, ahop, yeol', '8, 9, 10'], ['백', 'bèk', '100'], ['시', 'chi', 'heure'], ['분', 'boun', 'minute'],
      ['원', 'wonn', 'won (monnaie)'], ['싸요', 'ssayo', 'c’est pas cher'], ['비싸요', 'bissayo', 'c’est cher'], ['오늘', 'oneul', 'aujourd’hui'],
    ], writing: ['Écris les deux séries de 1 à 10 en hangeul.'],
    phrases: [['몇 시예요?', 'myot chiyéyo', 'Quelle heure est-il ?'], ['열 시예요', 'yeol chiyéyo', 'Il est dix heures.'], ['얼마예요?', 'olmayéyo', 'Combien ça coûte ?'], ['너무 비싸요', 'nomou bissayo', 'C’est trop cher.']] },

    { lesson: [
      'Les mots de famille changent selon que tu es une femme ou un homme : une femme appelle sa grande sœur 언니 eonni et son grand frère 오빠 oppa.',
      'Possessif poli : 제 je (mon, ma) ; 우리 uri (notre) s’emploie souvent pour sa famille : 우리 엄마 uri eomma (ma maman).',
      'Avoir : 있어요 isseoyo (il y a, j’ai). 언니가 있어요 eonni-ga isseoyo (j’ai une grande sœur).',
      'Adjectifs conjugués comme des verbes : 친절해요 tchinjeolhaeyo (elle est gentille).',
    ], vocab: [
      ['엄마 / 어머니', 'omma / omoni', 'maman / mère'], ['아빠 / 아버지', 'appa / abodji', 'papa / père'], ['언니', 'onni', 'grande sœur (pour une femme)'], ['오빠', 'oppa', 'grand frère (pour une femme)'],
      ['동생', 'donnssèng', 'petit frère ou petite sœur'], ['딸', 'ttal', 'fille'], ['아들', 'adeul', 'fils'], ['남편', 'nammpyon', 'mari'],
      ['가족', 'gadjok', 'famille'], ['친절해요', 'tchinndjolhèyo', 'gentil(le)'], ['재미있어요', 'djèmi issoyo', 'drôle, amusant'], ['키가 커요', 'kiga koyo', 'grand(e)'],
    ], writing: ['Écris ton arbre familial en hangeul.'],
    phrases: [['제 언니예요', 'djé onniyéyo', 'C’est ma grande sœur.'], ['동생이 두 명 있어요', 'donnssèngui dou myonng issoyo', 'J’ai deux petits frères et sœurs.'], ['우리 엄마는 친절해요', 'ouri ommaneun tchinndjolhèyo', 'Ma maman est gentille.']] },

    { lesson: [
      'Présent poli en -아요 / -어요 : 가다 gada (aller) → 가요 gayo ; 먹다 meokda (manger) → 먹어요 meogeoyo.',
      'Verbes en 하다 hada → 해요 haeyo : 일하다 → 일해요 ilhaeyo (je travaille).',
      'Particules : 에 e (heure, destination), 을/를 eul/reul (objet), 에서 eseo (lieu de l’action).',
      'Le verbe ne change pas selon la personne.',
    ], vocab: [
      ['일어나요', 'ironayo', 'se lever'], ['아침을 먹어요', 'atchimeul mogoyo', 'prendre le petit-déjeuner'], ['일해요', 'ilhèyo', 'travailler'], ['먹어요', 'mogoyo', 'manger'],
      ['마셔요', 'machoyo', 'boire'], ['가요', 'gayo', 'aller'], ['와요', 'wayo', 'venir, rentrer'], ['요리해요', 'yorihèyo', 'cuisiner'],
      ['읽어요', 'ilgoyo', 'lire'], ['자요', 'djayo', 'dormir'], ['매일', 'mèil', 'chaque jour'], ['그리고', 'geurigo', 'et puis'],
    ], writing: ['Écris ta routine du matin en 5 phrases.'],
    phrases: [['일곱 시에 일어나요', 'ilgop chié ironayo', 'Je me lève à sept heures.'], ['회사에 가요', 'hwéssaé gayo', 'Je vais au bureau.'], ['저녁에 책을 읽어요', 'djonyogé tchègueul ilgoyo', 'Le soir je lis un livre.']] },

    { lesson: [
      'Commander : 〜 주세요 … juseyo (donnez-moi…). 커피 주세요 keopi juseyo.',
      'Compter les objets avec les nombres coréens + 개 gae : 하나 → 한 개 han gae (un), 두 개 du gae (deux).',
      'Au restaurant : 메뉴 menyu (menu), 계산 gyesan (addition). Avant de manger : 잘 먹겠습니다 jal meokgetseumnida ; après : 잘 먹었습니다 jal meogeotseumnida.',
      'C’est bon : 맛있어요 masisseoyo.',
    ], vocab: [
      ['닭고기', 'dakgogui', 'poulet'], ['생선', 'sèngsonn', 'poisson'], ['밥', 'bap', 'riz, repas'], ['채소', 'tchèsso', 'légumes'],
      ['과일', 'gwail', 'fruits'], ['빵', 'ppang', 'pain'], ['치즈', 'tchidjeu', 'fromage'], ['주스', 'djousseu', 'jus'],
      ['커피', 'kopi', 'café'], ['차', 'tcha', 'thé'], ['맛있어요', 'machissoyo', 'c’est délicieux'], ['계산', 'guyéssann', 'addition'],
    ], writing: ['Écris ta liste de courses en hangeul.'],
    phrases: [['커피 한 잔 주세요', 'kopi hann djann djousséyo', 'Un café, s’il vous plaît.'], ['계산해 주세요', 'guyéssannhè djousséyo', 'L’addition, s’il vous plaît.'], ['정말 맛있어요', 'djonngmal machissoyo', 'C’est vraiment délicieux.']] },

    { lesson: [
      'Où est… ? 〜 어디예요? … eodiyeyo ?',
      'Directions : 오른쪽 oreunjjok (droite), 왼쪽 oenjjok (gauche), 쭉 가세요 jjuk gaseyo (allez tout droit).',
      'Lieu : 가까워요 gakkawoyo (c’est près), 멀어요 meoreoyo (c’est loin), 옆 yeop (à côté), 앞 ap (devant).',
      'Transports : 지하철로 jihacheollo (en métro), 버스로 beoseuro (en bus), 걸어서 georeoseo (à pied).',
    ], vocab: [
      ['역', 'yok', 'gare, station'], ['공항', 'gonnghang', 'aéroport'], ['바다', 'bada', 'mer'], ['약국', 'yakgouk', 'pharmacie'],
      ['호텔', 'hotél', 'hôtel'], ['가까워요', 'gakkawoyo', 'c’est près'], ['멀어요', 'moroyo', 'c’est loin'], ['오른쪽', 'oreunndjjok', 'droite'],
      ['왼쪽', 'wénndjjok', 'gauche'], ['표', 'pyo', 'billet'], ['지하철', 'djihatchol', 'métro'], ['버스', 'bosseu', 'bus'],
    ], writing: ['Écris ton trajet vers un lieu que tu aimes.'],
    phrases: [['역이 어디예요?', 'yogui odiyéyo', 'Où est la gare ?'], ['오른쪽으로 가세요', 'oreunndjjogeuro gasséyo', 'Allez à droite.'], ['멀어요?', 'moroyo', 'C’est loin ?']] },

    { lesson: [
      'Passé poli : -았어요 / -었어요. 가요 → 갔어요 gasseoyo (je suis allée) ; 먹어요 → 먹었어요 meogeosseoyo (j’ai mangé) ; 해요 → 했어요 haesseoyo (j’ai fait).',
      'Négation : 안 an devant le verbe : 안 갔어요 an gasseoyo (je ne suis pas allée).',
      'Repères : 어제 eoje (hier), 주말 jumal (week-end), 지난주 jinanju (la semaine dernière).',
    ], vocab: [
      ['어제', 'odjé', 'hier'], ['주말', 'djoumal', 'week-end'], ['갔어요', 'gassoyo', 'je suis allée'], ['먹었어요', 'mogossoyo', 'j’ai mangé'],
      ['봤어요', 'bwassoyo', 'j’ai vu'], ['샀어요', 'sassoyo', 'j’ai acheté'], ['재미있었어요', 'djèmi issossoyo', 'c’était amusant'], ['그다음에', 'geudaeumé', 'ensuite'],
    ], writing: ['Écris 5 phrases sur ton dernier week-end au passé.'],
    phrases: [['어제 시장에 갔어요', 'odjé chidjangué gassoyo', 'Hier je suis allée au marché.'], ['정말 좋았어요', 'djonngmal djoassoyo', 'C’était vraiment bien.'], ['주말에 뭐 했어요?', 'djoumaré mwo hèssoyo', 'Qu’as-tu fait ce week-end ?']] },

    { lesson: [
      'Futur / intention : -(으)ㄹ 거예요 -(eu)l geoyeyo. 갈 거예요 gal geoyeyo (j’irai).',
      'Envie : -고 싶어요 -go sipeoyo. 가고 싶어요 gago sipeoyo (je veux aller), 배우고 싶어요 baeugo sipeoyo (je veux apprendre).',
      'Repères : 내일 naeil (demain), 내년 naenyeon (l’an prochain), 언젠가 eonjenga (un jour).',
    ], vocab: [
      ['꿈', 'kkoum', 'rêve'], ['여행', 'yohèng', 'voyage'], ['배워요', 'bèwoyo', 'apprendre'], ['저축해요', 'djotchoukhèyo', 'économiser'],
      ['이사해요', 'issahèyo', 'déménager'], ['내일', 'nèil', 'demain'], ['내년', 'nènyonn', 'l’an prochain'], ['언젠가', 'onndjénnga', 'un jour'],
    ], writing: ['Écris tes 3 projets avec -고 싶어요.'],
    phrases: [['내년에 한국에 가고 싶어요', 'nènyoné hanngougué gago chipoyo', 'L’an prochain je veux aller en Corée.'], ['그림을 배우고 싶어요', 'geurimeul bèougo chipoyo', 'Je veux apprendre la peinture.'], ['꿈이 뭐예요?', 'kkoumi mwoyéyo', 'Quel est ton rêve ?']] },

    { lesson: [
      'Relancer : 〜 씨는요? … ssi-neunyo ? (et vous ?), 정말요? jeongmallyo ? (vraiment ?), 대박 daebak (génial, familier).',
      'Demander de l’aide : 〜 한국어로 뭐예요? … hangugeoro mwoyeyo ? (comment dit-on… en coréen ?), 천천히 말해 주세요 cheoncheonhi malhae juseyo (parlez lentement).',
      'Donner son avis : 제 생각에는 je saenggageneun (à mon avis), 맞아요 majayo (c’est vrai).',
    ], vocab: [
      ['질문', 'djilmoun', 'question'], ['대답', 'dèdap', 'réponse'], ['아마', 'ama', 'peut-être'], ['도', 'do', 'aussi'],
      ['물론이에요', 'moullonniéyo', 'bien sûr'], ['천천히', 'tchonntchonni', 'lentement'], ['정말 좋아해요', 'djonngmal djoahèyo', 'j’adore'], ['또 만나요', 'tto mannayo', 'à bientôt'],
    ], writing: ['Prépare tes 10 questions en hangeul.'],
    phrases: [['무슨 일 하세요?', 'mousseun il hasséyo', 'Que faites-vous dans la vie ?'], ['「joie」 한국어로 뭐예요?', '… hanngougoro mwoyéyo', 'Comment dit-on « joie » en coréen ?'], ['천천히 말해 주세요', 'tchonntchonni malhè djousséyo', 'Parlez lentement, s’il vous plaît.'], ['또 만나요!', 'tto mannayo', 'À bientôt !']] },
  ],
};
