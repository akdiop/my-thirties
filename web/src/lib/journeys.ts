/** Parcours progressifs : on commence par un tout petit geste, et une étape s'ajoute chaque semaine. */
export const JOURNEY_KIND = 'parcours_progressif';

export type Journey = { id: string; title: string; why: string; steps: { text: string; tip: string }[] };

export const JOURNEYS: Journey[] = [
  { id: 'matin', title: 'Un matin plein d’énergie', why: 'Commencer la journée par toi, avant le téléphone.', steps: [
    { text: 'Boire un grand verre d’eau au réveil', tip: 'Pose le verre sur ta table de nuit la veille.' },
    { text: 'Ouvrir les rideaux et prendre la lumière', tip: 'Deux minutes à la fenêtre ou dehors.' },
    { text: 'Faire son lit', tip: 'Une première victoire en 1 minute.' },
    { text: '5 minutes d’étirements', tip: 'Cou, épaules, dos, hanches.' },
    { text: 'Un petit-déjeuner nourrissant', tip: 'Protéines + fruit.' },
    { text: 'Écrire mon intention du jour', tip: 'Dans « Mon jour », une seule phrase.' },
  ] },
  { id: 'soir', title: 'Un soir apaisé', why: 'Préparer un sommeil profond et un lendemain serein.', steps: [
    { text: 'Ranger le téléphone 30 minutes avant de dormir', tip: 'Recharge-le hors de la chambre.' },
    { text: 'Préparer mes affaires de demain', tip: 'Tenue, sac, repas.' },
    { text: 'Ma routine soin du soir', tip: 'Démaquillage, soin, cheveux.' },
    { text: 'Écrire ma victoire du jour', tip: 'Dans le débriefing du soir.' },
    { text: 'Lire quelques pages', tip: 'Un livre papier, pas un écran.' },
    { text: 'Respiration 4-7-8 au lit', tip: 'Dans Sommeil ou Méditer.' },
  ] },
  { id: 'focus', title: 'Des journées concentrées', why: 'Faire l’essentiel sans t’éparpiller.', steps: [
    { text: 'Choisir mes 3 priorités du jour', tip: 'Sur l’accueil, avant d’ouvrir tes mails.' },
    { text: 'Une séance Focus de 25 minutes', tip: 'Dans Focus, sans quitter l’app.' },
    { text: 'Notifications coupées pendant le travail', tip: 'Mode Concentration de l’iPhone.' },
    { text: 'Une vraie pause déjeuner sans écran', tip: 'Même 20 minutes.' },
    { text: 'Deux séances Focus', tip: 'Une le matin, une l’après-midi.' },
    { text: 'Fermer ma journée : noter la tâche de demain', tip: 'Ton cerveau peut lâcher prise.' },
  ] },
  { id: 'corps', title: 'Prendre soin de mon corps', why: 'Plus d’énergie, jour après jour.', steps: [
    { text: 'Boire 1,5 L d’eau', tip: 'Une gourde toujours à portée de main.' },
    { text: 'Marcher 20 minutes', tip: 'En appelant quelqu’un, ça passe vite.' },
    { text: 'Des légumes à chaque repas', tip: 'La moitié de l’assiette.' },
    { text: 'Me coucher avant minuit', tip: 'Programme un rappel à 23 h.' },
    { text: 'Une séance de sport', tip: 'Pilates, padel, workout…' },
    { text: 'Moins de sucre ajouté', tip: 'Pas de soda en semaine.' },
  ] },
];

/** Semaine en cours du parcours (1 la première semaine), et nombre d'étapes débloquées. */
export function journeyWeek(start: string, today: string) {
  const days = Math.floor((new Date(today + 'T12:00:00').getTime() - new Date(start + 'T12:00:00').getTime()) / 86400000);
  return Math.max(1, Math.floor(days / 7) + 1);
}
