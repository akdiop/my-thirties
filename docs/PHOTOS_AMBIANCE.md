# Photographies d'ambiance — My Thirties (web/PWA)

## Intention et périmètre

L'interface est plus vivante sans devenir un catalogue de photos. La palette beige, crème et cacao reste la base. Les photos sont limitées aux espaces d'inspiration : **Sport (Pilates, Tennis, Yoga), Cuisine, Voyages/Découvertes, Passions, Challenges, Apprentissage**, et à quelques cartes illustratives pertinentes.

Les écrans de **santé, finances, données personnelles, listes, agenda et formulaires** conservent un fond sobre : ils ne doivent pas être encombrés par des images décoratives.

## Sources des photos sélectionnées

Les images sont des photos d'ambiance de Pexels, marquées « Free to use » sur les pages sources au moment de la sélection. Elles ne représentent pas l'utilisatrice ni ses données personnelles.

| Emplacement | Sujet | Source |
|---|---|---|
| Pilates | Femme noire sur un tapis | https://www.pexels.com/photo/crop-black-woman-doing-phalakasana-exercise-6303481/ |
| Yoga | Femme noire pratiquant le yoga | https://www.pexels.com/photo/black-sportswoman-doing-yoga-on-mat-in-studio-6303431/ |
| Tennis | Joueuse noire sur un court | https://www.pexels.com/photo/woman-jumping-and-playing-tennis-19349790/ |
| Cuisine | Préparation d'un repas dans une cuisine | https://www.pexels.com/photo/woman-cooking-food-at-home-kitchen-12911570/ |
| Quiche (illustration de type de plat) | Quiche maison | https://www.pexels.com/photo/delicious-homemade-quiche-with-crispy-crust-34318142/ |
| Pâtes (illustration de type de plat) | Pâtes et tomates | https://www.pexels.com/photo/bowl-with-pasta-and-tomatoes-17804216/ |
| Voyage (photo d'ambiance) | Rue de Lisbonne | https://www.pexels.com/photo/people-at-the-street-1753121/ |
| Dakar | Rue à Dakar | https://www.pexels.com/photo/vibrant-urban-scene-in-dakar-senegal-33432833/ |
| Lisbonne | Rue de Lisbonne | https://www.pexels.com/photo/colorful-architectural-street-in-lisbon-35435858/ |
| Passions | Femme noire lisant | https://www.pexels.com/photo/woman-reading-a-book-5311633/ |
| Apprentissage | Femme noire étudiant | https://www.pexels.com/photo/a-woman-writing-in-notebook-looking-the-laptop-7584771/ |
| Créativité | Artiste peignant sur toile | https://www.pexels.com/photo/a-woman-painting-on-a-canvas-inside-her-workshop-5033997/ |
| Challenges | Étirements sur tapis | https://www.pexels.com/photo/fit-black-woman-stretching-body-on-mat-6303446/ |

## Fonctionnement

- **Priorité absolue aux photos personnelles** déjà choisies via « Ma photo ». Elles ne sont ni supprimées ni remplacées.
- Pour les destinations, n'utiliser une photo de ville que si elle correspond réellement à la destination ; sinon garder le fond neutre.
- Pour les recettes, les photos ne sont que des illustrations du type de plat (quiche/pâtes), pas des images contractuelles de la recette.
- Les images sont chargées depuis **images.pexels.com**, un service externe. Le navigateur contacte donc ce service lors du chargement ; ces fichiers ne sont pas stockés dans Supabase. Pour une version totalement hors-ligne / sans requêtes tierces, il faudra télécharger et héberger des versions optimisées dans le dépôt après vérification des droits.
- L'interface conserve des fonds de repli et du texte lisible si les images ne se chargent pas. L'intégration ne change pas les données métier.

## À vérifier avant fusion

Rendu mobile et desktop, contraste, crop des images, affichage hors-ligne, chargement des URLs, absence de modification des photos personnelles, respect de la licence Pexels.
