/** Parcours d'apprentissage pas à pas : chaque étape a un objectif, des exercices concrets et, pour les langues, des phrases modèles. */
export type Step = { title: string; goal: string; tasks: string[]; phrases?: [string, string][]; minutes: number };
export type PathCategory = 'Langues' | 'Peinture & dessin' | 'Écriture';
export type LearningPath = { id: string; category: PathCategory; title: string; tagline: string; tone: 'caramel' | 'sauge' | 'sable' | 'chocolat'; weeks: number; steps: Step[] };

/* ---------- Langues : même progression (niveau débutant A1 → A2), phrases propres à chaque langue ---------- */
const LANG_STEPS: { title: string; goal: string; tasks: string[]; minutes: number }[] = [
  { title: 'Les sons et la prononciation', goal: 'Reconnaître les sons de la langue et oser les prononcer.', minutes: 15,
    tasks: ['Écoute 5 minutes de dialogue lent (podcast ou vidéo pour débutants).', 'Répète à voix haute les phrases modèles ci-dessous.', 'Enregistre-toi une fois et réécoute.'] },
  { title: 'Saluer et se présenter', goal: 'Dire bonjour, ton prénom, d’où tu viens et ce que tu fais.', minutes: 20,
    tasks: ['Apprends les phrases modèles par cœur.', 'Écris ta présentation en 4 phrases.', 'Dis-la à voix haute sans lire.'] },
  { title: 'Les nombres, l’heure et les prix', goal: 'Compter jusqu’à 100, donner l’heure et comprendre un prix.', minutes: 20,
    tasks: ['Compte de 1 à 20 à voix haute, puis par dizaines jusqu’à 100.', 'Lis l’heure de ton téléphone dans la langue, 5 fois dans la journée.', 'Écris le prix de 5 objets autour de toi.'] },
  { title: 'La famille et les proches', goal: 'Parler de ta famille et décrire quelqu’un simplement.', minutes: 20,
    tasks: ['Apprends 10 mots : mère, père, sœur, frère, amie…', 'Décris une photo de famille en 5 phrases.'] },
  { title: 'Le quotidien au présent', goal: 'Raconter ta journée type avec 10 verbes courants.', minutes: 25,
    tasks: ['Apprends 10 verbes : manger, boire, aller, travailler, dormir…', 'Écris ta routine du matin en 6 phrases.', 'Dis-la à voix haute en la mimant.'] },
  { title: 'Au restaurant et au marché', goal: 'Commander, demander un prix, remercier.', minutes: 20,
    tasks: ['Apprends les phrases modèles.', 'Joue la scène seule : tu commandes un plat et une boisson.', 'Fais ta liste de courses dans la langue.'] },
  { title: 'Se déplacer et demander son chemin', goal: 'Comprendre et donner une direction simple.', minutes: 20,
    tasks: ['Apprends : à droite, à gauche, tout droit, près, loin.', 'Décris le trajet de chez toi à un lieu que tu connais.'] },
  { title: 'Raconter au passé', goal: 'Raconter ton week-end en quelques phrases.', minutes: 25,
    tasks: ['Apprends le passé de 8 verbes courants.', 'Écris 5 phrases sur ce que tu as fait hier.', 'Raconte-le à voix haute en 1 minute.'] },
  { title: 'Parler de ses projets', goal: 'Exprimer une envie ou un projet.', minutes: 25,
    tasks: ['Apprends « je vais… », « je voudrais… », « j’aimerais… ».', 'Écris tes 3 projets pour l’année.'] },
  { title: 'Première conversation', goal: 'Tenir 10 minutes de conversation simple.', minutes: 30,
    tasks: ['Trouve une partenaire d’échange (amie, appli d’échange linguistique, cours).', 'Prépare 10 questions à poser.', 'Fais le bilan : ce qui est facile, ce qui reste à travailler.'] },
];

