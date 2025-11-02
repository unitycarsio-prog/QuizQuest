
export enum GameState {
  HOME,
  QUIZ,
  RESULTS,
  LEADERBOARD,
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizSettings {
  nickname: string;
  grade: string;
  subject: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}
