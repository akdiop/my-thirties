import type { CuratedRecipe } from './types';

/**
 * Quiches (moule de 24 cm, 4 à 6 parts) et mini-quiches (moule à muffins, 12 pièces).
 * Même base pour toutes : pâte brisée + appareil œufs-crème ; chaque garniture a ses quantités et sa préparation.
 */
type Garnish = { id: string; title: string; items: string[]; prep: string[]; cheese?: string; season?: string; origin?: string; cook?: number };

const quiche = (g: Garnish): CuratedRecipe => ({
  id: 'quiche-' + g.id, title: 'Quiche ' + g.title, category: 'quiches', servings: 4, prepMin: 15, cookMin: g.cook ?? 35, origin: g.origin ?? 'francaise',
  ingredients: ['1 pâte brisée (maison ou du commerce, 230 g)', ...g.items, '3 œufs', '20 cl de crème fraîche épaisse', '10 cl de lait', g.cheese ?? '', 'Sel, poivre, 1 pincée de muscade'].filter(Boolean).join(';'),
  steps: [
    'Préchauffe le four à 180 °C (chaleur tournante) ou 200 °C (statique).',
    'Étale la pâte dans un moule à tarte de 24 cm avec son papier cuisson, pique le fond à la fourchette et garde-la au frais pendant la préparation.',
    ...g.prep,
    'Dans un saladier, fouette les œufs avec la crème et le lait. Sale légèrement (la garniture est souvent déjà salée), poivre et ajoute la muscade.',
    'Répartis la garniture bien égouttée sur le fond de pâte, puis verse l’appareil par-dessus' + (g.cheese ? ' et parsème de fromage.' : '.'),
    `Enfourne ${g.cook ?? 35} minutes environ, jusqu’à ce que la quiche soit dorée et que le centre ne tremble plus.`,
    'Laisse tiédir 10 minutes avant de démouler et de couper : les parts se tiennent mieux.',
  ],
  storage: '3 jours au réfrigérateur dans une boîte hermétique ; se congèle en parts. Réchauffe 10 min au four à 160 °C pour garder la pâte croustillante.',
});

const mini = (g: Garnish): CuratedRecipe => ({
  id: 'mini-quiche-' + g.id, title: 'Mini-quiches ' + g.title, category: 'quiches', servings: 12, prepMin: 20, cookMin: 20, origin: g.origin ?? 'francaise',
  ingredients: ['1 pâte brisée (230 g)', ...g.items, '2 œufs', '15 cl de crème fraîche', '5 cl de lait', g.cheese ?? '', 'Sel, poivre'].filter(Boolean).join(';'),
  steps: [
    'Préchauffe le four à 180 °C. Beurre légèrement un moule à muffins de 12 empreintes.',
    'Découpe 12 disques de pâte de 9 cm avec un verre ou un emporte-pièce, place-les dans les empreintes en remontant sur les bords et pique le fond.',
    ...g.prep,
    'Fouette les œufs, la crème et le lait ; sale peu et poivre.',
    'Répartis la garniture (1 à 2 cuillères à soupe par mini-quiche), puis remplis aux trois quarts avec l’appareil' + (g.cheese ? ' et ajoute une pincée de fromage.' : '.'),
    'Enfourne 18 à 22 minutes, jusqu’à ce qu’elles soient gonflées et dorées.',
    'Laisse reposer 5 minutes avant de démouler délicatement avec la pointe d’un couteau.',
  ],
  storage: '3 jours au frais ; se congèlent très bien (réchauffer 8 min à 170 °C). Parfaites pour les lunchbox et les apéritifs.',
});

