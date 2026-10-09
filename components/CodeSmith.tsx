import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { SubscriptionTier, Message } from '../types';
import { runChat } from '../services/gemini';

interface CodeSmithProps {
  tier: SubscriptionTier;
}

const CodeSmith: React.FC<CodeSmithProps> = ({ tier }) => {
  const { user, incrementTaskCount } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome to Code Smith. I am your Master Developer AI. Paste your code, describe your architecture, or ask for debugging help.' }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsGenerating(true);
    incrementTaskCount();

    try {
      const result = await runChat(
        `You are Code Smith, an elite Master Developer AI assistant. Help the user with the following coding request: ${userMsg}`,
        messages,
        { model: 'gemini-3.1-pro-preview', thinking: true }
      );

      setMessages(prev => [...prev, { role: 'model', text: result.text || 'No response generated.' }]);
    } catch (error) {
      console.error('Error generating code:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to Code Smith. Please try again.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <header className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl">
          💻
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Code Smith</h2>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Master Developer Assistant</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Gemini 3.1 Pro</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-sm font-mono text-sm'
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                  <span className="text-xs">🤖</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Code Smith</span>
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono text-slate-500">Compiling response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-950 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Paste code or describe your architecture..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-16 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none min-h-[60px] max-h-[200px] custom-scrollbar"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 bottom-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl flex items-center justify-center transition-colors text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
            Powered by Gemini 3.1 Pro • Don's Empire Node 02
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeSmith;
