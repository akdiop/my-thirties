export const CONTENT_NOTICE =
  'Contenus pédagogiques de bien-être, à relire. Ils ne remplacent pas un accompagnement par une ou un professionnel. Si la détresse est forte ou dure, parlez-en à une personne de confiance ou à un médecin.';

export type Axis = {
  id: string;
  title: string;
  subtitle: string;
  priority: boolean;
  explanation: string;
  exercises: { title: string; steps: string[] }[];
  questions: string[];
  situation: string;
};

export const AXES: Axis[] = [
  {
    id: 'anxiete',
    title: 'Anxiété',
    subtitle: 'Apaiser mes inquiétudes',
    priority: true,
    explanation:
      'L’anxiété est une réaction d’alerte face à une menace possible, souvent future. Elle se nourrit de scénarios « et si… ». L’objectif n’est pas de la faire disparaître, mais de la ramener à une taille gérable.',
    exercises: [
      { title: 'Ancrage 5-4-3-2-1', steps: ['Nommez 5 choses que vous voyez.', '4 choses que vous pouvez toucher.', '3 sons que vous entendez.', '2 odeurs.', '1 goût, ou une chose pour laquelle vous êtes reconnaissante.'] },
      { title: 'Faits ou suppositions', steps: ['Écrivez l’inquiétude en une phrase.', 'Listez les faits vérifiables.', 'Listez ce qui relève de la supposition.', 'Notez ce qui est en votre pouvoir aujourd’hui.'] },
    ],
    questions: ['Quelle est la probabilité réelle de ce scénario ?', 'Si une amie vivait cela, que lui diriez-vous ?', 'Que puis-je faire, même petit, dans les 24 heures ?'],
    situation: 'Veille d’une présentation : préparez la première minute à l’oral, puis faites l’ancrage avant d’entrer.',
  },
  {
    id: 'nervosite',
    title: 'Nervosité',
    subtitle: 'Retrouver mon calme',
    priority: true,
    explanation:
      'La nervosité se lit dans le corps : mâchoire serrée, épaules hautes, souffle court. Repérer ces signaux tôt permet de relâcher avant que la tension monte.',
    exercises: [
      { title: 'Balayage corporel express', steps: ['Fermez les yeux ou baissez le regard.', 'Relâchez la mâchoire, puis les épaules.', 'Laissez le ventre se gonfler à l’inspiration.', 'Expirez plus longtemps que vous n’inspirez, 5 fois.'] },
      { title: 'Pause consciente', steps: ['Toutes les 90 minutes, levez-vous.', 'Buvez un verre d’eau.', 'Trois respirations lentes avant de reprendre.'] },
    ],
    questions: ['Où est-ce que je ressens la tension en ce moment ?', 'Qu’est-ce qui l’a déclenchée ?', 'De quoi ai-je besoin, là, maintenant ?'],
    situation: 'Embouteillage avant un rendez-vous : prévenez d’un retard possible, puis faites la respiration 4-6 à l’arrêt.',
  },
  {
    id: 'impulsivite',
    title: 'Impulsivité',
    subtitle: 'Réagir avec plus de recul',
    priority: true,
    explanation:
      'Une réaction impulsive arrive avant la réflexion. Créer un court espace entre l’émotion et l’action suffit souvent à choisir une réponse qui vous ressemble davantage.',
    exercises: [
      { title: 'Méthode STOP', steps: ['S : stop, je m’arrête.', 'T : je prends une respiration.', 'O : j’observe ce que je ressens et pense.', 'P : je poursuis en choisissant ma réponse.'] },
      { title: 'Différer la réponse', steps: ['Message qui agace : ne répondez pas tout de suite.', 'Écrivez votre réponse dans les notes.', 'Relisez une heure plus tard avant d’envoyer.'] },
    ],
    questions: ['Qu’est-ce que je veux obtenir avec cette réaction ?', 'Comment me sentirai-je dans une heure si je réagis ainsi ?', 'Quelle réponse serait ferme et respectueuse ?'],
    situation: 'Remarque blessante en réunion : dites « je reviens vers toi sur ce point », puis appliquez STOP.',
  },
  {
    id: 'patience',
    title: 'Patience',
    subtitle: 'Accueillir le rythme des choses',
    priority: false,
    explanation: 'La patience n’est pas l’attente passive : c’est accepter que certains résultats prennent du temps, tout en continuant d’agir.',
    exercises: [{ title: 'L’attente utile', steps: ['Repérez une attente de la journée (file, trajet).', 'Respirez 3 fois lentement.', 'Observez 3 détails autour de vous.'] }],
    questions: ['Qu’est-ce qui m’impatiente vraiment ?', 'Qu’est-ce qui progresse déjà, même lentement ?'],
    situation: 'Un projet qui avance moins vite que prévu : notez les 3 petites avancées de la semaine.',
  },
  {
    id: 'confiance',
    title: 'Confiance en soi',
    subtitle: 'Croire en mes capacités',
    priority: false,
    explanation: 'La confiance se construit par des preuves : des actions tenues, même petites. Elle grandit en agissant, pas en attendant de se sentir prête.',
    exercises: [{ title: 'Carnet de preuves', steps: ['Chaque soir, notez une chose réussie.', 'Notez la qualité qu’elle montre.', 'Relisez le carnet le dimanche.'] }],
    questions: ['Quelle difficulté ai-je déjà surmontée ?', 'Que dirait de moi une personne qui me connaît bien ?'],
    situation: 'Avant une demande importante : relisez trois preuves de votre carnet.',
  },
  {
    id: 'affirmation',
    title: 'Affirmation de soi',
    subtitle: 'Dire avec respect',
    priority: false,
    explanation: 'S’affirmer, c’est exprimer ses besoins et ses limites clairement, sans agresser ni s’effacer.',
    exercises: [{ title: 'La phrase en « je »', steps: ['Quand… (le fait observable).', 'Je me sens… (l’émotion).', 'J’ai besoin de… (le besoin).', 'Est-ce que tu pourrais… (la demande précise).'] }],
    questions: ['Quelle limite ai-je du mal à poser ?', 'Quelle est ma demande précise ?'],
    situation: 'Une collègue vous confie encore une tâche : « Je ne peux pas cette semaine, je peux mardi prochain. »',
  },
  {
    id: 'conflits',
    title: 'Gestion des conflits',
    subtitle: 'Désamorcer sans renoncer',
    priority: false,
    explanation: 'Un conflit porte souvent sur des besoins différents. Chercher le besoin derrière la position ouvre des solutions.',
    exercises: [{ title: 'Reformuler', steps: ['Écoutez sans interrompre.', '« Si je comprends bien, tu… »', 'Demandez : « Qu’est-ce qui compte le plus pour toi ? »', 'Proposez une option qui respecte les deux besoins.'] }],
    questions: ['Quel est mon besoin dans ce désaccord ?', 'Et le sien ?'],
    situation: 'Désaccord familial : proposez d’en reparler à un moment calme, fixé ensemble.',
  },
  {
    id: 'emotions',
    title: 'Gestion des émotions',
    subtitle: 'Mieux comprendre mes réactions',
    priority: false,
    explanation: 'Nommer une émotion avec précision aide déjà à la réguler. Le journal émotionnel sert à repérer vos déclencheurs et ce qui vous aide.',
    exercises: [{ title: 'Nommer pour apaiser', steps: ['Quelle émotion ? Soyez précise.', 'Quelle intensité de 0 à 10 ?', 'Où dans le corps ?', 'De quoi ai-je besoin ?'] }],
    questions: ['Quelle émotion revient le plus ce mois-ci ?', 'Quelle stratégie m’a le plus aidée ?'],
    situation: 'Après une journée lourde : une entrée de journal émotionnel de 3 minutes.',
  },
  {
    id: 'lacher-prise',
    title: 'Lâcher-prise',
    subtitle: 'Distinguer ce qui dépend de moi',
    priority: false,
    explanation: 'Une partie de la charge mentale vient de ce qui ne dépend pas de nous. Trier aide à investir son énergie au bon endroit.',
    exercises: [{ title: 'Les deux colonnes', steps: ['Listez ce qui vous préoccupe.', 'Colonne 1 : ce qui dépend de moi.', 'Colonne 2 : ce qui n’en dépend pas.', 'Choisissez une action dans la colonne 1.'] }],
    questions: ['Qu’est-ce que je peux laisser aller aujourd’hui ?'],
    situation: 'Inquiétude pour une décision d’autrui : notez ce que vous pouvez dire, puis laissez la décision lui appartenir.',
  },
  {
    id: 'intelligence',
    title: 'Intelligence émotionnelle',
    subtitle: 'Me comprendre et comprendre les autres',
    priority: false,
    explanation: 'Reconnaître ses émotions, celles des autres, et en tenir compte dans ses choix.',
    exercises: [{ title: 'Lecture de l’autre', steps: ['Observez le ton, la posture, le rythme.', 'Faites une hypothèse sur l’émotion.', 'Vérifiez avec une question ouverte.'] }],
    questions: ['Comment mon humeur influence-t-elle mes échanges ?'],
    situation: 'Une amie répond sèchement : « Tu as l’air fatiguée, ça va ? »',
  },
];

