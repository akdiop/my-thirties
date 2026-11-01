/** Parcours workout au poids du corps, étape par étape : 4 niveaux, 3 séances par niveau. */
export type WorkoutStep = {
  id: string; niveau: number; titre: string; minutes: number; focus: string;
  echauffement: string[]; circuit: { nom: string; dose: string; conseil: string }[];
  tours: number; recup: string; retourCalme: string[];
};

const WARMUP = ['1 min de marche sur place en balançant les bras', '10 cercles d’épaules vers l’arrière', '10 rotations du bassin', '10 squats lents, sans charge'];
const COOLDOWN = ['Étirement des cuisses : 30 s par jambe', 'Posture de l’enfant : 45 s', 'Étirement des épaules, bras croisé : 30 s par bras', '5 respirations lentes'];

const S = (s: WorkoutStep) => s;

export const WORKOUT_PATH: WorkoutStep[] = [
  S({ id: 'w1-1', niveau: 1, titre: 'Découverte · Bas du corps', minutes: 20, focus: 'Apprendre les gestes de base', echauffement: WARMUP, tours: 2, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Squat', dose: '10 répétitions', conseil: 'Pieds largeur de hanches, fesses vers l’arrière comme pour t’asseoir, poids dans les talons.' },
    { nom: 'Pont fessier', dose: '12 répétitions', conseil: 'Sur le dos, pieds au sol, monte le bassin en serrant les fessiers, sans creuser le dos.' },
    { nom: 'Fente arrière', dose: '6 par jambe', conseil: 'Recule une jambe, les deux genoux à 90°. Tiens-toi à une chaise si besoin.' },
    { nom: 'Montées sur pointes', dose: '15 répétitions', conseil: 'Monte lentement sur la pointe des pieds, redescends en contrôle.' },
  ] }),
  S({ id: 'w1-2', niveau: 1, titre: 'Découverte · Haut du corps', minutes: 20, focus: 'Bras, épaules, dos', echauffement: WARMUP, tours: 2, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Pompes contre un mur', dose: '10 répétitions', conseil: 'Corps gainé de la tête aux talons, coudes à 45° du corps.' },
    { nom: 'Superman', dose: '10 répétitions', conseil: 'À plat ventre, décolle bras et jambes doucement, regard vers le sol.' },
    { nom: 'Dips sur une chaise', dose: '8 répétitions', conseil: 'Mains sur le bord d’une chaise stable, plie les coudes vers l’arrière.' },
    { nom: 'Planche sur les genoux', dose: '20 secondes', conseil: 'Avant-bras au sol, genoux au sol, ventre rentré.' },
  ] }),
  S({ id: 'w1-3', niveau: 1, titre: 'Découverte · Corps entier', minutes: 20, focus: 'Enchaîner sans s’essouffler', echauffement: WARMUP, tours: 2, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Squat', dose: '12 répétitions', conseil: 'Garde le dos droit et les genoux dans l’axe des pieds.' },
    { nom: 'Pompes contre un mur', dose: '10 répétitions', conseil: 'Descends lentement, remonte un peu plus vite.' },
    { nom: 'Montées de genoux marchées', dose: '30 secondes', conseil: 'Monte les genoux à hauteur de hanches, bras qui accompagnent.' },
    { nom: 'Dead bug', dose: '6 par côté', conseil: 'Sur le dos, bras et jambes en l’air, allonge un bras et la jambe opposée sans décoller le bas du dos.' },
  ] }),
  S({ id: 'w2-1', niveau: 2, titre: 'Fondations · Fessiers et jambes', minutes: 25, focus: 'Plus de répétitions', echauffement: WARMUP, tours: 3, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Squat', dose: '15 répétitions', conseil: 'Descends jusqu’à ce que les cuisses soient parallèles au sol si c’est confortable.' },
    { nom: 'Pont fessier sur une jambe', dose: '8 par jambe', conseil: 'Une jambe tendue en l’air, le bassin reste bien horizontal.' },
    { nom: 'Fente arrière', dose: '10 par jambe', conseil: 'Le buste reste droit, le genou avant ne rentre pas vers l’intérieur.' },
    { nom: 'Chaise contre le mur', dose: '30 secondes', conseil: 'Dos au mur, genoux à 90°, respire.' },
  ] }),
  S({ id: 'w2-2', niveau: 2, titre: 'Fondations · Haut du corps', minutes: 25, focus: 'Passer au sol', echauffement: WARMUP, tours: 3, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Pompes sur les genoux', dose: '8 répétitions', conseil: 'Mains un peu plus larges que les épaules, la poitrine descend vers le sol.' },
    { nom: 'Superman avec tirage', dose: '10 répétitions', conseil: 'Bras levés, ramène les coudes vers les côtes en serrant les omoplates.' },
    { nom: 'Dips sur une chaise', dose: '10 répétitions', conseil: 'Épaules basses, loin des oreilles.' },
    { nom: 'Planche', dose: '25 secondes', conseil: 'Sur les avant-bras et les pieds ; repasse sur les genoux si le dos se creuse.' },
  ] }),
  S({ id: 'w2-3', niveau: 2, titre: 'Fondations · Cardio doux', minutes: 25, focus: 'Monter un peu le rythme', echauffement: WARMUP, tours: 3, recup: '45 s entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Jumping jacks sans saut', dose: '40 secondes', conseil: 'Écarte une jambe à la fois en levant les bras.' },
    { nom: 'Squat', dose: '15 répétitions', conseil: 'Rythme régulier, respiration fluide.' },
    { nom: 'Mountain climbers lents', dose: '30 secondes', conseil: 'En position de planche, ramène un genou vers la poitrine, puis l’autre.' },
    { nom: 'Relevés de buste', dose: '12 répétitions', conseil: 'Sur le dos, genoux pliés, décolle les épaules sans tirer sur la nuque.' },
  ] }),
  S({ id: 'w3-1', niveau: 3, titre: 'Renforcement · Jambes', minutes: 30, focus: 'Force et équilibre', echauffement: WARMUP, tours: 3, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Squat avec pause en bas', dose: '12 répétitions', conseil: 'Reste 2 secondes en bas avant de remonter.' },
    { nom: 'Fentes marchées', dose: '10 par jambe', conseil: 'Avance en enchaînant les fentes, buste droit.' },
    { nom: 'Pont fessier sur une jambe', dose: '12 par jambe', conseil: 'Tiens 1 seconde en haut.' },
    { nom: 'Montées sur une marche', dose: '10 par jambe', conseil: 'Sur une marche stable, pousse sur le talon de la jambe du haut.' },
  ] }),
  S({ id: 'w3-2', niveau: 3, titre: 'Renforcement · Haut du corps et gainage', minutes: 30, focus: 'Tenir plus longtemps', echauffement: WARMUP, tours: 3, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Pompes (sur les genoux ou les pieds)', dose: '10 répétitions', conseil: 'Choisis la version qui te permet de garder le dos droit.' },
    { nom: 'Planche', dose: '40 secondes', conseil: 'Pousse le sol avec les avant-bras, regard entre les mains.' },
    { nom: 'Planche latérale', dose: '20 s par côté', conseil: 'Sur l’avant-bras, bassin haut ; genou au sol pour simplifier.' },
    { nom: 'Dips sur une chaise', dose: '12 répétitions', conseil: 'Jambes plus tendues pour corser.' },
  ] }),
  S({ id: 'w3-3', niveau: 3, titre: 'Renforcement · Circuit complet', minutes: 30, focus: 'Corps entier', echauffement: WARMUP, tours: 4, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Squat', dose: '20 répétitions', conseil: 'Garde la même qualité jusqu’au bout.' },
    { nom: 'Pompes', dose: '10 répétitions', conseil: 'Sur les genoux si besoin.' },
    { nom: 'Fente arrière', dose: '10 par jambe', conseil: 'Alterne les jambes.' },
    { nom: 'Mountain climbers', dose: '30 secondes', conseil: 'Bassin stable, rythme régulier.' },
  ] }),
  S({ id: 'w4-1', niveau: 4, titre: 'Endurance · HIIT doux', minutes: 30, focus: '30 s d’effort, 30 s de repos', echauffement: WARMUP, tours: 4, recup: '30 s entre chaque exercice, 1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Squat sauté (ou squat rapide)', dose: '30 secondes', conseil: 'Réception douce, genoux souples ; sans saut si tes genoux préfèrent.' },
    { nom: 'Mountain climbers', dose: '30 secondes', conseil: 'Plus rapide qu’au niveau 2, sans lever les fesses.' },
    { nom: 'Jumping jacks', dose: '30 secondes', conseil: 'Version sans saut possible.' },
    { nom: 'Planche', dose: '30 secondes', conseil: 'Respire pendant l’effort.' },
  ] }),
  S({ id: 'w4-2', niveau: 4, titre: 'Endurance · Bas du corps', minutes: 35, focus: 'Volume', echauffement: WARMUP, tours: 4, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Squat', dose: '25 répétitions', conseil: 'Rythme régulier.' },
    { nom: 'Fentes marchées', dose: '12 par jambe', conseil: 'Pas longs et contrôlés.' },
    { nom: 'Chaise contre le mur', dose: '45 secondes', conseil: 'Tiens en respirant calmement.' },
    { nom: 'Pont fessier', dose: '20 répétitions', conseil: 'Serre bien en haut.' },
  ] }),
  S({ id: 'w4-3', niveau: 4, titre: 'Endurance · Défi final', minutes: 35, focus: 'Mesurer ton progrès', echauffement: WARMUP, tours: 4, recup: '1 min entre les tours', retourCalme: COOLDOWN, circuit: [
    { nom: 'Squat', dose: '20 répétitions', conseil: 'Compare avec ta première séance.' },
    { nom: 'Pompes', dose: '12 répétitions', conseil: 'Note la version que tu as réussie.' },
    { nom: 'Planche', dose: '45 secondes', conseil: 'Note ton temps.' },
    { nom: 'Mountain climbers', dose: '40 secondes', conseil: 'Garde le rythme jusqu’au bout.' },
  ] }),
];

export const NIVEAUX = ['', 'Découverte', 'Fondations', 'Renforcement', 'Endurance'];
