// Illustrative food photos; a photo does not certify the exact recipe.
const p = (id: number) => 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=720';
export function recipePhoto(title: string, category: string): string {
  const t = title.toLowerCase();
  if (/quiche/.test(t)) return p(34318142);
  if (/pizza|focaccia/.test(t)) return p(70497);
  if (/pâtes|pates|spaghetti|lasagne|risotto/.test(t)) return p(17804216);
  if (/salade|bowl|crudités/.test(t)) return p(1640777);
  if (/crêpe|crepe|pancake|gaufre/.test(t)) return p(376464);
  if (/gâteau|gateau|cake|muffin|flan|clafoutis/.test(t) || category === 'dessert') return p(291528);
  if (/sandwich|wrap|toast/.test(t)) return p(461198);
  if (/pain|brioche|naan/.test(t) || category === 'boulangerie') return p(1775043);
  if (/smoothie|jus|shot/.test(t) || category === 'smoothie' || category === 'shot') return p(3026808);
  return '/visuels/cuisine.webp';
}
export function challengePhoto(category: string, discipline: string, title: string): string {
  const t = (discipline + ' ' + title).toLowerCase();
  if (/pilates/.test(t)) return '/visuels/pilates.webp';
  if (/yoga/.test(t)) return '/visuels/yoga.webp';
  if (/tennis/.test(t)) return '/visuels/tennis.webp';
  if (/lecture|lire|livre/.test(t)) return p(5311633);
  if (/peinture|dessin|créativ|photograph/.test(t) || category === 'Créativité') return p(5033997);
  if (/médit|respir|repos|gratitude|sommeil/.test(t) || category === 'Bien-être') return '/visuels/bien-etre.webp';
  if (category === 'Cuisine') return '/visuels/cuisine.webp';
  if (category === 'Apprentissage') return p(7584771);
  if (category === 'Organisation' || category === 'Habitudes') return '/visuels/organisation.webp';
  return '/visuels/pilates.webp';
}
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
