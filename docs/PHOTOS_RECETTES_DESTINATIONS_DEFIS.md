# Photos de l'app web

- **Visuels de la maquette (hébergés dans `web/public/visuels`)** : Pilates, Yoga, Tennis, Cuisine, Voyages,
  Bien-être, Organisation. Utilisés pour le sport, les défis, les bannières de module et en secours partout.
  Cadrage par image dans `web/src/lib/visuals.ts` pour garder le visage entier.
- **Recettes** : chaque recette est rattachée à son plat (porridge, omelette, yassa, mafé, smoothie…) dans
  `web/src/lib/editorialPhotos.ts` ; la carte affiche la photo principale de la page Wikipédia du plat.
  Sans photo disponible, le visuel Cuisine local est affiché.
- **Destinations** : photo principale de la page Wikipédia du lieu, avec lien de crédit Wikimedia Commons ;
  sinon la plage turquoise locale.
- **« Ma photo »** reste toujours prioritaire sur les bannières.

Seuls `fr.wikipedia.org` et `upload.wikimedia.org` sont contactés (recettes et destinations), sans aucune donnée personnelle.
