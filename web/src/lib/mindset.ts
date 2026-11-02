/**
 * « Mon carnet de foi » : outils pratiques tirés de ma lecture de Muslima Mindset Reset (Muslima Glow),
 * reformulés en quelques lignes (le livre n'est pas recopié). Les versets et hadiths cités gardent leur référence.
 */
export const QURAN_DAILY = [
  { id: 'fatiha', label: 'Al-Fâtiha, en la méditant' },
  { id: 'quls', label: 'Al-Ikhlâs, Al-Falaq, An-Nâs' },
  { id: 'baqara', label: 'Un passage d’Al-Baqara (sur plusieurs jours)' },
  { id: 'mulk', label: 'Al-Mulk le soir' },
];

export const AKHIRA_GOALS = [
  'Étudier un peu de science religieuse (aqida, fiqh, Coran, vie du Prophète ﷺ)',
  'Apprendre une sourate par mois avec son tafsir',
  'Rappeler Allah à au moins une personne chaque semaine',
  'Financer un puits, un Coran ou une sadaqa continue',
  'Prier tahajjud une fois par semaine',
  'Donner une aumône secrète chaque mois',
  'Pardonner à une personne que je n’ai pas encore pardonnée',
  'Parrainer un orphelin, même avec peu',
  'Créer une œuvre utile qui continuera après moi',
];

export const AFFIRMATIONS = [
  'Je choisis de faire confiance à Allah, même quand je ne comprends pas.',
  'Je me détache du regard des gens : mon destin dépend d’Allah seul.',
  'Je suis guidée, soutenue et protégée, même dans l’invisible.',
  'Allah est avec moi, Il ne m’abandonnera pas.',
  'Je suis capable, par Sa permission.',
  'Je peux changer : je suis en train d’évoluer, avec l’aide d’Allah.',
  'Je mérite la paix et je l’accueille.',
  'Je fais ma part et j’accepte la part d’Allah.',
  'Ya Allah, je Te fais confiance, même quand je ne comprends pas.',
  'Je vais avancer, même avec mes failles, mes peurs et mes cicatrices.',
];

