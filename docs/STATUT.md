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
| Génération automatique de listes (courses, préparatifs et valise, matériel) | 4 | Opérationnel | Tests SQLite (articles cochés ou modifiés préservés) |
| Rappels : événements, tâches, routines, briefing du matin, bilan du soir | 2 | Opérationnel | Tests unitaires ; envoi à tester sur iPhone |
| Accueil : journée, priorités, routines, bilan du soir | 2 | Opérationnel | À tester sur iPhone |
| Widgets déplaçables et masquables | 2 | Non développé | Prévu avec les widgets des phases 3-4 |
| Planification intelligente | 5 | Non développé | — |
| Challenges iPhone (calendriers et suivi) | 3 | Partiellement opérationnel | Écrans et tables présents ; tests sur iPhone et ressources pédagogiques manquants |
| Santé, sport, équilibre, spiritualité sur iPhone | 3 | Non développé | — |
| Finances, cuisine, voyages, passions | 4 | Non développé | — |
| Ma santé : cycle et prévisions indicatives, symptômes, humeur, énergie, douleurs | 3 | Opérationnel | 7 tests du cycle ; à tester sur iPhone |
| Sommeil, hydratation, journal alimentaire | 3 | Opérationnel | Tests unitaires + SQLite |
| Compteur de pas (capteur de mouvement de l'iPhone), objectif, 7 jours | 3 | Opérationnel | Tests unitaires ; lecture des pas à tester sur iPhone |
| Mon sport : fiches tennis, Pilates (sol, Reformer), yoga, séances 10/20/30/45 min, journal | 3 | Partiellement opérationnel | Fiches à relire ; vidéos en cours de choix (s’ouvrent dans YouTube) |
| Analyser ma technique | 5 | Non développé | — |
| Mes challenges : plusieurs en parallèle, calendrier 3 statuts, fiche du jour, reporter, adapter, pause, archives, recommencer, propositions du mois, rappel | 3 | Opérationnel | 9 tests + tests SQLite |
| Séance réalisée → challenge → agenda | 3 | Opérationnel | Test SQLite (suppression de la séance = jour décoché) |
| Mon équilibre : 10 axes, 9 programmes Booster (7, 14 et 30 jours), journal émotionnel et tendances, gratitude, bilan mensuel | 3 | Opérationnel | Tests unitaires + SQLite ; contenus à relire |
| Ma spiritualité : horaires des 5 prières (adhan, 11 méthodes, Hanafi, ajustements), calendrier hégirien, suivi facultatif | 3 | Opérationnel | 9 tests ; à comparer avec votre mosquée |
| Compteur de dhikr (libre, routines 5/10/30 min) | 3 | Opérationnel | Tests unitaires |
| Journal spirituel, rappels de prière, prières dans l'agenda | 3 | Opérationnel | Tests unitaires |
| Santé → Sport (suggestion d'intensité, sur autorisation) | 3 | Opérationnel | Tests unitaires ; désactivé par défaut |
| Onglet Bien-être | 3 | Opérationnel | À tester sur iPhone |
| Mes finances : opérations, XOF/EUR/USD, catégories, budgets mensuels, abonnements, épargne, tableau du mois | 4 | Partiellement opérationnel | Tests unitaires + SQLite ; pas d'import bancaire |
| Taux USD (BCE via Frankfurter, daté, mise à jour manuelle) ; EUR↔XOF parité fixe | 4 | Partiellement opérationnel | Format testé ; appel réseau à tester sur iPhone (bloqué depuis l'environnement de dev) |
| Rappels d'abonnements et de départ en voyage | 4 | Opérationnel | Tests unitaires ; envoi à tester sur iPhone |
| Ma cuisine : recettes (9 idées de base sénégalaises, africaines, internationales), portions, planning de la semaine, placard, courses, ordre de préparation, conservation, session dans l'agenda | 4 | Opérationnel | Tests unitaires + SQLite ; quantités indicatives à ajuster |
| Mes découvertes : envies / prévus / vécus, dates, itinéraire, réservations, à voir, budget relié aux dépenses, préparatifs, valise, agenda | 4 | Opérationnel | Tests SQLite ; aucun prix ni condition d'entrée inventé |
| Mes passions : parcours 6 ou 12 mois, jalons, journal, statistiques, matériel, séances dans l'agenda | 4 | Opérationnel | Tests unitaires + SQLite |
| Accueil : carte Budget | 4 | Opérationnel | À tester sur iPhone |
| Version web | — | Non développé | En attente de votre accord (voir réponse sur le web) |
| Assistant IA, analyse vidéo | 5 | Non développé | — |

## Application web installable (PWA) — branche de développement

**Ne pas confondre « code présent » et « service en production ».** Projet Supabase My Thirties créé séparément de SaxalWér, migration RLS appliquée et tables vérifiées. Aucun compte propriétaire créé ni accès Vercel autorisé ; déploiement et essais réels non terminés.

| Fonctionnalité web | Statut | Limites |
| --- | --- | --- |
| Design crème/chocolat/sauge, navigation responsive | Implémenté, build automatisé | Vérifier Safari iPhone et desktop |
| Manifest PWA et icône d'accueil | Implémenté, build automatisé | Vérifier ajout à l'écran d'accueil |
| Authentification et contrôle propriétaire | Configuration partielle | Projet Supabase créé et RLS déployée ; compte Auth propriétaire et tests RLS en conditions réelles manquants |
| Stockage synchronisé des 11 espaces | Configuration partielle | Tables cloud créées ; Vercel et tests réels manquants ; iOS non synchronisé |
| Agenda jour/semaine/mois et tâches cochables | Implémenté, tests CI en cours | Récurrences quotidiennes/hebdomadaires ; pas de synchronisation Google/iCloud |
| Santé (cycle, sommeil, symptômes, humeur, énergie, hydratation, repas) | Partiel | Tableau de bord descriptif, sans prévisions médicales |
| Sport (séances et fiches d'apprentissage) | Partiel | Vidéos et analyse de technique absentes |
| Challenges 7/14/30 jours | Partiel | Calendriers, statuts, notes ; pas de programmes vidéo |
| Équilibre (émotions, gratitude, booster) | Partiel | Journaux et programme cochable ; recommandations IA absentes |
| Spiritualité (suivi personnel) | Partiel | Horaires saisis manuellement avec source, pas de calcul automatique ni de textes vérifiés |
| Finances | Partiel | Budgets mensuels, répartition des dépenses, abonnements, épargne ; pas de change actualisé |
| Cuisine | Partiel | Recettes, calendrier de repas hebdomadaire, liste de courses consolidée ; batch cooking guidé et tutoriels absents |
| Voyages | Partiel | Projets, budget, itinéraire, préparatifs et valises ; formalités et données touristiques actualisées absentes |
| Passions | Partiel | Parcours 6/12 mois avec étapes personnalisables et progression ; tutoriels externes absents |
| Listes | Partiel | Listes cochables et génération depuis cuisine/voyage |
| Sauvegarde et restauration web | Code présent, non testé avec Supabase | AES-256-GCM ; import limité à 500 entrées, ajout sans dédoublonnage |
| IA, analyse vidéo, notifications push | Non développé | Aperçu du jour à règles locales, pas un modèle IA ; intégrations externes et consentements nécessaires |
| Offline avec données personnelles | Non développé | Service worker sans cache de données sensibles |

**Prochain jalon bloquant :** créer le compte Auth personnel, lui attribuer le rôle propriétaire, désactiver les inscriptions publiques, tester les politiques RLS avec des sessions réelles, autoriser l'accès à l'équipe Vercel puis déployer une preview protégée. Les tests CI ne remplacent pas les tests sur appareils et la validation de sécurité.
