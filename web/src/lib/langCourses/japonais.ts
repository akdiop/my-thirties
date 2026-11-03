import type { LangCourse } from './types';

export const COURSE: LangCourse = {
  script: { title: 'Les écritures japonaises', points: [
    'Trois écritures mélangées : les hiragana (sons, mots grammaticaux), les katakana (mots étrangers, noms étrangers) et les kanji (caractères chinois qui portent le sens).',
    'Commence par les 46 hiragana : chacun note une syllabe (ka, ki, ku…). Puis les katakana, mêmes sons, forme anguleuse.',
    'On peut tout écrire en hiragana au début ; les kanji viendront petit à petit (日 jour, 人 personne, 水 eau).',
    'Deux petits traits (゛) changent le son : か ka → が ga, さ sa → ざ za. Un petit rond (゜) : は ha → ぱ pa.',
    'Ton prénom en katakana : アイダ (A-i-da).',
  ], table: [
    ['あ い う え お', 'a i ou é o', 'voyelles'],
    ['か き く け こ', 'ka ki kou ké ko', ''],
    ['さ し す せ そ', 'sa chi sou sé so', ''],
    ['た ち つ て と', 'ta tchi tsou té to', ''],
    ['な に ぬ ね の', 'na ni nou né no', ''],
    ['は ひ ふ へ ほ', 'ha hi fou hé ho', ''],
    ['ま み む め も', 'ma mi mou mé mo', ''],
    ['や ゆ よ', 'ya you yo', ''],
    ['ら り る れ ろ', 'ra ri rou ré ro (r très léger)', ''],
    ['わ を ん', 'wa o n', ''],
  ] },
  lessons: [
    { lesson: [
      'Cinq voyelles nettes, comme en espagnol : a, i, ou, é, o. Le « ou » est souvent à peine prononcé : « desu » ≈ « dèss ».',
      'Les voyelles longues (ō, ū) durent deux temps : おばさん obasan (tante) / おばあさん obāsan (grand-mère).',
      'Le r japonais est entre r, l et d, très léger.',
      'Pas d’accent tonique fort : la phrase reste plate et régulière.',
    ], vocab: [
      ['はい', 'haï', 'oui'], ['いいえ', 'iié', 'non'], ['ありがとう', 'arigatô', 'merci'], ['おねがいします', 'onégaï chimass', 's’il vous plaît'],
      ['すみません', 'soumimassèn', 'pardon, excusez-moi'], ['みず', 'mizou', 'eau'], ['いえ', 'ié', 'maison'], ['おんな', 'onna', 'femme'],
      ['おとこ', 'otoko', 'homme'], ['こども', 'kodomo', 'enfant'], ['まち', 'matchi', 'ville'], ['ほん', 'honn', 'livre'],
    ], writing: ['Écris les 5 voyelles あいうえお 10 fois.', 'Écris une ligne du tableau par jour.'],
    phrases: [['こんにちは', 'konnitchiwa', 'Bonjour.'], ['ありがとうございます', 'arigatô gozaïmass', 'Merci beaucoup.'], ['どういたしまして', 'dô itachimachité', 'De rien.'], ['わかりません', 'wakarimassèn', 'Je ne comprends pas.'], ['もういちど おねがいします', 'mô itchido onégaï chimass', 'Encore une fois, s’il vous plaît.']] },

    { lesson: [
      'Ordre de la phrase : sujet, complément, verbe à la fin. わたしは アイダです watashi wa Aida desu = « moi, Aida je suis ».',
      'は (prononcé « wa ») marque le thème : « quant à moi ».',
      'です desu = être (poli) ; question en ajoutant か ka : アイダさんですか Aida-san desu ka ?',
      'On ajoute さん -san après le nom des autres, jamais après le sien.',
      'On évite souvent « tu » : on utilise le prénom + san.',
    ], vocab: [
      ['おはようございます', 'ohayô gozaïmass', 'bonjour (matin)'], ['こんばんは', 'konnbannwa', 'bonsoir'], ['おげんきですか', 'oguènnki dèss ka', 'comment allez-vous ?'], ['げんきです', 'guènnki dèss', 'je vais bien'],
      ['わたし', 'watachi', 'je, moi'], ['なまえ', 'namaé', 'nom'], ['〜から きました', '… kara kimachita', 'je viens de…'], ['〜に すんでいます', '… ni soundé imass', 'j’habite à…'],
      ['しごと', 'chigoto', 'travail'], ['ともだち', 'tomodatchi', 'ami(e)'], ['はじめまして', 'hadjimémachité', 'enchantée (première rencontre)'], ['さようなら', 'sayônara', 'au revoir'],
    ], writing: ['Écris ta présentation en hiragana, ton prénom en katakana : アイダ.'],
    phrases: [['はじめまして', 'hadjimémachité', 'Enchantée.'], ['わたしは アイダです', 'watachi wa aïda dèss', 'Je suis Aida.'], ['セネガルから きました', 'sénégarou kara kimachita', 'Je viens du Sénégal.'], ['ダカールに すんでいます', 'dakârou ni soundé imass', 'J’habite à Dakar.'], ['よろしく おねがいします', 'yorochikou onégaï chimass', 'Ravie de vous connaître.']] },

    { lesson: [
      '1 à 10 : いち itchi, に ni, さん sann, よん yonn, ご go, ろく roku, なな nana, はち hatchi, きゅう kyû, じゅう djû.',
      'Les dizaines se construisent : にじゅう ni-djû (20), さんじゅう sann-djû (30) ; 21 = にじゅういち ni-djû-itchi. 100 = ひゃく hyaku.',
      'Les kanji des nombres sont simples : 一 二 三 四 五 六 七 八 九 十.',
      'L’heure : nombre + じ dji. じゅうじ djû-dji (10 h). Attention : 4 h = よじ yo-dji, 9 h = くじ ku-dji. はん hann = et demie.',
      'Prix : いくらですか ikura dèss ka ? Réponse en えん ènn (yens) : せんえん sènn-ènn (1 000 yens).',
    ], vocab: [
      ['いち、に、さん', 'itchi, ni, sann', '1, 2, 3'], ['よん、ご', 'yonn, go', '4, 5'], ['ろく、なな', 'roku, nana', '6, 7'], ['はち、きゅう、じゅう', 'hatchi, kyû, djû', '8, 9, 10'],
      ['ひゃく', 'hyakou', '100'], ['せん', 'sènn', '1 000'], ['〜じ', '… dji', '… heure(s)'], ['はん', 'hann', 'et demie'],
      ['えん', 'ènn', 'yen'], ['やすい', 'yassoui', 'pas cher'], ['たかい', 'takaï', 'cher'], ['きょう', 'kyô', 'aujourd’hui'],
    ], writing: ['Écris les kanji 一 à 十 et leur lecture.'],
    phrases: [['いま なんじですか', 'ima nann dji dèss ka', 'Quelle heure est-il ?'], ['じゅうじです', 'djû dji dèss', 'Il est dix heures.'], ['いくらですか', 'ikoura dèss ka', 'Combien ça coûte ?'], ['たかいですね', 'takaï dèss né', 'C’est cher, hein.']] },

    { lesson: [
      'Deux mots pour chaque proche : un pour ta propre famille (humble), un pour celle des autres (poli). はは haha (ma mère) / おかあさん okāsan (votre mère).',
      'の no relie deux noms : わたしの あね watashi no ane (ma grande sœur).',
      'Avoir des frères et sœurs : あねが います ané ga imass (j’ai une grande sœur). います pour les êtres vivants.',
      'Adjectifs en -い : やさしい yasachii (gentil), おもしろい omochiroï (drôle) ; avant le nom ou avant です.',
    ], vocab: [
      ['はは / おかあさん', 'haha / okâsann', 'ma mère / votre mère'], ['ちち / おとうさん', 'tchitchi / otôsann', 'mon père / votre père'], ['あね', 'ané', 'ma grande sœur'], ['いもうと', 'imôto', 'ma petite sœur'],
      ['あに', 'ani', 'mon grand frère'], ['おとうと', 'otôto', 'mon petit frère'], ['むすめ', 'mousoumé', 'ma fille'], ['おっと', 'otto', 'mon mari'],
      ['かぞく', 'kazokou', 'famille'], ['やさしい', 'yasachii', 'gentil(le)'], ['おもしろい', 'omochiroï', 'drôle'], ['せがたかい', 'sé ga takaï', 'grand(e) de taille'],
    ], writing: ['Écris ton arbre familial en hiragana.'],
    phrases: [['こちらは あねです', 'kotchira wa ané dèss', 'Voici ma grande sœur.'], ['きょうだいが ふたり います', 'kyôdaï ga foutari imass', 'J’ai deux frères et sœurs.'], ['ははは とても やさしいです', 'haha wa totémo yasachii dèss', 'Ma mère est très gentille.']] },

    { lesson: [
      'Le verbe poli finit en -ます -masu : おきます okimasu (je me lève). Négatif : -ません -masen.',
      'Particules : に ni (heure, destination), を o (objet), で dé (lieu de l’action).',
      'しちじに おきます shichi-dji ni okimasu (je me lève à 7 h) ; かいしゃに いきます kaisha ni ikimasu (je vais au bureau).',
      'Le verbe ne change pas selon la personne : たべます tabemasu = je mange, tu manges, elle mange.',
    ], vocab: [
      ['おきます', 'okimass', 'se lever'], ['あさごはんを たべます', 'assagohann o tabémass', 'prendre le petit-déjeuner'], ['はたらきます', 'hatarakimass', 'travailler'], ['たべます', 'tabémass', 'manger'],
      ['のみます', 'nomimass', 'boire'], ['いきます', 'ikimass', 'aller'], ['かえります', 'kaérimass', 'rentrer'], ['りょうりします', 'ryôri chimass', 'cuisiner'],
      ['よみます', 'yomimass', 'lire'], ['ねます', 'némass', 'dormir'], ['まいにち', 'maïnitchi', 'chaque jour'], ['それから', 'soré kara', 'ensuite'],
    ], writing: ['Écris ta routine du matin en 5 phrases en hiragana.'],
    phrases: [['しちじに おきます', 'chitchi dji ni okimass', 'Je me lève à sept heures.'], ['かいしゃに いきます', 'kaïcha ni ikimass', 'Je vais au bureau.'], ['よる ほんを よみます', 'yorou honn o yomimass', 'Le soir je lis un livre.']] },

    { lesson: [
      'Commander : 〜を ください … o kudasai (donnez-moi…, s’il vous plaît). コーヒーを ください kôhî o kudasai.',
      'Compter les objets : ひとつ hitotsu (1), ふたつ futatsu (2), みっつ mittsu (3).',
      'Mots étrangers en katakana : コーヒー (café), ジュース (jus), パン (pain).',
      'Au restaurant : メニュー menyû (menu), おかいけい o-kaikei (l’addition). Avant de manger : いただきます itadakimasu ; après : ごちそうさまでした gochisōsama deshita.',
    ], vocab: [
      ['とりにく', 'torinikou', 'poulet'], ['さかな', 'sakana', 'poisson'], ['ごはん', 'gohann', 'riz, repas'], ['やさい', 'yassaï', 'légumes'],
      ['くだもの', 'koudamono', 'fruits'], ['パン', 'pann', 'pain'], ['チーズ', 'tchîzou', 'fromage'], ['ジュース', 'djûsou', 'jus'],
      ['コーヒー', 'kôhî', 'café'], ['おちゃ', 'otcha', 'thé'], ['おいしい', 'oïchii', 'délicieux'], ['おかいけい', 'okaïkéï', 'l’addition'],
    ], writing: ['Écris ta liste de courses ; les mots étrangers en katakana.'],
    phrases: [['コーヒーを ください', 'kôhî o koudassaï', 'Un café, s’il vous plaît.'], ['おかいけい おねがいします', 'okaïkéï onégaï chimass', 'L’addition, s’il vous plaît.'], ['おいしいです', 'oïchii dèss', 'C’est délicieux.'], ['いただきます', 'itadakimass', 'Bon appétit (avant de manger).']] },

    { lesson: [
      'Où est… ? 〜は どこですか … wa doko desu ka ?',
      'Directions : みぎ migi (droite), ひだり hidari (gauche), まっすぐ massugu (tout droit). みぎに まがってください migi ni magatte kudasai (tournez à droite).',
      'Lieu : ちかい tchikaï (près), とおい tôï (loin), となり tonari (à côté), まえ maé (devant).',
      'Transports : でんしゃで densha dé (en train), バスで basu dé, あるいて aruite (à pied).',
    ], vocab: [
      ['えき', 'éki', 'gare'], ['くうこう', 'koûkô', 'aéroport'], ['うみ', 'oumi', 'mer, plage'], ['くすりや', 'kousouriya', 'pharmacie'],
      ['ホテル', 'hotérou', 'hôtel'], ['ちかい', 'tchikaï', 'près'], ['とおい', 'tôï', 'loin'], ['みぎ', 'migui', 'droite'],
      ['ひだり', 'hidari', 'gauche'], ['まっすぐ', 'massougou', 'tout droit'], ['きっぷ', 'kippou', 'billet'], ['でんしゃ', 'dènncha', 'train'],
    ], writing: ['Écris les mots de lieu en hiragana et ホテル en katakana.'],
    phrases: [['えきは どこですか', 'éki wa doko dèss ka', 'Où est la gare ?'], ['みぎに まがってください', 'migui ni magatté koudassaï', 'Tournez à droite.'], ['とおいですか', 'tôï dèss ka', 'C’est loin ?']] },

    { lesson: [
      'Passé poli : -ます devient -ました -mashita. いきます → いきました ikimashita (je suis allée).',
      'Passé négatif : -ませんでした -masen deshita.',
      'です → でした deshita (c’était). たのしかったです tanoshikatta desu (c’était agréable).',
      'Repères : きのう kinô (hier), しゅうまつ shûmatsu (le week-end), せんしゅう senshû (la semaine dernière).',
    ], vocab: [
      ['きのう', 'kinô', 'hier'], ['しゅうまつ', 'choûmatsou', 'week-end'], ['いきました', 'ikimachita', 'je suis allée'], ['たべました', 'tabémachita', 'j’ai mangé'],
      ['みました', 'mimachita', 'j’ai vu'], ['かいました', 'kaïmachita', 'j’ai acheté'], ['たのしかった', 'tanochikatta', 'c’était agréable'], ['それから', 'soré kara', 'ensuite'],
    ], writing: ['Écris 5 phrases sur ton dernier week-end au passé poli.'],
    phrases: [['きのう いちばに いきました', 'kinô itchiba ni ikimachita', 'Hier je suis allée au marché.'], ['たのしかったです', 'tanochikatta dèss', 'C’était bien.'], ['しゅうまつに なにを しましたか', 'choûmatsou ni nani o chimachita ka', 'Qu’as-tu fait ce week-end ?']] },

    { lesson: [
      'Le présent en -ます sert aussi de futur : らいねん にほんに いきます rainen Nihon ni ikimasu (l’an prochain j’irai au Japon).',
      'Envie : verbe sans ます + たいです -tai desu. いきたいです ikitai desu (je veux aller), ならいたいです naraitai desu (je veux apprendre).',
      'Projet : 〜つもりです -tsumori desu (j’ai l’intention de).',
      'Repères : あした ashita (demain), らいねん rainen (l’an prochain), いつか itsuka (un jour).',
    ], vocab: [
      ['ゆめ', 'youmé', 'rêve'], ['りょこう', 'ryokô', 'voyage'], ['ならいます', 'naraïmass', 'apprendre'], ['ちょきんします', 'tchokinn chimass', 'économiser'],
      ['ひっこします', 'hikkochimass', 'déménager'], ['あした', 'achita', 'demain'], ['らいねん', 'raïnènn', 'l’an prochain'], ['いつか', 'itsouka', 'un jour'],
    ], writing: ['Écris tes 3 projets avec 〜たいです.'],
    phrases: [['らいねん にほんに いきたいです', 'raïnènn nihonn ni ikitaï dèss', 'L’an prochain je veux aller au Japon.'], ['えを ならいたいです', 'é o naraïtaï dèss', 'Je veux apprendre la peinture.'], ['ゆめは なんですか', 'youmé wa nann dèss ka', 'Quel est ton rêve ?']] },

    { lesson: [
      'Relancer : 〜さんは？ … san wa ? (et vous ?), ほんとうですか hontô desu ka (vraiment ?), すごい sugoi (génial).',
      'Demander de l’aide : 〜は にほんごで なんですか … wa nihongo dé nan desu ka (comment dit-on… en japonais ?), ゆっくり おねがいします yukkuri onegaishimasu (lentement, s’il vous plaît).',
      'Donner son avis : 〜と おもいます … to omoimasu (je pense que…), そうですね sō desu né (c’est vrai).',
    ], vocab: [
      ['しつもん', 'chitsoumonn', 'question'], ['こたえ', 'kotaé', 'réponse'], ['たぶん', 'tabounn', 'peut-être'], ['も', 'mo', 'aussi'],
      ['もちろん', 'motchironn', 'bien sûr'], ['ゆっくり', 'youkkouri', 'lentement'], ['だいすき', 'daïsouki', 'j’adore'], ['またね', 'mata né', 'à bientôt'],
    ], writing: ['Prépare tes 10 questions en hiragana.'],
    phrases: [['おしごとは なんですか', 'ochigoto wa nann dèss ka', 'Quel est votre travail ?'], ['「joie」は にほんごで なんですか', '… wa nihonngo dé nann dèss ka', 'Comment dit-on « joie » en japonais ?'], ['ゆっくり おねがいします', 'youkkouri onégaï chimass', 'Plus lentement, s’il vous plaît.'], ['またね', 'mata né', 'À bientôt !']] },
  ],
};
