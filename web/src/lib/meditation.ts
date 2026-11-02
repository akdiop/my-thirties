/** Respirations et méditations guidées : des consignes courtes, minutées, sans contenu audio. */
export type Phase = { label: string; secs: number; grow: boolean };
export type Breath = { id: string; name: string; goal: string; why: string; cycles: number; phases: Phase[] };

const ph = (label: string, secs: number, grow: boolean): Phase => ({ label, secs, grow });

export const BREATHS: Breath[] = [
  { id: 'apaisante', name: 'Respiration apaisante', goal: 'Stress', why: 'Une expiration plus longue que l’inspiration calme le corps.', cycles: 6, phases: [ph('Inspire', 4, true), ph('Expire', 6, false)] },
  { id: 'carree', name: 'Respiration carrée', goal: 'Concentration', why: 'Quatre temps égaux pour stabiliser l’attention.', cycles: 6, phases: [ph('Inspire', 4, true), ph('Retiens', 4, true), ph('Expire', 4, false), ph('Retiens', 4, false)] },
  { id: '478', name: 'Respiration 4-7-8', goal: 'Sommeil', why: 'Un rythme lent qui prépare au sommeil. Arrête si la rétention te gêne.', cycles: 4, phases: [ph('Inspire par le nez', 4, true), ph('Retiens', 7, true), ph('Expire par la bouche', 8, false)] },
  { id: 'soupir', name: 'Double soupir', goal: 'Colère', why: 'Deux inspirations, puis une longue expiration : relâche la pression vite.', cycles: 5, phases: [ph('Inspire', 2, true), ph('Inspire encore un peu', 1, true), ph('Longue expiration', 6, false)] },
  { id: 'coherence', name: 'Cohérence 5-5', goal: 'Équilibre', why: 'Six respirations par minute pendant quelques minutes.', cycles: 18, phases: [ph('Inspire', 5, true), ph('Expire', 5, false)] },
];

export type Guided = { id: string; name: string; goal: string; minutes: number; steps: string[] };

/** Séances guidées par étapes (une consigne toutes les 30 secondes environ). */
export const GUIDED: Guided[] = [
  { id: 'scan', name: 'Scan du corps', goal: 'Sommeil', minutes: 5, steps: ['Allonge-toi, ferme les yeux.', 'Sens le poids de ta tête sur l’oreiller.', 'Relâche le front, les yeux, la mâchoire.', 'Laisse tomber les épaules.', 'Sens tes bras devenir lourds.', 'Détends le ventre à chaque expiration.', 'Relâche les hanches et les cuisses.', 'Sens tes jambes, tes pieds, tes orteils.', 'Tout ton corps est lourd et chaud.', 'Laisse venir le sommeil, sans le chercher.'] },
  { id: 'ancrage', name: 'Ancrage 5-4-3-2-1', goal: 'Angoisse', minutes: 3, steps: ['Regarde autour de toi : nomme 5 choses que tu vois.', 'Touche 4 choses : leur texture, leur température.', 'Écoute : 3 sons, proches ou lointains.', 'Sens 2 odeurs autour de toi.', 'Remarque 1 goût dans ta bouche.', 'Pose les pieds au sol. Tu es ici, maintenant.'] },
  { id: 'pleine', name: 'Pleine conscience de 3 minutes', goal: 'Concentration', minutes: 3, steps: ['Assieds-toi le dos droit, sans raideur.', 'Remarque ce qui est là : pensées, émotions, sensations.', 'Ramène ton attention sur la respiration.', 'Quand une pensée arrive, nomme-la « pensée » et reviens au souffle.', 'Élargis l’attention à tout le corps.', 'Ouvre les yeux doucement.'] },
  { id: 'gratitude', name: 'Gratitude', goal: 'Joie', minutes: 4, steps: ['Ferme les yeux et respire calmement.', 'Pense à une personne qui compte pour toi.', 'Pense à un moment simple de cette semaine qui t’a fait du bien.', 'Pense à quelque chose que ton corps te permet de faire.', 'Pense à une chose que tu as aujourd’hui et que tu espérais avant.', 'Garde ce sentiment de gratitude quelques respirations.'] },
  { id: 'colere', name: 'Laisser passer la colère', goal: 'Colère', minutes: 4, steps: ['Remarque où la colère se loge : mâchoire, poitrine, mains.', 'Nomme-la sans la juger : « je suis en colère ».', 'Desserre les mains, laisse retomber les épaules.', 'Expire longuement, trois fois.', 'Demande-toi : de quoi ai-je besoin, vraiment ?', 'Attends d’être plus calme avant de répondre ou d’agir.'] },
  { id: 'reset', name: 'Reset énergie express', goal: 'Énergie', minutes: 5, steps: ['Ouvre une fenêtre : laisse entrer l’air et la lumière.', 'Respiration carrée : inspire 4, retiens 4, expire 4, retiens 4. Quatre fois.', 'Debout, secoue doucement les mains, les bras, les épaules, puis les jambes.', 'Pose les pieds bien à plat et sens le sol sous toi.', 'Range une seule petite chose autour de toi.', 'Formule ton intention : « Je laisse partir ce qui pèse, j’accueille le calme. »'] },
  { id: 'bulle', name: 'Bulle de protection', goal: 'Avant une situation difficile', minutes: 3, steps: ['Ferme les yeux et respire lentement.', 'Imagine une lumière douce au niveau de ton ventre.', 'À chaque inspiration, elle devient plus claire.', 'À chaque expiration, elle s’étend autour de toi comme une bulle.', 'Dis-toi : « Je reste moi-même, je n’absorbe pas le stress des autres. »', 'Ouvre les yeux en gardant cette sensation.'] },
  { id: 'lien', name: 'Couper un lien qui pèse', goal: 'Lâcher-prise', minutes: 4, steps: ['Assieds-toi et respire calmement.', 'Pense à une situation ou une relation qui te vide.', 'Visualise un fil entre toi et elle.', 'Remercie pour ce que cette expérience t’a appris.', 'Imagine que tu coupes le fil, doucement et sans colère.', 'Sens l’espace libéré, et respire dedans.'] },
  { id: 'rain', name: 'RAIN pour une émotion difficile', goal: 'Émotions', minutes: 5, steps: ['R · Reconnaître : nomme ce que tu ressens (« c’est de la tristesse »).', 'A · Accepter : laisse l’émotion être là, sans la chasser.', 'I · Investiguer : où est-elle dans ton corps ? De quoi a-t-elle besoin ?', 'N · Nourrir : pose une main sur ton cœur et dis-toi ce que tu dirais à une amie.', 'Respire quelques instants avec cette douceur.', 'Note dans ton journal ce que tu as découvert.'] },
];

