/**
 * Les 10 premiers jours de Dhu al-Hijja : un thème, des actes du jour, une question de réflexion et une citation par jour.
 * D'après le « Dhu al-Hijjah Planner » de Towards Faith (Tahera Zulfeqar), traduit et reformulé ; sources des citations telles que données dans le planner.
 */
import { hijriOf } from './hijri';

export const DHUL_HIJJA_KIND = 'dhul_hijja';

export type DhDay = { theme: string; intro: string; question: string; quote: { text: string; ref: string; phonetic?: string } };

export const DH_DAYS: DhDay[] = [
  { theme: 'L’intention', intro: 'La niyya, c’est la détermination sincère et consciente du cœur : elle donne sa valeur à chaque acte. Pose aujourd’hui ce que tu veux vivre pendant ces dix jours.',
    question: 'Quel est ton objectif spirituel numéro un pour ces dix jours ?',
    quote: { text: 'Seigneur, ouvre-moi ma poitrine, facilite-moi ma tâche et dénoue le nœud de ma langue, afin qu’ils comprennent mes paroles.', ref: 'Coran 20:25-28',
      phonetic: 'Rabbi-shrah lî sadrî, wa yassir lî amrî, wa-hlul ‘uqdatan min lisânî, yafqahû qawlî' } },
  { theme: 'La prière', intro: 'La salât, deuxième pilier de l’islam, est le lien direct avec Allah : on y cherche Sa guidée, Sa miséricorde et Son pardon.',
    question: 'Repense à une prière vécue avec khushû‘. Que peux-tu en reprendre dans tes prières de chaque jour ?',
    quote: { text: 'Accomplissez la prière et acquittez la zakât. Tout le bien que vous avancez pour vous-mêmes, vous le retrouverez auprès d’Allah. Allah voit parfaitement ce que vous faites.', ref: 'Coran 2:110' } },
  { theme: 'Le jeûne', intro: 'Le jeûne est un chemin privilégié vers la taqwâ : la conscience d’Allah, la piété et la droiture.',
    question: 'Quelle mauvaise habitude aimerais-tu laisser derrière toi grâce au jeûne ?',
    quote: { text: 'Toute bonne action du fils d’Adam est pour lui, sauf le jeûne : il est pour Moi et c’est Moi qui le récompense. L’haleine du jeûneur est meilleure auprès d’Allah que le parfum du musc.', ref: 'al-Boukhârî' } },
  { theme: 'L’invocation', intro: 'La dou‘â est le cœur de l’adoration : un moment pour se tourner vers Allah et Lui demander tout, petit ou grand.',
    question: 'Où en est ta relation avec la dou‘â ? Comment en faire un rendez-vous régulier ?',
    quote: { text: 'Quand Mes serviteurs t’interrogent sur Moi, Je suis tout proche : Je réponds à l’appel de celui qui M’invoque quand il M’invoque. Qu’ils répondent à Mon appel et croient en Moi, afin d’être bien guidés.', ref: 'Coran 2:186' } },
  { theme: 'Le Coran', intro: 'Le Coran est le guide de vie qu’Allah nous a donné : il nous parle de notre raison d’être, de notre lien avec Lui et de la manière de vivre qui Lui plaît.',
    question: 'Combien de fois par semaine lis-tu le Coran, et comment lire plus souvent ?',
    quote: { text: 'Celui qui récite le Coran avec aisance sera avec les nobles anges scribes obéissants, et celui qui le récite avec difficulté, en faisant de son mieux, aura deux récompenses.', ref: 'al-Boukhârî et Mouslim' } },
  { theme: 'La sadaqa', intro: 'Donner, en argent ou autrement, peu ou beaucoup, nourrit la gratitude et l’humilité et ouvre des portes de bien.',
    question: 'Quelle petite sadaqa simple pourrais-tu rendre automatique, chaque jour ou chaque semaine ?',
    quote: { text: 'Les hommes et les femmes qui font l’aumône et qui ont fait à Allah un beau prêt, cela leur sera multiplié et ils auront une généreuse récompense.', ref: 'Coran 57:18' } },
  { theme: 'Rendre service', intro: 'Aider les autres est une façon directe d’avoir un impact : nous sommes liés les uns aux autres et responsables de nous soutenir.',
    question: 'À quand remonte ton dernier service rendu ? Quel talent peux-tu mettre au service des autres ?',
    quote: { text: 'Celui qui soulage un croyant d’une peine de ce monde, Allah le soulagera d’une peine du Jour de la Résurrection ; et celui qui facilite les choses à quelqu’un en difficulté, Allah les lui facilitera dans l’au-delà…', ref: 'Mouslim' } },
  { theme: 'Le dhikr', intro: 'Le rappel d’Allah est le chemin le plus simple vers la réussite du jour : garder la langue humide de Son évocation ouvre des portes inattendues.',
    question: 'Qu’est-ce qui te distrait pendant le dhikr, et comment rester régulière ?',
    quote: { text: 'Ceux qui ont cru et dont les cœurs s’apaisent au rappel d’Allah. N’est-ce point par le rappel d’Allah que les cœurs s’apaisent ?', ref: 'Coran 13:28' } },
  { theme: 'La réflexion', intro: 'Le tafakkur, méditer sur soi et sur sa relation avec Allah, est une adoration : faire le point et agir renforce la foi. C’est aussi le jour de ‘Arafa.',
    question: 'Quelle est la leçon la plus importante que tu retiens de ces jours ?',
    quote: { text: 'Ceux qui évoquent Allah debout, assis ou couchés sur le côté, et méditent sur la création des cieux et de la terre…', ref: 'Coran 3:191' } },
  { theme: 'Célébrer', intro: 'Jour de l’Aïd al-Adha : remercie Allah pour chaque victoire, petite ou grande, de ces dix jours.',
    question: 'Repense à ces neuf jours, les hauts comme les bas. Quel programme spirituel quotidien veux-tu garder ?',
    quote: { text: 'Le jour de ‘Arafa, le jour du sacrifice et les trois jours de Tashrîq sont des jours de fête pour les gens de l’islam : des jours où l’on mange et où l’on boit.', ref: 'at-Tirmidhî' } },
];

