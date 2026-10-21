import type { ModuleId } from './lib/cloud';

/**
 * Types de champs : on privilégie les choix guidés (puces, échelles, compteurs) plutôt que le texte libre.
 * - chips : un seul choix parmi des puces ; `other` permet d'ajouter une valeur personnelle.
 * - multi : plusieurs choix, enregistrés séparés par des virgules.
 * - scale : échelle de 1 à 5 avec libellés.
 * - stepper : nombre avec boutons − / + et valeurs rapides.
 * - text / textarea : réservés aux notes facultatives (repliées par défaut).
 */
export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'time' | 'select' | 'chips' | 'multi' | 'scale' | 'stepper';
export type Field = {
  id: string; label: string; type: FieldType; options?: string[]; placeholder?: string;
  other?: boolean; optional?: boolean; min?: number; max?: number; step?: number; unit?: string; presets?: number[];
  low?: string; high?: string;
};
export type Kind = { id: string; label: string; fields: Field[]; title?: (data: Record<string, string>) => string; hidden?: boolean };
export type Module = { id: ModuleId; name: string; description: string; symbol: string; kinds: Kind[]; sensitive?: boolean };

const note: Field = { id: 'notes', label: 'Ajouter une note', type: 'textarea', optional: true };
const date: Field = { id: 'date', label: 'Date', type: 'date' };
const time: Field = { id: 'time', label: 'Heure', type: 'time', optional: true };
const amount: Field = { id: 'amount', label: 'Montant', type: 'stepper', min: 0, step: 500, presets: [1000, 5000, 10000, 25000, 50000] };
const currency: Field = { id: 'currency', label: 'Devise', type: 'chips', options: ['XOF', 'EUR', 'USD'] };
const discipline: Field = { id: 'discipline', label: 'Discipline', type: 'chips', options: ['Tennis', 'Pilates', 'Yoga', 'Marche', 'Renforcement', 'Course', 'Danse', 'Natation'], other: true };
const repeat: Field = { id: 'frequency', label: 'Répétition', type: 'chips', options: ['Aucune', 'Quotidienne', 'Hebdomadaire'] };
const minutes = (label = 'Durée'): Field => ({ id: 'duration', label, type: 'stepper', min: 5, max: 300, step: 5, unit: 'min', presets: [15, 30, 45, 60, 90] });
const first = (d: Record<string, string>, k: string, fallback: string) => (d[k] || fallback);

export const EXPENSE_CATEGORIES = ['Logement', 'Alimentation', 'Transport', 'Santé', 'Shopping', 'Loisirs', 'Voyages', 'Abonnements', 'Famille', 'Beauté', 'Sport', 'Autres'];
export const INCOME_CATEGORIES = ['Salaire', 'Freelance', 'Prime', 'Cadeau', 'Remboursement', 'Autres'];
export const COUNTRY_SUGGESTIONS = ['Sénégal', 'France', 'Maroc', 'Mauritanie', 'Cap-Vert', 'Gambie', 'Côte d’Ivoire', 'Ghana', 'Rwanda', 'Kenya', 'Tanzanie', 'Afrique du Sud', 'Portugal', 'Espagne', 'Italie', 'Grèce', 'Danemark', 'Pays-Bas', 'Suisse', 'Royaume-Uni', 'Turquie', 'Émirats arabes unis', 'Japon', 'Indonésie', 'Canada', 'États-Unis', 'Brésil'];
export const SERIES_PLATFORMS = ['Netflix', 'Prime Video', 'Disney+', 'Canal+', 'Apple TV+', 'Max', 'YouTube', 'Autre'];
export const SERIES_GENRES = ['Drame', 'Comédie', 'Thriller', 'Policier', 'Romance', 'Fantastique', 'Science-fiction', 'Documentaire', 'Animation', 'K-drama', 'Nollywood', 'Télénovela'];

