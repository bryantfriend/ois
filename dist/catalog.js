const SUBJECTS = [
  { id: "all", name: "All subjects", icon: "▦" },
  { id: "english", name: "English", icon: "Aa" },
  { id: "math", name: "Mathematics", icon: "+" },
  { id: "science", name: "Science", icon: "⚗" },
  { id: "humanities", name: "Humanities", icon: "◎" },
  { id: "global", name: "Global Perspectives", icon: "↗" },
  { id: "languages", name: "World Languages", icon: "文" }
];
// Concepts only. Add a playable route and change status when a game is built.
const GAMES = [
  { id: "word-detectives", title: "Word Detectives", subject: "english", grades: [1,2,3,4,5,6], mode: "Pairs or teams", minutes: "10–15 min", description: "Follow the clues, connect the words, and put vocabulary to work.", objective: "Build vocabulary and explain word choices using contextual clues.", artwork: "words", status: "concept" },
  { id: "number-quest", title: "Number Quest", subject: "math", grades: [1,2,3,4,5,6], mode: "Small teams", minutes: "15–20 min", description: "Turn number practice into a team adventure, one challenge at a time.", objective: "Practice number sense and share strategies for solving arithmetic challenges.", artwork: "numbers", status: "concept" },
  { id: "science-sort", title: "Science Sort", subject: "science", grades: [3,4,5,6,7,8], mode: "Whole class", minutes: "10–15 min", description: "Spot patterns, sort discoveries, and explain what belongs where.", objective: "Classify scientific examples and justify choices with evidence.", artwork: "science", status: "concept" },
  { id: "time-travellers", title: "Time Travellers", subject: "humanities", grades: [5,6,7,8,9,10,11,12], mode: "Small teams", minutes: "15–20 min", description: "Piece together the past and discover how one event leads to another.", objective: "Sequence historical events and discuss connections between causes and effects.", artwork: "time", status: "concept" },
  { id: "perspective-switch", title: "Perspective Switch", subject: "global", grades: [6,7,8,9,10,11,12], mode: "Discussion teams", minutes: "15–20 min", description: "Look at a big question through a different pair of eyes.", objective: "Compare viewpoints and support a position with reasons and evidence.", artwork: "perspectives", status: "concept" },
  { id: "conversation-cards", title: "Conversation Cards", subject: "languages", grades: [1,2,3,4,5,6,7,8,9,10,11,12], mode: "Pairs", minutes: "5–10 min", description: "A simple prompt, a new partner, and a reason to start talking.", objective: "Practice speaking and listening through short, structured exchanges.", artwork: "conversation", status: "concept" }
];
