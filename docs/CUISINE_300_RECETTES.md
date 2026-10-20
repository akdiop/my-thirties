# Bibliothèque Cuisine — 300 recettes

La bibliothèque contient **50 recettes par catégorie** : petit-déjeuner, déjeuner, dîner, casse-croûte, smoothie et shot.

- Adaptée aux goûts déclarés : sans porc, avocat, papaye, fruits de mer, poissons à nombreuses arêtes, amandes, noix, chou blanc, beurre et mayonnaise.
- Les **pois chiches** et le **lait de coco** sont autorisés.
- Chaque recette a un titre, des ingrédients quantifiés, un nombre de portions, des étapes, une durée et des indications générales de conservation.
- Les recettes sont des propositions culinaires, pas des prescriptions nutritionnelles. Les shots ne revendiquent aucun effet « détox ».
- Dans l'app native, les recettes sont proposées dans la bibliothèque, filtrées par catégorie, et peuvent être importées dans « Mes recettes » ; leurs quantités sont ensuite ajustables via la fiche.
- Dans le web/PWA, elles sont filtrables et recherchables, avec import manuel dans les recettes du compte.
- Les données sources existent dans `src/cuisine/*Recipes.ts` et `web/src/recipes/*Recipes.ts`. Les deux copies doivent rester synchronisées jusqu'à la mise en place d'un module partagé indépendant d'Expo.

## Validation avant déploiement

Vérifier la compilation web et native, les tests, l'import et la déduplication, les quantités dans les courses, la navigation et le rendu sur iPhone. Ne pas fusionner sans CI verte.
