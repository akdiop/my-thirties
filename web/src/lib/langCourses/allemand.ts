import type { LangCourse } from './types';

export const COURSE: LangCourse = {
  script: { title: 'L’alphabet allemand', points: [
    'Même alphabet que le français, plus ä, ö, ü (les « Umlaut ») et ß (deux s).',
    'Tous les noms communs prennent une majuscule : das Haus, die Frau.',
    'On prononce presque toutes les lettres, y compris le e final : « Danke » = « danké ».',
    'Trois genres : der (masculin), die (féminin), das (neutre). Apprends chaque nom avec son article.',
  ], table: [
    ['ä', '« è »', 'Mädchen'],
    ['ö', '« eu »', 'schön'],
    ['ü', '« u » français', 'Tür'],
    ['ß', '« ss »', 'heißen'],
    ['ei', '« aï »', 'mein, drei'],
    ['ie', '« i » long', 'Liebe, vier'],
    ['eu / äu', '« oï »', 'neu, Häuser'],
    ['u', '« ou »', 'gut'],
    ['ch', 'souffle « kh » ou « ch » doux', 'acht, ich'],
    ['sch', '« ch »', 'Schule'],
    ['w', '« v »', 'Wasser'],
    ['v', '« f »', 'Vater'],
    ['z', '« ts »', 'zehn'],
    ['j', '« y »', 'ja'],
  ] },
  lessons: [
    { lesson: [
      'L’accent tonique est presque toujours sur la première syllabe : DANke, MORgen.',
      'Le h en début de mot se souffle : Hallo, Haus.',
      'Voyelle longue devant une seule consonne ou un h (Bahn), courte devant deux consonnes (Bett).',
      'Le r se prononce dans la gorge, et devient presque « a » en fin de mot : Wasser ≈ « vassa ».',
    ], vocab: [
      ['hallo', 'halo', 'salut'], ['ja', 'ya', 'oui'], ['nein', 'naïn', 'non'], ['danke', 'danké', 'merci'],
      ['bitte', 'bité', 's’il te plaît, de rien'], ['Entschuldigung', 'ènntchouldigoung', 'pardon'], ['das Wasser', 'das vassa', 'l’eau'], ['das Haus', 'das haouss', 'la maison'],
      ['die Frau', 'di fraou', 'la femme'], ['der Mann', 'dèr mann', 'l’homme'], ['das Kind', 'das kinnt', 'l’enfant'], ['die Stadt', 'di chtatt', 'la ville'],
    ], writing: ['Recopie les mots avec leur article et la majuscule du nom.'],
    phrases: [['Hallo!', 'halo', 'Salut !'], ['Danke schön.', 'danké cheunn', 'Merci beaucoup.'], ['Bitte.', 'bité', 'De rien.'], ['Ich verstehe nicht.', 'ich fèrchté-é nicht', 'Je ne comprends pas.'], ['Können Sie das wiederholen?', 'keunènn zi das vidèrholènn', 'Pouvez-vous répéter ?']] },

    { lesson: [
      '« du » entre proches, « Sie » (majuscule) pour vouvoyer, conjugué comme « ils ».',
      'Sein (être) : ich bin, du bist, er/sie ist, wir sind, ihr seid, sie/Sie sind.',
      'Heißen (s’appeler) : ich heiße, du heißt, sie heißt.',
      'Le verbe est toujours en 2e position dans la phrase : « Ich wohne in Dakar. »',
      'Wohnen (habiter), arbeiten (travailler), kommen aus (venir de).',
    ], vocab: [
      ['guten Morgen', 'goutènn morguènn', 'bonjour (matin)'], ['guten Tag', 'goutènn tak', 'bonjour'], ['guten Abend', 'goutènn abènnt', 'bonsoir'], ['wie geht’s?', 'vi guéts', 'comment ça va ?'],
      ['gut', 'gout', 'bien'], ['ich heiße', 'ich haïssé', 'je m’appelle'], ['ich bin', 'ich binn', 'je suis'], ['ich wohne in', 'ich vonné inn', 'j’habite à'],
      ['ich arbeite', 'ich arbaïté', 'je travaille'], ['die Freundin', 'di froïndinn', 'l’amie'], ['freut mich', 'froït mich', 'enchantée'], ['tschüss', 'tchuss', 'salut (au revoir)'],
    ], writing: ['Écris ta présentation en 4 phrases, verbe en 2e position.'],
    phrases: [['Ich heiße Aida.', 'ich haïssé aïda', 'Je m’appelle Aida.'], ['Ich komme aus dem Senegal.', 'ich kommé aouss dèm zénégal', 'Je viens du Sénégal.'], ['Ich wohne in Dakar.', 'ich vonné inn dakar', 'J’habite à Dakar.'], ['Und du?', 'ount dou', 'Et toi ?'], ['Freut mich.', 'froït mich', 'Enchantée.']] },

    { lesson: [
      '1 à 12 : eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf.',
      '13 à 19 : dreizehn, vierzehn… ; 20 zwanzig, 30 dreißig, 40 vierzig… 100 hundert.',
      'Les unités avant les dizaines : 21 = einundzwanzig (« un et vingt »).',
      'L’heure : « Es ist zehn Uhr ». Halb drei = 2 h 30 (« moitié vers trois »).',
      'Prix : « Wie viel kostet das? » — « Das kostet zehn Euro. »',
    ], vocab: [
      ['eins, zwei, drei', 'aïns, tsvaï, draï', '1, 2, 3'], ['vier, fünf', 'fir, funf', '4, 5'], ['sechs, sieben', 'zèks, zibènn', '6, 7'], ['acht, neun, zehn', 'akht, noïn, tsén', '8, 9, 10'],
      ['zwanzig', 'tsvanntsich', '20'], ['hundert', 'houndèrt', '100'], ['die Uhr', 'di our', 'l’heure, la montre'], ['der Preis', 'dèr praïss', 'le prix'],
      ['billig', 'bilich', 'pas cher'], ['teuer', 'toïa', 'cher'], ['der Mittag', 'dèr mittak', 'midi'], ['heute', 'hoïté', 'aujourd’hui'],
    ], writing: ['Écris les nombres de 1 à 25 en lettres (attention à l’ordre unités-dizaines).'],
    phrases: [['Wie spät ist es?', 'vi chpèt ist ès', 'Quelle heure est-il ?'], ['Es ist zehn Uhr.', 'ès ist tsén our', 'Il est dix heures.'], ['Wie viel kostet das?', 'vi fil kostèt das', 'Combien ça coûte ?'], ['Das ist zu teuer.', 'das ist tsou toïa', 'C’est trop cher.']] },

    { lesson: [
      'Possessifs : mein / meine (mon, ma), dein / deine, sein (à lui), ihr (à elle).',
      'Haben (avoir) : ich habe, du hast, er/sie hat, wir haben.',
      'Accusatif après haben : « Ich habe einen Bruder » (der → einen).',
      'Décrire : « Meine Schwester ist groß und lustig. »',
    ], vocab: [
      ['die Mutter', 'di moutta', 'la mère'], ['der Vater', 'dèr fata', 'le père'], ['die Schwester', 'di chvèsta', 'la sœur'], ['der Bruder', 'dèr brouda', 'le frère'],
      ['die Tochter', 'di tokhta', 'la fille'], ['der Sohn', 'dèr zonn', 'le fils'], ['die Oma', 'di oma', 'la mamie'], ['der Ehemann', 'dèr éémann', 'le mari'],
      ['die Tante', 'di tannté', 'la tante'], ['groß', 'gross', 'grand(e)'], ['nett', 'nètt', 'gentil(le)'], ['lustig', 'loustich', 'drôle'],
    ], writing: ['Écris ton arbre familial avec les articles.'],
    phrases: [['Das ist meine Schwester.', 'das ist maïné chvèsta', 'Voici ma sœur.'], ['Ich habe zwei Brüder.', 'ich habé tsvaï bruda', 'J’ai deux frères.'], ['Meine Mutter ist sehr nett.', 'maïné moutta ist zèr nètt', 'Ma mère est très gentille.']] },

    { lesson: [
      'Présent : radical + -e, -st, -t, -en, -t, -en. Machen : ich mache, du machst, sie macht.',
      'Verbes à particule séparable : aufstehen → ich stehe um 7 Uhr auf.',
      'Verbes irréguliers : essen (ich esse, du isst), fahren (du fährst), schlafen (du schläfst).',
      'Repères : morgens (le matin), abends (le soir), dann (ensuite), immer (toujours).',
    ], vocab: [
      ['aufwachen', 'aoufvakhènn', 'se réveiller'], ['frühstücken', 'fruchtukènn', 'prendre le petit-déjeuner'], ['arbeiten', 'arbaïtènn', 'travailler'], ['essen', 'èssènn', 'manger'],
      ['trinken', 'trinnkènn', 'boire'], ['gehen', 'guéènn', 'aller (à pied)'], ['fahren', 'farènn', 'aller (en véhicule)'], ['kochen', 'kokhènn', 'cuisiner'],
      ['lesen', 'lézènn', 'lire'], ['schlafen', 'chlafènn', 'dormir'], ['beten', 'bétènn', 'prier'], ['immer', 'imma', 'toujours'],
    ], writing: ['Écris ta routine du matin en 6 phrases.'],
    phrases: [['Ich wache um sieben Uhr auf.', 'ich vakhé oum zibènn our aouf', 'Je me réveille à sept heures.'], ['Ich gehe zur Arbeit.', 'ich guéé tsour arbaït', 'Je vais au travail.'], ['Abends lese ich ein bisschen.', 'abènts lézé ich aïn bisschènn', 'Le soir je lis un peu.']] },

    { lesson: [
      'Demander : « Ich hätte gern… » (je voudrais), « Ich möchte… ».',
      'Articles indéfinis : ein (masc./neutre), eine (fém.) ; « kein » pour dire « pas de ».',
      'Au restaurant : die Speisekarte (le menu), das Tagesgericht, die Rechnung (l’addition).',
      'Quantités : ein Kilo, ein halbes Kilo, eine Flasche.',
    ], vocab: [
      ['das Hähnchen', 'das hèn-chènn', 'le poulet'], ['der Fisch', 'dèr fich', 'le poisson'], ['der Reis', 'dèr raïss', 'le riz'], ['das Gemüse', 'das guémuzé', 'les légumes'],
      ['das Obst', 'das opst', 'les fruits'], ['das Brot', 'das brot', 'le pain'], ['der Käse', 'dèr kèzé', 'le fromage'], ['der Saft', 'dèr zaft', 'le jus'],
      ['der Kaffee', 'dèr kafé', 'le café'], ['die Rechnung', 'di rèchnoung', 'l’addition'], ['lecker', 'lèka', 'délicieux'], ['ohne Zucker', 'oné tsouka', 'sans sucre'],
    ], writing: ['Écris ta liste de courses avec les articles.'],
    phrases: [['Ich hätte gern einen Kaffee, bitte.', 'ich hèté guèrn aïnènn kafé bité', 'Je voudrais un café, s’il vous plaît.'], ['Die Rechnung, bitte.', 'di rèchnoung bité', 'L’addition, s’il vous plaît.'], ['Das ist lecker!', 'das ist lèka', 'C’est délicieux !']] },

    { lesson: [
      'Où est… ? « Wo ist…? » ; « Gibt es hier ein…? » (Y a-t-il un… ici ?).',
      'Directions : rechts (à droite), links (à gauche), geradeaus (tout droit), biegen Sie … ab (tournez).',
      'Lieu : in der Nähe (près), weit (loin), neben (à côté de), gegenüber (en face).',
      'Transports : mit dem Auto, mit dem Bus, mit dem Zug, zu Fuß.',
    ], vocab: [
      ['die Straße', 'di chtrassé', 'la rue'], ['der Bahnhof', 'dèr bannhof', 'la gare'], ['der Flughafen', 'dèr flouk-hafènn', 'l’aéroport'], ['der Strand', 'dèr chtrannt', 'la plage'],
      ['die Apotheke', 'di apotéké', 'la pharmacie'], ['nah', 'na', 'près'], ['weit', 'vaït', 'loin'], ['rechts', 'rèchts', 'à droite'],
      ['links', 'links', 'à gauche'], ['geradeaus', 'guéradéaouss', 'tout droit'], ['die Fahrkarte', 'di farkarté', 'le billet'], ['der Zug', 'dèr tsouk', 'le train'],
    ], writing: ['Écris ton trajet vers un lieu que tu aimes.'],
    phrases: [['Wo ist der Bahnhof?', 'vo ist dèr bannhof', 'Où est la gare ?'], ['Biegen Sie rechts ab.', 'bigènn zi rèchts ap', 'Tournez à droite.'], ['Ist es weit?', 'ist ès vaït', 'C’est loin ?']] },

    { lesson: [
      'Le passé à l’oral (Perfekt) : haben ou sein + participe à la fin de la phrase. « Ich habe gegessen. »',
      'Participe : ge- + radical + -t (gemacht) ou -en pour les irréguliers (gegessen, gesehen).',
      'Sein pour les déplacements : « Ich bin gefahren », « Ich bin gegangen ».',
      'Repères : gestern (hier), letztes Wochenende, letzte Woche.',
    ], vocab: [
      ['gestern', 'guèstèrn', 'hier'], ['das Wochenende', 'das vokhènnènndé', 'le week-end'], ['ich bin gegangen', 'ich binn guéganngènn', 'je suis allée'], ['ich habe gemacht', 'ich habé guémakht', 'j’ai fait'],
      ['ich habe gegessen', 'ich habé guéguèssènn', 'j’ai mangé'], ['ich habe gesehen', 'ich habé guézéènn', 'j’ai vu'], ['es hat mir gefallen', 'ès hat mir guéfalènn', 'ça m’a plu'], ['danach', 'danakh', 'ensuite'],
    ], writing: ['Écris 5 phrases sur ton dernier week-end, participe en fin de phrase.'],
    phrases: [['Gestern bin ich auf den Markt gegangen.', 'guèstèrn binn ich aouf dénn markt guéganngènn', 'Hier je suis allée au marché.'], ['Es war ein schöner Tag.', 'ès var aïn cheuna tak', 'C’était une belle journée.'], ['Was hast du am Wochenende gemacht?', 'vas hast dou amm vokhènnènndé guémakht', 'Qu’as-tu fait ce week-end ?']] },

    { lesson: [
      'Futur : werden + infinitif en fin de phrase. « Ich werde reisen. » À l’oral, le présent suffit souvent : « Nächstes Jahr reise ich. »',
      'Envie : ich will (je veux), ich möchte / ich würde gern (j’aimerais) + infinitif en fin de phrase.',
      'Espoir : ich hoffe, … zu + infinitif.',
      'Repères : morgen (demain), nächstes Jahr, eines Tages (un jour), bald (bientôt).',
    ], vocab: [
      ['das Projekt', 'das projèkt', 'le projet'], ['der Traum', 'dèr traoum', 'le rêve'], ['reisen', 'raïzènn', 'voyager'], ['lernen', 'lèrnènn', 'apprendre'],
      ['sparen', 'chparènn', 'économiser'], ['umziehen', 'oumtsi-ènn', 'déménager'], ['morgen', 'morguènn', 'demain'], ['nächstes Jahr', 'nèkstès yar', 'l’an prochain'],
    ], writing: ['Écris tes 3 projets de l’année.'],
    phrases: [['Nächstes Jahr reise ich nach Berlin.', 'nèkstès yar raïzé ich nakh bèrlinn', 'L’an prochain je vais à Berlin.'], ['Ich würde gern malen lernen.', 'ich vurdé guèrn malènn lèrnènn', 'J’aimerais apprendre à peindre.'], ['Was sind deine Pläne?', 'vas zint daïné plèné', 'Quels sont tes projets ?']] },

    { lesson: [
      'Relancer : Und du? Wirklich? (vraiment ?), Toll! (super !).',
      'Demander de l’aide : Wie sagt man…? Was bedeutet…? Langsamer, bitte.',
      'Donner son avis : ich finde, ich glaube, meiner Meinung nach, ich bin einverstanden.',
    ], vocab: [
      ['die Frage', 'di fragué', 'la question'], ['die Antwort', 'di anntvort', 'la réponse'], ['ich glaube', 'ich glaoubé', 'je crois'], ['vielleicht', 'filaïcht', 'peut-être'],
      ['auch', 'aoukh', 'aussi'], ['natürlich', 'naturlich', 'bien sûr'], ['langsamer', 'lanngzama', 'plus lentement'], ['ich liebe es', 'ich libé ès', 'j’adore'],
    ], writing: ['Prépare tes 10 questions par écrit.'],
    phrases: [['Was machst du beruflich?', 'vas makhst dou bérouflich', 'Que fais-tu dans la vie ?'], ['Wie sagt man « joie » auf Deutsch?', 'vi zakt mann … aouf doïtch', 'Comment dit-on « joie » en allemand ?'], ['Langsamer, bitte.', 'lanngzama bité', 'Plus lentement, s’il te plaît.'], ['Bis bald!', 'biss bald', 'À bientôt !']] },
  ],
};
