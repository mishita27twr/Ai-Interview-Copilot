import { FeedbackReport } from "../types/interview";

export const sampleFeedback: FeedbackReport = {
  overallScore: 88,
  scores: {
    technical: 92,
    communication: 85,
    problemSolving: 89,
    projectExplanation: 90,
    confidence: 84
  },
  strengths: [
    "Deep understanding of React hooks and rendering lifecycle",
    "Clear, concise explanations of complex architectural decisions",
    "Strong grasp of semantic HTML and accessibility best practices"
  ],
  weakAreas: [
    "Hesitation when discussing advanced Webpack/Vite configurations",
    "Could improve on explaining state machines for UI logic"
  ],
  improvements: [
    "Practice whiteboarding performance bottlenecks",
    "Speak more slowly when discussing unfamiliar topics"
  ],
  recommendedSkills: [
    "Advanced TypeScript Generics",
    "Web Workers",
    "Service Workers & PWA"
  ],
  roadmap: [
    "Week 1: Deep dive into bundlers and build tools",
    "Week 2: Build a complex application using state machines (XState)",
    "Week 3: Practice system design interviews for frontend architecture"
  ],
  suggestedProjects: [
    "Build a custom mini-bundler from scratch",
    "Implement a complex rich-text editor using Draft.js or ProseMirror"
  ]
};
