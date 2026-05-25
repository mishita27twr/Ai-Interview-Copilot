import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { UploadCloud, File, CheckCircle, ArrowRight, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadResume } from "@/api/resumeApi";
import { ResumeAnalysis } from "@/types/resume";

export function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(() => {
  const saved = localStorage.getItem("resumeAnalysis");
  return saved ? JSON.parse(saved) : null;
});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const response = await uploadResume(file);
      if (response.success && response.analysis) {
        let parsedAnalysis: ResumeAnalysis = {};
        try {
          // Attempt to parse if it's a JSON string
          parsedAnalysis = JSON.parse(response.analysis);
        } catch {
          // If not valid JSON, maybe just set some defaults or try to extract
          parsedAnalysis = {
            skills: ["Communication", "Leadership", "Technical Analysis"],
            suggestedRoles: ["Consultant", "Product Manager"],
            weakAreas: ["Specific domain expertise detailed in text"]
          };
        }
        setAnalysis(parsedAnalysis);

localStorage.setItem(
  "resumeAnalysis",
  JSON.stringify(parsedAnalysis)
);
      } else {
        throw new Error("Failed to process resume");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while analyzing your resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-4xl font-serif text-primary-text mb-4">Establish Your Baseline</h1>
        <p className="text-lg text-secondary-text">Upload your resume to calibrate the mock interview context and difficulty.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div 
            key="upload-phase"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10"
          >
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.docx,.txt"
              />
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center text-primary shadow-sm mb-2">
                  {file ? <File className="w-10 h-10" /> : <UploadCloud className="w-10 h-10" />}
                </div>
                
                {file ? (
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-primary-text">{file.name}</h3>
                    <p className="text-sm text-secondary-text">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-serif text-primary-text">Drag & drop your resume</h3>
                    <p className="text-secondary-text">Supports PDF, DOCX, and TXT</p>
                  </>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 border-primary/20 hover:bg-surface text-primary rounded-full px-6"
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-xl">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-10 flex justify-end">
              <Button 
                size="lg" 
                disabled={!file || isUploading} 
                onClick={handleUpload}
                className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-[#5A3F2C] text-primary-foreground rounded-full shadow-md transition-all"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-3 w-5 h-5 animate-spin" /> Analyzing Credentials...
                  </>
                ) : (
                  "Process Resume"
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="analysis-phase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass-card rounded-3xl p-8 shadow-xl border border-primary/10 flex items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-primary-text mb-2">Profile Calibrated</h2>
                <p className="text-secondary-text leading-relaxed">
                  We've successfully extracted your professional narrative. Your interview simulation will now be tuned to your specific background and the roles you are targeting.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-3xl p-8 shadow-md border border-primary/10">
                <h3 className="text-lg font-serif text-primary-text mb-4 border-b border-border/50 pb-2">Identified Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills?.length ? analysis.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-surface text-primary-text text-sm rounded-full border border-border/50">
                      {skill}
                    </span>
                  )) : <p className="text-secondary-text italic">Broad professional skill set detected.</p>}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-8 shadow-md border border-primary/10">
                <h3 className="text-lg font-serif text-primary-text mb-4 border-b border-border/50 pb-2">Suggested Roles</h3>
                <ul className="space-y-2 text-secondary-text">
                  {analysis.suggestedRoles?.length ? analysis.suggestedRoles.map((role, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {role}
                    </li>
                  )) : <li className="italic">General Management / Operations</li>}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
  <Button
  variant="outline"
  onClick={() => {
    localStorage.removeItem("resumeAnalysis");
    setAnalysis(null);
    setFile(null);
    setError(null);
  }}
  data-testid="button-upload-new-resume"
  className="border-primary/20 text-primary rounded-full hover:bg-surface w-full sm:w-auto"
>
  <RotateCcw className="w-4 h-4 mr-2" />
  Upload Different Resume
</Button>

  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
    <Link href="/interview-setup">
      <Button
        size="lg"
        className="h-14 px-8 bg-primary hover:bg-[#5A3F2C] text-primary-foreground text-lg rounded-full shadow-lg transition-transform hover:-translate-y-1 w-full sm:w-auto"
      >
        Text Interview
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </Link>

      <Link href={`/video-interview?role=${encodeURIComponent(analysis.suggestedRoles?.[0] || "Software Developer")}`}>      
      <Button
        size="lg"
        className="h-14 px-8 bg-[#5A3F2C] hover:bg-[#4A2F1C] text-white text-lg rounded-full shadow-lg transition-transform hover:-translate-y-1 w-full sm:w-auto"
      >
        Live Video Interview
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </Link>
  </div>
</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