export type ProgramDay = { title: string; steps: string[]; question: string };

export type Program = { id: string; axisId: string; title: string; objective: string; days: ProgramDay[] };

export const PROGRAMS: Program[] = [
  {
    id: 'anxiete-7',
    axisId: 'anxiete',
    title: 'Apaiser l’anxiété',
    objective: 'Réduire la place des inquiétudes et retrouver des repères concrets.',
    days: [
      { title: 'Repérer', steps: ['Notez 3 inquiétudes du moment.', 'Respiration 4-6 pendant 3 minutes.'], question: 'Laquelle prend le plus de place ?' },
      { title: 'Faits ou suppositions', steps: ['Appliquez l’exercice à une inquiétude.', 'Ancrage 5-4-3-2-1.'], question: 'Qu’est-ce qui est vraiment un fait ?' },
      { title: 'Le pire, le meilleur, le probable', steps: ['Écrivez les trois scénarios.', 'Notez une action pour le probable.'], question: 'Quel scénario est le plus probable ?' },
      { title: 'Moment d’inquiétude', steps: ['Réservez 15 minutes pour vous inquiéter.', 'En dehors, notez et reportez à ce moment.'], question: 'Qu’est-ce qui a changé en reportant ?' },
      { title: 'Le corps d’abord', steps: ['Marche de 15 minutes.', 'Balayage corporel express.'], question: 'Où se loge l’anxiété dans mon corps ?' },
      { title: 'L’incertitude', steps: ['Notez une incertitude que vous acceptez déjà.', 'Respiration 4-6.'], question: 'Qu’ai-je déjà su traverser sans savoir ?' },
      { title: 'Bilan de la semaine', steps: ['Relisez vos notes.', 'Choisissez la stratégie à garder.'], question: 'Qu’est-ce qui m’a le plus aidée ?' },
    ],
  },
  {
    id: 'nervosite-7',
    axisId: 'nervosite',
    title: 'Retrouver mon calme',
    objective: 'Repérer les tensions tôt et installer des pauses qui apaisent.',
    days: [
      { title: 'Signaux du corps', steps: ['Trois fois aujourd’hui, faites le balayage express.'], question: 'Quel signal apparaît en premier ?' },
      { title: 'Déclencheurs', steps: ['Notez chaque moment de tension et sa cause.'], question: 'Quel déclencheur revient ?' },
      { title: 'Pauses conscientes', steps: ['Une pause toutes les 90 minutes.', 'Un verre d’eau à chaque pause.'], question: 'Quelle pause a le plus aidé ?' },
      { title: 'Expiration longue', steps: ['Respiration 4-6, 5 minutes, deux fois.'], question: 'Comment je me sens après ?' },
      { title: 'Ralentir', steps: ['Faites une tâche du quotidien deux fois plus lentement.'], question: 'Qu’ai-je remarqué ?' },
      { title: 'Écran et sommeil', steps: ['Pas d’écran 30 minutes avant de dormir.'], question: 'Mon endormissement a-t-il changé ?' },
      { title: 'Bilan', steps: ['Relisez la semaine.', 'Gardez deux habitudes.'], question: 'Quelles habitudes je garde ?' },
    ],
  },
  {
    id: 'impulsivite-7',
    axisId: 'impulsivite',
    title: 'Réagir avec recul',
    objective: 'Créer un espace entre l’émotion et la réaction.',
    days: [
      { title: 'Observer', steps: ['Notez une réaction rapide de la journée.', 'Qu’est-ce qui l’a précédée ?'], question: 'Quel était le déclencheur ?' },
      { title: 'STOP', steps: ['Apprenez la méthode STOP.', 'Utilisez-la une fois.'], question: 'Qu’a changé la pause ?' },
      { title: 'Différer', steps: ['Attendez une heure avant de répondre à un message qui agace.'], question: 'Ma réponse a-t-elle changé ?' },
      { title: 'Le besoin derrière', steps: ['Pour une réaction, identifiez votre besoin.'], question: 'De quoi avais-je besoin ?' },
      { title: 'Phrase en « je »', steps: ['Préparez une phrase en « je » pour une situation récurrente.'], question: 'Comment a-t-elle été reçue ?' },
      { title: 'Prévoir', steps: ['Repérez une situation à risque de demain.', 'Préparez votre réponse.'], question: 'Qu’est-ce que je dirai ?' },
      { title: 'Bilan', steps: ['Comptez vos pauses de la semaine.', 'Félicitez-vous pour chacune.'], question: 'Quel progrès je remarque ?' },
    ],
  },
];

