import { motion } from "framer-motion";
import { Lock, Video, Waves, Webcam, BarChart3 } from "lucide-react";

export function ComingSoon() {
  const features = [
    { icon: Video, title: "Live AI Video Interview", desc: "Interact with a photorealistic AI avatar that reads your micro-expressions and body language." },
    { icon: Waves, title: "Communication Fluency Analysis", desc: "Advanced acoustic analysis of your voice tone, pacing, filler words, and resonance." },
    { icon: Webcam, title: "Webcam Environment Check", desc: "Automated assessment of your lighting, background, and framing to ensure executive presence." },
    { icon: BarChart3, title: "Real-Time Interview Analytics", desc: "Live overlay during mock interviews providing instant feedback on talk time and pacing." }
  ];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-20 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-primary-text mb-4">The Future of Preparation</h1>
        <p className="text-xl text-secondary-text max-w-2xl mx-auto">
          We are continuously evolving PrepWise. Here is a glimpse into the elite features currently in development.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl p-10 relative overflow-hidden group border border-primary/10 shadow-lg text-left"
          >
            <div className="absolute top-6 right-6">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface text-secondary-text text-xs font-bold uppercase tracking-wider rounded-full border border-border/50">
                <Lock className="w-3 h-3" /> In Development
              </div>
            </div>
            
            <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-primary/50 mb-6 border border-border/30">
              <feature.icon className="w-7 h-7" />
            </div>
            
            <h3 className="text-2xl font-serif text-primary-text mb-3 opacity-70">{feature.title}</h3>
            <p className="text-secondary-text opacity-70 leading-relaxed">{feature.desc}</p>
            
            {/* Hover shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
