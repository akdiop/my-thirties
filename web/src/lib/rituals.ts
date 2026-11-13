import type { Entry } from './cloud';
import type { GlyphName, Tint } from '../ui/Glyph';
import { addIso, autoCount, streakOf, streakUnit, clampN, cycleRestOn, daysOf, doneDates, doneOf, dueOn, everyWait as everyWaitOf, goalOf, inSeason, monthStart, pausedOn, pauseOf, periodCount as periodCountOf, prayerOf, restOn, ruleOf, RULE_RANGE, scheduledOn, seasonOf, type HabitCtx, type HabitRule, type HabitSeason } from '../../supabase/functions/push-reminders/habits';

/** Entrées des nouveaux écrans (Mon jour, Habitudes, Notes) : gérées par leurs propres écrans, pas par les listes des espaces. */
export const DAILY_KIND = 'daily';
export const NOTE_KIND = 'note';
export const HABIT_KIND = 'habit';
export const RITUAL_KINDS = [DAILY_KIND, NOTE_KIND, HABIT_KIND, 'vision', 'objectif', 'roue', 'parcours_progressif', 'meditation', 'focus', 'sommeil', 'complement', 'reglages_accueil', 'reglages_integrations', 'proche', 'lecture', 'envie', 'panda', 'invocations', 'programme_3mois', 'lecture_coran', 'carnet_page', 'voeu', 'carnet_reglages', 'gratitude_jour', 'gratitude_reglages', 'tcc', 'tcc_echelle', 'hsp', 'ressenti', 'theme_astral', 'citation_perso', 'jardin'];

export const MOODS: { value: string; icon: GlyphName; tint: Tint }[] = [
  { value: 'Épuisée', icon: 'battery', tint: 'rose' }, { value: 'Fatiguée', icon: 'rain', tint: 'ardoise' }, { value: 'Neutre', icon: 'meh', tint: 'or' },
  { value: 'Bien', icon: 'smile', tint: 'sauge' }, { value: 'Rayonnante', icon: 'sun', tint: 'terre' },
];
export const moodOf = (m: unknown) => MOODS.find((x) => x.value === m) ?? (m === 'Sereine' || m === 'Joyeuse' ? MOODS[3] : m === 'Stressée' ? MOODS[0] : undefined);

/** Affirmations écrites pour l'app (aucune citation attribuée à une personne). */
export const AFFIRMATIONS = [
  'Je fais de mon mieux, et c’est suffisant.', 'J’avance à mon rythme, sans me comparer.', 'Je mérite le repos autant que la réussite.',
  'Chaque petit pas compte.', 'Je choisis ce qui me fait du bien.', 'Je peux dire non sans me justifier.', 'Mon calme est ma force.',
  'Je suis fière du chemin parcouru.', 'Aujourd’hui, je prends soin de moi.', 'Je laisse partir ce que je ne contrôle pas.',
  'Je crois en ce que je construis.', 'J’ai le droit de commencer petit.', 'Ma valeur ne dépend pas de ma productivité.',
  'Je respire, je ralentis, je recentre.', 'Je suis capable d’apprendre tout ce dont j’ai besoin.', 'Je célèbre mes progrès, même discrets.',
  'Je m’entoure de ce qui m’élève.', 'Je fais confiance au temps.', 'Je suis à ma place.', 'Je transforme mes doutes en curiosité.',
  'Je mérite des relations douces et sincères.', 'Ma journée ne doit pas être parfaite pour être belle.', 'Je me parle avec bienveillance.',
  'Je suis en train de devenir la femme que je veux être.', 'Je garde mon énergie pour ce qui compte.', 'Aujourd’hui est une nouvelle page.',
  'Je peux recommencer à tout moment.', 'Je prends ma place, sereinement.', 'Je suis reconnaissante pour ce qui est déjà là.', 'Je suis assez.',
];
export const affirmationOf = (day: string, shift = 0) => {
  const n = [...day].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return AFFIRMATIONS[(n + shift) % AFFIRMATIONS.length]!;
};

/* ---------- Habitudes ---------- */
export type HabitLevel = 'Douce' | 'Modérée' | 'Engagée';
export type HabitFreq = 'daily' | '3w' | '1w';
export type HabitTemplate = { id: string; group: string; icon: GlyphName; tint: Tint; title: string; why: string; level: HabitLevel; freq: HabitFreq };
export const FREQ_LABEL: Record<HabitFreq, string> = { daily: 'Chaque jour', '3w': '3 fois par semaine', '1w': '1 fois par semaine' };
export const freqTarget = (f: HabitFreq) => (f === 'daily' ? 7 : f === '3w' ? 3 : 1);

