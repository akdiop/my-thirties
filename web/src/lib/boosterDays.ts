/** Une pratique par jour pour chaque axe du booster : un conseil, puis une question pour écrire. */
export type BoosterDay = { titre: string; conseil: string; question: string };

const D = (titre: string, conseil: string, question: string): BoosterDay => ({ titre, conseil, question });

export const BOOSTER_DAYS: Record<string, BoosterDay[]> = {
  'Anxiété': [
    D('Ancrage 5-4-3-2-1', 'Nomme 5 choses que tu vois, 4 que tu touches, 3 que tu entends, 2 que tu sens, 1 que tu goûtes.', 'Qu’as-tu remarqué autour de toi ? Comment te sens-tu après ?'),
    D('Vider sa tête', 'Écris pendant 5 minutes toutes les pensées qui tournent, sans les trier.', 'Écris tout ce qui t’occupe l’esprit en ce moment.'),
    D('Ce qui dépend de moi', 'Prends une inquiétude et sépare ce qui dépend de toi de ce qui n’en dépend pas.', 'Quelle inquiétude ? Qu’est-ce qui dépend de toi, et qu’est-ce qui n’en dépend pas ?'),
    D('Respiration lente', 'Inspire 4 secondes, expire 6 secondes, pendant 2 minutes.', 'Comment était ton corps avant, puis après ?'),
    D('Le pire, le meilleur, le plus probable', 'Pour une situation qui t’inquiète, imagine les trois scénarios.', 'Le pire, le meilleur, et le plus probable : qu’écris-tu pour chacun ?'),
    D('Un petit pas', 'Choisis une seule action minuscule qui fait avancer ce qui t’inquiète.', 'Quel petit pas as-tu choisi ? L’as-tu fait ?'),
    D('Bilan de la semaine', 'Relis tes notes des jours précédents.', 'Qu’est-ce qui t’a le plus aidée à retrouver du calme cette semaine ?'),
  ],
  'Nervosité': [
    D('Nommer la sensation', 'Quand la tension monte, dis-toi simplement : « je suis nerveuse ». Nommer apaise.', 'Où as-tu senti la nervosité dans ton corps aujourd’hui ?'),
    D('Repérer le déclencheur', 'Note ce qui s’est passé juste avant que la tension monte.', 'Quel a été le déclencheur ? Est-ce qu’il revient souvent ?'),
    D('Relâcher les épaules', 'Plusieurs fois dans la journée, baisse les épaules et desserre la mâchoire.', 'Combien de fois as-tu pensé à te relâcher ? Qu’as-tu ressenti ?'),
    D('Ralentir un geste', 'Fais une tâche habituelle deux fois plus lentement (boire un thé, marcher).', 'Quelle tâche as-tu ralentie ? Qu’as-tu remarqué ?'),
    D('Bouger 10 minutes', 'Marche ou danse 10 minutes pour évacuer la tension.', 'Comment te sentais-tu avant et après ?'),
    D('Moins de stimulants', 'Observe ta consommation de café, d’écrans et de notifications aujourd’hui.', 'Qu’est-ce qui t’a le plus agitée aujourd’hui ? Que peux-tu réduire ?'),
    D('Bilan de la semaine', 'Relis tes notes des jours précédents.', 'Quel petit geste a rendu les moments tendus plus confortables ?'),
  ],
  'Impulsivité': [
    D('Méthode STOP', 'Stop, Temps de respirer, Observer ce que tu ressens, Poursuivre en choisissant ta réaction.', 'Raconte un moment où tu as pu (ou aurais pu) faire STOP.'),
    D('Ce que je veux vraiment dire', 'Avant de répondre à une situation délicate, note ce que tu veux vraiment exprimer.', 'Qu’avais-tu envie de dire, et que voulais-tu vraiment exprimer ?'),
    D('Différer de 10 minutes', 'Pour un message ou un achat qui te tente sur le coup, attends 10 minutes.', 'Qu’as-tu différé ? Ton envie était-elle la même après ?'),
    D('Mes déclencheurs', 'Repère les situations où tu réagis trop vite (fatigue, faim, une personne précise…).', 'Quels sont tes déclencheurs les plus fréquents ?'),
    D('Le brouillon', 'Écris ta réponse dans tes notes avant de l’envoyer, relis-la plus tard.', 'Qu’as-tu changé en relisant ton brouillon ?'),
    D('Le corps d’abord', 'Quand l’émotion monte, repère le signal physique (chaleur, cœur qui accélère).', 'Quel signal ton corps t’envoie-t-il avant de réagir ?'),
    D('Bilan de la semaine', 'Relis tes notes des jours précédents.', 'As-tu pu choisir des réponses plus proches de tes intentions ?'),
  ],
  'Patience': [
    D('Ralentir volontairement', 'Choisis une situation où tu peux ralentir et observer ton ressenti.', 'Qu’as-tu remarqué en prenant ton temps ?'),
    D('La file d’attente', 'Dans une attente (file, embouteillage), respire et observe au lieu de prendre ton téléphone.', 'Comment as-tu vécu cette attente ?'),
    D('Écouter jusqu’au bout', 'Dans une conversation, laisse l’autre finir complètement avant de répondre.', 'Qu’as-tu entendu de plus en écoutant jusqu’au bout ?'),
    D('Ce qui prend du temps', 'Pense à quelque chose de beau dans ta vie qui a pris du temps à se construire.', 'Qu’est-ce qui a pris du temps, et pourquoi ça en valait la peine ?'),
    D('Une tâche jusqu’au bout', 'Fais une seule tâche du début à la fin, sans passer à autre chose.', 'Quelle tâche ? Qu’as-tu ressenti en la terminant ?'),
    D('Indulgence', 'Quand quelqu’un te fait attendre, imagine une raison bienveillante.', 'Quelle situation ? Quelle raison bienveillante as-tu imaginée ?'),
    D('Bilan de la semaine', 'Relis tes notes des jours précédents.', 'Dans quelles situations as-tu été plus patiente que d’habitude ?'),
  ],
  'Confiance en soi': [
    D('Une réussite ordinaire', 'Note une action dont tu es satisfaite, même si elle paraît banale.', 'Qu’as-tu bien fait aujourd’hui ?'),
    D('Mes qualités', 'Écris trois qualités que tes proches te reconnaissent.', 'Quelles sont ces trois qualités ? Quand les as-tu montrées récemment ?'),
    D('Un petit défi', 'Fais une chose qui te sort un peu de ta zone de confort.', 'Quel défi as-tu relevé ? Comment t’es-tu sentie ?'),
    D('Parler de soi avec douceur', 'Remarque une critique intérieure et reformule-la comme tu parlerais à une amie.', 'Quelle critique ? Comment l’as-tu reformulée ?'),
    D('Ce que j’ai déjà traversé', 'Pense à une période difficile que tu as surmontée.', 'Qu’est-ce que cette période t’a appris sur ta force ?'),
    D('Accepter un compliment', 'Aujourd’hui, réponds simplement « merci » à un compliment, sans le minimiser.', 'As-tu reçu un compliment ? Qu’as-tu ressenti en l’acceptant ?'),
    D('Bilan de la semaine', 'Relis tes notes des jours précédents.', 'Qu’est-ce que cette semaine dit de tes ressources ?'),
  ],
  'Gestion des conflits': [
    D('Faits et ressenti', 'Reformule un désaccord en séparant les faits de ce que tu as ressenti.', 'Quels étaient les faits ? Qu’as-tu ressenti ?'),
    D('Mon besoin', 'Derrière un agacement, cherche le besoin (respect, repos, reconnaissance…).', 'Quel besoin se cachait derrière ton agacement ?'),
    D('Le « je » plutôt que le « tu »', 'Prépare une phrase qui commence par « je » au lieu de « tu as encore… ».', 'Écris ta phrase en « je ».'),
    D('Le point de vue de l’autre', 'Imagine la situation du point de vue de l’autre personne.', 'Qu’est-ce que l’autre personne a pu ressentir ou vouloir ?'),
    D('Choisir le bon moment', 'Repère si un conflit mérite d’être abordé maintenant, plus tard, ou pas du tout.', 'Quel conflit ? Quand est-ce le bon moment pour en parler ?'),
    D('Proposer une solution', 'Prépare une proposition concrète qui respecte vos deux besoins.', 'Quelle solution pourrais-tu proposer ?'),
    D('Bilan de la semaine', 'Relis tes notes des jours précédents.', 'Quelle formulation te paraît à la fois claire et respectueuse ?'),
  ],
  'Lâcher-prise': [
    D('Deux colonnes', 'Sépare sur une page ce qui dépend de toi de ce qui n’en dépend pas.', 'Qu’as-tu mis dans chaque colonne ?'),
    D('Laisser en suspens', 'Choisis une chose que tu acceptes de ne pas régler aujourd’hui.', 'Qu’as-tu laissé en suspens ? Comment te sens-tu ?'),
    D('Le « assez bien »', 'Termine une tâche « assez bien » plutôt que parfaitement.', 'Quelle tâche ? Qu’est-ce que ça t’a libéré ?'),
    D('Pardonner une petite chose', 'Pense à une petite contrariété et décide de la laisser partir.', 'Quelle contrariété as-tu choisi de laisser partir ?'),
    D('Le moment présent', 'Prends 5 minutes pour faire une seule chose en pleine attention.', 'Qu’as-tu fait ? Qu’as-tu remarqué ?'),
    D('Ce que je ne contrôle pas', 'Écris une chose que tu ne contrôles pas, puis « j’accepte de ne pas la contrôler ».', 'Qu’as-tu écrit ? Qu’est-ce que ça change ?'),
    D('Bilan de la semaine', 'Relis tes notes des jours précédents.', 'Qu’est-ce qui a été plus léger à porter cette semaine ?'),
  ],
  'Affirmation de soi': [
    D('Une demande simple', 'Formule une demande avec « je », sans te justifier trop longtemps.', 'Quelle demande as-tu formulée ? Comment ça s’est passé ?'),
    D('Dire non', 'Prépare une façon de dire non avec douceur : « Merci, mais je ne peux pas ».', 'À quoi aimerais-tu dire non en ce moment ?'),
    D('Donner mon avis', 'Dans une discussion, donne ton avis même s’il est différent.', 'Quel avis as-tu partagé ? Comment a-t-il été reçu ?'),
    D('Mes limites', 'Liste trois limites qui sont importantes pour toi.', 'Quelles sont tes trois limites ?'),
    D('La posture', 'Tiens-toi droite, regarde dans les yeux, parle un peu plus lentement.', 'Dans quelle situation l’as-tu essayé ? Qu’as-tu remarqué ?'),
    D('Mes envies', 'Ose exprimer une envie personnelle (un resto, une sortie, un moment pour toi).', 'Quelle envie as-tu exprimée ?'),
    D('Bilan de la semaine', 'Relis tes notes des jours précédents.', 'Comment te sens-tu après avoir clarifié tes besoins ?'),
  ],
};

