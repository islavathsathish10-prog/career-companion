import { Question } from "@/types/interview";

export const questionBank: Question[] = [
  // APTITUDE - TCS
  { id: "apt-1", question: "A train running at 90 km/h crosses a pole in 10 seconds. What is the length of the train?", options: ["200m", "250m", "300m", "150m"], correctAnswer: 1, company: "TCS", category: "aptitude", difficulty: "easy" },
  { id: "apt-2", question: "If 6 men can complete a work in 12 days, how many days will 9 men take?", options: ["6 days", "8 days", "10 days", "4 days"], correctAnswer: 1, company: "TCS", category: "aptitude", difficulty: "easy" },
  { id: "apt-3", question: "A shopkeeper sells an article at 20% profit. If the cost price is ₹500, what is the selling price?", options: ["₹550", "₹600", "₹650", "₹700"], correctAnswer: 1, company: "TCS", category: "aptitude", difficulty: "easy" },
  // APTITUDE - Infosys
  { id: "apt-4", question: "What is the next number in the series: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "36"], correctAnswer: 1, company: "Infosys", category: "aptitude", difficulty: "medium" },
  { id: "apt-5", question: "A and B can do a piece of work in 12 days, B and C in 15 days, C and A in 20 days. How long will they take together?", options: ["10 days", "8 days", "5 days", "12 days"], correctAnswer: 0, company: "Infosys", category: "aptitude", difficulty: "medium" },
  // APTITUDE - Wipro
  { id: "apt-6", question: "The average of 5 consecutive odd numbers is 27. What is the largest number?", options: ["29", "31", "33", "35"], correctAnswer: 1, company: "Wipro", category: "aptitude", difficulty: "easy" },
  // APTITUDE - Google
  { id: "apt-7", question: "You have 8 balls, one is heavier. Using a balance scale, minimum weighings needed?", options: ["1", "2", "3", "4"], correctAnswer: 1, company: "Google", category: "aptitude", difficulty: "hard" },
  // APTITUDE - Amazon
  { id: "apt-8", question: "A car travels 60 km at 30 km/h and 60 km at 60 km/h. Average speed for the entire journey?", options: ["40 km/h", "45 km/h", "50 km/h", "35 km/h"], correctAnswer: 0, company: "Amazon", category: "aptitude", difficulty: "medium" },

  // TECHNICAL - TCS
  { id: "tech-1", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: 1, company: "TCS", category: "technical", difficulty: "easy" },
  { id: "tech-2", question: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: 1, company: "TCS", category: "technical", difficulty: "easy" },
  // TECHNICAL - Infosys
  { id: "tech-3", question: "What is the difference between abstract class and interface in Java?", options: ["Abstract class can have constructors, interface cannot", "Both are the same", "Interface can have constructors", "Abstract class cannot have methods"], correctAnswer: 0, company: "Infosys", category: "technical", difficulty: "medium" },
  { id: "tech-4", question: "What is normalization in DBMS?", options: ["Adding redundancy", "Removing redundancy", "Deleting tables", "Creating indexes"], correctAnswer: 1, company: "Infosys", category: "technical", difficulty: "medium" },
  // TECHNICAL - Google
  { id: "tech-5", question: "What is the time complexity of quicksort in the average case?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctAnswer: 1, company: "Google", category: "technical", difficulty: "medium" },
  { id: "tech-6", question: "Which algorithm is used for finding the shortest path in a weighted graph?", options: ["DFS", "BFS", "Dijkstra's", "Kruskal's"], correctAnswer: 2, company: "Google", category: "technical", difficulty: "hard" },
  // TECHNICAL - Amazon
  { id: "tech-7", question: "What is the principle behind a hash table?", options: ["Sorting", "Hashing function maps keys to indices", "Binary search", "Recursion"], correctAnswer: 1, company: "Amazon", category: "technical", difficulty: "medium" },
  { id: "tech-8", question: "What does the 'S' in SOLID principles stand for?", options: ["Single Responsibility", "Singleton", "Static", "Structured"], correctAnswer: 0, company: "Amazon", category: "technical", difficulty: "easy" },
  // TECHNICAL - Microsoft
  { id: "tech-9", question: "What is a deadlock in operating systems?", options: ["Fast processing", "Circular wait among processes", "Memory overflow", "CPU scheduling"], correctAnswer: 1, company: "Microsoft", category: "technical", difficulty: "medium" },
  { id: "tech-10", question: "What is polymorphism in OOP?", options: ["One class only", "Same method different behavior", "Data hiding", "Code reuse"], correctAnswer: 1, company: "Microsoft", category: "technical", difficulty: "easy" },

  // HR - TCS
  { id: "hr-1", question: "Why do you want to join TCS?", options: ["Global leader in IT services with great learning opportunities", "It's the only company I know", "For the salary only", "My friends work here"], correctAnswer: 0, company: "TCS", category: "hr", difficulty: "easy" },
  { id: "hr-2", question: "What are your strengths?", options: ["I have no strengths", "Problem-solving, adaptability, and continuous learning", "I'm perfect at everything", "I don't know"], correctAnswer: 1, company: "TCS", category: "hr", difficulty: "easy" },
  // HR - Infosys
  { id: "hr-3", question: "Where do you see yourself in 5 years?", options: ["I haven't thought about it", "Growing as a technical leader contributing to the organization", "Retired", "Working somewhere else"], correctAnswer: 1, company: "Infosys", category: "hr", difficulty: "easy" },
  // HR - Google
  { id: "hr-4", question: "Tell us about a time you failed and what you learned.", options: ["I never fail", "I failed a project deadline but learned better time management and communication", "I don't remember", "Failure is not important"], correctAnswer: 1, company: "Google", category: "hr", difficulty: "medium" },
  // HR - Amazon
  { id: "hr-5", question: "Describe a situation where you showed leadership.", options: ["I always follow, never lead", "Led a team project, delegated tasks, and delivered on time", "Leadership is overrated", "I prefer working alone"], correctAnswer: 1, company: "Amazon", category: "hr", difficulty: "medium" },
  // HR - Microsoft
  { id: "hr-6", question: "How do you handle work pressure?", options: ["I can't handle pressure", "I prioritize tasks, stay organized, and take breaks when needed", "I ignore deadlines", "I panic"], correctAnswer: 1, company: "Microsoft", category: "hr", difficulty: "easy" },
  // HR - Wipro
  { id: "hr-7", question: "Are you willing to relocate?", options: ["No, never", "Yes, I'm flexible and open to new opportunities", "Only to my hometown", "Depends on salary"], correctAnswer: 1, company: "Wipro", category: "hr", difficulty: "easy" },
  { id: "hr-8", question: "What is your expected salary?", options: ["As per company standards, I'm more focused on learning and growth", "₹1 crore", "I'll take anything", "I don't care about salary"], correctAnswer: 0, company: "Wipro", category: "hr", difficulty: "easy" },
];

export const companyData = [
  { id: "tcs", name: "Tata Consultancy Services", skills: ["java", "python", "sql", "c", "c++", "data structures", "algorithms", "dbms", "networking", "agile"] },
  { id: "infosys", name: "Infosys", skills: ["java", "python", "javascript", "sql", "spring", "hibernate", "react", "angular", "cloud", "devops"] },
  { id: "wipro", name: "Wipro", skills: ["java", "python", "c#", ".net", "sql", "testing", "automation", "cloud", "sap", "data analytics"] },
  { id: "google", name: "Google", skills: ["python", "java", "c++", "go", "algorithms", "data structures", "system design", "machine learning", "distributed systems", "kubernetes"] },
  { id: "amazon", name: "Amazon", skills: ["java", "python", "aws", "system design", "data structures", "algorithms", "dynamodb", "microservices", "distributed systems", "leadership"] },
  { id: "microsoft", name: "Microsoft", skills: ["c#", "c++", "python", "azure", "algorithms", "data structures", "system design", ".net", "typescript", "sql"] },
];

export function getQuestionsForCompany(companyName: string, category: 'aptitude' | 'technical' | 'hr', count: number = 5): Question[] {
  const companyQuestions = questionBank.filter(q => q.company === companyName && q.category === category);
  const otherQuestions = questionBank.filter(q => q.company !== companyName && q.category === category);
  const allQuestions = [...companyQuestions, ...otherQuestions];
  return allQuestions.slice(0, count);
}

export function extractSkillsFromResume(text: string): string[] {
  const allSkills = ["java", "python", "javascript", "typescript", "c", "c++", "c#", "go", "ruby", "php", "swift", "kotlin", "rust", "sql", "nosql", "mongodb", "mysql", "postgresql", "react", "angular", "vue", "node", "express", "spring", "django", "flask", ".net", "aws", "azure", "gcp", "docker", "kubernetes", "git", "linux", "html", "css", "data structures", "algorithms", "machine learning", "deep learning", "ai", "nlp", "data analytics", "big data", "hadoop", "spark", "system design", "microservices", "distributed systems", "agile", "scrum", "devops", "ci/cd", "testing", "automation", "sap", "hibernate", "dynamodb", "cloud", "leadership"];
  const lowerText = text.toLowerCase();
  return allSkills.filter(skill => lowerText.includes(skill));
}

export function matchCompanies(skills: string[]) {
  const lowerSkills = skills.map(s => s.toLowerCase());
  return companyData.map(company => {
    const matchingSkills = company.skills.filter(s => lowerSkills.includes(s));
    const matchScore = Math.round((matchingSkills.length / company.skills.length) * 100);
    return { ...company, matchScore, matchingSkills };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
