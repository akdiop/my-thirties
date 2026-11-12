/**
 * Mes outils TCC (thérapie comportementale et cognitive) : fiches pour comprendre, exercices classiques à remplir
 * (colonnes de Beck, ABC, flèche descendante, expérience comportementale, résolution de problèmes, inquiétudes,
 * activation comportementale, exposition graduée, bienveillance envers soi) et suivi de l'intensité des émotions.
 */
import type { Entry } from './cloud';

export const TCC_KIND = 'tcc';
export const TCC_ECHELLE = 'tcc_echelle';

export const EMOTIONS = ['Anxiété', 'Peur', 'Tristesse', 'Colère', 'Culpabilité', 'Honte', 'Jalousie', 'Frustration', 'Solitude', 'Découragement', 'Irritation', 'Déception'];

export type Distorsion = { id: string; nom: string; def: string; ex: string; question: string };
export const DISTORSIONS: Distorsion[] = [
  { id: 'tout-rien', nom: 'Tout ou rien', def: 'Voir les choses en noir ou blanc, sans nuance.', ex: '« Si ce n’est pas parfait, c’est raté. »', question: 'Qu’y a-t-il entre les deux extrêmes ? Sur 100, où est-ce vraiment ?' },
  { id: 'generalisation', nom: 'Généralisation', def: 'Tirer une règle générale d’un seul événement.', ex: '« Ça rate toujours avec moi. »', question: 'Toujours ? Quelles fois cela s’est-il passé autrement ?' },
  { id: 'filtre', nom: 'Filtre mental', def: 'Ne retenir que le négatif et ignorer le reste.', ex: 'Une remarque critique efface dix compliments.', question: 'Qu’est-ce que je laisse de côté dans le tableau ?' },
  { id: 'disqualification', nom: 'Disqualifier le positif', def: 'Considérer que le positif ne compte pas.', ex: '« Elle dit ça par politesse. »', question: 'Si une amie vivait ce succès, est-ce que je dirais qu’il ne compte pas ?' },
  { id: 'lecture', nom: 'Lecture de pensée', def: 'Croire savoir ce que les autres pensent, sans preuve.', ex: '« Il me trouve nulle. »', question: 'Qu’est-ce qui me le prouve ? Quelles autres explications sont possibles ?' },
  { id: 'voyance', nom: 'Erreur de voyance', def: 'Prédire le pire comme si c’était certain.', ex: '« Je vais forcément échouer. »', question: 'Quelles sont les chances réelles ? Que s’est-il passé les autres fois ?' },
  { id: 'catastrophe', nom: 'Catastrophisme', def: 'Imaginer le scénario le plus grave et le croire probable.', ex: '« Si je me trompe, tout s’effondre. »', question: 'Le pire, le meilleur, le plus probable : lequel est le plus réaliste ? Et si le pire arrivait, comment ferais-je face ?' },
  { id: 'emotion', nom: 'Raisonnement émotionnel', def: 'Prendre une émotion pour une preuve.', ex: '« Je me sens bête, donc je le suis. »', question: 'Une émotion est-elle un fait ? Que dirais-je avec la tête froide ?' },
  { id: 'devrais', nom: 'Les « il faut », « je dois »', def: 'Des règles rigides pour soi ou pour les autres.', ex: '« Je dois toujours être disponible. »', question: 'Et si je remplaçais « je dois » par « je préférerais » ?' },
  { id: 'etiquette', nom: 'Étiquetage', def: 'Se coller une étiquette au lieu de décrire un acte.', ex: '« Je suis une incapable. »', question: 'Qu’ai-je fait exactement ? Un acte définit-il une personne ?' },
  { id: 'personnalisation', nom: 'Personnalisation', def: 'Se croire responsable de ce qui ne dépend pas de soi.', ex: '« Elle est de mauvaise humeur à cause de moi. »', question: 'Quelles autres causes possibles ? Quelle est ma part réelle ?' },
  { id: 'maximisation', nom: 'Maximisation, minimisation', def: 'Grossir ses erreurs et réduire ses qualités.', ex: '« Ma petite erreur gâche tout, mes efforts ne valent rien. »', question: 'Quelle place cela aura-t-il dans un an ? Que vaut chaque élément, à sa juste taille ?' },
];

