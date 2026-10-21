/** Une destination précise a deux sources encyclopédiques possibles et jamais une plage d'un autre lieu. */
export const ENGLISH_DESTINATIONS: Record<string, string> = {
  "marrakech": "Marrakesh",
  "essaouira": "Essaouira",
  "chefchaouen": "Chefchaouen",
  "saint-louis": "Saint-Louis, Senegal",
  "sine-saloum": "Saloum Delta",
  "casamance": "Casamance",
  "praia": "Praia, Cape Verde",
  "sal": "Sal, Cape Verde",
  "lisbonne": "Lisbon",
  "porto": "Porto",
  "seville": "Seville",
  "grenade": "Granada",
  "istanbul": "Istanbul",
  "cappadoce": "Cappadocia",
  "athenes": "Athens",
  "rome": "Rome",
  "florence": "Florence",
  "copenhague": "Copenhagen",
  "amsterdam": "Amsterdam",
  "kyoto": "Kyoto",
  "tokyo": "Tokyo",
  "bali": "Bali",
  "zanzibar": "Zanzibar",
  "kigali": "Kigali",
  "cape-town": "Cape Town",
  "petra": "Petra",
  "dubai": "Dubai",
  "montreal": "Montreal",
  "new-york": "New York City",
  "rio": "Rio de Janeiro"
};

/** Banque d'illustrations thématiques : la photo illustre l'activité, jamais un résultat personnel. */
export const CHALLENGE_THEME_PAGES: Record<string, string> = {
  "squat": "Squat (exercise)",
  "plank": "Plank (exercise)",
  "pushup": "Push-up",
  "run": "Running",
  "walk": "Walking",
  "stretch": "Stretching",
  "jump": "Skipping rope",
  "dance": "Dance",
  "pilates": "Pilates",
  "yoga": "Yoga",
  "tennis": "Tennis",
  "strength": "Strength training",
  "cooking": "Cooking",
  "breakfast": "Breakfast",
  "smoothie": "Smoothie",
  "vegetables": "Vegetable",
  "spice": "Spice",
  "mealprep": "Meal preparation",
  "foodwaste": "Food waste",
  "book": "Reading",
  "language": "Language learning",
  "history": "History",
  "geography": "Geography",
  "museum": "Art museum",
  "science": "Science",
  "economics": "Economics",
  "code": "Computer programming",
  "computer": "Laptop",
  "research": "Research",
  "notes": "Notebook",
  "speaking": "Public speaking",
  "write": "Writing",
  "photo": "Photography",
  "drawing": "Drawing",
  "painting": "Painting",
  "project": "Desk",
  "calendar": "Calendar",
  "tidying": "Tidying Up with Marie Kondo",
  "finance": "Saving",
  "habit": "Daily routine",
  "meditation": "Meditation",
  "sleep": "Sleep",
  "nature": "Nature",
  "breathing": "Breathing",
  "gratitude": "Gratitude",
  "friends": "Friendship",
  "water": "Drinking water"
};

