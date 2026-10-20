export type Exercise = { name: string; how: string; tip: string; unit: 'reps' | 'sec' };
export type ExerciseGroup = 'Abdos' | 'Bras' | 'Jambes & fessiers' | 'Gainage';

/** Exercices au poids du corps (ou avec des bouteilles d'eau), décrits simplement. */
export const EXERCISES: Record<ExerciseGroup, Exercise[]> = {
  Abdos: [
    { name: 'Crunch', how: 'Sur le dos, genoux pliés, mains près des tempes : enroule le haut du dos en décollant les omoplates, puis redescends lentement.', tip: 'Ne tire pas sur la nuque, regarde le plafond.', unit: 'reps' },
    { name: 'Pédalage croisé', how: 'Sur le dos, jambes en l’air : amène un coude vers le genou opposé en tendant l’autre jambe, puis alterne.', tip: 'Garde le bas du dos au sol, va lentement.', unit: 'reps' },
    { name: 'Relevé de jambes', how: 'Allongée, mains sous les fessiers : monte les jambes tendues (ou genoux pliés) à la verticale, puis redescends sans toucher le sol.', tip: 'Plie les genoux si le dos se cambre.', unit: 'reps' },
    { name: 'Dead bug', how: 'Sur le dos, bras vers le plafond, genoux à 90° : tends un bras et la jambe opposée vers le sol, reviens, alterne.', tip: 'Le bas du dos reste collé au tapis.', unit: 'reps' },
    { name: 'Toucher de talons', how: 'Sur le dos, genoux pliés, épaules légèrement décollées : touche un talon puis l’autre avec la main du même côté.', tip: 'Petits mouvements contrôlés.', unit: 'reps' },
    { name: 'Russian twist', how: 'Assise, pieds au sol, buste légèrement incliné en arrière : tourne le buste d’un côté puis de l’autre.', tip: 'Pieds au sol pour commencer, dos long.', unit: 'reps' },
    { name: 'Mountain climbers', how: 'En position de planche mains au sol : ramène un genou vers la poitrine puis l’autre, en rythme.', tip: 'Bassin aligné, commence lentement.', unit: 'sec' },
    { name: 'Ciseaux', how: 'Sur le dos, jambes tendues légèrement décollées : croise et décroise les jambes.', tip: 'Monte les jambes plus haut si le dos se creuse.', unit: 'sec' },
  ],
  Bras: [
    { name: 'Pompes sur les genoux', how: 'Mains un peu plus larges que les épaules, genoux au sol : descends la poitrine vers le sol puis pousse.', tip: 'Le corps reste droit des genoux à la tête.', unit: 'reps' },
    { name: 'Pompes inclinées', how: 'Mains sur un banc, une table ou un mur, corps droit : fléchis les bras puis pousse.', tip: 'Plus le support est haut, plus c’est facile.', unit: 'reps' },
    { name: 'Dips sur chaise', how: 'Dos à une chaise stable, mains sur le bord : plie les coudes vers l’arrière pour descendre, puis remonte.', tip: 'Épaules basses, coudes vers l’arrière.', unit: 'reps' },
    { name: 'Curl biceps', how: 'Debout, une bouteille d’eau ou un haltère léger dans chaque main : plie les coudes pour monter les mains vers les épaules.', tip: 'Coudes collés au corps, sans élan.', unit: 'reps' },
    { name: 'Élévations latérales', how: 'Debout, poids légers en main : monte les bras sur les côtés jusqu’à hauteur des épaules, puis redescends lentement.', tip: 'Coudes légèrement fléchis, pas au-dessus des épaules.', unit: 'reps' },
    { name: 'Extension triceps', how: 'Un poids tenu à deux mains derrière la tête : tends les bras vers le plafond puis replie.', tip: 'Les coudes pointent vers l’avant.', unit: 'reps' },
    { name: 'Rowing', how: 'Penchée en avant, dos droit, un poids dans chaque main : tire les coudes vers l’arrière.', tip: 'Serre les omoplates en haut du mouvement.', unit: 'reps' },
    { name: 'Développé épaules', how: 'Assise ou debout, poids à hauteur des épaules : pousse vers le plafond puis redescends.', tip: 'Ne cambre pas le dos.', unit: 'reps' },
  ],
  'Jambes & fessiers': [
    { name: 'Squat', how: 'Pieds largeur des hanches : descends comme pour t’asseoir, poids sur les talons, puis remonte.', tip: 'Genoux dans l’axe des pieds, dos droit.', unit: 'reps' },
    { name: 'Squat sumo', how: 'Pieds plus larges que les hanches, pointes vers l’extérieur : descends en gardant le buste droit.', tip: 'Les genoux suivent la direction des orteils.', unit: 'reps' },
    { name: 'Fentes arrière', how: 'Recule une jambe et descends jusqu’à ce que les deux genoux forment un angle droit, puis reviens. Alterne.', tip: 'Le genou avant ne dépasse pas trop les orteils.', unit: 'reps' },
    { name: 'Pont fessier', how: 'Sur le dos, pieds au sol : monte le bassin en serrant les fessiers, puis redescends.', tip: 'Pousse dans les talons.', unit: 'reps' },
    { name: 'Donkey kicks', how: 'À quatre pattes : monte une jambe pliée vers le plafond, pied à plat, puis redescends.', tip: 'Le dos ne se cambre pas.', unit: 'reps' },
    { name: 'Fire hydrant', how: 'À quatre pattes : écarte un genou plié sur le côté, puis reviens.', tip: 'Bassin stable, mouvement lent.', unit: 'reps' },
    { name: 'Chaise contre le mur', how: 'Dos au mur, descends jusqu’à avoir les genoux à environ 90° et tiens la position.', tip: 'Remonte un peu si les genoux tirent.', unit: 'sec' },
    { name: 'Montées sur pointes', how: 'Debout, monte sur la pointe des pieds puis redescends lentement.', tip: 'Tiens-toi à un mur pour l’équilibre.', unit: 'reps' },
  ],
  Gainage: [
    { name: 'Planche sur avant-bras', how: 'Coudes sous les épaules, corps droit de la tête aux talons : tiens la position.', tip: 'Genoux au sol pour commencer.', unit: 'sec' },
    { name: 'Planche latérale', how: 'Sur un avant-bras, pieds ou genoux empilés : monte le bassin et tiens.', tip: 'Le corps forme une ligne droite.', unit: 'sec' },
    { name: 'Planche toucher d’épaules', how: 'En planche mains au sol : touche une épaule avec la main opposée, alterne.', tip: 'Écarte les pieds pour plus de stabilité.', unit: 'reps' },
    { name: 'Superman', how: 'À plat ventre : décolle légèrement bras et jambes, tiens 2 secondes, relâche.', tip: 'Regarde le sol, nuque longue.', unit: 'reps' },
  ],
};

export const GROUPS = Object.keys(EXERCISES) as ExerciseGroup[];

/** Circuit du jour : 3 exercices du groupe qui tournent chaque jour, volume progressif et plafonné. */
export function circuit(group: ExerciseGroup, activeDay: number, base: { reps: number; sec: number }, cap: { reps: number; sec: number }) {
  const list = EXERCISES[group];
  const step = Math.floor(activeDay / 3);
  return [0, 1, 2].map((i) => {
    const ex = list[(activeDay + i * 3) % list.length]!;
    const amount = ex.unit === 'reps' ? Math.min(cap.reps, base.reps + 2 * step) : Math.min(cap.sec, base.sec + 5 * step);
    return `${ex.name} ${amount}${ex.unit === 'reps' ? '' : ' s'}`;
  });
}