export const QUESTIONS_SOCRATIQUES = [
  'Quels faits soutiennent cette pensée ?', 'Quels faits la contredisent ?', 'Est-ce un fait ou une interprétation ?', 'Existe-t-il une autre explication ?',
  'Que dirais-je à une amie qui aurait cette pensée ?', 'Que me dirait une personne qui m’aime ?', 'Quel est le pire, le meilleur et le plus probable ?',
  'Si le pire arrivait, comment ferais-je face ?', 'Dans un an, quelle importance cela aura-t-il ?', 'Cette pensée m’aide-t-elle ou me freine-t-elle ?',
  'Est-ce que je confonds possible et probable ?', 'Quelle distorsion reconnais-je ici ?',
];

export type Fiche = { id: string; titre: string; points: string[] };
export const FICHES: Fiche[] = [
  { id: 'modele', titre: 'Le modèle cognitif', points: [
    'Ce n’est pas la situation seule qui fait l’émotion, mais ce que j’en pense sur le moment.',
    'Situation → pensée → émotion et sensations → comportement. Chaque élément nourrit les autres.',
    'Exemple : un message sans réponse. « Elle m’en veut » donne de l’inquiétude ; « elle est occupée » laisse calme.',
    'Changer une pensée ou un comportement suffit souvent à changer l’émotion.'] },
  { id: 'pensees', titre: 'Les pensées automatiques', points: [
    'Ce sont des pensées rapides, spontanées, qui paraissent vraies sans qu’on les examine.',
    'Elles surgissent souvent sous forme d’images ou de petites phrases : « je n’y arriverai pas ».',
    'Pour les repérer : quand mon émotion change, je me demande « qu’est-ce qui vient de me passer par la tête ? ».',
    'On ne cherche pas à penser positif, mais à penser juste : une pensée plus réaliste et plus aidante.'] },
  { id: 'croyances', titre: 'Croyances et règles de vie', points: [
    'Sous les pensées automatiques se trouvent des croyances profondes, sur soi, les autres et le monde : « je ne vaux rien », « on ne peut compter sur personne ».',
    'Entre les deux, des règles conditionnelles : « si je ne suis pas parfaite, on me rejettera ».',
    'Elles se sont construites avec l’histoire de vie, elles ont eu un sens, mais elles ne sont pas des vérités.',
    'La flèche descendante aide à les trouver, et les expériences comportementales à les assouplir.'] },
  { id: 'evitement', titre: 'Le cercle de l’évitement', points: [
    'Éviter ce qui fait peur soulage tout de suite, et c’est pour ça qu’on recommence.',
    'Mais l’évitement empêche de vérifier que la peur était exagérée : l’anxiété grandit à la longue.',
    'Les comportements de sécurité (vérifier, se rassurer, avoir toujours une issue) fonctionnent comme de petits évitements.',
    'Sortir du cercle : s’exposer progressivement, rester assez longtemps pour que l’anxiété redescende d’elle-même.'] },
  { id: 'activation', titre: 'L’activation comportementale', points: [
    'Quand le moral baisse, on fait moins ; quand on fait moins, le moral baisse encore.',
    'On n’attend pas d’avoir envie pour agir : l’action vient d’abord, l’envie suit souvent.',
    'On prévoit de petites activités de plaisir (ce qui fait du bien) et de maîtrise (ce qui donne un sentiment d’accomplissement).',
    'On note l’humeur avant et après : c’est l’expérience, pas la volonté, qui convainc.'] },
  { id: 'exposition', titre: 'L’exposition graduée', points: [
    'On liste les situations redoutées et on les note de 0 à 100 selon l’anxiété qu’elles provoquent.',
    'On commence par une marche autour de 30 à 40, ni trop facile ni trop dure.',
    'On reste dans la situation sans fuir ni se rassurer, jusqu’à ce que l’anxiété baisse nettement.',
    'On répète la même marche plusieurs fois avant de passer à la suivante. L’anxiété baisse un peu plus à chaque fois.'] },
  { id: 'inquietude', titre: 'Les inquiétudes', points: [
    'S’inquiéter donne l’impression de se préparer, mais tourne souvent en rond sans rien résoudre.',
    'Première question : est-ce un problème réel et actuel, sur lequel je peux agir ?',
    'Si oui : résolution de problèmes et une première petite action. Si non : je la note et la remets à mon moment d’inquiétude.',
    'Le moment d’inquiétude : 15 minutes par jour, à heure fixe, pas le soir au coucher. Le reste du temps, je reporte.'] },
  { id: 'emotions', titre: 'Accueillir les émotions', points: [
    'Une émotion est une information, pas un ordre. Elle monte, atteint un pic, puis redescend.',
    'Nommer l’émotion et son intensité (sur 100) la rend déjà plus gérable.',
    'On peut ressentir sans agir tout de suite : respirer, observer les sensations, attendre que la vague passe.',
    'Se parler comme à une amie aide plus que se critiquer.'] },
  { id: 'rechute', titre: 'Garder les progrès', points: [
    'Les hauts et les bas font partie du chemin : un mauvais jour n’efface pas le travail fait.',
    'Repérer ses signaux d’alerte : sommeil, isolement, ruminations, évitements qui reviennent.',
    'Garder ses outils sous la main et les reprendre dès les premiers signaux.',
    'Relire ses anciennes fiches : ce qui a aidé une fois aide souvent encore.'] },
];

