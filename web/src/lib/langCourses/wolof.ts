import type { LangCourse } from './types';

export const COURSE: LangCourse = {
  script: { title: 'Écrire le wolof', points: [
    'Le wolof s’écrit en alphabet latin selon l’orthographe officielle du Sénégal ; il s’écrit aussi en caractères arabes (wolofal), surtout dans les écrits religieux.',
    'Chaque lettre a un seul son. Le u se dit « ou », le e « é », le c « tch », le j « dj », le x « kh ».',
    'Voyelle doublée = voyelle longue : bët (œil) / bëtt (percer).',
    'Consonne doublée = consonne appuyée : bopp (tête).',
    'Le ë est un « e » neutre (comme dans « le ») ; le à un « a » ouvert ; le é un « é » long et fermé.',
  ], table: [
    ['u', '« ou »', 'tubaab (Européen)'],
    ['e', '« è » ouvert', 'dem (partir)'],
    ['é', '« é » fermé', 'wér (guérir)'],
    ['ë', '« e » de « le »', 'jërëjëf (merci)'],
    ['c', '« tch »', 'ceeb (riz)'],
    ['j', '« dj »', 'jigéen (femme)'],
    ['x', '« kh » raclé', 'xale (enfant)'],
    ['ñ', '« gn »', 'ñaata (combien)'],
    ['ŋ', '« ng » du nez', 'ŋaam (mâchoire)'],
    ['mb, nd, ng, nj', 'm ou n devant la consonne, d’un seul souffle', 'mbokk, ndaw'],
  ] },
  lessons: [
    { lesson: [
      'Tout se prononce : pas de lettre muette.',
      'La longueur des voyelles change le sens : faites durer « aa », « ee », « oo ».',
      'Les sons mb, nd, ng, nj se disent d’un seul coup, sans voyelle avant : « ndox » (eau).',
      'Le x est le « kh » de la gorge : xam (savoir), xale (enfant).',
    ], vocab: [
      ['waaw', 'waw', 'oui'], ['déedéet', 'déédéét', 'non'], ['jërëjëf', 'djeureudjeuf', 'merci'], ['baal ma', 'bal ma', 'pardon'],
      ['ndox', 'ndokh', 'eau'], ['kër', 'keur', 'maison'], ['jigéen', 'djiguéén', 'femme'], ['góor', 'goor', 'homme'],
      ['xale', 'khalé', 'enfant'], ['dëkk', 'deuk', 'ville, village'], ['téere', 'tééré', 'livre'], ['ceeb', 'tchééb', 'riz'],
    ], writing: ['Recopie chaque mot en lisant les lettres du tableau.'],
    phrases: [['Salaam aleekum.', 'salam alékoum', 'Bonjour (que la paix soit sur vous).'], ['Maleekum salaam.', 'malékoum salam', 'Réponse : et sur vous la paix.'], ['Jërëjëf.', 'djeureudjeuf', 'Merci.'], ['Ci kanam.', 'tchi kanam', 'De rien (litt. « devant »).'], ['Dégguma.', 'dégoumaa', 'Je ne comprends pas.']] },

    { lesson: [
      'Les salutations sont longues et importantes : on demande des nouvelles de la personne, puis de la famille.',
      'Na nga def ? (comment vas-tu ?) — Maa ngi fi rekk (je suis là, ça va).',
      'Pronoms : man (moi), yow (toi), moom (lui/elle), nun (nous), yeen (vous), ñoom (eux).',
      'Le verbe ne change pas, c’est le pronom qui change : maa ngi dem (je pars), yaa ngi dem (tu pars).',
      'Se présenter : maa ngi tudd Aida (je m’appelle Aida), maa ngi dëkk Dakar (j’habite à Dakar).',
    ], vocab: [
      ['na nga def ?', 'na nga dèf', 'comment vas-tu ?'], ['maa ngi fi rekk', 'ma ngui fi rèk', 'je vais bien'], ['jàmm nga am ?', 'djamm nga am', 'tu es en paix ?'], ['jàmm rekk', 'djamm rèk', 'la paix seulement'],
      ['naka waa kër gi ?', 'naka wa keur gui', 'comment va la famille ?'], ['ñu ngi fa', 'gnou ngui fa', 'ils vont bien'], ['tudd', 'toud', 's’appeler'], ['dëkk', 'deuk', 'habiter'],
      ['liggéey', 'liguééy', 'travailler'], ['xarit', 'kharit', 'ami(e)'], ['ba beneen', 'ba bénéén', 'à la prochaine'], ['ba ci kanam', 'ba tchi kanam', 'à plus tard'],
    ], writing: ['Écris ta présentation en wolof en 4 phrases.'],
    phrases: [['Maa ngi tudd Aida.', 'ma ngui toud aïda', 'Je m’appelle Aida.'], ['Maa ngi dëkk Dakar.', 'ma ngui deuk dakar', 'J’habite à Dakar.'], ['Yow nag ?', 'yow nag', 'Et toi ?'], ['Naka nga tudd ?', 'naka nga toud', 'Comment t’appelles-tu ?']] },

    { lesson: [
      '1 à 5 : benn, ñaar, ñett, ñeent, juróom.',
      '6 à 9 se forment sur 5 : juróom benn (6), juróom ñaar (7), juróom ñett (8), juróom ñeent (9). 10 = fukk.',
      'Dizaines : ñaar fukk (20), fanweer (30), ñeent fukk (40)… téeméer (100).',
      'Attention à l’argent : on compte souvent en « dërëm » (1 dërëm = 5 francs CFA). Ñaar téeméer = 200 dërëm = 1 000 F.',
      'L’heure : ci ñeenti waxtu (à quatre heures). Waxtu = heure.',
      'Prix : Ñaata la ? (c’est combien ?).',
    ], vocab: [
      ['benn, ñaar, ñett', 'bènn, gnaar, gnètt', '1, 2, 3'], ['ñeent, juróom', 'gnéént, djourom', '4, 5'], ['juróom benn', 'djouroum bènn', '6'], ['fukk', 'fouk', '10'],
      ['ñaar fukk', 'gnaar fouk', '20'], ['téeméer', 'tééméér', '100'], ['waxtu', 'wakhtou', 'heure'], ['dërëm', 'deureum', '5 francs CFA'],
      ['ñaata ?', 'gnaata', 'combien ?'], ['yomb na', 'yomb na', 'c’est pas cher'], ['dafa jafe', 'dafa djafé', 'c’est cher'], ['tey', 'tèy', 'aujourd’hui'],
    ], writing: ['Écris les nombres de 1 à 10 en wolof.'],
    phrases: [['Ñaata la ?', 'gnaata la', 'C’est combien ?'], ['Dafa jafe.', 'dafa djafé', 'C’est cher.'], ['Waññi ko tuuti.', 'wagni ko touti', 'Baisse un peu le prix.'], ['Ban waxtu moo jot ?', 'bann wakhtou mo djot', 'Quelle heure est-il ?']] },

    { lesson: [
      'Possessifs : sama (mon, ma), sa (ton, ta), am / bi (son) : sama yaay (ma mère), sa baay (ton père).',
      'La famille élargie compte beaucoup : mbokk = parent, proche.',
      'Avoir : am. Am naa ñaar mag (j’ai deux aînés).',
      'Décrire : sama yaay dafa baax (ma mère est gentille).',
    ], vocab: [
      ['yaay', 'yaay', 'mère'], ['baay', 'baay', 'père'], ['mag', 'mag', 'aîné(e)'], ['rakk', 'rak', 'cadet(te)'],
      ['doom', 'doom', 'enfant (fils, fille)'], ['jëkkër', 'djeukeur', 'mari'], ['maam', 'maam', 'grand-parent'], ['bàjjan', 'badjann', 'tante paternelle'],
      ['nijaay', 'nidjaay', 'oncle maternel'], ['mbokk', 'mbok', 'parent, proche'], ['baax', 'baakh', 'gentil(le), bon(ne)'], ['rafet', 'rafèt', 'beau, belle'],
    ], writing: ['Écris ton arbre familial en wolof.'],
    phrases: [['Kii sama rakk la.', 'kii sama rak la', 'Voici mon cadet / ma cadette.'], ['Am naa ñaar mag.', 'am na gnaar mag', 'J’ai deux aînés.'], ['Sama yaay dafa baax.', 'sama yaay dafa baakh', 'Ma mère est gentille.']] },

    { lesson: [
      'Le présent en cours : maa ngi + verbe (maa ngi lekk, je suis en train de manger).',
      'L’habitude : dama + verbe (dama liggéey ci suba, je travaille le matin).',
      'Négation : verbe + -uma pour « je » : lekkuma (je n’ai pas mangé, je ne mange pas).',
      'Repères : ci suba (le matin), ci ngoon (l’après-midi), ci guddi (la nuit), bu jëkk (d’abord), ginnaaw (après).',
    ], vocab: [
      ['yeewu', 'yééwou', 'se réveiller'], ['lekk', 'lèk', 'manger'], ['naan', 'naan', 'boire'], ['dem', 'dèm', 'aller, partir'],
      ['dellu', 'dèllou', 'revenir'], ['liggéey', 'liguééy', 'travailler'], ['togg', 'tog', 'cuisiner'], ['jàng', 'djang', 'lire, étudier'],
      ['nelaw', 'nélaw', 'dormir'], ['julli', 'djoulli', 'prier'], ['ndekki', 'ndèkki', 'petit-déjeuner'], ['bés bu nekk', 'bés bou nèk', 'chaque jour'],
    ], writing: ['Écris ta routine du matin en 5 phrases.'],
    phrases: [['Dama yeewu ci juróom ñaari waxtu.', 'dama yééwou tchi djourom gnaari wakhtou', 'Je me réveille à sept heures.'], ['Maa ngi dem liggéey.', 'ma ngui dèm liguééy', 'Je vais au travail.'], ['Ci guddi dama jàng.', 'tchi gouddi dama djang', 'Le soir je lis.']] },

    { lesson: [
      'Demander : dama bëgg… (je veux…), may ma… (donne-moi…).',
      'Article défini après le nom : ceeb bi (le riz), jën wi (le poisson), ndox mi (l’eau).',
      'Au marché, on négocie : waññi ko tuuti (baisse un peu).',
      'Remercier : jërëjëf ; c’est bon : neex na.',
    ], vocab: [
      ['ginaar', 'guinaar', 'poulet'], ['jën', 'djeunn', 'poisson'], ['ceeb', 'tchééb', 'riz'], ['lujum', 'loudjoum', 'légumes'],
      ['meññeef', 'mégnééf', 'fruits'], ['mburu', 'mbourou', 'pain'], ['soow', 'soow', 'lait caillé'], ['kafe', 'kafé', 'café'],
      ['àttaaya', 'attaaya', 'thé'], ['neex na', 'nèèkh na', 'c’est bon'], ['xaalis', 'khaalis', 'argent'], ['marse', 'marsé', 'marché'],
    ], writing: ['Écris ta liste de courses en wolof.'],
    phrases: [['Dama bëgg kafe.', 'dama beug kafé', 'Je veux un café.'], ['Ñaata la kilo bi ?', 'gnaata la kilo bi', 'Combien le kilo ?'], ['Neex na lool !', 'nèèkh na lool', 'C’est très bon !']] },

    { lesson: [
      'Où est… ? Fan la … nekk ? (fan la marse bi nekk ? où est le marché ?).',
      'Directions : ndijoor (droite), càmmooñ (gauche), jublu (aller droit vers).',
      'Lieu : jege (près), sore (loin), wetu (à côté de).',
      'Transports : car rapide, taksi, ci tànk (à pied).',
    ], vocab: [
      ['mbedd', 'mbèdd', 'rue'], ['gaar', 'gaar', 'gare'], ['ayropoor', 'ayropoor', 'aéroport'], ['géej', 'guéédj', 'mer, plage'],
      ['farmasi', 'farmasi', 'pharmacie'], ['jàkka', 'djakka', 'mosquée'], ['jege', 'djégué', 'près'], ['sore', 'soré', 'loin'],
      ['ndijoor', 'ndidjoor', 'droite'], ['càmmooñ', 'tchammoogn', 'gauche'], ['ci tànk', 'tchi tank', 'à pied'], ['taksi', 'taksi', 'taxi'],
    ], writing: ['Écris ton trajet vers un lieu que tu aimes.'],
    phrases: [['Fan la jàkka ji nekk ?', 'fann la djakka dji nèk', 'Où est la mosquée ?'], ['Dafa sore ?', 'dafa soré', 'C’est loin ?'], ['Jublul ci ndijoor.', 'djoubloul tchi ndidjoor', 'Va vers la droite.']] },

    { lesson: [
      'Action accomplie : verbe + na + pronom : dem naa (je suis allée), lekk naa (j’ai mangé).',
      'Le « na » marque que c’est fait ; « naa » = moi, « nga » = toi, « na » = lui/elle.',
      'Repères : démb (hier), ayu-bés bi weesu (la semaine dernière), ginnaaw ga (ensuite).',
    ], vocab: [
      ['démb', 'démb', 'hier'], ['dem naa', 'dèm na', 'je suis allée'], ['lekk naa', 'lèk na', 'j’ai mangé'], ['gis naa', 'guis na', 'j’ai vu'],
      ['jënd naa', 'djeund na', 'j’ai acheté'], ['neex na', 'nèèkh na', 'c’était bien'], ['ginnaaw ga', 'guinnaaw ga', 'ensuite'], ['bés bi', 'bés bi', 'la journée'],
    ], writing: ['Écris 5 phrases sur ton dernier week-end.'],
    phrases: [['Démb dem naa marse.', 'démb dèm na marsé', 'Hier je suis allée au marché.'], ['Bés bi neex na.', 'bés bi nèèkh na', 'La journée était agréable.'], ['Lan nga def démb ?', 'lann nga dèf démb', 'Qu’as-tu fait hier ?']] },

    { lesson: [
      'Futur : dinaa + verbe (dinaa dem, j’irai).',
      'Envie : dama bëgg + verbe (dama bëgg jàng, je veux apprendre).',
      'Inshaa Allaah s’ajoute naturellement à tout projet.',
      'Repères : ëllëg (demain), at mii di ñëw (l’an prochain), benn bés (un jour).',
    ], vocab: [
      ['bëgg', 'beug', 'vouloir, aimer'], ['tukki', 'toukki', 'voyager'], ['jàng', 'djang', 'apprendre'], ['dencal', 'dènntchal', 'économiser'],
      ['ëllëg', 'eulleug', 'demain'], ['at mii di ñëw', 'at mii di gneuw', 'l’an prochain'], ['benn bés', 'bènn bés', 'un jour'], ['yéene', 'yééné', 'souhait, intention'],
    ], writing: ['Écris tes 3 projets avec dinaa et dama bëgg.'],
    phrases: [['Dinaa tukki, inshaa Allaah.', 'dina toukki inncha alla', 'Je vais voyager, si Dieu le veut.'], ['Dama bëgg jàng nataal.', 'dama beug djang nataal', 'Je veux apprendre le dessin.'], ['Lan nga bëgg def at mii ?', 'lann nga beug dèf at mii', 'Que veux-tu faire cette année ?']] },

    { lesson: [
      'Relancer : yow nag ? (et toi ?), dëgg ? (vraiment ?), baax na (c’est bien).',
      'Demander de l’aide : naka lañuy wax… ci wolof ? (comment dit-on… en wolof ?), waxal ndànk (parle doucement).',
      'Donner son avis : dama defe ne (je pense que), dëgg la (c’est vrai).',
    ], vocab: [
      ['laaj', 'laadj', 'question, demander'], ['tontu', 'tonntou', 'réponse, répondre'], ['xëyna', 'kheuyna', 'peut-être'], ['itam', 'itam', 'aussi'],
      ['ndànk', 'ndank', 'doucement'], ['dëgg', 'deug', 'vrai'], ['bëgg naa ko lool', 'beug na ko lool', 'j’adore ça'], ['ba beneen yoon', 'ba bénéén yoon', 'à la prochaine'],
    ], writing: ['Prépare tes 10 questions en wolof.'],
    phrases: [['Lan ngay def ci dund ?', 'lann ngaï dèf tchi dound', 'Que fais-tu dans la vie ?'], ['Naka lañuy wax « joie » ci wolof ?', 'naka lagnouy wakh … tchi wolof', 'Comment dit-on « joie » en wolof ?'], ['Waxal ndànk.', 'wakhal ndank', 'Parle doucement.'], ['Ba beneen yoon !', 'ba bénéén yoon', 'À la prochaine !']] },
  ],
};
