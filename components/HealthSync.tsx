
import React, { useState } from 'react';
import { SubscriptionTier } from '../types';
import { GoogleGenAI } from "@google/genai";
import { useUser } from '../contexts/UserContext';

interface HealthSyncProps {
  tier: SubscriptionTier;
}

const HealthSync: React.FC<HealthSyncProps> = ({ tier }) => {
  const { healthMetrics } = useUser();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following health/medical query and provide grounded, helpful information. 
        IMPORTANT: Include a clear medical disclaimer stating this is not professional advice.
        
        Query: ${query}`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setResponse(result.text || 'No response generated.');
    } catch (error) {
      console.error(error);
      setResponse('Error: Failed to analyze health data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar">
      <div className="p-6 md:p-12 max-w-5xl mx-auto w-full space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <span className="text-2xl text-white">❤️</span>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Health Sync</h2>
              <p className="text-slate-500 text-sm">App 03: Grounded Medical Intelligence & Biometrics</p>
            </div>
          </div>
        </header>

        {/* Biometrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {healthMetrics.map((metric, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-light">{metric.value}</span>
                <span className="text-xs text-slate-400 font-medium">{metric.unit}</span>
              </div>
              <div className={`text-[9px] font-bold uppercase ${metric.trend === 'up' ? 'text-emerald-500' : metric.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
                {metric.trend === 'up' ? '↑ Increasing' : metric.trend === 'down' ? '↓ Decreasing' : '→ Stable'}
              </div>
            </div>
          ))}
        </section>

        {/* AI Analysis Section */}
        <section className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight">AI Health Consultant</h3>
              <p className="text-sm text-slate-500">Ask about symptoms, medications, or wellness strategies. Powered by Grounded AI.</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'What are the common side effects of Lisinopril?' or 'Explain the benefits of intermittent fasting for heart health.'"
                className="w-full bg-slate-100 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-rose-500/20 transition-all min-h-[120px] resize-none"
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20"
              >
                {isLoading ? 'Analyzing Medical Data...' : 'Start AI Analysis'}
              </button>
            </div>

            {response && (
              <div className="mt-8 p-8 bg-rose-50 rounded-3xl border border-rose-100 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <span className="text-lg">🩺</span>
                  <span className="text-xs font-black uppercase tracking-widest">Analysis Result</span>
                </div>
                <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
                <div className="pt-4 border-t border-rose-200">
                  <p className="text-[10px] text-rose-400 italic font-medium">
                    Disclaimer: This information is for educational purposes only and does not constitute medical advice. Always consult with a qualified healthcare provider.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Health Insights */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <div className="p-8 bg-indigo-600 rounded-[40px] text-white space-y-4">
            <h4 className="text-lg font-black tracking-tight">Empire Health Score</h4>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-8 border-white/20 flex items-center justify-center relative">
                <div className="absolute inset-0 border-8 border-white rounded-full" style={{ clipPath: 'inset(0 0 15% 0)' }}></div>
                <span className="text-2xl font-black">85</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">Excellent Condition</p>
                <p className="text-xs text-white/60">Your biometrics are in the top 10% of the Empire network.</p>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-4">
            <h4 className="text-lg font-black tracking-tight">Upcoming Checkups</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs font-medium">Annual Physical</span>
                <span className="text-[10px] font-black text-indigo-400 uppercase">In 12 Days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs font-medium">Dental Cleaning</span>
                <span className="text-[10px] font-black text-slate-500 uppercase">Scheduled</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HealthSync;
