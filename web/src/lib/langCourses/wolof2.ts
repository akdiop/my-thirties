import type { LangCourse } from './types';

/** Wolof · lire et écrire : orthographe officielle (alphabet national du Sénégal) pour une personne qui parle déjà un peu. */
export const COURSE: LangCourse = {
  script: { title: 'Les règles d’or de l’orthographe', points: [
    'Une lettre = un son, toujours le même. On écrit ce qu’on entend, sans lettres muettes.',
    'Pas de « ou », « ch », « gn », « dj », « tch » à la française : on écrit u, c, ñ, j, c.',
    'Une voyelle longue s’écrit doublée (aa, ee, ii, oo, uu) ; une consonne appuyée s’écrit doublée (bb, dd, kk…).',
    'Les accents ne sont pas décoratifs : à, é, ë, ó changent le son et parfois le sens.',
    'Les noms propres gardent souvent leur forme officielle à la française (Ndiaye, Diop), mais en wolof écrit on trouve Njaay, Jóob.',
  ], table: [
    ['ou → u', '« ou »', 'suukar (et non « soukar »)'],
    ['ch → c', 'tch', 'ceeb (et non « thiéb »)'],
    ['dj, di → j', 'dj', 'jàmm (et non « diam »)'],
    ['kh → x', 'kh', 'xale (et non « khalé »)'],
    ['gn → ñ', 'gn', 'ñaar (et non « gnaar »)'],
    ['ng (nasal) → ŋ', 'ng du nez', 'ŋaam'],
    ['é long', 'é', 'wér'],
    ['ë', 'e de « le »', 'jërëjëf'],
  ] },
  lessons: [
    { lesson: [
      'Sept voyelles : a, à (a ouvert, un peu plus grave), e (è ouvert), é (é fermé), ë (e de « le »), i, o (o ouvert), ó (o fermé), u (ou).',
      'Voyelle longue = voyelle doublée : bët (œil) / bëtt (percer), set (propre) / seet (regarder).',
      'Le é et le ó sont presque toujours longs ; on écrit alors ée et óo : jigéen, góor.',
      'Repère : si tu tiens le son, double la lettre. Si tu hésites, dis le mot lentement en tapant dans les mains.',
    ], vocab: [
      ['set / seet', 'sèt / séét', 'propre / regarder'], ['bët / bëtt', 'beut / beutt', 'œil / percer'], ['wax', 'wakh', 'parler'], ['waaw', 'waaw', 'oui'],
      ['jigéen', 'djiguéén', 'femme'], ['góor', 'goor', 'homme'], ['nit', 'nitt', 'personne'], ['kër', 'keur', 'maison'],
      ['suukar', 'soukar', 'sucre'], ['doole', 'doolé', 'force'], ['tey', 'tèy', 'aujourd’hui'], ['ëllëg', 'eulleug', 'demain'],
    ], writing: ['Écris 10 mots que tu dis souvent et entoure les voyelles longues.', 'Fais-toi dicter 10 mots par quelqu’un et compare avec la liste.'],
    phrases: [['Seetal sa bët.', 'séétal sa beut', 'Regarde bien (litt. ton œil).'], ['Kër gi set na.', 'keur gui sèt na', 'La maison est propre.'], ['Jigéen ñi ñëw nañu.', 'djiguéén gni gneuw nagnou', 'Les femmes sont venues.']],
    reading: { title: 'Lire lentement', lines: [
      ['Tey, Aida dafa yeewu teel.', 'tèy aïda dafa yééwou tééll', 'Aujourd’hui, Aida s’est réveillée tôt.'],
      ['Mu sangu, julli, naan kafe.', 'mou sanngou djoulli naan kafé', 'Elle s’est lavée, a prié, a bu un café.'],
      ['Ginnaaw loolu, mu dem liggéey.', 'guinnaaw loolou mou dèm liguééy', 'Après cela, elle est allée travailler.'],
    ] } },

    { lesson: [
      'c = « tch » : ceeb (riz), caabi (clé), cere (couscous).',
      'j = « dj » : jàmm (paix), jën (poisson), jigéen (femme).',
      'x = « kh » de la gorge : xale (enfant), xam (savoir), xaalis (argent).',
      'ñ = « gn » : ñaar (deux), ñu (ils, nous), ñaw (laid). ŋ = « ng » nasal en début ou milieu de mot : ŋaam (mâchoire).',
      'q = « k » profond, surtout doublé (qq) : ce son est rare.',
      'Les mots écrits « à la française » sur les enseignes et les menus se réécrivent ainsi : thiéboudieune → ceebu jën, yassa → yaasa, thiakry → cakri.',
    ], vocab: [
      ['ceebu jën', 'tchéébou djeunn', 'riz au poisson (« thiéboudieune »)'], ['cere', 'tchéré', 'couscous de mil (« thiéré »)'], ['cakri', 'tchakri', 'dessert au mil (« thiakry »)'], ['caabi', 'tchaabi', 'clé'],
      ['jàmm', 'djamm', 'paix'], ['jën', 'djeunn', 'poisson'], ['xale', 'khalé', 'enfant'], ['xaalis', 'khaalis', 'argent'],
      ['ñaar', 'gnaar', 'deux'], ['Cees', 'tchééss', 'Thiès'], ['Njaay', 'ndjaay', 'Ndiaye (nom)'], ['Jóob', 'djoob', 'Diop (nom)'],
    ], writing: ['Réécris ces mots en bon wolof : diam, khalé, thiéb, gnaar, diénn.', 'Écris le menu d’un restaurant sénégalais en orthographe officielle.'],
    phrases: [['Ceebu jën bi neex na.', 'tchéébou djeunn bi nèèkh na', 'Le thiéboudieune est bon.'], ['Xale yi ñu ngi fo.', 'khalé yi gnou ngui fo', 'Les enfants jouent.'], ['Jàmm ak salaam.', 'djamm ak salaam', 'La paix et le salut.']],
    reading: { title: 'Au marché de Cees', lines: [
      ['Fatu dem na marse Cees.', 'fatou dèm na marsé tchééss', 'Fatou est allée au marché de Thiès.'],
      ['Mu jënd jën, ceeb ak xob.', 'mou djeund djeunn tchéèb ak khob', 'Elle a acheté du poisson, du riz et des feuilles.'],
      ['Jaaykat bi ne ko : « Ñaar junni la. »', 'djaaykat bi né ko gnaar djounni la', 'Le vendeur lui a dit : « C’est deux mille. »'],
    ] } },

    { lesson: [
      'Consonne doublée = consonne appuyée : bopp (tête), dëkk (habiter), bëgg (vouloir). Écoute l’appui : s’il est net, double la lettre.',
      'Exemples sûrs : sopp (aimer, apprécier), dëkk (habiter), bëgg (vouloir), xamm (reconnaître) / xam (savoir).',
      'Les prénasales s’écrivent en un bloc : mb (mbokk, parent), nd (ndox, eau), ng (ngoon, après-midi), nj (njaboot, famille). On ne met jamais de voyelle avant : « mbokk », pas « ombok ».',
      'Pas de doublement après une voyelle longue : on écrit « dëkk » mais « daaw » (l’an dernier) sans doubler le w.',
    ], vocab: [
      ['bopp', 'bopp', 'tête'], ['sopp', 'sopp', 'aimer, apprécier'], ['dëkk', 'deukk', 'habiter, ville'], ['bëgg', 'beugg', 'vouloir, aimer'],
      ['xam / xamm', 'kham / khamm', 'savoir / reconnaître'], ['mbokk', 'mbokk', 'parent, proche'], ['ndox', 'ndokh', 'eau'], ['ngoon', 'ngoon', 'après-midi'],
      ['njaboot', 'ndjaboot', 'famille (foyer)'], ['mbaam', 'mbaam', 'âne'], ['ndaw', 'ndaw', 'jeune'], ['ngelaw', 'nguélaw', 'vent'],
    ], writing: ['Écris 10 mots avec mb, nd, ng ou nj.', 'Écris 5 paires de mots où seule la consonne double change.'],
    phrases: [['Sama njaboot ñu ngi dëkk Pikin.', 'sama ndjaboot gnou ngui deukk pikinn', 'Ma famille habite à Pikine.'], ['Dama bëgg ndox.', 'dama beugg ndokh', 'Je veux de l’eau.'], ['Ci ngoon laa ñëw.', 'tchi ngoon la gneuw', 'Je viendrai l’après-midi.']],
    reading: { title: 'Ngoon si', lines: [
      ['Ci ngoon si, ngelaw li dafa sedd.', 'tchi ngoon si nguélaw li dafa sèdd', 'Cet après-midi, le vent est frais.'],
      ['Sama mbokk yi ñëw nañu ci kër gi.', 'sama mbokk yi gneuw nagnou tchi keur gui', 'Mes proches sont venus à la maison.'],
      ['Nu naan ndox ak àttaaya.', 'nou naan ndokh ak attaaya', 'Nous avons bu de l’eau et du thé.'],
    ] } },

    { lesson: [
      'Le verbe ne change pas, c’est le groupe pronom-marque qui porte la personne. On l’écrit séparé du verbe.',
      'En cours : maa ngi, yaa ngi, mu ngi, nu ngi, yeena ngi, ñu ngi + verbe : maa ngi lekk (je mange).',
      'Accompli : verbe + na + personne, attaché par l’usage : dem naa, dem nga, dem na, dem nanu, dem ngeen, dem nañu.',
      'Habitude / insistance sur le verbe : dama, danga, dafa, danu, dangeen, dañu + verbe : dafa tàng (il fait chaud).',
      'Futur : dinaa, dinga, dina, dinanu, dingeen, dinañu + verbe : dinaa dem (j’irai).',
    ], vocab: [
      ['maa ngi', 'ma ngui', 'je suis en train de'], ['dem naa', 'dèm na', 'je suis partie'], ['dama', 'dama', 'je (insistance)'], ['dinaa', 'dina', 'je vais (futur)'],
      ['lekk', 'lèkk', 'manger'], ['naan', 'naan', 'boire'], ['liggéey', 'liguééy', 'travailler'], ['nelaw', 'nélaw', 'dormir'],
      ['jàng', 'djang', 'lire, étudier'], ['bind', 'binnd', 'écrire'], ['wax', 'wakh', 'parler, dire'], ['dégg', 'dégg', 'entendre, comprendre'],
    ], writing: ['Conjugue « bind » (écrire) avec maa ngi, naa, dama et dinaa à toutes les personnes.', 'Écris 6 phrases sur ta journée.'],
    phrases: [['Maa ngi bind ci wolof.', 'ma ngui binnd tchi wolof', 'J’écris en wolof.'], ['Bind naa bataaxal.', 'binnd na bataakhal', 'J’ai écrit une lettre.'], ['Dinaa la woo ëllëg.', 'dina la woo eulleug', 'Je t’appellerai demain.']],
    reading: { title: 'Sama bés', lines: [
      ['Maa ngi yeewu ci juróom ñaari waxtu.', 'ma ngui yééwou tchi djouroom gnaari wakhtou', 'Je me réveille à sept heures.'],
      ['Dama naan kafe, jàng tuuti, dem liggéey.', 'dama naan kafé djang touti dèm liguééy', 'Je bois un café, je lis un peu, je vais travailler.'],
      ['Ëllëg dinaa fanaan ca yaay.', 'eulleug dina fanaan tcha yaay', 'Demain je passerai la nuit chez ma mère.'],
    ] } },

    { lesson: [
      'L’article suit le nom et s’accorde avec sa classe : b, g, j, k, l, m, s, w. On l’écrit séparé : kër gi (la maison), ndox mi (l’eau), xale bi (l’enfant).',
      'Proche : -i (bi, gi, mi) ; lointain ou passé : -a (ba, ga, ma) : xale ba (l’enfant-là).',
      'Pluriel : yi (proche), ya (lointain) pour la plupart des mots ; ñi / ña pour les personnes : nit ñi (les gens).',
      'Démonstratifs : bii (celui-ci), boobu (celui-là) ; le même jeu de classes : kër gii (cette maison-ci).',
      'Le mot écrit garde la classe qu’on entend : écoute l’article quand tu parles, puis écris-le.',
    ], vocab: [
      ['xale bi', 'khalé bi', 'l’enfant'], ['kër gi', 'keur gui', 'la maison'], ['ndox mi', 'ndokh mi', 'l’eau'], ['jigéen ji', 'djiguéén dji', 'la femme'],
      ['nit ki', 'nit ki', 'la personne'], ['nit ñi', 'nit gni', 'les gens'], ['ceeb bi', 'tchéèb bi', 'le riz'], ['ndab li', 'ndab li', 'le récipient'],
      ['garab gi', 'garab gui', 'l’arbre'], ['xaj bi', 'khadj bi', 'le chien'], ['yi', 'yi', 'les (proche)'], ['boobu', 'boobou', 'celui-là'],
    ], writing: ['Mets l’article à 15 mots de ta maison.', 'Décris ta chambre en 6 phrases avec les articles.'],
    phrases: [['Kër gi dafa rafet.', 'keur gui dafa rafèt', 'La maison est belle.'], ['Xale yi ñu ngi jàng.', 'khalé yi gnou ngui djang', 'Les enfants étudient.'], ['Jigéen ji dafa baax.', 'djiguéén dji dafa baakh', 'La femme est gentille.']],
    reading: { title: 'Sama kër', lines: [
      ['Sama kër gi amul lu bari.', 'sama keur gui amoul lou bari', 'Ma maison n’a pas grand-chose.'],
      ['Am na néeg bu mag ak waañ wu ndaw.', 'am na nééeg bou mag ak waagn wou ndaw', 'Il y a une grande chambre et une petite cuisine.'],
      ['Garab gi ci buntu kër gi dafa mag lool.', 'garab gui tchi bountou keur gui dafa mag lool', 'L’arbre devant la porte de la maison est très grand.'],
    ] } },

    { lesson: [
      'Négation de l’accompli : verbe + -uma (je), -oo (tu), -ul (il/elle), -unu (nous), -ileen (vous), -uñu (ils) : demuma (je ne suis pas partie), lekkul (il n’a pas mangé).',
      'Négation de l’insistance : duma, doo, du, dunu, dungeen, duñu + verbe : duma dem (je ne pars pas).',
      'Questions : lan (quoi), kan (qui), fan (où), kañ (quand), naka (comment), lu tax (pourquoi), ñaata (combien).',
      'On écrit le point d’interrogation à la fin ; l’ordre des mots ne change pas : Fan nga dem ? (Où vas-tu ?).',
    ], vocab: [
      ['demuma', 'dèmouma', 'je ne suis pas partie'], ['lekkul', 'lèkkoul', 'il n’a pas mangé'], ['duma', 'douma', 'je ne… pas'], ['amul', 'amoul', 'il n’y a pas'],
      ['lan', 'lann', 'quoi'], ['kan', 'kann', 'qui'], ['fan', 'fann', 'où'], ['kañ', 'kagn', 'quand'],
      ['naka', 'naka', 'comment'], ['lu tax', 'lou takh', 'pourquoi'], ['ñaata', 'gnaata', 'combien'], ['ndax', 'ndakh', 'est-ce que'],
    ], writing: ['Mets 8 phrases à la forme négative.', 'Écris 10 questions à poser à ta grand-mère.'],
    phrases: [['Lu tax demoo ?', 'lou takh dèmoo', 'Pourquoi n’es-tu pas partie ?'], ['Duma lekk yàpp.', 'douma lèkk yapp', 'Je ne mange pas de viande.'], ['Kañ ngay ñëw ?', 'kagn ngaï gneuw', 'Quand viens-tu ?']],
    reading: { title: 'Laaj yi', lines: [
      ['Yaay laaj na ma : « Lu tax demoo ca marse ba ? »', 'yaay laadj na ma lou takh dèmoo tcha marsé ba', 'Maman m’a demandé : « Pourquoi n’es-tu pas allée au marché ? »'],
      ['Ma ne ko : « Taw bi dafa bari, demuma. »', 'ma né ko taw bi dafa bari dèmouma', 'Je lui ai dit : « Il pleuvait trop, je n’y suis pas allée. »'],
      ['Mu ne : « Ëllëg nag ? » Ma ne : « Ëllëg dinaa dem. »', 'mou né eulleug nag ma né eulleug dina dèm', 'Elle a dit : « Et demain ? » J’ai dit : « Demain j’irai. »'],
    ] } },

    { lesson: [
      'Les messages en wolof sont souvent écrits « à l’oreille » avec l’orthographe française : « nanga def », « diam rek », « dieuredieuf ». La bonne forme : Na nga def ? Jàmm rekk. Jërëjëf.',
      'Les mots se séparent : « nangadef » → Na nga def ; « mangifi » → Maa ngi fi.',
      'Les emprunts au français gardent souvent leur forme wolofisée : biro (bureau), oto (voiture), telefon.',
      'Pour un message, commence par les salutations, puis le sujet, puis une formule : Ba ci kanam, Yàlla na la Yàlla barkeel (qu’Allah te bénisse).',
    ], vocab: [
      ['bataaxal', 'bataakhal', 'lettre, message'], ['woo', 'woo', 'appeler'], ['telefon', 'téléfon', 'téléphone'], ['biro', 'biro', 'bureau'],
      ['oto', 'oto', 'voiture'], ['ndaje', 'ndadjé', 'réunion, rencontre'], ['ñëw', 'gneuw', 'venir'], ['xaar', 'khaar', 'attendre'],
      ['bés', 'béss', 'jour'], ['waxtu', 'wakhtou', 'heure'], ['ba ci kanam', 'ba tchi kanam', 'à plus tard'], ['Yàlla na la barkeel', 'yalla na la barkéél', 'qu’Allah te bénisse'],
    ], writing: ['Réécris en bon wolof : « nanga def ? mangifi rek. dieuredieuf. ba beneen yon. »', 'Écris un message pour inviter une amie à dîner vendredi.'],
    phrases: [['Na nga def ? Maa ngi fi rekk.', 'na nga dèf ma ngui fi rèkk', 'Comment vas-tu ? Ça va.'], ['Dinaa la woo ci ngoon.', 'dina la woo tchi ngoon', 'Je t’appellerai cet après-midi.'], ['Xaar ma tuuti.', 'khaar ma touti', 'Attends-moi un peu.']],
    reading: { title: 'Bataaxal bu Aida', lines: [
      ['Salaam aleekum Fatu, na nga def ?', 'salaam alékoum fatou na nga dèf', 'Bonjour Fatou, comment vas-tu ?'],
      ['Àjjuma ji, dinaa togg ceebu jën ci kër gi.', 'adjdjouma dji dina togg tchéébou djeunn tchi keur gui', 'Vendredi, je vais cuisiner un thiéboudieune à la maison.'],
      ['Bëgg naa nga ñëw ak sa doom yi.', 'beugg na nga gneuw ak sa doom yi', 'J’aimerais que tu viennes avec tes enfants.'],
      ['Ci juróom ñetti waxtu ci ngoon. Ba ci kanam !', 'tchi djouroom gnètti wakhtou tchi ngoon ba tchi kanam', 'À huit heures du soir. À bientôt !'],
    ] } },

    { lesson: [
      'Pour lire un texte long : une première lecture d’un trait sans traduction, une deuxième en cherchant les mots, une troisième à voix haute.',
      'Les mots de liaison du récit : bu jëkk (d’abord), ginnaaw loolu (après cela), ba noppi (ensuite, puis), waaye (mais), ndax (parce que), moo tax (c’est pourquoi).',
      'Le récit au passé s’écrit avec l’accompli (dem na, lekk nañu) et avec « da/dafa » pour décrire.',
    ], vocab: [
      ['bu jëkk', 'bou djeukk', 'd’abord'], ['ginnaaw loolu', 'guinnaaw loolou', 'après cela'], ['ba noppi', 'ba noppi', 'ensuite, une fois fini'], ['waaye', 'waayé', 'mais'],
      ['ndax', 'ndakh', 'parce que'], ['moo tax', 'moo takh', 'c’est pourquoi'], ['léeb', 'lééb', 'conte'], ['nettali', 'nèttali', 'raconter'],
      ['dëkk', 'deukk', 'village, ville'], ['tukki', 'toukki', 'voyager'], ['ñibbi', 'gnibbi', 'rentrer chez soi'], ['bégg', 'bégg', 'être content'],
    ], writing: ['Résume le texte en 5 phrases en wolof.', 'Raconte un voyage en 8 phrases avec les mots de liaison.'],
    phrases: [['Bu jëkk, dem nanu Tuubaa.', 'bou djeukk dèm nanou touubaa', 'D’abord, nous sommes allés à Touba.'], ['Waaye yoon wi dafa gudd.', 'waayé yoon wi dafa goudd', 'Mais la route était longue.'], ['Moo tax nu tàyyi.', 'moo takh nou tayyi', 'C’est pourquoi nous étions fatigués.']],
    reading: { title: 'Tukki bi', lines: [
      ['Daaw, Aida ak yaayam tukki nañu Sigicoor.', 'daaw aïda ak yaayam toukki nagnou sigui-tchoor', 'L’an dernier, Aida et sa mère sont parties en Casamance.'],
      ['Bu jëkk, ñu war oto ba Kawlax.', 'bou djeukk gnou war oto ba kawlakh', 'D’abord, elles ont pris la voiture jusqu’à Kaolack.'],
      ['Ginnaaw loolu, ñu jàll Gàmbi.', 'guinnaaw loolou gnou djall gambi', 'Après cela, elles ont traversé la Gambie.'],
      ['Yoon wi gudd na lool, waaye réew mi rafet na.', 'yoon wi goudd na lool waayé rééw mi rafèt na', 'La route était très longue, mais le pays était beau.'],
      ['Ñu dal ca seen mbokk, ñu teral leen bu baax.', 'gnou dal tcha séén mbokk gnou téral lèèn bou baakh', 'Elles ont logé chez des proches, qui les ont très bien accueillies.'],
      ['Ba ñu ñibbee, Aida ne : « Dinaa delloosi. »', 'ba gnou gnibbéé aïda né dina dèlloossi', 'En rentrant, Aida a dit : « Je reviendrai. »'],
    ] } },

    { lesson: [
      'Les proverbes (léebu) se lisent lentement : chaque mot compte.',
      'Félicitations : Yàlla na ko Yàlla def mu barkeel (qu’Allah le bénisse). Pour une naissance : Yàlla na mu yàgg te wér.',
      'Condoléances : Yàlla na ko Yàlla yërmande (qu’Allah lui fasse miséricorde). Réponse : Amiin.',
      'Remerciement chaleureux : Jërëjëf, Yàlla na la Yàlla fay (qu’Allah te récompense).',
    ], vocab: [
      ['léebu', 'léébou', 'proverbe, conte'], ['barkeel', 'barkéél', 'bénir'], ['yërmande', 'yeurmanndé', 'faire miséricorde'], ['fay', 'faï', 'récompenser, payer'],
      ['muñ', 'mougn', 'patience, patienter'], ['ndank', 'ndannk', 'lentement, doucement'], ['yaakaar', 'yaakaar', 'espoir'], ['dëgg', 'deugg', 'vérité'],
    ], writing: ['Recopie 5 proverbes et écris leur sens en français.', 'Écris un message de félicitations pour un mariage.'],
    phrases: [['Ndank ndank mooy jàpp golo ci ñaay.', 'ndannk ndannk mooy djapp golo tchi gnaay', 'Doucement, doucement, on attrape le singe dans la forêt (la patience paie).'], ['Muñ mooy gën.', 'mougn mooy geunn', 'La patience est ce qu’il y a de mieux.'], ['Nit nitay garabam.', 'nit nitaï garabam', 'L’homme est le remède de l’homme.'], ['Yàlla na la Yàlla fay.', 'yalla na la yalla faï', 'Qu’Allah te récompense.']],
    reading: { title: 'Ndank ndank', lines: [
      ['Mag ñi daan nañu wax : « Ndank ndank mooy jàpp golo ci ñaay. »', 'mag gni daan nagnou wakh ndannk ndannk mooy djapp golo tchi gnaay', 'Les anciens disaient : « Doucement, on attrape le singe dans la forêt. »'],
      ['Loolu lay tekki : muñ ak yaakaar ñoo lay jëmmal.', 'loolou laï tèkki mougn ak yaakaar gnoo laï djeummal', 'Cela veut dire : la patience et l’espoir te font aboutir.'],
      ['Moo tax Aida du yàkkamti ci jàng wolof.', 'moo takh aïda dou yakkamti tchi djang wolof', 'C’est pourquoi Aida ne se presse pas pour apprendre à écrire le wolof.'],
    ] } },

    { lesson: [
      'Avant d’écrire : liste ce que tu veux dire en 5 points.',
      'En écrivant : une idée par phrase, les mots de liaison du cours 8, les articles après les noms.',
      'Relis avec la liste de contrôle : voyelles longues doublées ? c, j, x, ñ au lieu de tch, dj, kh, gn ? accents à, é, ë, ó ? articles et pronoms séparés du verbe ?',
      'Fais relire par quelqu’un qui écrit le wolof, ou compare avec des textes publiés en orthographe officielle (journaux, livres, Coran traduit en wolof).',
    ], vocab: [
      ['bind', 'binnd', 'écrire'], ['jàng', 'djang', 'lire'], ['xët', 'kheut', 'page'], ['baat', 'baat', 'mot'],
      ['kàddu', 'kaddou', 'parole, phrase'], ['njuumte', 'ndjoumté', 'erreur'], ['defar', 'défar', 'corriger, réparer'], ['téere', 'tééré', 'livre'],
    ], writing: ['Écris une page sur ta famille ou ta journée.', 'Relis-la avec la liste de contrôle et corrige au moins 5 mots.'],
    phrases: [['Maa ngi bind sama njaboot.', 'ma ngui binnd sama ndjaboot', 'J’écris sur ma famille.'], ['Defaral ma njuumte yi.', 'défaral ma ndjoumté yi', 'Corrige-moi les erreurs.'], ['Bëgg naa jàng téere yu wolof.', 'beugg na djang tééré you wolof', 'Je veux lire des livres en wolof.']],
    reading: { title: 'Sama njaboot (texte modèle)', lines: [
      ['Sama tur Aida, maa ngi dëkk Dakar.', 'sama tour aïda ma ngui deukk dakar', 'Je m’appelle Aida, j’habite à Dakar.'],
      ['Sama njaboot gi bari na : yaay, baay, sama mag ak sama ñaari rakk.', 'sama ndjaboot gui bari na yaay baay sama mag ak sama gnaari rakk', 'Ma famille est grande : maman, papa, mon aîné et mes deux cadets.'],
      ['Sama yaay dafa xareñ ci togg, ceebu jënam neex na lool.', 'sama yaay dafa kharègn tchi togg tchéébou djeunnam nèèkh na lool', 'Ma mère est douée en cuisine, son thiéboudieune est délicieux.'],
      ['Sama baay mooy sama misaal : dafa muñ te dafa baax.', 'sama baay mooy sama missaal dafa mougn té dafa baakh', 'Mon père est mon modèle : il est patient et bon.'],
      ['Bés bu nekk, damay sant Yàlla ci seen wér-gi-yaram.', 'béss bou nèkk damaï sannt yalla tchi séén wér-gui-yaram', 'Chaque jour, je remercie Allah pour leur santé.'],
    ] } },
  ],
};
