# Bibliothèque de photos vérifiées — Cuisine (web/PWA)

## Périmètre

Le catalogue `web/src/recipes/recipePhotoLibrary.ts` couvre **315 recettes sur 315**, par identifiant stable, avec titre et statut éditorial.

- **10 recettes avec photo documentée** (source, auteur, licence et concordance des ingrédients principaux) :
  - `mt-lunch-3` — **Yassa de poulet aux olives** : [Poulet Yassa.JPG](https://commons.wikimedia.org/wiki/File:Poulet_Yassa.JPG), Kinesira, CC BY-SA 4.0. La légende Commons indique poulet, olives, oignons, moutarde, citron et riz.
  - `mt-guide-focaccia` — **Focaccia aux herbes** : [Pain Focaccia au romarin.jpg](https://commons.wikimedia.org/wiki/File:Pain_Focaccia_au_romarin.jpg), Jeangagnon, CC BY-SA 4.0. Le descriptif indique romarin et huile d'olive.
  - `mt-guide-crepes` — **Crêpes maison** : [Crepes.jpg](https://commons.wikimedia.org/wiki/File:Crepes.jpg), Nicolas Delerue, CC BY-SA 2.5.
  - `mt-breakfast-11` — **Pancakes banane avoine** : [Banana Pancakes Pk021.jpg](https://commons.wikimedia.org/wiki/File:Banana_Pancakes_Pk021.jpg), PallaviKhale, CC BY-SA 4.0 ; description explicite avoine et bananes.
  - `mt-lunch-41` — **Lasagnes bœuf** : [Beef Lasagna - The Mad Hatter.jpg](https://commons.wikimedia.org/wiki/File:Beef_Lasagna_-_The_Mad_Hatter.jpg), Andy Li, CC0 1.0.
  - `mt-dinner-46` — **Risotto champignons** : [Mushroom risotto (3990739885).jpg](https://commons.wikimedia.org/wiki/File:Mushroom_risotto_(3990739885).jpg), Karen and Brad Emerson, CC BY 2.0.
  - `mt-snack-36` — **Cookies maison chocolat noir** : [Chocolate chip cookies.jpg](https://commons.wikimedia.org/wiki/File:Chocolate_chip_cookies.jpg), Rdsmith4, CC BY-SA 2.5. Le type exact de chocolat n’est pas attesté.
  - `mt-guide-pitas` — **Pains pita à la poêle** : [Pita Bread.jpg](https://commons.wikimedia.org/wiki/File:Pita_Bread.jpg), Azure Dragon of the East, CC BY-SA 3.0.
  - `mt-guide-cake-citron` — **Cake citron et huile d’olive** : [Lemon olive oil cake - 3300260329.jpg](https://commons.wikimedia.org/wiki/File:Lemon_olive_oil_cake_-_3300260329.jpg), stu_spivack, CC BY-SA 2.0.
  - `mt-guide-sauce-tomate` — **Sauce tomate maison polyvalente** : [Homemade tomato sauce.jpg](https://commons.wikimedia.org/wiki/File:Homemade_tomato_sauce.jpg), Michael Hoy, CC BY 2.0. La photographie montre une sauce maison avec carotte et thym supplémentaires.
- **305 recettes en attente de photo fiable**. Leur vignette est volontairement neutre.

Ces photos sont des **illustrations représentatives du type de plat**, pas des photographies de la recette préparée selon les instructions de My Thirties. Aucune photo n'est reprise automatiquement pour toutes les variantes d'un même plat.

## Règles de validation (recette par recette)

1. Vérifier le titre et la liste d'ingrédients de la recette dans `web/src/recipes/`.
2. Trouver une photographie montrant le bon plat et, autant que possible, ses ingrédients distinctifs. Ne pas assimiler une variante aux olives à une variante aux carottes, une quiche avec pâte à une quiche sans pâte, etc.
3. Vérifier la page de fichier Wikimedia Commons : sujet, auteur, licence, conditions d'attribution et possibilité de réutilisation. Refuser les images ambiguës, montages, dessins, cartes et images non documentées.
4. Renseigner uniquement **l'entrée correspondante** de `RECIPE_PHOTO_LIBRARY` : `status: 'verified'`, `file`, `author`, `license`, `licenseUrl` et `note` justifiant la concordance. Laisser `status: 'pending'` si doute.
5. Contrôler visuellement la miniature sur mobile et desktop. Les crédits source, auteur et licence doivent rester visibles.
6. Contrôler que chaque identifiant de `PERSONALIZED_RECIPES` figure une seule fois dans le catalogue ; ne jamais copier la même image sur plusieurs recettes par simple similarité de mots.

## Fonctionnement technique

Le hook `useVerifiedRecipePhotos` appelle uniquement l'API Wikimedia Commons pour les **fichiers explicitement approuvés** dans le catalogue. Les autres recettes ne déclenchent aucune recherche d'image automatique. La fonction de recherche Unsplash par mot-clé et les correspondances Wikipédia approximatives ne sont plus utilisées pour les cartes de recettes.

Les miniatures sont fournies par Wikimedia Commons et non stockées dans la base personnelle. La licence et le lien vers la page du fichier sont affichés avec la photo. L'adresse IP du navigateur reste visible au serveur Wikimedia Commons lors du chargement.

## À faire avant d'atteindre une couverture complète

**305 recherches et validations éditoriales individuelles restent nécessaires**. Ne pas déclarer « toutes les recettes illustrées » avant cette revue. Les photos d'utilisatrice et les galeries personnelles restent indépendantes de cette bibliothèque.