export type Field = { id: string; label: string; hint?: string; type: 'text' | 'area' | 'slider' | 'emotions' | 'distorsions' | 'chips' | 'echelle' | 'forces'; options?: string[]; max?: number; min?: number };
export type Outil = { id: string; nom: string; but: string; fields: Field[]; avant?: string; apres?: string; groupe?: 'Psychologie positive'; source?: string; intro?: string[] };
export type Force = { force: string; usage: number; potentiel: number };
const area = (id: string, label: string, hint?: string): Field => ({ id, label, hint, type: 'area' });
const slider = (id: string, label: string, max = 100, hint?: string): Field => ({ id, label, hint, type: 'slider', max });

export const OUTILS: Outil[] = [
  { id: 'colonnes', nom: 'Colonnes de Beck', but: 'Examiner une pensée qui fait mal et trouver une pensée plus juste.', avant: 'intensite', apres: 'intensiteApres', fields: [
    area('situation', 'La situation', 'Où, quand, avec qui, ce qui s’est passé, comme une caméra.'),
    { id: 'emotions', label: 'Mes émotions', type: 'emotions' }, slider('intensite', 'Intensité de l’émotion la plus forte'),
    area('pensee', 'La pensée automatique', 'Ce qui m’est passé par la tête à ce moment-là.'), slider('croyance', 'À quel point j’y crois'),
    { id: 'distorsions', label: 'Les pièges de pensée que je reconnais', type: 'distorsions' },
    area('pour', 'Les faits qui la soutiennent'), area('contre', 'Les faits qui la contredisent'),
    area('alternative', 'Une pensée plus juste et plus aidante', 'Qui tient compte de tous les faits.'), slider('croyanceAlt', 'À quel point je crois cette nouvelle pensée'),
    slider('intensiteApres', 'Intensité de l’émotion maintenant')] },
  { id: 'abc', nom: 'Analyse ABC', but: 'Comprendre ce qui déclenche un comportement et ce qu’il m’apporte vraiment.', fields: [
    area('a', 'A · Le déclencheur', 'Situation, moment, personne, pensée.'), area('b', 'B · Ce que j’ai fait', 'Le comportement, le plus précisément possible.'),
    area('cCourt', 'C · Conséquences à court terme', 'Ce que ça m’a apporté sur le moment.'), area('cLong', 'C · Conséquences à long terme', 'Ce que ça me coûte avec le temps.'),
    area('autre', 'Une autre réponse possible la prochaine fois')] },
  { id: 'fleche', nom: 'Flèche descendante', but: 'Descendre d’une pensée jusqu’à la croyance qui la porte.', fields: [
    area('pensee', 'La pensée de départ'), area('n1', 'Si c’était vrai, qu’est-ce que ça voudrait dire pour moi ?'),
    area('n2', 'Et si c’était vrai, qu’est-ce que ça voudrait dire ?'), area('n3', 'Et encore en dessous ?'),
    area('croyance', 'La croyance que je découvre', '« Je suis… », « les autres sont… », « le monde est… »'), slider('force', 'À quel point j’y crois'),
    area('nuance', 'Une croyance plus nuancée que je voudrais nourrir')] },
  { id: 'experience', nom: 'Expérience comportementale', but: 'Tester une prédiction dans la réalité plutôt que dans ma tête.', fields: [
    area('prediction', 'Ma prédiction', 'Ce que je crains qu’il se passe.'), slider('croyance', 'À quel point j’y crois'),
    area('test', 'L’expérience que je vais faire', 'Quoi, quand, où.'), area('securite', 'Les comportements de sécurité que je laisse de côté'),
    area('resultat', 'Ce qui s’est réellement passé'), area('appris', 'Ce que j’en apprends'), slider('croyanceApres', 'À quel point je crois ma prédiction maintenant')] },
  { id: 'probleme', nom: 'Résolution de problèmes', but: 'Passer de « je tourne en rond » à une première action.', fields: [
    area('probleme', '1. Le problème, concrètement'), area('objectif', '2. Ce que je veux obtenir'),
    area('solutions', '3. Toutes les solutions possibles', 'Sans juger, même les farfelues. Une par ligne.'), area('pesee', '4. Avantages et inconvénients des meilleures'),
    area('choix', '5. La solution que je choisis'), area('etape', '6. Ma première petite étape, et quand'), area('bilan', '7. Bilan : qu’est-ce qui a marché ?')] },
  { id: 'inquietude', nom: 'Trier une inquiétude', but: 'Savoir si j’agis maintenant ou si je la remets à plus tard.', fields: [
    area('inquietude', 'Mon inquiétude'), { id: 'controle', label: 'Est-ce un problème réel, sur lequel je peux agir ?', type: 'chips', options: ['Oui, je peux agir', 'Non, pas maintenant', 'Ce n’est qu’un « et si… »'] },
    area('action', 'Si je peux agir : ma première action'), area('lacher', 'Sinon : ce que je me dis pour la poser', 'Je la reprendrai à mon moment d’inquiétude.'), slider('intensite', 'Intensité de l’inquiétude')] },
  { id: 'activite', nom: 'Activation comportementale', but: 'Prévoir une activité de plaisir ou de maîtrise et voir son effet sur l’humeur.', avant: 'humeurAvant', apres: 'humeurApres', fields: [
    { id: 'type', label: 'Type d’activité', type: 'chips', options: ['Plaisir', 'Maîtrise', 'Les deux'] }, { id: 'activite', label: 'L’activité', type: 'text' },
    { id: 'quand', label: 'Quand', type: 'text', hint: 'Jour et heure' }, slider('humeurAvant', 'Mon humeur avant (0 = très basse)', 10),
    { id: 'faite', label: 'Je l’ai faite', type: 'chips', options: ['Oui', 'En partie', 'Pas cette fois'] }, slider('plaisir', 'Plaisir ressenti', 10), slider('maitrise', 'Sentiment de maîtrise', 10),
    slider('humeurApres', 'Mon humeur après', 10)] },
  { id: 'exposition', nom: 'Exposition graduée', but: 'Affronter une marche de mon échelle, sans fuir, jusqu’à ce que l’anxiété redescende.', avant: 'pic', apres: 'fin', fields: [
    { id: 'marche', label: 'La marche de mon échelle', type: 'echelle' }, slider('avant', 'Anxiété juste avant'), slider('pic', 'Anxiété au plus haut'),
    slider('fin', 'Anxiété à la fin'), { id: 'duree', label: 'Durée (minutes)', type: 'text' }, area('securite', 'Ce que j’ai réussi à ne pas faire (fuite, réassurance)'),
    area('appris', 'Ce que j’ai appris')] },
  { id: 'bienveillance', nom: 'Me parler avec bienveillance', but: 'Remplacer la voix critique par la voix d’une amie.', fields: [
    area('critique', 'Ce que ma voix critique me dit'), area('amie', 'Ce que je dirais à une amie dans la même situation'),
    area('besoin', 'Ce dont j’ai besoin en ce moment'), area('geste', 'Un petit geste doux pour moi aujourd’hui')] },
];