const FALLBACK: BoosterDay[] = [
  D('Un moment pour moi', 'Prends 10 minutes rien que pour toi.', 'Qu’as-tu fait de ce moment ?'),
];

export function boosterDay(axis: string, day: number): BoosterDay {
  const quest = QUESTS.find((q) => q.title === axis);
  if (quest) { const w = quest.weeks[Math.min(3, Math.floor((day - 1) / 7))]!; return w.days[(day - 1) % 7]!; }
  const list = BOOSTER_DAYS[axis] ?? FALLBACK;
  return list[(day - 1) % list.length]!;
}

/** Quêtes de 4 semaines : un thème par semaine, une pratique par jour, et un bilan le 7e jour. */
export type Quest = { id: string; title: string; why: string; weeks: { theme: string; days: BoosterDay[] }[] };
const bilan = (theme: string) => D('Bilan de la semaine', 'Relis tes notes des six derniers jours.', `Qu’est-ce que la semaine « ${theme} » a changé pour moi ?`);
const W = (theme: string, days: BoosterDay[]) => ({ theme, days: [...days, bilan(theme)] });

export const QUESTS: Quest[] = [
  { id: 'confiance', title: 'Quête · Confiance en moi', why: 'Quatre semaines pour te voir avec plus de justesse et oser davantage.', weeks: [
    W('Me connaître', [
      D('Mes forces', 'Liste cinq choses que tu fais bien, même petites.', 'Quelles sont mes cinq forces ?'),
      D('Ce que les autres voient', 'Demande à une proche ce qu’elle apprécie chez toi.', 'Qu’ai-je appris en lui demandant ?'),
      D('Ma fierté', 'Repense à une période dont tu es fière.', 'Qu’est-ce que cette période dit de moi ?'),
      D('Mes valeurs', 'Choisis tes trois valeurs les plus importantes.', 'Comment je les ai vécues aujourd’hui ?'),
      D('Mon énergie', 'Repère ce qui te donne de l’énergie et ce qui t’en prend.', 'Qu’est-ce qui m’a nourrie aujourd’hui ?'),
      D('Ma voix intérieure', 'Remarque comment tu te parles quand tu te trompes.', 'Quelle phrase dure me suis-je dite, et comment la reformuler ?'),
    ]),
    W('Parler de moi avec douceur', [
      D('Une phrase gentille', 'Dis-toi une phrase que tu dirais à une amie.', 'Quelle phrase ai-je choisie ?'),
      D('Accepter un compliment', 'Réponds juste « merci », sans minimiser.', 'Comment je me suis sentie ?'),
      D('Mes progrès', 'Compare-toi à toi d’il y a un an, pas aux autres.', 'Qu’est-ce qui a progressé chez moi ?'),
      D('Mon corps allié', 'Remercie ton corps pour une chose qu’il fait pour toi.', 'Pour quoi ai-je remercié mon corps ?'),
      D('Pas de comparaison', 'Une journée sans regarder la vie des autres sur les réseaux.', 'Qu’est-ce que ça a changé ?'),
      D('Mon erreur bienveillante', 'Repense à une erreur et à ce qu’elle t’a appris.', 'Qu’est-ce que cette erreur m’a appris ?'),
    ]),
    W('Oser', [
      D('Un petit oui', 'Dis oui à une proposition qui te fait un peu peur.', 'À quoi ai-je dit oui ?'),
      D('Donner mon avis', 'Partage ton avis dans une discussion.', 'Comment a-t-il été reçu ?'),
      D('Demander', 'Demande une chose dont tu as besoin.', 'Qu’ai-je demandé, et qu’est-ce qui s’est passé ?'),
      D('Une première fois', 'Essaie quelque chose de nouveau, même minuscule.', 'Qu’ai-je essayé ?'),
      D('Ma posture', 'Tiens-toi droite et parle lentement toute la journée.', 'Qu’ai-je remarqué ?'),
      D('Dire non', 'Refuse une chose qui ne te convient pas, avec douceur.', 'À quoi ai-je dit non ?'),
    ]),
    W('Ancrer', [
      D('Ma liste de victoires', 'Note dix victoires de ta vie.', 'Quelles sont mes dix victoires ?'),
      D('Mon mantra', 'Choisis une phrase qui te donne de la force.', 'Quel est mon mantra ?'),
      D('Mon modèle', 'Pense à une femme qui t’inspire et à ce que tu partages avec elle.', 'Qu’ai-je en commun avec elle ?'),
      D('Mon prochain défi', 'Choisis un défi pour le mois prochain.', 'Quel défi je me lance ?'),
      D('Ma lettre', 'Écris une lettre à la toi qui doute.', 'Que lui dis-je ?'),
      D('Célébrer', 'Offre-toi un moment pour fêter ces quatre semaines.', 'Comment ai-je célébré ?'),
    ]),
  ] },
  { id: 'argent', title: 'Quête · Mon argent serein', why: 'Quatre semaines pour voir clair, dépenser en conscience et épargner sans stress.', weeks: [
    W('Voir clair', [
      D('Mes revenus', 'Note tout ce qui rentre chaque mois.', 'Combien je gagne vraiment par mois ?'),
      D('Mes charges fixes', 'Liste loyer, factures, abonnements.', 'Quelles charges je découvre ?'),
      D('Mes dépenses du jour', 'Note toutes tes dépenses dans Mes finances.', 'Qu’est-ce qui m’a surprise ?'),
      D('Mes abonnements', 'Vérifie ceux que tu utilises vraiment.', 'Lesquels puis-je arrêter ?'),
      D('Mon rapport à l’argent', 'Repense à ce qu’on disait de l’argent chez toi.', 'Quelle croyance ai-je héritée ?'),
      D('Mes dettes', 'Fais la liste de ce que tu dois, sans jugement.', 'Comment je me sens en la voyant ?'),
    ]),
    W('Dépenser en conscience', [
      D('La règle des 24 h', 'Attends un jour avant un achat non prévu.', 'Qu’ai-je finalement décidé ?'),
      D('Mes achats plaisir', 'Repère ce qui te fait vraiment plaisir.', 'Quels achats valent vraiment le coup pour moi ?'),
      D('Une journée sans dépense', 'Ne rien acheter d’autre que l’essentiel.', 'Était-ce facile ?'),
      D('Cuisiner maison', 'Prépare tes repas au lieu de commander.', 'Combien ai-je économisé ?'),
      D('Comparer', 'Compare le prix d’une dépense régulière.', 'Qu’ai-je trouvé ?'),
      D('Mes déclencheurs', 'Repère quand tu dépenses sans y penser.', 'Quels sont mes déclencheurs ?'),
    ]),
    W('Épargner', [
      D('Mon objectif', 'Choisis un projet et son montant.', 'Pour quoi j’épargne ?'),
      D('Payer moi d’abord', 'Programme un virement épargne le jour de la paie.', 'Quel montant ai-je choisi ?'),
      D('Mon coussin de sécurité', 'Calcule trois mois de charges.', 'Combien me faut-il ?'),
      D('Arrondir', 'Mets de côté la monnaie ou les arrondis.', 'Combien ai-je mis de côté ?'),
      D('Vendre', 'Repère un objet que tu n’utilises plus.', 'Que puis-je vendre ou donner ?'),
      D('Mon tableau', 'Note où tu en es de ton objectif.', 'À combien de pourcents suis-je ?'),
    ]),
    W('Construire', [
      D('Mon budget', 'Répartis besoins, envies et épargne.', 'Quelle répartition me convient ?'),
      D('Apprendre', 'Lis ou regarde un contenu sérieux sur l’épargne.', 'Qu’ai-je appris ?'),
      D('Augmenter mes revenus', 'Note une idée pour gagner plus.', 'Quelle idée ai-je eue ?'),
      D('Parler d’argent', 'Discute d’argent avec une personne de confiance.', 'Qu’est-ce que la discussion m’a apporté ?'),
      D('Ma règle d’or', 'Choisis une règle que tu gardes.', 'Quelle règle je garde ?'),
      D('Célébrer', 'Regarde le chemin parcouru en un mois.', 'De quoi suis-je fière ?'),
    ]),
  ] },
  { id: 'relations', title: 'Quête · Des relations qui me font du bien', why: 'Quatre semaines pour nourrir les liens qui comptent et poser tes limites.', weeks: [
    W('Faire le point', [
      D('Mon cercle', 'Note les personnes qui comptent le plus.', 'Qui sont-elles ?'),
      D('Ce qui me nourrit', 'Repère avec qui tu te sens toi-même.', 'Avec qui je me sens bien, et pourquoi ?'),
      D('Ce qui me pèse', 'Repère une relation qui te fatigue.', 'Qu’est-ce qui me fatigue dans ce lien ?'),
      D('Mes besoins', 'Liste ce dont tu as besoin dans une relation.', 'Quels sont mes besoins ?'),
      D('Ma façon d’aimer', 'Comment montres-tu ton affection ?', 'Comment j’exprime mon amour ?'),
      D('Le lien oublié', 'Pense à quelqu’un que tu as perdu de vue.', 'Qui ai-je envie de recontacter ?'),
    ]),
    W('Nourrir', [
      D('Un appel', 'Appelle quelqu’un qui compte.', 'Qui ai-je appelé ?'),
      D('Un message de gratitude', 'Dis à quelqu’un ce qu’il t’apporte.', 'À qui ai-je écrit ?'),
      D('Écouter vraiment', 'Écoute sans préparer ta réponse.', 'Qu’ai-je entendu de nouveau ?'),
      D('Un moment partagé', 'Un repas, une marche, un thé.', 'Avec qui ai-je partagé un moment ?'),
      D('Une attention', 'Un petit geste pour quelqu’un.', 'Quel geste ai-je fait ?'),
      D('Reprendre contact', 'Écris à la personne perdue de vue.', 'Comment a-t-elle réagi ?'),
    ]),
    W('Poser mes limites', [
      D('Mes limites', 'Liste trois limites importantes pour toi.', 'Quelles sont-elles ?'),
      D('Dire non', 'Refuse une demande qui ne te convient pas.', 'Comment je l’ai formulé ?'),
      D('Le « je »', 'Exprime un besoin en commençant par « je ».', 'Qu’ai-je exprimé ?'),
      D('Prendre de la distance', 'Moins de temps avec un lien qui te pèse.', 'Qu’est-ce que ça m’a apporté ?'),
      D('Mon temps à moi', 'Bloque un moment rien que pour toi.', 'Qu’ai-je fait de ce moment ?'),
      D('Une conversation honnête', 'Aborde un sujet que tu évites, avec douceur.', 'Comment s’est passée la conversation ?'),
    ]),
    W('Approfondir', [
      D('Pardonner', 'Pense à une rancune que tu peux laisser partir.', 'Qu’ai-je décidé de laisser partir ?'),
      D('Remercier', 'Remercie quelqu’un pour son soutien cette année.', 'Qui ai-je remercié ?'),
      D('Un nouveau lien', 'Fais le premier pas vers quelqu’un que tu apprécies.', 'Vers qui suis-je allée ?'),
      D('Mon entourage idéal', 'Décris les relations que tu veux dans 5 ans.', 'À quoi ressemble mon entourage idéal ?'),
      D('Un rituel', 'Crée un rendez-vous régulier avec un proche.', 'Quel rituel ai-je créé ?'),
      D('Célébrer', 'Partage un moment joyeux avec ceux que tu aimes.', 'Avec qui ai-je célébré ?'),
    ]),
  ] },
  { id: 'sens', title: 'Quête · Le sens de ma vie', why: 'Quatre semaines pour clarifier ce qui compte et aligner tes journées dessus.', weeks: [
    W('Ce qui compte', [
      D('Mes moments de joie', 'Repense à trois moments où tu étais pleinement heureuse.', 'Qu’avaient-ils en commun ?'),
      D('Mes valeurs', 'Choisis tes cinq valeurs principales.', 'Lesquelles je vis vraiment ?'),
      D('Mes talents', 'Ce que tu fais facilement et que d’autres trouvent difficile.', 'Quels sont mes talents ?'),
      D('Ce qui m’indigne', 'Une cause qui te touche profondément.', 'Quelle cause me touche ?'),
      D('Mes regrets possibles', 'Qu’est-ce que tu regretterais de ne pas avoir fait ?', 'Que ne veux-je pas regretter ?'),
      D('Mon héritage', 'Ce que tu aimerais transmettre.', 'Que veux-je laisser derrière moi ?'),
    ]),
    W('Ma vision', [
      D('Dans un an', 'Décris une journée idéale dans un an.', 'À quoi ressemble-t-elle ?'),
      D('Dans cinq ans', 'Où vis-tu, que fais-tu, avec qui ?', 'Qu’est-ce qui me fait vibrer dans cette vision ?'),
      D('Mes rôles', 'Fille, amie, professionnelle, croyante… Liste tes rôles.', 'Lequel ai-je négligé ?'),
      D('Mes trois mots', 'Trois mots pour la femme que tu deviens.', 'Quels sont mes trois mots ?'),
      D('Ma mission', 'Une phrase qui résume pourquoi tu te lèves le matin.', 'Quelle est ma phrase ?'),
      D('Ma foi', 'Ce que ta foi t’apporte au quotidien.', 'Comment ma foi guide-t-elle mes choix ?'),
    ]),
    W('M’aligner', [
      D('Mon agenda', 'Regarde ta semaine : reflète-t-elle tes valeurs ?', 'Qu’est-ce qui n’est pas aligné ?'),
      D('Un renoncement', 'Une chose à arrêter pour faire de la place.', 'À quoi je renonce ?'),
      D('Une action', 'Un pas concret vers ta vision.', 'Quel pas ai-je fait ?'),
      D('Mon environnement', 'Un changement dans ton espace qui t’aide.', 'Qu’ai-je changé ?'),
      D('Mes habitudes', 'Une habitude qui sert ta mission.', 'Quelle habitude j’adopte ?'),
      D('Un mentor', 'Une personne qui pourrait te guider.', 'Qui pourrait m’accompagner ?'),
    ]),
    W('Avancer', [
      D('Mon objectif à 90 jours', 'Un objectif clair pour les trois prochains mois.', 'Quel est-il ?'),
      D('Mes étapes', 'Découpe-le en étapes dans Ma boussole.', 'Quelle est la première étape ?'),
      D('Mes obstacles', 'Ce qui pourrait te freiner, et ta parade.', 'Quelle est ma parade ?'),
      D('Mon soutien', 'Partage ton objectif avec quelqu’un.', 'À qui l’ai-je dit ?'),
      D('Ma lettre', 'Écris à la toi d’un an plus tard.', 'Que lui dis-je ?'),
      D('Célébrer', 'Fête ces quatre semaines de réflexion.', 'Qu’est-ce que je retiens ?'),
    ]),
  ] },
];

export const questByTitle = (title: string) => QUESTS.find((q) => q.title === title);
