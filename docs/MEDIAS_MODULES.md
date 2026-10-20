# Photos et vidéos — première intégration web

Les galeries sont disponibles dans les espaces **Sport**, **Cuisine**, **Découvertes** et **Passions** de la version web. Chaque galerie accepte des photos et vidéos (JPG, PNG, WebP, HEIC/HEIF, MP4, WebM, MOV, suivant le support du navigateur), limite chaque fichier à 40 Mo, permet de rattacher le fichier à une entrée du module, d'afficher les photos, de lire les vidéos compatibles et de supprimer les fichiers.

## Architecture et limites de sécurité

- Stockage local **IndexedDB**, dans le profil du navigateur, indexé par l'UUID du compte authentifié et le module. Aucun upload réseau et aucun stockage dans Supabase.
- **Non chiffré au niveau applicatif**. Ne pas y placer de documents confidentiels ou de médias sensibles tant qu'un stockage chiffré n'est pas implémenté.
- Pas de synchronisation entre iPhone, ordinateur ou navigateurs, pas d'inclusion dans l'export chiffré actuel. La suppression des données du navigateur peut entraîner la perte des fichiers.
- Lorsqu'une entrée est supprimée, les médias liés sont également supprimés localement sur l'appareil courant. Les médias de la galerie générale restent disponibles.
- Les fichiers restent présents dans le profil du navigateur après déconnexion (mais ne sont pas présentés à un autre UUID de compte). Sur un appareil partagé, privilégier un profil navigateur privé et protégé.
- Cette première intégration concerne **le web/PWA uniquement**. Les écrans Expo natifs et la synchronisation multimédia sécurisée demandent une implémentation et des tests distincts.

## Vérifications

Tester import photo/vidéo, lecture, suppression, persistance après rechargement, quotas navigateur, déconnexion/reconnexion, suppression d'une entrée, Safari iOS, erreurs de format, échec d'écriture IndexedDB, et l'absence de requêtes réseau d'upload. Ne pas activer un stockage cloud public pour ces médias.