const ANXIETE_WEEK2: ProgramDay[] = [
  { title: 'Carte des inquiétudes', steps: ['Classez vos inquiétudes : santé, travail, proches, argent, autre.', 'Entourez celle qui revient le plus.'], question: 'Quel thème revient le plus souvent ?' },
  { title: 'Le petit pas', steps: ['Choisissez une inquiétude.', 'Faites une action de moins de 10 minutes qui la concerne.'], question: 'Comment me suis-je sentie après avoir agi ?' },
  { title: 'Parler à soi avec douceur', steps: ['Écrivez ce que vous diriez à une amie dans votre situation.', 'Relisez-le à voix basse.'], question: 'Qu’est-ce qui change quand je me parle ainsi ?' },
  { title: 'Ancrage en mouvement', steps: ['Marche de 10 minutes en comptant vos pas par 4.', 'Inspirez sur 4 pas, expirez sur 6.'], question: 'Mon esprit s’est-il calmé en marchant ?' },
  { title: 'Moins d’écrans anxiogènes', steps: ['Repérez une source d’informations qui vous inquiète.', 'Limitez-la à un moment choisi dans la journée.'], question: 'Ai-je remarqué une différence ?' },
  { title: 'Ressources', steps: ['Listez 3 personnes ou ressources qui vous aident quand ça va mal.', 'Envoyez un message à l’une d’elles.'], question: 'Sur qui puis-je compter ?' },
  { title: 'Bilan de deux semaines', steps: ['Relisez vos réponses.', 'Choisissez deux stratégies à garder.', 'Programmez-les dans l’agenda si vous le souhaitez.'], question: 'Qu’est-ce qui a vraiment changé en deux semaines ?' },
];

