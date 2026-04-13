import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const EduAssist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Ciao! Sono EduAssist. Come posso aiutarti con i tuoi studi oggi?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Sei EduAssist, un assistente accademico esperto. Rispondi in italiano in modo professionale, incoraggiante e conciso. Aiuta con spiegazioni, riassunti e consigli di studio."
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'Scusa, non ho capito.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Errore di connessione. Riprova più tardi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden border-white/20"
          >
            <div className="p-4 bg-gradient-to-r from-electric-blue/20 to-vivid-purple/20 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">EduAssist AI</h4>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase font-bold">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' ? "bg-vivid-purple" : "bg-white/10"
                  )}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm",
                    msg.role === 'user' ? "bg-vivid-purple/20 text-white" : "bg-white/5 text-white/80"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Chiedi qualsiasi cosa..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-electric-blue/50"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-electric-blue flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-electric-blue to-vivid-purple flex items-center justify-center shadow-2xl shadow-electric-blue/40 relative group"
      >
        <Sparkles className="text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
        <MessageSquare className="text-white group-hover:opacity-0 transition-opacity" size={24} />
      </motion.button>
    </div>
  );
};