const PHRASES: Record<string, ([string, string][] | undefined)[]> = {
  anglais: [
    [['Hello / Good morning', 'Bonjour'], ['Thank you', 'Merci'], ['Goodbye', 'Au revoir']],
    [['My name is Aida.', 'Je m’appelle Aida.'], ['I’m from Senegal.', 'Je viens du Sénégal.'], ['I live in Dakar.', 'J’habite à Dakar.'], ['Nice to meet you.', 'Enchantée.']],
    [['How much is it?', 'Combien ça coûte ?'], ['It’s ten o’clock.', 'Il est dix heures.'], ['Twenty, thirty, forty…', 'Vingt, trente, quarante…']],
    [['This is my sister.', 'Voici ma sœur.'], ['She is tall and funny.', 'Elle est grande et drôle.']],
    [['I wake up at seven.', 'Je me réveille à sept heures.'], ['I go to work.', 'Je vais au travail.']],
    [['I would like a coffee, please.', 'Je voudrais un café, s’il vous plaît.'], ['The bill, please.', 'L’addition, s’il vous plaît.']],
  ],
  espagnol: [
    [['Hola / Buenos días', 'Bonjour'], ['Gracias', 'Merci'], ['Adiós', 'Au revoir']],
    [['Me llamo Aida.', 'Je m’appelle Aida.'], ['Soy de Senegal.', 'Je viens du Sénégal.'], ['Vivo en Dakar.', 'J’habite à Dakar.'], ['Mucho gusto.', 'Enchantée.']],
    [['¿Cuánto cuesta?', 'Combien ça coûte ?'], ['Son las diez.', 'Il est dix heures.'], ['Veinte, treinta, cuarenta…', 'Vingt, trente, quarante…']],
    [['Esta es mi hermana.', 'Voici ma sœur.'], ['Es alta y divertida.', 'Elle est grande et drôle.']],
    [['Me despierto a las siete.', 'Je me réveille à sept heures.'], ['Voy al trabajo.', 'Je vais au travail.']],
    [['Quisiera un café, por favor.', 'Je voudrais un café, s’il vous plaît.'], ['La cuenta, por favor.', 'L’addition, s’il vous plaît.']],
  ],
  portugais: [
    [['Olá / Bom dia', 'Bonjour'], ['Obrigada', 'Merci (dit par une femme)'], ['Tchau', 'Au revoir']],
    [['Chamo-me Aida.', 'Je m’appelle Aida.'], ['Sou do Senegal.', 'Je viens du Sénégal.'], ['Moro em Dakar.', 'J’habite à Dakar.']],
    [['Quanto custa?', 'Combien ça coûte ?'], ['São dez horas.', 'Il est dix heures.']],
    [['Esta é a minha irmã.', 'Voici ma sœur.']],
    [['Acordo às sete.', 'Je me réveille à sept heures.']],
    [['Queria um café, por favor.', 'Je voudrais un café, s’il vous plaît.'], ['A conta, por favor.', 'L’addition, s’il vous plaît.']],
  ],
  arabe: [
    [['مرحبا — marhaban', 'Bonjour'], ['شكرا — shukran', 'Merci'], ['مع السلامة — ma‘a s-salāma', 'Au revoir']],
    [['اسمي عايدة — ismī ‘Āyda', 'Je m’appelle Aida.'], ['أنا من السنغال — anā min as-Sinighāl', 'Je viens du Sénégal.'], ['تشرفنا — tasharrafnā', 'Enchantée.']],
    [['بكم هذا؟ — bikam hādhā ?', 'Combien ça coûte ?'], ['واحد، اثنان، ثلاثة — wāḥid, ithnān, thalātha', 'Un, deux, trois']],
    [['هذه أختي — hādhihi ukhtī', 'Voici ma sœur.']],
    [['أذهب إلى العمل — adhhabu ilā al-‘amal', 'Je vais au travail.']],
    [['أريد قهوة من فضلك — urīdu qahwa min faḍlik', 'Je voudrais un café, s’il te plaît.']],
  ],
  wolof: [
    [['Salaam aleekum — Maleekum salaam', 'Bonjour (salutation)'], ['Jërëjëf', 'Merci'], ['Ba beneen yoon', 'À la prochaine']],
    [['Na nga def ?', 'Comment vas-tu ?'], ['Maa ngi fi rekk.', 'Je vais bien (je suis là).'], ['Maa ngi tudd Aida.', 'Je m’appelle Aida.']],
    [['Ñaata la ?', 'C’est combien ?'], ['Benn, ñaar, ñett', 'Un, deux, trois']],
    [['Sama yaay', 'Ma mère'], ['Sama baay', 'Mon père']],
    undefined,
    [['Dama bëgg…', 'Je veux…'], ['Jërëjëf', 'Merci']],
  ],
};

const lang = (id: string, title: string, tone: LearningPath['tone']): LearningPath => ({
  id: 'lang-' + id, category: 'Langues', title, tagline: 'Débutante · 10 étapes · 20 min par jour', tone, weeks: 10,
  steps: LANG_STEPS.map((s, i) => ({ ...s, phrases: PHRASES[id]?.[i] })),
});

