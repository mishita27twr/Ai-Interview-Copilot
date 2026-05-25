import { Link, useLocation } from "wouter";
import { Briefcase, Video } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const isVideoPage = location.startsWith("/video-interview") || location.startsWith("/video-feedback");

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-x-0 border-t-0">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <span className="font-serif font-semibold text-xl tracking-tight text-primary-text">PrepWise</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-secondary-text">
          <Link href="/resume" className="hover:text-primary transition-colors">Resume</Link>
          <Link href="/interview-setup" className="hover:text-primary transition-colors">Interview</Link>
          <Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link>
          <Link href="/chat" className="hover:text-primary transition-colors">Chat</Link>
          <Link
            href="/video-interview"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
              isVideoPage
                ? "bg-primary text-white border-primary"
                : "border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Live Interview
          </Link>
        </nav>
      </div>
    </header>
  );
}
