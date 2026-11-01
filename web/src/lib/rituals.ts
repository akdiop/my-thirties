import type { Entry } from './cloud';
import type { GlyphName, Tint } from '../ui/Glyph';

/** Entrées des nouveaux écrans (Mon jour, Habitudes, Notes) : gérées par leurs propres écrans, pas par les listes des espaces. */
export const DAILY_KIND = 'daily';
export const NOTE_KIND = 'note';
export const HABIT_KIND = 'habit';
export const RITUAL_KINDS = [DAILY_KIND, NOTE_KIND, HABIT_KIND];

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

export const HABIT_GROUPS = ['Bien-être & corps', 'Organisation & focus', 'Croissance & apprentissage', 'Relations & connexion', 'Spiritualité'];
const GROUP_TINT: Record<string, Tint> = { 'Bien-être & corps': 'sauge', 'Organisation & focus': 'caramel', 'Croissance & apprentissage': 'lilas', 'Relations & connexion': 'rose', 'Spiritualité': 'or' };
const h = (group: string, id: string, icon: GlyphName, title: string, why: string, level: HabitLevel, freq: HabitFreq): HabitTemplate => ({ id, group, icon, tint: GROUP_TINT[group] ?? 'chocolat', title, why, level, freq });
export const HABIT_LIBRARY: HabitTemplate[] = [
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
export const habitDone = (e: Entry) => (e.data.done && typeof e.data.done === 'object' ? e.data.done as Record<string, boolean> : {});
export const habitFreq = (e: Entry): HabitFreq => (['daily', '3w', '1w'].includes(String(e.data.freq)) ? e.data.freq as HabitFreq : 'daily');
/** Série en cours : jours consécutifs (quotidienne) ou semaines où l'objectif est atteint (hebdomadaire). */
export function habitStreak(e: Entry, today: string) {
  const done = habitDone(e), f = habitFreq(e);
  if (f === 'daily') {
    let day = done[today] ? today : addDays(today, -1), n = 0;
    while (done[day]) { n++; day = addDays(day, -1); }
    return n;
  }
  let week = weekStartOf(today), n = 0;
  const count = (w: string) => Array.from({ length: 7 }, (_, i) => addDays(w, i)).filter((d) => done[d]).length;
  if (count(week) < freqTarget(f)) week = addDays(week, -7);
  while (count(week) >= freqTarget(f)) { n++; week = addDays(week, -7); }
  return n;
}

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
];
export const noteType = (id: unknown) => NOTE_TYPES.find((t) => t.id === id) ?? NOTE_TYPES[3]!;

/* ---------- Couleurs (à la place des photos) ---------- */
/** Palette beige, crème, sauge, caramel, chocolat de l'app : un fond doux et une couleur d'accent. */
export const SWATCHES = [
  ['#F3E6D8', '#B5835A'], ['#E3E8DB', '#5E7A5F'], ['#F1E4E0', '#B07A6E'], ['#E9DCCF', '#6B3F2E'],
  ['#EFE7D2', '#A88A4C'], ['#E2E6EA', '#5D6F7E'], ['#EADFEA', '#86688A'], ['#F5E9DA', '#C0703F'],
] as const;
export const swatchOf = (key: string) => SWATCHES[[...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 3) % SWATCHES.length]!;