const NERVOSITE_WEEK2: ProgramDay[] = [
  { title: 'Matin apaisé', steps: ['Pas de téléphone pendant les 15 premières minutes.', 'Trois respirations lentes au réveil.'], question: 'Comment a commencé ma journée ?' },
  { title: 'Relâcher les épaules', steps: ['Toutes les 2 heures : épaules vers les oreilles, puis relâchez.', '5 fois.'], question: 'Où ma tension revient-elle ?' },
  { title: 'Moins de caféine', steps: ['Remplacez une boisson excitante par de l’eau ou une infusion.'], question: 'Ai-je senti une différence en fin de journée ?' },
  { title: 'Une chose à la fois', steps: ['Pendant une heure, faites une seule tâche à la fois.', 'Fermez les notifications.'], question: 'Comment me suis-je sentie pendant cette heure ?' },
  { title: 'Lieu calme', steps: ['Imaginez un lieu où vous vous sentez en paix.', 'Décrivez-le en 5 détails, 3 minutes.'], question: 'Quel détail m’apaise le plus ?' },
  { title: 'Dire non', steps: ['Repérez une demande qui ajoute de la pression.', 'Déclinez-la ou reportez-la, poliment.'], question: 'Qu’ai-je ressenti en posant cette limite ?' },
  { title: 'Bilan de deux semaines', steps: ['Relisez la quinzaine.', 'Gardez trois habitudes.'], question: 'Quelles habitudes m’ont le plus apaisée ?' },
];

