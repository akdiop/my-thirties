import type { CuratedRecipe } from './types';
/** Recettes originales inspirées des familles de plats du guide personnel ; aucune transcription du document. */
export const GUIDE_INSPIRED_RECIPES: CuratedRecipe[] = [
  {
    "id": "mt-guide-pain-maison",
    "title": "Pain maison au four",
    "category": "boulangerie",
    "origin": "francaise",
    "servings": 6,
    "prepMin": 20,
    "cookMin": 30,
    "ingredients": "500 g farine;320 ml eau tiède;7 g levure boulangère sèche;8 g sel;1 c. à s. huile d’olive",
    "steps": [
      "Mélanger la levure et l’eau, puis ajouter farine, sel et huile.",
      "Pétrir jusqu’à obtenir une pâte souple, couvrir et laisser lever environ une heure.",
      "Former un pain, laisser reposer encore 30 minutes puis inciser le dessus.",
      "Cuire au four préchauffé à 220 °C pendant 25 à 30 minutes, jusqu’à cuisson complète."
    ],
    "storage": "Conserver dans un torchon propre un à deux jours ou congeler en tranches."
  },
  {
    "id": "mt-guide-focaccia",
    "title": "Focaccia aux herbes",
    "category": "boulangerie",
    "origin": "italienne",
    "servings": 6,
    "prepMin": 20,
    "cookMin": 25,
    "ingredients": "400 g farine;300 ml eau;6 g levure sèche;3 c. à s. huile d’olive;1 c. à c. sel;1 c. à c. romarin",
    "steps": [
      "Mélanger farine, levure, eau et sel pour obtenir une pâte collante.",
      "Laisser lever jusqu’à ce que la pâte ait gonflé, puis l’étaler dans un moule huilé.",
      "Faire de petites empreintes avec les doigts, arroser d’huile et parsemer de romarin.",
      "Cuire à 210 °C environ 25 minutes, jusqu’à ce que la focaccia soit dorée."
    ],
    "storage": "À déguster le jour même ou à congeler une fois refroidie."
  },
  {
    "id": "mt-guide-pitas",
    "title": "Pains pita à la poêle",
    "category": "boulangerie",
    "origin": "mediterraneenne",
    "servings": 6,
    "prepMin": 20,
    "cookMin": 15,
    "ingredients": "350 g farine;210 ml eau tiède;5 g levure sèche;1 c. à c. sel;1 c. à s. huile d’olive",
    "steps": [
      "Mélanger les ingrédients et pétrir quelques minutes.",
      "Laisser reposer la pâte une heure, puis la diviser en six boules.",
      "Étaler chaque boule en disque fin et laisser reposer dix minutes.",
      "Cuire dans une poêle bien chaude deux à trois minutes de chaque côté."
    ],
    "storage": "Conserver au frais et réchauffer à la poêle; congélation possible."
  },
  {
    "id": "mt-guide-naan-yaourt",
    "title": "Naan au yaourt",
    "category": "boulangerie",
    "origin": "asiatique",
    "servings": 6,
    "prepMin": 20,
    "cookMin": 15,
    "ingredients": "350 g farine;200 g yaourt nature;1 c. à c. levure chimique;2 c. à s. huile d’olive;1 pincée sel;60 ml eau",
    "steps": [
      "Mélanger farine, levure, sel et yaourt puis ajouter l’eau progressivement.",
      "Pétrir jusqu’à obtenir une pâte souple et laisser reposer 20 minutes.",
      "Diviser en six et étaler chaque portion en ovale.",
      "Cuire à la poêle chaude jusqu’à apparition de taches dorées de chaque côté."
    ],
    "storage": "Conserver dans une boîte fermée au réfrigérateur et réchauffer avant de servir."
  },
  {
    "id": "mt-guide-pain-mie",
    "title": "Pain de mie maison",
    "category": "boulangerie",
    "origin": "francaise",
    "servings": 8,
    "prepMin": 25,
    "cookMin": 35,
    "ingredients": "500 g farine;280 ml lait;7 g levure sèche;2 c. à s. huile neutre;1 c. à c. sel;1 c. à c. sucre",
    "steps": [
      "Mélanger la levure avec le lait tiède et le sucre.",
      "Ajouter farine, huile et sel puis pétrir pour obtenir une pâte lisse.",
      "Laisser lever, dégazer et placer dans un moule à cake légèrement huilé.",
      "Après une seconde levée, cuire à 180 °C environ 35 minutes."
    ],
    "storage": "Congeler en tranches pour préparer des tartines à la demande."
  },
  {
    "id": "mt-guide-flan-vanille",
    "title": "Flan vanille sans pâte",
    "category": "dessert",
    "origin": "francaise",
    "servings": 8,
    "prepMin": 15,
    "cookMin": 40,
    "ingredients": "800 ml lait;3 œufs;80 g sucre;70 g fécule de maïs;1 c. à c. vanille",
    "steps": [
      "Préchauffer le four à 180 °C et préparer un moule.",
      "Fouetter œufs, sucre et fécule, puis ajouter le lait chaud progressivement.",
      "Remettre dans la casserole et remuer sur feu doux jusqu’à léger épaississement.",
      "Verser dans le moule et cuire 35 à 40 minutes, puis laisser refroidir et réfrigérer."
    ],
    "storage": "Conserver au réfrigérateur et consommer dans les deux à trois jours."
  },
  {
    "id": "mt-guide-clafoutis-pomme",
    "title": "Clafoutis pommes et cannelle",
    "category": "dessert",
    "origin": "francaise",
    "servings": 6,
    "prepMin": 15,
    "cookMin": 35,
    "ingredients": "3 pommes;3 œufs;250 ml lait;80 g farine;50 g sucre;1 pincée cannelle",
    "steps": [
      "Préchauffer le four à 180 °C et couper les pommes en quartiers fins.",
      "Fouetter œufs, lait, farine, sucre et cannelle jusqu’à obtenir une pâte homogène.",
      "Disposer les pommes dans un plat légèrement huilé puis verser la préparation.",
      "Cuire 30 à 35 minutes jusqu’à ce que le centre soit pris."
    ],
    "storage": "Conserver au frais deux jours."
  },
  {
    "id": "mt-guide-cake-citron",
    "title": "Cake citron et huile d’olive",
    "category": "dessert",
    "origin": "francaise",
    "servings": 8,
    "prepMin": 15,
    "cookMin": 40,
    "ingredients": "200 g farine;3 œufs;100 g yaourt nature;80 ml huile d’olive douce;80 g sucre;1 citron;8 g levure chimique",
    "steps": [
      "Préchauffer le four à 175 °C.",
      "Fouetter les œufs et le sucre, ajouter yaourt, huile, jus et zeste du citron.",
      "Incorporer farine et levure sans trop travailler la pâte.",
      "Verser dans un moule à cake et cuire 35 à 40 minutes; vérifier la cuisson."
    ],
    "storage": "Conserver deux jours à couvert ou congeler en tranches."
  },
  {
    "id": "mt-guide-crepes",
    "title": "Crêpes maison",
    "category": "dessert",
    "origin": "francaise",
    "servings": 8,
    "prepMin": 10,
    "cookMin": 20,
    "ingredients": "250 g farine;3 œufs;500 ml lait;1 c. à s. huile neutre;1 pincée sel;1 c. à c. vanille",
    "steps": [
      "Mélanger farine et sel puis incorporer les œufs.",
      "Ajouter le lait progressivement en fouettant pour éviter les grumeaux.",
      "Laisser reposer la pâte 20 minutes si possible.",
      "Cuire une fine couche de pâte dans une poêle légèrement huilée et retourner quand les bords se décollent."
    ],
    "storage": "Conserver les crêpes cuites au réfrigérateur deux jours."
  },
  {
    "id": "mt-guide-compote-pomme-mangue",
    "title": "Compote pomme et mangue",
    "category": "dessert",
    "origin": "maison",
    "servings": 6,
    "prepMin": 10,
    "cookMin": 20,
    "ingredients": "4 pommes;1 mangue;100 ml eau;1 c. à s. jus de citron;1 pincée cannelle",
    "steps": [
      "Éplucher les pommes et les couper en petits morceaux.",
      "Faire mijoter les pommes avec l’eau et le citron pendant dix minutes.",
      "Ajouter la mangue en morceaux et poursuivre la cuisson jusqu’à tendreté.",
      "Écraser à la fourchette ou mixer selon la texture souhaitée."
    ],
    "storage": "Conserver au réfrigérateur dans un récipient propre, deux à trois jours."
  },
  {
    "id": "mt-guide-sauce-tomate",
    "title": "Sauce tomate maison polyvalente",
    "category": "base-maison",
    "origin": "mediterraneenne",
    "servings": 6,
    "prepMin": 15,
    "cookMin": 30,
    "ingredients": "700 g tomates concassées;1 oignon;2 gousses ail;2 c. à s. huile d’olive;1 c. à c. origan;1 pincée sel",
    "steps": [
      "Émincer l’oignon et l’ail.",
      "Faire revenir doucement dans l’huile jusqu’à ce que l’oignon soit translucide.",
      "Ajouter tomates, origan et sel, puis laisser mijoter 25 à 30 minutes.",
      "Mixer si une texture lisse est souhaitée; utiliser pour pâtes, pizzas ou gratins."
    ],
    "storage": "Réfrigérer rapidement; congeler en petites portions."
  },
  {
    "id": "mt-guide-bechamel-huile",
    "title": "Béchamel à l’huile d’olive",
    "category": "base-maison",
    "origin": "francaise",
    "servings": 4,
    "prepMin": 10,
    "cookMin": 10,
    "ingredients": "500 ml lait;40 g farine;3 c. à s. huile d’olive;1 pincée muscade;1 pincée sel",
    "steps": [
      "Chauffer l’huile dans une casserole à feu moyen.",
      "Ajouter la farine et mélanger une minute sans laisser colorer.",
      "Verser le lait progressivement en fouettant pour obtenir une sauce lisse.",
      "Laisser épaissir à feu doux et assaisonner avec sel et muscade."
    ],
    "storage": "Utiliser rapidement ou conserver au réfrigérateur un à deux jours."
  },
  {
    "id": "mt-guide-pate-brisee",
    "title": "Pâte brisée à l’huile",
    "category": "base-maison",
    "origin": "francaise",
    "servings": 6,
    "prepMin": 15,
    "cookMin": 30,
    "ingredients": "250 g farine;70 ml huile d’olive douce;90 ml eau froide;1 pincée sel",
    "steps": [
      "Mélanger farine et sel.",
      "Ajouter l’huile puis l’eau progressivement pour former une boule souple.",
      "Laisser reposer au frais une vingtaine de minutes.",
      "Étaler, foncer un moule et garnir; cuire selon la recette de quiche ou tarte choisie."
    ],
    "storage": "À utiliser le jour même ou à conserver au frais jusqu’au lendemain."
  },
  {
    "id": "mt-guide-pate-pizza",
    "title": "Pâte à pizza maison",
    "category": "base-maison",
    "origin": "italienne",
    "servings": 4,
    "prepMin": 20,
    "cookMin": 15,
    "ingredients": "400 g farine;250 ml eau tiède;6 g levure sèche;2 c. à s. huile d’olive;1 c. à c. sel",
    "steps": [
      "Mélanger farine, levure et eau puis ajouter huile et sel.",
      "Pétrir jusqu’à obtenir une pâte élastique et laisser lever une heure.",
      "Diviser la pâte et étaler chaque portion sur une plaque.",
      "Garnir selon les envies et cuire dans un four très chaud jusqu’à ce que la pâte soit cuite."
    ],
    "storage": "Congeler les pâtons avant garniture."
  },
  {
    "id": "mt-guide-sauce-yaourt",
    "title": "Sauce yaourt aux herbes",
    "category": "base-maison",
    "origin": "mediterraneenne",
    "servings": 4,
    "prepMin": 10,
    "cookMin": 0,
    "ingredients": "200 g yaourt nature;1 c. à s. jus de citron;1 gousse ail;1 c. à s. persil;1 pincée sel",
    "steps": [
      "Écraser l’ail et hacher le persil.",
      "Mélanger le yaourt, le citron, l’ail et les herbes.",
      "Assaisonner et ajuster l’acidité au goût.",
      "Servir avec wraps, crudités, pommes de terre ou sandwichs."
    ],
    "storage": "Conserver au réfrigérateur et consommer rapidement."
  }
];
