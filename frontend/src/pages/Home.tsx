import { motion, type Variants } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, FileText, MessageSquare, TrendingUp, ShieldCheck} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32 px-4 md:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface via-background to-background z-0" />
        
        <div className="container relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif text-primary-text leading-tight tracking-tight">
              Practice smarter.<br className="hidden md:block" /> Interview <span className="italic text-primary">better.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-secondary-text max-w-2xl mx-auto font-light leading-relaxed">
  Practice technical and HR interviews with AI-powered mock sessions, resume analysis, and real-time feedback.
</motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/interview-setup">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-[#5A3F2C] text-primary-foreground text-lg rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                  Start Mock Interview <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/resume">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 border-primary/20 hover:bg-surface text-primary text-lg rounded-full transition-all">
                  <FileText className="mr-2 w-5 h-5" /> Upload Resume
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-surface/50 border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-primary-text">The Art of the Interview</h2>
            <p className="text-lg text-secondary-text leading-relaxed">
              We believe that interviewing is a craft. It requires more than just knowing the answers; it demands articulation, presence, and structural clarity. PrepWise evaluates your delivery on multiple dimensions to refine your professional narrative.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: ShieldCheck, title: "Hyper-Realistic Scenarios", desc: "Our AI assumes the persona of top-tier hiring managers, challenging you with domain-specific depth." },
            { icon: TrendingUp, title: "Multidimensional Scoring", desc: "Receive rigorous evaluations covering technical accuracy, communication fluency, and problem-solving intuition." },
            { icon: MessageSquare, title: "Targeted Coaching", desc: "Engage with your personalized AI coach post-interview to drill down on weak areas and refine your narrative." }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeInUp} className="glass-card p-10 rounded-2xl flex flex-col items-start text-left group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-xl bg-surface flex items-center justify-center border border-border/50 text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif text-primary-text mb-3">{feature.title}</h3>
              <p className="text-secondary-text leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white">Your Path to Mastery</h2>
          </div>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[27px] md:before:mx-auto md:before:translate-x-0 before:w-0.5 before:bg-white/20">
            {[
              { step: "01", title: "Establish the Baseline", desc: "Upload your resume. Our system analyzes your background to tailor the difficulty and domain of your mock interview." },
              { step: "02", title: "Enter the Simulation", desc: "Engage in a live, turn-based dialogue. Face unexpected questions, think on your feet, and articulate your reasoning." },
              { step: "03", title: "Review & Refine", desc: "Access your executive dashboard. Analyze your performance metrics, identify weak points, and chat with your AI coach to improve." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`relative flex items-center justify-between md:justify-normal gap-8 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="hidden md:block w-5/12" />
                <div className="relative z-10 w-14 h-14 shrink-0 bg-[#EFE6DC] text-[#4B352A] rounded-full flex items-center justify-center font-serif text-xl border-4 border-[#6F4E37] font-bold shadow-xl">
                  {item.step}
                </div>
                <div className="w-full md:w-5/12 pb-8">
                  <h3 className="text-2xl font-serif mb-2 text-white">{item.title}</h3>
                  <p className="text-[#EFE6DC]/80 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6">Ready to secure the offer?</h2>
            <p className="text-xl text-secondary-text mb-10 max-w-2xl mx-auto">
              Join the ranks of professionals who use PrepWise to transform interview anxiety into commanding presence.
            </p>
            <Link href="/interview-setup">
              <Button size="lg" className="h-14 px-10 bg-primary hover:bg-[#5A3F2C] text-primary-foreground text-lg rounded-full shadow-xl transition-transform hover:-translate-y-1">
                Begin Your Preparation
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
