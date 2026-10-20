# Statut des fonctionnalités

Mis à jour à chaque phase. Statuts : Opérationnel · Partiellement opérationnel · En attente de configuration · Prototype · Non développé.

| Fonctionnalité | Phase | Statut | Vérification |
| --- | --- | --- | --- |
| Design system (couleurs clair/sombre, typographies, composants) | 1 | Opérationnel | Test de contraste WCAG automatisé |
| Navigation à 5 onglets | 1 | Opérationnel | Bundle iOS construit ; à tester sur iPhone |
| Code à 6 chiffres (haché, jamais en clair) | 1 | Opérationnel | Tests unitaires ; à tester sur iPhone |
| Blocage progressif après 5 erreurs | 1 | Opérationnel | Tests unitaires |
| Face ID | 1 | Opérationnel | Nécessite un iPhone : à tester |
| Reverrouillage après passage en arrière-plan | 1 | Opérationnel | Test unitaire du délai ; à tester sur iPhone |
| Base locale chiffrée (SQLCipher) + migrations | 1 | Opérationnel | Bundle construit ; chiffrement à vérifier sur iPhone |
| Profil (prénom, devise, apparence) | 1 | Opérationnel | À tester sur iPhone |
| Espaces affichés / masqués | 1 | Opérationnel | Tests unitaires du registre |
| « J'ai besoin de me calmer » (respiration guidée) | 1 | Opérationnel | Tests unitaires du rythme |
| Export chiffré AES-256-GCM | 1 | Partiellement opérationnel | Phrase secrète ajoutée ; à tester sur iPhone ; restauration native non développée |
| Suppression totale des données | 1 | Opérationnel | À tester sur iPhone |
| Moteur de notifications (heures silencieuses, limite iOS de 64) | 1 | Opérationnel | Planificateur testé ; envoi réel à tester sur iPhone |
| Compte Supabase, sauvegarde et synchronisation | 2 | En attente de configuration | Projet Supabase à créer |
| Agenda jour / semaine / mois, événements, catégories | 2 | Opérationnel | Tests de l'agenda ; à tester sur iPhone |
| Événements récurrents (jour, semaine, mois, année) et exceptions | 2 | Opérationnel | 11 tests de récurrence + test SQLite |
| Calendriers de l'iPhone (Google, iCloud) en lecture seule | 2 | Opérationnel | Nécessite un iPhone : à tester |
| Tâches : priorités, échéances, sous-tâches, récurrence, report, historique | 2 | Opérationnel | Tests unitaires + tests SQLite |
| Trois priorités du jour | 2 | Opérationnel | Tests unitaires |
| Routines (matin, soir, travail, week-end, personnalisées) cochables par jour | 2 | Opérationnel | Tests unitaires + tests SQLite |
| Mes listes : créer, cocher, quantités, notes, réordonner, dupliquer, archiver, modèles | 2 | Opérationnel | Tests unitaires + tests SQLite |
| Génération automatique de listes (courses, valise, matériel) | 3-4 | Non développé | Dépend de Cuisine, Voyages, Passions |
| Rappels : événements, tâches, routines, briefing du matin, bilan du soir | 2 | Opérationnel | Tests unitaires ; envoi à tester sur iPhone |
| Accueil : journée, priorités, routines, bilan du soir | 2 | Opérationnel | À tester sur iPhone |
| Widgets déplaçables et masquables | 2 | Non développé | Prévu avec les widgets des phases 3-4 |
| Planification intelligente | 5 | Non développé | — |
| Challenges iPhone (calendriers et suivi) | 3 | Partiellement opérationnel | Écrans et tables présents ; tests sur iPhone et ressources pédagogiques manquants |
| Santé, sport, équilibre, spiritualité sur iPhone | 3 | Non développé | — |
| Finances, cuisine, voyages, passions | 4 | Non développé | — |
| Assistant IA, analyse vidéo | 5 | Non développé | — |

## Application web installable (PWA) — branche de développement

**Ne pas confondre « code présent » et « service en production ».** Aucun compte Supabase dédié ni déploiement web n'a encore été configuré.

| Fonctionnalité web | Statut | Limites |
| --- | --- | --- |
| Design crème/chocolat/sauge, navigation responsive | Implémenté, build automatisé | Vérifier Safari iPhone et desktop |
| Manifest PWA et icône d'accueil | Implémenté, build automatisé | Vérifier ajout à l'écran d'accueil |
| Authentification et contrôle propriétaire | Code présent, configuration requise | Supabase personnel, compte et RLS à créer/tester |
| Stockage synchronisé des 11 espaces | Code présent, configuration requise | Tables cloud à créer, sécurité et tests réels |
| Agenda mensuel et tâches cochables | Implémenté, non testé sur appareils | Pas encore de synchronisation Google/iCloud |
| Santé (cycle, sommeil, symptômes) | Partiel | Pas de prévisions ni de sources médicales intégrées |
| Sport (séances et fiches d'apprentissage) | Partiel | Vidéos et analyse de technique absentes |
| Challenges 7/14/30 jours | Partiel | Calendriers, statuts, notes ; pas de programmes vidéo |
| Équilibre (émotions, gratitude, booster) | Partiel | Journaux et programme cochable ; recommandations IA absentes |
| Spiritualité (suivi personnel) | Partiel | Horaires et textes religieux vérifiés absents |
| Finances | Partiel | Transactions, abonnements, objectifs ; pas de change actualisé |
| Cuisine | Partiel | Recettes, portions et listes consolidées ; pas de batch cooking complet |
| Voyages | Partiel | Projets, valises et checklists ; pas de données touristiques actualisées |
| Passions | Partiel | Objectifs et journal ; parcours guidés incomplets |
| Listes | Partiel | Listes cochables et génération depuis cuisine/voyage |
| Sauvegarde et restauration web | Code présent, non testé avec Supabase | AES-256-GCM ; import limité à 500 entrées, ajout sans dédoublonnage |
| IA, analyse vidéo, notifications push | Non développé | Exigent services externes, budget et consentement |
| Offline avec données personnelles | Non développé | Service worker sans cache de données sensibles |

**Prochain jalon bloquant :** créer un projet Supabase distinct, configurer le compte propriétaire, appliquer et tester les politiques RLS, puis déployer une preview Vercel protégée. Les tests CI ne remplacent pas les tests sur appareils et la validation de sécurité.