export const modules: Module[] = [
  {
    id: 'quotidien', name: 'Mon quotidien', symbol: '◷', description: 'Agenda, tâches et routines',
    kinds: [
      { id: 'task', label: 'Tâche', fields: [date, time, { id: 'priority', label: 'Priorité', type: 'chips', options: ['Haute', 'Normale', 'Basse'] }, repeat,
        { id: 'context', label: 'Domaine', type: 'chips', options: ['Travail', 'Maison', 'Famille', 'Administratif', 'Santé', 'Courses', 'Personnel'] },
        { id: 'subtasksText', label: 'Sous-tâches (une par ligne)', type: 'textarea', optional: true }, note] },
      { id: 'event', label: 'Événement', fields: [date, { ...time, optional: false }, minutes(),
        { id: 'location', label: 'Lieu', type: 'chips', options: ['Bureau', 'Maison', 'En ligne', 'Extérieur'], other: true }, repeat,
        { id: 'category', label: 'Type', type: 'chips', options: ['Travail', 'Rendez-vous', 'Famille', 'Amis', 'Sortie', 'Santé', 'Religieux'] }, note] },
      { id: 'routine', label: 'Routine', fields: [date, { ...time, optional: false }, { id: 'frequency', label: 'Fréquence', type: 'chips', options: ['Quotidienne', 'Hebdomadaire'] },
        { id: 'moment', label: 'Moment', type: 'chips', options: ['Matin', 'Midi', 'Soir', 'Week-end'] }, note] },
    ],
  },
  {
    id: 'sante', name: 'Ma santé', symbol: '♡', description: 'Cycle, symptômes, sommeil et rendez-vous', sensitive: true,
    kinds: [
      { id: 'cycle', label: 'Début des règles', title: () => 'Règles', fields: [{ ...date, label: 'Premier jour' }, { id: 'endDate', label: 'Dernier jour (facultatif)', type: 'date', optional: true },
        { id: 'flow', label: 'Flux', type: 'chips', options: ['Léger', 'Moyen', 'Abondant'] },
        { id: 'symptoms', label: 'Symptômes', type: 'multi', options: ['Crampes', 'Fatigue', 'Maux de tête', 'Ballonnements', 'Seins sensibles', 'Irritabilité', 'Acné', 'Mal de dos'] }, note] },
      { id: 'sleep', label: 'Sommeil', title: (d) => `Nuit · ${first(d, 'hours', '?')} h`, fields: [date, { id: 'hours', label: 'Durée', type: 'stepper', min: 0, max: 14, step: 0.5, unit: 'h', presets: [5, 6, 7, 8, 9] },
        { id: 'quality', label: 'Qualité ressentie', type: 'chips', options: ['Bonne', 'Moyenne', 'Difficile'] },
        { id: 'wakeups', label: 'Réveils', type: 'chips', options: ['Aucun', '1', '2', '3 ou plus'] }, note] },
      { id: 'hydration', label: 'Hydratation', title: (d) => `Eau · ${first(d, 'glasses', '?')} verres`, fields: [date, { id: 'glasses', label: 'Verres bus', type: 'stepper', min: 0, max: 20, step: 1, presets: [4, 6, 8] }] },
      { id: 'mood', label: 'Humeur et énergie', title: (d) => `Humeur · ${first(d, 'mood', '')}`, fields: [date,
        { id: 'mood', label: 'Humeur', type: 'chips', options: ['Sereine', 'Joyeuse', 'Fatiguée', 'Stressée', 'Triste', 'Irritée'] },
        { id: 'energy', label: 'Énergie', type: 'chips', options: ['Faible', 'Modérée', 'Bonne'] }, note] },
      { id: 'food', label: 'Journal alimentaire', title: (d) => first(d, 'meal', 'Repas'), fields: [date,
        { id: 'meal', label: 'Repas', type: 'chips', options: ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'] },
        { id: 'feeling', label: 'Ressenti', type: 'chips', options: ['Rassasiée', 'Légère', 'Lourde', 'Encore faim'] },
        { id: 'meals', label: 'Ce que j’ai mangé (facultatif)', type: 'textarea', optional: true }] },
      { id: 'symptom', label: 'Symptôme', title: (d) => first(d, 'symptoms', 'Symptôme').split(',')[0]!, fields: [date,
        { id: 'symptoms', label: 'Symptômes', type: 'multi', options: ['Maux de tête', 'Fatigue', 'Douleur ventre', 'Nausée', 'Mal de dos', 'Rhume', 'Fièvre', 'Allergie'], other: true },
        { id: 'intensity', label: 'Intensité', type: 'scale', low: 'légère', high: 'forte' }, note] },
      { id: 'appointment', label: 'Rendez-vous', title: (d) => `RDV · ${first(d, 'practitioner', 'santé')}`, fields: [date, { ...time, optional: false },
        { id: 'practitioner', label: 'Professionnel', type: 'chips', options: ['Généraliste', 'Gynécologue', 'Dentiste', 'Dermatologue', 'Ophtalmologue', 'Kiné', 'Psychologue'], other: true }, note] },
    ],
  },
  {
    id: 'sport', name: 'Mon sport', symbol: '✦', description: 'Tennis, Pilates, Yoga et journal de séances',
    kinds: [
      { id: 'session', label: 'Séance', title: (d) => `${first(d, 'discipline', 'Séance')} · ${first(d, 'duration', '?')} min`, fields: [date, time, discipline, minutes(),
        { id: 'intensity', label: 'Intensité', type: 'scale', low: 'douce', high: 'intense' },
        { id: 'technique', label: 'Travaillé', type: 'multi', options: ['Cardio', 'Gainage', 'Abdos', 'Bras', 'Jambes', 'Fessiers', 'Souplesse', 'Équilibre', 'Technique', 'Respiration'] },
        { id: 'feeling', label: 'Ressenti', type: 'chips', options: ['En forme', 'Bien', 'Fatiguée', 'Courbatures'] }, note] },
      { id: 'technique_note', label: 'Observation technique', title: (d) => `${first(d, 'discipline', '')} · ${first(d, 'focus', 'technique')}`, fields: [date, discipline,
        { id: 'focus', label: 'Point observé', type: 'chips', options: ['Service', 'Coup droit', 'Revers', 'Volée', 'Jeu de jambes', 'Posture', 'Respiration', 'Alignement'], other: true },
        { id: 'level', label: 'Où j’en suis', type: 'scale', low: 'débutante', high: 'maîtrisé' },
        { id: 'observation', label: 'Observation (facultatif)', type: 'textarea', optional: true }] },
      { id: 'learning', label: 'Vidéo à revoir', title: (d) => first(d, 'topic', 'Vidéo'), fields: [discipline, { id: 'topic', label: 'Technique / posture', type: 'text' }, { id: 'video', label: 'Lien vers la vidéo', type: 'text', placeholder: 'https://…' }] },
      { id: 'goal', label: 'Objectif', fields: [discipline, { ...date, label: 'Échéance', optional: true }, note] },
    ],
  },
  {
    id: 'challenges', name: 'Mes challenges', symbol: '◇', description: 'Plusieurs programmes et calendriers indépendants',
    kinds: [
      { id: 'challenge', label: 'Challenge personnalisé', fields: [discipline, { id: 'days', label: 'Durée', type: 'chips', options: ['7', '14', '21', '30'] }, { id: 'start', label: 'Date de début', type: 'date' },
        { id: 'plan', label: 'Programme (facultatif)', type: 'textarea', optional: true }] },
    ],
  },
  {
    id: 'equilibre', name: 'Mon équilibre', symbol: '❀', description: 'Booster personnel, émotions et gratitude', sensitive: true,
    kinds: [
      { id: 'emotion', label: 'Journal émotionnel', title: (d) => first(d, 'emotion', 'Émotion'), fields: [date,
        { id: 'emotion', label: 'Émotion', type: 'chips', options: ['Joie', 'Calme', 'Gratitude', 'Anxiété', 'Colère', 'Tristesse', 'Frustration', 'Peur', 'Fierté', 'Fatigue'], other: true },
        { id: 'intensity', label: 'Intensité', type: 'scale', low: 'légère', high: 'très forte' },
        { id: 'trigger', label: 'Déclencheur', type: 'chips', options: ['Travail', 'Famille', 'Couple', 'Amis', 'Argent', 'Santé', 'Fatigue', 'Réseaux sociaux'], other: true },
        { id: 'reflection', label: 'Ce qui m’a aidée', type: 'multi', options: ['Respirer', 'Marcher', 'En parler', 'Écrire', 'Prier', 'Dormir', 'Musique', 'Sport'] }, note] },
      { id: 'gratitude', label: 'Gratitude', title: () => 'Gratitude', fields: [date, { id: 'positive', label: 'Trois choses positives (une par ligne)', type: 'textarea' },
        { id: 'domain', label: 'Elles concernent', type: 'multi', options: ['Famille', 'Amis', 'Travail', 'Santé', 'Nature', 'Foi', 'Moi'] }] },
      { id: 'review', label: 'Bilan', title: (d) => `Bilan de la ${first(d, 'period', 'semaine')}`, fields: [date, { id: 'period', label: 'Période', type: 'chips', options: ['semaine', 'mois'] },
        { id: 'score', label: 'Comment s’est-elle passée ?', type: 'scale', low: 'difficile', high: 'excellente' },
        { id: 'positive', label: 'Ce qui m’a fait du bien', type: 'multi', options: ['Sport', 'Repos', 'Proches', 'Travail accompli', 'Nature', 'Lecture', 'Spiritualité', 'Créativité'] },
        { id: 'challenge', label: 'Ce qui a été difficile', type: 'multi', options: ['Fatigue', 'Stress', 'Organisation', 'Relations', 'Argent', 'Santé', 'Motivation'] },
        { id: 'intention', label: 'Ce que j’aimerais essayer (facultatif)', type: 'textarea', optional: true }] },
      { id: 'booster', label: 'Booster personnel', title: (d) => `Booster · ${first(d, 'axis', '')}`, fields: [
        { id: 'axis', label: 'Axe', type: 'chips', options: ['Anxiété', 'Nervosité', 'Impulsivité', 'Patience', 'Confiance en soi', 'Gestion des conflits', 'Lâcher-prise', 'Affirmation de soi'] },
        { id: 'days', label: 'Durée du programme', type: 'chips', options: ['7', '14', '30'] },
        { id: 'goal', label: 'Mon objectif (facultatif)', type: 'textarea', optional: true }] },
    ],
  },
  {
    id: 'spiritualite', name: 'Ma spiritualité', symbol: '☾', description: 'Prières, dhikr et lecture', sensitive: true,
    kinds: [
      { id: 'prayer', label: 'Prière', title: (d) => first(d, 'prayer', 'Prière'), fields: [date, { id: 'prayer', label: 'Prière', type: 'chips', options: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] },
        { id: 'where', label: 'Où', type: 'chips', options: ['Maison', 'Mosquée', 'Travail', 'Ailleurs'] }] },
      { id: 'prayer_schedule', label: 'Horaires vérifiés (saisie manuelle)', title: (d) => `Horaires · ${first(d, 'city', '')}`, fields: [date, { id: 'city', label: 'Ville', type: 'chips', options: ['Dakar', 'Paris', 'Abidjan', 'Casablanca'], other: true },
        { id: 'source', label: 'Source consultée', type: 'chips', options: ['Mosquée locale', 'Application', 'Calendrier imprimé'], other: true },
        ...['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => ({ id: name, label: name, type: 'time' as const }))] },
      { id: 'dhikr', label: 'Dhikr', title: (d) => `${first(d, 'phrase', 'Dhikr')} · ${first(d, 'count', '')}`, fields: [date,
        { id: 'phrase', label: 'Dhikr', type: 'chips', options: ['SubhanAllah', 'Alhamdulillah', 'Allahu akbar', 'Astaghfirullah', 'La ilaha illa Allah'], other: true },
        { id: 'count', label: 'Nombre', type: 'stepper', min: 0, step: 1, presets: [33, 99, 100] }] },
      { id: 'invocation', label: 'Invocation personnelle', fields: [date, { id: 'text', label: 'Texte personnel', type: 'textarea' }] },
      { id: 'reading', label: 'Lecture', title: (d) => `Lecture · ${first(d, 'surah', '')}`, fields: [date, { id: 'surah', label: 'Sourate / passage', type: 'text' },
        { id: 'pages', label: 'Pages', type: 'stepper', min: 0, step: 1, presets: [1, 2, 5, 10] }] },
    ],
  },
  {
    id: 'finances', name: 'Mes finances', symbol: '¤', description: 'Dépenses, revenus, abonnements et épargne', sensitive: true,
    kinds: [
      { id: 'expense', label: 'Dépense', title: (d) => first(d, 'category', 'Dépense'), fields: [date, amount, currency, { id: 'category', label: 'Catégorie', type: 'chips', options: EXPENSE_CATEGORIES, other: true },
        { id: 'payment', label: 'Paiement', type: 'chips', options: ['Espèces', 'Carte', 'Wave', 'Orange Money', 'Virement'] }, note] },
      { id: 'income', label: 'Revenu', title: (d) => first(d, 'category', 'Revenu'), fields: [date, amount, currency, { id: 'category', label: 'Catégorie', type: 'chips', options: INCOME_CATEGORIES, other: true }, note] },
      { id: 'subscription', label: 'Abonnement', fields: [amount, currency, { id: 'frequency', label: 'Fréquence', type: 'chips', options: ['Mensuelle', 'Trimestrielle', 'Annuelle'] },
        { id: 'nextDate', label: 'Prochaine échéance', type: 'date' }, { id: 'category', label: 'Type', type: 'chips', options: ['Téléphone', 'Internet', 'Streaming', 'Sport', 'Logiciel', 'Presse', 'Autre'] }] },
      { id: 'goal', label: 'Objectif d’épargne', fields: [{ ...amount, label: 'Montant visé', presets: [100000, 250000, 500000, 1000000] }, currency,
        { id: 'saved', label: 'Déjà épargné', type: 'stepper', min: 0, step: 5000, presets: [0, 50000, 100000] }, { id: 'deadline', label: 'Échéance', type: 'date', optional: true }] },
      { id: 'budget', label: 'Budget mensuel', title: (d) => `Budget · ${first(d, 'category', 'global')}`, fields: [{ ...amount, presets: [100000, 300000, 500000, 850000] }, currency,
        { id: 'category', label: 'Catégorie', type: 'chips', options: ['Global', ...EXPENSE_CATEGORIES], other: true }] },
    ],
  },
  {
    id: 'cuisine', name: 'Ma cuisine', symbol: '◈', description: 'Recettes, batch cooking et courses',
    kinds: [
      { id: 'recipe', label: 'Recette', fields: [{ id: 'portions', label: 'Portions', type: 'stepper', min: 1, max: 20, step: 1, presets: [1, 2, 4, 6] }, minutes('Temps total'),
        { id: 'type', label: 'Type', type: 'chips', options: ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Casse-croûte', 'Dessert', 'Boisson'] },
        { id: 'origin', label: 'Origine', type: 'chips', options: ['Sénégalaise', 'Africaine', 'Méditerranéenne', 'Asiatique', 'Française', 'Autre'] },
        { id: 'level', label: 'Difficulté', type: 'chips', options: ['Facile', 'Moyen', 'Difficile'] },
        { id: 'ingredients', label: 'Ingrédients (un par ligne)', type: 'textarea' }, { id: 'steps', label: 'Étapes', type: 'textarea' },
        { id: 'storage', label: 'Conservation', type: 'chips', options: ['2 jours au frais', '3-4 jours au frais', 'Se congèle', 'À consommer tout de suite'] }] },
      { id: 'meal', label: 'Repas planifié', title: (d) => `${first(d, 'slot', 'Repas')} · ${first(d, 'recipe', '')}`, fields: [date, { id: 'slot', label: 'Repas', type: 'chips', options: ['Petit-déjeuner', 'Déjeuner', 'Dîner'] },
        { id: 'recipe', label: 'Recette choisie', type: 'select', options: [], other: true }] },
      { id: 'video', label: 'Vidéo astuce', fields: [{ id: 'url', label: 'Lien de la vidéo', type: 'text', placeholder: 'https://…' },
        { id: 'theme', label: 'Thème', type: 'chips', options: ['Couteau', 'Cuissons', 'Sauces', 'Pâtisserie', 'Organisation', 'Recette'] }, note] },
    ],
  },
  {
    id: 'decouvertes', name: 'Mes découvertes', symbol: '✧', description: 'Destinations, voyages et préparation',
    kinds: [
      { id: 'destination', label: 'Destination', fields: [{ id: 'country', label: 'Pays', type: 'select', options: COUNTRY_SUGGESTIONS, other: true },
        { id: 'style', label: 'Envie', type: 'multi', options: ['Mer et soleil', 'Nature', 'Culture', 'Ville', 'Gastronomie', 'Aventure', 'Spirituel', 'Détente'] },
        { id: 'season', label: 'Période idéale (à vérifier)', type: 'chips', options: ['Hiver', 'Printemps', 'Été', 'Automne', 'Toute l’année'] },
        { id: 'with', label: 'Avec', type: 'chips', options: ['Seule', 'En couple', 'Entre amies', 'En famille'] }] },
      { id: 'trip', label: 'Voyage', fields: [{ ...date, label: 'Départ' }, { id: 'endDate', label: 'Retour', type: 'date' }, { ...amount, label: 'Budget', presets: [250000, 500000, 1000000, 2000000] }, currency,
        { id: 'itinerary', label: 'Itinéraire (facultatif)', type: 'textarea', optional: true }, { id: 'packing', label: 'Valise (un élément par ligne)', type: 'textarea', optional: true }] },
    ],
  },
  {
    id: 'passions', name: 'Mes passions', symbol: '✎', description: 'Parcours d’apprentissage, pratique et séries',
    kinds: [
      { id: 'path', label: 'Parcours guidé', hidden: true, fields: [] },
      { id: 'hobby', label: 'Hobby libre', fields: [{ id: 'duration', label: 'Parcours', type: 'chips', options: ['6 mois', '12 mois'] }, { id: 'goal', label: 'Objectif (facultatif)', type: 'textarea', optional: true }] },
      { id: 'practice', label: 'Séance de pratique', title: (d) => `${first(d, 'hobby', 'Pratique')} · ${first(d, 'duration', '?')} min`, fields: [date,
        { id: 'hobby', label: 'Pour', type: 'select', options: ['Langue', 'Peinture', 'Écriture', 'Musique', 'Photo', 'Couture', 'Céramique'], other: true }, minutes(),
        { id: 'mood', label: 'Plaisir', type: 'scale', low: 'bof', high: 'adoré' }, note] },
      { id: 'series', label: 'Série', fields: [{ id: 'platform', label: 'Plateforme', type: 'chips', options: SERIES_PLATFORMS },
        { id: 'genre', label: 'Genre', type: 'multi', options: SERIES_GENRES },
        { id: 'status', label: 'Statut', type: 'chips', options: ['À voir', 'En cours', 'En pause', 'Terminée', 'Abandonnée'] },
        { id: 'seasons', label: 'Nombre de saisons', type: 'stepper', min: 1, max: 30, step: 1, presets: [1, 2, 3, 5] },
        { id: 'episodes', label: 'Épisodes par saison', type: 'stepper', min: 1, max: 100, step: 1, presets: [6, 8, 10, 13, 22] }] },
    ],
  },
  {
    id: 'listes', name: 'Mes listes', symbol: '☷', description: 'Courses, valise, lectures et souhaits',
    kinds: [
      { id: 'list', label: 'Liste', fields: [{ id: 'category', label: 'Type', type: 'chips', options: ['Courses', 'Valise', 'Shopping', 'Lecture', 'Films', 'Cadeaux', 'Souhaits', 'Autre'] },
        { id: 'itemsText', label: 'Éléments (un par ligne)', type: 'textarea' }] },
    ],
  },
];

export const moduleById = (id: ModuleId) => modules.find((m) => m.id === id)!;