const QUICHES: Garnish[] = [
  { id: 'poulet-poivrons', title: 'poulet, poivrons et mozzarella', items: ['250 g de blanc de poulet', '1 poivron rouge et 1 poivron vert', '1 boule de mozzarella (125 g)', '1 c. à café d’herbes de Provence', '1 c. à soupe d’huile d’olive'],
    prep: ['Coupe le poulet en dés et les poivrons en lanières. Fais dorer le poulet 5 min dans l’huile, ajoute les poivrons et les herbes, puis laisse cuire 6 min. Coupe la mozzarella en dés.'], cheese: '' },
  { id: 'saumon-epinards', title: 'saumon et épinards', items: ['250 g de saumon (frais ou surgelé)', '200 g d’épinards (frais ou surgelés)', '1/2 citron', 'Quelques brins d’aneth'],
    prep: ['Fais tomber les épinards 3 min à la poêle et presse-les pour retirer l’eau. Coupe le saumon en cubes et arrose-le de jus de citron. Cisèle l’aneth.'], cheese: '60 g de fromage râpé' },
  { id: 'thon-tomate', title: 'thon, tomate et moutarde', items: ['2 boîtes de thon au naturel (280 g)', '3 tomates', '2 c. à soupe de moutarde'],
    prep: ['Égoutte et émiette le thon. Tartine le fond de pâte de moutarde. Coupe les tomates en rondelles et laisse-les dégorger 5 min sur du papier absorbant ; elles iront sur le dessus.'], cheese: '60 g d’emmental râpé' },
  { id: 'courgette-chevre', title: 'courgette et chèvre', items: ['2 courgettes', '1 bûche de chèvre (150 g)', 'Quelques feuilles de basilic', '1 c. à soupe d’huile d’olive'],
    prep: ['Coupe les courgettes en fines rondelles et fais-les revenir 8 min dans l’huile pour évaporer leur eau. Coupe le chèvre en rondelles, à poser sur le dessus avant d’enfourner.'] },
  { id: 'poulet-champignons', title: 'poulet et champignons', items: ['250 g de blanc de poulet', '250 g de champignons de Paris', '1 oignon', '1 c. à soupe de persil', '1 noix de beurre'],
    prep: ['Émince l’oignon et les champignons. Fais-les revenir au beurre 8 min jusqu’à évaporation de l’eau. Ajoute le poulet en dés et cuis 5 min. Parsème de persil.'], cheese: '50 g de fromage râpé' },
  { id: 'brocoli-saumon', title: 'brocoli, saumon et fromage', items: ['250 g de bouquets de brocoli', '200 g de saumon', '1/2 citron', 'Aneth'],
    prep: ['Fais cuire le brocoli 5 min à l’eau bouillante salée, égoutte-le bien. Coupe le saumon en dés et arrose-le de citron.'], cheese: '80 g de fromage râpé' },
  { id: 'pdt-oignons-poulet', title: 'pommes de terre, oignons et poulet', items: ['400 g de pommes de terre', '2 oignons', '200 g de poulet cuit', '1 noix de beurre'],
    prep: ['Épluche et coupe les pommes de terre en fines rondelles, cuis-les 10 min à l’eau salée. Fais fondre les oignons émincés au beurre 10 min. Effiloche le poulet.'], cheese: '80 g de fromage râpé', cook: 40 },
  { id: 'epinards-feta', title: 'épinards, feta et tomates cerises', items: ['250 g d’épinards', '150 g de feta', '12 tomates cerises', 'Quelques feuilles de basilic'],
    prep: ['Fais tomber les épinards, presse-les bien. Émiette la feta et coupe les tomates cerises en deux (côté coupé vers le haut sur la quiche).'] },
  { id: 'thon-poireaux', title: 'thon, poireaux et emmental', items: ['2 poireaux', '2 boîtes de thon au naturel (280 g)', '1 noix de beurre'],
    prep: ['Émince finement les poireaux (le blanc et un peu de vert), fais-les fondre 15 min au beurre à feu doux. Égoutte et émiette le thon.'], cheese: '80 g d’emmental râpé' },
  { id: 'courgette-tomate-mozza', title: 'courgette, tomate et mozzarella', items: ['1 courgette', '2 tomates', '1 boule de mozzarella', 'Basilic'],
    prep: ['Coupe la courgette et les tomates en rondelles, la mozzarella en tranches. Dispose-les en rosace en alternant après avoir versé l’appareil.'] },
  { id: 'poulet-curry-courgette', title: 'poulet curry et courgette', items: ['250 g de poulet', '1 courgette', '2 c. à café de curry', '1 c. à soupe d’huile'],
    prep: ['Coupe poulet et courgette en dés. Fais-les revenir 8 min dans l’huile avec le curry. Ajoute 1 c. à café de curry dans l’appareil.'], cheese: '50 g de fromage râpé', origin: 'asiatique' },
  { id: 'champignons-chevre', title: 'champignons, chèvre et oignons', items: ['300 g de champignons', '2 oignons', '1 bûche de chèvre (150 g)', 'Quelques brins de thym'],
    prep: ['Fais fondre les oignons émincés 8 min, ajoute les champignons en lamelles et le thym, cuis jusqu’à évaporation. Tranche le chèvre.'] },
  { id: 'saumon-poireaux', title: 'saumon et poireaux', items: ['2 poireaux', '250 g de saumon', 'Aneth', '1 noix de beurre'],
    prep: ['Fais fondre les poireaux émincés 15 min au beurre. Coupe le saumon en cubes. Cisèle l’aneth et ajoute-le à l’appareil.'], cheese: '50 g de fromage râpé' },
  { id: 'aubergine-feta', title: 'aubergine, tomate et feta', items: ['1 aubergine', '2 tomates', '150 g de feta', '2 c. à soupe d’huile d’olive', 'Basilic'],
    prep: ['Coupe l’aubergine en rondelles, badigeonne-les d’huile et fais-les rôtir 15 min au four. Tranche les tomates, émiette la feta.'], origin: 'mediterraneenne' },
  { id: '3-fromages', title: '3 fromages (chèvre, mozzarella, emmental)', items: ['100 g de chèvre', '1 boule de mozzarella', '1 c. à café d’herbes de Provence'],
    prep: ['Coupe le chèvre et la mozzarella en morceaux. Ajoute les herbes à l’appareil.'], cheese: '80 g d’emmental râpé' },
  { id: 'poireaux-lardons', title: 'poireaux et lardons', season: 'automne', items: ['3 poireaux', '150 g de lardons', '1 noix de beurre'],
    prep: ['Fais dorer les lardons à sec et égoutte-les. Fais fondre les poireaux émincés au beurre 15 min.'], cheese: '60 g de gruyère râpé' },
  { id: 'potimarron-chevre', title: 'potimarron et chèvre', season: 'automne', items: ['500 g de potimarron (avec la peau)', '1 bûche de chèvre (150 g)', '1 c. à soupe de miel', 'Thym'],
    prep: ['Coupe le potimarron en dés et fais-le rôtir 20 min au four avec un filet d’huile et le thym, ou cuis-le 12 min à la vapeur. Tranche le chèvre et arrose-le de miel avant d’enfourner.'] },
];

