export interface VideoAnswer {
  questionId: string;
  questionText: string;
  transcript: string;
  durationSeconds: number;
}

export interface QuestionFluencyResult {
  questionId: string;
  questionText: string;
  transcript: string;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerWords: string[];
  uniqueWordRatio: number;
  answerScore: number;
}

export interface FluencyReport {
  overallScore: number;
  communicationScore: number;
  fluencyScore: number;
  clarityScore: number;
  confidenceScore: number;
  avgWpm: number;
  totalFillerWords: number;
  totalWords: number;
  avgUniqueWordRatio: number;
  questionResults: QuestionFluencyResult[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

const FILLER_WORDS = [
  "um", "uh", "like", "basically", "literally", "actually", "honestly",
  "you know", "sort of", "kind of", "i mean", "right", "okay so",
  "well", "so yeah", "yeah so"
];

export function analyzeQuestion(answer: VideoAnswer): QuestionFluencyResult {
  const text = answer.transcript.toLowerCase().trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const durationMinutes = Math.max(answer.durationSeconds / 60, 0.1);
  const wpm = Math.round(wordCount / durationMinutes);

  const foundFillers: string[] = [];
  let fillerCount = 0;
  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, "g");
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      fillerCount += matches.length;
      foundFillers.push(filler);
    }
  }

  const uniqueWords = new Set(words);
  const uniqueWordRatio = wordCount > 0 ? uniqueWords.size / wordCount : 0;

  const wpmScore = wpm >= 100 && wpm <= 160 ? 100 : wpm < 60 ? 40 : wpm > 200 ? 50 : wpm < 100 ? 60 + (wpm - 60) : 100 - (wpm - 160) * 0.5;
  const fillerPenalty = Math.min(fillerCount * 5, 40);
  const diversityScore = uniqueWordRatio * 100;
  const lengthScore = wordCount < 20 ? 40 : wordCount > 300 ? 80 : Math.min(100, wordCount / 2);

  const answerScore = Math.round(
    Math.max(0, Math.min(100,
      wpmScore * 0.3 +
      (100 - fillerPenalty) * 0.3 +
      diversityScore * 0.2 +
      lengthScore * 0.2
    ))
  );

  return {
    questionId: answer.questionId,
    questionText: answer.questionText,
    transcript: answer.transcript,
    wordCount,
    wpm,
    fillerCount,
    fillerWords: foundFillers,
    uniqueWordRatio,
    answerScore,
  };
}

export function generateFluencyReport(answers: VideoAnswer[]): FluencyReport {
  const results = answers.map(analyzeQuestion);

  const totalWords = results.reduce((s, r) => s + r.wordCount, 0);
  const avgWpm = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.wpm, 0) / results.length)
    : 0;
  const totalFillerWords = results.reduce((s, r) => s + r.fillerCount, 0);
  const avgUniqueWordRatio = results.length > 0
    ? results.reduce((s, r) => s + r.uniqueWordRatio, 0) / results.length
    : 0;

  const avgAnswerScore = results.length > 0
    ? results.reduce((s, r) => s + r.answerScore, 0) / results.length
    : 0;

  const wpmScore = avgWpm >= 100 && avgWpm <= 160 ? 85 : avgWpm < 60 ? 40 : avgWpm > 200 ? 50 : 70;
  const fillerRatio = totalWords > 0 ? totalFillerWords / totalWords : 0;
  const fluencyScore = Math.round(Math.max(30, Math.min(100, 100 - fillerRatio * 300)));
  const clarityScore = Math.round(Math.min(100, avgUniqueWordRatio * 110));
  const confidenceScore = Math.round(
    Math.max(30, Math.min(100, wpmScore * 0.5 + fluencyScore * 0.5))
  );
  const communicationScore = Math.round(
    (fluencyScore * 0.35 + clarityScore * 0.35 + confidenceScore * 0.3)
  );
  const overallScore = Math.round(avgAnswerScore * 0.5 + communicationScore * 0.5);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const improvements: string[] = [];

  if (fluencyScore >= 75) strengths.push("Minimal use of filler words — you sound prepared and confident");
  if (clarityScore >= 70) strengths.push("Strong vocabulary diversity reflects clear, articulate thinking");
  if (avgWpm >= 100 && avgWpm <= 160) strengths.push("Your speaking pace is natural and easy to follow");
  if (totalWords > 100) strengths.push("Answers are substantive and well-developed");
  if (avgAnswerScore >= 70) strengths.push("Solid technical content across your responses");

  if (fluencyScore < 65) weaknesses.push("Frequent filler words disrupt your delivery and signal hesitation");
  if (avgWpm < 80) weaknesses.push("Speaking pace is too slow — can come across as uncertain");
  if (avgWpm > 180) weaknesses.push("Speaking pace is too fast — interviewers may struggle to follow");
  if (clarityScore < 55) weaknesses.push("Limited vocabulary variety makes answers sound repetitive");
  if (totalWords < 80) weaknesses.push("Answers are too brief — interviewers expect depth and examples");

  if (totalFillerWords > 5) improvements.push("Practice with a recording app to catch and eliminate filler words");
  if (avgWpm < 90 || avgWpm > 170) improvements.push("Use timed practice drills to calibrate a 120–150 WPM speaking pace");
  improvements.push("Structure every answer using the STAR method (Situation, Task, Action, Result)");
  improvements.push("Record yourself answering 3 questions daily and review for clarity");
  if (clarityScore < 65) improvements.push("Read widely and expand your professional vocabulary in your field");

  if (strengths.length === 0) strengths.push("You completed the interview — that itself shows commitment and readiness to improve");

  return {
    overallScore,
    communicationScore,
    fluencyScore,
    clarityScore,
    confidenceScore,
    avgWpm,
    totalFillerWords,
    totalWords,
    avgUniqueWordRatio,
    questionResults: results,
    strengths,
    weaknesses,
    improvements,
  };
}
