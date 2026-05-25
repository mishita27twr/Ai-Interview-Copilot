export interface InterviewConfig {
  role: string;
  difficulty: string;
  type: string;
}

export interface Question {
  id: string;
  text: string;
  topic: string;
}

export interface Answer {
  questionId: string;
  text: string;
  score?: number;
  feedback?: string;
}

export interface FeedbackReport {
  overallScore: number;
  scores: {
    technical: number;
    communication: number;
    problemSolving: number;
    projectExplanation: number;
    confidence: number;
  };
  strengths: string[];
  weakAreas: string[];
  improvements: string[];
  recommendedSkills: string[];
  roadmap: string[];
  suggestedProjects: string[];
}
