import type { ChallengeTemplate } from './challenges';
import { dishOf, UNSPLASH_QUERIES } from './editorialPhotos';

/** Une demande de photo : recherches essayées dans l'ordre ; une photo n'est gardée que si sa description contient un des mots `must`. */
export type PhotoItem = { qs: { q: string; lang: 'fr' | 'en' }[]; must?: string[] };

/** Mots (en anglais, comme les descriptions Unsplash) qu'une photo doit contenir pour illustrer le plat. */
const DISH_MUST: Record<string, string[]> = {
  Smoothie: ['smoothie', 'shake', 'juice'], 'Jus de fruits': ['juice', 'shot', 'drink'], Porridge: ['porridge', 'oatmeal', 'oats'], Bouillie: ['porridge', 'pudding', 'oatmeal'],
  'Pain perdu': ['french toast'], Yassa: ['chicken'], 'Mafé': ['stew', 'peanut'], 'Thiéboudienne': ['fish'], 'Poulet rôti': ['chicken'], 'Riz frit': ['rice'],
  'Nouilles sautées': ['noodle'], Lasagnes: ['lasagna', 'lasagne'], Risotto: ['risotto'], 'Pâtes alimentaires': ['pasta', 'spaghetti', 'penne'], Quiche: ['quiche'],
  Omelette: ['omelet', 'omelette'], Gratin: ['gratin', 'casserole', 'baked'], Couscous: ['couscous'], Curry: ['curry'], 'Velouté': ['soup'],
  Brochette: ['skewer', 'kebab'], 'Patate douce': ['sweet potato'], 'Salade composée': ['salad'], Pancake: ['pancake'], 'Crêpe': ['crepe', 'crêpe'],
  Muffin: ['muffin'], Cookie: ['cookie'], 'Pop-corn': ['popcorn'], Pizza: ['pizza'], Focaccia: ['focaccia'], 'Pain pita': ['pita'], Naan: ['naan', 'flatbread'],
  'Wrap (cuisine)': ['wrap', 'tortilla', 'burrito'], Sandwich: ['sandwich'], Tartine: ['toast'], Yaourt: ['yogurt', 'yoghurt'], 'Flan pâtissier': ['flan', 'custard'],
  Clafoutis: ['clafoutis', 'tart', 'cherry'], 'Cake (pâtisserie)': ['cake', 'loaf'], Compote: ['compote', 'applesauce', 'apple'], 'Sauce tomate': ['tomato'],
  'Sauce béchamel': ['sauce', 'bechamel'], 'Pâte brisée': ['dough', 'pastry', 'pie'], Pain: ['bread', 'loaf'], 'Bowl (cuisine)': ['bowl'],
  'Sauté (cuisine)': ['stir fry', 'sauteed', 'vegetables'], 'Amuse-bouche': ['appetizer', 'bites', 'snack'],
};

/** Recette : son nom exact (recherche en français), puis le plat en anglais ; la photo doit montrer ce plat. */
export function recipeItem(title: string): PhotoItem {
  const dish = dishOf(title);
  return { qs: [{ q: title, lang: 'fr' }, ...(dish ? [{ q: UNSPLASH_QUERIES[dish]!, lang: 'en' as const }] : [])], must: dish ? DISH_MUST[dish] : undefined };
}

/** Destinations : recherche en anglais ; la description de la photo doit nommer le lieu (jamais un autre lieu). */
const DESTINATIONS: Record<string, [string, string[]]> = {
  marrakech: ['Marrakech Morocco', ['marrakech', 'marrakesh']], essaouira: ['Essaouira Morocco', ['essaouira']], chefchaouen: ['Chefchaouen Morocco', ['chefchaouen', 'chaouen']],
  'saint-louis': ['Saint-Louis Senegal', ['saint louis senegal', 'st louis senegal', 'faidherbe']], 'sine-saloum': ['Sine Saloum Senegal', ['saloum']],
  casamance: ['Casamance Senegal', ['casamance', 'cap skirring', 'ziguinchor']], praia: ['Praia Cape Verde', ['praia']], sal: ['Sal island Cape Verde', ['sal island', 'santa maria', 'ilha do sal']],
  lisbonne: ['Lisbon Portugal', ['lisbon', 'lisboa']], porto: ['Porto Portugal', ['porto']], seville: ['Seville Spain', ['seville', 'sevilla']], grenade: ['Granada Spain Alhambra', ['granada', 'alhambra']],
  istanbul: ['Istanbul Turkey', ['istanbul']], cappadoce: ['Cappadocia balloons', ['cappadocia', 'goreme']], athenes: ['Athens Greece Acropolis', ['athens', 'acropolis']],
  rome: ['Rome Italy', ['rome', 'roma', 'colosseum', 'vatican']], florence: ['Florence Italy', ['florence', 'firenze']], copenhague: ['Copenhagen Denmark Nyhavn', ['copenhagen', 'nyhavn']],
  amsterdam: ['Amsterdam canals', ['amsterdam']], kyoto: ['Kyoto Japan', ['kyoto']], tokyo: ['Tokyo Japan', ['tokyo']], bali: ['Bali Indonesia', ['bali', 'ubud']],
  zanzibar: ['Zanzibar Tanzania beach', ['zanzibar', 'stone town']], kigali: ['Kigali Rwanda', ['kigali']], 'cape-town': ['Cape Town South Africa', ['cape town', 'table mountain']],
  petra: ['Petra Jordan', ['petra']], dubai: ['Dubai skyline', ['dubai']], montreal: ['Montreal Canada', ['montreal']], 'new-york': ['New York City', ['new york', 'manhattan', 'brooklyn', 'nyc']],
  rio: ['Rio de Janeiro Brazil', ['rio de janeiro', 'copacabana', 'ipanema', 'sugarloaf']],
};
export function destinationItem(id: string, name: string, country: string): PhotoItem {
  const [q, must] = DESTINATIONS[id] ?? [name + ' ' + country, [name]];
  return { qs: [{ q, lang: 'en' }], must };
}

