import type { ChallengeTemplate } from './challenges';
type Suggestion = { category: ChallengeTemplate['category']; discipline: string; title: string; days: 7 | 14 | 21 | 30; activity: string };
const SUGGESTIONS: Suggestion[] = [
  {
    "category": "Apprentissage",
    "discipline": "Langues",
    "title": "Anglais : conversation quotidienne",
    "days": 21,
    "activity": "Écoute 5 minutes d’anglais, note trois expressions et formule deux phrases à voix haute."
  },
  {
    "category": "Apprentissage",
    "discipline": "Langues",
    "title": "Wolof : expressions du quotidien",
    "days": 30,
    "activity": "Apprends trois expressions en wolof, prononce-les puis utilise-en une dans une phrase."
  },
  {
    "category": "Apprentissage",
    "discipline": "Langues",
    "title": "Espagnol : premiers échanges",
    "days": 21,
    "activity": "Étudie dix minutes de vocabulaire, puis entraîne-toi à poser et répondre à une question."
  },
  {
    "category": "Apprentissage",
    "discipline": "Langues",
    "title": "Français : écriture précise",
    "days": 14,
    "activity": "Choisis un mot nouveau, écris sa définition puis une phrase naturelle avec ce mot."
  },
  {
    "category": "Apprentissage",
    "discipline": "Langues",
    "title": "Anglais : écoute active",
    "days": 14,
    "activity": "Écoute un court extrait en anglais, résume l’idée principale et relève deux mots."
  },
  {
    "category": "Apprentissage",
    "discipline": "Langues",
    "title": "Anglais : prononciation",
    "days": 7,
    "activity": "Choisis cinq mots, écoute leur prononciation et répète-les lentement."
  },
  {
    "category": "Apprentissage",
    "discipline": "Lecture",
    "title": "Lire 20 minutes",
    "days": 30,
    "activity": "Lis pendant vingt minutes et note une idée ou une citation courte reformulée."
  },
  {
    "category": "Apprentissage",
    "discipline": "Lecture",
    "title": "Une idée par jour",
    "days": 21,
    "activity": "Lis un article ou un chapitre et écris en une phrase ce que tu en retiens."
  },
  {
    "category": "Apprentissage",
    "discipline": "Lecture",
    "title": "Explorer un classique",
    "days": 30,
    "activity": "Lis quelques pages d’un classique et résume le passage avec tes propres mots."
  },
  {
    "category": "Apprentissage",
    "discipline": "Culture générale",
    "title": "Histoire du monde",
    "days": 30,
    "activity": "Explore un événement historique, sa date, son contexte et deux conséquences."
  },
  {
    "category": "Apprentissage",
    "discipline": "Culture générale",
    "title": "Géographie et pays",
    "days": 21,
    "activity": "Découvre un pays, sa capitale, ses langues et un fait culturel vérifié."
  },
  {
    "category": "Apprentissage",
    "discipline": "Culture générale",
    "title": "Art et musées",
    "days": 14,
    "activity": "Découvre une œuvre, son artiste et son contexte puis note ton impression."
  },
  {
    "category": "Apprentissage",
    "discipline": "Culture générale",
    "title": "Femmes qui ont marqué l’histoire",
    "days": 30,
    "activity": "Découvre le parcours d’une femme, ses réalisations et les obstacles de son époque."
  },
  {
    "category": "Apprentissage",
    "discipline": "Culture générale",
    "title": "Économie en 15 minutes",
    "days": 21,
    "activity": "Choisis un concept économique, définis-le et trouve un exemple concret."
  },
  {
    "category": "Apprentissage",
    "discipline": "Culture générale",
    "title": "Science du quotidien",
    "days": 14,
    "activity": "Choisis une question scientifique et note une explication issue d’une source fiable."
  },
  {
    "category": "Apprentissage",
    "discipline": "Numérique",
    "title": "Découvrir Python",
    "days": 30,
    "activity": "Lis un concept Python et écris un petit exemple dans ton environnement de pratique."
  },
  {
    "category": "Apprentissage",
    "discipline": "Numérique",
    "title": "Bases de l’intelligence artificielle",
    "days": 21,
    "activity": "Étudie une notion d’IA, puis note un usage et une limite."
  },
  {
    "category": "Apprentissage",
    "discipline": "Numérique",
    "title": "Culture cybersécurité",
    "days": 14,
    "activity": "Découvre une bonne pratique de protection des comptes et applique-la si utile."
  },
  {
    "category": "Apprentissage",
    "discipline": "Numérique",
    "title": "Excel et tableurs",
    "days": 21,
    "activity": "Teste une formule ou un tableau et note dans quel cas l’utiliser."
  },
  {
    "category": "Apprentissage",
    "discipline": "Numérique",
    "title": "Design et interfaces",
    "days": 14,
    "activity": "Observe une interface et décris une amélioration de lisibilité ou d’accessibilité."
  },
  {
    "category": "Apprentissage",
    "discipline": "Méthodes",
    "title": "Méthode de recherche",
    "days": 30,
    "activity": "Formule une question de recherche et note une source ou une méthode pertinente."
  },
  {
    "category": "Apprentissage",
    "discipline": "Méthodes",
    "title": "Esprit critique",
    "days": 21,
    "activity": "Prends une affirmation, cherche sa source et distingue faits et interprétations."
  },
  {
    "category": "Apprentissage",
    "discipline": "Méthodes",
    "title": "Prise de notes efficace",
    "days": 14,
    "activity": "Lis ou écoute un contenu court puis rédige cinq lignes de synthèse."
  },
  {
    "category": "Apprentissage",
    "discipline": "Méthodes",
    "title": "Mémorisation douce",
    "days": 21,
    "activity": "Révise une notion ancienne et explique-la de mémoire en trois phrases."
  },
  {
    "category": "Apprentissage",
    "discipline": "Méthodes",
    "title": "Prise de parole",
    "days": 14,
    "activity": "Prépare une intervention de deux minutes sur un sujet que tu connais."
  },
  {
    "category": "Créativité",
    "discipline": "Écriture",
    "title": "Journal créatif",
    "days": 30,
    "activity": "Écris librement pendant dix minutes sur un souvenir, une idée ou une observation."
  },
  {
    "category": "Créativité",
    "discipline": "Écriture",
    "title": "Une micro-histoire",
    "days": 14,
    "activity": "Écris cinq à dix lignes d’une histoire courte à partir d’un objet du quotidien."
  },
  {
    "category": "Créativité",
    "discipline": "Écriture",
    "title": "Trouver sa voix",
    "days": 21,
    "activity": "Réécris un court paragraphe en variant le rythme, la précision et le ton."
  },
  {
    "category": "Créativité",
    "discipline": "Photographie",
    "title": "Un regard par jour",
    "days": 30,
    "activity": "Prends une photo d’un détail intéressant et note pourquoi il t’a attiré."
  },
  {
    "category": "Créativité",
    "discipline": "Photographie",
    "title": "Composition photographique",
    "days": 14,
    "activity": "Essaie une règle de composition avec un sujet du quotidien."
  },
  {
    "category": "Créativité",
    "discipline": "Dessin",
    "title": "Croquis sans pression",
    "days": 21,
    "activity": "Dessine un objet pendant dix minutes sans rechercher un résultat parfait."
  },
  {
    "category": "Créativité",
    "discipline": "Cuisine",
    "title": "Une technique de cuisine",
    "days": 14,
    "activity": "Apprends une technique simple, note les étapes et ce que tu voudrais réessayer."
  },
  {
    "category": "Créativité",
    "discipline": "Culture",
    "title": "Découvrir un artiste",
    "days": 21,
    "activity": "Découvre une création artistique et note ce qu’elle t’évoque."
  },
  {
    "category": "Créativité",
    "discipline": "Projets",
    "title": "Projet personnel en petits pas",
    "days": 30,
    "activity": "Consacre quinze minutes à une seule étape concrète de ton projet."
  },
  {
    "category": "Organisation",
    "discipline": "Planification",
    "title": "Planifier sa semaine",
    "days": 7,
    "activity": "Choisis trois priorités réalistes et réserve du temps pour les réaliser."
  },
  {
    "category": "Organisation",
    "discipline": "Planification",
    "title": "Revue du soir",
    "days": 14,
    "activity": "Note ce qui a avancé, ce qui attendra et une priorité pour demain."
  },
  {
    "category": "Organisation",
    "discipline": "Planification",
    "title": "Une tâche importante",
    "days": 21,
    "activity": "Avance quinze minutes sur la tâche qui compte le plus aujourd’hui."
  },
  {
    "category": "Organisation",
    "discipline": "Environnement",
    "title": "Ranger un petit espace",
    "days": 14,
    "activity": "Range un seul tiroir, dossier ou espace pendant dix minutes."
  },
  {
    "category": "Organisation",
    "discipline": "Numérique",
    "title": "Désencombrer ses fichiers",
    "days": 21,
    "activity": "Classe ou supprime quelques fichiers non nécessaires après vérification."
  },
  {
    "category": "Organisation",
    "discipline": "Finances",
    "title": "Comprendre son budget",
    "days": 30,
    "activity": "Observe une catégorie de dépenses et note une décision éclairée pour le mois."
  },
  {
    "category": "Organisation",
    "discipline": "Finances",
    "title": "Culture financière",
    "days": 14,
    "activity": "Découvre un concept financier et explique-le avec un exemple simple."
  },
  {
    "category": "Organisation",
    "discipline": "Habitudes",
    "title": "Routine matinale souple",
    "days": 21,
    "activity": "Choisis une petite action utile pour commencer la journée, sans rigidité."
  },
  {
    "category": "Organisation",
    "discipline": "Habitudes",
    "title": "Routine de fin de journée",
    "days": 21,
    "activity": "Prépare un élément du lendemain et note une chose accomplie."
  },
  {
    "category": "Organisation",
    "discipline": "Habitudes",
    "title": "Une pause sans écran",
    "days": 7,
    "activity": "Accorde-toi dix minutes sans écran pour lire, marcher ou simplement te reposer."
  },
  {
    "category": "Bien-être",
    "discipline": "Émotions",
    "title": "Reconnaître ses émotions",
    "days": 21,
    "activity": "Nomme l’émotion principale du jour et note ce qui a pu la déclencher, sans jugement."
  },
  {
    "category": "Bien-être",
    "discipline": "Émotions",
    "title": "Apprendre à se calmer",
    "days": 14,
    "activity": "Pratique deux minutes de respiration confortable puis note ce qui t’aide."
  },
  {
    "category": "Bien-être",
    "discipline": "Émotions",
    "title": "Patience au quotidien",
    "days": 21,
    "activity": "Repère un moment d’impatience et essaie une pause avant de répondre."
  },
  {
    "category": "Bien-être",
    "discipline": "Émotions",
    "title": "Affirmation de soi",
    "days": 14,
    "activity": "Formule une demande ou une limite simple, avec calme et clarté."
  },
  {
    "category": "Bien-être",
    "discipline": "Émotions",
    "title": "Confiance dans ses choix",
    "days": 21,
    "activity": "Note une décision prise aujourd’hui et ce qui l’a guidée."
  },
  {
    "category": "Bien-être",
    "discipline": "Relations",
    "title": "Écoute attentive",
    "days": 14,
    "activity": "Écoute une personne sans l’interrompre puis reformule ce que tu as compris."
  },
  {
    "category": "Bien-être",
    "discipline": "Relations",
    "title": "Communication sereine",
    "days": 21,
    "activity": "Essaie une phrase commençant par « je » pour exprimer un besoin."
  },
  {
    "category": "Bien-être",
    "discipline": "Relations",
    "title": "Lâcher-prise réaliste",
    "days": 14,
    "activity": "Distingue une chose sur laquelle tu peux agir et une que tu ne contrôles pas."
  },
  {
    "category": "Bien-être",
    "discipline": "Présence",
    "title": "Gratitude sans obligation",
    "days": 21,
    "activity": "Note une chose appréciée aujourd’hui, même très petite."
  },
  {
    "category": "Bien-être",
    "discipline": "Présence",
    "title": "Respiration et ancrage",
    "days": 7,
    "activity": "Prends quelques respirations naturelles et observe cinq détails autour de toi."
  },
  {
    "category": "Habitudes",
    "discipline": "Lecture",
    "title": "Lire quelques pages",
    "days": 21,
    "activity": "Lis dix pages ou pendant dix minutes, selon ton envie."
  },
  {
    "category": "Habitudes",
    "discipline": "Vie quotidienne",
    "title": "Préparer un repas maison",
    "days": 14,
    "activity": "Prépare un plat simple en suivant une recette ou en improvisant."
  },
  {
    "category": "Habitudes",
    "discipline": "Vie quotidienne",
    "title": "Faire une pause dehors",
    "days": 21,
    "activity": "Prends l’air quelques minutes à ton rythme."
  },
  {
    "category": "Habitudes",
    "discipline": "Vie quotidienne",
    "title": "Mieux s’hydrater",
    "days": 14,
    "activity": "Pense à boire régulièrement selon ta soif et tes besoins."
  },
  {
    "category": "Habitudes",
    "discipline": "Vie quotidienne",
    "title": "Un moment pour soi",
    "days": 30,
    "activity": "Réserve dix minutes à une activité reposante que tu apprécies."
  }
];
export const SUGGESTED_TEMPLATES: ChallengeTemplate[] = SUGGESTIONS.map((s, i) => ({
  id: 'suggestion-' + String(i + 1).padStart(2, '0') + '-' + s.days,
  category: s.category, discipline: s.discipline, title: s.title,
  tagline: s.discipline + ' · ' + s.days + ' jours',
  tone: s.category === 'Apprentissage' ? 'chocolat' : s.category === 'Créativité' ? 'caramel' : 'sable',
  day: () => s.activity,
}));
