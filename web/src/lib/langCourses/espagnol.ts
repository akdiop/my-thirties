import type { LangCourse } from './types';

export const COURSE: LangCourse = {
  script: { title: 'L’alphabet espagnol', points: [
    'Même alphabet que le français, plus la lettre ñ (« gn » comme dans « montagne »).',
    'Presque tout se prononce comme ça s’écrit, et toutes les lettres se prononcent (pas de lettre muette sauf le h).',
    'L’accent écrit (á, é, í, ó, ú) indique la syllabe à appuyer : café, está, música.',
    'Sans accent écrit : on appuie l’avant-dernière syllabe si le mot finit par une voyelle, n ou s (casa, hablan) ; sinon la dernière (hablar, ciudad).',
    'Les questions et exclamations s’ouvrent à l’envers : ¿Qué tal? ¡Hola!',
  ], table: [
    ['j / ge, gi', 'son « kh », raclé dans la gorge', 'jamón, gente'],
    ['ll / y', '« y » comme dans « yoyo »', 'llamo, yo'],
    ['ñ', '« gn »', 'España, mañana'],
    ['ch', '« tch »', 'chocolate'],
    ['z / ce, ci', '« s » (en Espagne : « th » anglais)', 'zapato, cerca'],
    ['r / rr', 'r roulé, une fois / plusieurs fois', 'pero, perro'],
    ['u', '« ou »', 'luna'],
    ['e', '« é »', 'mesa'],
    ['v', 'presque « b »', 'vino'],
    ['h', 'muet', 'hola'],
  ] },
  lessons: [
    { lesson: [
      'Cinq voyelles seulement, toujours nettes : a, e (« é »), i, o, u (« ou »). Pas de son nasal comme « an » ou « on » : « Juan » se dit « Khou-ann ».',
      'Les consonnes finales se prononcent toutes : « Madrid », « reloj ».',
      'Le r au début d’un mot ou doublé (rr) se roule fort : rosa, perro.',
      'Pour bien démarrer : lire lentement en détachant chaque syllabe, puis accélérer.',
    ], vocab: [
      ['hola', 'ola', 'bonjour, salut'], ['sí', 'si', 'oui'], ['no', 'no', 'non'], ['gracias', 'grassias', 'merci'],
      ['por favor', 'por fabor', 's’il te plaît'], ['perdón', 'pèrdonn', 'pardon'], ['agua', 'agoua', 'eau'], ['casa', 'kassa', 'maison'],
      ['mujer', 'moukhèr', 'femme'], ['hombre', 'ommbré', 'homme'], ['niño', 'nigno', 'enfant'], ['ciudad', 'ssioudad', 'ville'],
    ], writing: ['Recopie les mots en lisant chaque lettre à voix haute.', 'Repère les accents écrits et appuie sur la syllabe marquée.'],
    phrases: [['¡Hola!', 'ola', 'Salut !'], ['Gracias.', 'grassias', 'Merci.'], ['De nada.', 'dé nada', 'De rien.'], ['No entiendo.', 'no ènntienndo', 'Je ne comprends pas.'], ['¿Puede repetir?', 'pouédé répétir', 'Pouvez-vous répéter ?']] },

    { lesson: [
      'Deux façons de dire « tu » : tú (amis, famille) et usted (poli, comme « vous »). Usted se conjugue comme « il/elle ».',
      'Verbe ser (être, pour l’identité) : soy, eres, es, somos, sois, son. « Soy Aida. »',
      'Verbe llamarse (s’appeler) : me llamo, te llamas, se llama.',
      'Les mots sont masculins ou féminins : -o souvent masculin, -a souvent féminin. Adjectif accordé : senegalés / senegalesa.',
      'Les pronoms sujets (yo, tú…) sont souvent omis : le verbe suffit. « Vivo en Dakar. »',
    ], vocab: [
      ['buenos días', 'bouénoss diass', 'bonjour (matin)'], ['buenas tardes', 'bouénass tardéss', 'bonjour (après-midi)'], ['buenas noches', 'bouénass notchéss', 'bonsoir, bonne nuit'],
      ['¿qué tal?', 'ké tal', 'ça va ?'], ['bien', 'bienn', 'bien'], ['me llamo', 'mé yamo', 'je m’appelle'], ['soy', 'soï', 'je suis'],
      ['vivo en', 'bibo ènn', 'j’habite à'], ['trabajo en', 'trabakho ènn', 'je travaille dans'], ['amiga', 'amiga', 'amie'], ['encantada', 'ènncanntada', 'enchantée'], ['hasta luego', 'asta louégo', 'à plus tard'],
    ], writing: ['Écris ta présentation : nom, pays, ville, travail.', 'Attention : « Me llamo » s’écrit avec deux l.'],
    phrases: [['Me llamo Aida.', 'mé yamo aïda', 'Je m’appelle Aida.'], ['Soy de Senegal.', 'soï dé sénégal', 'Je viens du Sénégal.'], ['Vivo en Dakar.', 'bibo ènn dakar', 'J’habite à Dakar.'], ['¿Y tú?', 'i tou', 'Et toi ?'], ['Mucho gusto.', 'moutcho gousto', 'Enchantée.']] },

    { lesson: [
      '1 à 10 : uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez.',
      '11 à 15 : once, doce, trece, catorce, quince ; puis dieciséis, diecisiete… 20 veinte, 21 veintiuno.',
      'Dizaines : treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa, cien. Après 30 on relie avec y : treinta y dos.',
      'L’heure : « Es la una » (1 h), « Son las tres » (3 h). Et quart : y cuarto ; et demie : y media ; moins le quart : menos cuarto.',
      'Le prix : « ¿Cuánto cuesta? » (un objet), « ¿Cuánto cuestan? » (plusieurs).',
    ], vocab: [
      ['uno, dos, tres', 'ouno, doss, tréss', '1, 2, 3'], ['cuatro, cinco', 'kouatro, ssinnco', '4, 5'], ['seis, siete', 'séïss, ssiété', '6, 7'],
      ['ocho, nueve, diez', 'otcho, nouébé, diess', '8, 9, 10'], ['veinte', 'béïnnté', '20'], ['cien', 'ssienn', '100'], ['la hora', 'la ora', 'l’heure'],
      ['el precio', 'él prèssio', 'le prix'], ['barato', 'barato', 'pas cher'], ['caro', 'karo', 'cher'], ['el euro', 'él éouro', 'l’euro'], ['mediodía', 'médiodia', 'midi'],
    ], writing: ['Écris les nombres de 1 à 20 en lettres.', 'Écris trois heures de ta journée : « Son las siete y media. »'],
    phrases: [['¿Qué hora es?', 'ké ora èss', 'Quelle heure est-il ?'], ['Son las diez.', 'sonn lass diess', 'Il est dix heures.'], ['¿Cuánto cuesta?', 'kouannto kouèsta', 'Combien ça coûte ?'], ['Cuesta veinte euros.', 'kouèsta béïnnté éouross', 'Ça coûte vingt euros.'], ['Es muy caro.', 'èss moui karo', 'C’est très cher.']] },

    { lesson: [
      'Possessifs : mi (mon/ma), tu (ton/ta), su (son/sa, votre) ; au pluriel mis, tus, sus. « Mis padres. »',
      'Tener (avoir) : tengo, tienes, tiene, tenemos, tenéis, tienen. « Tengo dos hermanos. »',
      'Décrire avec ser : « Mi madre es alta. » L’adjectif se place après le nom et s’accorde.',
      'Ser pour ce qui définit (grande, drôle), estar pour un état passager (fatiguée, contente).',
      'Los padres = les parents ; los hermanos = frères et sœurs (masculin pluriel pour un groupe mixte).',
    ], vocab: [
      ['la madre', 'la madré', 'la mère'], ['el padre', 'él padré', 'le père'], ['la hermana', 'la èrmana', 'la sœur'], ['el hermano', 'él èrmano', 'le frère'],
      ['la hija', 'la ikha', 'la fille'], ['el hijo', 'él ikho', 'le fils'], ['la abuela', 'la abouéla', 'la grand-mère'], ['el tío / la tía', 'él tio / la tia', 'l’oncle / la tante'],
      ['el marido', 'él marido', 'le mari'], ['alta / baja', 'alta / bakha', 'grande / petite'], ['simpática', 'simmpatica', 'sympathique'], ['divertida', 'dibèrtida', 'drôle'],
    ], writing: ['Dessine ton arbre familial et écris le nom espagnol de chaque lien.'],
    phrases: [['Esta es mi hermana.', 'èsta èss mi èrmana', 'Voici ma sœur.'], ['Tengo dos hermanos.', 'ténngo doss èrmanoss', 'J’ai deux frères et sœurs.'], ['Mi madre es muy simpática.', 'mi madré èss moui simmpatica', 'Ma mère est très sympathique.'], ['¿Tienes hijos?', 'tiénéss ikhoss', 'As-tu des enfants ?']] },

    { lesson: [
      'Trois groupes de verbes : -ar, -er, -ir. Présent de hablar : hablo, hablas, habla, hablamos, habláis, hablan.',
      'Comer : como, comes, come, comemos, coméis, comen. Vivir : vivo, vives, vive, vivimos, vivís, viven.',
      'Verbes réfléchis : despertarse (se réveiller) → me despierto ; ducharse → me ducho.',
      'Irréguliers à connaître : ir (voy, vas, va), hacer (hago), tener (tengo), salir (salgo).',
      'Mots du temps : primero (d’abord), luego (ensuite), después (après), por la mañana (le matin), por la noche (le soir).',
    ], vocab: [
      ['despertarse', 'déspèrtarsé', 'se réveiller'], ['desayunar', 'déssayounar', 'prendre le petit-déjeuner'], ['trabajar', 'trabakhar', 'travailler'], ['comer', 'komèr', 'manger, déjeuner'],
      ['beber', 'bébèr', 'boire'], ['ir', 'ir', 'aller'], ['volver', 'bolbèr', 'rentrer'], ['cocinar', 'kossinar', 'cuisiner'],
      ['leer', 'léèr', 'lire'], ['dormir', 'dormir', 'dormir'], ['rezar', 'réssar', 'prier'], ['siempre', 'siemmpré', 'toujours'],
    ], writing: ['Écris ta routine du matin en 6 phrases au présent.', 'Conjugue hablar, comer et vivir en entier.'],
    phrases: [['Me despierto a las siete.', 'mé déspièrto a lass siété', 'Je me réveille à sept heures.'], ['Voy al trabajo.', 'boï al trabakho', 'Je vais au travail.'], ['Como a las dos.', 'komo a lass doss', 'Je déjeune à deux heures.'], ['Por la noche leo un poco.', 'por la notché léo oun poco', 'Le soir je lis un peu.']] },

    { lesson: [
      'Pour demander poliment : « Quisiera… » (je voudrais) ou « ¿Me pone…? » (vous me mettez…).',
      'Articles : el / la (le, la), los / las (les), un / una (un, une).',
      'Quantités : un kilo de, medio kilo de, una botella de, un poco de.',
      'Au restaurant : la carta (le menu), el plato del día (plat du jour), la cuenta (l’addition).',
      'Pour une préférence : « Prefiero… », « Sin azúcar » (sans sucre), « Con hielo » (avec glaçons).',
    ], vocab: [
      ['el pollo', 'él poyo', 'le poulet'], ['el pescado', 'él péscado', 'le poisson'], ['el arroz', 'él arross', 'le riz'], ['la verdura', 'la bèrdoura', 'le légume'],
      ['la fruta', 'la frouta', 'le fruit'], ['el pan', 'él pann', 'le pain'], ['el queso', 'él késso', 'le fromage'], ['el zumo', 'él ssoumo', 'le jus'],
      ['el café', 'él kafé', 'le café'], ['la carta', 'la karta', 'le menu'], ['la cuenta', 'la kouènta', 'l’addition'], ['rico', 'rico', 'bon (délicieux)'],
    ], writing: ['Écris ta liste de courses de la semaine en espagnol.'],
    phrases: [['Quisiera un café, por favor.', 'kissiéra oun kafé por fabor', 'Je voudrais un café, s’il vous plaît.'], ['¿Qué me recomienda?', 'ké mé récomiennda', 'Que me conseillez-vous ?'], ['Un kilo de tomates, por favor.', 'oun kilo dé tomatéss por fabor', 'Un kilo de tomates, s’il vous plaît.'], ['La cuenta, por favor.', 'la kouènta por fabor', 'L’addition, s’il vous plaît.'], ['¡Está muy rico!', 'èsta moui rico', 'C’est délicieux !']] },

    { lesson: [
      'Demander où se trouve un lieu : « ¿Dónde está…? ». Demander s’il y en a un : « ¿Hay un/una … por aquí? ».',
      'Estar sert à situer : el hotel está cerca (l’hôtel est près).',
      'Directions : a la derecha (à droite), a la izquierda (à gauche), todo recto (tout droit), gire (tournez).',
      'Prépositions de lieu : al lado de (à côté de), enfrente de (en face de), entre, detrás de (derrière).',
      'Transports : en coche, en autobús, en metro, en taxi, a pie (à pied).',
    ], vocab: [
      ['la calle', 'la kayé', 'la rue'], ['la estación', 'la èstassionn', 'la gare'], ['el aeropuerto', 'él aéropouèrto', 'l’aéroport'], ['la playa', 'la playa', 'la plage'],
      ['la farmacia', 'la farmassia', 'la pharmacie'], ['el banco', 'él bannco', 'la banque'], ['cerca', 'ssèrca', 'près'], ['lejos', 'lékhoss', 'loin'],
      ['a la derecha', 'a la dérétcha', 'à droite'], ['a la izquierda', 'a la issquièrda', 'à gauche'], ['todo recto', 'todo rècto', 'tout droit'], ['el billete', 'él biyété', 'le billet'],
    ], writing: ['Écris le trajet de chez toi à un lieu que tu aimes, en 5 étapes.'],
    phrases: [['¿Dónde está la estación?', 'donndé èsta la èstassionn', 'Où est la gare ?'], ['Gire a la derecha.', 'khiré a la dérétcha', 'Tournez à droite.'], ['Está a cinco minutos.', 'èsta a ssinnco minoutoss', 'C’est à cinq minutes.'], ['¿Está lejos?', 'èsta lékhoss', 'C’est loin ?'], ['Un billete para Madrid, por favor.', 'oun biyété para madrid por fabor', 'Un billet pour Madrid, s’il vous plaît.']] },

    { lesson: [
      'Le passé simple espagnol (pretérito indefinido) raconte une action finie : ayer, el fin de semana, el año pasado.',
      'Verbes en -ar : hablé, hablaste, habló, hablamos, hablasteis, hablaron.',
      'Verbes en -er / -ir : comí, comiste, comió, comimos, comisteis, comieron.',
      'Irréguliers fréquents : ir et ser → fui, fuiste, fue ; hacer → hice, hizo ; tener → tuve ; estar → estuve.',
      'Pour décrire le décor ou l’habitude, on utilise l’imparfait : era (c’était), hacía calor (il faisait chaud).',
    ], vocab: [
      ['ayer', 'ayèr', 'hier'], ['anoche', 'anotché', 'hier soir'], ['el fin de semana', 'él finn dé sémana', 'le week-end'], ['la semana pasada', 'la sémana passada', 'la semaine dernière'],
      ['fui', 'foui', 'je suis allée / j’ai été'], ['hice', 'issé', 'j’ai fait'], ['comí', 'komi', 'j’ai mangé'], ['visité', 'bissité', 'j’ai visité'],
      ['vi', 'bi', 'j’ai vu'], ['me gustó', 'mé goustó', 'ça m’a plu'], ['luego', 'louégo', 'ensuite'], ['por fin', 'por finn', 'enfin'],
    ], writing: ['Écris 5 phrases sur ton dernier week-end avec ayer, luego, después.'],
    phrases: [['Ayer fui al mercado.', 'ayèr foui al mèrcado', 'Hier je suis allée au marché.'], ['Comí con mi familia.', 'komi konn mi familia', 'J’ai mangé avec ma famille.'], ['Fue un día genial.', 'foué oun dia khénial', 'C’était une super journée.'], ['¿Qué hiciste el fin de semana?', 'ké issisté él finn dé sémana', 'Qu’as-tu fait ce week-end ?']] },

    { lesson: [
      'Futur proche : ir a + infinitif. « Voy a viajar. » (je vais voyager).',
      'Envie : quiero (je veux), quisiera / me gustaría (je voudrais, j’aimerais) + infinitif.',
      'Espoir : espero + infinitif (« Espero aprender »).',
      'Futur simple, pour un projet plus lointain : viajaré, aprenderé, viviré (terminaisons -é, -ás, -á, -emos, -éis, -án ajoutées à l’infinitif).',
      'Repères : mañana (demain), el año que viene (l’année prochaine), algún día (un jour), pronto (bientôt).',
    ], vocab: [
      ['el proyecto', 'él prokhècto', 'le projet'], ['el sueño', 'él souégno', 'le rêve'], ['viajar', 'biakhar', 'voyager'], ['aprender', 'aprènndèr', 'apprendre'],
      ['ahorrar', 'aorar', 'économiser'], ['mudarse', 'moudarsé', 'déménager'], ['empezar', 'émmpéssar', 'commencer'], ['terminar', 'tèrminar', 'finir'],
      ['mañana', 'magnana', 'demain'], ['pronto', 'pronnto', 'bientôt'], ['el año que viene', 'él agno ké biéné', 'l’année prochaine'], ['algún día', 'algoun dia', 'un jour'],
    ], writing: ['Écris tes 3 projets de l’année avec voy a, quiero et me gustaría.'],
    phrases: [['Voy a viajar a México.', 'boï a biakhar a mékhico', 'Je vais voyager au Mexique.'], ['Me gustaría aprender a pintar.', 'mé goustaria aprènndèr a pinntar', 'J’aimerais apprendre à peindre.'], ['El año que viene quiero ahorrar más.', 'él agno ké biéné kiéro aorar màss', 'L’an prochain je veux économiser plus.'], ['¿Cuáles son tus planes?', 'koualéss sonn touss planéss', 'Quels sont tes projets ?']] },

    { lesson: [
      'Relancer une conversation : ¿Y tú? (et toi ?), ¿De verdad? (vraiment ?), ¡Qué bien! (super !).',
      'Gagner du temps : pues… (eh bien…), a ver… (voyons…), es que… (c’est que…).',
      'Demander de l’aide : ¿Cómo se dice…? (comment dit-on… ?), ¿Qué significa…? (que veut dire… ?), más despacio (plus lentement).',
      'Donner son avis : creo que (je crois que), para mí (pour moi), estoy de acuerdo (je suis d’accord).',
      'Réutilise tout : présentation, famille, journée, week-end passé, projets.',
    ], vocab: [
      ['la pregunta', 'la prégounta', 'la question'], ['la respuesta', 'la rèspouèsta', 'la réponse'], ['creo que', 'kréo ké', 'je crois que'], ['de acuerdo', 'dé akouèrdo', 'd’accord'],
      ['quizás', 'kissass', 'peut-être'], ['también', 'tammbiénn', 'aussi'], ['tampoco', 'tammpoco', 'non plus'], ['claro', 'klaro', 'bien sûr'],
      ['más despacio', 'màss déspassio', 'plus lentement'], ['¿cómo se dice?', 'komo sé dissé', 'comment dit-on ?'], ['me encanta', 'mé ènncannta', 'j’adore'], ['nos vemos', 'noss bémoss', 'à bientôt'],
    ], writing: ['Prépare par écrit tes 10 questions avant la conversation.'],
    phrases: [['¿A qué te dedicas?', 'a ké té dédicass', 'Que fais-tu dans la vie ?'], ['¿Cómo se dice « joie » en español?', 'komo sé dissé … ènn èspagnol', 'Comment dit-on « joie » en espagnol ?'], ['Más despacio, por favor.', 'màss déspassio por fabor', 'Plus lentement, s’il te plaît.'], ['Estoy de acuerdo.', 'èstoï dé akouèrdo', 'Je suis d’accord.'], ['¡Nos vemos pronto!', 'noss bémoss pronnto', 'À bientôt !']] },
  ],
};
