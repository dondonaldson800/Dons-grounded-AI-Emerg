
import React, { useState, useEffect } from 'react';
import { searchGrounding, mapsGrounding } from '../services/gemini';
import { SubscriptionTier } from '../types';
import { useUser } from '../contexts/UserContext';

interface SearchMapsInterfaceProps {
  tier: SubscriptionTier;
  setShowPricing: (show: boolean) => void;
}

const SearchMapsInterface: React.FC<SearchMapsInterfaceProps> = ({ tier, setShowPricing }) => {
  const { incrementTaskCount } = useUser();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'search' | 'maps'>('search');
  const [results, setResults] = useState<{ text: string, links: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('grounded_search_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse search history", e);
      }
    }
  }, []);

  const saveToHistory = (newQuery: string) => {
    const trimmed = newQuery.trim();
    if (!trimmed) return;
    
    setHistory(prev => {
      const filtered = prev.filter(h => h.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      localStorage.setItem('grounded_search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAction = async (forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery.trim()) return;

    // Tier Restrictions
    if (mode === 'maps' && tier !== SubscriptionTier.ELITE) {
       setShowPricing(true);
       return;
    }
    
    if (!forcedQuery) {
      saveToHistory(activeQuery);
    }
    
    setIsLoading(true);
    setResults(null);
    try {
      if (mode === 'search') {
        const res = await searchGrounding(activeQuery);
        setResults(res);
        incrementTaskCount();
      } else {
        const res = await mapsGrounding(activeQuery);
        setResults(res);
        incrementTaskCount();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = (mode === 'maps' && tier !== SubscriptionTier.ELITE);

  return (
    <div className="p-6 md:p-12 h-full overflow-y-auto bg-slate-950 relative">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌍</span>
            <h2 className="text-4xl font-black tracking-tighter text-white">Grounded Explorer</h2>
          </div>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            Real-time intelligence from the world's most trusted data sources. App 1 of our 20-app series focuses on spatial and digital grounding.
          </p>
        </header>

        <div className="bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/50 flex backdrop-blur-md">
          <button 
            onClick={() => setMode('search')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              mode === 'search' ? 'bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🔍</span> Search Grounding
          </button>
          <button 
            onClick={() => setMode('maps')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              mode === 'maps' ? 'bg-emerald-600 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>📍</span> Maps Discovery
            {tier !== SubscriptionTier.ELITE && mode !== 'maps' && <span className="ml-1 text-[8px] bg-slate-800 px-1.5 py-0.5 rounded">ELITE</span>}
          </button>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAction()}
              placeholder={mode === 'search' ? "What's happening in tech today?" : "Find highly rated Italian spots in NYC..."}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-md placeholder:text-slate-600 shadow-inner"
            />
            <button 
              onClick={() => handleAction()}
              disabled={isLoading}
              className={`absolute right-3 top-3 bottom-3 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isLoading 
                ? 'bg-slate-800 text-slate-500' 
                : 'bg-white text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? 'Thinking...' : 'Explore'}
            </button>
          </div>
          
          {history.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(h); handleAction(h); }}
                  className="px-4 py-2 bg-slate-900/40 border border-slate-800 hover:border-slate-600 rounded-full text-[10px] text-slate-500 font-bold uppercase tracking-wider transition-all"
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLocked && (
          <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/20 text-center space-y-4 backdrop-blur-sm">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl">
              🔒
            </div>
            <h3 className="text-xl font-black text-white">Upgrade Required</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Maps grounding is exclusive to Elite members, offering deep spatial intelligence.
            </p>
            <button 
              onClick={() => setShowPricing(true)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
            >
              View Pricing
            </button>
          </div>
        )}

        {results && (
          <div className="bg-slate-900/30 border border-slate-800/60 rounded-[2.5rem] p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="prose prose-invert max-w-none text-slate-200 text-base leading-[1.8] font-medium">
              {results.text}
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">Verification Sources</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.links.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group p-4 bg-slate-950/50 border border-slate-800/40 rounded-2xl hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <span className="text-xs font-black text-slate-200 group-hover:text-white transition-colors truncate">{link.title}</span>
                      <span className="text-[10px] text-slate-500 truncate">{new URL(link.uri).hostname}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMapsInterface;
