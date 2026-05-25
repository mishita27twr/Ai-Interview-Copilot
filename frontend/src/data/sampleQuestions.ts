import { Question } from "../types/interview";

export const sampleQuestions: Record<string, Question[]> = {
  "Frontend Developer": [
    { id: "q1", topic: "React", text: "Explain how React's reconciliation process works. Why does it use a virtual DOM?" },
    { id: "q2", topic: "Performance", text: "What are some techniques you would use to optimize the performance of a large React application?" },
    { id: "q3", topic: "CSS", text: "How do you handle CSS scoping in a complex application? Discuss the pros and cons of CSS Modules vs Tailwind." },
    { id: "q4", topic: "State Management", text: "When would you choose Context API over Redux or Zustand, and vice versa?" },
    { id: "q5", topic: "TypeScript", text: "Explain the difference between 'interface' and 'type' in TypeScript. When would you use one over the other?" }
  ]
};
