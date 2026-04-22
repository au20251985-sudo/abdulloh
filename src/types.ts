export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'Grammar' | 'Vocabulary' | 'Reading';
}

export interface QuizResult {
  score: number;
  total: number;
  level: Level;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
  timeSpent: number;
}
