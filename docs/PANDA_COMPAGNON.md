# Mon panda — compagnon de bien-être (MVP)

## Objectif
Un panda personnel grandit en parallèle des gestes d'attention à soi. Il accompagne sans juger les performances, la santé, l'apparence ou les émotions. Les jours manqués et de repos ne retirent **aucun** progrès.

## Parcours
1. Depuis **Accueil**, **Espaces** ou **Bien-être** (iPhone), ouvrir **Mon panda**.
2. L'adopter et lui choisir un prénom (par défaut « Mochi »).
3. Enregistrer facultativement un geste : **Souffler**, **Me reposer**, **Bouger doucement**, **Créer ou apprendre**. Une fois par type et par jour.
4. Le panda débloque progressivement 5 apparences : **Petit panda**, **Panda curieux**, **Panda explorateur**, **Panda épanoui**, **Panda sage**.
5. Dans **Grandir ensemble**, choisir *facultativement* de tenir compte des dates d'activités déjà enregistrées. Cette option est **désactivée à l'adoption**. Seule la présence d'une entrée/journée est comptée : humeur, contenu du journal, sommeil mesuré et données sensibles ne sont pas lus pour attribuer des points.

## Règles
- Paliers à 0 / 3 / 9 / 18 / 30 petits moments. Les étapes gagnées ne régressent pas.
- Aucune perte d'énergie, de « santé du panda », de série ou de vie. Aucun rappel culpabilisant.
- Pas de mécanisme de récompense lié au poids, aux calories, au nombre de pas ou à l'intensité de l'exercice.
- Les moments de repos comptent au même titre que les autres actions.
- Les activités antérieures au jour d'adoption ne comptent pas.
- Aucune intelligence artificielle ni diagnostic nécessaire à son fonctionnement.

## Implémentation et confidentialité
- **Web/PWA** : une entrée Supabase de type `panda-companion`, associée au module existant `equilibre`, sous le compte connecté. Les entrées du panda sont exclues des listes ordinaires et des journaux. La progression est calculée localement par le navigateur à partir des moments et, si l'option est activée, des **dates** d'autres entrées.
- **iPhone (Expo)** : préférences dans la base locale chiffrée existante (clé `panda`), sans nouvelle migration. Les dates du suivi d'humeur, du sommeil, de gratitude et du journal émotionnel ne sont consultées que lors du calcul opt-in. Le stockage existant et ses sauvegardes continuent de s'appliquer.
- **Important** : les états du panda web et iPhone sont **distincts** pour ce MVP. Ils ne se synchronisent pas automatiquement. Une synchronisation inter-appareils demanderait un développement et une revue de confidentialité spécifiques.
- Portraits : illustrations vectorielles dessinées dans les composants ; pas de service externe, photo personnelle ou pisteur.

## Vérifications avant publication
- Sur iPhone et web : adopter, renommer, ouvrir depuis les trois raccourcis, noter un geste, revenir le lendemain, atteindre un palier, vérifier le repos.
- Tester l'activation et la désactivation des liens après avoir atteint une étape : pas de régression.
- Vérifier le stockage après fermeture/redémarrage, l'accès sécurisé au compte et les contrastes en mode sombre.
- Exécuter le build web, le typecheck et les tests Jest. Ne pas fusionner ou déployer sans validation.