export const HABIT_GROUPS = ['Routine du matin', 'Routine du soir', 'Bien-être & corps', 'Organisation & focus', 'Croissance & apprentissage', 'Relations & connexion', 'Spiritualité'];
const GROUP_TINT: Record<string, Tint> = { 'Routine du matin': 'or', 'Routine du soir': 'lilas', 'Bien-être & corps': 'sauge', 'Organisation & focus': 'caramel', 'Croissance & apprentissage': 'lilas', 'Relations & connexion': 'rose', 'Spiritualité': 'or' };
const h = (group: string, id: string, icon: GlyphName, title: string, why: string, level: HabitLevel, freq: HabitFreq): HabitTemplate => ({ id, group, icon, tint: GROUP_TINT[group] ?? 'chocolat', title, why, level, freq });
export const HABIT_LIBRARY: HabitTemplate[] = [
  h('Routine du matin', 'm-reveil', 'sunrise', 'Me lever tôt', 'Prendre le temps de me réveiller en douceur et de dire merci.', 'Modérée', 'daily'),
  h('Routine du matin', 'm-eau', 'drop', 'Un grand verre d’eau au réveil', 'Me réhydrater après la nuit et retrouver de l’énergie.', 'Douce', 'daily'),
  h('Routine du matin', 'm-spi', 'sparkle', 'Mon moment spirituel du matin', '5 à 10 minutes : prière, méditation, Coran ou dou‘a.', 'Douce', 'daily'),
  h('Routine du matin', 'm-bouger', 'stretch', 'Bouger mon corps le matin', 'Étirements, yoga ou sport pour réveiller corps et esprit.', 'Modérée', 'daily'),
  h('Routine du matin', 'm-petitdej', 'croissant', 'Un petit-déjeuner sain', 'Un repas équilibré pour démarrer avec de l’énergie.', 'Douce', 'daily'),
  h('Routine du matin', 'm-plan', 'calendar', 'Noter mes priorités du jour', 'Mes priorités et mes tâches, pour rester organisée.', 'Douce', 'daily'),
  h('Routine du matin', 'm-soin', 'sparkles', 'Prendre soin de moi le matin', 'Skincare, une tenue où je me sens bien dans ma peau.', 'Douce', 'daily'),
  h('Routine du matin', 'm-positive', 'heart', 'Une pensée positive', 'Confiance en moi : je suis capable de grandes choses.', 'Douce', 'daily'),
  h('Routine du soir', 's-ecrans', 'phoneOff', 'Déconnecter 1 h avant de dormir', 'Loin des écrans pour préparer un vrai repos.', 'Engagée', 'daily'),
  h('Routine du soir', 's-bilan', 'notebook', 'Le bilan de ma journée', 'Ce qui était positif, ce que je peux améliorer, ce dont je suis fière.', 'Douce', 'daily'),
  h('Routine du soir', 's-spi', 'bookText', 'Mon moment spirituel du soir', 'Prière, Coran ou invocations, et remercier Allah pour la journée.', 'Douce', 'daily'),
  h('Routine du soir', 's-lendemain', 'list', 'Préparer le lendemain', 'Mes affaires, ma tenue et ma to-do list, pour une matinée sans stress.', 'Douce', 'daily'),
  h('Routine du soir', 's-soin', 'sparkles', 'Prendre soin de moi le soir', 'Skincare, douche chaude, soin des cheveux : un moment rien que pour moi.', 'Douce', 'daily'),
  h('Routine du soir', 's-lecture', 'book', 'Lire ou apprendre le soir', 'Quelques pages d’un livre ou une chose nouvelle.', 'Douce', 'daily'),
  h('Routine du soir', 's-detente', 'coffee', 'Préparer mon corps au sommeil', 'Infusion, étirements légers, respiration profonde.', 'Douce', 'daily'),
  h('Routine du soir', 's-heure', 'moon', 'Dormir à heure fixe', 'Un bon sommeil, essentiel pour ma santé et mon énergie.', 'Modérée', 'daily'),
  h('Bien-être & corps', 'eau', 'drop', 'Boire 1,5 L d’eau', 'Un verre au réveil, une gourde à portée de main.', 'Douce', 'daily'),
  h('Bien-être & corps', 'bouger', 'steps', 'Bouger 20 minutes', 'Marche, danse, étirements : tout compte.', 'Modérée', 'daily'),
  h('Bien-être & corps', 'minuit', 'moon', 'Au lit avant minuit', 'Le sommeil répare tout le reste.', 'Modérée', 'daily'),
  h('Bien-être & corps', 'air', 'trees', 'Prendre l’air', 'Cinq minutes dehors, sans téléphone.', 'Douce', 'daily'),
  h('Bien-être & corps', 'ecran', 'phoneOff', 'Pas d’écran au lit', 'Le téléphone dort hors de la chambre.', 'Modérée', 'daily'),
  h('Bien-être & corps', 'stretch', 'stretch', '10 minutes d’étirements', 'Le matin ou avant de dormir.', 'Douce', 'daily'),
  h('Bien-être & corps', 'maison', 'salad', 'Un repas fait maison', 'Simple, frais, préparé par toi.', 'Modérée', 'daily'),
  h('Bien-être & corps', 'soin', 'sparkles', 'Ma routine soin du soir', 'Démaquillage, soin, cheveux : un rituel doux.', 'Douce', 'daily'),
  h('Organisation & focus', 'planifier', 'calendar', 'Planifier ma journée', 'Deux minutes de clarté le matin.', 'Douce', 'daily'),
  h('Organisation & focus', 'dur', 'target', 'Le plus difficile d’abord', 'Commencer par ce qui pèse allège la journée.', 'Engagée', 'daily'),
  h('Organisation & focus', 'ranger', 'brush', '10 minutes de rangement', 'Une zone à la fois.', 'Douce', 'daily'),
  h('Organisation & focus', 'depenses', 'wallet', 'Noter mes dépenses', 'Trente secondes dans Mes finances.', 'Douce', 'daily'),
  h('Organisation & focus', 'semaine', 'list', 'Préparer ma semaine', 'Le dimanche : agenda, repas, priorités.', 'Modérée', '1w'),
  h('Croissance & apprentissage', 'lire', 'book', 'Lire 10 pages', 'Dix pages par jour, une douzaine de livres par an.', 'Douce', 'daily'),
  h('Croissance & apprentissage', 'podcast', 'headphones', 'Un podcast inspirant', 'Pendant le trajet ou le ménage.', 'Douce', '3w'),
  h('Croissance & apprentissage', 'apprendre', 'brain', 'Apprendre quelque chose', 'Une vidéo, un article, une compétence.', 'Douce', '3w'),
  h('Croissance & apprentissage', 'objectifs', 'compass', 'Revoir mes objectifs', 'Garder le cap, ajuster si besoin.', 'Douce', '1w'),
  h('Croissance & apprentissage', 'journal', 'notebook', 'Écrire dans mon journal', 'Vider sa tête pour mieux avancer.', 'Douce', '3w'),
  h('Croissance & apprentissage', 'langue', 'languages', 'Pratiquer une langue', '15 minutes de wolof, d’espagnol ou d’arabe.', 'Modérée', 'daily'),
  h('Relations & connexion', 'appeler', 'phone', 'Appeler quelqu’un qui compte', 'Prendre des nouvelles, vraiment.', 'Douce', '1w'),
  h('Relations & connexion', 'merci', 'mail', 'Un message de gratitude', 'Dire à quelqu’un ce qu’il t’apporte.', 'Douce', '1w'),
  h('Relations & connexion', 'qualite', 'users', 'Du temps sans écran avec mes proches', 'Être là, entièrement.', 'Modérée', '3w'),
  h('Relations & connexion', 'moi', 'heart', 'Un moment pour moi seule', 'Pas pour être productive : juste pour toi.', 'Douce', 'daily'),
  h('Spiritualité', 'dhikr', 'sparkle', 'Dhikr du matin', 'Quelques minutes de rappel au réveil.', 'Douce', 'daily'),
  h('Spiritualité', 'coran', 'bookText', 'Lire une page du Coran', 'Une page, à ton rythme.', 'Douce', 'daily'),
  h('Spiritualité', 'priere', 'landmark', 'Prier à l’heure', 'Les cinq prières dans leur créneau.', 'Engagée', 'daily'),
  h('Bien-être & corps', 'petitdej', 'croissant', 'Un vrai petit-déjeuner', 'Protéines et fruits pour tenir la matinée.', 'Douce', 'daily'),
  h('Bien-être & corps', 'fruits', 'apple', 'Deux fruits par jour', 'Au goûter ou en dessert.', 'Douce', 'daily'),
  h('Bien-être & corps', 'legumes', 'carrot', 'Des légumes à chaque repas', 'La moitié de l’assiette, en couleurs.', 'Modérée', 'daily'),
  h('Bien-être & corps', 'sucre', 'cookie', 'Moins de sucre ajouté', 'Pas de soda, dessert plaisir le week-end.', 'Engagée', 'daily'),
  h('Bien-être & corps', 'sport3', 'dumbbell', 'Une séance de sport', 'Pilates, tennis, padel ou workout.', 'Modérée', '3w'),
  h('Bien-être & corps', 'pas', 'steps', '8 000 pas', 'Prendre les escaliers, marcher en appelant.', 'Modérée', 'daily'),
  h('Bien-être & corps', 'respirer', 'waves', '5 minutes de respiration', 'Inspire 4 s, expire 6 s, au calme.', 'Douce', 'daily'),
  h('Bien-être & corps', 'soleil', 'sun', 'Lumière du matin', 'Dix minutes dehors avant 10 h.', 'Douce', 'daily'),
  h('Bien-être & corps', 'cafe', 'coffee', 'Pas de café après 15 h', 'Pour mieux dormir le soir.', 'Modérée', 'daily'),
  h('Organisation & focus', 'inbox', 'mail', 'Boîte mail à zéro', 'Trier, répondre ou archiver en fin de journée.', 'Modérée', 'daily'),
  h('Organisation & focus', 'top3', 'target', 'Mes 3 priorités du jour', 'Trois choses, pas plus.', 'Douce', 'daily'),
  h('Organisation & focus', 'telephone', 'phoneOff', 'Une heure sans téléphone', 'Le téléphone dans une autre pièce pour te concentrer.', 'Modérée', 'daily'),
  h('Organisation & focus', 'lendemain', 'list', 'Préparer le lendemain', 'Tenue, sac, repas : prêts le soir.', 'Douce', 'daily'),
  h('Organisation & focus', 'budget', 'coins', 'Faire le point budget', 'Revoir dépenses et épargne de la semaine.', 'Douce', '1w'),
  h('Organisation & focus', 'menage', 'sparkles', 'Ménage express', 'Quinze minutes, minuteur lancé.', 'Douce', '3w'),
  h('Organisation & focus', 'pomodoro', 'history', 'Deux sessions de concentration', '25 minutes sans interruption, 5 minutes de pause.', 'Modérée', 'daily'),
  h('Organisation & focus', 'papiers', 'folder', 'Classer mes papiers', 'Factures, documents, rendez-vous.', 'Douce', '1w'),
  h('Organisation & focus', 'batch', 'pot', 'Batch cooking du dimanche', 'Préparer les midis de la semaine.', 'Modérée', '1w'),
  h('Organisation & focus', 'epargne', 'wallet', 'Mettre de côté', 'Un petit montant fixe, chaque semaine.', 'Douce', '1w'),
  h('Croissance & apprentissage', 'ted', 'idea', 'Une conférence inspirante', 'Une vidéo de 15 minutes sur un sujet nouveau.', 'Douce', '1w'),
  h('Croissance & apprentissage', 'cours', 'brain', 'Avancer dans une formation', 'Trente minutes sur un cours en ligne.', 'Modérée', '3w'),
  h('Croissance & apprentissage', 'ecrire', 'feather', 'Écrire 300 mots', 'Un texte, un article, une histoire.', 'Modérée', '3w'),
  h('Croissance & apprentissage', 'gratitude', 'star', 'Trois gratitudes', 'Trois choses qui t’ont fait du bien aujourd’hui.', 'Douce', 'daily'),
  h('Croissance & apprentissage', 'bilan', 'trophy', 'Mon bilan de la semaine', 'Ce qui a marché, ce que je change.', 'Douce', '1w'),
  h('Croissance & apprentissage', 'creatif', 'palette', 'Un moment créatif', 'Dessin, musique, déco, couture…', 'Douce', '1w'),
  h('Croissance & apprentissage', 'vocabulaire', 'languages', 'Un mot nouveau par jour', 'Dans une langue que tu apprends.', 'Douce', 'daily'),
  h('Croissance & apprentissage', 'actu', 'file', 'Lire un article de fond', 'Comprendre un sujet plutôt que survoler.', 'Douce', '3w'),
  h('Croissance & apprentissage', 'mentor', 'compass', 'Échanger avec une personne inspirante', 'Un café, un appel, une question.', 'Modérée', '1w'),
  h('Relations & connexion', 'maman', 'heart', 'Appeler ma famille', 'Un appel, même court.', 'Douce', '3w'),
  h('Relations & connexion', 'amie', 'users', 'Voir une amie', 'Un déjeuner, une marche, un thé.', 'Douce', '1w'),
  h('Relations & connexion', 'ecoute', 'smile', 'Écouter sans interrompre', 'Dans chaque conversation importante.', 'Modérée', 'daily'),
  h('Relations & connexion', 'compliment', 'sparkle', 'Faire un compliment sincère', 'À un proche ou à un collègue.', 'Douce', 'daily'),
  h('Relations & connexion', 'service', 'handHeart', 'Rendre un service', 'Un petit geste qui aide quelqu’un.', 'Douce', '1w'),
  h('Relations & connexion', 'anniversaires', 'cake', 'Penser aux anniversaires', 'Un message le jour J.', 'Douce', '1w'),
  h('Relations & connexion', 'repas', 'utensils', 'Un repas partagé', 'Cuisiner ou manger avec des proches.', 'Douce', '1w'),
  h('Relations & connexion', 'nonaccord', 'leaf', 'Dire non avec douceur', 'Protéger ton temps sans culpabiliser.', 'Engagée', '3w'),
  h('Relations & connexion', 'pardon', 'feather', 'Laisser partir une rancune', 'Écrire ce que tu choisis de pardonner.', 'Engagée', '1w'),
  h('Relations & connexion', 'benevolat', 'handHeart', 'Donner de mon temps', 'Une action bénévole ou solidaire.', 'Modérée', '1w'),
  h('Relations & connexion', 'lettre', 'mail', 'Écrire une lettre ou un long message', 'Pour quelqu’un qui compte.', 'Douce', '1w'),
  h('Spiritualité', 'dhikrsoir', 'moon', 'Dhikr du soir', 'Quelques minutes de rappel avant de dormir.', 'Douce', 'daily'),
  h('Spiritualité', 'istighfar', 'sparkles', 'Istighfar', 'Demander pardon, quelques minutes par jour.', 'Douce', 'daily'),
  h('Spiritualité', 'dua', 'handHeart', 'Un moment de du’a', 'Parler à Dieu de ce qui te tient à cœur.', 'Douce', 'daily'),
  h('Spiritualité', 'sadaqa', 'coins', 'Une sadaqa', 'Un don, même petit, chaque semaine.', 'Douce', '1w'),
  h('Spiritualité', 'sourate', 'bookHeart', 'Apprendre une sourate', 'Quelques versets par semaine, avec répétition.', 'Modérée', '3w'),
  h('Spiritualité', 'tafsir', 'book', 'Lire un peu de tafsir', 'Comprendre le sens de ce que tu récites.', 'Modérée', '3w'),
  h('Spiritualité', 'tasbih', 'sparkle', 'Tasbih après la prière', 'Rester assise un instant après la prière.', 'Douce', 'daily'),
  h('Spiritualité', 'duha', 'sunrise', 'Prière de Duha', 'Une prière surérogatoire en matinée.', 'Modérée', '3w'),
  h('Spiritualité', 'nuit', 'moon', 'Prière de la nuit', 'Deux unités avant de dormir ou avant Fajr.', 'Engagée', '1w'),
  h('Spiritualité', 'kahf', 'bookText', 'Sourate Al-Kahf le vendredi', 'Une lecture pour le vendredi.', 'Modérée', '1w'),
  h('Spiritualité', 'jeune', 'sun', 'Jeûne surérogatoire', 'Le lundi ou le jeudi, selon ton énergie.', 'Engagée', '1w'),
  h('Spiritualité', 'rappel', 'headphones', 'Écouter un rappel', 'Un cours ou une conférence religieuse.', 'Douce', '3w'),
  h('Spiritualité', 'sira', 'book', 'Lire la vie du Prophète ﷺ', 'Quelques pages de sîra.', 'Douce', '3w'),
];