export type SosKey = 'angoisse' | 'colere' | 'insomnie';
export const SOS: Record<SosKey, { title: string; intro: string; breath: string; guided: string }> = {
  angoisse: { title: 'Angoisse', intro: 'Tu es en sécurité. On ralentit ensemble, puis on revient au présent.', breath: 'apaisante', guided: 'ancrage' },
  colere: { title: 'Colère', intro: 'La colère est une énergie. On la laisse redescendre avant d’agir.', breath: 'soupir', guided: 'colere' },
  insomnie: { title: 'Insomnie', intro: 'Pas besoin de forcer le sommeil. On détend le corps, le reste suit.', breath: '478', guided: 'scan' },
};

/** « Les bases » : 10 jours pour installer une pratique, quelques minutes par jour. */
export const BASICS: { day: number; title: string; minutes: number; text: string; breath?: string; guided?: string }[] = [
  { day: 1, title: 'Juste respirer', minutes: 3, text: 'Assieds-toi et observe ta respiration, sans la changer.', breath: 'apaisante' },
  { day: 2, title: 'Revenir au souffle', minutes: 3, text: 'Ton esprit va partir : c’est normal. L’exercice, c’est de revenir.', guided: 'pleine' },
  { day: 3, title: 'Le corps', minutes: 5, text: 'Parcours ton corps de la tête aux pieds.', guided: 'scan' },
  { day: 4, title: 'Compter les respirations', minutes: 4, text: 'Compte de 1 à 10 à chaque expiration, puis recommence.', breath: 'coherence' },
  { day: 5, title: 'Les sons', minutes: 3, text: 'Écoute les sons autour de toi sans les juger.', guided: 'ancrage' },
  { day: 6, title: 'Les pensées', minutes: 4, text: 'Regarde tes pensées passer comme des nuages.', guided: 'pleine' },
  { day: 7, title: 'Les émotions', minutes: 4, text: 'Nomme l’émotion présente et observe où elle se loge.', guided: 'colere' },
  { day: 8, title: 'La gratitude', minutes: 4, text: 'Termine la séance sur trois choses positives.', guided: 'gratitude' },
  { day: 9, title: 'Le calme intérieur', minutes: 5, text: 'Allonge l’expiration pour descendre plus profond.', breath: '478' },
  { day: 10, title: 'Ta pratique', minutes: 6, text: 'Choisis l’exercice que tu préfères et fais-le à ton rythme.', breath: 'coherence' },
];

export const MEDITATION_KIND = 'meditation';
