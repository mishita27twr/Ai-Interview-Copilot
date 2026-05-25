import { FeedbackReport } from "../types/interview";
import { InterviewAnswer } from "./interviewSessionStore";

function pct(score: number, max: number) {
  return Math.round((score / max) * 100);
}

interface Tier {
  label: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  projectExplanationScore: number;
  confidenceScore: number;
  strengths: string[];
  weakAreas: string[];
  improvements: string[];
  recommendedSkills: string[];
  roadmap: string[];
  suggestedProjects: string[];
}

function buildTier(answers: InterviewAnswer[], role: string): Tier {
  const answered = answers.filter(a => a.score > 0);
  const avgScore = answers.length > 0
    ? answers.reduce((s, a) => s + a.score, 0) / answers.length
    : 0;
  const maxScore = 5;
  const avgPct = pct(avgScore, maxScore);

  const skipped = answers.filter(a => a.score === 0).length;
  const veryShort = answers.filter(a => a.score <= 2).length;
  const totalWords = answers.reduce((s, a) => s + a.wordCount, 0);
  const avgWords = answers.length > 0 ? Math.round(totalWords / answers.length) : 0;

  // ── FAILING (< 40%) ──────────────────────────────────────────────────────
  if (avgPct < 40) {
    return {
      label: "Not Ready",
      overallScore: Math.max(12, avgPct),
      technicalScore: Math.max(10, avgPct - 5),
      communicationScore: Math.max(8, avgPct - 8),
      problemSolvingScore: Math.max(10, avgPct - 3),
      projectExplanationScore: Math.max(10, avgPct),
      confidenceScore: Math.max(8, avgPct - 10),
      strengths: answered.length > 0
        ? ["Attempted the interview — completion alone requires courage"]
        : ["Created a PrepWise account — the first step to improvement"],
      weakAreas: [
        skipped > 0 ? `${skipped} question(s) left completely unanswered — instant red flag for any interviewer` : "Answers are far too brief to demonstrate competence",
        "Responses lack technical depth, examples, or structured reasoning",
        "Communication style does not convey professional confidence",
        `Average answer length of ${avgWords} words is well below the 80–120 word minimum interviewers expect`,
        `This performance would likely result in rejection at most ${role} roles`
      ].filter(Boolean) as string[],
      improvements: [
        "Do not go to any real interview until you can consistently write 80+ word answers with examples",
        "Learn and drill the STAR method (Situation, Task, Action, Result) for every question",
        "Study the fundamentals of your target role before your next practice session",
        "Practice with PrepWise daily for at least 2 weeks before attempting a real interview",
        "Research common interview questions for the role and prepare written answers in advance"
      ],
      recommendedSkills: [
        `${role} Core Fundamentals`,
        "Interview Communication Techniques",
        "STAR Method Structuring",
        "Professional Vocabulary"
      ],
      roadmap: [
        "Week 1–2: Study core concepts for your target role from scratch",
        "Week 3: Write and rehearse structured answers to 20 common interview questions",
        "Week 4: Complete 5+ mock interviews on PrepWise targeting a score above 60%",
        "Week 5–6: Focus on the specific weak areas identified in this report",
        "Week 7+: Apply for jobs only after consistently scoring above 65%"
      ],
      suggestedProjects: [
        `Build a basic portfolio project that demonstrates core ${role} skills`,
        "Document and explain your projects clearly — practice your verbal project walk-through"
      ]
    };
  }

  // ── BELOW AVERAGE (40–59%) ───────────────────────────────────────────────
  if (avgPct < 60) {
    return {
      label: "Needs Work",
      overallScore: avgPct,
      technicalScore: avgPct - 5,
      communicationScore: avgPct + 2,
      problemSolvingScore: avgPct - 3,
      projectExplanationScore: avgPct,
      confidenceScore: avgPct - 7,
      strengths: [
        "You engaged with the questions and attempted structured thinking",
        answered.length === answers.length ? "Completed all questions — shows persistence" : "Showed some understanding of domain concepts"
      ],
      weakAreas: [
        "Answers lack concrete examples — everything sounds theoretical and unverifiable",
        veryShort > 1 ? `${veryShort} answers were critically short and would fail most screening rounds` : "Depth of technical knowledge needs significant improvement",
        "Responses don't follow a recognisable structure (e.g., STAR, problem→solution)",
        "Confidence and delivery undermine otherwise passable content",
        "Would likely not pass an initial recruiter screen at top-tier companies"
      ],
      improvements: [
        "For every answer, include a real example from a project or past experience",
        "Aim for 80–120 words minimum — practice expanding your answers",
        "Use the STAR method: open every behavioural answer with a specific situation",
        "Record yourself answering 3 questions per day and review the recordings",
        "Study 2–3 technical concepts from your weak areas before your next session"
      ],
      recommendedSkills: [
        "Structured Interviewing Techniques",
        `${role} — Intermediate Concepts`,
        "Technical Communication",
        "Behavioural Question Frameworks"
      ],
      roadmap: [
        "Week 1: Identify your 3 biggest knowledge gaps from this report and study them",
        "Week 2: Write out 15 full STAR-format answers to common questions",
        "Week 3: Complete 3 mock interviews and review your transcripts critically",
        "Week 4: Focus on communication fluency — record and replay your answers"
      ],
      suggestedProjects: [
        `Build an end-to-end project demonstrating 3+ core ${role} skills`,
        "Write a case study or blog post explaining a technical decision you made"
      ]
    };
  }

  // ── AVERAGE (60–74%) ─────────────────────────────────────────────────────
  if (avgPct < 75) {
    return {
      label: "Developing",
      overallScore: avgPct,
      technicalScore: avgPct + 3,
      communicationScore: avgPct - 2,
      problemSolvingScore: avgPct + 1,
      projectExplanationScore: avgPct - 4,
      confidenceScore: avgPct - 3,
      strengths: [
        "Solid grasp of fundamentals — foundation is in place",
        "Answers are structured and mostly on-topic",
        "Shows genuine understanding rather than surface-level knowledge"
      ],
      weakAreas: [
        "Technical depth is inconsistent — strong on some topics, shallow on others",
        "Examples and evidence are sparse — interviewers want proof, not assertions",
        "Would likely struggle at senior or FAANG-level screening rounds"
      ],
      improvements: [
        "Back every claim with a specific, quantifiable example from real experience",
        "Strengthen your weakest 2–3 technical areas before your next interview",
        "Practice concise delivery — aim for sharp, structured answers under 2 minutes",
        "Research the specific company and tailor your examples to their domain"
      ],
      recommendedSkills: [
        `${role} — Advanced Patterns`,
        "System Design Basics",
        "Technical Storytelling",
        "Interview Polish & Delivery"
      ],
      roadmap: [
        "Week 1: Deep-dive into your weakest technical area identified here",
        "Week 2: Prepare 3 polished stories (project impact, challenge overcome, leadership)",
        "Week 3: Take 5 timed mock interviews and score each answer honestly",
        "Week 4: Apply and target mid-level roles — you're close to interview-ready"
      ],
      suggestedProjects: [
        `Build a production-quality ${role} project with clear impact metrics`,
        "Contribute to an open-source project and document your contribution clearly"
      ]
    };
  }

  // ── GOOD (75–84%) ────────────────────────────────────────────────────────
  if (avgPct < 85) {
    return {
      label: "Strong Candidate",
      overallScore: avgPct,
      technicalScore: avgPct + 5,
      communicationScore: avgPct + 2,
      problemSolvingScore: avgPct + 3,
      projectExplanationScore: avgPct,
      confidenceScore: avgPct - 2,
      strengths: [
        "Strong technical foundation with consistent, substantive answers",
        "Good use of examples and structured thinking across most responses",
        "Communication is clear and professional — interviewers would find you credible"
      ],
      weakAreas: [
        "A few answers lacked the precision needed for senior-level roles",
        "Could improve on articulating trade-offs and decision-making rationale"
      ],
      improvements: [
        "Sharpen your weakest 1–2 technical areas with focused study this week",
        "Practice explaining trade-offs explicitly — why did you choose approach A over B?",
        "Quantify impact in your examples (e.g., 'reduced load time by 40%')"
      ],
      recommendedSkills: ["System Design", "Advanced Architecture", "Negotiation & Offer Strategy"],
      roadmap: [
        "Week 1: Polish your 2 weakest areas with targeted practice",
        "Week 2: Prepare 5 strong project stories with quantified outcomes",
        "Week 3: Apply confidently — you're ready for most mid-to-senior interviews"
      ],
      suggestedProjects: [
        "Build and document a technically complex portfolio project showcasing depth",
        "Write a technical blog post on a complex topic in your domain"
      ]
    };
  }

  // ── EXCELLENT (85%+) ─────────────────────────────────────────────────────
  return {
    label: "Exceptional",
    overallScore: Math.min(97, avgPct),
    technicalScore: Math.min(99, avgPct + 5),
    communicationScore: Math.min(97, avgPct + 3),
    problemSolvingScore: Math.min(98, avgPct + 4),
    projectExplanationScore: Math.min(96, avgPct + 2),
    confidenceScore: Math.min(95, avgPct),
    strengths: [
      "Exceptional technical depth and articulate communication throughout",
      "Answers are comprehensive, structured, and backed by specific examples",
      "Executive-level presence — you'd impress interviewers at top-tier companies",
      "Demonstrates the ability to think through problems clearly under pressure"
    ],
    weakAreas: [
      "Minor gaps exist — maintain sharpness with continued practice"
    ],
    improvements: [
      "Focus on system design and architecture for senior/staff-level roles",
      "Prepare negotiation strategies — you're in a strong position",
      "Practice leadership and influence questions for principal/lead interviews"
    ],
    recommendedSkills: ["Staff-level System Design", "Technical Leadership", "Mentoring & Influence"],
    roadmap: [
      "Week 1: Target your preferred companies and tailor your application",
      "Week 2: Prepare company-specific examples and research their tech stack",
      "Week 3: Interview confidently — your readiness score is exceptional"
    ],
    suggestedProjects: [
      "Architect a large-scale distributed system and document the design decisions",
      "Lead an open-source project or publish advanced technical content"
    ]
  };
}

export function generateInterviewFeedback(answers: InterviewAnswer[], role: string): FeedbackReport {
  const tier = buildTier(answers, role);

  return {
    overallScore: tier.overallScore,
    scores: {
      technical: Math.max(0, Math.min(100, tier.technicalScore)),
      communication: Math.max(0, Math.min(100, tier.communicationScore)),
      problemSolving: Math.max(0, Math.min(100, tier.problemSolvingScore)),
      projectExplanation: Math.max(0, Math.min(100, tier.projectExplanationScore)),
      confidence: Math.max(0, Math.min(100, tier.confidenceScore)),
    },
    strengths: tier.strengths,
    weakAreas: tier.weakAreas,
    improvements: tier.improvements,
    recommendedSkills: tier.recommendedSkills,
    roadmap: tier.roadmap,
    suggestedProjects: tier.suggestedProjects,
  };
}
