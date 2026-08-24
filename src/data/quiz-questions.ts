export type QuizDifficulty = "easy" | "medium" | "difficult" | "GOD LEVEL";

export interface QuizQuestion {
  id: string;
  question: string;
  acceptedAnswers: string[];
  difficulty: QuizDifficulty;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Groupe de musique #1",
    acceptedAnswers: ["Nirvana"],
    difficulty: "easy",
  },
  {
    id: "q2",
    question: "Groupe de musique #2",
    acceptedAnswers: ["Radiohead"],
    difficulty: "easy",
  },
  {
    id: "q3",
    question: "Métisse vélo de route / VTT",
    acceptedAnswers: ["Gravel", "vélo gravel", "gravel bike"],
    difficulty: "easy",
  },
  {
    id: "q4",
    question:
      "Avant d'être un prof de batterie tyrannique, c'était un directeur d'un journal papier à NY",
    acceptedAnswers: ["J.K. Simmons", "JK Simmons", "J.K Simmons", "Simmons"],
    difficulty: "difficult",
  },
  {
    id: "q5",
    question: "Un vieux jeu dans lequel on pose des bombes",
    acceptedAnswers: ["Bomberman"],
    difficulty: "medium",
  },
  {
    id: "q6",
    question: "Avant son nom actuel (et si audacieux !)",
    acceptedAnswers: [
      "tour du Crédit-Lyonnais",
      "tour du Crédit Lyonnais",
      "tour du credit lyonnais",
      "Crédit Lyonnais",
    ],
    difficulty: "difficult",
  },
  {
    id: "q7",
    question: "Le café emblématique d'en face",
    acceptedAnswers: ["Morel", "Café Morel", "Le Morel"],
    difficulty: "difficult",
  },
  {
    id: "q8",
    question: "C'est le premier d'entre eux en 2010, depuis tout le monde l'a oublié",
    acceptedAnswers: ["Backbone.js", "Backbone", "BackboneJS"],
    difficulty: "difficult",
  },
  {
    id: "q9",
    question:
      "Grand acteur français décédé dont le nom sens bon le houblon",
    acceptedAnswers: ["Claude Brasseur", "Brasseur"],
    difficulty: "medium",
  },
  {
    id: "q10",
    question: "L'ui célèbre la plus détestée de france",
    acceptedAnswers: ["SNCF", "SNCF Connect"],
    difficulty: "medium",
  },
  {
    id: "q11",
    question: "Pourcentage de site web français pleinement accessibles",
    acceptedAnswers: ["10", "10%", "10 pourcent", "10 %"],
    difficulty: "difficult",
  },
  {
    id: "q12",
    question: "Ils avaient les yeux rouges",
    acceptedAnswers: ["Kurta", "clan Kurta", "les Kurta"],
    difficulty: "medium",
  },
  {
    id: "q13",
    question: "L'album dont est issus cet extrait de reffrain",
    acceptedAnswers: ["One Hot Minute"],
    difficulty: "medium",
  },
  {
    id: "q14",
    question: "Donnez votre coeur !",
    acceptedAnswers: ["Sasageyo", "Sasageyo!", "Shinzou wo Sasageyo"],
    difficulty: "medium",
  },
  {
    id: "q15",
    question: "Le plus connu des philosophes belges",
    acceptedAnswers: ["JCVD", "Jean-Claude Van Damme", "Jean Claude Van Damme"],
    difficulty: "easy",
  },
  {
    id: "q16",
    question: "Comédienne Française du début du XXème.",
    acceptedAnswers: ["Sarah Bernhardt", "Sarah Bernhard"],
    difficulty: "medium",
  },
  {
    id: "q17",
    question: "C'est une puce",
    acceptedAnswers: ["Flea"],
    difficulty: "medium",
  },
  {
    id: "q18",
    question: "Comment les flamandes dansent-elles ?",
    acceptedAnswers: ["sans frémir", "sans fremir"],
    difficulty: "difficult",
  },
  {
    id: "q19",
    question: "Il peut monter au plafond",
    acceptedAnswers: ["spidercochon", "Spider-Cochon", "Spider Pig"],
    difficulty: "easy",
  },
  {
    id: "q20",
    question: "L'inspiration Antique de du Lnt Columbo",
    acceptedAnswers: ["Socrates", "Socrate"],
    difficulty: "medium",
  },
  {
    id: "q21",
    question: "Un célèbre morceau de RUN DMC",
    acceptedAnswers: ["My Adidas"],
    difficulty: "medium",
  },
  {
    id: "q22",
    question: "The Electric City !",
    acceptedAnswers: ["Scranton", "Scranton, Pennsylvanie"],
    difficulty: "medium",
  },
  {
    id: "q23",
    question: "Il sauva le titre face à l'OL",
    acceptedAnswers: ["Burak Yılmaz", "Burak Yilmaz", "Yılmaz", "Yilmaz"],
    difficulty: "difficult",
  },
  {
    id: "q24",
    question: "Personnage caché du manga qui ne fait pas de kung fu…",
    acceptedAnswers: ["Pandaman", "Panda Man", "Panda man"],
    difficulty: "difficult",
  },
  {
    id: "q25",
    question: "Physiologiquement il est en footing…",
    acceptedAnswers: ["Jimmy Gressier", "Gressier"],
    difficulty: "medium",
  },
  {
    id: "q26",
    question: "C'est ainsi que le Gallois veut être considéré.",
    acceptedAnswers: ["en tant que tel"],
    difficulty: "medium",
  },
  {
    id: "q27",
    question:
      "Sur les réseaux sociaux, il aime humilier ses adversaires avec la danse des cavaliers",
    acceptedAnswers: ["Gartin59", "Gartin_59", "Gartin 59"],
    difficulty: "difficult",
  },
  {
    id: "q28",
    question: "Pro evolution…",
    acceptedAnswers: ["Soccer", "Pro Evolution Soccer"],
    difficulty: "easy",
  },
  {
    id: "q29",
    question: "Le numéro de cette formidable association",
    acceptedAnswers: ["301", "n°301", "numéro 301"],
    difficulty: "medium",
  },
  {
    id: "q30",
    question:
      "Il est plus fort que Chuck Norris, plus beau que Brad Pitt et coupe le bois comme personne! (référence secrète)",
    acceptedAnswers: ["Charles Ingalls", "Papa Ingalls"],
    difficulty: "GOD LEVEL",
  },
];
