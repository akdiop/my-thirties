/**
 * Destinations : titre de la page Wikipédia (fr) dont la photo principale illustre chaque lieu.
 * C'est le seul contenu visuel chargé depuis l'extérieur ; tous les autres visuels sont hébergés dans l'app.
 */
export const WIKI_DESTINATIONS: Record<string,string> = {
  marrakech:'Marrakech',essaouira:'Essaouira',chefchaouen:'Chefchaouen',
  'saint-louis':'Saint-Louis (Sénégal)','sine-saloum':'Sine-Saloum',casamance:'Casamance',
  praia:'Praia',sal:'Sal (Cap-Vert)',lisbonne:'Lisbonne',porto:'Porto',
  seville:'Séville',grenade:'Grenade (Espagne)',istanbul:'Istanbul',
  cappadoce:'Cappadoce',athenes:'Athènes',rome:'Rome',florence:'Florence',
  copenhague:'Copenhague',amsterdam:'Amsterdam',kyoto:'Kyoto',
  tokyo:'Tokyo',bali:'Bali',zanzibar:'Zanzibar',kigali:'Kigali',
  'cape-town':'Le Cap',petra:'Pétra',dubai:'Dubaï',montreal:'Montréal',
  'new-york':'New York',rio:'Rio de Janeiro'
};

/** Recherche Unsplash (en anglais, plus de résultats) pour chaque plat ; à défaut, le titre Wikipédia est utilisé. */
export const UNSPLASH_QUERIES: Record<string, string> = {
  Smoothie: 'fruit smoothie glass', 'Jus de fruits': 'fresh juice shot', Porridge: 'oatmeal porridge bowl', Bouillie: 'millet porridge',
  'Pain perdu': 'french toast', Yassa: 'chicken yassa onion lemon', 'Mafé': 'peanut stew african', 'Thiéboudienne': 'thieboudienne senegal fish rice',
  'Poulet rôti': 'grilled chicken plate', 'Riz frit': 'fried rice', 'Nouilles sautées': 'stir fried noodles', Lasagnes: 'lasagna',
  Risotto: 'risotto', 'Pâtes alimentaires': 'pasta tomato sauce', Quiche: 'quiche', Omelette: 'omelette', Gratin: 'gratin dish',
  Couscous: 'couscous vegetables', Curry: 'curry bowl', 'Velouté': 'creamy vegetable soup', Brochette: 'skewers grilled',
  'Patate douce': 'roasted sweet potato', 'Salade composée': 'salad bowl', Pancake: 'pancakes', 'Crêpe': 'crepes',
  Muffin: 'muffins', Cookie: 'cookies', 'Pop-corn': 'popcorn bowl', Pizza: 'mini pizza', Focaccia: 'focaccia',
  'Pain pita': 'pita bread', Naan: 'naan bread', 'Wrap (cuisine)': 'tortilla wrap', Sandwich: 'sandwich', Tartine: 'open sandwich toast',
  Yaourt: 'yogurt bowl fruit', 'Flan pâtissier': 'custard flan', Clafoutis: 'clafoutis', 'Cake (pâtisserie)': 'lemon loaf cake',
  Compote: 'apple compote', 'Sauce tomate': 'tomato sauce', 'Sauce béchamel': 'bechamel sauce', 'Pâte brisée': 'pie dough',
  Pain: 'homemade bread loaf', 'Bowl (cuisine)': 'buddha bowl', 'Sauté (cuisine)': 'stir fry pan', 'Amuse-bouche': 'appetizer bites',
};

/** Plats : mot-clé du titre de la recette → page Wikipédia (fr) du plat. Le premier qui correspond l'emporte. */
const DISH_RULES: [RegExp, string][] = [
  [/smoothie/i, 'Smoothie'], [/^shot/i, 'Jus de fruits'], [/porridge/i, 'Porridge'], [/bouillie/i, 'Bouillie'],
  [/pain perdu/i, 'Pain perdu'], [/yassa/i, 'Yassa'], [/maf[ée]/i, 'Mafé'], [/thi[ée]b|thieboudienne/i, 'Thiéboudienne'],
  [/poulet braisé|poulet rôti/i, 'Poulet rôti'], [/riz sauté/i, 'Riz frit'], [/nouilles/i, 'Nouilles sautées'],
  [/lasagne/i, 'Lasagnes'], [/risotto/i, 'Risotto'], [/p[âa]tes sauce|spaghetti/i, 'Pâtes alimentaires'],
  [/quiche/i, 'Quiche'], [/omelette/i, 'Omelette'], [/gratin/i, 'Gratin'], [/couscous/i, 'Couscous'], [/curry/i, 'Curry'],
  [/velouté|soupe/i, 'Velouté'], [/brochette/i, 'Brochette'], [/patate douce/i, 'Patate douce'], [/salade/i, 'Salade composée'],
  [/pancake/i, 'Pancake'], [/cr[êe]pe/i, 'Crêpe'], [/muffin/i, 'Muffin'], [/cookie/i, 'Cookie'], [/pop-corn/i, 'Pop-corn'],
  [/pizza/i, 'Pizza'], [/focaccia/i, 'Focaccia'], [/pita/i, 'Pain pita'], [/naan/i, 'Naan'], [/wrap/i, 'Wrap (cuisine)'],
  [/sandwich/i, 'Sandwich'], [/tartine/i, 'Tartine'], [/yaourt gourmand|^yaourt/i, 'Yaourt'], [/flan/i, 'Flan pâtissier'],
  [/clafoutis/i, 'Clafoutis'], [/^cake/i, 'Cake (pâtisserie)'], [/compote/i, 'Compote'], [/sauce tomate/i, 'Sauce tomate'],
  [/béchamel/i, 'Sauce béchamel'], [/pâte brisée/i, 'Pâte brisée'], [/^pain/i, 'Pain'],
  [/bowl|bol de/i, 'Bowl (cuisine)'], [/poêlée/i, 'Sauté (cuisine)'], [/bouchées/i, 'Amuse-bouche'],
];
export const WIKI_DISHES: Record<string, string> = Object.fromEntries(DISH_RULES.map(([, title]) => [title, title]));
/** Page Wikipédia du plat d'une recette, ou undefined si aucun plat reconnu. */
export const dishOf = (recipeTitle: string) => DISH_RULES.find(([re]) => re.test(recipeTitle))?.[1];
