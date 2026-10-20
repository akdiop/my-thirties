# My Thirties — widgets iOS (préparation SDK 55)

Deux widgets iOS sont prévus :
- **Ma journée** (petit et moyen) : neutre par défaut. Avec consentement explicite dans Profil, affiche le nombre de priorités en attente et jusqu'à deux titres.
- **Écran verrouillé** (circulaire, rectangulaire, en ligne) : neutre par défaut ; avec consentement, n'affiche que le nombre de priorités, jamais leurs titres.

## Confidentialité
Les widgets iOS peuvent rester visibles sur un appareil verrouillé. L'option « Afficher mes priorités dans les widgets » est **désactivée par défaut** et persistée dans les réglages locaux. La désactivation vide les instantanés des widgets lors du prochain passage de l'app active. Aucun contenu santé, finances, émotions, spiritualité ni vidéo n'est exporté. Les instantanés de widgets résident dans un conteneur iOS partagé et ne bénéficient pas du chiffrement SQLCipher de la base de l'app : ne jamais y transmettre de données sensibles.

## Installation native indispensable
Le dépôt Expo SDK 55 nécessite les dépendances natives `expo-widgets` et `@expo/ui` et un fichier `package-lock.json` actualisé. Exécuter **dans une copie de travail du dépôt** :

```sh
npx expo install expo-widgets @expo/ui
npm run typecheck
npm test -- --runInBand
npx expo prebuild --platform ios
npx expo run:ios --device
```

Faire le commit de `package.json` et `package-lock.json` ensemble. `expo-widgets` est **alpha** sous SDK 55 et exige une compilation de développement ou une build EAS : **Expo Go et la PWA Vercel ne prennent pas en charge ces widgets**. Vérifier le provisionnement Apple App Groups `group.com.akdiop.mythirties` et l'extension `com.akdiop.mythirties.ExpoWidgetsTarget`. Vérifier l'affichage dans la galerie de widgets iOS, les trois tailles d'écran verrouillé, les changements de données, le refus de consentement, l'effacement et le verrouillage du téléphone.

**Statut** : code et configuration préparés dans la branche de développement ; installation des dépendances, compilation Xcode et tests iPhone restent à faire. Ne pas publier en production sans ces vérifications.
