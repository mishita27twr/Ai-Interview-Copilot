import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Settings, Play, Target, Briefcase, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setInterviewConfig } from "@/lib/interviewSessionStore";

const ROLES = ["Frontend Developer", "Backend Developer", "GenAI Engineer", "Data Analyst", "Software Developer", "Product Manager", "Consultant"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Executive"];
const TYPES = ["Technical", "HR & Behavioral", "Project-Based", "Mixed"];

export function InterviewSetup() {
  const [, setLocation] = useLocation();
  const [config, setConfig] = useState({
    role: "Frontend Developer",
    difficulty: "Intermediate",
    type: "Mixed"
  });

  const handleStart = () => {
    setInterviewConfig(config.role, config.difficulty, config.type);
    setLocation("/interview");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-4xl font-serif text-primary-text mb-4">Interview Configuration</h1>
        <p className="text-lg text-secondary-text">Define the parameters of your simulation to ensure maximum relevance.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10 space-y-10"
      >
        <Button
  onClick={() => window.location.href = "/resume"}
  className="mb-6 rounded-full bg-[#5A3F2C] text-white hover:bg-[#4A2F1C]"
>
  ← Back
</Button>
        {/* Role Selection */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-serif text-primary-text">
            <Briefcase className="w-5 h-5 text-primary" /> Target Role
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setConfig(prev => ({ ...prev, role }))}
                className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${
                  config.role === role 
                    ? "bg-primary text-primary-foreground border-primary shadow-md" 
                    : "bg-surface border-border/50 text-secondary-text hover:border-primary/50"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-serif text-primary-text">
            <Target className="w-5 h-5 text-primary" /> Calibration Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setConfig(prev => ({ ...prev, difficulty: diff }))}
                className={`px-4 py-3 rounded-xl border text-sm transition-all text-center font-medium ${
                  config.difficulty === diff 
                    ? "bg-primary text-primary-foreground border-primary shadow-md" 
                    : "bg-surface border-border/50 text-secondary-text hover:border-primary/50"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Type Selection */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-serif text-primary-text">
            <Layers className="w-5 h-5 text-primary" /> Focus Area
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setConfig(prev => ({ ...prev, type }))}
                className={`px-4 py-3 rounded-xl border text-sm transition-all text-center ${
                  config.type === type 
                    ? "bg-primary text-primary-foreground border-primary shadow-md" 
                    : "bg-surface border-border/50 text-secondary-text hover:border-primary/50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-secondary-text text-sm bg-surface px-4 py-2 rounded-lg border border-border/30">
            <Settings className="w-4 h-4 animate-spin-slow" /> System ready for configuration
          </div>
          <Button 
            size="lg" 
            onClick={handleStart}
            className="w-full sm:w-auto h-14 px-10 bg-primary hover:bg-[#5A3F2C] text-primary-foreground text-lg rounded-full shadow-lg transition-transform hover:-translate-y-1"
          >
            <Play className="mr-2 w-5 h-5 fill-current" /> Initialize Simulation
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
