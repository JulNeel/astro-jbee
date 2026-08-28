export type QuizDifficulty = "easy" | "medium" | "difficult" | "GOD LEVEL";

export interface QuizQuestion {
  id: string;
  question: string;
  acceptedAnswers: string[];
  answer: string;
  difficulty: QuizDifficulty;
  funFact: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "🚲 Un vélo de route croisé avec un VTT",
    acceptedAnswers: ["Gravel", "vélo gravel", "gravel bike"],
    answer: "Gravel",
    difficulty: "easy",
    funFact: "« Gravel » (signifiant en anglais gravier) désigne un type de vélo hybride destiné à rouler sur les chemins caillouteux, combinant des caractéristiques du vélo de route et du vélo tout-terrain. Il est également parfait pour la ville ! (Wikipédia)"
  },
  // {
  //   id: "q2",
  //   question: "🏢 L'ancien nom de cette tour",
  //   acceptedAnswers: [
  //     "tour du Crédit-Lyonnais",
  //     "tour du Crédit Lyonnais",
  //     "tour du credit lyonnais",
  //     "Crédit Lyonnais",
  //   ],
  //   answer: "La tour du Crédit Lyonnais",
  //   difficulty: "easy",
  //   funFact: "La tour de Lille (anciennement appelée jusqu'en 2006 tour du Crédit-Lyonnais[1]) est une tour de bureaux située dans le quartier d'affaires Euralille, à Lille, France, œuvre de Christian de Portzamparc. Cette tour emblématique de la ville de Lille est également appelée « la chaussure de ski », « la botte de ski », « le flipper » ou encore « le L ». (Wikipédia)"
  // },
  // {
  //   id: "q3",
  //   question: "🎵 Ça sent l'esprit jeune",
  //   acceptedAnswers: ["Nirvana"],
  //   answer: "Nirvana",
  //   difficulty: "easy",
  //   funFact: "Smells Like Teen Spirit est la première chanson de l'album Nevermind, du groupe américain Nirvana, sorti en 1991. Composée un peu avant l'enregistrement de l'album, elle doit son nom à une référence faite par une amie de Kurt Cobain, le chanteur du groupe, à une marque de déodorant nommée Teen Spirit, alors que Cobain pensait y voir une allusion anarchiste. Le titre utilise une dynamique inspirée des Pixies qui joue sur l'alternance entre couplets calmes et refrain puissant avec un riff principal à quatre accords. Ses paroles semblent dépourvues de sens et ont donné lieu à diverses interprétations, parfois contradictoires. (Wikipédia)"
  // },
  {
    id: "q4",
    question: "🙅🏻‍♂️ Souvent confondue avec la Mairie de Lille",
    acceptedAnswers: ["CCI", "nouvelle bourse", "chambre de commerce"],
    answer: "La CCI (chambre de commerce)",
    difficulty: "easy",
    funFact: "La chambre de commerce de Lille est un édifice construit au début du XXe siècle. Son beffroi de 76 m de hauteur et de style néo-flamand est doté d'un carillon automatisé et est emblématique de la ville de Lille. Toutefois il ne faut pas le confondre avec le beffroi de l'Hôtel de ville, situé un peu plus loin et de style Art déco. (Wikipédia)"
  },
  // {
  //   id: "q13",
  //   question: "🇧🇪 Le plus connu des philosophes belges",
  //   acceptedAnswers: ["JCVD", "Jean-Claude Van Damme", "Jean Claude Van Damme", "Jean-Claude Van Dam", "Jean Claude Van Dam", "vandamme", "vandam" ],
  //   answer: "Jean-Claude Van Damme",
  //   difficulty: "easy",
  //   funFact: "Que fait JCVD quand il rentre dans une voiture ? Il Full Contact !"
  // },
  {
    id: "q10",
    question: "🚷 Le nom poétique des sentiers qui apparaissent naturellement par un usage répété",
    acceptedAnswers: ["ligne de désir", "lignes de désir", "chemin de désir", "chemins de désir"],
    answer: "Une ligne de désir",
    difficulty: "difficult",
    funFact: "Une ligne de désir, appelée aussi chemin de désir par les géographes, urbanistes et architectes, est un sentier tracé graduellement par érosion à la suite du passage répété de piétons, cyclistes ou animaux. La présence de lignes de désir (à travers les parcs ou terrains vagues) signale un aménagement urbain inapproprié des passages existants. En UX, un chemin de désir est un comportement détourné qui révèle un écart entre le parcours que vous avez conçu et celui dont les gens ont besoin."
  },
  // {
  //   id: "q12",
  //   question: "🌶️ L'album dans lequel on peut trouver ces paroles de refrain",
  //   acceptedAnswers: ["One Hot Minute"],
  //   answer: "One Hot Minute",
  //   difficulty: "medium",
  //   funFact: "One Hot Minute est le premier album enregistré sans le guitariste historique depuis son arrivée au sein du groupe ; il sera alors remplacé par Dave Navarro (Jane's Addiction). (Wikipédia)"
  // },
  // {
  //   id: "q16",
  //   question: "👨‍🎨 Un street artist roubaisien",
  //   acceptedAnswers: ["KLUK", "Benjamin Kluk", "Kluk"],
  //   answer: "Kluk",
  //   difficulty: "medium",
  //   funFact: "https://www.instagram.com/benjamin_kluk/?hl=fr"
  // },
  {
    id: "q19",
    question: "🎤 Un célèbre morceau de RUN DMC",
    acceptedAnswers: ["My Adidas", "Adidas"],
    answer: "My Adidas",
    difficulty: "easy",
    funFact: "Pendant la tournée Raising Hell, Run demande au public de lever ses baskets en l'air — et des milliers de paires d'Adidas se dressent dans la salle. Russell Simmons avait fait venir un cadre d'Adidas, Angelo Anastasio, précisément pour qu'il voie ça. Il a compris immédiatement."
  },
  {
    id: "q24",
    question: "↔️ Le seul moyen de bouger deux pièces en même temps",
    acceptedAnswers: ["roque", "le roque", "petit roque", "grand roque"],
    answer: "Le roque",
    difficulty: "medium",
    funFact: "Le mot « roque » vient du mot persan pour char, l'ancien nom de la tour, « roukh » (رخ) [réf. nécessaire], également à l'origine du nom anglais de la tour, « rook » [réf. nécessaire]. (Wikipédia)"
  },
  // {
  //   id: "q5",
  //   question: "🧮 2+2=5",
  //   acceptedAnswers: ["Radiohead"],
  //   answer: "Radiohead",
  //   difficulty: "difficult",
  //   funFact: "2 + 2 = 5 est une chanson de Radiohead. Le titre de la chanson est une référence au livre 1984 de George Orwell[2]. Dans le livre, le monde est séparé en trois super-États totalitaires dans lesquels on substitue à la conscience des gens une double pensée, contrôlant et prévoyant ainsi leurs faits et gestes. (Wikipédia)"
  // },
  {
    id: "q8",
    question: "🍎 ('b' + 'a' + + 'a' + 'a').toLowerCase() dans le langage d'internet... on cherche un fruit ",
    acceptedAnswers: ["Banana", "Banane"],
    answer: "banana",
    difficulty: "difficult",
    funFact: "Le double + force une conversion numérique du deuxième 'a', ce qui produit NaN, qui se concatène en texte. Quoi qu'on en dise, JavaScript, c'est marrant quand même, non ?",
  },
  // {
  //   id: "q9",
  //   question: "🎬 Grand acteur français décédé dont le nom sent bon le houblon",
  //   acceptedAnswers: ["Claude Brasseur", "Brasseur"],
  //   answer: "Claude Brasseur",
  //   difficulty: "difficult",
  //   funFact: "Désolé pour celle-ci, j'étais en manque d'inspiration..."
  // },
  {
    id: "q11",
    question: "♿️ Pourcentage de sites web français pleinement accessibles (c'est facile à trouver mais ça, vous le saurez !)",
    acceptedAnswers: ["10", "10%", "10 pourcent", "10 %"],
    answer: "10 %",
    difficulty: "medium",
    funFact: "Que dire ?"
  },
  // {
  //   id: "q14",
  //   question: "🍷 Apprécié des amoureux de Belle-île et des amateurs de vin",
  //   acceptedAnswers: ["Tire-Bouchon", "Tire bouchon"],
  //   answer: "Le Tire-Bouchon",
  //   difficulty: "difficult",
  //   funFact: "Le Tire-Bouchon, c'est le TER estival qui relie Auray à la presqu'île de Quiberon, dans le Morbihan. Son nom vient de sa fonction première : réduire les bouchons sur la route de la presqu'île, souvent saturée l'été."
  // },
  {
    id: "q20",
    question: "🎤 La ville électrique",
    acceptedAnswers: ["Scranton", "Scranton, Pennsylvanie"],
    answer: "Scranton",
    difficulty: "GOD LEVEL",
    funFact: "Les images de Scranton qu'on voit dans le générique ont été tournées par John Krasinski lui-même, avant même qu'il ne décroche le rôle de Jim. Il était monté là-bas avec une caméra pour filmer la ville et interviewer de vrais employés de bureau, histoire de se documenter sur l'ambiance. Une partie de ces plans a fini dans le générique définitif."
  },
  {
    id: "q6",
    question: "🥁 Au cinéma, avant de terroriser un jeune batteur, il passait son temps à humilier Peter Parker",
    acceptedAnswers: ["J.K. Simmons", "JK Simmons", "J.K Simmons", "Simmons", ],
    answer: "J.K. Simmons",
    difficulty: "medium",
    funFact: "J.K. Simmons commence à se faire connaître du grand public en jouant le directeur du Daily Bugle, J. Jonah Jameson, dans la trilogie Spider-Man (2002-2007) de Sam Raimi. [...] La consécration n'arrive qu'en 2014 avec le film Whiplash de Damien Chazelle. Son rôle de professeur de musique despotique lui vaut de nombreuses récompenses, dont l'Oscar du meilleur acteur dans un second rôle. (Wikipédia)"
  },
  // {
  //   id: "q18",
  //   question: "👮🏻‍♂️ L'inspiration antique du Lieutenant Columbo",
  //   acceptedAnswers: ["Socrates", "Socrate"],
  //   answer: "Socrate",
  //   difficulty: "GOD LEVEL",
  //   funFact: "Ils ne ressemblent à rien, ils feignent l'ignorance, et retournent la condescendance des puissants contre eux-mêmes !"
  // },
  // {
  //   id: "q21",
  //   question: "🇹🇷 Le Turc qui nous sauva à Lugdunum",
  //   acceptedAnswers: ["Burak Yılmaz", "Burak Yilmaz", "Yılmaz", "Yilmaz"],
  //   answer: "Burak Yılmaz",
  //   difficulty: "GOD LEVEL",
  //   funFact: "Quand Burak Yılmaz renversait l'OL pour aller chercher le titre 🔥 https://www.youtube.com/watch?v=VQt1u9Zdjpg"
  // },
  {
    id: "q23",
    question: "🏴󠁧󠁢󠁷󠁬󠁳󠁿 C'est ainsi que le Gallois veut être considéré",
    acceptedAnswers: ["en tant que tel", "en tant que telle"],
    answer: "En tant que tel",
    difficulty: "GOD LEVEL",
    funFact: "Dans la légende arthurienne, Perceval est le chevalier pur, le « simple » au sens noble, celui qui approche le Graal parce que son cœur est sans calcul. (Wikipédia)"
  },
  // {
  //   id: "q7",
  //   question: "📺 C'était une très belle chaine TV de jeu vidéo",
  //   acceptedAnswers: ["Game One"],
  //   difficulty: "medium",
  // },
  // {
  //   id: "q15",
  //   question: "😎 Son nom de scène vient du fait qu'il saute partout",
  //   acceptedAnswers: ["Flea"],
  //   difficulty: "medium",
  // },
  // {
  //   id: "q17",
  //   question: "🎬 Le réalisateur de spiderman le plus prédestiné",
  //   acceptedAnswers: ["Marc Webb"],
  //   difficulty: "medium",
  // },
  // {
  //   id: "q22",
  //   question: "🏃🏻 Physiologiquement il est en footing",
  //   acceptedAnswers: ["Jimmy Gressier", "Gressier"],
  //   difficulty: "difficult",
  // },
  // {
  //   id: "q25",
  //   question: "❓ C'est inscrit sur le meuble",
  //   acceptedAnswers: ["CI"],
  //   difficulty: "difficult",
  // },
];