export const isoOf = (d: Date) => d.toLocaleDateString('en-CA');
export const addDays = (iso: string, n: number) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return isoOf(d); };
/** Lundi de la semaine d'une date. */
export const weekStartOf = (iso: string) => { const d = new Date(iso + 'T12:00:00'); return addDays(iso, -((d.getDay() + 6) % 7)); };
export const habitDone = (e: Entry) => doneOf(e.data);
export const habitFreq = (e: Entry): HabitFreq => (['daily', '3w', '1w'].includes(String(e.data.freq)) ? e.data.freq as HabitFreq : 'daily');
export { RULE_RANGE, type HabitRule };
export const habitRule = (e: Entry) => ruleOf(e.data);
export const ruleOfFreq = (f: HabitFreq): HabitRule => (f === 'daily' ? { type: 'daily', n: 1 } : { type: 'week', n: freqTarget(f) });
export const ruleData = (r: HabitRule) => (r.type === 'daily' ? { freq: 'daily', n: null } : { freq: r.type, n: clampN(r.type, r.n) });
export const ruleLabel = (r: HabitRule) => r.type === 'daily' ? 'Chaque jour' : r.type === 'every' ? 'Tous les ' + r.n + ' jours'
  : r.n + ' fois par ' + (r.type === 'week' ? 'semaine' : 'mois');
