import type { LangCourse } from './types';

export const COURSE: LangCourse = {
  script: { title: 'L’alphabet italien', points: [
    '21 lettres : j, k, w, x, y n’existent que dans les mots étrangers.',
    'On prononce toutes les lettres, sauf le h, qui sert à durcir c et g (chi = « ki », ghi = « gui »).',
    'Les consonnes doubles se tiennent plus longtemps : pala / palla, nono / nonno.',
    'L’accent écrit n’apparaît qu’en fin de mot : città, caffè, perché.',
  ], table: [
    ['ce, ci', '« tché », « tchi »', 'cena, ciao'],
    ['che, chi', '« ké », « ki »', 'che, chiesa'],
    ['ge, gi', '« djé », « dji »', 'gelato, giorno'],
    ['ghe, ghi', '« gué », « gui »', 'spaghetti'],
    ['gli', '« lli » mouillé', 'figlia'],
    ['gn', '« gn »', 'bagno'],
    ['sce, sci', '« ché », « chi »', 'pesce, sci'],
    ['z', '« dz » ou « ts »', 'zero, pizza'],
    ['u', '« ou »', 'luna'],
    ['e', '« é » ou « è »', 'bene'],
  ] },
  lessons: [
    { lesson: [
      'Sept voyelles à l’oral (e et o ouverts ou fermés), toujours prononcées clairement, même en fin de mot.',
      'Les doubles consonnes changent le sens : « nonno » (grand-père) / « nono » (neuvième).',
      'L’accent tonique tombe souvent sur l’avant-dernière syllabe : amIca, ragAzza.',
      'L’italien chante : laisse la voix monter et descendre.',
    ], vocab: [
      ['ciao', 'tchao', 'salut, au revoir'], ['sì', 'si', 'oui'], ['no', 'no', 'non'], ['grazie', 'gratsié', 'merci'],
      ['per favore', 'pèr favoré', 's’il te plaît'], ['scusi', 'skouzi', 'pardon'], ['acqua', 'akoua', 'eau'], ['casa', 'kaza', 'maison'],
      ['donna', 'donna', 'femme'], ['uomo', 'ouomo', 'homme'], ['bambino', 'bammbino', 'enfant'], ['città', 'tchitta', 'ville'],
    ], writing: ['Recopie les mots avec ci, ce, chi, gli en lisant la règle du tableau.'],
    phrases: [['Ciao!', 'tchao', 'Salut !'], ['Grazie mille.', 'gratsié millé', 'Merci beaucoup.'], ['Prego.', 'prégo', 'De rien.'], ['Non capisco.', 'nonn kapisko', 'Je ne comprends pas.'], ['Può ripetere?', 'pouo ripétéré', 'Pouvez-vous répéter ?']] },

    { lesson: [
      '« Tu » entre proches, « Lei » (avec majuscule) pour vouvoyer, conjugué comme « elle ».',
      'Essere (être) : sono, sei, è, siamo, siete, sono.',
      'Chiamarsi : mi chiamo, ti chiami, si chiama.',
      'Adjectifs : -o masculin, -a féminin, -e pour les deux : senegalese.',
      'Abitare : abito a Dakar (j’habite à Dakar).',
    ], vocab: [
      ['buongiorno', 'bouonnjorno', 'bonjour'], ['buonasera', 'bouonasséra', 'bonsoir'], ['come stai?', 'komé staï', 'comment vas-tu ?'], ['bene', 'béné', 'bien'],
      ['mi chiamo', 'mi kiamo', 'je m’appelle'], ['sono', 'sono', 'je suis'], ['abito a', 'abito a', 'j’habite à'], ['lavoro in', 'lavoro inn', 'je travaille dans'],
      ['amica', 'amika', 'amie'], ['piacere', 'piatchéré', 'enchantée'], ['a presto', 'a prèsto', 'à bientôt'], ['arrivederci', 'arrivédèrtchi', 'au revoir'],
    ], writing: ['Écris ta présentation en 4 phrases.'],
    phrases: [['Mi chiamo Aida.', 'mi kiamo aïda', 'Je m’appelle Aida.'], ['Vengo dal Senegal.', 'vènngo dal sénégal', 'Je viens du Sénégal.'], ['Abito a Dakar.', 'abito a dakar', 'J’habite à Dakar.'], ['E tu?', 'é tou', 'Et toi ?'], ['Piacere.', 'piatchéré', 'Enchantée.']] },

    { lesson: [
      '1 à 10 : uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci.',
      '11 à 20 : undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti.',
      'Dizaines : trenta, quaranta, cinquanta, sessanta, settanta, ottanta, novanta, cento. 21 = ventuno, 28 = ventotto.',
      'L’heure : « È l’una », « Sono le tre ». E un quarto, e mezza, meno un quarto.',
      'Prix : « Quanto costa? » / « Quanto costano? »',
    ], vocab: [
      ['uno, due, tre', 'ouno, doué, tré', '1, 2, 3'], ['quattro, cinque', 'kouattro, tchinnkoué', '4, 5'], ['sei, sette', 'sèï, sètté', '6, 7'], ['otto, nove, dieci', 'otto, nové, diètchi', '8, 9, 10'],
      ['venti', 'vènnti', '20'], ['cento', 'tchènnto', '100'], ['l’ora', 'lora', 'l’heure'], ['il prezzo', 'il prètso', 'le prix'],
      ['economico', 'ékonomiko', 'pas cher'], ['caro', 'karo', 'cher'], ['mezzogiorno', 'mèdzodjorno', 'midi'], ['oggi', 'odji', 'aujourd’hui'],
    ], writing: ['Écris les nombres de 1 à 20 en lettres.'],
    phrases: [['Che ore sono?', 'ké oré sono', 'Quelle heure est-il ?'], ['Sono le dieci.', 'sono lé diètchi', 'Il est dix heures.'], ['Quanto costa?', 'kouannto kosta', 'Combien ça coûte ?'], ['È troppo caro.', 'è troppo karo', 'C’est trop cher.']] },

    { lesson: [
      'Possessifs avec article : la mia casa ; mais pas d’article pour un membre de la famille au singulier : mia madre, mio padre.',
      'Avere (avoir) : ho, hai, ha, abbiamo, avete, hanno (le h est muet).',
      'Décrire : « Mia sorella è alta e simpatica. »',
      'Stare pour la santé : « Sto bene. »',
    ], vocab: [
      ['la madre', 'la madré', 'la mère'], ['il padre', 'il padré', 'le père'], ['la sorella', 'la sorèlla', 'la sœur'], ['il fratello', 'il fratèllo', 'le frère'],
      ['la figlia', 'la filya', 'la fille'], ['il figlio', 'il filyo', 'le fils'], ['la nonna', 'la nonna', 'la grand-mère'], ['il marito', 'il marito', 'le mari'],
      ['la zia', 'la tsia', 'la tante'], ['alta', 'alta', 'grande'], ['simpatica', 'simmpatika', 'sympathique'], ['divertente', 'divèrtènnté', 'drôle'],
    ], writing: ['Écris ton arbre familial en italien.'],
    phrases: [['Questa è mia sorella.', 'kouèsta è mia sorèlla', 'Voici ma sœur.'], ['Ho due fratelli.', 'o doué fratèlli', 'J’ai deux frères.'], ['Mia madre è molto simpatica.', 'mia madré è molto simmpatika', 'Ma mère est très sympathique.']] },

    { lesson: [
      'Trois groupes : -are, -ere, -ire. Parlare : parlo, parli, parla, parliamo, parlate, parlano.',
      'Prendere : prendo, prendi, prende… Dormire : dormo, dormi, dorme…',
      'Irréguliers : andare (vado, vai, va), fare (faccio, fai, fa), essere, avere.',
      'Réfléchis : svegliarsi → mi sveglio ; alzarsi → mi alzo.',
    ], vocab: [
      ['svegliarsi', 'zvélyarsi', 'se réveiller'], ['fare colazione', 'faré kolatsioné', 'prendre le petit-déjeuner'], ['lavorare', 'lavoraré', 'travailler'], ['pranzare', 'prandzaré', 'déjeuner'],
      ['cenare', 'tchénaré', 'dîner'], ['bere', 'béré', 'boire'], ['andare', 'anndaré', 'aller'], ['cucinare', 'koutchinaré', 'cuisiner'],
      ['leggere', 'lèddjéré', 'lire'], ['dormire', 'dormiré', 'dormir'], ['pregare', 'prégaré', 'prier'], ['sempre', 'sèmmpré', 'toujours'],
    ], writing: ['Écris ta routine du matin en 6 phrases.'],
    phrases: [['Mi sveglio alle sette.', 'mi zvèlyo allé sètté', 'Je me réveille à sept heures.'], ['Vado al lavoro.', 'vado al lavoro', 'Je vais au travail.'], ['La sera leggo un po’.', 'la séra lèggo oun po', 'Le soir je lis un peu.']] },

    { lesson: [
      'Demander : « Vorrei… » (je voudrais), « Mi porta…? » (vous m’apportez… ?).',
      'Articles : il, lo, la, l’ / i, gli, le ; un, uno, una.',
      'Au restaurant : il menù, il piatto del giorno, il conto.',
      'Quantités : un chilo di, mezzo chilo, una bottiglia di, un po’ di.',
    ], vocab: [
      ['il pollo', 'il pollo', 'le poulet'], ['il pesce', 'il péché', 'le poisson'], ['il riso', 'il rizo', 'le riz'], ['la verdura', 'la vèrdoura', 'les légumes'],
      ['la frutta', 'la froutta', 'les fruits'], ['il pane', 'il pané', 'le pain'], ['il formaggio', 'il formaddjo', 'le fromage'], ['il succo', 'il soukko', 'le jus'],
      ['il caffè', 'il kaffè', 'le café'], ['il conto', 'il konnto', 'l’addition'], ['buonissimo', 'bouonissimo', 'délicieux'], ['senza zucchero', 'sènntsa tsoukkéro', 'sans sucre'],
    ], writing: ['Écris ta liste de courses en italien.'],
    phrases: [['Vorrei un caffè, per favore.', 'vorrèï oun kaffè pèr favoré', 'Je voudrais un café, s’il vous plaît.'], ['Il conto, per favore.', 'il konnto pèr favoré', 'L’addition, s’il vous plaît.'], ['È buonissimo!', 'è bouonissimo', 'C’est délicieux !']] },

    { lesson: [
      'Où est… ? « Dov’è…? » — « C’è un/una … qui vicino? » (Y a-t-il un… près d’ici ?).',
      'Directions : a destra, a sinistra, sempre dritto, giri (tournez).',
      'Lieu : vicino (près), lontano (loin), accanto a (à côté de), di fronte a (en face de).',
      'Transports : in macchina, in autobus, in treno, a piedi.',
    ], vocab: [
      ['la strada', 'la strada', 'la rue'], ['la stazione', 'la statsioné', 'la gare'], ['l’aeroporto', 'laéroporto', 'l’aéroport'], ['la spiaggia', 'la spiaddja', 'la plage'],
      ['la farmacia', 'la farmatchia', 'la pharmacie'], ['vicino', 'vitchino', 'près'], ['lontano', 'lonntano', 'loin'], ['a destra', 'a dèstra', 'à droite'],
      ['a sinistra', 'a sinistra', 'à gauche'], ['dritto', 'dritto', 'tout droit'], ['il biglietto', 'il bilyétto', 'le billet'], ['il treno', 'il trèno', 'le train'],
    ], writing: ['Écris ton trajet vers un lieu que tu aimes.'],
    phrases: [['Dov’è la stazione?', 'dovè la statsioné', 'Où est la gare ?'], ['Giri a destra.', 'djiri a dèstra', 'Tournez à droite.'], ['È lontano?', 'è lonntano', 'C’est loin ?']] },

    { lesson: [
      'Le passé composé (passato prossimo) : avere ou essere + participe. « Ho mangiato », « Sono andata ».',
      'Participes : -are → -ato, -ere → -uto, -ire → -ito.',
      'Avec essere, le participe s’accorde : sono andata (une femme).',
      'Irréguliers : fatto (fait), visto (vu), preso (pris), stato (été).',
    ], vocab: [
      ['ieri', 'ièri', 'hier'], ['il fine settimana', 'il finé sèttimana', 'le week-end'], ['sono andata', 'sono anndata', 'je suis allée'], ['ho fatto', 'o fatto', 'j’ai fait'],
      ['ho mangiato', 'o manndjato', 'j’ai mangé'], ['ho visto', 'o visto', 'j’ai vu'], ['mi è piaciuto', 'mi è piatchouto', 'ça m’a plu'], ['poi', 'poï', 'puis'],
    ], writing: ['Écris 5 phrases sur ton dernier week-end.'],
    phrases: [['Ieri sono andata al mercato.', 'ièri sono anndata al mèrkato', 'Hier je suis allée au marché.'], ['È stata una bella giornata.', 'è stata ouna bèlla djornata', 'C’était une belle journée.'], ['Cosa hai fatto nel fine settimana?', 'koza aï fatto nèl finé sèttimana', 'Qu’as-tu fait ce week-end ?']] },

    { lesson: [
      'Futur simple : viaggerò, imparerò, andrò (terminaisons -ò, -ai, -à, -emo, -ete, -anno).',
      'Envie : voglio (je veux), vorrei / mi piacerebbe (j’aimerais) + infinitif.',
      'Espoir : spero di + infinitif.',
      'Repères : domani, l’anno prossimo, un giorno, presto.',
    ], vocab: [
      ['il progetto', 'il prodjètto', 'le projet'], ['il sogno', 'il sogno', 'le rêve'], ['viaggiare', 'viaddjaré', 'voyager'], ['imparare', 'immpararé', 'apprendre'],
      ['risparmiare', 'rissparmiaré', 'économiser'], ['traslocare', 'trazlokaré', 'déménager'], ['domani', 'domani', 'demain'], ['l’anno prossimo', 'lanno prossimo', 'l’an prochain'],
    ], writing: ['Écris tes 3 projets de l’année.'],
    phrases: [['L’anno prossimo andrò in Italia.', 'lanno prossimo anndro inn italia', 'L’an prochain j’irai en Italie.'], ['Mi piacerebbe imparare a dipingere.', 'mi piatchérèbbé immpararé a dipinndjéré', 'J’aimerais apprendre à peindre.'], ['Quali sono i tuoi progetti?', 'kouali sono i touoï prodjètti', 'Quels sont tes projets ?']] },

    { lesson: [
      'Relancer : E tu? Davvero? (vraiment ?), Che bello! (super !).',
      'Demander de l’aide : Come si dice…? Cosa vuol dire…? Più piano (plus lentement).',
      'Donner son avis : penso che, secondo me (à mon avis), sono d’accordo.',
    ], vocab: [
      ['la domanda', 'la domannda', 'la question'], ['la risposta', 'la rissposta', 'la réponse'], ['secondo me', 'sékonndo mé', 'à mon avis'], ['forse', 'forsé', 'peut-être'],
      ['anche', 'annké', 'aussi'], ['certo', 'tchèrto', 'bien sûr'], ['più piano', 'piou piano', 'plus lentement'], ['adoro', 'adoro', 'j’adore'],
    ], writing: ['Prépare tes 10 questions par écrit.'],
    phrases: [['Che lavoro fai?', 'ké lavoro faï', 'Quel est ton travail ?'], ['Come si dice « joie » in italiano?', 'komé si ditché … inn italiano', 'Comment dit-on « joie » en italien ?'], ['Più piano, per favore.', 'piou piano pèr favoré', 'Plus lentement, s’il te plaît.'], ['A presto!', 'a prèsto', 'À bientôt !']] },
  ],
};
