import type { Outil } from './tcc';

/** Les Quatre Accords toltèques (Don Miguel Ruiz), reformulés en fiches à partir du PDF transmis par Aïda : rien n'est recopié. */
export const ACCORDS_SOURCE = 'D’après Les Quatre Accords toltèques, Don Miguel Ruiz (fiche reformulée)';

/** islam : un verset ou un chapitre du Jardin des vertueux qui rejoint l'accord (rapprochement proposé, pas tiré du livre). */
export type Accord = { n: number; titre: string; sens: string[]; pratique: string[]; piege: string; question: string; islam: { texte: string; jardin?: [number, string] } };

export const ACCORDS: Accord[] = [
  { n: 1, titre: 'Que ma parole soit impeccable',
    sens: ['Ma parole crée : ce que je dis, aux autres comme à moi-même, façonne ce que je vis.', 'Impeccable veut dire sans faute contre moi-même : ne pas utiliser les mots contre moi ni contre les autres.', 'La médisance et l’autocritique sont des poisons qui se transmettent : une phrase entendue enfant peut devenir une croyance pour des années.'],
    pratique: ['Ne dire que ce que je pense vraiment, avec douceur.', 'Ne pas répéter un ragot, même pour « juste en parler ».', 'Remarquer ma voix intérieure : est-ce que je me parlerais ainsi si je m’aimais ?', 'Utiliser mes mots pour la vérité et l’amour, envers moi d’abord.'],
    piege: 'etiquette', question: 'Quelle phrase ai-je dite aujourd’hui, à moi ou à quelqu’un, que je ne voudrais pas recevoir ?',
    islam: { texte: 'Garder sa langue, éviter la médisance et le mensonge : tout un chapitre du Jardin des vertueux y est consacré.', jardin: [254, 'La médisance et la garde de la langue'] } },
  { n: 2, titre: 'Ne pas en faire une affaire personnelle',
    sens: ['Ce que les autres disent ou font vient de leur propre monde : leurs croyances, leurs blessures, leur humeur.', 'Prendre les choses pour soi, c’est croire que tout nous concerne : c’est une forme d’importance que l’on se donne.', 'C’est valable pour les critiques comme pour les compliments : ni l’un ni l’autre ne dit qui je suis.'],
    pratique: ['Devant une remarque blessante, me dire : cela parle d’abord de la personne.', 'Ne pas avaler le « poison » : je peux l’entendre sans le faire mien.', 'Ne pas non plus prendre personnellement ce que je me dis dans ma tête.', 'Me rappeler que je ne suis pas responsable des actes des autres, seulement des miens.'],
    piege: 'personnalisation', question: 'Qu’ai-je pris pour moi cette semaine qui ne me concernait pas vraiment ?',
    islam: { texte: 'Pardonner et ne pas faire cas des paroles des insensés : « Accepte ce qu’on t’offre de raisonnable, commande ce qui est convenable et éloigne-toi des ignorants » (Coran 7:199).', jardin: [75, 'Le pardon et le fait de ne pas faire cas des insensés'] } },
  { n: 3, titre: 'Ne pas faire de suppositions',
    sens: ['Je suppose ce que les autres pensent ou veulent, puis je crois que c’est vrai.', 'De là naissent les malentendus, les rancœurs et beaucoup de drames pour rien.', 'Dans le couple surtout, on attend que l’autre devine : on suppose qu’il sait, qu’il doit changer, qu’il pense comme nous.'],
    pratique: ['Poser la question plutôt que deviner, même si cela demande du courage.', 'Dire clairement ce que je veux et ce dont j’ai besoin.', 'Tant que je n’ai pas la réponse, garder plusieurs explications possibles.', 'Vérifier avant de réagir.'],
    piege: 'lecture', question: 'Quelle supposition pourrais-je vérifier en posant simplement une question ?',
    islam: { texte: '« Évitez de trop conjecturer [sur autrui] car une partie des conjectures est péché » (Coran 49:12).', jardin: [272, 'Le mauvais préjugé'] } },
  { n: 4, titre: 'Toujours faire de mon mieux',
    sens: ['Mon mieux change selon les jours : reposée ou fatiguée, en forme ou malade, il n’est pas le même.', 'En faire plus que mon mieux épuise ; en faire moins nourrit la culpabilité et le regret.', 'C’est cet accord qui permet de vivre les trois autres : si je tombe, je recommence, sans me juger.'],
    pratique: ['Agir parce que j’aime le faire, pas pour être récompensée ou approuvée.', 'Ajuster mon « mieux » à mon énergie du jour, sans me comparer à hier.', 'Quand j’ai fait de mon mieux, le Juge intérieur n’a plus rien à dire.', 'Passer à l’action : savoir sans agir ne change rien.'],
    piege: 'tout-rien', question: 'Aujourd’hui, mon mieux était-il ajusté à mon énergie, ni plus ni moins ?',
    islam: { texte: '« Allah n’impose à aucune âme une charge supérieure à sa capacité » (Coran 2:286).', jardin: [14, 'La modération dans les actes de dévotion'] } },
];

