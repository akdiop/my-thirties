# Actions personnelles hors Supabase et Vercel

Ces étapes concernent My Thirties uniquement. Elles n'impliquent aucune modification de SaxalWér.

## Maintenant

1. Ouvrir la PR de développement : https://github.com/akdiop/my-thirties/pull/3. Vérifier que les contrôles GitHub sont verts. Ne pas fusionner avant les essais et la revue de sécurité.
2. Décider si un assistant IA externe est souhaité. Si oui, choisir un fournisseur, créer son propre compte API, définir un plafond de dépenses, conserver la clé dans un gestionnaire de mots de passe. Ne jamais l'envoyer par messagerie ni la mettre dans le dépôt GitHub.
3. Choisir si l'agenda peut être partagé ponctuellement avec l'IA. Par défaut : aucun partage. Les rendez-vous médicaux et les autres espaces sont exclus de la sélection automatique.
4. Choisir une méthode de calcul des prières et comparer les horaires avec une référence locale avant de s'y fier.
5. Préparer une ou deux vidéos personnelles de test, prises avec consentement des personnes filmées, sans données intimes, puis tester les points de posture sur iPhone lorsque l'application sera accessible. Il ne s'agit pas encore d'un outil d'évaluation technique.
6. Si une application iOS native est souhaitée en plus du raccourci web, prévoir un Mac avec Xcode et un iPhone de test, ou un service de compilation iOS compatible. Le code natif utilise SQLCipher et ne fonctionne pas dans Expo Go.
7. Lorsqu'une version HTTPS de My Thirties est disponible sur Safari iPhone : se connecter, ouvrir Profil > Mes intégrations et consentements, activer seulement les services souhaités, puis tester chaque fonctionnalité avec des données fictives.
8. Pour ajouter le site à l'écran d'accueil : Safari > Partager > Sur l'écran d'accueil > Ajouter.
9. Pour les calendriers : exporter volontairement un fichier .ics depuis l'agenda, l'importer dans l'application calendrier choisie, vérifier les heures et supprimer les copies non nécessaires. Ce n'est pas une synchronisation bidirectionnelle.
10. Tester un export chiffré et sa restauration avec des données fictives avant de saisir de vraies données.

## Pas encore possible

- Activer une synchronisation automatique iOS/web : le modèle commun, le moteur réseau, les suppressions, la persistance de file d'attente chiffrée et les tests de conflits doivent encore être intégrés.
- Recevoir des rappels web fiables en arrière-plan sur iPhone sans configuration push.
- Utiliser l'assistant IA avant le déploiement de sa fonction serveur.
- Installer l'application web avant qu'une version HTTPS accessible soit disponible.

## Protection des données

Ne pas saisir de données médicales, financières ou intimes réelles avant audit de sécurité et vérification du compte propriétaire, des autorisations et des règles d'accès. Le centre de consentement enregistre les préférences localement par navigateur ; sa révocation n'efface pas les données déjà envoyées à un tiers.
