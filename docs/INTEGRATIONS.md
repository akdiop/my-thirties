# Intégrations externes : état, sécurité et déploiement

## Assistant IA

- Frontend : `web/src/features/PersonalAssistant.tsx`, formulaire opt-in.
- Backend : `web/supabase/functions/personal-assistant/index.ts`, fonction Supabase Edge. **Code uniquement ; non déployé.**
- Déployer uniquement dans le projet Supabase My Thirties, après création du compte propriétaire Auth et validation des RLS. Conserver la vérification JWT activée.
- Configurer les secrets `OPENAI_API_KEY` et `APP_ORIGIN` (origine HTTPS exacte de l'application), et `SUPABASE_URL`/`SUPABASE_ANON_KEY` dans l'environnement de la fonction. Ne jamais placer de clé fournisseur dans `VITE_*` ni dans le navigateur.
- Avant tout usage réel : valider les coûts et les conditions du fournisseur, tester CORS/JWT/RLS, ajouter une limitation de débit par compte, un plafond de dépenses et un contrôle des erreurs. L'interface n'envoie que le texte saisi, sur consentement explicite, sans lecture des autres espaces et sans journal de conversation dans My Thirties. Le fournisseur externe traite néanmoins la question envoyée.
- Pas de planification automatique, pas d'action autonome, pas d'accès au calendrier ou aux données médicales.

## Horaires de prière

- `web/src/features/AutomaticPrayerTimes.tsx` interroge `https://api.aladhan.com/v1/timingsByCity/` à la demande.
- Ville, pays, date et méthode choisie sont envoyés au fournisseur. Pas de coordonnées GPS, pas de requête silencieuse.
- Résultat visualisé avant enregistrement volontaire dans les entrées privées ; méthode, source, fuseau et date hégirienne conservés.
- Vérifier en conditions réelles la disponibilité, les règles CORS, les fuseaux et les différences de calcul locales ; préférer la mosquée locale en cas d'écart.
- Pas de synchronisation quotidienne en arrière-plan.

## Calendriers externes

- Export manuel `.ics` disponible dans l'agenda web ; import possible dans Apple Calendrier, Google Agenda et Outlook. Les entrées du fichier sont en clair : conserver ce fichier en lieu sûr.
- **Ce n'est pas une synchronisation bidirectionnelle** ; pas d'OAuth Google/Outlook ni d'accès iCloud depuis la PWA.
- Le projet Expo iOS dispose déjà d'un accès en lecture seule aux calendriers du téléphone, sous réserve d'autorisation et de tests sur appareil.
- Pour la synchronisation automatique, créer des connexions OAuth distinctes, permissions minimales, dédoublonnage, gestion des suppressions et résolution de conflits.

## Notifications

- Web : `BrowserReminders` fournit des notifications locales uniquement lorsque la page reste ouverte et que l'utilisateur a accordé la permission.
- iOS natif : `expo-notifications` et planificateur de rappels déjà présents ; vérifier sur iPhone, y compris heures silencieuses.
- Les push en arrière-plan de la PWA nécessitent service worker, souscription push, serveur et configuration APNs/Web Push ; **non activés**. Ne jamais prétendre que les notifications web fonctionnent en arrière-plan.

## Analyse vidéo sportive

- `LocalVideoPose` charge, après action explicite, un modèle MediaPipe pour détecter localement les points de posture sur une vidéo.
- La vidéo n'est pas envoyée à un serveur et n'est pas enregistrée dans Supabase ; les fichiers modèle et WASM sont téléchargés depuis des serveurs externes.
- Il s'agit de détection de posture expérimentale, **pas** d'un diagnostic, d'un coaching fiable, d'une analyse biomécanique validée ni d'une correction de technique tennis/Pilates/yoga.
- Tester Safari iPhone, les formats vidéo, les performances et l'alignement des points avant toute affirmation de fiabilité.

## Synchronisation iOS ↔ Web

**Non activée.** L'application native conserve des tables SQLite/SQLCipher et une structure de données distinctes de la table `public.entries` de la PWA. Le simple fait de partager le projet Supabase ne synchronise pas ces tables.

Plan technique :
1. Finaliser le compte Auth propriétaire et tester les règles RLS avec un compte autorisé et un compte non autorisé.
2. Définir un modèle commun versionné, des identifiants stables, des horodatages, des tombstones pour suppressions, et des règles de conflits hors ligne.
3. Mapper les données natives (agenda, tâches, routines, challenges, sport, journaux) vers ce modèle sans perte d'informations. Garder la sauvegarde SQLCipher locale.
4. Ajouter une synchronisation manuelle opt-in, puis les mises à jour incrémentales avec journal des erreurs et retour arrière.
5. Tester les doubles modifications, suppressions, réinstallations, perte réseau, deux appareils, et restauration d'une sauvegarde. Ne pas transférer de données sensibles avant validation.

## Blocage Vercel

Le projet `my-thirties` est visible dans le compte, mais les actions sous l'équipe `aidalaye-diop-saxalwer` retournent **403 (accès refusé)** avec le connecteur actuel. Le propriétaire doit accorder l'accès à cette équipe à l'intégration Vercel. Ne pas tenter de déployer sous une autre équipe ou sur le projet SaxalWér.

## Suggestions prioritaires

- Un centre « Intégrations et consentements » avec état par service, permissions révocables et export de données.
- Un mode « sans cloud » pour les journaux sensibles, séparé des fonctions d'IA et d'analyse externe.
- Un test de restauration automatique sur données fictives et un audit indépendant avant usage réel.
- Des préférences explicites pour le fuseau horaire, les méthodes de prière, les rappels silencieux et les notifications.
