export interface InterviewAnswer {
  questionId: string;
  questionText: string;
  answerText: string;
  score: number;
  wordCount: number;
  feedback: string;
}

export interface InterviewSession {
  role: string;
  difficulty: string;
  type: string;
  answers: InterviewAnswer[];
}

export const interviewSession: InterviewSession = {
  role: "Frontend Developer",
  difficulty: "Intermediate",
  type: "Mixed",
  answers: [],
};

export function setInterviewConfig(role: string, difficulty: string, type: string) {
  interviewSession.role = role;
  interviewSession.difficulty = difficulty;
  interviewSession.type = type;
  interviewSession.answers = [];
}

export function resetInterviewSession() {
  interviewSession.answers = [];
}

export function scoreAnswer(text: string): { score: number; feedback: string } {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount === 0) {
    return { score: 0, feedback: "No answer provided. Interviewers will disqualify candidates who skip questions entirely." };
  }
  if (wordCount < 12) {
    return { score: 1, feedback: "Answer is critically too brief. A one-liner shows lack of preparation and depth." };
  }
  if (wordCount < 30) {
    return { score: 2, feedback: "Too short. You need to explain your reasoning, give examples, and show you understand the topic fully." };
  }
  if (wordCount < 60) {
    return { score: 3, feedback: "Adequate, but lacks depth. Add a concrete example and clarify your thought process." };
  }
  if (wordCount < 100) {
    return { score: 4, feedback: "Solid answer. Structure it with STAR (Situation, Task, Action, Result) for even more impact." };
  }
  return { score: 5, feedback: "Comprehensive and well-articulated. This demonstrates strong preparation and command of the topic." };
}
