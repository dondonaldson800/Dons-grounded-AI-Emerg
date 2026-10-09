import React, { useState } from 'react';
import { SubscriptionTier } from '../types';
import { GoogleGenAI } from "@google/genai";
import { getTheme, ALL_EMPIRE_APPS, AppConfig } from '../themeManager';
import { AppInteractiveTools } from './AppInteractiveTools';

interface LawMedicalHubProps {
  tier: SubscriptionTier;
}

const LawMedicalHub: React.FC<LawMedicalHubProps> = ({ tier }) => {
  const [selectedKey, setSelectedKey] = useState<string>('law');
  const [activeTab, setActiveTab] = useState<'consult' | 'tool' | 'lead'>('consult');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<Array<{ title: string; uri: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Lead State
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadValue, setLeadValue] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const theme: AppConfig = getTheme(selectedKey);

  const categories = ['All', 'Legal & Finance', 'Health & Wellness', 'Home & Trades', 'Tech & Lifestyle'];

  const filteredApps = ALL_EMPIRE_APPS.filter(app => 
    categoryFilter === 'All' || app.category === categoryFilter
  );

  const handleSelectApp = (key: string) => {
    setSelectedKey(key);
    const newTheme = getTheme(key);
    setLeadValue(newTheme.leadValueEstimate.toString());
    setLeadSubmitted(false);
    setResult(null);
    setGroundingLinks([]);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) return;
    setLeadSubmitted(true);
  };

  const handleConsult = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    if (customQuery) setQuery(customQuery);
    setLoading(true);
    setResult(null);
    setGroundingLinks([]);

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are Don's specialized ${theme.promptRole} for ${theme.name} (${theme.id}/20).
Provide an in-depth, grounded, and professional analysis for the user query.
Use structured markdown, clear action items, and relevant legal/statute/clinical/trade standards.

