# Photos des recettes, destinations et défis (web/PWA)

Cette évolution complète la branche des visuels validés (`claude/visuels-maquette`) sans modifier les données utilisateur.

- **315 recettes :** une photo illustrative par carte. Le choix est basé sur le nom du plat (quiche, pâtes, salade, gâteau, pain, etc.), puis sur sa catégorie. Si aucune correspondance n'est fiable, la photo générale de cuisine est utilisée. **Il ne s'agit pas d'une photographie de la recette exacte.**
- **30 destinations :** chargement groupé des miniatures de pages Wikipédia françaises correspondant à des titres de lieux explicitement configurés. Le titre de la page est contrôlé avant de l'associer à une destination ; si aucune photo n'est disponible ou si l'appel échoue, un **fond neutre** est affiché : aucun paysage d'une autre destination ne doit être présenté comme celui de la ville. Les images de type carte, drapeau et logo sont écartées. Chaque photo Wikimedia possède un lien vers sa page de crédit/licence.
- **Défis existants :** photographies selon la discipline et le thème, y compris les parcours de lecture, créativité et apprentissage. La priorité est toujours donnée à « Ma photo ».

## Limites et confidentialité

Les images d'ambiance de recettes et de certains défis sont chargées depuis **images.pexels.com**. Les images de destinations et leur métadonnées sont chargées depuis **fr.wikipedia.org** et **upload.wikimedia.org**. Ces services tiers reçoivent des requêtes de navigateur ; aucune donnée privée du journal, du compte, du budget ou de la santé n'est transmise dans ces requêtes, mais l'adresse IP du navigateur peut être visible.

Les images locales de la maquette (web/public/visuels) servent d'ambiance pour les rubriques, **jamais** de repli pour une destination précise. La version iPhone native n'est pas modifiée ici. Les visuels peuvent être hébergés localement après sélection et revue des droits pour éliminer les appels à des tiers.

## Contrôles avant fusion

- Vérifier le rendu et les droits/licences des photos Wikimedia, en particulier les obligations d'attribution propres à chaque fichier.
- Vérifier le chargement des images Pexels et le contraste des cartes sur mobile.
- Vérifier qu'une photo de destination ne présente jamais un lieu différent comme la ville annoncée.
- Tester le chargement sans réseau, la priorité « Ma photo » et la compilation.
- Aucun déploiement ou fusion automatique.