const IMPULSIVITE_WEEK2: ProgramDay[] = [
  { title: 'Mes signaux d’alerte', steps: ['Notez ce qui se passe dans votre corps juste avant de réagir vite.'], question: 'Quel est mon premier signal ?' },
  { title: 'Compter jusqu’à dix', steps: ['Lors d’un agacement, comptez lentement jusqu’à 10 avant de parler.'], question: 'Ma réponse a-t-elle été différente ?' },
  { title: 'Sortir de la pièce', steps: ['Préparez une phrase pour faire une pause : « Je reviens dans cinq minutes. »', 'Utilisez-la si besoin.'], question: 'La pause m’a-t-elle aidée ?' },
  { title: 'Les achats', steps: ['Avant tout achat non prévu, attendez 24 heures.', 'Notez-le dans une liste de souhaits.'], question: 'Ai-je toujours envie de cet achat le lendemain ?' },
  { title: 'Réparer', steps: ['Repensez à une réaction regrettée.', 'Écrivez ce que vous pourriez dire pour réparer.'], question: 'Suis-je prête à le dire ?' },
  { title: 'Écoute active', steps: ['Dans une conversation, reformulez avant de répondre.'], question: 'Qu’est-ce que la reformulation a changé ?' },
  { title: 'Bilan de deux semaines', steps: ['Comptez vos pauses et vos réparations.', 'Félicitez-vous pour chacune.'], question: 'Quel progrès suis-je fière d’avoir fait ?' },
];

const CONFIANCE_7: ProgramDay[] = [
  { title: 'Mes preuves', steps: ['Listez 5 choses que vous avez réussies cette année.'], question: 'Quelle qualité ces réussites montrent-elles ?' },
  { title: 'Mes forces', steps: ['Demandez à une personne de confiance ce qu’elle apprécie chez vous.'], question: 'Qu’ai-je appris sur moi ?' },
  { title: 'Un petit défi', steps: ['Choisissez une action un peu hors de votre zone de confort.', 'Faites-la aujourd’hui.'], question: 'Comment me suis-je sentie après ?' },
  { title: 'Le juge intérieur', steps: ['Notez une phrase critique que vous vous dites souvent.', 'Réécrivez-la de façon juste et bienveillante.'], question: 'Laquelle des deux phrases est la plus vraie ?' },
  { title: 'Posture', steps: ['Deux minutes debout, épaules ouvertes, respiration lente, avant un moment important.'], question: 'Ai-je remarqué une différence ?' },
  { title: 'Accepter un compliment', steps: ['Au prochain compliment, répondez simplement « merci ».'], question: 'Qu’ai-je ressenti ?' },
  { title: 'Bilan', steps: ['Ajoutez les preuves de la semaine à votre liste.'], question: 'De quoi suis-je fière cette semaine ?' },
];

const LACHER_PRISE_7: ProgramDay[] = [
  { title: 'Les deux colonnes', steps: ['Listez vos préoccupations.', 'Séparez ce qui dépend de vous et ce qui n’en dépend pas.'], question: 'Qu’est-ce qui ne dépend pas de moi ?' },
  { title: 'Une action', steps: ['Choisissez une action dans la colonne « dépend de moi ».', 'Faites-la.'], question: 'Qu’ai-je ressenti en agissant ?' },
  { title: 'Laisser passer', steps: ['Quand une pensée revient, nommez-la : « une inquiétude ».', 'Revenez à votre respiration.'], question: 'Combien de fois ai-je laissé passer une pensée ?' },
  { title: 'Le parfait', steps: ['Faites une tâche « assez bien » plutôt que parfaite.'], question: 'Qu’est-il arrivé de grave ? Rien ?' },
  { title: 'Gratitude', steps: ['Notez trois choses qui vont bien malgré tout.'], question: 'Qu’est-ce qui va bien en ce moment ?' },
  { title: 'Confier', steps: ['Confiez une inquiétude par écrit, dans la prière ou à une personne de confiance.'], question: 'Me suis-je sentie plus légère ?' },
  { title: 'Bilan', steps: ['Relisez la semaine.'], question: 'Qu’ai-je réussi à laisser aller ?' },
];

