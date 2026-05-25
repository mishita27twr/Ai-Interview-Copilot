import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  MessageSquare, Download, Trophy, Target, TrendingUp,
  AlertTriangle, RotateCcw, XCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { interviewSession, resetInterviewSession } from "@/lib/interviewSessionStore";
import { generateInterviewFeedback } from "@/lib/interviewFeedback";
import { sampleFeedback } from "@/data/sampleFeedback";
import type { FeedbackReport } from "@/types/interview";

const SCORE_TIER_COLOR = (score: number) =>
  score >= 75 ? "text-green-700" : score >= 55 ? "text-amber-700" : "text-red-700";

const SCORE_BAR_COLOR = (score: number) =>
  score >= 75 ? "bg-green-600/70" : score >= 55 ? "bg-amber-600/70" : "bg-red-500/70";

const TIER_BADGE: Record<string, { bg: string; text: string }> = {
  "Not Ready":       { bg: "bg-red-100 border-red-300",    text: "text-red-800" },
  "Needs Work":      { bg: "bg-orange-100 border-orange-300", text: "text-orange-800" },
  "Developing":      { bg: "bg-amber-100 border-amber-300",  text: "text-amber-800" },
  "Strong Candidate":{ bg: "bg-green-100 border-green-300",  text: "text-green-800" },
  "Exceptional":     { bg: "bg-emerald-100 border-emerald-300", text: "text-emerald-800" },
};

function getTierLabel(score: number) {
  if (score < 40) return "Not Ready";
  if (score < 60) return "Needs Work";
  if (score < 75) return "Developing";
  if (score < 85) return "Strong Candidate";
  return "Exceptional";
}

