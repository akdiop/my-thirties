# My Thirties — mise en ligne privée (iPhone + ordinateur)

**Statut : code de la PWA présent sur la branche de développement ; aucun déploiement de production ni connexion à une base Supabase effectués.** La PWA utilise un client web React/Vite indépendant de la base SQLCipher iOS. Elle ne repose donc pas sur `npx expo export --platform web`, qui ne suffit pas à rendre la base et les API natives compatibles.

## 1. Projet Supabase dédié

1. Créer **un nouveau projet Supabase distinct de SaxalWér**.
2. Dans Authentication → Providers, conserver l'authentification par e-mail/mot de passe. **Désactiver l'inscription publique** (Allow new users to sign up).
3. Créer manuellement un seul compte personnel dans Authentication → Users ; définir un mot de passe unique et activer une protection forte si disponible.
4. Dans SQL Editor, exécuter `web/supabase/001_private_entries.sql`.
5. Copier l'UUID du compte Auth créé. Exécuter : `insert into public.app_owner(user_id) values ('UUID_DU_COMPTE');`
6. Vérifier que l'utilisateur autorisé peut lire et créer ses entrées, et qu'un utilisateur non autorisé ne peut pas lire, écrire, modifier ou supprimer de données.

**Ne jamais utiliser de clé `service_role` ou de secret dans une variable `VITE_*`.** La clé publique/publishable n'est acceptable dans le navigateur que grâce aux politiques RLS vérifiées.

## 2. Vercel

1. Importer le dépôt `akdiop/my-thirties` dans Vercel, ou reconfigurer le projet existant.
2. Garder **Root Directory vide** (racine du dépôt) : `vercel.json` lance le build dans `web/` et publie `web/dist`.
3. Ajouter les variables d'environnement : `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` du nouveau projet.
4. Déployer d'abord une **Preview Deployment** de la branche de développement ; ne pas fusionner `main` avant validation.
5. Contrôler les redirections SPA, les assets, la connexion, la déconnexion, la persistance des données, l'export chiffré, la restauration et l'affichage mobile/desktop.
6. Activer HTTPS, une protection d'accès supplémentaire si possible pour les previews, et la surveillance des erreurs sans journaliser de données sensibles.

## 3. Installation iPhone

Après validation du lien HTTPS : ouvrir l'URL dans Safari → Partager → **Sur l'écran d'accueil** → Ajouter. Une icône « My Thirties » apparaît. Le lien fonctionne également dans un navigateur sur ordinateur.

## 4. Limites et fonctionnalités

- 11 espaces disposent de formulaires de saisie et d'une persistance cloud, mais cela **ne signifie pas que toutes les fonctionnalités du cahier des charges sont terminées**.
- Challenges : plusieurs calendriers indépendants, 7/14/30 jours, statuts et notes par jour.
- Cuisine : recettes personnelles et génération d'une liste de courses simple (pas de calcul de portions ni de consolidation intelligente des quantités).
- Finances : suivi des transactions par devise, sans taux de change automatique.
- Équilibre : journal émotionnel, gratitude, booster à compléter avec programmes guidés.
- Sport : journal de séances et notes pédagogiques ; aucune analyse vidéo réelle.
- Santé : journal personnel, pas de prédiction clinique.
- Spiritualité : journal de pratiques, pas encore de source vérifiée pour horaires de prière ou textes.
- Voyages : planification manuelle, pas encore de recommandations actualisées.
- IA, notifications push, calendrier externe, données hors ligne, images/vidéos validées : à développer.

## 5. Sécurité et données

- Le web ne stocke pas les enregistrements en clair dans localStorage. La session Supabase utilise sessionStorage ; les données proviennent de PostgreSQL sous RLS.
- Le HTTPS et le chiffrement au repos Supabase **ne constituent pas un chiffrement de bout en bout**. Avant toute saisie réelle de données médicales, émotionnelles ou financières, valider l'architecture de confidentialité et les paramètres du projet.
- Export : AES-256-GCM dérivé d'une phrase secrète ; restauration : ajout atomique jusqu'à 500 entrées par fichier, avec confirmation et risque de doublons.
- Aucun déploiement ni création de projet cloud n'a été effectué par ce commit. Ne pas considérer le service comme opérationnel tant que les tests de sécurité et de récupération ne sont pas passés.

## 6. Tests à réaliser

- `npm ci && npm run typecheck && npm test -- --runInBand && npm run lint` (native).
- `npm install --prefix web && npm run build --prefix web` (PWA).
- Vérifier les jobs GitHub Actions de la pull request.
- Tester iPhone Safari et Chrome/Safari/Edge desktop.
- Tester l'authentification, les politiques RLS, le refus d'accès sans compte, la déconnexion, les exports/restaurations, les cas d'erreur et l'accessibilité.
- Conserver la pull request en **draft** jusqu'à validation explicite.
