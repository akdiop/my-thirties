import type { ModuleId } from './lib/cloud';

export type Field = { id: string; label: string; type: 'text' | 'textarea' | 'number' | 'date' | 'time' | 'select'; options?: string[]; placeholder?: string };
export type Kind = { id: string; label: string; fields: Field[] };
export type Module = { id: ModuleId; name: string; description: string; symbol: string; kinds: Kind[]; sensitive?: boolean };

const note: Field = { id: 'notes', label: 'Notes', type: 'textarea' };
const date: Field = { id: 'date', label: 'Date', type: 'date' };
const amount: Field = { id: 'amount', label: 'Montant', type: 'number' };
const currency: Field = { id: 'currency', label: 'Devise', type: 'select', options: ['XOF', 'EUR', 'USD'] };
const discipline: Field = { id: 'discipline', label: 'Discipline', type: 'select', options: ['Tennis', 'Pilates', 'Yoga', 'Mobilité', 'Autre'] };

export const modules: Module[] = [
  {
    id: 'quotidien', name: 'Mon quotidien', symbol: '◷', description: 'Agenda, tâches et routines',
    kinds: [
      { id: 'task', label: 'Tâche', fields: [date, { id: 'time', label: 'Heure (facultative)', type: 'time' }, { id: 'priority', label: 'Priorité', type: 'select', options: ['Normale', 'Haute', 'Basse'] }, note] },
      { id: 'event', label: 'Événement', fields: [date, { id: 'time', label: 'Heure', type: 'time' }, { id: 'location', label: 'Lieu', type: 'text' }, { id: 'frequency', label: 'Répétition', type: 'select', options: ['Aucune', 'Quotidienne', 'Hebdomadaire'] }, note] },
      { id: 'routine', label: 'Routine', fields: [date, { id: 'time', label: 'Heure', type: 'time' }, { id: 'frequency', label: 'Fréquence', type: 'select', options: ['Quotidienne', 'Hebdomadaire'] }, note] },
    ],
  },
  {
    id: 'sante', name: 'Ma santé', symbol: '♡', description: 'Cycle, symptômes, sommeil et rendez-vous', sensitive: true,
    kinds: [
      { id: 'cycle', label: 'Cycle menstruel', fields: [date, { id: 'endDate', label: 'Fin des règles (facultatif)', type: 'date' }, { id: 'symptoms', label: 'Symptômes', type: 'textarea' }, note] },
      { id: 'sleep', label: 'Sommeil', fields: [date, { id: 'hours', label: 'Durée (heures)', type: 'number' }, { id: 'quality', label: 'Qualité ressentie', type: 'select', options: ['Bonne', 'Moyenne', 'Difficile'] }, note] },
      { id: 'hydration', label: 'Hydratation (sans objectif imposé)', fields: [date, { id: 'glasses', label: 'Verres bus (facultatif)', type: 'number' }, note] },
      { id: 'mood', label: 'Humeur et énergie', fields: [date, { id: 'mood', label: 'Humeur', type: 'select', options: ['Sereine', 'Joyeuse', 'Fatiguée', 'Stressée', 'Autre'] }, { id: 'energy', label: 'Énergie ressentie', type: 'select', options: ['Faible', 'Modérée', 'Bonne'] }, note] },
      { id: 'food', label: 'Journal alimentaire bienveillant', fields: [date, { id: 'meals', label: 'Repas, découvertes et ressentis (facultatif)', type: 'textarea' }] },
      { id: 'symptom', label: 'Symptôme', fields: [date, { id: 'symptoms', label: 'Symptômes', type: 'textarea' }, note] },
      { id: 'appointment', label: 'Rendez-vous', fields: [date, { id: 'time', label: 'Heure', type: 'time' }, { id: 'practitioner', label: 'Professionnel', type: 'text' }, note] },
    ],
  },
  {
    id: 'sport', name: 'Mon sport', symbol: '✦', description: 'Tennis, Pilates, Yoga et journal de séances',
    kinds: [
      { id: 'session', label: 'Séance', fields: [date, discipline, { id: 'duration', label: 'Durée (minutes)', type: 'number' }, { id: 'technique', label: 'Technique travaillée', type: 'text' }, note] },
      { id: 'learning', label: 'Apprentissage', fields: [discipline, { id: 'topic', label: 'Technique / posture', type: 'text' }, { id: 'video', label: 'Lien vers une vidéo pédagogique', type: 'text' }, note] },
    ],
  },
  {
    id: 'challenges', name: 'Mes challenges', symbol: '◇', description: 'Plusieurs programmes et calendriers indépendants',
    kinds: [
      { id: 'challenge', label: 'Challenge', fields: [discipline, { id: 'days', label: 'Durée', type: 'select', options: ['7', '14', '30'] }, { id: 'start', label: 'Date de début', type: 'date' }, { id: 'plan', label: 'Programme / exercices adaptés', type: 'textarea' }] },
    ],
  },
  {
    id: 'equilibre', name: 'Mon équilibre', symbol: '❀', description: 'Booster personnel, émotions et gratitude', sensitive: true,
    kinds: [
      { id: 'emotion', label: 'Journal émotionnel', fields: [date, { id: 'emotion', label: 'Émotion', type: 'text' }, { id: 'trigger', label: 'Déclencheur', type: 'textarea' }, { id: 'reaction', label: 'Réaction', type: 'textarea' }, { id: 'reflection', label: 'Ce qui m’a aidée', type: 'textarea' }] },
      { id: 'gratitude', label: 'Gratitude', fields: [date, { id: 'positive', label: 'Trois choses positives', type: 'textarea' }, { id: 'learning', label: 'Ce que j’ai appris', type: 'textarea' }] },
      { id: 'booster', label: 'Booster personnel', fields: [{ id: 'axis', label: 'Axe', type: 'select', options: ['Anxiété', 'Nervosité', 'Impulsivité', 'Patience', 'Confiance en soi', 'Gestion des conflits', 'Lâcher-prise', 'Affirmation de soi'] }, { id: 'goal', label: 'Objectif du mois', type: 'textarea' }, { id: 'practice', label: 'Exercice facultatif', type: 'textarea' }, { id: 'days', label: 'Durée du programme', type: 'select', options: ['7', '14', '30'] }] },
    ],
  },
  {
    id: 'spiritualite', name: 'Ma spiritualité', symbol: '☾', description: 'Prières, dhikr et lecture', sensitive: true,
    kinds: [
      { id: 'prayer', label: 'Prière', fields: [date, { id: 'prayer', label: 'Prière', type: 'select', options: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] }, note] },
      { id: 'dhikr', label: 'Dhikr', fields: [date, note] },
      { id: 'invocation', label: 'Invocation personnelle', fields: [date, { id: 'text', label: 'Texte personnel', type: 'textarea' }, note] },
      { id: 'reading', label: 'Lecture', fields: [date, { id: 'surah', label: 'Sourate / passage', type: 'text' }, note] },
    ],
  },
  {
    id: 'finances', name: 'Mes finances', symbol: '¤', description: 'Dépenses, revenus, abonnements et épargne', sensitive: true,
    kinds: [
      { id: 'income', label: 'Revenu', fields: [date, amount, currency, { id: 'category', label: 'Catégorie', type: 'text' }, note] },
      { id: 'expense', label: 'Dépense', fields: [date, amount, currency, { id: 'category', label: 'Catégorie', type: 'text' }, note] },
      { id: 'subscription', label: 'Abonnement', fields: [amount, currency, { id: 'frequency', label: 'Fréquence', type: 'select', options: ['Mensuelle', 'Annuelle', 'Autre'] }, { id: 'nextDate', label: 'Prochaine échéance', type: 'date' }, note] },
      { id: 'goal', label: 'Objectif d’épargne', fields: [amount, currency, { id: 'saved', label: 'Déjà épargné', type: 'number' }, { id: 'deadline', label: 'Échéance', type: 'date' }, note] },
      { id: 'budget', label: 'Budget mensuel', fields: [amount, currency, { id: 'category', label: 'Catégorie (facultatif)', type: 'text' }, { id: 'month', label: 'Mois (AAAA-MM)', type: 'text' }, note] },
    ],
  },
  {
    id: 'cuisine', name: 'Ma cuisine', symbol: '◈', description: 'Recettes, batch cooking et courses',
    kinds: [
      { id: 'recipe', label: 'Recette', fields: [{ id: 'portions', label: 'Portions', type: 'number' }, { id: 'duration', label: 'Durée (minutes)', type: 'number' }, { id: 'ingredients', label: 'Ingrédients (un par ligne)', type: 'textarea' }, { id: 'steps', label: 'Étapes détaillées', type: 'textarea' }, { id: 'storage', label: 'Conservation', type: 'textarea' }] },
      { id: 'meal', label: 'Repas planifié', fields: [date, { id: 'recipe', label: 'Recette choisie', type: 'text' }, note] },
    ],
  },
  {
    id: 'decouvertes', name: 'Mes découvertes', symbol: '✧', description: 'Destinations, voyages et préparation',
    kinds: [
      { id: 'destination', label: 'Destination', fields: [{ id: 'country', label: 'Pays', type: 'text' }, { id: 'season', label: 'Période idéale à vérifier', type: 'text' }, note] },
      { id: 'trip', label: 'Voyage', fields: [date, { id: 'endDate', label: 'Retour', type: 'date' }, amount, currency, { id: 'itinerary', label: 'Itinéraire', type: 'textarea' }, { id: 'packing', label: 'Valise (un élément par ligne)', type: 'textarea' }] },
    ],
  },
  {
    id: 'passions', name: 'Mes passions', symbol: '✎', description: 'Apprendre un hobby sur 6 ou 12 mois',
    kinds: [
      { id: 'hobby', label: 'Hobby', fields: [{ id: 'duration', label: 'Parcours', type: 'select', options: ['6 mois', '12 mois'] }, { id: 'goal', label: 'Objectif', type: 'textarea' }, { id: 'next', label: 'Prochaine étape', type: 'textarea' }] },
      { id: 'practice', label: 'Séance de pratique', fields: [date, { id: 'hobby', label: 'Hobby', type: 'text' }, { id: 'duration', label: 'Minutes', type: 'number' }, note] },
    ],
  },
  {
    id: 'listes', name: 'Mes listes', symbol: '☷', description: 'Courses, valise, lectures et souhaits',
    kinds: [
      { id: 'list', label: 'Liste', fields: [{ id: 'category', label: 'Type', type: 'select', options: ['Courses', 'Valise', 'Shopping', 'Lecture', 'Souhaits', 'Autre'] }, { id: 'itemsText', label: 'Éléments (un par ligne)', type: 'textarea' }] },
    ],
  },
];

export const moduleById = (id: ModuleId) => modules.find((m) => m.id === id)!;
