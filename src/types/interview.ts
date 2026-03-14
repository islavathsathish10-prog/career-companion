export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  password: string;
  college: string;
  branch: string;
  graduationYear: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  company: string;
  category: 'aptitude' | 'technical' | 'hr';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect: boolean;
  timeTaken: number;
}

export interface InterviewResult {
  aptitudeScore: number;
  technicalScore: number;
  hrScore: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  skillsToImprove: string[];
  answeredQuestions: AnsweredQuestion[];
}

export interface AnsweredQuestion {
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  category: string;
}

export type InterviewStage = 'register' | 'upload' | 'company-match' | 'aptitude' | 'technical' | 'coding' | 'ai-interview' | 'hr' | 'results';

export interface Company {
  id: string;
  name: string;
  logo: string;
  matchScore: number;
  skills: string[];
}
