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
  const list = BOOSTER_DAYS[axis] ?? FALLBACK;
  return list[(day - 1) % list.length]!;
}
