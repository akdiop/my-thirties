import type { ChallengeTemplate } from './challenges';
type Idea = { id: string; title: string; exercise: string; days: number; instructions: string[] };
const IDEAS: Idea[] = [
  {
    "id": "wolof-quotidien",
    "title": "Wolof du quotidien",
    "exercise": "Vocabulaire et expressions utiles en wolof",
    "days": 30,
    "instructions": [
      "Apprends trois expressions courantes.",
      "Écoute leur prononciation auprès d’une source fiable.",
      "Utilise-en une dans une phrase."
    ]
  },
  {
    "id": "espagnol-initiation",
    "title": "Découvrir l’espagnol",
    "exercise": "Premiers échanges et vocabulaire",
    "days": 21,
    "instructions": [
      "Apprends cinq mots et une question simple.",
      "Répète la prononciation.",
      "Écris une courte phrase."
    ]
  },
  {
    "id": "lecture-idee",
    "title": "Une idée par jour",
    "exercise": "Lecture et réflexion",
    "days": 21,
    "instructions": [
      "Lis un article ou quelques pages.",
      "Résume une idée en une phrase.",
      "Note une question à approfondir."
    ]
  },
  {
    "id": "histoire",
    "title": "Découvrir l’histoire",
    "exercise": "Une découverte historique par jour",
    "days": 30,
    "instructions": [
      "Choisis un événement historique.",
      "Note sa date et son contexte.",
      "Explique une conséquence avec tes mots."
    ]
  },
  {
    "id": "geographie",
    "title": "Tour du monde culturel",
    "exercise": "Découvrir un pays et sa culture",
    "days": 30,
    "instructions": [
      "Choisis un pays.",
      "Repère sa capitale et ses langues.",
      "Découvre un élément culturel sourcé."
    ]
  },
  {
    "id": "femmes-histoire",
    "title": "Femmes qui ont marqué l’histoire",
    "exercise": "Parcours et réalisations de femmes",
    "days": 30,
    "instructions": [
      "Découvre le parcours d’une femme.",
      "Note ses réalisations.",
      "Identifie une question que son histoire soulève."
    ]
  },
  {
    "id": "economie",
    "title": "Économie du quotidien",
    "exercise": "Comprendre les concepts économiques",
    "days": 21,
    "instructions": [
      "Choisis un concept économique.",
      "Définis-le simplement.",
      "Trouve un exemple dans la vie quotidienne."
    ]
  },
  {
    "id": "ia",
    "title": "Comprendre l’intelligence artificielle",
    "exercise": "Fondamentaux et limites de l’IA",
    "days": 21,
    "instructions": [
      "Étudie une notion d’intelligence artificielle.",
      "Note un usage possible.",
      "Identifie une limite ou un risque."
    ]
  },
  {
    "id": "python",
    "title": "Découvrir Python",
    "exercise": "Programmation en petits pas",
    "days": 30,
    "instructions": [
      "Découvre une notion Python.",
      "Teste un exemple simple.",
      "Explique ce que fait le code."
    ]
  },
  {
    "id": "recherche",
    "title": "Méthodes de recherche",
    "exercise": "Approfondir une méthode de recherche",
    "days": 30,
    "instructions": [
      "Formule une question précise.",
      "Identifie une source ou une méthode adaptée.",
      "Note une limite possible."
    ]
  },
  {
    "id": "esprit-critique",
    "title": "Esprit critique",
    "exercise": "Vérifier avant de conclure",
    "days": 21,
    "instructions": [
      "Choisis une affirmation.",
      "Recherche une source crédible.",
      "Sépare les faits des interprétations."
    ]
  },
  {
    "id": "prise-parole",
    "title": "Parler avec clarté",
    "exercise": "Expression orale et confiance",
    "days": 14,
    "instructions": [
      "Choisis un sujet familier.",
      "Prépare trois idées.",
      "Présente-les en deux minutes."
    ]
  },
  {
    "id": "ecriture",
    "title": "Écriture créative",
    "exercise": "Écrire sans pression",
    "days": 30,
    "instructions": [
      "Choisis un détail du quotidien.",
      "Écris librement dix minutes.",
      "Relis et conserve une phrase que tu aimes."
    ]
  },
  {
    "id": "photo",
    "title": "Regard photographique",
    "exercise": "Observer et photographier",
    "days": 21,
    "instructions": [
      "Observe un détail intéressant.",
      "Prends une photo si tu le souhaites.",
      "Note pourquoi ce détail t’a attiré."
    ]
  },
  {
    "id": "organisation",
    "title": "Planifier avec souplesse",
    "exercise": "Priorités et gestion du temps",
    "days": 14,
    "instructions": [
      "Choisis une priorité réaliste.",
      "Consacre-lui dix minutes.",
      "Note la prochaine petite étape."
    ]
  },
  {
    "id": "budget",
    "title": "Culture financière",
    "exercise": "Comprendre son budget",
    "days": 21,
    "instructions": [
      "Choisis un concept financier.",
      "Note une explication simple.",
      "Réfléchis à son application dans la vie quotidienne."
    ]
  },
  {
    "id": "emotions",
    "title": "Comprendre ses émotions",
    "exercise": "Observation émotionnelle sans jugement",
    "days": 21,
    "instructions": [
      "Nomme l’émotion principale du jour.",
      "Observe son contexte.",
      "Note ce qui t’a aidé, sans diagnostic."
    ]
  },
  {
    "id": "communication",
    "title": "Communication apaisée",
    "exercise": "Écouter et exprimer ses besoins",
    "days": 21,
    "instructions": [
      "Observe une conversation du jour.",
      "Essaie de reformuler le point de vue de l’autre.",
      "Exprime un besoin clairement si cela convient."
    ]
  },
  {
    "id": "patience",
    "title": "Cultiver la patience",
    "exercise": "Petits exercices d’attention",
    "days": 14,
    "instructions": [
      "Repère une situation d’impatience.",
      "Fais une courte pause confortable.",
      "Note une réponse possible plus réfléchie."
    ]
  }
];
export const LEARNING_CHALLENGE_TEMPLATES: ChallengeTemplate[] = IDEAS.map((idea) => ({
  id: 'learning-' + idea.id,
  title: idea.title,
  exercise: idea.exercise,
  unit: 'minutes',
  start: 10,
  step: 0,
  stepEvery: 7,
  restEvery: 0,
  days: idea.days,
  sets: 1,
  instructions: idea.instructions,
  cautions: 'Progression facultative : adapte le rythme à ton temps et à ton énergie. Aucun jour manqué ne demande de rattrapage.',
  alternative: 'Consacre cinq minutes au sujet ou reporte la séance.',
}));
