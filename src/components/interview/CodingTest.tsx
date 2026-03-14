import { useState, useEffect, useCallback, useMemo } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Play, ChevronRight, Code2, CheckCircle2, XCircle, Terminal, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { codingChallenges, CodingChallenge } from "@/data/codingChallenges";
import { toast } from "sonner";

export default function CodingTest() {
  const { setStage, selectedCompany } = useInterview();

  // Pick 2 random challenges, preferring selected company
  const challenges = useMemo(() => {
    const shuffled = [...codingChallenges].sort(() => Math.random() - 0.5);
    const companyMatch = shuffled.filter(c => c.company === selectedCompany);
    const others = shuffled.filter(c => c.company !== selectedCompany);
    const picked = [...companyMatch, ...others].slice(0, 2);
    return picked;
  }, [selectedCompany]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [code, setCode] = useState(challenges[0]?.starterCode || "");
  const [timeLeft, setTimeLeft] = useState((challenges[0]?.timeLimit || 15) * 60);
  const [output, setOutput] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{ passed: boolean; input: string; expected: string; got: string }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const challenge = challenges[currentIdx];

  useEffect(() => {
    if (!challenge) return;
    setCode(challenge.starterCode);
    setTimeLeft(challenge.timeLimit * 60);
    setOutput([]);
    setTestResults([]);
    setShowResults(false);
  }, [currentIdx]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleRunTests();
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleRunTests = useCallback(() => {
    if (!challenge) return;
    setShowResults(true);
    const results: typeof testResults = [];

    for (const tc of challenge.testCases) {
      try {
        // Create a safe-ish eval context
        const fn = new Function(`${code}\nreturn ${tc.input};`);
        const result = fn();
        const got = JSON.stringify(result);
        const expected = tc.expectedOutput;
        results.push({
          passed: got === expected,
          input: tc.input,
          expected,
          got,
        });
      } catch (e: any) {
        results.push({
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          got: `Error: ${e.message}`,
        });
      }
    }

    setTestResults(results);
    const passed = results.filter(r => r.passed).length;
    setOutput([`${passed}/${results.length} test cases passed`]);

    if (passed === results.length) {
      toast.success("All test cases passed! 🎉");
    }
  }, [code, challenge]);

  const handleNext = () => {
    const passed = testResults.filter(r => r.passed).length;
    const total = testResults.length;
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentIdx < challenges.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
      toast.info(`Coding round complete! Average score: ${avg}%`);
      setStage("ai-interview");
    }
  };

  const handleReset = () => {
    if (challenge) {
      setCode(challenge.starterCode);
      setTestResults([]);
      setShowResults(false);
      setOutput([]);
    }
  };

  if (!challenge) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-info" />
          <h2 className="text-xl font-bold text-foreground">Coding Challenge</h2>
          <Badge variant="secondary" className="font-mono text-xs">
            {currentIdx + 1}/{challenges.length}
          </Badge>
        </div>
        <div className={`flex items-center gap-1 font-mono font-bold ${timeLeft < 60 ? "text-destructive animate-pulse" : "text-muted-foreground"}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-secondary rounded-full h-1.5 mb-6">
        <div className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / challenges.length) * 100}%` }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Problem Description */}
        <div className="bg-card rounded-xl p-5 shadow-card glow-border overflow-y-auto max-h-[520px]">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-bold text-foreground">{challenge.title}</h3>
            <Badge variant="secondary" className={`text-[10px] ${
              challenge.difficulty === 'easy' ? 'text-[hsl(var(--success))]' :
              challenge.difficulty === 'medium' ? 'text-[hsl(var(--warning))]' : 'text-destructive'
            }`}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">{challenge.company}</Badge>
          </div>
          <p className="text-sm text-secondary-foreground leading-relaxed mb-4">{challenge.description}</p>

          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Examples</h4>
          {challenge.examples.map((ex, i) => (
            <div key={i} className="bg-secondary/50 rounded-lg p-3 mb-2 font-mono text-xs">
              <div><span className="text-muted-foreground">Input: </span><span className="text-foreground">{ex.input}</span></div>
              <div><span className="text-muted-foreground">Output: </span><span className="text-primary">{ex.output}</span></div>
              {ex.explanation && <div className="text-muted-foreground mt-1">💡 {ex.explanation}</div>}
            </div>
          ))}
        </div>

        {/* Code Editor + Output */}
        <div className="flex flex-col gap-3">
          {/* Editor */}
          <div className="bg-card rounded-xl shadow-card glow-border overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
              <span className="text-xs font-mono text-muted-foreground">solution.js</span>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-6 text-xs text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-56 bg-transparent p-4 font-mono text-sm text-foreground resize-none focus:outline-none leading-relaxed"
              spellCheck={false}
              placeholder="Write your code here..."
            />
          </div>

          {/* Output / Test Results */}
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border-b border-border">
              <Terminal className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Output</span>
            </div>
            <div className="p-3 max-h-40 overflow-y-auto">
              {!showResults ? (
                <p className="text-xs text-muted-foreground font-mono">Run tests to see results...</p>
              ) : (
                <AnimatePresence>
                  {testResults.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 mb-2 text-xs font-mono"
                    >
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-muted-foreground">{r.input}</div>
                        {!r.passed && (
                          <div className="text-destructive">Expected: {r.expected} | Got: {r.got}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {output.map((o, i) => (
                    <div key={`out-${i}`} className="text-xs font-mono text-primary mt-2">{o}</div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-5">
        <Button onClick={handleRunTests} variant="secondary" className="font-semibold">
          <Play className="w-4 h-4 mr-1" /> Run Tests
        </Button>
        <Button onClick={handleNext} className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90">
          {currentIdx < challenges.length - 1 ? "Next Challenge" : "Next Round"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