const PP = 'PositivePsychology.com, traduit et adapté';
const POSITIVES = ['Joie', 'Calme', 'Gratitude', 'Émerveillement', 'Tendresse', 'Fierté', 'Amusement', 'Espoir', 'Sérénité', 'Amour'];
export const PSYCHO_POSITIVE: Outil[] = [
  { id: 'forces', nom: 'La roue de mes forces', groupe: 'Psychologie positive', source: PP + ' (Matt Driver)', but: 'Voir quelles forces j’utilise trop peu, ou trop, dans un domaine de ma vie.',
    intro: ['Une force est une manière d’agir, de penser ou de ressentir qui me vient naturellement et me donne de l’énergie. On s’en sert souvent sans la voir.',
      'Pour chaque force, note de 0 à 10 combien tu l’utilises aujourd’hui, puis combien tu pourrais l’utiliser dans ce domaine. Plus l’écart est grand, plus il y a de place pour grandir.',
      'Une force utilisée bien plus que ce que le contexte permet peut devenir un point faible : on la dose alors selon la situation.'], fields: [
    { id: 'contexte', label: 'Le domaine', type: 'text', hint: 'Travail, couple, famille, études…' }, { id: 'forces', label: 'Mes forces', type: 'forces' },
    area('remarque', 'Ce que je remarque en regardant ma roue'), area('plus', 'Les forces que je pourrais utiliser davantage'), area('agir', 'Ce que je peux faire pour commencer')] },
  { id: 'valeurs', nom: 'La cible de mes valeurs', groupe: 'Psychologie positive', source: PP + ' (Bull’s-Eye Values Survey, Tobias Lundgren)', but: 'Voir à quelle distance je vis de ce qui compte vraiment pour moi.',
    intro: ['Une valeur n’est pas un but qu’on atteint, c’est une direction : la manière dont je veux vivre, au fil du temps. Se marier est un but ; être une partenaire tendre et honnête est une valeur.',
      'Pour chaque domaine, écris ta valeur, puis place-toi : 7 si ta vie est au cœur de la cible, 1 si elle en est très loin.'], fields: [
    area('travail', 'Travail et études : ma valeur'), { id: 'cTravail', label: 'Où j’en suis', type: 'slider', min: 1, max: 7 },
    area('relations', 'Relations : ma valeur'), { id: 'cRelations', label: 'Où j’en suis', type: 'slider', min: 1, max: 7 },
    area('loisirs', 'Loisirs : ma valeur'), { id: 'cLoisirs', label: 'Où j’en suis', type: 'slider', min: 1, max: 7 },
    area('sante', 'Développement personnel, santé, spiritualité : ma valeur'), { id: 'cSante', label: 'Où j’en suis', type: 'slider', min: 1, max: 7 },
    area('obstacles', 'Ce qui se met entre moi et cette vie-là', 'Un obstacle par ligne.'), { id: 'forceObstacles', label: 'À quel point ces obstacles m’empêchent d’avancer (7 = complètement)', type: 'slider', min: 1, max: 7 },
    area('aTravail', 'Une action pour me rapprocher du centre : travail et études'), area('aRelations', 'Une action : relations'), area('aLoisirs', 'Une action : loisirs'), area('aSante', 'Une action : développement personnel et santé')] },
  { id: 'chaises', nom: 'Les chaises de la compassion', groupe: 'Psychologie positive', source: PP + ' (inspiré de la thérapie des schémas)', but: 'Écouter ma voix critique, la part de moi qui se sent jugée, puis la voix d’une amie sage.',
    intro: ['Pense à quelque chose qui t’a fait te critiquer récemment. Si tu peux, place trois chaises et change de chaise à chaque voix ; sinon, écris simplement chaque voix à la suite.',
      'Remarque à chaque fois le ton, les émotions et ta posture. Prends le temps qu’il faut pour chaque voix.'], fields: [
    area('sujet', 'Ce qui m’a fait me critiquer'), area('critique', '1. La voix critique', 'Ce qu’elle dit, avec ses mots. Exemple : « Je déteste être si paresseuse. »'),
    area('jugee', '2. La part de moi qui se sent jugée', 'Exemple : « Je me sens blessée, pas soutenue. »'), area('dialogue', '3. Le dialogue entre les deux'),
    area('amie', '4. La voix d’une amie sage', 'Avec une compassion sincère, elle répond à la critique et console la part blessée.'), area('retiens', 'Ce que j’en retiens pour la prochaine fois')] },
  { id: 'savourer', nom: 'Savourer les petits moments', groupe: 'Psychologie positive', source: PP + ' (Creating Savoring Rituals)', but: 'Remarquer, apprécier et prolonger les petits plaisirs du quotidien.',
    intro: ['Le nombre de moments agréables compte plus que leur caractère exceptionnel.', 'Choisis deux moments ordinaires par jour, pendant deux semaines : le café du matin, une douche chaude, quelques pas au soleil.',
      'Pendant le moment, une seule chose à la fois, téléphone éteint. Si l’esprit part, reviens à ce que tu vois, sens, entends.', 'Ressens plutôt qu’analyser : revivre le moment en pensée fait plus de bien que le disséquer.'], fields: [
    area('liste', 'Les petits plaisirs de mes journées', 'Un par ligne.'), area('moment1', 'Premier moment savouré aujourd’hui'), area('moment2', 'Deuxième moment savouré aujourd’hui'),
    area('sens', 'Ce que mes sens ont remarqué', 'Vu, senti, entendu, touché, goûté.'), { id: 'emotions', label: 'Les émotions ressenties', type: 'chips', options: POSITIVES },
    area('retour', 'Si mon attention est partie, comment je suis revenue au moment')] },
  { id: 'emerveillement', nom: 'L’émerveillement', groupe: 'Psychologie positive', source: PP + ' (Experiencing Awe)', but: 'Revivre un moment qui m’a fait dire « waouh », et garder un carnet d’émerveillement.',
    intro: ['L’émerveillement naît devant ce qui nous dépasse : un coucher de soleil sur l’océan, un geste d’une grande bonté, une idée lumineuse.', 'Ferme les yeux quelques minutes et revis le moment, avec le plus de détails possible.'], fields: [
    area('moment', 'Le moment d’émerveillement'), area('details', 'Ce que j’ai vu, pensé et ressenti à ce moment-là'), area('maintenant', 'Ce qui revient maintenant, en le revivant'),
    { id: 'emotions', label: 'Les émotions', type: 'chips', options: POSITIVES }] },
  { id: 'admiration', nom: 'L’admiration dans le couple', groupe: 'Psychologie positive', source: PP + ' (d’après Gottman et Silver)', but: 'Raviver la tendresse et l’admiration, et les dire à l’autre.',
    intro: ['Penser et parler de ce qu’on aime chez l’autre ravive des sentiments parfois oubliés, et rend les sujets difficiles plus faciles à aborder.',
      'Pour chaque qualité, ferme les yeux trois minutes sur un moment de la semaine où elle s’est montrée, puis écris-le.', 'Dire merci pour « ce que tu es pour moi », pas seulement pour « ce que tu fais pour moi ».'], fields: [
    { id: 'q1', label: 'Une qualité que j’admire chez lui', type: 'text' }, area('s1', 'Un moment de la semaine où elle s’est montrée'),
    { id: 'q2', label: 'Une deuxième qualité', type: 'text' }, area('s2', 'Le moment où elle s’est montrée'),
    { id: 'q3', label: 'Une troisième qualité', type: 'text' }, area('s3', 'Le moment où elle s’est montrée'),
    area('dire', 'Ce que je vais lui dire', '« J’apprécie que tu sois… Je l’ai remarqué quand… »'), area('ressenti', 'Ce que l’exercice m’a fait ressentir')] },
];
export const outilOf = (id: string) => [...OUTILS, ...PSYCHO_POSITIVE].find((o) => o.id === id);

