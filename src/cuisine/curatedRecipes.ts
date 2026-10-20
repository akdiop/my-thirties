/** Bibliothèque personnelle de 50 recettes, sans porc, avocat, papaye, coco, fruits de mer, noix ni pois chiches. */
export type CuratedCategory = 'petit-dejeuner' | 'dejeuner' | 'diner' | 'casse-croute' | 'smoothie' | 'shot';
export type CuratedRecipe = {
  libraryId: string; title: string; origin: string; category: CuratedCategory;
  servings: number; prepMin: number; cookMin: number;
  ingredients: { name: string; qty: number | null; unit: string }[];
  steps: string[]; storage: string | null;
};
const SOURCE: [CuratedCategory, string, number, number, string, string][] = [
  [
    "petit-dejeuner",
    "Tartines œufs brouillés et tomates",
    15,
    1,
    "2 tranches pain complet;2 œufs;1 tomate;1 c. à c. huile d’olive;1 pincée sel",
    "Griller le pain.|Faire revenir la tomate coupée avec l’huile.|Ajouter les œufs battus et remuer doucement.|Servir sur les tartines."
  ],
  [
    "petit-dejeuner",
    "Porridge banane cannelle",
    12,
    1,
    "50 g flocons d’avoine;200 ml lait;1 banane;1 pincée cannelle",
    "Chauffer le lait et l’avoine en remuant.|Écraser la moitié de la banane dans le porridge.|Servir avec les rondelles restantes et la cannelle."
  ],
  [
    "petit-dejeuner",
    "Omelette aux épinards et fromage",
    15,
    1,
    "2 œufs;50 g épinards;30 g emmental;1 c. à c. huile;1 pincée poivre",
    "Laver et faire tomber les épinards à la poêle.|Battre les œufs et les verser sur les épinards.|Ajouter l’emmental et cuire jusqu’à prise complète."
  ],
  [
    "petit-dejeuner",
    "Pain perdu à la vanille",
    15,
    2,
    "4 tranches pain;2 œufs;120 ml lait;1 c. à c. vanille;1 c. à c. huile",
    "Battre œufs, lait et vanille.|Tremper rapidement les tranches de pain.|Dorer à la poêle légèrement huilée des deux côtés.|Servir avec des fruits."
  ],
  [
    "petit-dejeuner",
    "Yaourt granola mangue",
    5,
    1,
    "150 g yaourt nature;1 mangue;40 g granola sans noix;1 pincée cannelle",
    "Couper la mangue en dés.|Verser le yaourt dans un bol.|Ajouter le granola, la mangue et la cannelle."
  ],
  [
    "petit-dejeuner",
    "Crêpes légères au lait",
    25,
    4,
    "200 g farine;2 œufs;400 ml lait;1 c. à s. huile;1 pincée sel",
    "Mélanger farine, œufs et sel.|Verser progressivement le lait et l’huile.|Laisser reposer quelques minutes.|Cuire de fines crêpes dans une poêle chaude."
  ],
  [
    "petit-dejeuner",
    "Bouillie de mil au lait",
    20,
    2,
    "100 g farine de mil;450 ml lait;1 c. à c. vanille;1 pincée muscade;1 c. à s. miel",
    "Délayer la farine de mil dans un peu de lait froid.|Chauffer le reste du lait et incorporer le mélange.|Remuer jusqu’à épaississement et cuisson du mil.|Parfumer à la vanille, muscade et miel."
  ],
  [
    "petit-dejeuner",
    "Sandwich fromage frais concombre",
    10,
    1,
    "2 tranches pain complet;50 g fromage frais;0.5 concombre;1 pincée poivre;1 c. à c. jus de citron",
    "Tartiner le pain de fromage frais.|Couper le concombre en fines rondelles.|Ajouter citron et poivre, puis refermer."
  ],
  [
    "petit-dejeuner",
    "Pancakes banane avoine",
    20,
    2,
    "1 banane;2 œufs;80 g flocons d’avoine;60 ml lait;1 c. à c. levure chimique",
    "Mixer la banane, les œufs, l’avoine, le lait et la levure.|Laisser reposer cinq minutes.|Cuire de petits pancakes dans une poêle antiadhésive."
  ],
  [
    "petit-dejeuner",
    "Tartines ricotta fraises",
    8,
    1,
    "2 tranches pain;60 g ricotta;100 g fraises;1 c. à c. miel",
    "Griller légèrement le pain.|Étaler la ricotta.|Répartir les fraises coupées et un filet de miel."
  ],
  [
    "dejeuner",
    "Poulet yassa et riz",
    70,
    4,
    "800 g poulet;5 oignons;2 citrons;2 c. à s. moutarde;3 gousses ail;300 g riz;2 c. à s. huile",
    "Mariner le poulet avec citron, moutarde, ail et oignons émincés.|Dorer le poulet, puis attendrir les oignons.|Ajouter un fond d’eau et laisser mijoter jusqu’à cuisson complète.|Servir avec le riz cuit séparément."
  ],
  [
    "dejeuner",
    "Mafé au bœuf et patate douce",
    90,
    4,
    "600 g bœuf;160 g pâte d’arachide;2 oignons;2 c. à s. concentré de tomate;1 patate douce;2 carottes;300 g riz",
    "Faire dorer le bœuf avec les oignons.|Ajouter tomate et pâte d’arachide diluée dans l’eau.|Ajouter les légumes et laisser mijoter jusqu’à ce que la viande soit tendre.|Servir avec le riz."
  ],
  [
    "dejeuner",
    "Poulet braisé aux épices et attiéké",
    55,
    4,
    "800 g poulet;400 g attiéké;2 citrons;2 gousses ail;1 c. à c. paprika;2 c. à s. huile;2 tomates",
    "Assaisonner le poulet avec citron, ail, paprika et huile.|Faire cuire au four jusqu’à cuisson complète.|Réchauffer l’attiéké à la vapeur.|Servir avec les tomates fraîches."
  ],
  [
    "dejeuner",
    "Riz sauté au poulet et légumes",
    35,
    3,
    "300 g riz cuit et refroidi;300 g blanc de poulet;2 carottes;1 poivron;1 oignon;2 c. à s. sauce soja;1 c. à s. huile",
    "Cuire le poulet en petits morceaux.|Faire sauter les légumes émincés.|Ajouter le riz bien réfrigéré puis la sauce soja.|Réchauffer l’ensemble à cœur et servir aussitôt."
  ],
  [
    "dejeuner",
    "Lasagnes bolognaises à l’emmental",
    75,
    6,
    "500 g bœuf haché;12 feuilles lasagne;600 g coulis de tomate;1 oignon;500 ml lait;40 g farine;120 g emmental;2 c. à s. huile",
    "Faire revenir le bœuf, l’oignon et le coulis.|Préparer une béchamel avec lait et farine en remuant jusqu’à épaississement.|Alterner pâtes, sauce tomate et béchamel.|Terminer par l’emmental et cuire au four jusqu’à ce que les pâtes soient tendres."
  ],
  [
    "dejeuner",
    "Thiou boulettes et légumes",
    60,
    4,
    "500 g bœuf haché;2 oignons;3 carottes;2 pommes de terre;2 c. à s. concentré de tomate;2 gousses ail;300 g riz",
    "Former des boulettes avec la viande et l’ail.|Faire revenir oignons et tomate, puis ajouter de l’eau.|Cuire les boulettes et les légumes dans la sauce.|Servir avec le riz."
  ],
  [
    "dejeuner",
    "Poulet DG aux plantains",
    65,
    4,
    "800 g poulet;3 bananes plantain;2 carottes;1 poivron;200 g haricots verts;2 tomates;1 oignon;2 c. à s. huile",
    "Dorer le poulet et poursuivre sa cuisson.|Faire revenir les légumes coupés et les tomates.|Dorer les rondelles de plantain à part.|Réunir le tout et mijoter quelques minutes."
  ],
  [
    "dejeuner",
    "Pâtes crémeuses au poulet et champignons",
    35,
    3,
    "300 g pâtes;350 g poulet;200 g champignons;150 ml crème légère;1 oignon;40 g emmental;1 c. à s. huile",
    "Cuire les pâtes.|Dorer le poulet avec l’oignon et les champignons.|Ajouter la crème et un peu d’eau de cuisson.|Mélanger avec les pâtes et l’emmental."
  ],
  [
    "dejeuner",
    "Couscous au poulet et légumes",
    70,
    4,
    "500 g poulet;350 g semoule;3 carottes;2 courgettes;1 navet;2 tomates;1 oignon;1 c. à c. ras el hanout",
    "Faire revenir le poulet et l’oignon avec les épices.|Ajouter les tomates, de l’eau et les légumes.|Laisser mijoter jusqu’à cuisson complète.|Hydrater la semoule et servir avec le bouillon."
  ],
  [
    "dejeuner",
    "Bowl riz bœuf grillé et crudités",
    30,
    2,
    "250 g bœuf émincé;150 g riz;1 concombre;2 tomates;1 carotte;1 citron;1 c. à s. huile",
    "Cuire le riz.|Saisir le bœuf jusqu’à cuisson souhaitée.|Couper les crudités et râper la carotte.|Assembler et assaisonner de citron et d’huile."
  ],
  [
    "dejeuner",
    "Gratin de pommes de terre au poulet",
    65,
    4,
    "600 g pommes de terre;400 g poulet;250 ml lait;100 g emmental;1 oignon;1 c. à c. paprika",
    "Précuire les pommes de terre en rondelles.|Faire cuire le poulet avec l’oignon et le paprika.|Disposer en couches dans un plat avec le lait.|Parsemer d’emmental et gratiner au four."
  ],
  [
    "dejeuner",
    "Riz tomate aux boulettes de dinde",
    50,
    4,
    "500 g dinde hachée;300 g riz;400 g tomates concassées;1 oignon;2 gousses ail;1 poivron;1 c. à s. huile",
    "Former les boulettes de dinde et les faire dorer.|Faire revenir oignon, ail, poivron et tomates.|Ajouter les boulettes et mijoter jusqu’à cuisson complète.|Servir sur le riz."
  ],
  [
    "diner",
    "Velouté de carottes et lentilles corail",
    35,
    3,
    "400 g carottes;150 g lentilles corail;1 oignon;750 ml eau;1 c. à c. cumin;1 c. à s. huile",
    "Faire revenir l’oignon et le cumin.|Ajouter carottes, lentilles rincées et eau.|Cuire jusqu’à tendreté puis mixer.|Ajuster la texture avec un peu d’eau."
  ],
  [
    "diner",
    "Quiche sans pâte épinards emmental",
    45,
    4,
    "4 œufs;250 ml lait;150 g épinards;80 g emmental;60 g farine;1 pincée poivre",
    "Faire tomber les épinards à la poêle.|Battre œufs, lait et farine.|Incorporer les épinards et le fromage.|Verser dans un moule et cuire au four jusqu’à prise complète."
  ],
  [
    "diner",
    "Wrap de poulet sauce yaourt citron",
    25,
    2,
    "2 tortillas;250 g poulet;1 tomate;0.5 concombre;100 g yaourt nature;1 citron;1 c. à c. paprika",
    "Cuire le poulet assaisonné de paprika.|Mélanger le yaourt et le jus de citron.|Garnir les tortillas de légumes, poulet et sauce.|Rouler et servir."
  ],
  [
    "diner",
    "Omelette champignons pommes de terre",
    30,
    2,
    "4 œufs;250 g pommes de terre;150 g champignons;1 oignon;1 c. à s. huile",
    "Cuire les pommes de terre en petits dés jusqu’à tendreté.|Faire revenir champignons et oignon.|Ajouter les œufs battus et cuire à cœur."
  ],
  [
    "diner",
    "Poêlée de dinde courgettes et boulgour",
    30,
    2,
    "300 g escalope de dinde;2 courgettes;140 g boulgour;1 oignon;1 c. à s. huile;1 c. à c. paprika",
    "Cuire le boulgour selon le paquet.|Faire revenir dinde, oignon et paprika.|Ajouter les courgettes et cuire jusqu’à tendreté.|Servir avec le boulgour."
  ],
  [
    "diner",
    "Soupe de tomates et tartines fromage",
    30,
    2,
    "500 g tomates;1 oignon;2 gousses ail;400 ml eau;4 tranches pain;80 g emmental;1 c. à s. huile",
    "Faire revenir l’oignon et l’ail.|Ajouter les tomates et l’eau puis mijoter.|Mixer la soupe.|Faire fondre l’emmental sur les tartines et servir."
  ],
  [
    "diner",
    "Salade tiède de lentilles et œufs",
    30,
    2,
    "200 g lentilles cuites;2 œufs;2 tomates;1 carotte;1 c. à s. huile d’olive;1 c. à s. jus de citron",
    "Cuire les œufs durs.|Réchauffer les lentilles égouttées.|Ajouter tomates et carotte râpée.|Assaisonner et servir avec les œufs."
  ],
  [
    "diner",
    "Gratin de courgettes et viande hachée",
    45,
    3,
    "400 g bœuf haché;3 courgettes;300 g coulis de tomate;1 oignon;100 g emmental;1 c. à s. huile",
    "Faire revenir la viande et l’oignon.|Ajouter le coulis de tomate.|Disposer avec les courgettes en tranches dans un plat.|Parsemer d’emmental et cuire au four."
  ],
  [
    "diner",
    "Nouilles sautées aux œufs et légumes",
    25,
    2,
    "180 g nouilles;2 œufs;1 carotte;1 poivron;1 oignon;2 c. à s. sauce soja;1 c. à s. huile",
    "Cuire les nouilles.|Faire sauter les légumes émincés.|Ajouter les œufs et brouiller jusqu’à cuisson.|Mélanger avec les nouilles et la sauce soja."
  ],
  [
    "diner",
    "Patate douce rôtie au poulet citronné",
    45,
    2,
    "2 patates douces;300 g poulet;1 citron;1 c. à c. paprika;1 c. à s. huile;1 concombre",
    "Couper les patates douces en quartiers et les rôtir au four.|Assaisonner le poulet de citron et paprika.|Cuire le poulet complètement.|Servir avec le concombre frais."
  ],
  [
    "casse-croute",
    "Mini sandwich poulet fromage",
    15,
    2,
    "2 petits pains;150 g poulet cuit;50 g emmental;1 tomate;2 feuilles laitue;1 c. à s. yaourt nature",
    "Couper les pains et garnir de poulet cuit.|Ajouter fromage, tomate et laitue.|Étaler un peu de yaourt et refermer."
  ],
  [
    "casse-croute",
    "Muffins banane avoine",
    30,
    6,
    "2 bananes;2 œufs;120 g farine;80 g flocons d’avoine;100 ml lait;1 c. à c. levure chimique",
    "Écraser les bananes et mélanger avec les œufs et le lait.|Ajouter farine, avoine et levure.|Répartir dans des moules et cuire au four jusqu’à cuisson complète."
  ],
  [
    "casse-croute",
    "Brochettes de fruits au yaourt",
    10,
    2,
    "1 mangue;1 banane;1 pomme;150 g yaourt nature;1 pincée cannelle",
    "Laver et couper les fruits.|Les enfiler sur des petites brochettes ou les servir en bol.|Mélanger le yaourt et la cannelle pour accompagner."
  ],
  [
    "casse-croute",
    "Pop-corn maison au paprika",
    10,
    2,
    "70 g maïs à éclater;1 c. à s. huile;1 pincée paprika;1 pincée sel",
    "Chauffer l’huile et les grains de maïs dans une casserole couverte.|Secouer régulièrement et retirer du feu quand les éclatements cessent.|Assaisonner de paprika."
  ],
  [
    "casse-croute",
    "Tartines de houmous de haricots blancs",
    15,
    2,
    "200 g haricots blancs cuits;1 citron;1 gousse ail;1 c. à s. huile d’olive;4 tranches pain;1 pincée cumin",
    "Mixer les haricots blancs avec citron, ail, huile et cumin.|Ajouter un peu d’eau pour une texture tartinable.|Servir sur le pain grillé."
  ],
  [
    "casse-croute",
    "Bouchées dattes et graines de sésame",
    10,
    4,
    "12 dattes dénoyautées;40 g graines de sésame;2 c. à s. flocons d’avoine;1 c. à c. cacao",
    "Mixer les dattes et les flocons d’avoine.|Former des petites bouchées.|Rouler dans le sésame mélangé au cacao.|Conserver au frais."
  ],
  [
    "casse-croute",
    "Mini pizzas sur pain pita",
    20,
    2,
    "2 pains pita;120 g coulis de tomate;80 g emmental;1 tomate;1 poivron;1 pincée origan",
    "Étaler le coulis sur les pains pita.|Ajouter tomate, poivron et fromage.|Saupoudrer d’origan et cuire au four jusqu’à fromage fondu."
  ],
  [
    "casse-croute",
    "Yaourt glacé aux fraises",
    10,
    2,
    "250 g yaourt nature;150 g fraises;1 c. à s. miel;1 c. à c. vanille",
    "Mixer le yaourt, les fraises et la vanille.|Ajouter le miel selon le goût.|Verser dans des moules et congeler plusieurs heures."
  ],
  [
    "smoothie",
    "Smoothie mangue banane lait",
    5,
    2,
    "1 mangue;1 banane;300 ml lait;4 glaçons",
    "Éplucher et couper les fruits.|Mixer avec le lait et les glaçons.|Servir frais."
  ],
  [
    "smoothie",
    "Smoothie fraise yaourt",
    5,
    2,
    "250 g fraises;200 g yaourt nature;150 ml lait;1 c. à c. miel",
    "Laver et équeuter les fraises.|Mixer avec le yaourt et le lait.|Ajouter le miel si souhaité."
  ],
  [
    "smoothie",
    "Smoothie ananas menthe",
    7,
    2,
    "300 g ananas;250 ml eau fraîche;6 feuilles menthe;1 c. à s. jus de citron",
    "Éplucher l’ananas et retirer le cœur dur.|Mixer avec l’eau, la menthe et le citron.|Servir immédiatement."
  ],
  [
    "smoothie",
    "Smoothie banane cacao avoine",
    6,
    1,
    "1 banane;200 ml lait;20 g flocons d’avoine;1 c. à c. cacao non sucré",
    "Mixer la banane avec le lait, l’avoine et le cacao.|Ajouter un peu de lait selon la texture souhaitée.|Servir frais."
  ],
  [
    "smoothie",
    "Smoothie pastèque fraise",
    6,
    2,
    "300 g pastèque sans pépins;150 g fraises;1 c. à s. jus de citron;4 glaçons",
    "Retirer les pépins de la pastèque.|Mixer avec les fraises, le citron et les glaçons.|Servir très frais."
  ],
  [
    "smoothie",
    "Smoothie pêche vanille",
    5,
    2,
    "2 pêches;250 ml lait;100 g yaourt nature;1 c. à c. vanille",
    "Laver et dénoyauter les pêches.|Mixer avec le lait, le yaourt et la vanille.|Servir frais."
  ],
  [
    "shot",
    "Shot doux gingembre orange",
    5,
    2,
    "2 oranges;10 g gingembre frais;50 ml eau",
    "Presser les oranges.|Râper le gingembre pelé et mixer avec le jus et l’eau.|Filtrer si souhaité et servir en petites portions."
  ],
  [
    "shot",
    "Shot citron pomme menthe",
    5,
    2,
    "1 pomme;0.5 citron;4 feuilles menthe;80 ml eau",
    "Laver et couper la pomme.|Mixer avec le jus de citron, la menthe et l’eau.|Filtrer si souhaité et servir frais."
  ],
  [
    "shot",
    "Shot ananas citron gingembre",
    5,
    2,
    "150 g ananas;0.5 citron;5 g gingembre frais;60 ml eau",
    "Couper l’ananas et peler le gingembre.|Mixer avec le citron et l’eau.|Servir en petites portions, sans promesse de détox."
  ],
  [
    "shot",
    "Shot fraise orange basilic",
    5,
    2,
    "100 g fraises;1 orange;3 feuilles basilic;40 ml eau",
    "Laver les fraises et le basilic.|Presser l’orange.|Mixer le tout et servir aussitôt."
  ]
];
const parse = (line: string) => {
  const m = line.match(/^(\\d+(?:\\.\\d+)?)\\s+(kg|g|ml|l|c\\. à s\\.|c\\. à c\\.|pincée|botte|boîte|tranches|feuilles|gousses|glaçons)\\s+(.+)$/);
  if (m) return { name: m[3]!, qty: Number(m[1]), unit: m[2]! };
  const n = line.match(/^(\\d+(?:\\.\\d+)?)\\s+(.+)$/);
  return n ? { name: n[2]!, qty: Number(n[1]), unit: '' } : { name: line, qty: null, unit: '' };
};
export const CURATED_RECIPES: CuratedRecipe[] = SOURCE.map(([category, title, totalMin, servings, ingredients, steps], index) => ({
  libraryId: 'mt-50-' + String(index + 1).padStart(2, '0'),
  title, origin: title.includes('yassa') || title.includes('Mafé') || title.includes('Thiou') || title.includes('mil') ? 'senegalaise' : 'maison',
  category, servings, prepMin: Math.min(totalMin, category === 'shot' || category === 'smoothie' ? totalMin : 15),
  cookMin: category === 'shot' || category === 'smoothie' ? 0 : Math.max(0, totalMin - 15),
  ingredients: ingredients.split(';').map(parse),
  steps: steps.split('|'),
  storage: category === 'shot' || category === 'smoothie' ? 'À consommer de préférence immédiatement.' : null,
}));
