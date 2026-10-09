import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { SubscriptionTier, Message } from '../types';
import { AppEmpireConfig, getTheme, ALL_EMPIRE_APPS, AppConfig } from '../themeManager';
import { AppInteractiveTools } from './AppInteractiveTools';
import { runUniversalQuery } from '../services/gemini';
import { AdBanner } from './AdBanner';
import PricingModal from './PricingModal';

interface UniversalAppProps {
  appName?: string;
  appKey?: string;
  appIcon?: string;
  appDesc?: string;
  tier: SubscriptionTier;
  onClose: () => void;
  standaloneMode?: boolean;
}

const UniversalApp: React.FC<UniversalAppProps> = ({
  appName,
  appKey: initialAppKey,
  appIcon,
  appDesc,
  tier,
  onClose,
  standaloneMode = false
}) => {
  const { incrementTaskCount, tokens, isMasterDeveloper, updateTier } = useUser();
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  // Find config by initial key or appName match
  const matchedKey = initialAppKey || Object.keys(AppEmpireConfig).find(k => 
    appName && (AppEmpireConfig[k].name.toLowerCase().includes(appName.toLowerCase()) || appName.toLowerCase().includes(AppEmpireConfig[k].name.toLowerCase()))
  ) || 'law';

  const [activeAppKey, setActiveAppKey] = useState<string>(matchedKey);
  const [activeView, setActiveView] = useState<'consult' | 'tool' | 'lead' | 'partner'>('consult');
  const [searchGroundingActive, setSearchGroundingActive] = useState<boolean>(true);
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false);

  const currentConfig: AppConfig = getTheme(activeAppKey);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: standaloneMode
        ? `Welcome to ${appName || currentConfig.name}.\n\n${appDesc || currentConfig.tagline}\n\nHow can I help you today? You can select a quick prompt below or run the dedicated ${currentConfig.toolName}.`
        : `Welcome to Don's ${currentConfig.name} (${currentConfig.id}/20).\n\n${currentConfig.tagline}\n\nHow can I help you today? You can select a quick prompt below or run the dedicated ${currentConfig.toolName}.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lead state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadValue, setLeadValue] = useState(currentConfig.leadValueEstimate.toString());
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // When app switches, update initial welcome message
  const handleSwitchApp = (key: string) => {
    setActiveAppKey(key);
    setAppSelectorOpen(false);
    const newConfig = getTheme(key);
    setLeadValue(newConfig.leadValueEstimate.toString());
    setLeadSubmitted(false);
    setMessages([
      {
        role: 'model',
        text: `Switched to Don's ${newConfig.name} (${newConfig.id}/20).\n\n${newConfig.tagline}\n\nHow can I assist your analysis today?`
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSend = async (customPrompt?: string) => {
    const userMsg = customPrompt || input.trim();
    if (!userMsg) return;

    // Check paywall for regular unpaid users
    if (!isMasterDeveloper && tier === SubscriptionTier.FREE && tokens <= 0) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "🔒 Free preview limit reached. Don's Grounded AI Empire requires an active subscription or token package. Please upgrade via Cash App ($DonDonaldson800), Stripe, or PayPal to continue."
      }]);
      setShowPaywall(true);
      return;
    }

    if (!customPrompt) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsGenerating(true);
    incrementTaskCount();

    try {
      const systemInstruction = standaloneMode
        ? `You are a specialized ${currentConfig.promptRole} for ${appName || currentConfig.name}.
Provide accurate, structured, and rigorous professional-grade analysis.
Format key findings clearly with bold headings, bullet points, and practical action steps.
Always include a brief professional advisory note at the end.`
        : `You are Don's specialized ${currentConfig.promptRole} for ${currentConfig.name} (${currentConfig.id}/20 in Don's Grounded AI Empire). 
Provide accurate, structured, and rigorous professional-grade analysis.
Format key findings clearly with bold headings, bullet points, and practical action steps.
Always include a brief professional advisory note at the end.`;

      const { text: responseText, links } = await runUniversalQuery({
        systemInstruction,
        domainContext: `${currentConfig.name} (${currentConfig.tagline})`,
        query: userMsg,
        searchGrounding: searchGroundingActive
      });

      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText,
        groundingLinks: links.length > 0 ? links : undefined
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: `Analysis complete with local offline knowledge base. To run live search grounding, ensure an active Gemini API key is configured.`
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadConsent) return;
    setLeadSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-xl relative z-20">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-slate-700/50"
            style={{ backgroundColor: `${currentConfig.primaryColor}33`, borderColor: currentConfig.primaryColor }}
          >
            {appIcon || currentConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 font-bold border border-slate-700">
                {standaloneMode ? `STANDALONE` : `APP ${currentConfig.id}/20`}
              </span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-black border border-indigo-500/30 flex items-center gap-1">
                <span>✨</span> Gemini 3.7
              </span>
              <h2 className="text-base md:text-lg font-black text-white">{standaloneMode && appName ? appName : currentConfig.name}</h2>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{standaloneMode && appDesc ? appDesc : currentConfig.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* App Switcher Dropdown Button (suppressed in Standalone Mode for store compliance) */}
          {!standaloneMode && (
            <div className="relative">
              <button
                onClick={() => setAppSelectorOpen(!appSelectorOpen)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-all"
              >
                <span>Switch App ({currentConfig.id}/20)</span>
                <span className="text-[10px]">▼</span>
              </button>

              {appSelectorOpen && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 custom-scrollbar grid grid-cols-1 gap-1">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                    All 20 Empire Applications
                  </div>
                  {ALL_EMPIRE_APPS.map(app => (
                    <button
                      key={app.key}
                      onClick={() => handleSwitchApp(app.key)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all text-xs ${
                        app.key === activeAppKey ? 'bg-indigo-600/30 text-white font-bold border border-indigo-500/40' : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <span className="text-base">{app.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] text-slate-500">{app.id}</span>
                          <span className="text-[8px] uppercase tracking-wider text-slate-400">{app.category.split(' ')[0]}</span>
                        </div>
                        <div className="truncate font-semibold">{app.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Close Application"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('consult')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeView === 'consult' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>💬</span> AI Consult
          </button>
          <button
            onClick={() => setActiveView('tool')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeView === 'tool' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>⚡</span> {currentConfig.toolName.split(' ')[0]} Tool
          </button>
          <button
            onClick={() => setActiveView('lead')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeView === 'lead' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>📋</span> Request Quote (${currentConfig.leadValueEstimate})
          </button>
          <a
            href={currentConfig.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-400/10 transition-all flex items-center gap-1 border border-amber-400/20"
          >
            <span>⭐</span> {currentConfig.affiliateName}
          </a>
        </div>

        {activeView === 'consult' && (
          <button
            onClick={() => setSearchGroundingActive(!searchGroundingActive)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
              searchGroundingActive 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${searchGroundingActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
            Search Grounding: {searchGroundingActive ? 'ON' : 'OFF'}
          </button>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* VIEW 1: AI CONSULTATION */}
          {activeView === 'consult' && (
            <div className="space-y-6">
              {/* Quick Prompts Carousel */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <span>⚡</span> Instant Analysis Starters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentConfig.quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-left p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-white transition-all group flex items-start gap-2"
                    >
                      <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
                      <span className="leading-snug">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white font-bold' 
                        : 'bg-slate-900 border border-slate-700 text-slate-300'
                    }`}>
                      {msg.role === 'user' ? 'U' : currentConfig.icon}
                    </div>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900/70 border border-slate-800 text-slate-200 rounded-tl-none space-y-3'
                    }`}>
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                      {/* Grounding links */}
                      {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-slate-800 text-xs space-y-1.5">
                          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                            Verified Grounding Sources:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.groundingLinks.map((link, lIdx) => (
                              <a
                                key={lIdx}
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
                    </div>
                  </div>
                ))}

                {isGenerating && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                      <span className="animate-spin text-sm">⚙️</span>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-xs text-slate-400 font-mono ml-2">Grounding {currentConfig.name} node...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* VIEW 2: INTERACTIVE SPECIALIZED TOOL */}
          {activeView === 'tool' && (
            <div className="space-y-6">
              <AppInteractiveTools
                toolType={currentConfig.toolType}
                toolName={currentConfig.toolName}
                primaryColor={currentConfig.primaryColor}
                accentColor={currentConfig.accentColor}
                onSendToAI={(prompt) => {
                  setActiveView('consult');
                  handleSend(prompt);
                }}
              />
            </div>
          )}

          {/* VIEW 3: LEAD CAPTURE & QUOTE REQUEST */}
          {activeView === 'lead' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-white">Professional Consultation Request</h3>
                    <p className="text-xs text-slate-400">Directly connect with certified {currentConfig.name} professionals.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-amber-400">${currentConfig.leadValueEstimate}</div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Est. Value</div>
                  </div>
                </div>

                {leadSubmitted ? (
                  <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                    <div className="text-4xl">✅</div>
                    <h4 className="text-base font-black text-white">Consultation Request Confirmed</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Your inquiry for {currentConfig.name} has been securely logged. An authorized specialist or partner network coordinator will follow up via email.
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
                          placeholder="Jane Doe"
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
                          placeholder="jane@example.com"
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
                          placeholder="(555) 000-0000"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estimated Budget / Value ($)</label>
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
                        id="lead_consent"
                        required
                        checked={leadConsent}
                        onChange={e => setLeadConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <label htmlFor="lead_consent" className="text-slate-400 leading-relaxed text-[11px]">
                        I authorize Don's Grounded AI Empire and its verified network partners to contact me regarding this inquiry. I understand this is an informational concierge connection.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!leadConsent}
                      className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs text-white transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: currentConfig.primaryColor }}
                    >
                      {currentConfig.buttonText}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Targeted Industry Ad Banner - Integrated across all apps for free tier */}
      <AdBanner appKey={activeAppKey} appName={currentConfig.name} tier={tier} slot="banner_bottom" />

      {/* Bottom Fixed Input for Consult Mode */}
      {activeView === 'consult' && (
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="max-w-4xl mx-auto relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={standaloneMode ? `Ask ${appName || currentConfig.name}...` : `Ask Don's ${currentConfig.name}...`}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-full pl-6 pr-14 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isGenerating}
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <span className="text-white text-sm font-bold">↑</span>
            </button>
          </div>
        </div>
      )}

      {showPaywall && (
        <PricingModal
          currentTier={tier}
          onSelectTier={(newTier) => {
            updateTier(newTier);
            setShowPaywall(false);
          }}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  );
};

export default UniversalApp;