const MINIS: Garnish[] = [
  { id: 'saumon-aneth', title: 'saumon et aneth', items: ['150 g de saumon frais', '1 c. à soupe d’aneth ciselé', '1/2 citron (zeste)'], prep: ['Coupe le saumon en petits dés, mélange avec l’aneth et le zeste de citron.'] },
  { id: 'jambon-fromage', title: 'jambon et fromage', items: ['3 tranches de jambon'], prep: ['Coupe le jambon en petits carrés.'], cheese: '80 g d’emmental râpé' },
  { id: 'chevre-tomates', title: 'chèvre et tomates', items: ['100 g de chèvre', '12 tomates cerises', 'Basilic'], prep: ['Coupe les tomates cerises en deux et le chèvre en petits morceaux.'] },
  { id: 'lorraine', title: 'lorraines', items: ['150 g de lardons'], prep: ['Fais dorer les lardons à sec 5 min et égoutte-les sur du papier absorbant.'], cheese: '60 g de gruyère râpé' },
  { id: 'chorizo-poivrons', title: 'chorizo et poivrons', items: ['80 g de chorizo', '1 poivron rouge'], prep: ['Coupe le chorizo en petits dés, le poivron en brunoise ; fais revenir le poivron 5 min.'], origin: 'mediterraneenne' },
  { id: 'epinards-feta', title: 'épinards et feta', items: ['150 g d’épinards', '100 g de feta'], prep: ['Fais tomber les épinards, presse-les, hache-les grossièrement ; émiette la feta.'], origin: 'mediterraneenne' },
  { id: 'poulet-champignons', title: 'poulet et champignons', items: ['150 g de poulet', '150 g de champignons'], prep: ['Fais revenir les champignons émincés jusqu’à évaporation, ajoute le poulet en petits dés et cuis 4 min.'] },
  { id: 'saumon-fume-poireaux', title: 'saumon fumé et poireaux', items: ['1 poireau', '3 tranches de saumon fumé'], prep: ['Fais fondre le poireau émincé 10 min ; coupe le saumon fumé en lanières.'] },
  { id: 'jambon-sec-parmesan', title: 'jambon sec et parmesan', items: ['4 tranches de jambon sec'], prep: ['Déchire le jambon sec en morceaux, à poser sur le dessus à mi-cuisson pour qu’il reste moelleux.'], cheese: '50 g de parmesan râpé', origin: 'italienne' },
  { id: 'champignons-emmental', title: 'champignons et emmental', items: ['200 g de champignons', '1 échalote'], prep: ['Fais revenir l’échalote et les champignons hachés jusqu’à évaporation.'], cheese: '80 g d’emmental râpé' },
  { id: 'thon-tomate-olives', title: 'thon, tomate et olives', items: ['1 boîte de thon (140 g)', '8 tomates cerises', '10 olives noires'], prep: ['Émiette le thon, coupe les tomates en quatre et les olives en rondelles.'], origin: 'mediterraneenne' },
  { id: 'chevre-epinards', title: 'chèvre et épinards', items: ['100 g de chèvre frais', '150 g d’épinards'], prep: ['Fais tomber et presse les épinards ; écrase le chèvre à la fourchette.'] },
  { id: 'ratatouille', title: 'ratatouille', items: ['250 g de ratatouille (maison ou en bocal)'], prep: ['Égoutte la ratatouille dans une passoire 10 min pour qu’elle ne détrempe pas la pâte.'], cheese: '50 g de fromage râpé', origin: 'mediterraneenne' },
  { id: 'brocoli-fromage', title: 'brocoli et fromage', items: ['200 g de brocoli'], prep: ['Cuis le brocoli 5 min à l’eau salée, égoutte-le et coupe-le en tout petits bouquets.'], cheese: '80 g de cheddar ou emmental râpé' },
  { id: 'blettes-chevre', title: 'blettes et chèvre', items: ['4 feuilles de blettes', '100 g de chèvre'], prep: ['Émince les feuilles et les côtes de blettes, fais-les revenir 8 min ; émiette le chèvre.'] },
  { id: 'thon-poireaux', title: 'thon et poireaux', items: ['1 poireau', '1 boîte de thon (140 g)'], prep: ['Fais fondre le poireau émincé 10 min, mélange avec le thon émietté.'] },
  { id: 'courgette-menthe', title: 'courgette et menthe', items: ['1 courgette', '6 feuilles de menthe', '80 g de feta'], prep: ['Râpe la courgette, presse-la dans un torchon ; cisèle la menthe, émiette la feta.'], origin: 'mediterraneenne' },
  { id: 'poulet-curry', title: 'poulet au curry', items: ['150 g de poulet', '1 c. à café de curry'], prep: ['Coupe le poulet en petits dés et fais-le dorer 5 min avec le curry.'], origin: 'asiatique' },
  { id: 'poireaux-fromage', title: 'poireaux et fromage', items: ['2 poireaux'], prep: ['Fais fondre les poireaux émincés 12 min au beurre.'], cheese: '80 g de comté râpé' },
  { id: 'saumon-epinards', title: 'saumon et épinards', items: ['120 g de saumon', '100 g d’épinards'], prep: ['Fais tomber les épinards, presse-les ; coupe le saumon en petits dés.'] },
  { id: 'roquefort-noix', title: 'roquefort et noix', items: ['80 g de roquefort', '30 g de cerneaux de noix'], prep: ['Émiette le roquefort et concasse les noix.'] },
  { id: 'champignons-jambon', title: 'champignons et jambon', items: ['150 g de champignons', '2 tranches de jambon'], prep: ['Fais revenir les champignons émincés, ajoute le jambon en dés.'] },
  { id: 'tomate-mozza', title: 'tomate, mozzarella et basilic', items: ['12 tomates cerises', '1 boule de mozzarella', 'Basilic'], prep: ['Coupe les tomates en deux et la mozzarella en dés ; cisèle le basilic.'], origin: 'italienne' },
  { id: 'comte-lardons', title: 'comté et lardons', items: ['120 g de lardons'], prep: ['Fais dorer les lardons à sec et égoutte-les.'], cheese: '80 g de comté râpé' },
  { id: 'chevre-miel-noix', title: 'chèvre, miel et noix', items: ['100 g de chèvre', '1 c. à soupe de miel', '30 g de noix'], prep: ['Coupe le chèvre en petits morceaux, concasse les noix ; arrose d’un filet de miel à la sortie du four.'] },
  { id: 'saumon-fume-aneth', title: 'saumon fumé et aneth', items: ['4 tranches de saumon fumé', '1 c. à soupe d’aneth', '50 g de fromage frais'], prep: ['Coupe le saumon fumé en lanières, mélange le fromage frais à l’appareil avec l’aneth.'] },
  { id: 'chou-fleur-curcuma', title: 'chou-fleur et curcuma', items: ['250 g de chou-fleur', '1 c. à café de curcuma'], prep: ['Cuis le chou-fleur 8 min à l’eau salée, coupe-le en petits bouquets ; ajoute le curcuma à l’appareil.'], cheese: '50 g de fromage râpé' },
  { id: 'bacon-oignon-cheddar', title: 'bacon, oignon et cheddar', items: ['6 tranches de bacon', '1 oignon'], prep: ['Fais dorer l’oignon émincé et le bacon coupé en lanières.'], cheese: '80 g de cheddar râpé' },
  { id: 'artichaut-parmesan', title: 'artichaut et parmesan', items: ['6 cœurs d’artichaut (en bocal)'], prep: ['Égoutte et coupe les cœurs d’artichaut en petits morceaux.'], cheese: '50 g de parmesan râpé', origin: 'italienne' },
  { id: 'crabe-ciboulette', title: 'crabe et ciboulette', items: ['1 boîte de chair de crabe (120 g)', '1 c. à soupe de ciboulette'], prep: ['Égoutte et émiette le crabe, cisèle la ciboulette et ajoute-la à l’appareil.'] },
];

export const QUICHE_RECIPES: CuratedRecipe[] = [...QUICHES.map(quiche), ...MINIS.map(mini)];
