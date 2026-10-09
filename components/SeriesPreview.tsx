import React, { useState } from 'react';
import { SubscriptionTier } from '../types';
import UniversalApp from './UniversalApp';
import { ALL_EMPIRE_APPS, AppConfig } from '../themeManager';

interface SeriesPreviewProps {
  tier: SubscriptionTier;
  devMode?: boolean;
  onLaunchEmpire?: () => void;
  onLaunchDecoys?: () => void;
}

const SeriesPreview: React.FC<SeriesPreviewProps> = ({ tier, devMode, onLaunchEmpire, onLaunchDecoys }) => {
  const [selectedApp, setSelectedApp] = useState<AppConfig | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Legal & Finance', 'Health & Wellness', 'Home & Trades', 'Tech & Lifestyle'];

  const filteredApps = ALL_EMPIRE_APPS.filter(app => {
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 md:p-10 h-full overflow-y-auto bg-slate-950 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <header className="text-center space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            ALL 20 APPS OPERATIONAL • VERSION 2.0
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
            The Complete 20-App Empire
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Every application in Don's Grounded AI Empire is fully functional with specialized industry intelligence, interactive calculators, search grounding, and client lead workflows.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-2">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-emerald-400">20 / 20</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Apps Active</div>
            </div>
            <div className="w-16 h-[1px] bg-slate-800 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-indigo-400">100%</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Grounded AI</div>
            </div>
            <div className="w-16 h-[1px] bg-slate-800 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-amber-400">Amazon & Samsung</div>
              <div className="text-[9px] text-amber-500/80 font-bold uppercase tracking-widest">Store Ready</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={onLaunchEmpire}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
            >
              <span>📦</span>
              <span>Amazon & Samsung Store Deployment Hub</span>
              <span>→</span>
            </button>
            {onLaunchDecoys && (
              <button
                onClick={onLaunchDecoys}
                className="px-5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <span>🚀</span>
                <span>Open First 5 Standalone Apps (Gemini 3.7)</span>
                <span>→</span>
              </button>
            )}
          </div>
        </header>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl">
          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search all 20 apps..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1.5 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 20 App Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
          {filteredApps.map((app) => (
            <div 
              key={app.key} 
              className="group relative p-5 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/70 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Top Row */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-slate-700/60 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${app.primaryColor}25`, borderColor: `${app.primaryColor}60` }}
                  >
                    {app.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {['01', '02', '03', '04', '05'].includes(app.id) && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          STANDALONE
                        </span>
                      )}
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        APP {app.id}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                      {app.category.split(' ')[0]}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1.5 mb-4">
                  <h3 className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                    {app.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {app.tagline}
                  </p>
                </div>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {app.features.slice(0, 2).map((feat, fIdx) => (
                    <span 
                      key={fIdx} 
                      className="text-[9px] px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 font-mono"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                <button 
                  onClick={() => setSelectedApp(app)}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
                >
                  <span>Launch App</span>
                  <span className="text-xs">→</span>
                </button>
              </div>

              {/* Accent Glow */}
              <div 
                className="absolute -bottom-6 -right-6 w-20 h-20 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none rounded-full"
                style={{ backgroundColor: app.accentColor }}
              ></div>
            </div>
          ))}
        </div>

        {/* Upgrade Banner for Non-Elite */}
        {tier !== SubscriptionTier.ELITE && (
          <div className="sticky bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-40 border border-indigo-400/30">
            <div>
              <h4 className="font-black text-white text-sm md:text-base tracking-tight">
                👑 All 20 Apps Included in Elite Membership
              </h4>
              <p className="text-indigo-100 text-xs mt-0.5">
                Enjoy unlimited search grounding, priority AI nodes, and full interactive calculators.
              </p>
            </div>
            <button 
              onClick={onLaunchEmpire}
              className="shrink-0 px-6 py-2.5 bg-white text-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Unlock Empire
            </button>
          </div>
        )}
      </div>

      {/* Universal App Fullscreen Runner */}
      {selectedApp && (
        <UniversalApp
          appName={selectedApp.name}
          appKey={selectedApp.key}
          appIcon={selectedApp.icon}
          appDesc={selectedApp.tagline}
          tier={tier}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default SeriesPreview;
