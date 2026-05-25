import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Mic, TrendingUp, AlertTriangle, Trophy, MessageSquare,
  BarChart2, Activity, BookOpen, ChevronDown, ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { videoSessionStore } from "@/lib/videoSessionStore";
import { generateFluencyReport } from "@/lib/fluencyAnalysis";

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const color = score >= 75 ? "#6F4E37" : score >= 55 ? "#B07A4F" : "#C0724E";

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={cx} cy={cy} r={r} stroke="#EFE6DC" strokeWidth={size * 0.07} fill="none" />
      <motion.circle
        cx={cx} cy={cy} r={r}
        stroke={color} strokeWidth={size * 0.07} fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (circ * score) / 100 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
    </svg>
  );
}

function ScoreCard({ label, score, icon: Icon, delay = 0 }: { label: string; score: number; icon: React.ElementType; delay?: number }) {
  const color = score >= 75 ? "text-green-700" : score >= 55 ? "text-amber-700" : "text-red-700";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-5 border border-primary/10 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-secondary-text" />
        <span className="text-xs font-bold uppercase tracking-widest text-secondary-text">{label}</span>
      </div>
      <div className={`text-4xl font-serif ${color}`}>{score}<span className="text-lg text-secondary-text ml-1">%</span></div>
      <div className="mt-3 h-1.5 bg-surface rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full rounded-full ${score >= 75 ? "bg-green-600/70" : score >= 55 ? "bg-amber-600/70" : "bg-red-600/70"}`}
        />
      </div>
    </motion.div>
  );
}

function TranscriptCard({ result, index }: { result: ReturnType<typeof generateFluencyReport>["questionResults"][0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const score = result.answerScore;
  const color = score >= 75 ? "border-t-green-600/60" : score >= 55 ? "border-t-amber-600/60" : "border-t-red-600/60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className={`glass-card rounded-2xl border border-primary/10 border-t-4 ${color} overflow-hidden`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-text">Question {index + 1}</span>
            <p className="text-primary-text font-serif mt-1 leading-snug">{result.questionText}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-serif text-primary-text">{score}</div>
            <div className="text-xs text-secondary-text">/ 100</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-secondary-text">
          <span className="bg-surface px-2 py-1 rounded-lg">{result.wordCount} words</span>
          <span className="bg-surface px-2 py-1 rounded-lg">{result.wpm} WPM</span>
          {result.fillerCount > 0 && (
            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-lg">{result.fillerCount} filler words</span>
          )}
        </div>

        {result.transcript && result.transcript !== "(No speech detected)" && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? "Hide" : "Show"} transcript
          </button>
        )}
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0 }} animate={{ height: "auto" }}
          className="px-5 pb-5 text-sm text-secondary-text leading-relaxed bg-surface/30 border-t border-border/30"
        >
          <p className="pt-4 italic">"{result.transcript}"</p>
          {result.fillerWords.length > 0 && (
            <p className="mt-2 text-xs text-orange-600">
              Filler words detected: {result.fillerWords.join(", ")}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function VideoFeedback() {
  const report = useMemo(() => generateFluencyReport(videoSessionStore.answers), []);
  const hasData = videoSessionStore.answers.length > 0;

  if (!hasData) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="glass-card rounded-3xl p-12 shadow-md">
          <Activity className="w-12 h-12 text-primary/40 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-primary-text mb-3">No Interview Data</h2>
          <p className="text-secondary-text mb-6">Complete a live video interview first to see your fluency analysis.</p>
          <Link href={`/video-interview?role=${encodeURIComponent("Software Developer")}`}>

           <Button className="bg-primary hover:bg-[#5A3F2C] text-white rounded-full">Start Video Interview</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Mic className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-secondary-text">Fluency Analysis</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-serif text-primary-text">Communication Report</h1>
            <p className="text-secondary-text mt-1">
              {videoSessionStore.role} · {videoSessionStore.difficulty} · {report.questionResults.length} questions answered
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/video-interview?role=${encodeURIComponent(videoSessionStore.role)}`}>
              <Button variant="outline" className="border-primary/20 text-primary rounded-full hover:bg-surface">
                Retake Interview
              </Button>
            </Link>
            <Link href="/chat">
              <Button className="bg-primary hover:bg-[#5A3F2C] text-white rounded-full shadow-md">
                <MessageSquare className="w-4 h-4 mr-2" /> Coach Me
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 text-center shadow-xl border border-primary/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-text mb-4">Overall Score</h3>
          <div className="relative inline-flex items-center justify-center">
            <ScoreRing score={report.overallScore} size={160} />
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-serif text-primary-text">{report.overallScore}</span>
              <span className="text-xs text-secondary-text">/ 100</span>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-primary">
            {report.overallScore >= 75 ? "Strong Communicator" : report.overallScore >= 55 ? "Developing Presence" : "Needs Practice"}
          </p>

          <div className="mt-6 pt-5 border-t border-border/50 grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary-text mb-1">Avg Speed</p>
              <p className="font-serif text-xl text-primary-text">{report.avgWpm} <span className="text-xs text-secondary-text">WPM</span></p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary-text mb-1">Filler Words</p>
              <p className={`font-serif text-xl ${report.totalFillerWords > 10 ? "text-red-700" : "text-primary-text"}`}>
                {report.totalFillerWords}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary-text mb-1">Total Words</p>
              <p className="font-serif text-xl text-primary-text">{report.totalWords}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary-text mb-1">Vocab Score</p>
              <p className="font-serif text-xl text-primary-text">{Math.round(report.avgUniqueWordRatio * 100)}%</p>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
          <ScoreCard label="Communication" score={report.communicationScore} icon={MessageSquare} delay={0.15} />
          <ScoreCard label="Fluency" score={report.fluencyScore} icon={Activity} delay={0.2} />
          <ScoreCard label="Clarity" score={report.clarityScore} icon={BookOpen} delay={0.25} />
          <ScoreCard label="Confidence" score={report.confidenceScore} icon={BarChart2} delay={0.3} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card rounded-3xl p-7 shadow-md border-t-4 border-t-green-600/60"
        >
          <div className="flex items-center gap-3 mb-5">
            <Trophy className="w-5 h-5 text-green-700" />
            <h3 className="font-serif text-xl text-primary-text">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-secondary-text">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl p-7 shadow-md border-t-4 border-t-orange-600/60"
        >
          <div className="flex items-center gap-3 mb-5">
            <AlertTriangle className="w-5 h-5 text-orange-700" />
            <h3 className="font-serif text-xl text-primary-text">Areas to Improve</h3>
          </div>
          <ul className="space-y-3">
            {report.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-secondary-text">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 shrink-0" />
                {w}
              </li>
            ))}
            {report.weaknesses.length === 0 && (
              <li className="text-sm text-secondary-text">Excellent — no significant weaknesses detected.</li>
            )}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="glass-card rounded-3xl p-7 shadow-md border border-primary/10 mb-10"
      >
        <div className="flex items-center gap-3 mb-5">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-xl text-primary-text">Improvement Plan</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.improvements.map((step, i) => (
            <div key={i} className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-border/30">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">{i + 1}</div>
              <p className="text-primary-text text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {report.questionResults.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center gap-3 mb-5">
            <Mic className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-2xl text-primary-text">Per-Question Breakdown</h3>
          </div>
          <div className="space-y-4">
            {report.questionResults.map((result, i) => (
              <TranscriptCard key={result.questionId} result={result} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
