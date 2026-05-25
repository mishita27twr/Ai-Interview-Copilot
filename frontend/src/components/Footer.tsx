import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto bg-surface/50">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-secondary-text">
        <p>© {new Date().getFullYear()} PrepWise. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
        </div>
      </div>
    </footer>
  );
}
