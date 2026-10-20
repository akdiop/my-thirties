# My Thirties — cible web installable (PWA)

Décision produit (20 octobre 2026) : **un seul lien accessible depuis iPhone et ordinateur**, avec ajout à l'écran d'accueil sur iPhone (Safari → Partager → Sur l'écran d'accueil). Une application native iOS n'est pas une condition de lancement.

## Architecture cible

- **Frontend :** application web responsive, mobile-first, installable (manifest, icônes, service worker minimal). L'interface doit fonctionner au clavier et au tactile, en format téléphone et ordinateur. Les 5 onglets et le design beige/chocolat/sauge restent la référence.
- **Authentification :** un compte personnel sécurisé, sans inscription publique. Authentification gérée côté serveur, sessions protégées. Pas de PIN local utilisé comme substitut à une authentification distante. Authentification forte/MFA si disponible.
- **Données :** PostgreSQL Supabase avec RLS vérifiée pour chaque table et chaque opération. `auth.uid()` doit être l'unique propriétaire des données. Aucune clé `service_role` dans le navigateur. Ne pas réutiliser le projet Supabase de SaxalWér.
- **Chiffrement :** TLS en transit. Chiffrement serveur au repos et accès strict par RLS ; évaluer un chiffrement de bout en bout pour les journaux émotionnels, la santé et les finances avant toute collecte. Ne jamais affirmer que les données sont chiffrées de bout en bout sans implémentation et audit. Aucun stockage local en clair des données sensibles.
- **Synchronisation :** lecture/écriture sur une base centrale ; mises à jour répercutées sur téléphone et ordinateur ; gestion des conflits et sauvegardes testées.
- **PWA :** HTTPS, manifest, icônes, cache limité aux ressources statiques. Ne jamais mettre en cache des réponses contenant des données de santé, finances ou journal dans un service worker non conçu pour leur confidentialité.
- **Notifications :** dépendance au navigateur et à l'OS ; privilégier les rappels in-app, et ajouter les notifications push seulement après tests iOS/desktop et autorisation explicite.
- **Agenda externe :** les API de calendriers natifs Expo ne fonctionnent pas sur le web ; proposer une intégration Google Calendar/iCloud adaptée, avec consentement et permissions minimales.
- **IA et vidéos :** appels via un backend sécurisé, validation et limites de fichiers, consentement préalable, politique de rétention explicite.
- **Déploiement :** Vercel ou équivalent avec environnement de prévisualisation, variables d'environnement sécurisées, domaine privé à choisir. Aucun déploiement de production avant audit.

## Réutilisation du code actuel

La version React Native + Expo utilise `expo-sqlite`, SQLCipher, `expo-secure-store` et plusieurs API natives : elle **n'est pas directement prête à être publiée sur le web**. Réutiliser les règles métier et les composants compatibles ; fournir des implémentations spécifiques au web pour le stockage, l'authentification, les notifications et les intégrations. Ne pas supprimer les migrations natives existantes.

## Ordre de réalisation

1. Architecture web, authentification et RLS + tests de séparation des données.
2. Navigation responsive, écrans existants (agenda, tâches, routines, listes), PWA installable.
3. Synchronisation multi-appareils, export/restauration chiffrés et tests de récupération.
4. Sport, challenges, journaux et équilibre ; protections renforcées des données sensibles.
5. Santé, spiritualité, finances, cuisine, voyages, passions.
6. Fonctions IA, analyse vidéo, intégrations calendriers et notifications, selon consentement et budget.
7. Vérifications Safari iPhone, Chrome/Edge/Safari desktop, audit sécurité, accessibilité, performances.

## Conditions de validation avant publication

- Connexion sécurisée, RLS testée, aucune donnée accessible sans authentification.
- Aucune fuite de données entre appareils, comptes, logs, cache, notifications ou exports.
- Sauvegarde/restauration réellement testées.
- Installation iPhone depuis Safari et utilisation sur ordinateur vérifiées.
- Les modules incomplets portent un statut explicite ; pas de promesse d'IA ou d'analyse vidéo non développée.

**Statut :** décision d'architecture documentée, implémentation web et déploiement non encore réalisés.
