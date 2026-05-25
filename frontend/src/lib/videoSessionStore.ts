import { VideoAnswer } from "./fluencyAnalysis";

interface VideoSession {
  role: string;
  difficulty: string;
  answers: VideoAnswer[];
}

export const videoSessionStore: VideoSession = {
  role: "Frontend Developer",
  difficulty: "Intermediate",
  answers: [],
};

export function resetVideoSession() {
  videoSessionStore.role = "Frontend Developer";
  videoSessionStore.difficulty = "Intermediate";
  videoSessionStore.answers = [];
}
