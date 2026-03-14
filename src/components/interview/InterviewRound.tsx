import { useState, useEffect, useCallback } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, Brain, Code, Users } from "lucide-react";
import { Question, UserAnswer, InterviewStage, AnsweredQuestion } from "@/types/interview";
import { Badge } from "@/components/ui/badge";

const categoryConfig: Record<string, { icon: React.ElementType; label: string; color: string; next: InterviewStage }> = {
  aptitude: { icon: Brain, label: "Aptitude Test", color: "text-warning", next: "technical" },
  technical: { icon: Code, label: "Technical Test", color: "text-info", next: "coding" },
  hr: { icon: Users, label: "HR Round", color: "text-accent", next: "results" },
};

export default function InterviewRound({ category }: { category: 'aptitude' | 'technical' | 'hr' }) {
  const { currentQuestions, answers, setAnswers, setStage, setResult } = useInterview();
  const questions = currentQuestions.filter(q => q.category === category);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const config = categoryConfig[category];
  const Icon = config.icon;

  useEffect(() => {
    setTimeLeft(category === 'hr' ? 90 : 60);
    setSelected(null);
  }, [currentIdx, category]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleNext = useCallback(() => {
    const q = questions[currentIdx];
    if (!q) return;
    const answer: UserAnswer = {
      questionId: q.id,
      selectedAnswer: selected,
      isCorrect: selected === q.correctAnswer,
      timeTaken: (category === 'hr' ? 90 : 60) - timeLeft,
    };
    const newAnswers = { ...answers, [q.id]: answer };
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    } else {
      if (config.next === "results") {
        calculateResults(newAnswers);
      }
      setStage(config.next);
    }
  }, [currentIdx, selected, timeLeft, answers, questions]);

  const calculateResults = (allAnswers: Record<string, UserAnswer>) => {
    const aptQ = currentQuestions.filter(q => q.category === 'aptitude');
    const techQ = currentQuestions.filter(q => q.category === 'technical');
    const hrQ = currentQuestions.filter(q => q.category === 'hr');

    const score = (qs: Question[]) => {
      const correct = qs.filter(q => allAnswers[q.id]?.isCorrect).length;
      return qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
    };

    const totalCorrect = Object.values(allAnswers).filter(a => a.isCorrect).length;
    const total = currentQuestions.length;

    const answeredQuestions: AnsweredQuestion[] = currentQuestions.map(q => ({
      question: q.question,
      userAnswer: allAnswers[q.id]?.selectedAnswer !== null ? q.options[allAnswers[q.id].selectedAnswer!] : null,
      correctAnswer: q.options[q.correctAnswer],
      isCorrect: allAnswers[q.id]?.isCorrect || false,
      category: q.category,
    }));

    const wrongCategories = currentQuestions
      .filter(q => !allAnswers[q.id]?.isCorrect)
      .map(q => q.category);
    const skillsToImprove = [...new Set(wrongCategories)].map(c =>
      c === 'aptitude' ? 'Quantitative Aptitude & Reasoning' :
      c === 'technical' ? 'Data Structures & Programming' : 'Communication & Soft Skills'
    );

    setResult({
      aptitudeScore: score(aptQ),
      technicalScore: score(techQ),
      hrScore: score(hrQ),
      totalQuestions: total,
      correctAnswers: totalCorrect,
      accuracy: Math.round((totalCorrect / total) * 100),
      skillsToImprove,
      answeredQuestions,
    });
  };

  if (!questions.length) return null;
  const q = questions[currentIdx];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <h2 className="text-xl font-bold text-foreground">{config.label}</h2>
          <Badge variant="secondary" className="font-mono text-xs">
            {currentIdx + 1}/{questions.length}
          </Badge>
        </div>
        <div className={`flex items-center gap-1 font-mono font-bold ${timeLeft < 15 ? "text-destructive animate-pulse" : "text-muted-foreground"}`}>
          <Clock className="w-4 h-4" />
          {timeLeft}s
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-secondary rounded-full h-1.5 mb-6">
        <div className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-card rounded-xl p-6 shadow-card glow-border">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-[10px]">{q.difficulty}</Badge>
            <Badge variant="secondary" className="text-[10px]">{q.company}</Badge>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-6">{q.question}</h3>
          <div className="space-y-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selected === i
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary/50 text-secondary-foreground hover:border-primary/30"
                }`}
              >
                <span className="font-mono text-sm text-muted-foreground mr-3">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end mt-6">
        <Button onClick={handleNext} className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90">
          {currentIdx < questions.length - 1 ? "Next" : config.next === "results" ? "View Results" : "Next Round"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
