import React, { createContext, useContext, useState, ReactNode } from "react";
import { StudentProfile, InterviewStage, UserAnswer, InterviewResult, Company, Question } from "@/types/interview";

interface InterviewState {
  stage: InterviewStage;
  setStage: (s: InterviewStage) => void;
  profile: StudentProfile | null;
  setProfile: (p: StudentProfile) => void;
  resumeFile: File | null;
  setResumeFile: (f: File | null) => void;
  extractedSkills: string[];
  setExtractedSkills: (s: string[]) => void;
  matchedCompanies: Company[];
  setMatchedCompanies: (c: Company[]) => void;
  selectedCompany: string | null;
  setSelectedCompany: (c: string | null) => void;
  answers: Record<string, UserAnswer>;
  setAnswers: (a: Record<string, UserAnswer>) => void;
  result: InterviewResult | null;
  setResult: (r: InterviewResult | null) => void;
  currentQuestions: Question[];
  setCurrentQuestions: (q: Question[]) => void;
}

const InterviewContext = createContext<InterviewState | null>(null);

export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error("useInterview must be used within InterviewProvider");
  return ctx;
};

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [stage, setStage] = useState<InterviewStage>("register");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [matchedCompanies, setMatchedCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

  return (
    <InterviewContext.Provider value={{
      stage, setStage, profile, setProfile, resumeFile, setResumeFile,
      extractedSkills, setExtractedSkills, matchedCompanies, setMatchedCompanies,
      selectedCompany, setSelectedCompany, answers, setAnswers, result, setResult,
      currentQuestions, setCurrentQuestions,
    }}>
      {children}
    </InterviewContext.Provider>
  );
};
