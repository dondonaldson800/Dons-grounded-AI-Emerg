
import React, { useState, useEffect } from 'react';
import { AppTab, SubscriptionTier } from './types';
import ChatInterface from './components/ChatInterface';
import SearchMapsInterface from './components/SearchMapsInterface';
import CreativeLab from './components/CreativeLab';
import AudioHub from './components/AudioHub';
import MusicHub from './components/MusicHub';
import SeriesPreview from './components/SeriesPreview';
import LawMedicalHub from './components/LawMedicalHub';
import CodeSmith from './components/CodeSmith';
import HealthSync from './components/HealthSync';
import ManagementHub from './components/ManagementHub';
import DecoyAppsHub from './components/DecoyAppsHub';
import PricingModal from './components/PricingModal';
import DailyRewardsModal from './components/DailyRewardsModal';
import EmpireStoreModal from './components/EmpireStoreModal';
import { useUser } from './contexts/UserContext';
import { AdService } from './services/AdService';
import { STORE_ITEMS } from './components/EmpireStoreModal';
const Platform = { OS: 'web' };

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CHAT);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [showPricing, setShowPricing] = useState<boolean>(false);
  const [devMode, setDevMode] = useState<boolean>(false);
  const [showDailyRewards, setShowDailyRewards] = useState<boolean>(false);
  const [hasSeenDailyRewards, setHasSeenDailyRewards] = useState<boolean>(false);
  const [showStore, setShowStore] = useState<boolean>(false);
  const { user, tier, signIn, logout, updateTier, loading, claimedToday, tokens, activeBadge, isMasterDeveloper, startEliteAccess } = useUser();

  const activeBadgeIcon = activeBadge ? (STORE_ITEMS || []).find(item => item.id === activeBadge)?.icon : null;

  useEffect(() => {
    if (!loading && !claimedToday && !hasSeenDailyRewards) {
      // Small delay to let the app render first
      const timer = setTimeout(() => {
        setShowDailyRewards(true);
        setHasSeenDailyRewards(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, claimedToday, hasSeenDailyRewards]);

  useEffect(() => {
    const initApp = async () => {
      // Initialize AdMob if on native
      if (Platform.OS !== 'web') {
        await AdService.initialize();
        // Optionally show a banner on start for free users
        if (tier === SubscriptionTier.FREE) {
          await AdService.showBanner();
        }
      }

      // Check Gemini Key
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true);
      }
    };
    initApp();
  }, [tier]);

  const handleOpenSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleUpdateTier = async (newTier: SubscriptionTier) => {
    await updateTier(newTier);
    setShowPricing(false);
  };

  const tabs = [
    { id: AppTab.DECOYS, label: 'Flagship Apps (1-6)', icon: '🚀' },
    { id: AppTab.CHAT, label: 'OmniChat', icon: '✨' },
    { id: AppTab.SEARCH, label: 'Explorer', icon: '🌍' },
    { id: AppTab.CREATIVE, label: 'Image Generator', icon: '🎨' },
    { id: AppTab.AUDIO, label: 'Voice', icon: '🎙️' },
    { id: AppTab.MUSIC, label: 'Music', icon: '🎵' },
    { id: AppTab.PREVIEWS, label: 'Series', icon: '🧩' },
    { id: AppTab.LAW_MEDICAL, label: 'Empire Apps', icon: '🏛️' },
    { id: AppTab.CODE, label: 'Code', icon: '💻' },
    { id: AppTab.HEALTH, label: 'Health', icon: '❤️' },
    { id: 'management', label: 'Admin', icon: '⚙️' },
  ];

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-800/50 flex justify-between items-center bg-slate-950/60 backdrop-blur-2xl z-40 relative">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-11 h-11 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-2xl font-black bg-gradient-to-tr from-white to-indigo-400 bg-clip-text text-transparent">D</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
                Don's Grounded AI Empire
                {activeBadgeIcon && <span className="text-xl" title="Active Badge">{activeBadgeIcon}</span>}
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black tracking-widest border border-emerald-500/30">VERSION 2.0</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-black tracking-widest border border-indigo-500/30">20/20 APPS ACTIVE</span>
              <button
                onClick={() => setActiveTab(AppTab.DECOYS)}
                className={`text-[10px] px-2.5 py-0.5 rounded font-black tracking-widest border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === AppTab.DECOYS
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/40 animate-pulse'
                }`}
                title="1 General • 2-3 Medical • 4 Non-Profit • 5-6 Law"
              >
                <span>🚀</span>
                <span>FLAGSHIP (1-6)</span>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <button 
                onClick={() => setShowPricing(true)}
                className={`text-[9px] px-2.5 py-0.5 rounded-full uppercase font-black tracking-[0.1em] border hover:scale-105 transition-transform cursor-pointer flex items-center gap-1 ${
                  tier === SubscriptionTier.ELITE ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20' :
                  tier === SubscriptionTier.PRO ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' :
                  'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
                title="Manage subscription and Elite Access"
              >
                {tier === SubscriptionTier.ELITE && <span>👑</span>}
                <span>{tier} MEMBER</span>
              </button>
              {isMasterDeveloper && (
                <span className="text-[9px] bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 px-2 py-0.5 rounded-full font-black tracking-wider border border-amber-500/30 flex items-center gap-1">
                  <span>⚡</span>
                  <span>MASTER DEV ELITE</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowStore(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all group"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">🛒</span>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Store</span>
          </button>
          <button 
            onClick={() => setShowDailyRewards(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all relative group"
          >
            {!claimedToday && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
            )}
            {!claimedToday && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
            )}
            <span className="text-sm">🪙</span>
            <span className="text-[10px] font-black text-indigo-400">{tokens}</span>
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-slate-700" alt="User" />
              <button 
                onClick={logout}
                className="text-[10px] text-slate-500 hover:text-white font-black uppercase tracking-widest"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={signIn}
              className="text-[10px] bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-full transition-all font-black uppercase tracking-widest text-white"
            >
              Sign In
            </button>
          )}
          {tier === SubscriptionTier.ELITE ? (
            <button 
              onClick={() => setShowPricing(true)}
              className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:bg-amber-500/30 transition-all"
              title="Elite Access is Active"
            >
              <span>👑</span>
              <span>Elite Active</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowPricing(true)}
              className="group relative px-5 py-2 rounded-full overflow-hidden transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-indigo-600 transition-transform group-hover:scale-110"></div>
              <span className="relative text-[10px] font-black uppercase tracking-widest text-white">
                Upgrade
              </span>
            </button>
          )}
          {!hasKey && typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey && (
            <button 
              onClick={handleOpenSelectKey}
              className="text-[10px] bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-full transition-all flex items-center gap-2 font-black uppercase tracking-widest text-amber-300"
            >
              Set API Key
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative z-10">
        <div className="h-full w-full">
          {activeTab === AppTab.DECOYS && <DecoyAppsHub tier={tier} onOpenStore={() => setShowStore(true)} />}
          {activeTab === AppTab.CHAT && <ChatInterface tier={tier} setShowPricing={setShowPricing} />}
          {activeTab === AppTab.SEARCH && <SearchMapsInterface tier={tier} setShowPricing={setShowPricing} />}
          {activeTab === AppTab.CREATIVE && <CreativeLab tier={tier} setShowPricing={setShowPricing} />}
          {activeTab === AppTab.AUDIO && <AudioHub tier={tier} />}
          {activeTab === AppTab.MUSIC && <MusicHub tier={tier} />}
          {activeTab === AppTab.PREVIEWS && (
            <SeriesPreview 
              tier={tier} 
              devMode={devMode} 
              onLaunchEmpire={() => setActiveTab('management' as any)} 
              onLaunchDecoys={() => setActiveTab(AppTab.DECOYS)}
            />
          )}
          {activeTab === AppTab.LAW_MEDICAL && <LawMedicalHub tier={tier} />}
          {activeTab === AppTab.CODE && <CodeSmith tier={tier} />}
          {activeTab === AppTab.HEALTH && <HealthSync tier={tier} />}
          {activeTab === 'management' as any && <ManagementHub />}
        </div>
      </main>

      {/* Navigation */}
      <nav className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-2xl py-4 z-40 relative">
        <div className="max-w-xl mx-auto flex items-center gap-8 overflow-x-auto px-6 pb-2 -mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AppTab)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-2 transition-all duration-300 relative group ${
                activeTab === tab.id 
                ? 'text-indigo-400' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute -top-4 w-8 h-[2px] bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]"></div>
              )}
              <span className={`text-2xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-125 -translate-y-1' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showPricing && (
        <PricingModal 
          currentTier={tier} 
          onSelectTier={handleUpdateTier} 
          onClose={() => setShowPricing(false)} 
        />
      )}

      {showDailyRewards && (
        <DailyRewardsModal onClose={() => setShowDailyRewards(false)} />
      )}

      {showStore && (
        <EmpireStoreModal onClose={() => setShowStore(false)} />
      )}

      {/* Debug Overlay */}
      {devMode && (
        <div className="fixed bottom-24 right-6 w-64 bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 z-50 shadow-2xl pointer-events-none animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Empire Debug</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2 font-mono text-[9px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Tier:</span>
              <span className="text-white">{tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Platform:</span>
              <span className="text-white">{Platform.OS}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Tab:</span>
              <span className="text-white">{activeTab}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">User ID:</span>
              <span className="text-white truncate ml-2">{user?.uid?.slice(0, 8) || 'N/A'}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-amber-500/50 italic">Developer Manager Active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