export { type HabitCtx, type HabitSeason };
/** Contexte des habitudes : débuts de règles notés et données de chaque jour (pas, verres d'eau). */
export function habitCtx(entries: Entry[]): HabitCtx {
  const daily: Record<string, Record<string, unknown>> = {};
  for (const e of entries) if (e.kind === DAILY_KIND && e.entry_date) daily[e.entry_date] = { ...daily[e.entry_date], ...e.data };
  return { cycleStarts: entries.filter((e) => e.kind === 'cycle' && e.entry_date).map((e) => e.entry_date!), daily };
}
export const everyWait = (e: Entry, iso: string, ctx?: HabitCtx) => everyWaitOf(e.data, iso, ctx);
export const habitDue = (e: Entry, iso: string, ctx?: HabitCtx) => dueOn(e.data, iso, ctx);
/** Jour de repos : pause, hors saison ou repos pendant les règles. */
export const isResting = (e: Entry, iso: string, ctx?: HabitCtx) => restOn(e.data, iso, ctx);
export const restReason = (e: Entry, iso: string, ctx?: HabitCtx) => (pausedOn(e.data, iso) ? 'pause' : !inSeason(e.data, iso) ? 'saison' : cycleRestOn(e.data, iso, ctx?.cycleStarts) ? 'cycle' : '');
export const habitSeason = (e: Entry) => seasonOf(e.data);
export const habitPrayer = (e: Entry) => prayerOf(e.data);
export const periodCount = (e: Entry, iso: string) => periodCountOf(e.data, iso);
export const monthStartOf = monthStart;
export const isPaused = (e: Entry, iso: string) => pausedOn(e.data, iso);
export const habitPause = (e: Entry) => pauseOf(e.data);
export const isArchived = (e: Entry) => Boolean(e.data.archived);
/** Habitudes en cours (les archivées gardent leur historique mais sortent des listes du jour). */
export const activeHabits = (entries: Entry[]) => entries.filter((e) => e.kind === HABIT_KIND && !isArchived(e));
/** Nombre de fois attendues sur une durée en jours (pour les statistiques). */
export function expectedOver(r: HabitRule, span: number) {
  return Math.max(1, r.type === 'daily' ? span : r.type === 'week' ? Math.ceil(span / 7) * r.n : r.type === 'every' ? Math.ceil(span / r.n) : Math.round(span / 30 * r.n));
}
/** Objectif d'une semaine (bilan hebdomadaire). */
export const weekTarget = (r: HabitRule) => (r.type === 'daily' ? 7 : r.type === 'week' ? r.n : r.type === 'every' ? Math.ceil(7 / r.n) : Math.max(1, Math.round(r.n * 7 / 30)));
/** Une fréquence plus douce pour une habitude qui décroche. */
export const easierRule = (r: HabitRule): HabitRule | null => r.type === 'daily' ? { type: 'week', n: 4 } : r.type === 'week' ? (r.n > 1 ? { type: 'week', n: r.n - 1 } : { type: 'month', n: 3 })
  : r.type === 'every' ? (r.n < 60 ? { type: 'every', n: Math.min(60, r.n + Math.max(1, Math.round(r.n / 2))) } : null) : r.n > 1 ? { type: 'month', n: r.n - 1 } : null;
