import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendChatMessage } from "@/api/interviewApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "How can I improve communication skills?",
  "What projects should I build next?",
  "How should I explain my resume gap?",
  "Can we do a quick drill on system design?"
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", text: "Hello. I've reviewed your interview analytics. I'm here to help you refine your weak areas and prepare your narrative. What would you like to focus on first?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Simulate API call
      const response = await sendChatMessage(text);
      const newBotMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: response };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <div className="w-12 h-12 rounded-full bg-surface border border-primary/20 flex items-center justify-center text-primary">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif text-primary-text">PrepWise Coach</h1>
          <p className="text-sm text-secondary-text">Private coaching session based on your analytics</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-hide pb-4">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${
              msg.role === "user" ? "bg-primary text-white border-[#4B352A]" : "bg-surface text-primary border-primary/20"
            }`}>
              {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`p-5 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
              msg.role === "user" 
                ? "bg-primary text-white rounded-tr-sm" 
                : "glass-card text-primary-text rounded-tl-sm"
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%] mr-auto">
            <div className="w-10 h-10 rounded-full bg-surface shrink-0 flex items-center justify-center border border-primary/20 text-primary shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-5 glass-card rounded-3xl rounded-tl-sm flex items-center gap-1.5 h-[60px]">
              <motion.div className="w-2 h-2 rounded-full bg-primary/60" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
              <motion.div className="w-2 h-2 rounded-full bg-primary/60" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
              <motion.div className="w-2 h-2 rounded-full bg-primary/60" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 space-y-4">
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(s)}
                className="text-xs px-4 py-2 bg-surface text-secondary-text rounded-full border border-border/50 hover:border-primary/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask your coach anything..."
            className="w-full h-14 pl-6 pr-16 rounded-full glass-card border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary-text placeholder:text-secondary-text/50 shadow-inner"
          />
          <Button 
            size="icon" 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 w-10 h-10 rounded-full bg-primary hover:bg-[#5A3F2C] text-white transition-transform hover:scale-105"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
