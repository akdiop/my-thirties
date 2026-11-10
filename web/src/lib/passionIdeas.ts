/** 100 passions à explorer, en 10 familles, et 10 habitudes « That girl » (d'après le visuel envoyé par Aïda). */
export type PassionFamily = { name: string; items: string[] };

export const PASSION_IDEAS: PassionFamily[] = [
  { name: 'Créatif', items: ['Tenir un journal', 'Scrapbooking', 'Bullet journal', 'Peinture à l’aquarelle', 'Peinture acrylique', 'Dessin', 'Calligraphie', 'Illustration digitale', 'Coloriage', 'Origami'] },
  { name: 'Contenu et médias', items: ['Photographie', 'Réalisation de vidéos', 'Vlogging', 'Blogging', 'Contenu Pinterest', 'Contenu Instagram', 'Podcast', 'Graphisme', 'Design avec Canva', 'Montage vidéo'] },
  { name: 'Apprentissage', items: ['Lire des romans', 'Lire des livres de développement personnel', 'Apprendre une nouvelle langue', 'Apprendre la calligraphie', 'Suivre des cours en ligne', 'Prendre la parole en public', 'Écrire de la poésie', 'Écriture créative', 'Prendre des notes efficaces', 'Lecture rapide'] },
  { name: 'Bien-être', items: ['Yoga', 'Pilates', 'Méditation', 'Respiration', 'Étirements', 'Routine skincare', 'Randonnée', 'Entraînements à la maison', 'Course à pied', 'Natation'] },
  { name: 'Forme physique', items: ['Musculation', 'Badminton', 'Handball', 'Tennis', 'Pickleball', 'Vélo', 'Corde à sauter', 'Escalade', 'Arts martiaux', 'Zumba'] },
  { name: 'Maison et lifestyle', items: ['Pâtisserie', 'Cuisine', 'Décoration de gâteaux', 'Café et latte art', 'Dégustation de thé', 'Jardinage', 'Plantes d’intérieur', 'Organisation', 'Décoration DIY', 'Fabrication de bougies'] },
  { name: 'Fait main', items: ['Crochet', 'Tricot', 'Broderie', 'Couture', 'Création de bijoux', 'Poterie', 'Argile', 'Résine', 'Fabrication de savon', 'Composition florale'] },
  { name: 'Beauté et mode', items: ['Maquillage', 'Nail art', 'Coiffure', 'Recherche de style', 'Parfums', 'Conseils mode', 'Tri de garde-robe', 'Création de tenues', 'Soins de soi', 'Création d’accessoires'] },
  { name: 'Musique', items: ['Chant', 'Piano', 'Guitare', 'Violon', 'Ukulélé', 'Production musicale', 'Composition', 'Danse', 'Écouter des vinyles', 'Apprendre le solfège'] },
  { name: 'Compétences digitales', items: ['Programmation', 'Design UI/UX', 'Animation', 'Modélisation 3D', 'Retouche photo', 'Investir et gérer ses finances', 'Création de sites web', 'Bénévolat', 'Rédaction de contenus', 'Planification de voyages'] },
];

export const THAT_GIRL = ['Lire 20 minutes par jour', 'Écrire dans mon journal', 'Bouger mon corps', 'Pratiquer le yoga', 'Apprendre quelque chose de nouveau',
  'Manger sainement et me faire plaisir', 'Prendre des photos', 'Prendre soin de mes plantes', 'Avancer sur mes projets', 'Épargner et investir'];
