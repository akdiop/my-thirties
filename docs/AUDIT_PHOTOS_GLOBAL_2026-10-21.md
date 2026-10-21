# Audit et intégration photographique — My Thirties

## Couverture des emplacements

| Module | Couverture éditoriale | Politique en absence d'image valide |
|---|---|---|
| Recettes (315) | Toutes les fiches ont une entrée dans `recipePhotoLibrary.ts`. Les 7 premières photographies sont vérifiées et créditées. | Vignette neutre ; aucun plat générique de remplacement. |
| Destinations (30) | Les 30 identifiants ont une page Wikipédia FR et une page EN explicite pour augmenter les chances de récupérer une photographie du **même lieu**. | Vignette beige ; jamais une plage tropicale pour Lisbonne/Porto/autre ville. |
| Défis (37 programmes + 59 suggestions, dont plusieurs archivées) | Règles déterministes à partir des disciplines et intitulés vers 48 thèmes documentaires ; 16 photographies Pexels choisies manuellement en priorité, dont des femmes noires pour les portraits d'activité. | Photo locale d'ambiance du **même** thème lorsque disponible, sinon dégradé du thème. |
| Sport (Pilates, Yoga, Tennis) | Visuels WebP locaux sélectionnés dans la maquette et prioritaires sur Wikipédia. | Dégradé tant qu'aucune photo personnelle n'est fournie. |
| Recettes/destinations enregistrées | Photographie vérifiée reprise de la fiche référencée par `libraryId` / `suggestionId` ; pas de plage ou cuisine générique. | Dégradé / « Ma photo ». |
| Photos personnelles | Toujours prioritaires, inchangées. | Aucun chargement extérieur de photo personnelle. |

**Attention : couverture des fiches ≠ disponibilité des photos.** Les pages encyclopédiques peuvent ne proposer aucune photographie, leur API peut échouer ou l'image peut ne pas passer les filtres anti-cartes / logos. Les 308 recettes encore `pending` ne disposent pas de photo certifiée. Toute affirmation « 315 photos validées » est incorrecte.

## Photographies d'activités ajoutées

Les photos Pexels sont recherchées uniquement dans une liste explicite de sources contrôlées : squat 8846530, planche 6303481, pompes 8770392, course 4760570, marche 6280553, étirements 7746176, danse 7194397, renforcement 5149159, lecture 9051417, langues / prise de notes 7683726, étude 3059749, écriture 8091202, informatique 5905839, planification 8532928, méditation 6957977, respiration 7113566.

- Les **identifiants d'image** et les **liens vers les pages Pexels** sont maintenus ensemble dans `web/src/lib/imageThemes.ts`.
- La ressource affichée doit représenter l'activité réellement mentionnée dans le défi ; ne pas montrer du tennis pour illustrer une séance de course.
- Les photographies de personnes sélectionnées dans cette liste montrent des femmes noires ; les autres thèmes encyclopédiques sont limités aux sujets documentaires/objets et aux paysages.
- La photo d'un défi n'est pas une preuve que l'utilisatrice l'a réalisé.
- L'API Wikipédia est interrogée **une fois** pour les défis, et en deux lots FR/EN pour les destinations ; pas une requête par carte.
- Les licences Pexels doivent être revérifiées pour une distribution commerciale et les crédits photo conservés. Les pages Wikimedia Commons donnent les licences individuelles.

## Contraintes et contrôles pré-déploiement

1. Vérifier sur mobile et ordinateur les miniatures des 30 destinations, en particulier Praia, île de Sal, Lisbonne et Porto.
2. Vérifier l'absence de photo incorrecte, de carte, de logo, de drapeau ou d'image cassée.
3. Vérifier les intitulés/sources/licences et liens de crédit affichés sur les cartes.
4. Vérifier les 96 défis et les trois séances Sport ; contrôler la priorité de « Ma photo ».
5. Vérifier la correspondance des images récupérées pour les recettes enregistrées par `libraryId`.
6. Tester avec réseaux tiers bloqués : l'application doit fonctionner et montrer un fond neutre.
7. Refuser la publication si le build ou les contrôles de qualité échouent.

Les requêtes d'images externes divulguent l'adresse IP du navigateur aux hébergeurs Wikimedia et Pexels ; aucune information de profil ou de santé n'est volontairement transmise à ces services.

## Reste à faire

Sélectionner et contrôler **308 photos de recettes une à une** si une couverture photographique complète est souhaitée, puis renseigner source, photographe, licence et concordance d'ingrédients dans `recipePhotoLibrary.ts`. Cela ne peut pas être automatisé de façon fiable par de simples correspondances de mots sans reproduire les erreurs signalées.