/** Bilan du mois en cours : régularité de chaque habitude (jours de repos exclus), la plus régulière, celle qui décroche et une fréquence plus douce. */
export function monthReview(habits: Entry[], today: string, ctx?: HabitCtx) {
  const start = monthStart(today);
  const rows = habits.map((e) => {
    const created = String(e.created_at ?? '').slice(0, 10), from = created > start ? created : start;
    let active = 0;
    for (let x = from; x <= today; x = addIso(x, 1)) if (!restOn(e.data, x, ctx)) active++;
    const count = doneDates(e.data).filter((d) => d >= from && d <= today).length;
    return { e, count, active, rate: active ? Math.min(1, count / expectedOver(habitRule(e), active)) : 0 };
  }).filter((x) => x.active >= 3).sort((a, b) => b.rate - a.rate);
  const best = rows[0] ?? null, low = rows.length > 1 ? rows[rows.length - 1]! : null;
  const struggling = low && low.rate < 0.5 ? low : null;
  return { rows, best, struggling, suggestion: struggling ? easierRule(habitRule(struggling.e)) : null };
}
export { streakUnit };

/** Objectif chiffré (ex. 6 verres) : compteur du jour, la coche se fait quand il est atteint. */
export const habitGoal = (e: Entry) => goalOf(e.data);
const countMap = (e: Entry) => (e.data.count && typeof e.data.count === 'object' ? e.data.count as Record<string, number> : {});
/** Compteur du jour : saisi à la main, ou rempli par la source automatique (le plus grand des deux). */
export const countOn = (e: Entry, iso: string, ctx?: HabitCtx) => { const g = habitGoal(e); const c = Number(countMap(e)[iso]);
  const manual = Number.isFinite(c) && c > 0 ? c : g && habitDone(e)[iso] ? g.target : 0; return Math.max(manual, autoCount(e.data, iso, ctx)); };
