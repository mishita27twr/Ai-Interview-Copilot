import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Send, BrainCircuit, ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleQuestions } from "@/data/sampleQuestions";
import { interviewSession, scoreAnswer } from "@/lib/interviewSessionStore";
import type { InterviewAnswer } from "@/lib/interviewSessionStore";

const SCORE_COLORS: Record<number, string> = {
  0: "text-red-700 bg-red-50 border-red-200",
  1: "text-red-700 bg-red-50 border-red-200",
  2: "text-orange-700 bg-orange-50 border-orange-200",
  3: "text-amber-700 bg-amber-50 border-amber-200",
  4: "text-green-700 bg-green-50 border-green-200",
  5: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

const SCORE_LABELS: Record<number, string> = {
  0: "No Answer",
  1: "Poor",
  2: "Weak",
  3: "Adequate",
  4: "Good",
  5: "Excellent",
};

export function Interview() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; text: string } | null>(null);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [displayedText, setDisplayedText] = useState("");

  const role = interviewSession.role || "Frontend Developer";
  const questions = sampleQuestions[role] ?? sampleQuestions["Frontend Developer"];
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    interviewSession.answers = [];
    setAnswers([]);
  }, []);

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(currentQuestion.text.slice(0, i));
      i++;
      if (i > currentQuestion.text.length) clearInterval(intervalId);
    }, 18);
    return () => clearInterval(intervalId);
  }, [currentQuestion.text]);

  const handleSubmit = () => {
    setIsProcessing(true);
    const { score, feedback: feedbackText } = scoreAnswer(answerText);
    setTimeout(() => {
      setFeedback({ score, text: feedbackText });
      setIsProcessing(false);
    }, 900);
  };

  const handleNext = () => {
    const { score, feedback: feedbackText } = scoreAnswer(answerText);
    const words = answerText.trim().split(/\s+/).filter(Boolean);
    const answer: InterviewAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerText,
      score,
      wordCount: words.length,
      feedback: feedbackText,
    };
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    interviewSession.answers = updatedAnswers;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswerText("");
      setFeedback(null);
    } else {
      setLocation("/feedback");
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswerText("");
    setFeedback(null);
    setAnswers([]);
    interviewSession.answers = [];
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 flex flex-col min-h-[calc(100vh-140px)]">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm font-medium text-secondary-text uppercase tracking-widest">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-primary" : i < currentIndex ? "w-4 bg-primary/40" : "w-4 bg-border/40"
                }`}
              />
            ))}
          </div>
          <button
            data-testid="button-restart-interview"
            onClick={handleRestart}
            className="flex items-center gap-1.5 text-xs text-secondary-text hover:text-primary transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-6">

        {/* Question Bubble */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          key={`q-${currentIndex}`}
          className="glass-card rounded-3xl p-6 sm:p-8 max-w-[85%] self-start shadow-md relative"
        >
          <div className="absolute -left-3 top-8 w-6 h-6 rounded-full bg-surface border border-border/50 flex items-center justify-center text-primary shadow-sm">
            <BrainCircuit className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs text-secondary-text mb-2 font-medium bg-surface px-2 py-0.5 rounded-md inline-block">
            {currentQuestion.topic}
          </div>
          <p className="text-xl md:text-2xl font-serif text-primary-text leading-relaxed">
            {displayedText}
            <span className="inline-block w-1.5 h-6 bg-primary ml-1 animate-pulse align-middle" />
          </p>
        </motion.div>

        {/* Score Feedback Bubble */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`border rounded-2xl p-5 max-w-[85%] self-start flex gap-4 items-start shadow-sm ${SCORE_COLORS[feedback.score]}`}
            >
              <div className={`w-16 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-sm shrink-0 border ${SCORE_COLORS[feedback.score]}`}>
                <span className="text-lg leading-none">{feedback.score}/5</span>
                <span className="text-[10px] font-medium opacity-80">{SCORE_LABELS[feedback.score]}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">AI Evaluation</h4>
                <p className="text-sm leading-relaxed">{feedback.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Area */}
        <div className="mt-auto pt-8">
          <div className="relative">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              disabled={isProcessing || feedback !== null}
              placeholder="Structure your thoughts and articulate your response clearly..."
              data-testid="input-answer"
              className="w-full min-h-[160px] p-6 pr-20 bg-white/70 backdrop-blur-md border border-border/50 rounded-3xl shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary-text text-lg transition-all disabled:opacity-60 disabled:bg-surface"
            />
            <div className="absolute bottom-6 right-6 flex items-center gap-2">
              {!feedback ? (
                <Button
                  size="icon"
                  onClick={handleSubmit}
                  disabled={!answerText.trim() || isProcessing}
                  data-testid="button-submit-text-answer"
                  className="w-12 h-12 rounded-full bg-primary hover:bg-[#5A3F2C] text-white shadow-md transition-transform hover:scale-105"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  data-testid="button-next-question"
                  className="h-12 px-6 rounded-full bg-primary hover:bg-[#5A3F2C] text-white shadow-md transition-transform hover:scale-105"
                >
                  {currentIndex < questions.length - 1 ? "Next Question" : "View Report"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs text-secondary-text px-2">
            <span>Aim for 80+ words — brief answers score poorly.</span>
            <span className={answerText.split(/\s+/).filter(Boolean).length < 30 && answerText.length > 0 ? "text-orange-600 font-medium" : ""}>
              {answerText.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