/** Actes de chaque jour, puis ceux à ajouter si possible. */
export const DH_ACTS = ['Fajr', 'Dou‘â du matin', 'Coran', 'Dhuhr', 'Asr', 'Dou‘â du soir', 'Maghrib', 'Isha'];
export const DH_EXTRAS = ['Jeûne', 'Dhikr', 'Salawât', 'Sadaqa', 'Prière de nuit', 'Prière de Duha'];

/** Pourquoi ces jours comptent (Stage 1 du planner, reformulé). */
export const DH_KNOWLEDGE: { text: string; ref?: string }[] = [
  { text: 'Le nombre des mois auprès d’Allah est de douze, dans Son Livre, depuis le jour où Il a créé les cieux et la terre ; quatre d’entre eux sont sacrés. Voilà la religion droite : ne vous faites donc pas de tort pendant ces mois.', ref: 'Coran 9:36' },
  { text: 'Les quatre mois sacrés sont Rajab, Dhu al-Qa‘da, Dhu al-Hijja et Muharram. Dhu al-Hijja réunit le Hajj et l’Aïd al-Adha.' },
  { text: 'Il n’y a pas de jours où les bonnes œuvres sont plus aimées d’Allah que ces jours-ci (les dix premiers de Dhu al-Hijja). On lui demanda : « Pas même le jihad dans le sentier d’Allah ? » Il dit : « Pas même le jihad, sauf un homme qui part avec sa personne et ses biens et ne revient avec rien. »', ref: 'Ibn Mâjah 1727, rapporté par Ibn ‘Abbâs' },
  { text: '‘Arafa (le 9) : les pèlerins se tiennent sur le mont ‘Arafa en prière et en invocation. C’est le jour où la religion a été parachevée : « Aujourd’hui, J’ai parachevé pour vous votre religion, accompli sur vous Mon bienfait et agréé l’islam comme religion pour vous. »', ref: 'Coran 5:3' },
  { text: 'Adorer Allah ce jour-là a de nombreux mérites, et le jeûne du jour de ‘Arafa expie les péchés de deux années.' },
  { text: 'L’Aïd al-Adha (le 10) rappelle l’abandon d’Ibrahim ﷺ à Allah ; on y sacrifie une bête, on prie, on remercie et on partage en famille.' },
];

/** Jour 1 à 10 de Dhu al-Hijja (ou 11 à 13, jours de Tashrîq), sinon dans combien de jours commence le prochain. */
export function dhulHijjaStatus(iso: string): { day: number; hijriYear: number } | { daysUntil: number; hijriYear: number; startIso: string } | null {
  const h = hijriOf(iso);
  if (!h) return null;
  if (h.month === 12 && h.day <= 13) return { day: h.day, hijriYear: h.year };
  for (let i = 1; i <= 400; i++) {
    const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + i);
    const di = d.toISOString().slice(0, 10), x = hijriOf(di);
    if (x && x.month === 12 && x.day === 1) return { daysUntil: i, hijriYear: x.year, startIso: di };
  }
  return null;
}

export type DhData = { year?: number; days?: Record<string, { acts?: Record<string, boolean>; answer?: string }> };
export const actsDone = (d: DhData, day: number) => Object.entries(d.days?.[day]?.acts ?? {}).filter(([k, v]) => v && DH_ACTS.includes(k)).length;
