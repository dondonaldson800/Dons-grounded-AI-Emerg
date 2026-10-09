import React, { useState, useRef, useEffect } from 'react';
import { SubscriptionTier, Message } from '../types';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CodeAgentProps {
  tier: SubscriptionTier;
}

const CodeAgent: React.FC<CodeAgentProps> = ({ tier }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY || window.aistudio?.getApiKey?.() || '';
      const ai = new GoogleGenAI({ apiKey });

      const contents = newMessages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: contents,
        config: {
          systemInstruction: "You are an elite master developer and coding assistant for Don's Grounded AI Empire. Provide highly optimized, production-ready code. Explain your reasoning clearly and concisely.",
        },
      });
      
      const modelMessage: Message = { 
        role: 'model', 
        text: response.text || 'No code generated.' 
      };
      
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error: any) {
      console.error('Code Agent Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: `Error: ${error.message || 'Failed to generate code.'}` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span className="text-emerald-400">{'</>'}</span> Master Developer Agent
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
            Powered by Gemini 3.1 Pro
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              <span className="text-3xl">💻</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Initialize Coding Sequence</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Describe the architecture, feature, or bug you want me to handle. I will generate production-ready code for your Empire.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-sm">{msg.text}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:p-4 prose-pre:rounded-xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="text-xs text-slate-500 ml-2 font-mono">Compiling response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950 border-t border-slate-800/50">
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
            placeholder="Instruct the Master Developer..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-12 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none font-mono"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 bottom-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">
            Shift + Enter for new line • Enter to execute
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeAgent;
