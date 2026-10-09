
import React, { useState, useRef, useEffect } from 'react';
import { runChat, fileToBase64 } from '../services/gemini';
import { Message, SubscriptionTier, Attachment } from '../types';
import { useUser } from '../contexts/UserContext';

interface ChatInterfaceProps {
  tier: SubscriptionTier;
  setShowPricing: (show: boolean) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ tier, setShowPricing }) => {
  const { incrementTaskCount } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm Don's Grounded AI. I can analyze images, videos, audio, and documents. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [lowLatency, setLowLatency] = useState(tier === SubscriptionTier.FREE);
  const [searchGrounding, setSearchGrounding] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.7-flash' | 'gemini-3.7-pro' | 'gemini-2.5-flash'>('gemini-3.7-flash');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsLoading(true);
          try {
            const { transcribeAudio } = await import('../services/gemini');
            const transcription = await transcribeAudio(base64Audio, 'audio/webm');
            setInput(prev => prev + (prev ? ' ' : '') + transcription);
          } catch (error) {
            console.error("Transcription error", error);
          } finally {
            setIsLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    const currentInput = input;
    const currentFiles = [...selectedFiles];
    
    setInput('');
    setSelectedFiles([]);
    setIsLoading(true);

    const attachments: Attachment[] = currentFiles.map(file => ({
      url: URL.createObjectURL(file),
      mimeType: file.type,
      name: file.name
    }));

    const userMsg: Message = { 
      role: 'user', 
      text: currentInput,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const options: any = { 
        model: selectedModel,
        thinking: tier !== SubscriptionTier.FREE && thinkingMode, 
        lowLatency: tier === SubscriptionTier.FREE || lowLatency,
        search: searchGrounding,
        attachments: await Promise.all(currentFiles.map(async file => ({
          data: await fileToBase64(file),
          mimeType: file.type
        })))
      };

      const result = await runChat(currentInput, messages, options);
      incrementTaskCount();
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text,
        isThinking: options.thinking
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error processing that request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderAttachment = (att: Attachment) => {
    if (att.mimeType.startsWith('image/')) {
      return <img src={att.url} className="rounded-lg mb-2 max-h-64 w-full object-cover" alt={att.name || "Image"} />;
    }
    if (att.mimeType.startsWith('video/')) {
      return <video src={att.url} className="rounded-lg mb-2 max-h-64 w-full" controls />;
    }
    if (att.mimeType.startsWith('audio/')) {
      return <audio src={att.url} className="w-full mb-2" controls />;
    }
    return (
      <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700 mb-2">
        <span className="text-2xl">📄</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate text-slate-200">{att.name || 'Document'}</p>
          <p className="text-[10px] text-slate-500 uppercase">{att.mimeType.split('/')[1]}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Settings Bar */}
      <div className="flex items-center gap-2 p-3 bg-slate-900/50 border-b border-slate-800 overflow-x-auto custom-scrollbar">
        {/* Gemini 3.7 Model Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedModel('gemini-3.7-flash')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
              selectedModel === 'gemini-3.7-flash'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>✨</span>
            <span>Gemini 3.7 Flash</span>
          </button>
          <button
            onClick={() => setSelectedModel('gemini-3.7-pro')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
              selectedModel === 'gemini-3.7-pro'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🧠</span>
            <span>3.7 Pro</span>
          </button>
        </div>

        <button 
          onClick={() => {
            if (tier === SubscriptionTier.FREE) {
              setShowPricing(true);
              return;
            }
            setThinkingMode(!thinkingMode);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
            thinkingMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-400 border border-transparent'
          } ${tier === SubscriptionTier.FREE ? 'opacity-50 grayscale' : ''}`}
        >
          <span>🧠</span>
          Thinking {tier === SubscriptionTier.FREE && "🔒"}
        </button>
        <button 
          onClick={() => {
            if (tier === SubscriptionTier.FREE) {
              setShowPricing(true);
              return;
            }
            setLowLatency(!lowLatency);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
            lowLatency ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-400 border border-transparent'
          } ${tier === SubscriptionTier.FREE ? 'opacity-50 grayscale' : ''}`}
        >
          <span>⚡</span>
          {tier === SubscriptionTier.FREE ? 'Forced Lite 🔒' : 'Fast Mode'}
        </button>
        <button 
          onClick={() => setSearchGrounding(!searchGrounding)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
            searchGrounding ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-800 text-slate-400 border border-transparent'
          }`}
        >
          <span>🔍</span>
          Search Grounding
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
            }`}>
              {msg.isThinking && (
                <div className="text-[10px] text-amber-400 font-bold uppercase mb-1 flex items-center gap-1">
                  <span>🧠</span> Thoughtfully generated
                </div>
              )}
              {msg.attachments?.map((att, idx) => (
                <div key={idx}>{renderAttachment(att)}</div>
              ))}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl p-4 rounded-tl-none border border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative group">
                {file.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(file)} className="h-16 w-16 object-cover rounded-lg border border-slate-600" />
                ) : (
                  <div className="h-16 w-16 bg-slate-800 rounded-lg border border-slate-600 flex flex-col items-center justify-center text-[8px] p-1 text-center overflow-hidden">
                    <span className="text-xl mb-1">
                      {file.type.startsWith('video/') ? '🎬' : file.type.startsWith('audio/') ? '🎵' : '📄'}
                    </span>
                    <span className="truncate w-full">{file.name}</span>
                  </div>
                )}
                <button 
                  onClick={() => removeFile(idx)} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple
            accept="image/*,video/*,audio/*,application/pdf,text/plain"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              setSelectedFiles(prev => [...prev, ...files]);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors shrink-0"
            title="Attach files"
          >
            📎
          </button>
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all shrink-0 ${
              isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-800 hover:bg-slate-700'
            }`}
            title={isRecording ? "Stop Recording" : "Transcribe Audio"}
          >
            {isRecording ? '⏹️' : '🎙️'}
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isRecording ? "Listening..." : "Ask anything about your data..."}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 shrink-0"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
