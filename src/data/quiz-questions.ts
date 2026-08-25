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
    question: "🚲 Un vélo de route croisé avec un VTT",
    acceptedAnswers: ["Gravel", "vélo gravel", "gravel bike"],
    difficulty: "easy",
  },
  {
    id: "q2",
    question: "🏢 L'ancien nom de cette tour",
    acceptedAnswers: [
      "tour du Crédit-Lyonnais",
      "tour du Crédit Lyonnais",
      "tour du credit lyonnais",
      "Crédit Lyonnais",
    ],
    difficulty: "easy",
  },
  {
    id: "q3",
    question: "🎵 Ca sent l'esprit jeune",
    acceptedAnswers: ["Nirvana"],
    difficulty: "easy",
  },
  {
    id: "q4",
    question: "🙅🏻‍♂️ Souvent confondue avec la Mairie",
    acceptedAnswers: ["CCI"],
    difficulty: "easy",
  },
  {
    id: "q5",
    question: "2+2=5",
    acceptedAnswers: ["Radiohead"],
    difficulty: "difficult",
  },
  {
    id: "q6",
    question: "🥁 Avant de tyranniser un jeune batteur il a tyrannisé Peter Parker",
    acceptedAnswers: ["J.K. Simmons", "JK Simmons", "J.K Simmons", "Simmons"],
    difficulty: "medium",
  },
  // {
  //   id: "q7",
  //   question: "📺 C'était une très belle chaine TV de jeu vidéo",
  //   acceptedAnswers: ["Game One"],
  //   difficulty: "medium",
  // },
  {
    id: "q8",
    question: "🤔 C'était le premier d'entre eux en 2010, depuis tout le monde l'a oublié",
    acceptedAnswers: ["Backbone.js", "Backbone", "BackboneJS"],
    difficulty: "difficult",
  },
  {
    id: "q9",
    question: "🎬 Grand acteur français décédé dont le nom sens bon le houblon",
    acceptedAnswers: ["Claude Brasseur", "Brasseur"],
    difficulty: "difficult",
  },
  {
    id: "q10",
    question: "🥸 Il est considéré comme le père de l'UX",
    acceptedAnswers: ["Don Norman"],
    difficulty: "medium",
  },
  {
    id: "q11",
    question: "♿️ Pourcentage de site web français pleinement accessibles",
    acceptedAnswers: ["10", "10%", "10 pourcent", "10 %"],
    difficulty: "difficult",
  },
  {
    id: "q12",
    question: "🌶️ L'album dans lequel on peut trouver ces paroles de refrain",
    acceptedAnswers: ["One Hot Minute"],
    difficulty: "medium",
  },
  {
    id: "q13",
    question: "🇧🇪 Le plus connu des philosophes belges",
    acceptedAnswers: ["JCVD", "Jean-Claude Van Damme", "Jean Claude Van Damme"],
    difficulty: "easy",
  },
  {
    id: "q14",
    question: "🎥 Comédienne Française du début du XXème.",
    acceptedAnswers: ["Sarah Bernhardt", "Sarah Bernhard"],
    difficulty: "difficult",
  },
  // {
  //   id: "q15",
  //   question: "😎 Son nom de scène vient du fait qu'il saute partout",
  //   acceptedAnswers: ["Flea"],
  //   difficulty: "medium",
  // },
  {
    id: "q16",
    question: "👨‍🎨 Quel est ce street artiste ?",
    acceptedAnswers: ["KLUK", "Benjamin Kluk", "Kluk"],
    difficulty: "GOD LEVEL",
  },
  // {
  //   id: "q17",
  //   question: "🎬 Le réalisateur de spiderman le plus prédestiné",
  //   acceptedAnswers: ["Marc Webb"],
  //   difficulty: "medium",
  // },
  {
    id: "q18",
    question: "👮🏻‍♂️ L'inspiration Antique de du Lieutenant Columbo",
    acceptedAnswers: ["Socrates", "Socrate"],
    difficulty: "GOD LEVEL",
  },
  {
    id: "q19",
    question: "🎤 Un célèbre morceau de RUN DMC",
    acceptedAnswers: ["My Adidas"],
    difficulty: "medium",
  },
  {
    id: "q20",
    question: "🎤 The Electric City !",
    acceptedAnswers: ["Scranton", "Scranton, Pennsylvanie"],
    difficulty: "GOD LEVEL",
  },
  {
    id: "q21",
    question: "🇹🇷 Le turque qui nous sauva à Lugdunum",
    acceptedAnswers: ["Burak Yılmaz", "Burak Yilmaz", "Yılmaz", "Yilmaz"],
    difficulty: "GOD LEVEL",
  },
  // {
  //   id: "q22",
  //   question: "🏃🏻 Physiologiquement il est en footing",
  //   acceptedAnswers: ["Jimmy Gressier", "Gressier"],
  //   difficulty: "difficult",
  // },
  {
    id: "q23",
    question: "🏴󠁧󠁢󠁷󠁬󠁳󠁿 C'est ainsi que le Gallois veut être considéré",
    acceptedAnswers: ["en tant que tel"],
    difficulty: "GOD LEVEL",
  },
  {
    id: "q24",
    question: "↔️ Le seul moyen de bouger deux pièces en même temps",
    acceptedAnswers: ["roque", "le roque", "petit roque", "grand roque"],
    difficulty: "medium",
  },
  // {
  //   id: "q25",
  //   question: "❓ C'est inscrit sur le meuble",
  //   acceptedAnswers: ["CI"],
  //   difficulty: "difficult",
  // },
];
