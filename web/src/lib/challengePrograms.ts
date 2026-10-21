/**
 * Programmes jour par jour des défis « suggestions » : pour chaque défi,
 * la méthode à suivre chaque jour (how), un thème précis par jour (topics)
 * et, pour les langues, le parcours d'apprentissage associé (pathId).
 * La clé est le titre du défi.
 */
export type Program = { how: string[]; topics: string[]; tips?: string[]; pathId?: string };

export const PROGRAMS: Record<string, Program> = {
  'Wolof : expressions du quotidien': {
    pathId: 'lang-wolof',
    how: ['Lis l’étape du parcours indiquée ci-dessous et écoute ou prononce les phrases modèles.', 'Choisis 3 expressions du jour et écris-les dans ton carnet avec leur traduction.', 'Dis-les à voix haute 5 fois, puis utilise-en une avec un proche ou dans une note vocale.', 'Le soir, relis les expressions de la veille sans regarder la traduction.'],
    topics: ['Les salutations : Salaam aleekum, Na nga def ?', 'Répondre : Maa ngi fi rekk, Jàmm rekk', 'Se présenter : Maa ngi tudd…', 'Remercier et prendre congé : Jërëjëf, Ba beneen yoon', 'Révision : rejoue une salutation complète', 'Les nombres de 1 à 5 : benn, ñaar, ñett, ñeent, juróom', 'Les nombres de 6 à 10', 'Demander un prix : Ñaata la ?', 'La famille : yaay, baay, mag, rakk', 'Révision : présente ta famille en 3 phrases', 'Les jours de la semaine', 'Dire ce que tu veux : Dama bëgg…', 'Dire ce que tu ne veux pas : Bëggu ma…', 'Au marché : demander, négocier, remercier', 'Révision : joue une scène de marché', 'Les verbes du quotidien : lekk, naan, dem, nelaw', 'Où vas-tu ? Fan nga jëm ?', 'Directions simples : ci kanam, ci ginnaaw', 'Le temps qu’il fait', 'Révision : raconte ta matinée en 3 phrases', 'Les émotions : contente, fatiguée, pressée', 'Inviter quelqu’un à manger : Kaay lekk', 'Les repas : ceebu jën, mafe, yassa', 'Parler au téléphone : saluer et demander des nouvelles', 'Révision : conversation de 2 minutes', 'Exprimer un souhait : Dama bëggoon…', 'Les expressions de politesse et de respect', 'Proverbes simples et leur sens', 'Prépare 10 questions pour une vraie conversation', 'Bilan : conversation de 5 minutes avec un proche'],
  },
  'Espagnol : premiers échanges': {
    pathId: 'lang-espagnol',
    how: ['Lis l’étape du parcours indiquée ci-dessous et écoute les phrases modèles (bouton haut-parleur).', 'Apprends 8 à 10 mots liés au thème du jour, écris-les à la main.', 'Fais 2 phrases avec ces mots, puis dis-les à voix haute.', 'Termine par 5 minutes d’écoute (podcast « Español con Juan », « Coffee Break Spanish » ou une série sous-titrée en espagnol).'],
    topics: ['Les sons : la jota, le r roulé, la ñ', 'Saluer et se présenter', 'Ser et estar : les deux « être »', 'Les nombres de 0 à 100', 'Donner l’heure et la date', 'La famille et décrire quelqu’un', 'Révision : présente-toi en 1 minute', 'Les verbes en -ar au présent', 'Les verbes en -er et -ir au présent', 'Raconter ta journée type', 'Au restaurant : commander et payer', 'Au marché : quantités et prix', 'Demander son chemin', 'Révision : scène au restaurant à voix haute', 'Gustar : dire ce que tu aimes', 'Le futur proche : voy a…', 'Raconter ton week-end (passé composé)', 'Les questions essentielles : qué, dónde, cuándo, por qué', 'Parler de tes projets', 'Prépare 10 questions pour une conversation', 'Bilan : 10 minutes de conversation ou enregistrement de toi'],
  },
  'Français : écriture précise': {
    how: ['Lis le thème du jour et cherche 1 à 2 mots ou règles liés (dictionnaire Le Robert en ligne, CNRTL ou Projet Voltaire).', 'Écris la définition avec tes mots.', 'Écris 3 phrases naturelles qui l’utilisent.', 'Relis-toi à voix haute : chaque phrase doit être claire du premier coup.'],
    topics: ['Remplacer « faire » par un verbe précis', 'Remplacer « il y a » par un sujet et un verbe', 'Les accords du participe passé avec avoir', 'Synonymes de « dire » selon l’intention', 'Supprimer les mots inutiles d’un paragraphe', 'Les connecteurs logiques : cependant, ainsi, dès lors', 'La ponctuation : virgule, point-virgule, deux-points', 'Les homophones a/à, ou/où, ces/ses', 'Écrire une phrase courte, puis une longue et rythmée', 'Les mots qu’on confond : conjecture/conjoncture, éminent/imminent', 'Le subjonctif après « bien que », « pour que »', 'Réécrire un e-mail professionnel plus clair', 'Choisir un adjectif juste plutôt que trois approximatifs', 'Bilan : réécris un texte écrit le jour 1'],
  },
  'Lire 20 minutes': {
    how: ['Choisis ton livre la veille et pose-le en évidence.', 'Mets un minuteur de 20 minutes, téléphone en mode avion.', 'Lis sans t’arrêter, corne ou souligne ce qui te marque.', 'Note dans l’app une idée ou une phrase reformulée avec tes mots.'],
    topics: ['Choisis un livre qui te donne vraiment envie', 'Lis le matin, avant d’ouvrir tes messages', 'Note le prénom et le but du personnage principal (ou l’idée centrale)', 'Lis dans un lieu nouveau (café, parc, balcon)', 'Note une phrase que tu aimerais retenir', 'Résume ce que tu as lu cette semaine en 3 phrases', 'Lecture libre, sans prise de notes', 'Note un mot nouveau et sa définition', 'Lis 20 minutes juste avant de dormir', 'Note une question que le livre te pose', 'Relis une page qui t’a marquée', 'Lis à voix haute 2 pages', 'Note ce que tu ferais à la place du personnage (ou de l’auteur)', 'Bilan de la deuxième semaine : ce livre te plaît-il ?', 'Commence un nouveau livre si le premier ne te plaît pas', 'Lis pendant un trajet ou une attente', 'Note une idée que tu peux appliquer dans ta vie', 'Lis 25 minutes', 'Recommande le livre à quelqu’un en 2 phrases', 'Note les thèmes du livre', 'Lecture libre', 'Bilan de la troisième semaine', 'Lis un genre différent (essai, poésie, roman graphique)', 'Note une citation pour ton journal', 'Lis dehors', 'Écris 5 lignes sur ce que ce livre t’apprend', 'Lis 30 minutes', 'Prépare ta prochaine lecture (liste de 3 livres)', 'Note ton avis global sur 5', 'Bilan : combien de pages ou de livres en 30 jours ?'],
  },
  'Une idée par jour': {
    how: ['Lis un article de fond ou un chapitre sur le thème du jour (Le Monde, Courrier international, The Conversation, un essai).', 'Souligne la thèse principale.', 'Écris en une phrase ce que tu en retiens, puis en une phrase si tu es d’accord et pourquoi.'],
    topics: ['Le sommeil', 'L’argent et le bonheur', 'L’Afrique de l’Ouest aujourd’hui', 'L’intelligence artificielle au travail', 'Le climat et l’alimentation', 'Les habitudes', 'La confiance en soi', 'La ville de demain', 'L’éducation', 'Les réseaux sociaux', 'La santé des femmes', 'L’économie du Sénégal', 'L’art contemporain', 'La mémoire', 'Le travail à distance', 'La musique et le cerveau', 'L’entrepreneuriat féminin', 'Le voyage responsable', 'La lecture', 'La solitude', 'Bilan : les 3 idées qui t’ont le plus marquée'],
  },
  'Explorer un classique': {
    how: ['Choisis un classique (suggestions : Une si longue lettre de Mariama Bâ, L’Aventure ambiguë de Cheikh Hamidou Kane, L’Étranger de Camus, Les Soleils des indépendances de Kourouma).', 'Lis 10 à 15 pages par jour.', 'Résume le passage en 3 phrases avec tes mots.', 'Note une phrase marquante et ce qu’elle t’évoque.'],
    topics: Array.from({ length: 30 }, (_, i) => i === 0 ? 'Lis la quatrième de couverture et la présentation de l’auteur' : i === 29 ? 'Bilan : écris une critique de 10 lignes' : i % 7 === 6 ? 'Révision : résume tout ce que tu as lu cette semaine' : `Pages du jour (${i * 12 - 11}–${i * 12})`),
  },
  'Histoire du monde': {
    how: ['Lis sur l’événement du jour une source fiable (Encyclopædia Universalis, Larousse, Wikipédia avec ses sources, une vidéo de « Nota Bene » ou « Histoire Brève »).', 'Note la date, le lieu et les acteurs principaux.', 'Écris le contexte en 2 phrases et 2 conséquences.', 'Relie-le à un autre événement déjà vu.'],
    topics: ['L’Égypte des pharaons', 'Les cités grecques et la démocratie athénienne', 'L’Empire romain', 'L’Empire du Ghana', 'L’Empire du Mali et Mansa Moussa', 'L’âge d’or de Bagdad', 'Les croisades', 'L’Empire songhaï et Tombouctou', 'La Renaissance italienne', '1492 et les grandes découvertes', 'La traite transatlantique et l’île de Gorée', 'La Révolution française (1789)', 'La révolution haïtienne (1791-1804)', 'La révolution industrielle', 'L’abolition de l’esclavage (1848 en France)', 'La conférence de Berlin (1884-1885)', 'La Première Guerre mondiale et les tirailleurs sénégalais', 'La crise de 1929', 'La Seconde Guerre mondiale', 'Le massacre de Thiaroye (1944)', 'La création de l’ONU', 'Les indépendances africaines (1960)', 'La guerre froide', 'Le mouvement des droits civiques', 'Mai 68', 'La chute du mur de Berlin (1989)', 'La fin de l’apartheid (1991-1994)', 'Internet et le web', 'Le 11 septembre 2001', 'Bilan : frise des 30 événements'],
  },
  'Géographie et pays': {
    how: ['Découvre le pays du jour sur une carte (Google Earth ou un atlas).', 'Note la capitale, les langues, la monnaie et la population.', 'Trouve un plat, une musique et un fait culturel.', 'Repère-le sur une carte vierge de mémoire le lendemain.'],
    topics: ['Sénégal', 'Mali', 'Côte d’Ivoire', 'Maroc', 'Ghana', 'Nigeria', 'Éthiopie', 'Afrique du Sud', 'Kenya', 'Cap-Vert', 'Brésil', 'Mexique', 'Cuba', 'Canada', 'Portugal', 'Espagne', 'Italie', 'Turquie', 'Japon', 'Inde', 'Bilan : place les 20 pays sur une carte vierge'],
  },
  'Art et musées': {
    how: ['Regarde l’œuvre du jour en haute définition (Google Arts & Culture, site du musée).', 'Observe 3 minutes sans lire : couleurs, composition, émotion.', 'Lis le contexte : artiste, date, mouvement.', 'Note ton impression en 3 phrases.'],
    topics: ['La Joconde – Léonard de Vinci', 'La Nuit étoilée – Van Gogh', 'Les Demoiselles d’Avignon – Picasso', 'Le Radeau de la Méduse – Géricault', 'Frida Kahlo – Les Deux Frida', 'Jean-Michel Basquiat – Untitled (Skull)', 'Ousmane Sow – Les Nouba', 'Les masques dogon', 'Le Penseur – Rodin', 'Les Nymphéas – Monet', 'El Anatsui – tapisseries de capsules', 'Yayoi Kusama – Infinity Rooms', 'Le Musée des civilisations noires de Dakar', 'Bilan : ton top 3 et pourquoi'],
  },
  'Femmes qui ont marqué l’histoire': {
    how: ['Lis la biographie de la femme du jour (Larousse, Wikipédia avec sources, podcast « Les Couilles sur la table » ou « Histoires de femmes »).', 'Note ses dates, son pays et sa réalisation principale.', 'Note un obstacle qu’elle a rencontré et comment elle l’a dépassé.', 'Écris ce que son parcours t’inspire.'],
    topics: ['Aline Sitoé Diatta', 'Mariama Bâ', 'Ndatté Yalla Mbodj', 'Wangari Maathai', 'Miriam Makeba', 'Marie Curie', 'Simone Veil', 'Rosa Parks', 'Maya Angelou', 'Toni Morrison', 'Ellen Johnson Sirleaf', 'Yaa Asantewaa', 'Nzinga du Ndongo et Matamba', 'Harriet Tubman', 'Frida Kahlo', 'Joséphine Baker', 'Gisèle Halimi', 'Malala Yousafzai', 'Katherine Johnson', 'Ada Lovelace', 'Hypatie d’Alexandrie', 'Olympe de Gouges', 'Angela Davis', 'Chimamanda Ngozi Adichie', 'Aminata Sow Fall', 'Fatou Diome', 'Michelle Obama', 'Winnie Madikizela-Mandela', 'Ngozi Okonjo-Iweala', 'Bilan : les 3 parcours qui t’ont le plus inspirée'],
  },
  'Économie en 15 minutes': {
    how: ['Lis la définition du concept du jour (Banque de France « ABC de l’économie », Lumni, Alternatives économiques).', 'Explique-le en 2 phrases sans jargon.', 'Trouve un exemple concret dans ta vie ou au Sénégal.'],
    topics: ['L’inflation', 'Le taux d’intérêt', 'Le PIB', 'L’offre et la demande', 'Le franc CFA et l’eco', 'La banque centrale (BCEAO, BCE)', 'Le chômage', 'Les impôts directs et indirects', 'La dette publique', 'La balance commerciale', 'Le microcrédit', 'Les marchés financiers', 'L’épargne et l’investissement', 'Le mobile money (Wave, Orange Money)', 'La mondialisation', 'L’économie informelle', 'Le pouvoir d’achat', 'Les matières premières', 'La croissance verte', 'Les monopoles', 'Bilan : explique 3 concepts à une amie'],
  },
  'Science du quotidien': {
    how: ['Lis la réponse à la question du jour sur une source fiable (Futura Sciences, Science & Vie, « C’est pas sorcier », Lumni).', 'Écris l’explication en 3 phrases simples.', 'Vérifie-la par une petite observation si possible.'],
    topics: ['Pourquoi le ciel est-il bleu ?', 'Pourquoi le pain gonfle-t-il ?', 'Comment fonctionne un micro-ondes ?', 'Pourquoi a-t-on des courbatures ?', 'Comment marche le GPS du téléphone ?', 'Pourquoi l’oignon fait pleurer ?', 'Comment le café réveille-t-il ?', 'Pourquoi la mer est-elle salée ?', 'Comment fonctionne un vaccin ?', 'Pourquoi rêve-t-on ?', 'Comment se forme un arc-en-ciel ?', 'Pourquoi le sucre fond dans l’eau chaude ?', 'Comment fonctionne le Wi-Fi ?', 'Bilan : ta question préférée et pourquoi'],
  },
  'Découvrir Python': {
    how: ['Ouvre un environnement gratuit : Google Colab ou replit.com (rien à installer).', 'Lis la notion du jour (docs.python.org/fr/3/tutorial ou le cours gratuit d’OpenClassrooms).', 'Recopie l’exemple, lance-le, puis modifie-le une fois.', 'Écris en une phrase ce que tu as compris.'],
    topics: ['print() et ton premier programme', 'Les variables', 'Les nombres et les opérations', 'Les chaînes de caractères', 'input() : demander une valeur', 'Les conditions if / else', 'Révision : un mini-quiz', 'Les listes', 'La boucle for', 'La boucle while', 'Les fonctions (def)', 'Les paramètres et return', 'Les dictionnaires', 'Révision : carnet d’adresses', 'Lire un fichier texte', 'Écrire dans un fichier', 'Les erreurs et try/except', 'Les modules (import random, datetime)', 'Mini-projet : jeu du nombre mystère', 'Les listes en compréhension', 'Révision : calculatrice de budget', 'Les classes (introduction)', 'Les méthodes d’une classe', 'Lire un fichier CSV', 'Petits graphiques avec matplotlib', 'Mini-projet : suivi de tes dépenses', 'Les bibliothèques : pandas en 15 minutes', 'Récupérer des données d’internet (requests)', 'Projet final : ton propre petit outil', 'Bilan : ce que tu sais faire maintenant'],
  },
  'Bases de l’intelligence artificielle': {
    how: ['Lis ou regarde une ressource sur la notion du jour (cours gratuit « Elements of AI » en français, vidéos de Science Étonnante ou Underscore_).', 'Note la définition en 2 phrases.', 'Note un usage concret et une limite.'],
    topics: ['Qu’est-ce que l’IA ?', 'Données et apprentissage', 'L’apprentissage supervisé', 'L’apprentissage non supervisé', 'Les réseaux de neurones', 'La reconnaissance d’images', 'Les modèles de langage (ChatGPT, Claude…)', 'Comment écrire une bonne consigne (prompt)', 'Les hallucinations de l’IA', 'Les biais dans les données', 'L’IA générative d’images', 'L’IA et l’emploi', 'L’IA et la santé', 'L’IA et la vie privée', 'L’éthique de l’IA', 'La régulation (AI Act européen)', 'L’IA en Afrique', 'Tester un outil d’IA sur une tâche réelle', 'Comparer deux réponses d’IA', 'L’avenir de l’IA', 'Bilan : ton usage idéal de l’IA'],
  },
  'Culture cybersécurité': {
    how: ['Lis la fiche du jour sur cybermalveillance.gouv.fr ou le site de l’ANSSI.', 'Applique la bonne pratique sur un de tes comptes ou appareils.', 'Coche ce qui est fait.'],
    topics: ['Un gestionnaire de mots de passe', 'Un mot de passe long et unique pour ta messagerie', 'Activer la double authentification sur ta messagerie', 'Double authentification sur tes réseaux sociaux', 'Reconnaître un e-mail d’hameçonnage', 'Reconnaître un SMS frauduleux (faux colis, fausse banque)', 'Mettre à jour ton téléphone', 'Vérifier les autorisations des applications', 'Sauvegarder tes photos', 'Sécuriser ton Wi-Fi', 'Paiement en ligne : les bons réflexes', 'Wave et Orange Money : les arnaques courantes', 'Ce que tu publies en public', 'Bilan : liste de tes comptes sécurisés'],
  },
  'Excel et tableurs': {
    how: ['Ouvre Excel, Google Sheets ou Numbers.', 'Lis le tutoriel de la fonction du jour (support.microsoft.com ou aide Google Sheets).', 'Teste-la sur un petit tableau (ton budget, tes courses).', 'Note quand l’utiliser.'],
    topics: ['Saisir et mettre en forme un tableau', 'SOMME et MOYENNE', 'Références relatives et absolues ($)', 'SI', 'NB.SI et SOMME.SI', 'Trier et filtrer', 'Révision : tableau de dépenses du mois', 'RECHERCHEV / RECHERCHEX', 'Mise en forme conditionnelle', 'Les dates et AUJOURDHUI()', 'Concaténer du texte', 'Créer un graphique', 'Tableau croisé dynamique', 'Révision : budget annuel par catégorie', 'Validation des données (listes déroulantes)', 'Figer les volets et imprimer', 'SIERREUR', 'Fonctions texte : GAUCHE, DROITE, STXT', 'Protéger une feuille', 'Modèle de suivi d’épargne', 'Bilan : ton tableau de bord personnel'],
  },
  'Design et interfaces': {
    how: ['Ouvre l’application ou le site du jour.', 'Observe 5 minutes : hiérarchie, couleurs, lisibilité, boutons.', 'Note une chose réussie et une amélioration.', 'Esquisse ton idée sur papier.'],
    topics: ['Ton application bancaire', 'Wave', 'Instagram', 'Le site de ta compagnie aérienne', 'Une appli de livraison', 'Google Maps', 'Le site d’un musée', 'Ton application de musique', 'Un formulaire administratif en ligne', 'My Thirties (cette app !)', 'Un site de recettes', 'Le menu d’un restaurant', 'Une affiche dans la rue', 'Bilan : tes 5 règles d’une bonne interface'],
  },
  'Méthode de recherche': {
    how: ['Formule une question précise sur le thème du jour.', 'Cherche 2 sources différentes (Google Scholar, Cairn, Persée, presse de qualité).', 'Note l’auteur, la date et la fiabilité de chaque source.', 'Écris une réponse provisoire en 3 phrases.'],
    topics: Array.from({ length: 30 }, (_, i) => ['Choisis ton sujet de recherche pour le mois', 'Formuler une bonne question', 'Chercher avec des mots-clés et des guillemets', 'Google Scholar : trouver un article', 'Lire un résumé (abstract) efficacement', 'Évaluer une source', 'Révision : 3 sources sur ton sujet', 'Cairn et Persée', 'Les bases de données statistiques (INSEE, ANSD, Banque mondiale)', 'Prendre des notes de lecture', 'Citer une source correctement', 'Distinguer fait, opinion et hypothèse', 'Comparer deux sources contradictoires', 'Révision : plan provisoire', 'Interviewer quelqu’un', 'Construire un petit questionnaire', 'Analyser des chiffres simples', 'Faire une carte mentale', 'Écrire une introduction', 'Rédiger une partie', 'Révision : relecture', 'Les limites de ta recherche', 'Faire une bibliographie', 'Résumer ta recherche en 10 lignes', 'Présenter ta recherche en 3 minutes', 'Recueillir un avis extérieur', 'Améliorer selon les retours', 'Mettre en forme', 'Partager ou archiver', 'Bilan de la méthode'][i]),
  },
  'Esprit critique': {
    how: ['Prends une affirmation entendue ou lue sur le thème du jour.', 'Cherche sa source d’origine.', 'Sépare les faits vérifiables des interprétations.', 'Vérifie sur un site de vérification (AFP Factuel, Africa Check, Les Décodeurs).'],
    topics: ['Une publicité', 'Un titre accrocheur', 'Une statistique sur les réseaux', 'Une « astuce santé » virale', 'Un message WhatsApp transféré', 'Une citation attribuée à une célébrité', 'Une photo qui circule', 'Un avis client', 'Une étude « scientifique » dans la presse', 'Un discours politique', 'Un graphique', 'Une rumeur', 'Une promesse commerciale', 'Une vidéo coupée', 'Les biais de confirmation', 'L’argument d’autorité', 'La corrélation n’est pas la causalité', 'Le faux dilemme', 'Une théorie du complot', 'Tes propres croyances', 'Bilan : tes 5 réflexes de vérification'],
  },
  'Prise de notes efficace': {
    how: ['Choisis un contenu de 10 à 15 minutes (podcast, vidéo, article).', 'Applique la méthode du jour.', 'Rédige 5 lignes de synthèse.', 'Relis-les le lendemain sans le contenu d’origine.'],
    topics: ['Méthode Cornell', 'Les abréviations utiles', 'La carte mentale', 'Le résumé en 5 lignes', 'Noter seulement les idées clés', 'Notes à la main vs au clavier', 'Révision : compare 2 méthodes', 'Prendre des notes en réunion', 'Les questions en marge', 'La méthode des 3 couleurs', 'Le schéma', 'Classer tes notes', 'Relire et réviser ses notes', 'Bilan : ta méthode préférée'],
  },
  'Mémorisation douce': {
    how: ['Révise une notion apprise plus tôt (jour 1, 3, 7, 14 : la répétition espacée).', 'Explique-la de mémoire en 3 phrases.', 'Vérifie et corrige.', 'Crée une carte question/réponse (papier ou appli Anki).'],
    topics: ['Choisis ce que tu veux mémoriser ce mois-ci', 'Crée tes 10 premières cartes', 'Révision J+1', 'Le palais de la mémoire', 'Révision J+3', 'Les moyens mnémotechniques', 'Révision J+7', 'Apprendre en enseignant', 'Révision : explique à voix haute', 'Les images mentales', 'Révision J+10', 'Associer à une émotion', 'Le sommeil et la mémoire', 'Révision J+14', 'Les quiz', 'Mélanger les sujets', 'Révision : tout ce qui est en retard', 'Raconter sous forme d’histoire', 'Révision J+21', 'Faire un test blanc', 'Bilan : ce que tu as retenu'],
  },
  'Prise de parole': {
    how: ['Choisis le sujet du jour.', 'Prépare un plan en 3 points sur un papier.', 'Parle 2 minutes en te filmant ou en t’enregistrant.', 'Réécoute et note une chose à améliorer.'],
    topics: ['Te présenter en 1 minute', 'Ton dernier voyage', 'Un livre ou une série que tu aimes', 'Ton métier', 'Un souvenir d’enfance', 'Défendre une idée', 'Révision : refais le jour 1', 'Travailler ta voix : rythme et pauses', 'Ton regard et tes gestes', 'Une histoire drôle', 'Expliquer quelque chose de technique simplement', 'Répondre à une question imprévue', 'Un toast pour un mariage', 'Bilan : compare avec ta vidéo du jour 1'],
  },
  'Journal créatif': {
    how: ['Mets un minuteur de 10 minutes.', 'Écris à la main sur le thème du jour, sans t’arrêter ni te relire.', 'Souligne une phrase que tu aimes.'],
    topics: ['Ton plus vieux souvenir', 'La cuisine de ta grand-mère', 'Une odeur qui te transporte', 'Ce que tu ferais avec une année libre', 'Une lettre à toi à 20 ans', 'Ta ville à l’aube', 'Une dispute que tu regrettes', 'Le meilleur conseil reçu', 'Ce que tu vois par ta fenêtre', 'Une personne croisée une seule fois', 'Ton corps aujourd’hui', 'Un rêve récent', 'Ce qui te met en colère', 'Une chanson et ce qu’elle évoque', 'Le jour où tu as été fière de toi', 'Un objet que tu ne jetteras jamais', 'Ta journée idéale', 'Ce que tu n’as jamais dit', 'Une peur', 'Un lieu où tu te sens chez toi', 'Une lettre à toi à 40 ans', 'La pluie', 'Un repas mémorable', 'Ce que tu as appris cette année', 'Une amitié', 'Le silence', 'Ce que tu veux transmettre', 'Une couleur', 'Écris en commençant par « Je me souviens… »', 'Relis ton journal et écris ce qui a changé'],
  },
  'Une micro-histoire': {
    how: ['Prends l’objet du jour comme point de départ.', 'Écris 5 à 10 lignes avec un personnage, un problème et une fin.', 'Relis et coupe un mot inutile par phrase.'],
    topics: ['Une clé', 'Un téléphone qui sonne la nuit', 'Une valise oubliée', 'Une lettre jamais envoyée', 'Un pagne', 'Une tasse ébréchée', 'Un ticket de bus', 'Une photo déchirée', 'Un parfum', 'Une bague', 'Un parapluie', 'Une carte postale', 'Un vieux cahier', 'Bilan : réécris ta préférée en 15 lignes'],
  },
  'Trouver sa voix': {
    how: ['Prends un paragraphe (le tien ou celui d’un livre).', 'Réécris-le selon la consigne du jour.', 'Compare les deux versions à voix haute.'],
    topics: ['Phrases très courtes', 'Une seule longue phrase', 'Au présent', 'À la deuxième personne (« tu »)', 'Ton ironique', 'Ton tendre', 'Révision : ta version préférée', 'Sans adjectifs', 'Avec 5 sens', 'Point de vue d’un enfant', 'Dialogue uniquement', 'Style journal intime', 'Style lettre', 'Révision : relis tes essais', 'Avec un mot wolof ou d’une autre langue', 'Ton solennel', 'Ton drôle', 'Comme une chanson (rythme)', 'En 50 mots exactement', 'Comme un article de presse', 'Bilan : décris ta voix en 3 mots'],
  },
  'Un regard par jour': {
    how: ['Pendant la journée, cherche un détail lié au thème du jour.', 'Prends une seule photo, réfléchis avant de déclencher.', 'Note en une phrase pourquoi ce détail t’a attirée.'],
    topics: ['Une ombre', 'Du rouge', 'Une texture', 'Une main', 'Un reflet', 'Une ligne droite', 'Révision : ta meilleure photo de la semaine', 'Une courbe', 'La lumière du matin', 'La lumière du soir', 'Un motif qui se répète', 'Le vide', 'Une porte', 'Révision : classe tes photos', 'Du vert', 'Un contraste', 'De haut', 'D’en bas', 'Un détail de nourriture', 'Le mouvement', 'Révision : 3 photos en série', 'Une silhouette', 'Une fenêtre', 'Le flou', 'Un symbole', 'Du bleu', 'Un visage (avec accord)', 'La symétrie', 'Ce que tu aimes chez toi', 'Bilan : ton album de 10 photos'],
  },
  'Composition photographique': {
    how: ['Lis la règle du jour (tutoriel gratuit sur le site de Canon, Nikon ou la chaîne YouTube « Apprendre la photo »).', 'Active la grille de ton appareil photo.', 'Prends 5 photos du même sujet en appliquant la règle.', 'Garde la meilleure et note pourquoi.'],
    topics: ['La règle des tiers', 'Les lignes directrices', 'Le cadrage serré', 'L’espace négatif', 'Le premier plan', 'La symétrie', 'Révision : 3 règles sur un sujet', 'Le cadre dans le cadre', 'La lumière naturelle', 'Le contre-jour', 'La profondeur de champ (mode portrait)', 'Le point de vue', 'Les couleurs complémentaires', 'Bilan : ta série de 5 photos'],
  },
  'Croquis sans pression': {
    how: ['Prends un crayon et du papier, minuteur 10 minutes.', 'Dessine l’objet du jour en regardant surtout l’objet, pas la feuille.', 'Date le croquis et passe à autre chose : pas de gomme.'],
    topics: ['Ta tasse', 'Ta main gauche', 'Une chaussure', 'Une plante', 'Tes clés', 'Une chaise', 'Révision : refais la tasse', 'Un fruit', 'Ton sac', 'Une fenêtre', 'Un visage (photo)', 'Des plis de tissu', 'Une bouteille transparente', 'Révision : refais ta main', 'Un animal (photo)', 'Une rue', 'Un arbre', 'Ton lit', 'Un personnage de dos', 'Ton reflet', 'Bilan : compare jour 1 et jour 21'],
  },
  'Une technique de cuisine': {
    how: ['Regarde une vidéo de la technique du jour (« Chef Simon », « Cuisine AZ », « Hervé Cuisine »).', 'Pratique sur une petite quantité.', 'Note les étapes et ce que tu ferais autrement.'],
    topics: ['Tailler un oignon', 'Cuire un riz parfait', 'La vinaigrette et l’émulsion', 'Saisir une viande ou un poisson', 'Faire un roux et une béchamel', 'Cuire des œufs (mollet, poché, brouillé)', 'Mariner (yassa)', 'Faire un bouillon', 'Pâte brisée', 'Réduire une sauce', 'Cuisson vapeur', 'Rôtir des légumes', 'Faire un caramel', 'Bilan : un repas avec 3 techniques'],
  },
  'Découvrir un artiste': {
    how: ['Écoute, regarde ou lis une œuvre de l’artiste du jour.', 'Lis 5 minutes sur sa vie.', 'Note ce que l’œuvre t’évoque.'],
    topics: ['Youssou N’Dour', 'Ousmane Sembène', 'Fela Kuti', 'Nina Simone', 'Cesária Évora', 'Basquiat', 'Ousmane Sow', 'Angélique Kidjo', 'Omar Pène', 'Frida Kahlo', 'Wally Badarou', 'Chéri Samba', 'Mati Diop', 'Seydou Keïta', 'Malick Sidibé', 'Baaba Maal', 'Aya Nakamura', 'Wizkid', 'Toni Morrison', 'Zanele Muholi', 'Bilan : ton artiste coup de cœur'],
  },
  'Projet personnel en petits pas': {
    how: ['Relis l’objectif de ton projet (écris-le le jour 1).', 'Fais l’étape du jour pendant 15 minutes, minuteur lancé.', 'Note ce qui a avancé et la prochaine micro-étape.'],
    topics: ['Écris ton projet en une phrase', 'Pourquoi ce projet compte pour toi', 'Liste toutes les étapes possibles', 'Choisis les 3 premières', 'Étape 1', 'Étape 1 (suite)', 'Révision : qu’est-ce qui bloque ?', 'Étape 2', 'Étape 2 (suite)', 'Demande un conseil à quelqu’un', 'Étape 3', 'Étape 3 (suite)', 'Montre ton avancée à une proche', 'Révision : ajuste ton plan', 'Étape 4', 'Étape 4 (suite)', 'Une tâche que tu repousses', 'Étape 5', 'Étape 5 (suite)', 'Célèbre une petite victoire', 'Révision : bilan de mi-parcours', 'Étape 6', 'Étape 6 (suite)', 'Simplifie ce qui reste', 'Étape 7', 'Étape 7 (suite)', 'Prépare la suite après le défi', 'Révision finale', 'Mets ton travail en forme', 'Bilan : ce qui a avancé en 30 jours'],
  },
  'Planifier sa semaine': {
    how: ['Le matin, regarde ton agenda.', 'Fais l’action du jour.', 'Le soir, coche ce qui est fait.'],
    topics: ['Dimanche soir : écris tes 3 priorités de la semaine', 'Bloque un créneau pour la priorité n°1', 'Bloque un créneau pour la priorité n°2', 'Bloque un créneau pour la priorité n°3', 'Point de mi-semaine : ce qui avance, ce qui glisse', 'Libère une soirée pour toi', 'Bilan et préparation de la semaine suivante'],
  },
  'Revue du soir': {
    how: ['Le soir, 5 minutes, carnet ou note de l’app.', 'Réponds aux 3 questions : qu’est-ce qui a avancé ? qu’est-ce qui attendra ? quelle priorité demain ?', 'Ajoute la question bonus du jour.'],
    topics: ['Bonus : de quoi es-tu fière ?', 'Bonus : qu’as-tu appris ?', 'Bonus : qu’est-ce qui t’a pris trop de temps ?', 'Bonus : qui t’a fait du bien ?', 'Bonus : qu’aurais-tu pu déléguer ?', 'Bonus : comment est ton énergie ?', 'Bonus : bilan de la semaine', 'Bonus : qu’as-tu évité ?', 'Bonus : un moment de calme ?', 'Bonus : une chose à arrêter', 'Bonus : une chose à commencer', 'Bonus : qu’est-ce qui t’a fait rire ?', 'Bonus : es-tu en avance ou en retard ?', 'Bonus : bilan des 2 semaines'],
  },
  'Une tâche importante': {
    how: ['Le matin, choisis LA tâche importante du jour (celle qui compte vraiment).', 'Lance un minuteur de 15 minutes et ne fais qu’elle.', 'Note ce qui a avancé.'],
    topics: Array.from({ length: 21 }, (_, i) => i % 7 === 6 ? 'Bilan de la semaine : ce qui a vraiment avancé' : ['Choisis la tâche que tu repousses le plus', 'Découpe-la en morceaux de 15 minutes', 'Commence par le morceau le plus facile', 'Enchaîne sur le plus dur', 'Fais-la avant d’ouvrir tes messages', 'Fais 2 × 15 minutes'][i % 7]),
  },
  'Ranger un petit espace': {
    how: ['Minuteur 10 minutes.', 'Vide l’espace du jour entièrement.', 'Garde, donne ou jette chaque objet.', 'Range ce qui reste.'],
    topics: ['Le tiroir de la cuisine', 'Ton sac à main', 'La table de nuit', 'Les produits de beauté', 'Le placard à épices', 'Les chaussures', 'Le bureau', 'Les papiers en attente', 'Le frigo', 'L’armoire à pharmacie', 'Les bijoux', 'Les câbles et chargeurs', 'La voiture ou l’entrée', 'Bilan : l’espace qui te fait le plus de bien'],
  },
  'Désencombrer ses fichiers': {
    how: ['Minuteur 15 minutes.', 'Traite la zone du jour : supprimer, archiver ou ranger.', 'Vérifie avant de supprimer (une sauvegarde suffit).'],
    topics: ['Le bureau de l’ordinateur', 'Les téléchargements', 'Les photos floues du téléphone', 'Les captures d’écran', 'Les applications inutilisées', 'La boîte mail : 100 e-mails', 'Révision : sauvegarde complète', 'Les newsletters (se désabonner)', 'Les groupes WhatsApp', 'Les documents administratifs (un dossier par thème)', 'Les vidéos lourdes', 'Le cloud (iCloud, Google Drive)', 'Les contacts en double', 'Révision : ton espace de stockage libéré', 'Les mots de passe enregistrés', 'Les favoris du navigateur', 'Les notes du téléphone', 'Les fichiers partagés', 'Les abonnements numériques', 'Les albums photos', 'Bilan : ton système de rangement'],
  },
  'Comprendre son budget': {
    how: ['Ouvre Mes finances dans l’app.', 'Observe la catégorie du jour sur le mois.', 'Note une décision : garder, réduire ou supprimer.'],
    topics: ['Note tous tes revenus', 'Le logement', 'Les courses', 'Les restaurants et livraisons', 'Les transports', 'Les abonnements', 'Bilan de la semaine', 'La famille et les envois', 'Les loisirs', 'Les vêtements', 'La beauté', 'Les frais bancaires et mobile money', 'Les cadeaux', 'Bilan : ta plus grosse dépense', 'L’épargne', 'Les imprévus', 'Les dettes et crédits', 'Les dépenses impulsives', 'Fixe un budget par catégorie', 'Fixe un objectif d’épargne', 'Bilan de la troisième semaine', 'Compare deux fournisseurs (téléphone, internet)', 'Fais une journée sans dépense', 'Prévois les grosses dépenses de l’année', 'Crée un fonds d’urgence', 'Automatise un virement d’épargne', 'Révise tes abonnements', 'Prépare le budget du mois prochain', 'Note tes 3 décisions du mois', 'Bilan : ton budget idéal'],
  },
  'Culture financière': {
    how: ['Lis la fiche du concept du jour (mesquestionsdargent.fr, Banque de France, ou la BCEAO).', 'Explique-le avec un exemple chiffré simple.'],
    topics: ['Les intérêts composés', 'Le livret d’épargne', 'L’assurance-vie', 'Les actions', 'Les obligations', 'Les ETF', 'Le risque et la diversification', 'Le crédit immobilier', 'Le taux d’endettement', 'La retraite', 'Les impôts sur le revenu', 'La tontine', 'L’inflation et ton épargne', 'Bilan : ton plan d’épargne'],
  },
  'Routine matinale souple': {
    how: ['Prépare la veille ce dont tu as besoin.', 'Ajoute l’action du jour à ta routine, en moins de 10 minutes.', 'Si la journée est difficile, garde au moins la version minimale : un verre d’eau et 3 respirations.'],
    topics: ['Un grand verre d’eau au réveil', 'Ouvrir les fenêtres', 'Faire ton lit', '5 minutes d’étirements', 'Pas de téléphone pendant 15 minutes', 'Écrire 3 intentions', 'Bilan : ce qui te fait du bien', 'Un petit-déjeuner assis', '5 minutes de lecture', 'Une prière ou méditation', 'Préparer tes affaires sans courir', 'Une musique qui te met de bonne humeur', 'Marcher 5 minutes dehors', 'Bilan : ta routine en 3 gestes', 'Te lever 10 minutes plus tôt', 'Soin du visage', 'Planifier ta journée', 'Un moment de gratitude', 'Garde ta routine en voyage ou le week-end', 'Simplifie ce qui ne sert pas', 'Bilan : ta routine définitive'],
  },
  'Routine de fin de journée': {
    how: ['Une heure avant de dormir, fais l’action du jour.', 'Note une chose accomplie aujourd’hui.', 'Prépare un élément du lendemain.'],
    topics: ['Préparer tes vêtements', 'Ranger la cuisine', 'Écran éteint 30 minutes avant de dormir', 'Une tisane', 'Préparer ton sac', 'Lire 10 pages', 'Bilan de la semaine', 'Soin du visage', 'Noter les 3 priorités de demain', 'Ranger 5 objets', 'Étirements doux', 'Écrire 3 lignes de journal', 'Préparer le petit-déjeuner', 'Bilan : ce qui t’aide à dormir', 'Lumière tamisée', 'Une prière ou méditation', 'Couper les notifications', 'Remercier quelqu’un par message', 'Préparer ta gourde', 'Même heure de coucher', 'Bilan : ta routine du soir'],
  },
  'Une pause sans écran': {
    how: ['Choisis ton moment (pause déjeuner, fin de journée).', 'Range le téléphone dans une autre pièce.', 'Fais l’activité du jour 10 minutes.'],
    topics: ['Marcher autour du bloc', 'Lire', 'Regarder par la fenêtre sans rien faire', 'Dessiner', 'Écouter un album en entier', 'Cuisiner sans podcast', 'Bilan : ce que tu as remarqué'],
  },
  'Reconnaître ses émotions': {
    how: ['Le soir, pense à la journée.', 'Nomme l’émotion principale avec un mot précis (pas seulement « bien » ou « mal »).', 'Note ce qui a pu la déclencher, sans jugement.', 'Réponds à la question du jour.'],
    topics: ['Liste 20 mots d’émotions', 'La joie : quand l’as-tu sentie ?', 'La tristesse', 'La colère', 'La peur', 'La fierté', 'Bilan de la semaine : l’émotion la plus fréquente', 'Où ressens-tu l’émotion dans ton corps ?', 'L’émotion du matin vs du soir', 'La frustration', 'La jalousie', 'La gratitude', 'L’anxiété', 'Bilan : tes déclencheurs', 'Ce qui t’apaise', 'Ce que l’émotion t’apprend sur tes besoins', 'Une émotion cachée sous une autre', 'Exprimer une émotion à quelqu’un', 'L’émotion des autres', 'Accueillir sans agir tout de suite', 'Bilan : ton vocabulaire émotionnel'],
  },
  'Apprendre à se calmer': {
    how: ['Assieds-toi confortablement.', 'Pratique la technique du jour pendant 2 à 5 minutes (sans forcer).', 'Note ce que tu ressens avant et après sur 5.'],
    topics: ['Respiration 4-6 (inspire 4, expire 6)', 'Respiration carrée 4-4-4-4', 'Cohérence cardiaque 5 minutes', 'Scanner corporel', 'Ancrage 5-4-3-2-1 (5 choses vues, 4 entendues…)', 'Relâcher les épaules et la mâchoire', 'Bilan : ta technique préférée', 'Marcher lentement en conscience', 'Eau froide sur les poignets', 'Écrire ce qui t’inquiète puis fermer le carnet', 'Une musique lente', 'Dhikr ou prière', 'La pause avant de répondre', 'Bilan : ta trousse anti-stress'],
  },
  'Patience au quotidien': {
    how: ['Repère un moment d’impatience aujourd’hui.', 'Essaie la stratégie du jour.', 'Note ce qui a changé.'],
    topics: ['Repère simplement tes moments d’impatience', 'Respire 3 fois avant de répondre', 'Dans les embouteillages ou les files d’attente', 'Avec la famille', 'Au travail', 'Avec toi-même', 'Bilan de la semaine', 'Compter jusqu’à 10', 'Reformuler ce que l’autre dit', 'Accepter un retard', 'Anticiper les situations tendues', 'Changer d’activité 5 minutes', 'Rire de la situation', 'Bilan : tes déclencheurs', 'Ralentir volontairement un geste', 'Laisser quelqu’un finir sa phrase', 'Attendre sans téléphone', 'Patience avec un apprentissage', 'Patience dans un projet long', 'Une situation où tu as été patiente', 'Bilan : ce qui a changé'],
  },
  'Affirmation de soi': {
    how: ['Prépare ta phrase à l’avance.', 'Formule-la avec calme : fait, ressenti, demande.', 'Note la réaction et ce que tu as ressenti.'],
    topics: ['Repère une situation où tu n’as rien dit', 'Dire « non » à une petite demande', 'Demander un service', 'Donner ton avis en réunion', 'Refuser sans te justifier longuement', 'Demander une précision', 'Bilan de la semaine', 'Exprimer un désaccord avec calme', 'Recevoir un compliment sans le minimiser', 'Demander ce dont tu as besoin', 'Poser une limite de temps', 'Faire une réclamation', 'Demander un retour sur ton travail', 'Bilan : ce qui est devenu plus facile'],
  },
  'Confiance dans ses choix': {
    how: ['Note une décision prise aujourd’hui (même petite).', 'Note ce qui l’a guidée : valeur, intuition, information.', 'Réponds à la question du jour.'],
    topics: ['Liste tes 5 valeurs', 'Un choix fait rapidement', 'Un choix longuement réfléchi', 'Un choix dont tu es fière', 'Un choix que tu regrettes : qu’en as-tu appris ?', 'Décider sans demander l’avis', 'Bilan de la semaine', 'Le pour et le contre', 'Écouter ton intuition', 'Choisir en 2 minutes', 'Assumer un choix critiqué', 'Choisir pour toi, pas pour plaire', 'Un choix financier', 'Bilan : ton style de décision', 'Un choix d’organisation', 'Dire oui à une envie', 'Revenir sur un choix sans culpabiliser', 'Un choix aligné sur tes valeurs', 'Une décision repoussée : décide', 'Choisir le repos', 'Bilan : ta confiance sur 10 aujourd’hui'],
  },
  'Écoute attentive': {
    how: ['Pendant une conversation, pose ton téléphone.', 'Écoute sans interrompre.', 'Reformule : « si je comprends bien… ».', 'Applique la consigne du jour.'],
    topics: ['Simplement ne pas interrompre', 'Reformuler une fois', 'Poser une question ouverte', 'Regarder la personne', 'Écouter sans donner de conseil', 'Remarquer le non-verbal', 'Bilan de la semaine', 'Écouter quelqu’un avec qui tu n’es pas d’accord', 'Écouter un enfant ou une personne âgée', 'Appeler une amie juste pour l’écouter', 'Résumer une réunion', 'Écouter jusqu’au bout avant de répondre', 'Demander « et toi, comment tu vas vraiment ? »', 'Bilan : ce qui a changé dans tes échanges'],
  },
  'Communication sereine': {
    how: ['Repère un besoin ou une gêne du jour.', 'Formule une phrase en « je » : « je ressens… quand… j’aurais besoin de… ».', 'Note la réaction.'],
    topics: ['Écris 3 phrases en « je »', 'Exprimer un besoin à la maison', 'Exprimer un besoin au travail', 'Remercier précisément', 'Exprimer une gêne sans reproche', 'Demander au lieu de suggérer', 'Bilan de la semaine', 'Remplacer « toujours / jamais »', 'Choisir le bon moment', 'Exprimer une émotion par message', 'Désamorcer une tension', 'Dire ce que tu apprécies chez quelqu’un', 'S’excuser simplement', 'Bilan : tes phrases qui marchent', 'Écouter avant de répondre', 'Parler d’un sujet délicat', 'Proposer une solution', 'Exprimer une limite', 'Accepter un « non »', 'Faire un retour constructif', 'Bilan : ta communication aujourd’hui'],
  },
  'Lâcher-prise réaliste': {
    how: ['Écris une préoccupation du jour.', 'Sépare ce qui dépend de toi et ce qui n’en dépend pas.', 'Fais une petite action sur ce qui dépend de toi, et laisse le reste.'],
    topics: ['Liste tes préoccupations', 'Le regard des autres', 'Le passé', 'Le travail', 'La famille', 'L’argent', 'Bilan de la semaine', 'La perfection', 'Les imprévus', 'Le temps qu’il fait, les retards', 'Les réseaux sociaux', 'Une relation', 'Ton corps', 'Bilan : ce que tu as lâché'],
  },
  'Gratitude sans obligation': {
    how: ['Le soir, note une chose appréciée aujourd’hui.', 'Sois précise (qui, quoi, pourquoi).', 'Réponds à l’angle du jour si tu en as envie.'],
    topics: ['Un repas', 'Une personne', 'Ton corps', 'Ta maison', 'Un objet', 'Un moment de calme', 'Bilan de la semaine', 'Un son', 'Une odeur', 'Une difficulté qui t’a appris quelque chose', 'Un souvenir', 'Une compétence que tu as', 'Un lieu', 'Bilan : relis tes notes', 'Une rencontre', 'Un geste de quelqu’un', 'La nature', 'Ton travail', 'Toi-même', 'Envoie un message de remerciement', 'Bilan : ta liste de gratitude'],
  },
  'Respiration et ancrage': {
    how: ['Assieds-toi ou reste debout, pieds au sol.', 'Fais l’exercice du jour 3 à 5 minutes.', 'Observe 5 détails autour de toi.'],
    topics: ['Respiration naturelle : observe-la', 'Respiration 4-6', 'Ancrage par les pieds', '5-4-3-2-1', 'Respiration abdominale allongée', 'Marche lente', 'Bilan : ton exercice préféré'],
  },
  'Lire quelques pages': {
    how: ['Garde ton livre à portée de main.', 'Lis 10 pages ou 10 minutes.', 'Note la page où tu t’arrêtes.'],
    topics: Array.from({ length: 21 }, (_, i) => ['Choisis un livre court et agréable', 'Lis au réveil', 'Lis pendant un trajet', 'Lis à la pause déjeuner', 'Lis au lit', 'Lis dehors', 'Bilan : ta meilleure heure pour lire'][i % 7]),
  },
  'Préparer un repas maison': {
    how: ['Choisis la recette dans l’onglet Recettes la veille.', 'Vérifie ta liste de courses.', 'Cuisine, puis note le temps et ce que tu changerais.'],
    topics: ['Une omelette garnie', 'Un riz sauté aux légumes', 'Une soupe de saison', 'Des pâtes à la sauce tomate maison', 'Un poulet yassa', 'Une salade complète', 'Bilan : ta recette favorite', 'Un curry de légumes', 'Un poisson au four', 'Un thiéboudienne simplifié', 'Des galettes ou crêpes', 'Un mafé', 'Un plat du placard (sans courses)', 'Bilan : ton carnet de 5 recettes faciles'],
  },
  'Faire une pause dehors': {
    how: ['Bloque 10 minutes dans ton agenda.', 'Sors, même si c’est juste devant chez toi.', 'Fais la variante du jour.'],
    topics: Array.from({ length: 21 }, (_, i) => ['Marche sans destination', 'Observe le ciel', 'Prends l’air au lever du soleil', 'Marche après le déjeuner', 'Trouve un banc et assieds-toi', 'Va dans un parc ou au bord de la mer', 'Bilan : ton lieu préféré'][i % 7]),
  },
  'Mieux s’hydrater': {
    how: ['Garde une gourde visible.', 'Bois un verre au réveil et un à chaque repas.', 'Applique l’astuce du jour.'],
    topics: ['Repère combien tu bois aujourd’hui', 'Un verre au réveil', 'Une gourde sur ton bureau', 'Eau aromatisée (citron, menthe, gingembre)', 'Un rappel toutes les 2 heures', 'Un thé ou une tisane l’après-midi', 'Bilan de la semaine', 'Boire avant d’avoir soif', 'Un verre avant chaque repas', 'Remplacer une boisson sucrée', 'Bissap ou gingembre maison peu sucré', 'Boire après le sport', 'Fruits riches en eau', 'Bilan : ta routine d’hydratation'],
  },
  'Un moment pour soi': {
    how: ['Bloque 10 minutes dans ton agenda.', 'Fais l’activité du jour, rien d’autre.', 'Note comment tu te sens après.'],
    topics: ['Un bain ou une longue douche', 'Ta musique préférée', 'Un masque pour le visage', 'Lire un magazine', 'Une sieste de 10 minutes', 'Un dessin ou du coloriage', 'Bilan : ce qui te recharge', 'Danser seule', 'Cuisiner pour toi', 'Un thé en silence', 'Feuilleter de vieilles photos', 'Écrire', 'Une manucure', 'Bilan de la deuxième semaine', 'Une balade', 'Un podcast inspirant', 'Ne rien faire', 'Une prière ou méditation', 'Ranger un coin qui te plaît', 'Planifier un week-end', 'Bilan de la troisième semaine', 'Une nouvelle recette', 'Un film court', 'Un appel à une amie', 'Une activité d’enfance', 'Prendre soin de tes cheveux', 'Une sortie seule', 'Écrire une lettre à toi-même', 'Préparer le mois prochain', 'Bilan : tes 5 moments préférés'],
  },
};

/** Conseils pour tenir dans la durée, affichés pour tous les défis. */
export const STAY_ON_TRACK = [
  'Même heure chaque jour : accroche le défi à une habitude existante (après le café, avant la douche).',
  'Prépare la veille : le livre posé, la tenue sortie, le carnet ouvert.',
  'Version minimale : les jours difficiles, fais 2 minutes seulement. Ça compte.',
  'Un jour manqué ne casse rien : reprends le lendemain, sans rattraper deux jours d’un coup.',
  'Coche chaque jour dans l’app : voir la série avancer motive.',
  'Le dimanche, relis ta semaine et prépare la suivante.',
  'Parles-en à une proche ou fais le défi à deux.',
];
