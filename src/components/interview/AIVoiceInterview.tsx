import { useState, useEffect, useRef, useCallback } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, MessageSquare, ChevronRight, Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-interview`;

export default function AIVoiceInterview() {
  const { profile, extractedSkills, selectedCompany, setStage } = useInterview();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef(window.speechSynthesis);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start interview on mount
  useEffect(() => {
    startInterview();
    return () => {
      synthRef.current.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  const speakText = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      // Try to get a good English voice
      const voices = synthRef.current.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };
      synthRef.current.speak(utterance);
    });
  }, []);

  const streamAIResponse = useCallback(async (chatMessages: ChatMessage[]) => {
    setIsLoading(true);
    let assistantText = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: chatMessages,
          context: {
            name: profile?.name,
            college: profile?.college,
            branch: profile?.branch,
            skills: extractedSkills,
            company: selectedCompany,
          },
        }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect to AI interviewer");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantText += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantText } : m);
                }
                return [...prev, { role: "assistant", content: assistantText }];
              });
            }
          } catch { 
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      console.error("AI interview error:", e);
      toast.error(e.message || "Failed to get AI response");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setQuestionCount(prev => prev + 1);

    if (assistantText.includes("INTERVIEW_COMPLETE:")) {
      setInterviewComplete(true);
    }

    // Speak the response
    const cleanText = assistantText.replace("INTERVIEW_COMPLETE:", "").trim();
    await speakText(cleanText);
  }, [profile, extractedSkills, selectedCompany, speakText]);

  const startInterview = useCallback(async () => {
    const initialMessage: ChatMessage = { role: "user", content: "Hello, I'm ready for my interview." };
    setMessages([initialMessage]);
    await streamAIResponse([initialMessage]);
  }, [streamAIResponse]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser. Please use Chrome.");
      return;
    }

    synthRef.current.cancel();
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        toast.error("Microphone error. Please try again.");
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript("");
  }, []);

  const stopListeningAndSend = useCallback(async () => {
    recognitionRef.current?.stop();
    setIsListening(false);

    const userText = transcript.trim();
    if (!userText) {
      toast.error("No speech detected. Please try again.");
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setTranscript("");
    await streamAIResponse(updatedMessages);
  }, [transcript, messages, streamAIResponse]);

  const handleProceed = () => {
    setStage("technical");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold text-foreground">AI Voice Interview</h2>
          <Badge variant="secondary" className="font-mono text-xs">
            Q{questionCount}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <Badge variant="secondary" className="text-xs animate-pulse">
              <Volume2 className="w-3 h-3 mr-1" /> AI Speaking
            </Badge>
          )}
          {isListening && (
            <Badge variant="secondary" className="text-xs animate-pulse text-destructive">
              <Mic className="w-3 h-3 mr-1" /> Listening...
            </Badge>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-card rounded-xl shadow-card glow-border mb-4 max-h-[400px] overflow-y-auto">
        <div className="p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary/15 text-foreground border border-primary/20"
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="bg-secondary rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Transcript preview */}
      {isListening && transcript && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-secondary/50 rounded-lg p-3 mb-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Your speech:
          </p>
          <p className="text-sm text-foreground">{transcript}</p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!interviewComplete ? (
          <>
            {!isListening ? (
              <Button
                onClick={startListening}
                disabled={isLoading || isSpeaking}
                size="lg"
                className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 gap-2"
              >
                <Mic className="w-5 h-5" />
                Hold to Speak
              </Button>
            ) : (
              <Button
                onClick={stopListeningAndSend}
                size="lg"
                variant="destructive"
                className="gap-2 animate-pulse"
              >
                <MicOff className="w-5 h-5" />
                Stop & Send
              </Button>
            )}
          </>
        ) : (
          <Button onClick={handleProceed} size="lg" className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 gap-2">
            Continue to Technical Round
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        {interviewComplete
          ? "Great job! Your AI interview is complete."
          : "Click the mic button, speak your answer, then click stop to send it to the AI interviewer."}
      </p>
    </motion.div>
  );
}