const MONTH_THEMES: { theme: string; days: ProgramDay[] }[] = [
  { theme: 'Semaine 1 · Observer', days: PROGRAMS[0]!.days.slice(0, 3).concat(PROGRAMS[1]!.days.slice(0, 2), PROGRAMS[2]!.days.slice(0, 2)) },
  { theme: 'Semaine 2 · Apaiser', days: [PROGRAMS[0]!.days[4]!, PROGRAMS[1]!.days[2]!, PROGRAMS[1]!.days[3]!, NERVOSITE_WEEK2[0]!, NERVOSITE_WEEK2[4]!, ANXIETE_WEEK2[3]!, LACHER_PRISE_7[2]!] },
  { theme: 'Semaine 3 · Réagir autrement', days: [PROGRAMS[2]!.days[2]!, PROGRAMS[2]!.days[3]!, IMPULSIVITE_WEEK2[1]!, IMPULSIVITE_WEEK2[2]!, PROGRAMS[2]!.days[4]!, IMPULSIVITE_WEEK2[5]!, NERVOSITE_WEEK2[5]!] },
  { theme: 'Semaine 4 · Consolider', days: [CONFIANCE_7[0]!, CONFIANCE_7[3]!, ANXIETE_WEEK2[2]!, ANXIETE_WEEK2[5]!, LACHER_PRISE_7[4]!, LACHER_PRISE_7[5]!, CONFIANCE_7[5]!] },
];

const MONTH_CLOSING: ProgramDay[] = [
  { title: 'Relire le mois', steps: ['Relisez vos réponses des quatre semaines.', 'Soulignez ce qui vous a le plus aidée.'], question: 'Qu’est-ce qui a changé depuis le premier jour ?' },
  { title: 'Mes intentions', steps: ['Ouvrez le bilan du mois.', 'Choisissez trois stratégies à garder le mois prochain.'], question: 'Quelles sont mes trois intentions ?' },
];

PROGRAMS.push(
  { id: 'anxiete-14', axisId: 'anxiete', title: 'Apaiser l’anxiété · 14 jours', objective: 'Deux semaines pour réduire la place des inquiétudes et agir sur ce qui dépend de moi.', days: [...PROGRAMS[0]!.days, ...ANXIETE_WEEK2] },
  { id: 'nervosite-14', axisId: 'nervosite', title: 'Retrouver mon calme · 14 jours', objective: 'Deux semaines pour installer des pauses et des limites qui apaisent.', days: [...PROGRAMS[1]!.days, ...NERVOSITE_WEEK2] },
  { id: 'impulsivite-14', axisId: 'impulsivite', title: 'Réagir avec recul · 14 jours', objective: 'Deux semaines pour créer l’espace entre l’émotion et la réaction, et réparer quand il le faut.', days: [...PROGRAMS[2]!.days, ...IMPULSIVITE_WEEK2] },
  { id: 'confiance-7', axisId: 'confiance', title: 'Croire en moi', objective: 'Une semaine pour rassembler des preuves et oser un petit défi.', days: CONFIANCE_7 },
  { id: 'lacher-prise-7', axisId: 'lacher-prise', title: 'Lâcher prise', objective: 'Une semaine pour distinguer ce qui dépend de moi et alléger le reste.', days: LACHER_PRISE_7 },
  {
    id: 'equilibre-30',
    axisId: 'emotions',
    title: 'Mon mois d’équilibre · 30 jours',
    objective: 'Un mois progressif qui croise anxiété, nervosité et impulsivité : observer, apaiser, réagir autrement, consolider.',
    days: [...MONTH_THEMES.flatMap((w) => w.days.map((d) => ({ ...d, title: `${w.theme.split(' · ')[1]} · ${d.title}` }))), ...MONTH_CLOSING],
  },
);

export const programById = (id: string) => PROGRAMS.find((p) => p.id === id);
export const axisById = (id: string) => AXES.find((a) => a.id === id);
