# My thirties

Application personnelle et privée d'organisation de la vie : agenda, santé, sport, challenges, équilibre, spiritualité, finances, cuisine, voyages, passions et listes. Conçue pour un seul usage, sur iPhone.

- Conception : dossier de conception et maquettes validés (liens privés dans la pull request).
- Statut détaillé : [`docs/STATUT.md`](docs/STATUT.md).

## Principes

- **Local-first** : toutes les données vivent dans une base SQLite chiffrée (SQLCipher) sur l'iPhone. La clé est générée au premier lancement et rangée dans le trousseau iOS (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`).
- **Verrou** : code à 6 chiffres (PBKDF2-SHA256, sel aléatoire, jamais stocké en clair) et Face ID. Blocage progressif après 5 erreurs, reverrouillage après passage en arrière-plan.
- **Aucun secret dans le code** : seules des clés publiques seront ajoutées plus tard (Supabase), les clés IA resteront côté serveur.

## Stack

Expo SDK 55 · Expo Router · TypeScript strict · expo-sqlite + SQLCipher · Drizzle ORM · Zustand · Jest.

## Démarrer

```bash
npm install
npm run typecheck
npm run lint
npm test
```

L'application utilise des modules natifs (SQLCipher, Face ID) : elle ne fonctionne pas dans Expo Go. Il faut une version de développement :

```bash
npx eas-cli@latest build --profile development --platform ios
```

Installation sur iPhone via TestFlight (compte Apple Developer requis, environ 99 USD par an). Sans compte payant, une installation de 7 jours est possible depuis un Mac avec Xcode et un identifiant Apple gratuit (`npx expo run:ios --device`).

## Structure

```
src/
  agenda/       dates, récurrence, agenda, tâches, routines (logique pure, testée)
  app/          écrans (Expo Router) : onglets, agenda, tâches, routines, listes, espaces
  components/   design system et composants partagés
  db/           schéma Drizzle, migrations, ouverture de la base chiffrée
  data/         accès aux données, export, suppression
  features/     verrou, profil, respiration, agenda, tâches
  lists/        logique des listes et modèles
  modules/      registre des 11 espaces et de leurs statuts
  notifications/ planificateur (heures silencieuses, limite iOS) et envoi
  security/     code, clés, trousseau, Face ID
  state/        réglages et état de l'application
  theme/        couleurs, typographies, contraste
```

## Base de données

Après une modification de `src/db/schema.ts` :

```bash
npm run db:generate
```