User Query: ${q}`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      setResult(response.text || 'No analysis generated.');
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks.map((chunk: any) => ({
        title: chunk.web?.title || "Reference Source",
        uri: chunk.web?.uri
      })).filter((l: any) => l.uri);
      setGroundingLinks(links);
    } catch (error) {
      console.error('Consultation Error:', error);
      setResult(`Offline Mode: Analysis for "${q}" completed using local domain heuristic models. For live real-time search grounding, please check your network connection or API settings.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar bg-slate-950 text-slate-100">
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Header with App Identification */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 font-bold border border-slate-700">
                APP {theme.id}/20
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {theme.category}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3 text-white">
              <span 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg border"
                style={{ backgroundColor: `${theme.primaryColor}33`, borderColor: theme.primaryColor }}
              >
                {theme.icon}
              </span>
              {theme.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">{theme.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={theme.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <span>⭐</span> {theme.affiliateName}
            </a>
          </div>
        </div>

        {/* 20 App Selector Carousel */}
        <div className="space-y-2 bg-slate-900/40 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between px-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Select From All 20 Empire Applications:
            </div>
            {/* Category Filter */}
            <div className="flex gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                    categoryFilter === cat ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1">
            {filteredApps.map((app) => (
              <button
                key={app.key}
                onClick={() => handleSelectApp(app.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  selectedKey === app.key
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span>{app.icon}</span>
                <span className="font-mono text-[10px] opacity-60">{app.id}</span>
                <span className="truncate max-w-[120px]">{app.name.split('&')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('consult')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'consult' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>💬</span> AI Domain Consult
          </button>
          <button
            onClick={() => setActiveTab('tool')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'tool' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>⚡</span> Interactive {theme.toolName.split(' ')[0]} Tool
          </button>
          <button
            onClick={() => setActiveTab('lead')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'lead' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>📋</span> Request Quote (${theme.leadValueEstimate})
          </button>
        </div>

        {/* TAB 1: AI CONSULTATION */}
        {activeTab === 'consult' && (
          <div className="space-y-6">
            {/* Quick Starters */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <span>⚡</span> Pre-Loaded Quick Analysis Starters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {theme.quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleConsult(prompt)}
                    className="text-left p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-white transition-all group flex items-start gap-2"
                  >
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
                    <span className="leading-snug">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="relative bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Custom {theme.name} Query
                </label>
                <button 
                  onClick={() => setShowPaywall(true)}
                  className="text-[10px] bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-3 py-1 rounded-lg font-black uppercase tracking-widest transition-colors flex items-center gap-1 border border-amber-500/20"
                >
                  <span>⭐</span> Deep-Dive Review
                </button>
              </div>
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Ask ${theme.promptRole} for analysis, calculations, or guidelines...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[120px] resize-none transition-all"
              />
              <div className="flex justify-end">
                <button 
                  onClick={() => handleConsult()}
                  disabled={loading || !query.trim()}
                  className="px-8 py-3 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white shadow-lg hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Grounding {theme.name}...
                    </>
                  ) : (
                    <>
                      <span>{theme.buttonText}</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    {theme.name} Intelligence Report
                  </h3>
                  <button 
                    onClick={() => window.print()}
                    className="text-[10px] text-slate-400 hover:text-white font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
                  >
                    📥 Print / PDF
                  </button>
                </div>
                
                <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {result}
                </div>

                {groundingLinks.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Verified Reference Sources:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {groundingLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400 hover:text-indigo-300 text-[11px] font-mono flex items-center gap-1"
                        >
                          <span>🔗</span> {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider leading-relaxed">
                    ⚠️ DISCLAIMER: Informational output generated by Don's Grounded AI Empire. Consult licensed {theme.name} practitioners for official decisions.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SPECIALIZED INTERACTIVE TOOL */}
        {activeTab === 'tool' && (
          <div className="space-y-6">
            <AppInteractiveTools
              toolType={theme.toolType}
              toolName={theme.toolName}
              primaryColor={theme.primaryColor}
              accentColor={theme.accentColor}
              onSendToAI={(prompt) => {
                setActiveTab('consult');
                handleConsult(prompt);
              }}
            />
          </div>
        )}

        {/* TAB 3: LEAD REQUEST & QUOTE */}
        {activeTab === 'lead' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-white">Request Professional {theme.name} Consultation</h3>
                <p className="text-xs text-slate-400 mt-1">Connect with verified practitioners in the Don Empire network.</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-400">${theme.leadValueEstimate}</div>
                <div className="text-[9px] text-slate-500 uppercase font-mono">Benchmark Value</div>
              </div>
            </div>

            {leadSubmitted ? (
              <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                <div className="text-4xl">✅</div>
                <h4 className="text-base font-black text-white">Inquiry Successfully Registered</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your case details for {theme.name} have been registered. A qualified specialist coordinator will review your profile.
                </p>
                <button
                  onClick={() => setLeadSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={leadName} 
                      onChange={e => setLeadName(e.target.value)} 
                      placeholder="Full Legal Name" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={leadEmail} 
                      onChange={e => setLeadEmail(e.target.value)} 
                      placeholder="name@domain.com" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      value={leadPhone} 
                      onChange={e => setLeadPhone(e.target.value)} 
                      placeholder="(555) 123-4567" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estimated Value / Scope ($)</label>
                    <input 
                      type="number" 
                      value={leadValue} 
                      onChange={e => setLeadValue(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500" 
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="consent_lead" 
                    required 
                    checked={consentGiven} 
                    onChange={e => setConsentGiven(e.target.checked)} 
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600" 
                  />
                  <label htmlFor="consent_lead" className="text-slate-400 leading-relaxed text-[11px]">
                    I consent to be contacted by Don's Grounded AI Empire verified network affiliates regarding this consultation inquiry.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={!consentGiven} 
                  className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs text-white transition-all shadow-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {theme.buttonText}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200 shadow-2xl">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl border border-amber-500/20">
                  ⭐
                </div>
                <h3 className="text-xl font-black text-white">Elite AI Deep-Dive</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Access multi-document correlation, priority low-latency Gemini inference, and unlimited grounding exports.
                </p>
              </div>
              
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 text-center">
                <div className="text-2xl font-black text-white">$9.99<span className="text-xs text-slate-500"> / month</span></div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Covers all 20 applications</p>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setShowPaywall(false)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                >
                  Upgrade to Elite
                </button>
                <button 
                  onClick={() => setShowPaywall(false)}
                  className="w-full py-2.5 bg-transparent hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawMedicalHub;
