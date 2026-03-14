import { InterviewProvider, useInterview } from "@/context/InterviewContext";
import StageIndicator from "@/components/interview/StageIndicator";
import RegisterForm from "@/components/interview/RegisterForm";
import ResumeUpload from "@/components/interview/ResumeUpload";
import CompanyMatch from "@/components/interview/CompanyMatch";
import InterviewRound from "@/components/interview/InterviewRound";
import CodingTest from "@/components/interview/CodingTest";
import AIVoiceInterview from "@/components/interview/AIVoiceInterview";
import ResultsDashboard from "@/components/interview/ResultsDashboard";
import { Zap } from "lucide-react";

function InterviewFlow() {
  const { stage } = useInterview();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container flex items-center gap-2 py-3">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground tracking-tight">MockPrep<span className="text-primary">AI</span></span>
        </div>
      </header>

      <StageIndicator current={stage} />

      <main className="container pb-12 px-4">
        {stage === "register" && <RegisterForm />}
        {stage === "upload" && <ResumeUpload />}
        {stage === "company-match" && <CompanyMatch />}
        {stage === "aptitude" && <InterviewRound category="aptitude" />}
        {stage === "ai-interview" && <AIVoiceInterview />}
        {stage === "technical" && <InterviewRound category="technical" />}
        {stage === "hr" && <InterviewRound category="hr" />}
        {stage === "results" && <ResultsDashboard />}
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <InterviewProvider>
      <InterviewFlow />
    </InterviewProvider>
  );
}
