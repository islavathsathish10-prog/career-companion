import { useEffect, useRef } from "react";
import { useInterview } from "@/context/InterviewContext";
import { motion } from "framer-motion";
import { Trophy, Target, Brain, Code, Users, AlertTriangle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function ScoreCard({ icon: Icon, label, score, color }: { icon: React.ElementType; label: string; score: number; color: string }) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border text-center">
      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold font-mono text-foreground">{score}%</p>
    </div>
  );
}

export default function ResultsDashboard() {
  const { result, profile, selectedCompany, setStage, setAnswers } = useInterview();
  const hasSavedResult = useRef(false);

  useEffect(() => {
    if (hasSavedResult.current || !result || !profile) return;
    
    const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL;
    if (!webhookUrl) return;

    hasSavedResult.current = true;
    
    const score = Math.round((result.aptitudeScore + result.technicalScore + result.hrScore) / 3);

    const payload = {
      timestamp: new Date().toISOString(),
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      college: profile.college,
      branch: profile.branch,
      graduationYear: profile.graduationYear,
      company: selectedCompany || "General",
      aptitudeScore: result.aptitudeScore,
      technicalScore: result.technicalScore,
      hrScore: result.hrScore,
      overallScore: score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      accuracy: result.accuracy
    };

    fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).catch(err => console.error("Error saving to Google Sheets:", err));
  }, [result, profile, selectedCompany]);

  if (!result) return null;

  const overallScore = Math.round((result.aptitudeScore + result.technicalScore + result.hrScore) / 3);
  const grade = overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : overallScore >= 40 ? "Average" : "Needs Improvement";
  const gradeColor = overallScore >= 80 ? "text-success" : overallScore >= 60 ? "text-primary" : overallScore >= 40 ? "text-warning" : "text-destructive";

  const handleRestart = () => {
    setAnswers({});
    setStage("register");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Trophy className="w-12 h-12 mx-auto text-primary mb-3" />
        <h1 className="text-3xl font-bold text-gradient-primary mb-1">Interview Complete!</h1>
        <p className={`text-xl font-semibold ${gradeColor}`}>{grade}</p>
      </div>

      {/* Overall Score */}
      <div className="bg-card rounded-xl p-6 shadow-card glow-border text-center">
        <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
        <div className="relative w-32 h-32 mx-auto mb-3">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${overallScore * 3.14} ${314 - overallScore * 3.14}`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold font-mono text-foreground">{overallScore}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {result.correctAnswers}/{result.totalQuestions} correct · {result.accuracy}% accuracy
        </p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ScoreCard icon={Brain} label="Aptitude" score={result.aptitudeScore} color="text-warning" />
        <ScoreCard icon={Code} label="Technical" score={result.technicalScore} color="text-info" />
        <ScoreCard icon={Users} label="HR Round" score={result.hrScore} color="text-accent" />
      </div>

      {/* Skills to Improve */}
      {result.skillsToImprove.length > 0 && (
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="font-semibold text-foreground">Skills to Improve</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.skillsToImprove.map(s => (
              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Question Review */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Question Review
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {result.answeredQuestions.map((q, i) => (
            <div key={i} className={`p-3 rounded-lg border ${q.isCorrect ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}`}>
              <div className="flex items-start gap-2">
                {q.isCorrect ? <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{q.question}</p>
                  {!q.isCorrect && (
                    <div className="mt-1 text-xs">
                      {q.userAnswer && <p className="text-destructive">Your answer: {q.userAnswer}</p>}
                      <p className="text-success">Correct: {q.correctAnswer}</p>
                    </div>
                  )}
                  <Badge variant="secondary" className="text-[10px] mt-1">{q.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleRestart} variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
        <RotateCcw className="w-4 h-4 mr-2" /> Start New Interview
      </Button>
    </motion.div>
  );
}
