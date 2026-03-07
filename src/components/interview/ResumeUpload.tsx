import { useState, useRef } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, Sparkles } from "lucide-react";
import { extractSkillsFromResume, matchCompanies } from "@/data/questions";

export default function ResumeUpload() {
  const { setResumeFile, setExtractedSkills, setMatchedCompanies, setStage } = useInterview();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      alert('Please upload a PDF or DOC file');
      return;
    }
    setFile(f);
  };

  const handleStart = async () => {
    if (!file) return;
    setProcessing(true);

    // Simulate resume parsing (in production, use a real parser)
    await new Promise(r => setTimeout(r, 1500));

    // Extract mock skills based on filename and common skills
    const mockText = `java python javascript react sql data structures algorithms html css node express git agile ${file.name}`;
    const skills = extractSkillsFromResume(mockText);
    const companies = matchCompanies(skills);

    setResumeFile(file);
    setExtractedSkills(skills);
    setMatchedCompanies(companies.map(c => ({
      id: c.id,
      name: c.name,
      logo: c.id,
      matchScore: c.matchScore,
      skills: c.matchingSkills,
    })));
    setProcessing(false);
    setStage("company-match");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Upload Your Resume</h1>
        <p className="text-muted-foreground">We'll match your skills with top companies</p>
      </div>

      <div
        className={`bg-card rounded-xl p-8 shadow-card border-2 border-dashed transition-all cursor-pointer ${
          dragging ? "border-primary bg-primary/5" : file ? "border-success/50 glow-border" : "border-border hover:border-primary/50"
        }`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="flex flex-col items-center gap-4 text-center">
          {file ? (
            <>
              <CheckCircle className="w-12 h-12 text-success" />
              <div>
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">Drop your resume here</p>
                <p className="text-sm text-muted-foreground">PDF or DOC format (max 20MB)</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4 text-xs text-muted-foreground">
        <FileText className="w-4 h-4 shrink-0" />
        <span>Your resume will be analyzed to match you with relevant companies and interview questions.</span>
      </div>

      {file && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
          <Button
            onClick={handleStart}
            disabled={processing}
            className="w-full bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90"
          >
            {processing ? (
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /> Analyzing Resume...</span>
            ) : (
              "Start Interview →"
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