export function countData(e: Entry, iso: string, n: number) {
  const g = habitGoal(e), v = Math.max(0, Math.min(g?.target ?? 100000, n));
  return { ...e.data, count: { ...countMap(e), [iso]: v }, done: { ...habitDone(e), [iso]: Boolean(g && v >= g.target) } };
}
/** Routine en étapes : la coche se fait quand toutes les étapes du jour sont cochées. */
export const habitSteps = (e: Entry) => (Array.isArray(e.data.steps) ? (e.data.steps as unknown[]).map(String).map((x) => x.trim()).filter(Boolean).slice(0, 12) : []);
const stepsMap = (e: Entry) => (e.data.stepsDone && typeof e.data.stepsDone === 'object' ? e.data.stepsDone as Record<string, number[]> : {});
export const stepsOn = (e: Entry, iso: string) => { const all = habitSteps(e).map((_, i) => i); const v = stepsMap(e)[iso]; return Array.isArray(v) ? v.filter((i) => i < all.length) : habitDone(e)[iso] ? all : []; };
export function stepData(e: Entry, iso: string, i: number) {
  const cur = stepsOn(e, iso), next = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i].sort((a, b) => a - b);
  return { ...e.data, stepsDone: { ...stepsMap(e), [iso]: next }, done: { ...habitDone(e), [iso]: next.length === habitSteps(e).length } };
}
/** Cocher ou décocher un jour en entier (compteur et étapes suivent). */
export function toggleData(e: Entry, iso: string, on: boolean) {
  const g = habitGoal(e), steps = habitSteps(e);
  return { ...e.data, done: { ...habitDone(e), [iso]: on },
    ...(g ? { count: { ...countMap(e), [iso]: on ? g.target : 0 } } : {}),
    ...(steps.length ? { stepsDone: { ...stepsMap(e), [iso]: on ? steps.map((_, i) => i) : [] } } : {}) };
}
/** Note sur la coche d'un jour. */
export const habitNotes = (e: Entry) => (e.data.notes && typeof e.data.notes === 'object' ? e.data.notes as Record<string, string> : {});