/** Défis : une photo d'ambiance par thème (les visuels validés Pilates, Yoga et Tennis restent prioritaires). */
const CHALLENGE_QUERIES: Record<string, string> = {
  'squats-30': 'woman squat workout', 'gainage-30': 'woman plank exercise', 'abdos-30': 'woman abs workout mat', 'bras-30': 'woman arm workout dumbbells',
  'fessiers-30': 'woman glute workout', 'pompes-30': 'woman push ups', 'cardio-30': 'woman home cardio workout', 'course-30': 'woman running outdoors',
  'pas-30': 'woman walking nature', 'marche-30': 'woman walking nature', 'souplesse-30': 'woman stretching', 'dos-21': 'woman back stretch',
  'corde-30': 'jump rope workout', 'fullbody-28': 'woman full body workout', 'danse-21': 'woman dancing joy',
  'respiration-21': 'calm breathing meditation', 'gratitude-30': 'gratitude journal', 'meditation-21': 'meditation calm', 'sommeil-21': 'cozy bedroom sleep',
  'lecture-30': 'reading book cozy', 'ecrans-21': 'reading book evening', 'eau-30': 'glass of water', 'ecriture-30': 'journal writing pen',
  'rangement-30': 'tidy minimalist home', 'economie-30': 'budget savings notebook',
  'senegal-30': 'senegalese food', 'monde-30': 'world cuisine dishes', 'maison-21': 'homemade cooking kitchen', 'legumes-30': 'fresh vegetables market',
  'batch-28': 'meal prep containers', 'petitdej-21': 'healthy breakfast table', 'smoothie-14': 'smoothie bowl fruits', 'antigaspi-21': 'leftovers cooking',
  'epices-14': 'colorful spices market',
};
const DISCIPLINE_QUERIES: Record<string, string> = {
  Numérique: 'laptop learning desk', Langues: 'language learning notebook', 'Culture générale': 'library books', Émotions: 'journaling calm',
  Méthodes: 'study planner notebook', 'Vie quotidienne': 'organized home morning', Lecture: 'reading book', Écriture: 'writing notebook pen',
  Relations: 'friends coffee conversation', Planification: 'planner calendar desk', Habitudes: 'morning routine', Présence: 'mindfulness calm nature',
  Photographie: 'camera photography', Finances: 'budget planning notebook', Projets: 'project planning desk', Environnement: 'zero waste eco',
  Dessin: 'sketchbook drawing', Culture: 'art museum gallery', Cuisine: 'home cooking',
};
const CATEGORY_QUERIES: Record<string, string> = {
  Sport: 'woman home workout', 'Bien-être': 'calm wellbeing', Habitudes: 'morning routine', Cuisine: 'home cooking', Organisation: 'organized desk planner',
  Apprentissage: 'studying notebook', Créativité: 'creative art supplies',
};
export const VALIDATED_DISCIPLINES = ['Pilates', 'Yoga', 'Tennis'];
export function challengeItem(t: ChallengeTemplate): PhotoItem | null {
  if (VALIDATED_DISCIPLINES.includes(t.discipline)) return null;
  const q = CHALLENGE_QUERIES[t.id] ?? DISCIPLINE_QUERIES[t.discipline] ?? CATEGORY_QUERIES[t.category];
  return q ? { qs: [{ q, lang: 'en' }] } : null;
}