/** Les grandes idées du livre, pour comprendre d'où viennent nos accords et comment s'en libérer. */
export const ACCORDS_COMPRENDRE: { titre: string; points: string[] }[] = [
  { titre: 'La domestication et le rêve collectif', points: ['Enfants, nous avons appris les règles, les croyances et les jugements de notre entourage sans pouvoir les choisir.', 'Chaque croyance acceptée est un « accord » : avec moi, avec les autres, avec la société.', 'Ensemble, ces accords forment notre personnalité et notre manière de voir le monde, comme un rêve que l’on prend pour la réalité.'] },
  { titre: 'Le Livre de la Loi, le Juge et la Victime', points: ['Nos croyances forment un règlement intérieur que nous ne remettons pas en question.', 'Un Juge en nous s’en sert pour tout évaluer, et une Victime en nous reçoit la sentence : honte, culpabilité, peur.', 'Nous nous punissons souvent plusieurs fois pour une seule erreur, ce qu’aucune autre créature ne fait.', 'Beaucoup de ces règles sont fausses : le Juge a tort parce que le règlement est faux.'] },
  { titre: 'Les accords fondés sur la peur', points: ['Ils consomment beaucoup d’énergie ; ceux fondés sur l’amour en redonnent.', 'Chaque accord rompu rend l’énergie qu’il retenait.', 'Les quatre accords servent à rompre les autres, un par un.'] },
  { titre: 'Briser les vieux accords', points: ['La prise de conscience d’abord : on ne change que ce que l’on voit.', 'Faire l’inventaire de mes croyances limitantes, puis en remplacer une à la fois par un accord nouveau.', 'Le livre compare ces croyances à un parasite : on peut l’affronter de face, ou cesser simplement de le nourrir.', 'Avancer petit à petit : chaque victoire rend la suivante plus facile.'] },
  { titre: 'La discipline et le pardon', points: ['Être discipliné, c’est choisir ma réaction plutôt que la subir.', 'Les blessures émotionnelles ne guérissent qu’avec la vérité et le pardon.', 'Pardonner non parce que l’autre le mérite, mais parce que je ne veux plus payer pour le passé.', 'Je sais que j’ai pardonné quand le souvenir ne réveille plus la même douleur. Me pardonner à moi-même en fait partie.'] },
  { titre: 'Lâcher le passé', points: ['Porter le passé rend la vie lourde ; vivre le présent la rend légère.', 'Tout ce que j’ai m’est prêté : en profiter pleinement, sans m’y agripper.', 'Vivre chaque jour comme s’il pouvait être le dernier rend les relations plus vraies.'] },
  { titre: 'Le nouveau rêve', points: ['Changer ses accords, c’est changer le rêve de sa vie.', 'Vivre avec moins de peur et plus d’amour, envers soi et envers les autres, est un choix que l’on renouvelle chaque jour.'] },
];

/** L'accord de la semaine : un accord à vivre pendant sept jours, à tour de rôle. */
export function accordDeLaSemaine(day: string): Accord {
  const t = Date.parse(day + 'T12:00:00Z') / 86_400_000;
  const semaine = Math.floor((t + 3) / 7);
  return ACCORDS[((semaine % ACCORDS.length) + ACCORDS.length) % ACCORDS.length]!;
}

/** Les exercices des Quatre Accords, enregistrés comme les autres exercices TCC. */
export const OUTILS_ACCORDS: Outil[] = [
  { id: 'vieux-accords', nom: 'Mon inventaire des vieux accords', groupe: 'Les Quatre Accords', source: ACCORDS_SOURCE, but: 'Repérer une croyance qui me limite et la remplacer par un accord que je choisis.',
    intro: ['On ne change que ce que l’on voit : commence par une seule croyance.', 'Cherche d’où elle vient, sans juger ceux qui te l’ont transmise.', 'Choisis un accord nouveau, formulé simplement, et un premier petit pas.'], fields: [
    { id: 'croyance', label: 'Une croyance qui me limite', hint: 'Par exemple : « je dois tout réussir seule ».', type: 'area' },
    { id: 'origine', label: 'D’où elle vient', hint: 'Qui me l’a transmise, à quel âge, dans quelle situation.', type: 'area' },
    { id: 'cout', label: 'Ce qu’elle me coûte aujourd’hui', type: 'area' },
    { id: 'accord', label: 'L’accord qui m’aide à la rompre', type: 'chips', options: ACCORDS.map((a) => a.titre) },
    { id: 'nouvel', label: 'Mon nouvel accord', hint: 'La phrase que je choisis désormais.', type: 'area' },
    { id: 'pas', label: 'Mon premier petit pas', type: 'area' }] },
  { id: 'pardon', nom: 'Pardonner pour me libérer', groupe: 'Les Quatre Accords', source: ACCORDS_SOURCE, but: 'Déposer une rancune, pour moi d’abord.', avant: 'douleur', apres: 'douleurApres',
    intro: ['Pardonner ne veut pas dire que ce qui s’est passé était acceptable.', 'C’est refuser de continuer à payer pour le passé.', 'La personne peut être moi-même.', 'Pour aller plus loin : les fiches « Le traitement de la colère » et « Le nafs » dans le Jardin des vertueux.'], fields: [
    { id: 'qui', label: 'La personne (ou moi-même)', type: 'text' },
    { id: 'blessure', label: 'Ce qui s’est passé', hint: 'Les faits, comme une caméra.', type: 'area' },
    { id: 'douleur', label: 'Ce que ça me fait encore quand j’y pense', type: 'slider', max: 10 },
    { id: 'cout', label: 'Ce que cette rancune me coûte aujourd’hui', type: 'area' },
    { id: 'lache', label: 'Ce que je choisis de déposer', type: 'area' },
    { id: 'signe', label: 'Le signe que j’aurai pardonné', hint: 'Quand le souvenir ne réveille plus la même douleur.', type: 'area' },
    { id: 'douleurApres', label: 'Ce que ça me fait maintenant', type: 'slider', max: 10 }] },
];

export const ACCORD_REPONSES = ['Oui', 'En partie', 'Pas aujourd’hui'];