function AnswerBreakdown() {
  const [open, setOpen] = useState(false);
  const answers = interviewSession.answers;
  if (!answers.length) return null;

  return (
    <div className="glass-card rounded-3xl border border-primary/10 overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-6 text-left hover:bg-surface/30 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <h3 className="font-serif text-xl text-primary-text">Per-Question Breakdown</h3>
        {open ? <ChevronUp className="w-5 h-5 text-secondary-text" /> : <ChevronDown className="w-5 h-5 text-secondary-text" />}
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4 border-t border-border/30">
          {answers.map((a, i) => {
            const scoreColor =
              a.score <= 1 ? "border-t-red-500" :
              a.score === 2 ? "border-t-orange-500" :
              a.score === 3 ? "border-t-amber-500" :
              "border-t-green-600";
            const scoreBadge =
              a.score <= 1 ? "bg-red-100 text-red-700" :
              a.score === 2 ? "bg-orange-100 text-orange-700" :
              a.score === 3 ? "bg-amber-100 text-amber-700" :
              "bg-green-100 text-green-700";
            return (
              <div key={a.questionId} className={`bg-surface/50 rounded-2xl border border-border/30 border-t-4 ${scoreColor} p-4 mt-4`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-serif text-primary-text leading-snug flex-1">{a.questionText}</p>
                  <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-lg ${scoreBadge}`}>
                    {a.score}/5
                  </span>
                </div>
                <p className="text-xs text-secondary-text italic mb-1">
                  {a.wordCount} words — {a.feedback}
                </p>
                {a.answerText && (
                  <p className="text-xs text-secondary-text/70 mt-2 line-clamp-3">"{a.answerText}"</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Feedback() {
  const [, setLocation] = useLocation();

  const { report, isRealData } = useMemo<{ report: FeedbackReport; isRealData: boolean }>(() => {
    if (interviewSession.answers.length > 0) {
      return {
        report: generateInterviewFeedback(interviewSession.answers, interviewSession.role),
        isRealData: true,
      };
    }
    return { report: sampleFeedback, isRealData: false };
  }, []);

  const tier = getTierLabel(report.overallScore);
  const tierStyle = TIER_BADGE[tier] ?? TIER_BADGE["Developing"];
  const isCritical = report.overallScore < 60;

  const handleRetake = () => {
    resetInterviewSession();
    setLocation("/interview-setup");
  };

  const { overallScore, scores, strengths, weakAreas, improvements, recommendedSkills, roadmap, suggestedProjects } = report;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-serif text-primary-text">Executive Summary</h1>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${tierStyle.bg} ${tierStyle.text}`}>
              {tier}
            </span>
          </div>
          <p className="text-lg text-secondary-text">
            {isRealData
              ? `${interviewSession.role} · ${interviewSession.difficulty} · ${interviewSession.answers.length} questions answered`
              : "Sample performance report — complete an interview to see your real results."}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={handleRetake}
            data-testid="button-retake-interview"
            className="border-primary/20 text-primary rounded-full hover:bg-surface"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Interview
          </Button>
          {!isRealData && (
            <Button
              variant="outline"
              onClick={() => setLocation("/resume")}
              className="border-primary/20 text-primary rounded-full hover:bg-surface"
            >
              Start Real Interview
            </Button>
          )}
          <Button variant="outline" className="border-primary/20 text-primary rounded-full hover:bg-surface">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Link href="/chat">
            <Button className="bg-primary hover:bg-[#5A3F2C] text-white rounded-full shadow-md">
              <MessageSquare className="w-4 h-4 mr-2" /> Discuss with Coach
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Critical banner */}
      {isCritical && isRealData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl p-5 mb-8"
        >
          <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800 mb-1">This performance would not pass a real interview.</h3>
            <p className="text-red-700 text-sm">
              Your score of {overallScore}/100 falls below the minimum threshold for most {interviewSession.role} roles.
              Review the detailed breakdown below and use the improvement plan before applying anywhere.
              Practice daily on PrepWise until you consistently score above 65%.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Score Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-8"
        >
          {/* Score Ring */}
          <div className="glass-card rounded-3xl p-8 text-center shadow-xl border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary-text mb-6">Overall Readiness</h3>
            <div className="relative inline-flex items-center justify-center w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface" />
                <motion.circle
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray="439.8"
                  initial={{ strokeDashoffset: 439.8 }}
                  animate={{ strokeDashoffset: 439.8 - (439.8 * overallScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={overallScore >= 75 ? "text-primary" : overallScore >= 55 ? "text-amber-600" : "text-red-600"}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-5xl font-serif ${SCORE_TIER_COLOR(overallScore)}`}>{overallScore}</span>
                <span className="text-xs text-secondary-text">/ 100</span>
              </div>
            </div>
            <p className={`mt-4 font-medium text-sm ${SCORE_TIER_COLOR(overallScore)}`}>{tier}</p>
          </div>

          {/* Dimensional Breakdown */}
          <div className="glass-card rounded-3xl p-8 shadow-md border border-primary/10">
            <h3 className="font-serif text-xl text-primary-text mb-6 border-b border-border/50 pb-2">Dimensional Breakdown</h3>
            <div className="space-y-5">
              {[
                { label: "Technical Acumen",       score: scores.technical },
                { label: "Communication",           score: scores.communication },
                { label: "Problem Solving",         score: scores.problemSolving },
                { label: "Narrative & Projects",    score: scores.projectExplanation },
                { label: "Executive Presence",      score: scores.confidence },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-secondary-text">{item.label}</span>
                    <span className={`font-medium ${SCORE_TIER_COLOR(item.score)}`}>{item.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: 0.3 + (i * 0.1) }}
                      className={`h-full rounded-full ${SCORE_BAR_COLOR(item.score)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="glass-card rounded-3xl p-8 shadow-md border-t-4 border-t-green-600/60">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-green-700" />
                <h3 className="font-serif text-xl text-primary-text">Key Strengths</h3>
              </div>
              <ul className="space-y-3">
                {strengths.map((str, i) => (
                  <li key={i} className="text-secondary-text text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weak Areas */}
            <div className={`glass-card rounded-3xl p-8 shadow-md border-t-4 ${isCritical ? "border-t-red-600/60" : "border-t-orange-600/60"}`}>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className={`w-6 h-6 ${isCritical ? "text-red-700" : "text-orange-700"}`} />
                <h3 className="font-serif text-xl text-primary-text">Vulnerabilities</h3>
              </div>
              <ul className="space-y-3">
                {weakAreas.map((weak, i) => (
                  <li key={i} className="text-secondary-text text-sm flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isCritical ? "bg-red-600" : "bg-orange-600"}`} />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategic Roadmap */}
          <div className="glass-card rounded-3xl p-8 shadow-md border border-primary/10">
            <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-3">
              <Target className="w-6 h-6 text-primary" />
              <h3 className="font-serif text-2xl text-primary-text">Strategic Roadmap</h3>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-3">Actionable Steps</h4>
                <div className="space-y-3">
                  {improvements.map((step, i) => (
                    <div key={i} className="flex gap-4 items-center bg-surface p-4 rounded-xl border border-border/30">
                      <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-serif font-bold text-sm shrink-0 ${isCritical ? "bg-red-700" : "bg-primary"}`}>
                        {i + 1}
                      </div>
                      <p className="text-primary-text font-medium text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-3">Timeline</h4>
                <div className="space-y-2">
                  {roadmap.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start text-sm text-secondary-text">
                      <div className="w-2 h-2 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-3">Recommended Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendedSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white border border-primary/20 text-primary-text text-xs rounded-full shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-3">Suggested Projects</h4>
                  <ul className="space-y-2">
                    {suggestedProjects.map((proj, i) => (
                      <li key={i} className="text-sm text-secondary-text flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Per-Question Breakdown (only when real data exists) */}
          {isRealData && <AnswerBreakdown />}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={handleRetake}
          className="bg-primary hover:bg-[#5A3F2C] text-white rounded-full h-12 px-8 shadow-md"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Retake Interview
        </Button>
        <Link href="/chat">
          <Button variant="outline" className="border-primary/20 text-primary rounded-full h-12 px-8 hover:bg-surface">
            <MessageSquare className="w-4 h-4 mr-2" /> Get Coaching
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