/** Moment de la journée : les habitudes du moment présent passent en premier. */
export type HabitMoment = 'matin' | 'midi' | 'soir';
export const MOMENTS: { id: HabitMoment; label: string }[] = [{ id: 'matin', label: 'Matin' }, { id: 'midi', label: 'Midi' }, { id: 'soir', label: 'Soir' }];
export const momentOf = (e: Entry): HabitMoment | '' => (['matin', 'midi', 'soir'].includes(String(e.data.moment)) ? e.data.moment as HabitMoment : '');
export const momentNow = (hour: number): HabitMoment => (hour < 12 ? 'matin' : hour < 17 ? 'midi' : 'soir');
export const momentRank = (m: HabitMoment | '', now: HabitMoment) => (m === now ? 0 : m ? 1 + MOMENTS.findIndex((x) => x.id === m) : 9);

export const habitDays = (e: Entry) => daysOf(e.data);
/** L'habitude est-elle prévue ce jour-là ? */
export const habitScheduled = (e: Entry, iso: string) => scheduledOn(e.data, iso);
export const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
export const habitDaysLabel = (e: Entry) => { const d = habitDays(e); if (!d.length || d.length === 7) return ''; return d.length === 5 && !d.includes(5) && !d.includes(6) ? 'en semaine' : d.length === 2 && d.includes(5) && d.includes(6) ? 'le week-end' : [...d].sort().map((i) => ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'][i]).join(', '); };

/** Série en cours : jours consécutifs (quotidienne), semaines ou mois où l'objectif est atteint, ou fois faites à temps (tous les n jours). Les jours non prévus et les pauses ne cassent rien. */
/** Série en cours (voir streakOf). */
export const habitStreak = (e: Entry, today: string, ctx?: HabitCtx) => streakOf(e.data, today, ctx);

/* ---------- Notes ---------- */
export const NOTE_FOLDERS: { id: string; icon: GlyphName; tint: Tint; label: string }[] = [
  { id: 'journal', icon: 'notebook', tint: 'chocolat', label: 'Journal personnel' },
  { id: 'idees', icon: 'idea', tint: 'or', label: 'Idées & projets' },
  { id: 'bienetre', icon: 'leaf', tint: 'sauge', label: 'Bien-être' },
  { id: 'gratitude', icon: 'handHeart', tint: 'rose', label: 'Gratitude' },
];
export type NoteType = { id: string; icon: GlyphName; tint: Tint; label: string; hint: string; folder: string; prompt: string; to?: 'matin' | 'soir' };
export const NOTE_TYPES: NoteType[] = [
  { id: 'matin', icon: 'sunrise', tint: 'terre', label: 'Journal du matin', hint: 'Intention, priorités, gratitudes', folder: 'journal', prompt: '', to: 'matin' },
  { id: 'soir', icon: 'moon', tint: 'ardoise', label: 'Débriefing du soir', hint: 'Victoire, leçon, lâcher prise', folder: 'journal', prompt: '', to: 'soir' },
  { id: 'diary', icon: 'bookHeart', tint: 'rose', label: 'Cher journal', hint: 'Raconte ta journée, librement', folder: 'journal', prompt: 'Cher journal, aujourd’hui…' },
  { id: 'blank', icon: 'file', tint: 'chocolat', label: 'Page blanche', hint: 'Une note libre', folder: 'journal', prompt: 'Écris ce que tu veux…' },
  { id: 'brain', icon: 'cloud', tint: 'ardoise', label: 'Vide-tête', hint: 'Sans filtre, sans jugement', folder: 'bienetre', prompt: 'Tout ce qui tourne dans ma tête…' },
  { id: 'insight', icon: 'sparkles', tint: 'or', label: 'Ce que j’ai compris', hint: 'Une leçon, une prise de conscience', folder: 'journal', prompt: 'Aujourd’hui, j’ai compris que…' },
  { id: 'idea', icon: 'idea', tint: 'or', label: 'Idée ou projet', hint: 'À ne pas oublier', folder: 'idees', prompt: 'Mon idée…' },
  { id: 'gratitude', icon: 'handHeart', tint: 'rose', label: 'Gratitude libre', hint: 'Ce qui me rend reconnaissante', folder: 'gratitude', prompt: 'Je suis reconnaissante pour…' },
  { id: 'anger', icon: 'flame', tint: 'terre', label: 'Note de colère', hint: 'Juste pour toi, à brûler ensuite si tu veux', folder: 'bienetre', prompt: 'Ce qui m’énerve, sans retenue…' },
  { id: 'photo', icon: 'sun', tint: 'terre', label: 'Ma journée en photos', hint: 'Une photo, quelques mots', folder: 'journal', prompt: 'Ce que cette photo raconte de ma journée…' },
  { id: 'vocal', icon: 'music', tint: 'lilas', label: 'Mémo vocal', hint: 'Parle plutôt qu’écrire', folder: 'journal', prompt: 'Quelques mots pour retrouver ce mémo…' },
  { id: 'letter', icon: 'mail', tint: 'rose', label: 'Lettre à moi-même', hint: 'À la moi de dans un an', folder: 'journal', prompt: 'Chère moi de dans un an,…' },
  { id: 'dream', icon: 'moon', tint: 'lilas', label: 'Rêve de la nuit', hint: 'Avant qu’il ne s’efface', folder: 'journal', prompt: 'Cette nuit, j’ai rêvé que…' },
  { id: 'month', icon: 'calendar', tint: 'caramel', label: 'Bilan du mois', hint: 'Fiertés, leçons, envies', folder: 'journal', prompt: 'Ce mois-ci, je suis fière de… J’ai appris… Le mois prochain, j’ai envie de…' },
  { id: 'proud', icon: 'trophy', tint: 'or', label: 'Fierté', hint: 'Une chose dont je suis fière', folder: 'gratitude', prompt: 'Aujourd’hui, je suis fière de moi parce que…' },
];
export const noteType = (id: unknown) => NOTE_TYPES.find((t) => t.id === id) ?? NOTE_TYPES[3]!;

/* ---------- Couleurs (à la place des photos) ---------- */
/** Palette beige, crème, sauge, caramel, chocolat de l'app : un fond doux et une couleur d'accent. */
export const SWATCHES = [
  ['#EBE8E0', '#9A8F75'], ['#DDE5D7', '#5F7A59'], ['#ECEAE5', '#9C9482'], ['#E4E0D8', '#7E7254'],
  ['#E6E3DB', '#8C8168'], ['#e6e3dc', '#6b6862'], ['#EADFEA', '#86688A'], ['#EDEAE2', '#998A66'],
] as const;
export const swatchOf = (key: string) => SWATCHES[[...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 3) % SWATCHES.length]!;
