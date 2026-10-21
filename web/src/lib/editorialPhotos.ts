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

/**
 * N'affiche pas la même photo pour toutes les variantes d'une recette.
 * Seuls les titres correspondant exactement à un plat nommé sur Wikipédia
 * peuvent utiliser sa photographie ; les variantes restent sans photo.
 */
const normalizeDish = (text: string) => text.toLocaleLowerCase('fr')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').trim();
export function exactDishOf(recipeTitle: string): string | undefined {
  const title = normalizeDish(recipeTitle);
  return Object.values(WIKI_DISHES).find((dish) => normalizeDish(dish) === title);
}
