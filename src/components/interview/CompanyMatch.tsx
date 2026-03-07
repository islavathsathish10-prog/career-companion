import { useInterview } from "@/context/InterviewContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Building2, CheckCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getQuestionsForCompany } from "@/data/questions";

const companyIcons: Record<string, string> = {
  tcs: "🏢", infosys: "💼", wipro: "🌐", google: "🔍", amazon: "📦", microsoft: "💻",
};

export default function CompanyMatch() {
  const { matchedCompanies, selectedCompany, setSelectedCompany, setStage, setCurrentQuestions } = useInterview();

  const handleStart = () => {
    if (!selectedCompany) return;
    const company = matchedCompanies.find(c => c.id === selectedCompany);
    if (!company) return;
    const questions = [
      ...getQuestionsForCompany(company.name, "aptitude", 3),
      ...getQuestionsForCompany(company.name, "technical", 4),
      ...getQuestionsForCompany(company.name, "hr", 3),
    ];
    setCurrentQuestions(questions);
    setStage("aptitude");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Company Match</h1>
        <p className="text-muted-foreground">Select a company to start your mock interview</p>
      </div>

      <div className="grid gap-3">
        {matchedCompanies.map((company, i) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSelectedCompany(company.id)}
            className={`bg-card rounded-xl p-4 cursor-pointer transition-all shadow-card ${
              selectedCompany === company.id ? "glow-border" : "border border-border hover:border-primary/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{companyIcons[company.id] || "🏢"}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{company.name}</h3>
                    {selectedCompany === company.id && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {company.skills.slice(0, 5).map(s => (
                      <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary font-mono font-bold">
                  <TrendingUp className="w-4 h-4" />
                  {company.matchScore}%
                </div>
                <span className="text-xs text-muted-foreground">match</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedCompany && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
          <Button onClick={handleStart} className="w-full bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90">
            Begin Interview →
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
