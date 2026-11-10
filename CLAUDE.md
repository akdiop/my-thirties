# My Thirties — consignes pour Claude Code

Application **personnelle et privée** d'Aïda (34 ans, Dakar) pour suivre sa trentaine : organisation, bien-être, spiritualité, sport, cuisine, finances, voyages, passions, listes, compagnon Mon Panda. Un seul utilisateur. Interface en français.

## Deux bases de code
- `web/` : **l'app en production**. Vite + React + TypeScript, PWA installée sur iPhone depuis Safari, hébergée sur Vercel (build défini dans `vercel.json`), données Supabase (projet `wqeipqjwvnkqelyctmcg`, table `entries` + RLS `is_app_owner()`, fonctions dans `web/supabase/functions/`, migrations SQL dans `web/supabase/`).
- Racine (`src/`, `app.config.ts`, `eas.json`) : app native Expo SDK 55 / Expo Router (SQLCipher, widgets iOS), en pause depuis le 21 octobre 2026. Voir `docs/ARCHITECTURE_PWA.md`, `docs/STATUT.md`, `docs/WIDGETS_IOS.md`.

## Commandes
- Web : `cd web && npx tsc -b && npx vitest run && npx vite build`
- Native : `npm run typecheck && npm test -- --runInBand && npm run lint`
- La CI (`.github/workflows/quality.yml`) lance les deux.

## Règles permanentes
1. Ne jamais modifier une fonctionnalité existante sans autorisation explicite.
2. Ne jamais changer silencieusement le comportement de l'app : chaque changement est annoncé.
3. Préserver le design validé (DA « Pierre et verre », novembre 2026) : fond pierre en dégradé, cartes en verre blanc translucide, olive doré #7E7254, sauge #5F7A59, texte #3A3833, police Calibri (Carlito sur iPhone), barre du bas flottante ; doux, féminin, minimaliste. Pas de bleu, pas d'emojis dans l'interface, pas de nouveau style visuel. Réutiliser `web/src/ui/kit.tsx`, `Glyph.tsx` et les classes de `web/src/styles.css`.
4. Réutiliser les composants et utilitaires existants avant d'en créer (chercher d'abord dans `web/src/lib`, `web/src/ui`, `web/src/features`).
5. Pas de dépendance inutile ; toute nouvelle dépendance doit être justifiée.
6. TypeScript propre, strict et maintenable ; nommage cohérent avec l'existant.
7. Pas de commentaires superflus, de code généré inutile ni de doublons.
8. Vérifier la compatibilité iPhone (Safari, PWA) et ordinateur.
9. Protéger les données personnelles et les secrets : rien de sensible côté client, jamais afficher ou committer `.env`, clés ou jetons.
10. Tester avant de dire qu'une tâche est finie (typecheck, tests, build, parcours dans l'aperçu local avec données fictives).
11. Signaler clairement ce qui n'est pas résolu, non testé ou limité.
12. **Aucun déploiement sans accord** : on ne fusionne une PR, n'applique une migration ou ne déploie une fonction Supabase que lorsqu'Aïda écrit « déploie ». Pas de modification de données de production ni d'action destructive sans accord.
13. My Thirties est totalement séparée de SaxalWér : ne jamais toucher ses dépôts ni le projet Supabase `frbmsqsqyefamxmfbsoz`.
14. Pas d'analytics, de suivi ou de nouvelle transmission de données externe sans accord.

## Contenu
- Ne jamais inventer de versets, hadiths, invocations, prix, horaires ou conditions d'entrée ; citer la source donnée par Aïda.
- Livres sous droits (ex. Muslima Mindset Reset) : reformuler en fiches, ne pas recopier.
- Traduire en français tout contenu anglais destiné à l'app.
- Pas d'avertissements ni de mentions de précaution superflues dans l'interface.
- Les illustrations d'Aïda (`web/public/panda`, `web/public/modules`) ne sont ni remplacées ni régénérées sans son accord.

## Git
Travailler sur une branche dédiée, PR en brouillon, fusion seulement sur « déploie ». Pas de force-push ni de réécriture d'historique.

## Agents spécialisés (`.claude/agents/`)
N'appeler un agent que si son expertise est utile ; éviter les agents en parallèle inutiles.

| Changement | Agents |
| --- | --- |
| Architecture, nouveau module, dépendance, table | personal-app-architect + qa-ux-tester |
| Écran, composant, CSS, images | aesthetic-ui-designer + qa-ux-tester |
| Natif Expo, widgets, PWA iPhone, Vercel | expo-ios-specialist + qa-ux-tester |
| Mon Panda, challenges, badges | gamification-designer + aesthetic-ui-designer + qa-ux-tester |
| Assistant IA, préférences, suggestions | personalization-engineer + data-privacy-specialist |
| Agenda, rappels, notifications, prières | calendar-notification-engineer + expo-ios-specialist |
| Données sensibles, auth, RLS, sauvegardes | data-privacy-specialist + personal-app-architect |

Les agents d'audit (architecte, design, natif, personnalisation, gamification, calendrier, confidentialité) analysent et recommandent sans modifier de fichiers ; data-privacy-specialist n'a aucun accès en écriture ni à la ligne de commande. Seul qa-ux-tester peut écrire, et uniquement des fichiers de test quand la tâche l'autorise. L'implémentation reste faite par la session principale.