export type Fiche = { id: string; title: string; points: string[]; quote?: { text: string; ref: string } };
export const FICHES: Fiche[] = [
  { id: 'dhikr', title: 'Le sens de mon dhikr', points: [
    'SubhanAllah : je purifie mon regard sur ma vie.',
    'Alhamdulillah : je nourris ma gratitude.',
    'Allahu akbar : je remets chaque difficulté à sa juste place.',
    'Lā ilāha illā Allāh : je replace Allah au centre.',
    'Astaghfirullah : j’allège mon cœur et je laisse place à Sa miséricorde.',
    'Bienfaits : un cœur apaisé, un lien renforcé, des priorités recadrées, le sentiment de n’être jamais seule.'],
    quote: { text: 'N’est-ce point par l’évocation d’Allah que se tranquillisent les cœurs ?', ref: 'Coran 13:28' } },
  { id: 'istighfar', title: 'L’istighfar, une clé', points: [
    'Ce n’est pas un mot machinal : je reconnais mes manquements et je reviens vers Lui, sincèrement.',
    'Il purifie le cœur, ouvre les portes de la subsistance, apaise et rapproche d’Allah.',
    'Je ne vois pas encore de changement ? Je persévère : ce qui se passe dans l’invisible ne se voit pas tout de suite.',
    'Le Prophète ﷺ demandait pardon plus de 70 fois par jour (rapporté par al-Bukhârî).'],
    quote: { text: 'Implorez le pardon de votre Seigneur, car Il est grand Pardonneur, pour qu’Il vous envoie du ciel des pluies abondantes, vous accorde beaucoup de biens et d’enfants, et vous donne des jardins et des rivières.', ref: 'Coran 71:10-12' } },
  { id: 'tawhid', title: 'Les 7 conditions de « Lā ilāha illā Allāh »', points: [
    'La connaissance (‘ilm) : comprendre que nul n’a le droit d’être adoré sauf Allah.',
    'La certitude (yaqîn) : sans doute ni croyance en d’autres forces (astrologie, amulettes…).',
    'L’acceptation (qabûl) : l’accepter avec le cœur, sans orgueil.',
    'La soumission (inqiyâd) : que mes actes suivent.',
    'La sincérité (ikhlâs) : pour Allah seul, pas pour mon image.',
    'La véracité (sidq) : avec le cœur et la langue, sans hypocrisie.',
    'L’amour (mahabba) : l’amour d’Allah au-dessus de tout.'] },
  { id: 'signes', title: 'Quand Allah n’est plus au centre (à surveiller)', points: [
    'Je veux tout contrôler et je m’épuise sur l’incontrôlable.',
    'Je panique devant l’imprévu.',
    'Je fais passer mon confort ou mon image avant ma foi.',
    'Je ne me tourne vers Lui qu’en dernier recours.',
    'Remède : remettre Allah au centre ; c’est Lui qui donne la stabilité intérieure.'] },
  { id: 'rizq', title: 'Pour augmenter mon rizq', points: [
    'Me rappeler qu’Allah est Ar-Razzâq et que ma subsistance est déjà écrite.',
    'Soigner mon caractère, ma prière, mes invocations et mes liens familiaux.',
    'Donner, même un peu : temps, aide, sourire. L’aumône ne diminue pas la richesse.',
    'Être reconnaissante dès maintenant.',
    'Agir chaque jour, puis patienter.'] },
  { id: 'pardon', title: 'Réussir à pardonner', points: [
    'Ne plus attendre d’excuses : je pardonne pour ma propre paix.',
    'Accepter ce que je ne peux pas changer.',
    'Pardonner n’oblige pas à reprendre contact.',
    'Je peux simplement dire : « Ya Allah, je Te remets cette affaire. »',
    'En faire un acte d’adoration.'] },
  { id: 'liberte', title: 'Reprendre mon pouvoir', points: [
    'M’habiller pour être alignée avec mes valeurs, pas pour impressionner.',
    'Ne plus m’excuser d’être différente.',
    'Agir avec sincérité sans attendre l’approbation.',
    'Ne pas freiner mes projets par peur du jugement.',
    'Revenir à mon intention : pour qui je le fais ?'] },
  { id: 'waswas', title: 'Reconnaître un waswas', points: [
    'Une pensée qui me rabaisse, revient en boucle et m’éloigne de la foi, de l’espoir ou de l’action.',
    'Elle exagère (« personne ne m’aime », « je rate tout »), pousse à abandonner, coupe la sérénité.',
    'Réflexe : la nommer, ne pas la croire, revenir au dhikr.'] },
  { id: 'entourage', title: 'Un environnement sain', points: [
    'Ces personnes me rapprochent-elles d’Allah ? Me corrigent-elles avec bienveillance ?',
    'M’encouragent-elles au bien ? Je ressors de leur compagnie plus forte ou plus vide ?',
    'J’ai le droit de m’éloigner de ce qui m’abîme.',
    'M’entourer de personnes qui incarnent ce que je veux devenir.'],
    quote: { text: 'L’homme suit la religion de son ami proche ; que chacun de vous regarde donc qui il prend pour ami.', ref: 'Rapporté par Abû Dâwûd et at-Tirmidhî' } },
  { id: 'secret', title: 'Agir pour le bien, même en secret', points: [
    'Une sadaqa, même petite. Une bonne parole. Aider sans le dire. Rappeler Allah avec douceur.',
    'Chaque jour est un nouveau départ : commencer aujourd’hui, méditer un verset, aligner ma routine sur Lui.'] },
  { id: 'victime', title: 'Sortir de la posture de victime', points: [
    'Ce que j’ai vécu m’a marquée, mais ne me définit pas. Je choisis ma réaction, et j’ai le pouvoir d’avancer et de demander l’aide d’Allah.',
    'Je n’ai pas besoin d’être parfaite : fatiguée ou blessée, je peux quand même décider de ne plus subir.',
    '1. Changer mon discours : « je ne peux pas » devient « je vais apprendre à », « je suis fatiguée » devient « je fais de mon mieux aujourd’hui ».',
    '2. Rendre ma douleur utile : qu’est-ce que ça m’a appris sur moi, sur la vie, sur Allah ?',
    '3. Redonner à Allah la place centrale : ni mon passé ni les gens ne décident de mon avenir. Je fais ma part, je Lui confie le reste.',
    'Exercice : noter mes phrases de victime et celles que je choisis à la place, les relire chaque matin pendant 7 jours (« Mes reformulations » ci-dessus).'],
    quote: { text: 'Allah ne modifie pas l’état d’un peuple tant que celui-ci ne change pas ce qui est en lui-même.', ref: 'Coran 13:11' } },
  { id: 'qadr', title: 'Comprendre le Qadr', points: [
    'Le Qadr est l’un des 6 piliers de la foi : Allah sait tout, a tout écrit dans la Table préservée (al-Lawh al-Mahfûz), et peut tout changer par des invocations sincères.',
    'Ce n’est pas « tout est écrit donc je ne peux rien faire », mais « tout est écrit et j’ai un rôle à jouer » : faire les causes, faire des douas, croire que tout peut changer.',
    'Ce qui m’est destiné ne peut pas me manquer ; ce qui m’échappe est souvent une protection.',
    'Ce n’est peut-être pas « non » mais « pas maintenant » : Allah agit avec sagesse, pas selon mon timing.',
    'Exercice : 3 choses que je voulais et n’ai pas eues. M’ont-elles évité une difficulté ? Appris quelque chose ? Ai-je reçu autre chose à la place ?'],
    quote: { text: 'La première chose qu’Allah a créée est la Plume ; Il lui dit : « Écris les décrets de tout ce qui arrivera jusqu’à l’Heure. »', ref: 'Rapporté par at-Tirmidhî' } },
  { id: 'controle', title: 'Ce que je contrôle / ce que je ne contrôle pas', points: [
    'Je contrôle : mes intentions, mes efforts, mes décisions, mes choix, mes actions, mes invocations, ma patience, ma confiance en Allah.',
    'Je ne contrôle pas : le passé, le destin, le délai, le résultat, le moment où Allah exauce, les épreuves, le comportement des autres.',
    'Je ne choisis ni ma famille ni mes épreuves ; je choisis ma réaction, ma direction et ma foi dans l’action.'] },
  { id: 'ambition', title: 'Ambition, oui ; attachement, non', points: [
    'Réussir dans la dunya et l’akhira n’est pas opposé : travail, argent et projets deviennent adoration avec une intention claire.',
    'Le danger, c’est l’attachement excessif : oublier Allah, perdre le sommeil, douter de mon avenir si ça tarde.',
    'Une ambition saine : tawakkul (je fais les causes, Allah décide), gratitude (chaque pas est une faveur), lucidité (rien ne m’appartient vraiment).',
    'Me détacher n’est pas devenir indifférente : je continue d’agir, sans faire dépendre ma paix du résultat.'],
    quote: { text: 'Recherche à travers ce qu’Allah t’a donné la Demeure dernière, et n’oublie pas ta part en cette vie.', ref: 'Coran 28:77' } },
  { id: 'tawakkul', title: 'Le tawakkul en pratique', points: [
    'Faire les causes sérieusement, puis confier le résultat à Allah.',
    '« Attache ta chamelle, puis place ta confiance en Allah » : la confiance n’excuse pas l’inaction.',
    'Quand l’angoisse monte : Ḥasbunallāhu wa ni‘ma l-wakīl (Coran 3:173), à retrouver dans mes invocations.'],
    quote: { text: 'Attache-la, puis place ta confiance en Allah.', ref: 'Rapporté par at-Tirmidhî' } },
  { id: 'douas', title: 'Le pouvoir des douas', points: [
    'Il n’y a pas de « trop petit » pour Allah : je peux tout Lui demander, guérir mon cœur comme retrouver mes clés.',
    'Ce qu’Allah répond : exactement ce que j’ai demandé ; autre chose de meilleur ; « pas maintenant » ; ou une récompense gardée pour l’au-delà. Dans tous les cas je gagne.',
    'Pourquoi ça semble « ne pas marcher » : je demande sans vraiment y croire, j’abandonne trop tôt, j’impose mon scénario (manière, timing, personne).',
    'Je suis selon l’opinion que j’ai de mon Seigneur : je demande en pensant du bien de Lui, sans me limiter.'],
    quote: { text: 'Que l’un de vous demande à son Seigneur tous ses besoins, même un lacet de chaussure lorsqu’il se casse.', ref: 'Rapporté par at-Tirmidhî' } },
  { id: 'doua-puissante', title: 'Faire une doua puissante', points: [
    '1. Choisir un moment fort : tahajjud, prosternation, pluie, vendredi, dernière partie de la nuit.',
    '2. Être précise : plutôt que « aide-moi », « accorde-moi un travail qui me rapproche de Toi, m’élève et me libère financièrement ».',
    '3. Invoquer avec le cœur : la sincérité compte plus que les mots parfaits.',
    '4. Y ajouter du tawakkul : faire les causes, confier le résultat.',
    '5. Répéter, encore et encore, comme on arrose une graine.',
    '6. Utiliser les noms d’Allah adaptés : Ar-Razzâq, Al-Wahhâb, Al-Fattâh, Al-Latîf, Al-Jabbâr…',
    'Avant : dhikr, istighfar, m’apaiser. Raconter à Allah ce que je ressens et ce que j’espère.'],
    quote: { text: 'Invoquez Allah en étant certains qu’Il vous répondra.', ref: 'Rapporté par at-Tirmidhî' } },
  { id: 'epreuve', title: 'L’épreuve n’est pas une punition', points: [
    'L’épreuve ne veut pas dire qu’Allah me rejette ou m’a oubliée : elle m’élève, me purifie, me rapproche de Lui.',
    'Le poste que je n’ai pas eu m’a peut-être protégée ; ce que j’appelle « blocage » aujourd’hui, je l’appellerai peut-être « baraka » demain.',
    'Manque d’argent → tawakkul et baraka. Rejet ou abandon → l’amour d’Allah et ma valeur. Maladie ou épuisement → sabr et gratitude. Douas non exaucées → foi et compréhension du Qadr.',
    'Et si cette douleur n’était pas là pour me punir mais pour m’éveiller ?'],
    quote: { text: 'Allah n’impose à aucune âme une charge supérieure à sa capacité.', ref: 'Coran 2:286' } },
  { id: 'reprogrammer', title: 'Reprogrammer mon mental', points: [
    '1. Repérer mes pensées automatiques (« je ne mérite pas », « ça ne sert à rien »…).',
    '2. Décoder la croyance derrière : « je ne mérite pas de réussir » = « je pense qu’Allah ne m’a pas choisie ».',
    '3. Remplacer consciemment : « je ne suis pas assez bien » devient « je suis en train d’évoluer, avec l’aide d’Allah ».',
    '4. Répéter chaque jour : c’est le principe des affirmations et des douas.',
    '5. Agir comme si c’était possible, même en doutant : l’action renforce la croyance.',
    'Ce que je crois influence ce que je vis : avec un mental perdant, même la meilleure stratégie finit abandonnée.'] },
  { id: 'waswas-reflexes', title: '4 réflexes contre le waswas', points: [
    '1. Identifier : cette pensée vient-elle de la vérité ou de la peur ?',
    '2. Couper : « A‘ûdhu billâhi mina sh-shaytâni r-rajîm ».',
    '3. Remplacer par une parole vraie (une affirmation, un verset).',
    '4. Me protéger par le dhikr, comme un bouclier.'] },
];