export type Marche = { text: string; suds: number; faite?: number };
export const echelleOf = (entries: Entry[]) => {
  const e = entries.find((x) => x.kind === TCC_ECHELLE);
  return (Array.isArray(e?.data.items) ? (e!.data.items as Marche[]) : []).slice().sort((a, b) => a.suds - b.suds);
};

/** Mes exercices remplis, du plus récent au plus ancien. */
export function exercices(entries: Entry[]) {
  return entries.filter((e) => e.kind === TCC_KIND && outilOf(String(e.data.outil)))
    .map((e) => ({ entry: e, outil: outilOf(String(e.data.outil))!, date: String(e.entry_date ?? ''), values: (e.data.values ?? {}) as Record<string, unknown> }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Ce qui change : baisse moyenne de l'intensité (colonnes, exposition, inquiétude…) et hausse moyenne de l'humeur (activation). */
export function progres(list: ReturnType<typeof exercices>) {
  const drops: number[] = [], lifts: number[] = [];
  const distorsions = new Map<string, number>();
  for (const x of list) {
    const { avant, apres } = x.outil;
    const a = Number(x.values[avant ?? '']), b = Number(x.values[apres ?? '']);
    if (avant && apres && Number.isFinite(a) && Number.isFinite(b) && x.values[avant] !== undefined && x.values[apres] !== undefined) {
      if (x.outil.id === 'activite') lifts.push(b - a); else if (a > 0) drops.push(Math.round(((a - b) / a) * 100));
    }
    for (const d of Array.isArray(x.values.distorsions) ? (x.values.distorsions as string[]) : []) distorsions.set(d, (distorsions.get(d) ?? 0) + 1);
  }
  const avg = (v: number[]) => (v.length ? Math.round(v.reduce((s, n) => s + n, 0) / v.length * 10) / 10 : null);
  return { total: list.length, baisse: avg(drops), mesures: drops.length, humeur: avg(lifts), pieges: [...distorsions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([id, n]) => ({ nom: DISTORSIONS.find((d) => d.id === id)?.nom ?? id, n })) };
}