/** Associe chaque défi au thème illustré correspondant, sans mot-clé de recherche libre. */
export function challengePhotoTheme(category: string, discipline: string, title: string): string {
  const d = discipline.toLocaleLowerCase('fr');
  const t = title.toLocaleLowerCase('fr');
  if (/pilates/.test(d+" "+t)) return "pilates";
  if (/yoga/.test(d+" "+t)) return "yoga";
  if (/tennis/.test(d+" "+t)) return "tennis";
  if (/squat|fessier/.test(d+" "+t)) return "squat";
  if (/gainage|abdo|planche/.test(d+" "+t)) return "plank";
  if (/pompe/.test(d+" "+t)) return "pushup";
  if (/course|cours|courir/.test(d+" "+t) && category === "Sport") return "run";
  if (/marche|pas/.test(d+" "+t)) return "walk";
  if (/corde/.test(t)) return "jump";
  if (/danse/.test(d+" "+t)) return "dance";
  if (/soupless|posture|dos/.test(d+" "+t)) return "stretch";
  if (/cardio|renforc|bras|full body/.test(d+" "+t)) return "strength";
  if (/smoothie/.test(t)) return "smoothie";
  if (/petit.déjeuner/.test(t)) return "breakfast";
  if (/légume/.test(t)) return "vegetables";
  if (/épice/.test(t)) return "spice";
  if (/batch/.test(t)) return "mealprep";
  if (/gaspillage/.test(t)) return "foodwaste";
  if (category === "Cuisine") return "cooking";
  if (/lecture|lire|classique|livre/.test(d+" "+t)) return "book";
  if (/langue|anglais|wolof|espagnol|prononciation/.test(d+" "+t)) return "language";
  if (/histoire/.test(t)) return "history";
  if (/géograph|pays/.test(t)) return "geography";
  if (/musée|artiste|art et/.test(t)) return "museum";
  if (/science/.test(t)) return "science";
  if (/économie/.test(t)) return "economics";
  if (/python|intelligence artificielle|cybersécurité/.test(t)) return "code";
  if (/numérique|excel|tableur|fichier|interface|design/.test(d+" "+t)) return "computer";
  if (/recherche|esprit critique/.test(t)) return "research";
  if (/parole|communication/.test(t)) return "speaking";
  if (/photo/.test(d+" "+t)) return "photo";
  if (/dessin|croquis/.test(d+" "+t)) return "drawing";
  if (/peinture/.test(d+" "+t)) return "painting";
  if (/écriture|écrire|journal|histoire|écriture/.test(d+" "+t)) return "write";
  if (category === "Apprentissage") return "notes";
  if (category === "Créativité") return "project";
  if (/budget|financ|économi/.test(d+" "+t)) return "finance";
  if (/rang|désencombr|espace/.test(d+" "+t)) return "tidying";
  if (/planif|semaine|tâche|soir|organisation/.test(d+" "+t)) return "calendar";
  if (/routine|habitude/.test(d+" "+t)) return "habit";
  if (category === "Organisation") return "notes";
  if (/médit/.test(d+" "+t)) return "meditation";
  if (/sommeil|dormir/.test(d+" "+t)) return "sleep";
  if (/respir|ancrage/.test(d+" "+t)) return "breathing";
  if (/gratitude/.test(d+" "+t)) return "gratitude";
  if (/hydrat|eau/.test(d+" "+t)) return "water";
  if (/relations|écoute|communication/.test(d+" "+t)) return "friends";
  if (/dehors|plein air/.test(t)) return "nature";
  if (category === "Bien-être") return "meditation";
  return "nature";
}

/** Photographies Pexels dont le sujet a été contrôlé sur la page source.
 * Personnes : femmes noires uniquement. Sujets non humains : objets thématiques.
 * Chaque photo est une illustration de l'activité, non de l'utilisateur.
 */
const pexels = (id: number) => ({
  src: 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=960',
  creditUrl: 'https://www.pexels.com/photo/' + id + '/',
  creditLabel: 'Pexels',
});
export const CURATED_CHALLENGE_PHOTOS: Record<string, ReturnType<typeof pexels>> = {
  squat: pexels(8846530),
  plank: pexels(6303481),
  pushup: pexels(8770392),
  run: pexels(4760570),
  walk: pexels(6280553),
  stretch: pexels(7746176),
  dance: pexels(7194397),
  strength: pexels(5149159),
  book: pexels(9051417),
  language: pexels(7683726),
  notes: pexels(3059749),
  write: pexels(8091202),
  code: pexels(5905839),
  computer: pexels(5905839),
  calendar: pexels(8532928),
  project: pexels(8532928),
  meditation: pexels(6957977),
  breathing: pexels(7113566),
};

/** Les autres articles Wikipédia ne sont utilisés que pour des sujets principalement
 * documentaires (objets, paysages ou créations), pas pour inventer des portraits.
 */
export const SAFE_WIKI_CHALLENGE_THEMES = new Set([
  'history', 'geography', 'museum', 'science', 'economics', 'research', 'photo',
  'drawing', 'painting', 'vegetables', 'spice', 'mealprep', 'foodwaste',
  'breakfast', 'smoothie', 'cooking', 'calendar', 'tidying', 'finance',
  'sleep', 'gratitude', 'nature', 'water',
]);
