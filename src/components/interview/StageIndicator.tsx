import { InterviewStage } from "@/types/interview";
import { Check } from "lucide-react";

const stages: { key: InterviewStage; label: string }[] = [
  { key: "register", label: "Register" },
  { key: "upload", label: "Resume" },
  { key: "company-match", label: "Companies" },
  { key: "aptitude", label: "Aptitude" },
  { key: "technical", label: "Technical" },
  { key: "coding", label: "Coding" },
  { key: "ai-interview", label: "AI Interview" },
  { key: "hr", label: "HR Round" },
  { key: "results", label: "Results" },
];

const stageOrder: InterviewStage[] = stages.map(s => s.key);

export default function StageIndicator({ current }: { current: InterviewStage }) {
  const currentIdx = stageOrder.indexOf(current);

  return (
    <div className="flex items-center justify-center gap-1 py-6 px-4 overflow-x-auto">
      {stages.map((stage, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={stage.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                isCompleted ? "bg-gradient-primary text-primary-foreground" :
                isCurrent ? "glow-border bg-secondary text-primary" :
                "bg-secondary text-muted-foreground"
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className={`w-6 sm:w-10 h-0.5 mx-1 mb-4 transition-all ${
                i < currentIdx ? "bg-primary" : "bg-border"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
