import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Mic, MicOff, ChevronRight, AlertCircle, Clock,
  CheckCircle, Play, Square, VideoOff, User, ArrowLeft, Activity, VideoOff as VideoOffIcon, User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleQuestions } from "@/data/sampleQuestions";
import { videoSessionStore, resetVideoSession } from "@/lib/videoSessionStore";
import { VideoAnswer } from "@/lib/fluencyAnalysis";

type Phase = "setup" | "interview" | "complete";

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

const QUESTION_TIME = 120;
const ROLES = ["Frontend Developer", "Backend Developer", "GenAI Engineer", "Data Analyst", "Software Developer"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function getQuestions(role: string) {
  return sampleQuestions[role] ?? sampleQuestions["Frontend Developer"];
}

export function VideoInterview() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>("setup");
const params = new URLSearchParams(window.location.search);

const detectedRole =
  params.get("role") || "Frontend Developer";

const [role, setRole] = useState(detectedRole);
const roleOptions = ROLES.includes(role)
  ? ROLES
  : [role, ...ROLES];
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [answers, setAnswers] = useState<VideoAnswer[]>([]);
  const [answerStartTime, setAnswerStartTime] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [micBlocked, setMicBlocked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef("");
  const isRecordingRef = useRef(false);

  const questions = getQuestions(role);
  const currentQuestion = questions[currentIndex];

  const hasSpeechRecognition =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Typing animation for the current question
  useEffect(() => {
    if (phase !== "interview") return;
    setDisplayedQuestion("");
    let i = 0;
    const id = setInterval(() => {
      setDisplayedQuestion(currentQuestion.text.slice(0, i));
      i++;
      if (i > currentQuestion.text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [currentIndex, phase, currentQuestion?.text]);

  // Countdown timer
  useEffect(() => {
    if (!isRecording) return;
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  // Try to attach camera silently — interview works without it
  const startCameraAndMic = useCallback(async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera/Mic API not supported");
      setCameraActive(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;

    setCameraActive(true);

    setTimeout(async () => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
    }, 300);
  } catch (error) {
    console.error("Camera/Mic error:", error);
    setCameraActive(false);
  }
}, []);
const startInterview = () => {
  resetVideoSession();
  setPhase("interview");

  setTimeout(() => {
    startCameraAndMic();
  }, 500);
};

  const createRecognition = useCallback(() => {
    if (!hasSpeechRecognition) return null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      let interim = "";
      let final = transcriptRef.current;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript + " ";
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      transcriptRef.current = final;
      setTranscript(final);
      setInterimText(interim);
    };

    recognition.onerror = (e) => {
      if (e.error === "not-allowed") setMicBlocked(true);
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        try { recognition.start(); } catch { /* ignore */ }
      }
    };

    return recognition;
  }, [hasSpeechRecognition]);

  const startRecording = () => {
    transcriptRef.current = "";
    setTranscript("");
    setInterimText("");
    setAnswerStartTime(Date.now());
    isRecordingRef.current = true;
    setIsRecording(true);

    const recognition = createRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      try { recognition.start(); } catch { /* ignore */ }
    }
  };

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    isRecordingRef.current = false;
    setIsRecording(false);
    setInterimText("");
    try { recognitionRef.current?.stop(); } catch { /* ignore */ }
  }, []);

  const submitAnswer = () => {
    const durationSeconds = Math.max(1, Math.round((Date.now() - answerStartTime) / 1000));
    const finalTranscript = transcriptRef.current.trim() || "(No speech detected)";

    const answer: VideoAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      transcript: finalTranscript,
      durationSeconds,
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTranscript("");
      transcriptRef.current = "";
    } else {
      videoSessionStore.role = role;
      videoSessionStore.difficulty = difficulty;
      videoSessionStore.answers = updatedAnswers;
      streamRef.current?.getTracks().forEach(t => t.stop());
      setPhase("complete");
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      isRecordingRef.current = false;
      try { recognitionRef.current?.stop(); } catch { /* ignore */ }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const timerPercent = (timeLeft / QUESTION_TIME) * 100;

  // ── SETUP PHASE ─────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-text">Live AI Interview</span>
          </div>
          <h1 className="text-4xl font-serif text-primary-text mb-2">Video Interview</h1>
          <p className="text-secondary-text mb-10">
            Speak your answers aloud — we'll transcribe and analyse your communication fluency, pace, and vocabulary in real time. Camera is optional.
          </p>

          <div className="glass-card rounded-3xl p-8 shadow-md border border-primary/10 space-y-8">

  <Button
    variant="outline"
    onClick={() => window.location.href = "/resume?analysis=true"}
    className="rounded-full border-primary/20 text-primary hover:bg-surface"
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    Back to Resume Analysis
  </Button>

  <div>
    <label className="text-xs font-bold uppercase tracking-widest text-secondary-text block mb-3">
      Target Role
    </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {roleOptions.map(r => (
                  <button
                    key={r}
                    data-testid={`role-${r}`}
                    onClick={() => setRole(r)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${role === r
                      ? "bg-primary text-white border-primary shadow-md"
                      : "border-primary/20 text-secondary-text hover:border-primary/50 hover:text-primary-text bg-white/50"
                    }`}
                  >{r}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary-text block mb-3">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    data-testid={`difficulty-${d}`}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${difficulty === d
                      ? "bg-primary text-white border-primary shadow-md"
                      : "border-primary/20 text-secondary-text hover:border-primary/50 bg-white/50"
                    }`}
                  >{d}</button>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-4 border border-border/40 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary-text mb-2">How it works</p>
              {[
                "Click 'Begin Interview' — no camera permission needed to start",
                "Camera is optional and will be requested separately",
                `Answer ${questions.length} questions, up to 2 minutes each`,
                "Speak clearly — your answers are transcribed live",
                hasSpeechRecognition
                  ? "Speech recognition is supported in your browser"
                  : "For live transcription, use Chrome or Edge"
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-secondary-text">
                  <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${i === 4 && !hasSpeechRecognition ? "text-amber-500" : "text-primary/60"}`} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
              
            <Button
              data-testid="button-begin-interview"
              onClick={startInterview}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-[#5A3F2C] text-white text-base font-medium shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" /> Begin Interview
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── COMPLETE PHASE ───────────────────────────────────────────────────────────
  if (phase === "complete") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-12 max-w-md mx-auto text-center shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-serif text-primary-text mb-3">Interview Complete</h2>
          <p className="text-secondary-text mb-8">
            {answers.length} responses recorded. Analysing your communication fluency now.
          </p>
          <Button
            data-testid="button-view-video-feedback"
            onClick={() => setLocation("/video-feedback")}
            className="w-full h-12 rounded-2xl bg-primary hover:bg-[#5A3F2C] text-white shadow-lg"
          >
            View Full Analysis <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── INTERVIEW PHASE ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0D0A08] flex flex-col">

      {/* Top HUD */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          {isRecording && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
          )}
          <span className="text-white/50 text-xs font-medium uppercase tracking-widest">
            {isRecording ? "Recording" : "Ready"}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-white/40 text-xs">
            Q <span className="text-white font-medium">{currentIndex + 1}</span>
            <span className="text-white/20"> / {questions.length}</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-mono ${timeLeft < 30 ? "text-red-400" : "text-white/50"}`}>
            <Clock className="w-3 h-3" />
            {formatTime(timeLeft)}
          </div>
          <div className={`flex items-center gap-1.5 text-xs ${isRecording ? "text-red-400" : "text-white/25"}`}>
            {isRecording ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Camera / Avatar Panel */}
        <div className="relative flex-1 flex items-center justify-center bg-[#0A0806] min-h-[240px]">
          {cameraActive ? (
            
              <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              controls
              data-testid="video-feed"
              className="w-full h-full object-cover bg-black"
              style={{ maxHeight: "calc(100vh - 180px)" }}
           />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <div className="w-28 h-28 rounded-full bg-[#2A1E14] border-2 border-primary/20 flex items-center justify-center">
                <User className="w-14 h-14 text-primary/40" />
              </div>
              <div className="flex items-center gap-2 text-white/30 text-xs">
                <VideoOff className="w-3.5 h-3.5" />
                <span>AI video simulation mode</span>
              </div>
            </div>
          )}

          {/* Timer bar at bottom of video panel */}
          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
              <motion.div
                animate={{ width: `${timerPercent}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${timerPercent < 25 ? "bg-red-500" : "bg-primary"}`}
              />
            </div>
          )}

          {timeLeft < 30 && isRecording && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="bg-red-600/90 text-white text-xs font-bold px-4 py-1.5 rounded-full"
              >
                {formatTime(timeLeft)} remaining
              </motion.div>
            </div>
          )}
        </div>

        {/* Question + Transcript + Controls Panel */}
        <div className="w-full lg:w-[400px] bg-[#1A1208] flex flex-col border-l border-white/5">

          {/* Question */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[10px] bg-primary/20 text-primary/80 px-2 py-0.5 rounded-full">
                {currentQuestion.topic}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/90 font-serif text-lg leading-relaxed"
              >
                {displayedQuestion}
                <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse align-middle" />
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Transcript */}
          <div className="flex-1 p-5 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">
              Live Transcript
            </div>
            <div className="min-h-[80px] text-sm leading-relaxed">
              {transcript && (
                <span className="text-white/75">{transcript}</span>
              )}
              {interimText && (
                <span className="text-white/35 italic">{interimText}</span>
              )}
              {!transcript && !interimText && (
                <span className="text-white/20 italic text-xs">
                  {isRecording
                    ? "Listening… speak your answer clearly"
                    : "Press Start Recording, then speak your answer"}
                </span>
              )}
            </div>

            {micBlocked && (
              <div className="mt-4 flex items-start gap-2 text-xs text-amber-400 bg-amber-900/20 rounded-xl p-3 border border-amber-800/30">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Microphone blocked. Allow mic access in your browser settings, then refresh.</span>
              </div>
            )}

            {!hasSpeechRecognition && (
              <div className="mt-4 flex items-start gap-2 text-xs text-white/30 bg-white/5 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Live transcription requires Chrome or Edge. Your answers will still be timed.</span>
              </div>
            )}
          </div>

          {/* Progress dots */}
          <div className="px-5 pt-2">
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                    i < currentIndex ? "bg-primary/60" : i === currentIndex ? "bg-primary" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="p-5 pt-3 space-y-2.5">
            {!isRecording ? (
              <Button
                data-testid="button-start-recording"
                onClick={startRecording}
                className="w-full h-12 rounded-2xl bg-primary hover:bg-[#5A3F2C] text-white font-medium"
              >
                <Play className="w-4 h-4 mr-2" /> Start Recording
              </Button>
            ) : (
              <Button
                data-testid="button-stop-recording"
                onClick={stopRecording}
                className="w-full h-12 rounded-2xl bg-red-800 hover:bg-red-900 text-white font-medium"
              >
                <Square className="w-4 h-4 mr-2" /> Stop Recording
              </Button>
            )}

            {!isRecording && (
              <Button
                data-testid="button-submit-answer"
                onClick={submitAnswer}
                disabled={currentIndex === 0 && !transcript && answers.length === 0 && !isRecording}
                className="w-full h-12 rounded-2xl bg-white/8 hover:bg-white/15 text-white/80 font-medium border border-white/10 disabled:opacity-30"
              >
                {currentIndex < questions.length - 1 ? (
                  <><ChevronRight className="w-4 h-4 mr-2" /> Submit &amp; Next</>
                ) : (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Submit &amp; See Analysis</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