export const PATHS: LearningPath[] = [
  lang('anglais', 'Anglais', 'chocolat'),
  lang('espagnol', 'Espagnol', 'caramel'),
  lang('portugais', 'Portugais', 'sauge'),
  lang('arabe', 'Arabe', 'sable'),
  lang('wolof', 'Wolof', 'caramel'),
  {
    id: 'aquarelle', category: 'Peinture & dessin', title: 'Aquarelle', tagline: 'De la première tache au premier tableau', tone: 'sauge', weeks: 12,
    steps: [
      { title: 'Le matériel de base', goal: 'Réunir un kit simple sans trop dépenser.', minutes: 20, tasks: ['Papier aquarelle 300 g/m² (format A5 pour commencer).', '3 pinceaux ronds (petit, moyen, gros) et un pot d’eau.', 'Une palette de 12 couleurs, un chiffon, du ruban de masquage.'] },
      { title: 'Le lavis plat', goal: 'Poser une couleur unie, sans traces.', minutes: 25, tasks: ['Scotche ta feuille sur un support incliné.', 'Peins 3 rectangles d’une seule couleur, de gauche à droite, en gardant une goutte au bas du pinceau.'] },
      { title: 'Le dégradé', goal: 'Passer d’une couleur intense à presque blanc.', minutes: 25, tasks: ['Fais 3 dégradés d’une couleur en ajoutant de l’eau à chaque passage.', 'Fais un dégradé de deux couleurs (bleu vers jaune).'] },
      { title: 'Mouillé sur mouillé', goal: 'Laisser les couleurs se mélanger sur papier humide.', minutes: 30, tasks: ['Mouille une zone, dépose 2 couleurs et observe.', 'Peins un ciel de coucher de soleil.'] },
      { title: 'Mouillé sur sec', goal: 'Obtenir des bords nets et des détails.', minutes: 30, tasks: ['Peins 5 feuilles d’arbre sur papier sec.', 'Superpose une deuxième couche une fois la première sèche.'] },
      { title: 'Les mélanges de couleurs', goal: 'Créer tes teintes à partir de 3 couleurs primaires.', minutes: 30, tasks: ['Fais un cercle chromatique avec rouge, jaune et bleu.', 'Crée 5 nuances de vert et 5 de brun.'] },
      { title: 'Réserver le blanc', goal: 'Garder le blanc du papier pour la lumière.', minutes: 30, tasks: ['Peins un citron en laissant un reflet blanc.', 'Essaie le drawing gum (fluide à masquer) si tu en as.'] },
      { title: 'Formes simples', goal: 'Peindre des objets du quotidien.', minutes: 40, tasks: ['Une tasse, une pomme, une fleur : 3 petites études.', 'Observe l’ombre et peins-la plus foncée.'] },
      { title: 'Le paysage simple', goal: 'Ciel, horizon, premier plan.', minutes: 45, tasks: ['Ciel en mouillé sur mouillé, horizon en mouillé sur sec.', 'Ajoute un arbre ou une pirogue au premier plan.'] },
      { title: 'La végétation', goal: 'Feuillages, palmiers, herbes.', minutes: 45, tasks: ['Peins un palmier ou un baobab.', 'Travaille 3 verts différents dans un même feuillage.'] },
      { title: 'La composition', goal: 'Organiser un tableau qui guide le regard.', minutes: 40, tasks: ['Fais 3 petits croquis en noir et blanc avant de peindre.', 'Utilise la règle des tiers.'] },
      { title: 'Mon premier tableau', goal: 'Réaliser une aquarelle complète et la signer.', minutes: 90, tasks: ['Choisis un sujet qui te touche (photo de voyage, lieu aimé).', 'Croquis, couleurs, détails, signature.', 'Photographie-la et ajoute-la à ta galerie.'] },
    ],
  },
  {
    id: 'dessin', category: 'Peinture & dessin', title: 'Dessin', tagline: 'Observer et tracer, pas à pas', tone: 'sable', weeks: 8,
    steps: [
      { title: 'Lignes et contrôle du trait', goal: 'Tracer des lignes sûres.', minutes: 15, tasks: ['Remplis une page de lignes droites, courbes et cercles.', 'Dessine sans gommer.'] },
      { title: 'Les formes de base', goal: 'Voir les objets comme des cubes, cylindres et sphères.', minutes: 20, tasks: ['Dessine 5 objets en les décomposant en formes simples.'] },
      { title: 'Ombres et lumière', goal: 'Donner du volume avec 3 valeurs.', minutes: 25, tasks: ['Fais une échelle de gris en 5 cases.', 'Ombre une sphère et un cube.'] },
      { title: 'Dessin d’observation', goal: 'Dessiner ce que tu vois, pas ce que tu crois voir.', minutes: 25, tasks: ['Dessine ta main dans 3 positions.', 'Dessine une plante d’intérieur.'] },
      { title: 'La perspective', goal: 'Comprendre le point de fuite.', minutes: 30, tasks: ['Dessine une rue avec un point de fuite.', 'Dessine ta chambre ou ton salon.'] },
      { title: 'Le visage', goal: 'Placer les yeux, le nez et la bouche.', minutes: 30, tasks: ['Apprends les proportions de base du visage.', 'Dessine un autoportrait rapide face au miroir.'] },
      { title: 'Le croquis rapide', goal: 'Saisir l’essentiel en 2 minutes.', minutes: 20, tasks: ['10 croquis de 2 minutes dans un café ou à la maison.'] },
      { title: 'Mon carnet', goal: 'Remplir un carnet de dessin personnel.', minutes: 30, tasks: ['Un dessin par jour pendant une semaine, sur un thème libre.'] },
    ],
  },
  {
    id: 'ecriture', category: 'Écriture', title: 'Écriture créative', tagline: 'Écrire chaque jour, jusqu’à ta première nouvelle', tone: 'chocolat', weeks: 10,
    steps: [
      { title: 'L’habitude d’écrire', goal: 'Écrire 10 minutes par jour, sans te juger.', minutes: 10, tasks: ['Écriture libre : écris sans t’arrêter pendant 10 minutes.', 'Choisis ton moment fixe (matin ou soir).'] },
      { title: 'Les cinq sens', goal: 'Décrire avec précision.', minutes: 15, tasks: ['Décris ta cuisine en utilisant les 5 sens.', 'Décris un marché sans utiliser le verbe « voir ».'] },
      { title: 'Le personnage', goal: 'Créer quelqu’un de vivant.', minutes: 20, tasks: ['Fiche : nom, âge, désir, peur, secret.', 'Écris une scène où il ou elle fait un choix.'] },
      { title: 'Le dialogue', goal: 'Faire parler des personnages de façon naturelle.', minutes: 20, tasks: ['Écris une dispute en 15 répliques, sans adverbes.', 'Lis-la à voix haute.'] },
      { title: 'Le point de vue', goal: 'Choisir qui raconte.', minutes: 20, tasks: ['Raconte la même scène à la 1re personne, puis à la 3e.'] },
      { title: 'Le lieu', goal: 'Faire exister un décor.', minutes: 20, tasks: ['Décris un lieu de ton enfance en une page.'] },
      { title: 'La structure', goal: 'Début, conflit, fin.', minutes: 25, tasks: ['Résume une histoire en 3 phrases : situation, problème, résolution.'] },
      { title: 'Ma première nouvelle', goal: 'Écrire un texte complet de 2 à 3 pages.', minutes: 45, tasks: ['Écris le premier jet d’un seul trait.', 'Laisse reposer 2 jours.'] },
      { title: 'La réécriture', goal: 'Couper, préciser, clarifier.', minutes: 40, tasks: ['Supprime 10 % des mots.', 'Remplace 5 verbes faibles par des verbes précis.'] },
      { title: 'Partager', goal: 'Faire lire ton texte.', minutes: 30, tasks: ['Fais lire à une personne de confiance ou à un atelier d’écriture.', 'Note les retours et décide de ce que tu gardes.'] },
    ],
  },
  {
    id: 'recit-de-vie', category: 'Écriture', title: 'Mon récit de vie', tagline: 'Écrire mes souvenirs, chapitre par chapitre', tone: 'caramel', weeks: 8,
    steps: [
      { title: 'Ma ligne de vie', goal: 'Repérer les grands moments.', minutes: 20, tasks: ['Trace une frise de ta naissance à aujourd’hui avec 10 moments clés.'] },
      { title: 'L’enfance', goal: 'Écrire un souvenir précis.', minutes: 25, tasks: ['Un lieu, une odeur, une personne de ton enfance.'] },
      { title: 'La famille', goal: 'Raconter d’où tu viens.', minutes: 25, tasks: ['Portrait d’un parent ou d’une grand-mère.', 'Une recette ou une tradition familiale.'] },
      { title: 'Les tournants', goal: 'Raconter un choix qui a tout changé.', minutes: 30, tasks: ['Écris la scène du choix, au présent.'] },
      { title: 'Mes vingt ans', goal: 'Ce que j’ai appris.', minutes: 30, tasks: ['Lettre à toi-même à 20 ans.'] },
      { title: 'Aujourd’hui', goal: 'Qui je suis à trente ans.', minutes: 30, tasks: ['Une journée ordinaire racontée en détail.'] },
      { title: 'Demain', goal: 'La femme que je deviens.', minutes: 30, tasks: ['Lettre à toi-même à 40 ans.'] },
      { title: 'Relier les chapitres', goal: 'Rassembler et relire.', minutes: 45, tasks: ['Mets tes textes dans l’ordre, ajoute un titre à chacun.', 'Relis et choisis un titre pour l’ensemble.'] },
    ],
  },
];

export const PATH_CATEGORIES: PathCategory[] = ['Langues', 'Peinture & dessin', 'Écriture'];
export const pathById = (id: unknown) => PATHS.find((p) => p.id === id);
