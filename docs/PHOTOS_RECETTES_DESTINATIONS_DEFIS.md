# Correspondance des images dans My Thirties (web/PWA)

Les photographies associées à un **lieu ou un plat précis** ne doivent jamais montrer un autre lieu ou un autre plat.

- **Recettes** : une photo n'est affichée que si le titre de la recette correspond exactement au titre d'un plat Wikipédia reconnu et si sa page contient une image photographique. Les variantes (« Yassa de poulet aux olives », « Quiche aux épinards »…) n'empruntent pas une photo générique du plat, car elle ne représente pas nécessairement les ingrédients. Sans image correspondante, une vignette beige porte la mention « Photo de … non disponible ». Les photos affichées possèdent un lien vers les crédits et la licence Wikimedia Commons.
- **Destinations** : les photos sont associées aux pages Wikipédia des lieux identifiés ; cartes, drapeaux et logos sont écartés. Si la recherche échoue, un fond neutre remplace l'ancienne plage tropicale répétée sur toutes les destinations.
- **Fiches enregistrées** (recettes, voyages et destinations) : aucune image générique de cuisine ou de plage n'est présentée comme le plat ou le lieu personnellement enregistré. « Ma photo » reste prioritaire lorsqu'une image est ajoutée.
- **Bannières thématiques** (Cuisine, Sport, Voyages, Défis) : les images d'ambiance validées sont conservées lorsqu'elles correspondent au thème. Elles ne doivent pas être interprétées comme des preuves d'une recette réalisée ou d'un voyage effectué.
- **Galerie et profil** : les images ajoutées par l'utilisatrice restent inchangées.

**Limites :** la photographie principale d'un article Wikipédia n'est pas une validation manuelle de la scène représentée. Les correspondances de titres réduisent les erreurs, mais une revue éditoriale reste nécessaire avant d'étendre la couverture. Une partie des 315 recettes n'aura donc pas de photo : mieux vaut un fond neutre qu'une image trompeuse.

**Confidentialité :** le navigateur contacte `fr.wikipedia.org` et `upload.wikimedia.org` pour les images d'articles ; ces services voient les requêtes réseau et l'adresse IP du navigateur, mais aucun champ de profil ou de journal n'est envoyé. Les visuels de maquette sont hébergés dans `web/public/visuels`.

**Avant déploiement :** tester mobile/desktop, l'affichage hors ligne, les images manquantes, les crédits/licences, les photos personnelles et la qualité visuelle des vignettes.
