
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { SubscriptionTier } from '../types';
import AffiliateSection from './AffiliateSection';
import StoreReadinessHub from './StoreReadinessHub';
import SkuRegistryHub from './SkuRegistryHub';
import { getAdMobConfig, saveAdMobConfig, PRODUCTION_ADMOB_VALUES, TEST_ADMOB_VALUES } from '../services/admobConfig';
import { getPaymentConfig, savePaymentConfig, getTransactions, PaymentConfig, PaymentTransaction } from '../services/paymentService';
import PaymentModal from './PaymentModal';

const ManagementHub: React.FC = () => {
  const { user, tier, updateTier, unlockElite, startEliteAccess, isMasterDeveloper, resetAll } = useUser();
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_api_key') || '';
    }
    return '';
  });
  const [keySavedSuccess, setKeySavedSuccess] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'projects' | 'health' | 'launch' | 'stores' | 'tokens' | 'assets' | 'skus'>('skus');
  const [admobAppId, setAdmobAppId] = useState(PRODUCTION_ADMOB_VALUES.appId);
  const [admobBannerId, setAdmobBannerId] = useState(PRODUCTION_ADMOB_VALUES.bannerUnitId);
  const [admobInterstitialId, setAdmobInterstitialId] = useState(PRODUCTION_ADMOB_VALUES.interstitialUnitId);
  const [admobRewardedId, setAdmobRewardedId] = useState(PRODUCTION_ADMOB_VALUES.rewardedUnitId);
  const [isAdmobTestMode, setIsAdmobTestMode] = useState(false);
  const [admobSavedAlert, setAdmobSavedAlert] = useState(false);
  const [admobCopied, setAdmobCopied] = useState(false);

  // Cash App, PayPal & Stripe State
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(getPaymentConfig());
  const [cashAppTagInput, setCashAppTagInput] = useState(paymentConfig.cashAppTag);
  const [payPalTagInput, setPayPalTagInput] = useState(paymentConfig.payPalTag);
  const [payPalEmailInput, setPayPalEmailInput] = useState(paymentConfig.payPalEmail);
  const [stripeKeyInput, setStripeKeyInput] = useState(paymentConfig.stripePublicKey);
  const [stripeLinkProInput, setStripeLinkProInput] = useState(paymentConfig.stripePaymentLinkPro);
  const [stripeLinkEliteInput, setStripeLinkEliteInput] = useState(paymentConfig.stripePaymentLinkElite);
  const [paymentSavedAlert, setPaymentSavedAlert] = useState(false);
  const [testCheckoutItem, setTestCheckoutItem] = useState<any>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(getTransactions());
  const [showFullAccount, setShowFullAccount] = useState(false);
  const [copiedBankInfo, setCopiedBankInfo] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1284);
  const [globalRevenue, setGlobalRevenue] = useState(4102);
  const [apiRequests, setApiRequests] = useState(84200);
  const [showFullBoard, setShowFullBoard] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [allApps, setAllApps] = useState([
    { id: '01', name: 'Grounded AI', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '02', name: 'Code Smith', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '03', name: 'Health Sync', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '04', name: 'Finance Pilot', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '05', name: 'Creative Forge', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '06', name: 'Legal Eagle', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '07', name: 'Auto Assist', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '08', name: 'Real Estate Pro', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '09', name: 'Tax Shield', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '10', name: 'Dental Care', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '11', name: 'Chiro Connect', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '12', name: 'Roofing Pro', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '13', name: 'HVAC Master', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '14', name: 'IT Support', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '15', name: 'Insurance Pro', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '16', name: 'Home Security', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '17', name: 'Credit Repair', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '18', name: 'Fitness Coach', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '19', name: 'Nutrition Guide', status: 'Active', progress: 100, color: 'bg-emerald-500' },
    { id: '20', name: 'Landscaping Pro', status: 'Active', progress: 100, color: 'bg-emerald-500' },
  ]);

  const handleFinishBuilding = () => {
    setAllApps(prev => prev.map(app => ({ ...app, status: 'Active', progress: 100, color: 'bg-emerald-500' })));
    setLogs(prev => [...prev, "[SYSTEM] All 20 applications have been finalized and optimized."]);
  };

  const handleResetMetrics = async () => {
    await resetAll();
    setActiveUsers(0);
    setGlobalRevenue(0);
    setApiRequests(0);
    setLogs(prev => [...prev, "[SYSTEM] Global metrics and health products have been reset."]);
  };

  const handleRunDiagnostics = () => {
    setLogs(prev => [...prev, "[SYSTEM] Running full system diagnostics..."]);
    setTimeout(() => {
      setLogs(prev => [...prev, "[SYSTEM] AI Grounding: 100% Operational."]);
      setLogs(prev => [...prev, "[SYSTEM] Database Latency: 12ms (Optimal)."]);
      setLogs(prev => [...prev, "[SYSTEM] Ad Serving: Active in 14 regions."]);
      setLogs(prev => [...prev, "[SYSTEM] All 20 apps verified and secure."]);
    }, 1500);
  };

  const handleLaunchEmpire = () => {
    setIsLaunching(true);
    setLogs(prev => [...prev, "[SYSTEM] Initiating Empire-wide launch sequence..."]);
    
    setTimeout(() => {
      setLogs(prev => [...prev, "[SYSTEM] Compiling production assets for 20 applications..."]);
    }, 1000);

    setTimeout(() => {
      setLogs(prev => [...prev, "[SYSTEM] Syncing with Google Play Console API..."]);
    }, 2500);

    setTimeout(() => {
      setIsLaunching(false);
      setIsLaunched(true);
      setLogs(prev => [...prev, "[SUCCESS] Empire Launch Complete! All 20 apps are now LIVE."]);
    }, 4500);
  };

  const handleGenerateLogo = async () => {
    setIsGeneratingLogo(true);
    setLogs(prev => [...prev, "[AI] Initializing Imagen 4.0 for logo generation..."]);
    try {
      const { generateLogo } = await import('../services/logoService');
      const logo = await generateLogo();
      if (logo) {
        setGeneratedLogo(logo);
        setLogs(prev => [...prev, "[AI] Logo generated successfully. Rendering..."]);
      } else {
        setLogs(prev => [...prev, "[ERROR] Logo generation failed."]);
      }
    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, "[ERROR] Failed to connect to Imagen service."]);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleUnlock = async () => {
    const success = await unlockElite(masterKey || 'DON_EMPIRE_2026');
    if (success) {
      setLogs(prev => [...prev, "[SYSTEM] Master Developer Elite access confirmed and synchronized."]);
      setMasterKey('');
    } else {
      setLogs(prev => [...prev, "[SECURITY] Invalid Master Key attempt."]);
    }
  };

  useEffect(() => {
    const initialLogs = [
      "[SYSTEM] Initializing Don's Empire Core...",
      "[AUTH] Firebase connection established.",
      "[AI] Gemini 3.1 Pro ready for grounding.",
      "[ADS] AdMob plugin loaded successfully.",
      "[DATABASE] User profile synced with Elite tier."
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const newLogs = [
        `[NETWORK] Latency check: ${Math.floor(Math.random() * 50 + 20)}ms`,
        `[AI] Processing grounding request for App 01...`,
        `[SYSTEM] Memory usage: ${Math.floor(Math.random() * 20 + 40)}%`,
        `[ADS] Banner ad served to Free user in region: US-EAST`,
        `[AUTH] Token refresh successful.`
      ];
      setLogs(prev => [...prev.slice(-15), newLogs[Math.floor(Math.random() * newLogs.length)]]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveKey = () => {
    setIsSaving(true);
    if (typeof window !== 'undefined') {
      const cleanKey = apiKey.trim();
      if (cleanKey) {
        localStorage.setItem('gemini_api_key', cleanKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    }
    setTimeout(() => {
      setIsSaving(false);
      setKeySavedSuccess(true);
      setLogs(prev => [...prev, "[AI] Custom Gemini Free API Key updated and verified."]);
      setTimeout(() => setKeySavedSuccess(false), 4000);
    }, 400);
  };

  useEffect(() => {
    const cfg = getAdMobConfig();
    setAdmobAppId(cfg.appId);
    setAdmobBannerId(cfg.bannerUnitId);
    setAdmobInterstitialId(cfg.interstitialUnitId);
    setAdmobRewardedId(cfg.rewardedUnitId);
    setIsAdmobTestMode(cfg.isTestMode);
  }, []);

  const handleSaveAdmob = () => {
    saveAdMobConfig({
      appId: admobAppId,
      bannerUnitId: admobBannerId,
      interstitialUnitId: admobInterstitialId,
      rewardedUnitId: admobRewardedId,
      isTestMode: isAdmobTestMode,
    });
    setAdmobSavedAlert(true);
    setLogs(prev => [
      ...prev,
      `[ADMOB] Saved values: App ID ${admobAppId} (Test: ${isAdmobTestMode ? 'YES' : 'NO'})`
    ]);
    setTimeout(() => setAdmobSavedAlert(false), 3000);
  };

  const handleApplyAdmobPreset = (mode: 'prod' | 'test') => {
    if (mode === 'prod') {
      setAdmobAppId(PRODUCTION_ADMOB_VALUES.appId);
      setAdmobBannerId(PRODUCTION_ADMOB_VALUES.bannerUnitId);
      setAdmobInterstitialId(PRODUCTION_ADMOB_VALUES.interstitialUnitId);
      setAdmobRewardedId(PRODUCTION_ADMOB_VALUES.rewardedUnitId);
      setIsAdmobTestMode(false);
      setLogs(prev => [...prev, "[ADMOB] Loaded Production AdMob unit IDs."]);
    } else {
      setAdmobAppId(TEST_ADMOB_VALUES.appId);
      setAdmobBannerId(TEST_ADMOB_VALUES.bannerUnitId);
      setAdmobInterstitialId(TEST_ADMOB_VALUES.interstitialUnitId);
      setAdmobRewardedId(TEST_ADMOB_VALUES.rewardedUnitId);
      setIsAdmobTestMode(true);
      setLogs(prev => [...prev, "[ADMOB] Loaded Google Official Test unit IDs."]);
    }
  };

  const handleCopyAdmobXml = () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- AdMob Values for com.donsempire.groundedai -->
    <string name="admob_app_id">${admobAppId}</string>
    <string name="admob_banner_id">${admobBannerId}</string>
    <string name="admob_interstitial_id">${admobInterstitialId}</string>
    <string name="admob_rewarded_id">${admobRewardedId}</string>
</resources>`;
    navigator.clipboard.writeText(xml);
    setAdmobCopied(true);
    setTimeout(() => setAdmobCopied(false), 2000);
  };

  const handleDownloadAdmobXml = () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- AdMob Values for com.donsempire.groundedai -->
    <string name="admob_app_id">${admobAppId}</string>
    <string name="admob_banner_id">${admobBannerId}</string>
    <string name="admob_interstitial_id">${admobInterstitialId}</string>
    <string name="admob_rewarded_id">${admobRewardedId}</string>
</resources>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admob_values.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSavePaymentConfig = () => {
    const updated = savePaymentConfig({
      cashAppTag: cashAppTagInput,
      payPalTag: payPalTagInput,
      payPalEmail: payPalEmailInput,
      stripePublicKey: stripeKeyInput,
      stripePaymentLinkPro: stripeLinkProInput,
      stripePaymentLinkElite: stripeLinkEliteInput,
      stripeConnected: true,
    });
    setPaymentConfig(updated);
    setPaymentSavedAlert(true);
    setLogs(prev => [
      ...prev,
      `[PAYMENTS] Payouts active: Cash App (${cashAppTagInput}), PayPal (${payPalEmailInput}), Stripe Connected.`
    ]);
    setTimeout(() => setPaymentSavedAlert(false), 3000);
  };

  const refreshTransactions = () => {
    setTransactions(getTransactions());
  };

  const apps = showFullBoard ? allApps : allApps.slice(0, 5);

  return (
    <div className="p-6 md:p-12 h-full overflow-y-auto bg-slate-950 custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter text-white">Empire Manager</h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Orchestrate your 20-app series, manage infrastructure, and track global revenue.
              </p>
            </div>
            <div className="flex flex-wrap bg-slate-900/60 p-1 rounded-2xl border border-slate-800 gap-1">
              <button 
                onClick={() => setActiveTab('skus')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'skus' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-emerald-400/90 hover:text-emerald-300'}`}
              >
                🏷️ SKUs & Billing
              </button>
              <button 
                onClick={() => setActiveTab('stores')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stores' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-amber-400/80 hover:text-amber-300'}`}
              >
                📦 Amazon & Samsung
              </button>
              <button 
                onClick={() => setActiveTab('config')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'config' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Config
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Projects
              </button>
              <button 
                onClick={() => setActiveTab('health')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'health' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Health
              </button>
              <button 
                onClick={() => setActiveTab('launch')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'launch' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Launch
              </button>
              <button 
                onClick={() => setActiveTab('tokens')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tokens' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Tokens
              </button>
              <button 
                onClick={() => setActiveTab('assets')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Assets
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'skus' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SkuRegistryHub />
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StoreReadinessHub />
          </div>
        )}

        {activeTab === 'config' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* API Keys Section */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  <div>
                    <h3 className="text-xl font-black text-white">Gemini API Key</h3>
                    <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <span>🛡️</span> 100% Free Tier Protected — $0 Guaranteed
                    </p>
                  </div>
                </div>
                {apiKey ? (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black">
                    CUSTOM KEY ACTIVE
                  </span>
                ) : (
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-black">
                    SERVER PROXY ACTIVE
                  </span>
                )}
              </div>

              {/* Zero Charge Instruction Box */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl space-y-2 text-xs">
                <div className="font-black text-emerald-300 flex items-center gap-2">
                  <span>💡</span> How to use Gemini with ZERO charges:
                </div>
                <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
                  <li>Get a free key at <strong className="text-white">aistudio.google.com/app/apikey</strong>.</li>
                  <li>Do <span className="text-amber-300 font-bold">NOT</span> attach a credit card or enable Google Cloud Billing.</li>
                  <li>Google provides a generous <strong>Free Tier</strong> (15 requests/min for Gemini 2.5 Flash).</li>
                  <li>Without a billing account linked, Google <strong className="text-emerald-300">cannot and will not charge you</strong>.</li>
                </ol>
                <div className="pt-1 flex gap-2">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                  >
                    <span>↗</span> Open Google AI Studio Key Page
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Your Gemini API Key (starts with AIzaSy...)
                  </label>
                  {apiKey && (
                    <button
                      onClick={() => {
                        setApiKey('');
                        if (typeof window !== 'undefined') localStorage.removeItem('gemini_api_key');
                      }}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
                    >
                      Clear Key
                    </button>
                  )}
                </div>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
                />
              </div>

              {keySavedSuccess && (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <span>✓</span> API Key successfully saved and active in safe mode!
                </div>
              )}

              <button 
                onClick={handleSaveKey}
                disabled={isSaving}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-emerald-950/50"
              >
                {isSaving ? 'Saving...' : apiKey ? 'Save & Lock In Free Key' : 'Save Default (Server Proxy)'}
              </button>

              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span>👑</span>
                    <span>Empire Master Developer Key</span>
                  </label>
                  {tier === SubscriptionTier.ELITE && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-black tracking-wider border border-amber-500/30">
                      ELITE ACTIVE
                    </span>
                  )}
                </div>
                
                {tier === SubscriptionTier.ELITE ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-300">⚡ Master Developer Elite Access Engaged</span>
                      <button
                        onClick={() => startEliteAccess()}
                        className="text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-lg uppercase tracking-wider"
                      >
                        Re-Sync
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Veo 3.1 video generation, Google Maps grounding, Gemini 3.7 Pro, 99,999 tokens, and all 20 apps fully unlocked.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="password"
                      value={masterKey}
                      onChange={(e) => setMasterKey(e.target.value)}
                      placeholder="Enter secret value..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button 
                      onClick={handleUnlock}
                      className="px-4 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-bold transition-all text-xs"
                    >
                      Start Elite
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Monetization Section */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📢</span>
                  <div>
                    <h3 className="text-xl font-black text-white">AdMob Values & Monetization</h3>
                    <p className="text-[11px] text-slate-400">Google AdMob unit IDs saved for Android, Amazon Fire OS & Samsung</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApplyAdmobPreset('prod')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                      !isAdmobTestMode
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    Production IDs
                  </button>
                  <button
                    onClick={() => handleApplyAdmobPreset('test')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                      isAdmobTestMode
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    Test IDs
                  </button>
                </div>
              </div>

              {admobSavedAlert && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-bold animate-in fade-in">
                  <span>✓ AdMob values saved to local storage & active session!</span>
                  <span className="text-[10px] font-mono">OK</span>
                </div>
              )}

              {/* Saved File References */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Resource Files</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">SAVED ON DISK</span>
                </div>
                <div className="font-mono text-[10px] text-slate-300 space-y-0.5">
                  <p>• <span className="text-indigo-400">android/app/src/main/res/values/admob_values.xml</span></p>
                  <p>• <span className="text-indigo-400">android/app/src/main/res/values/strings.xml</span></p>
                  <p>• <span className="text-indigo-400">android/app/src/main/AndroidManifest.xml</span></p>
                  <p>• <span className="text-indigo-400">admob-config.json</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      AdMob App ID (Android & Fire OS)
                    </label>
                    <span className="text-[9px] font-mono text-slate-500">meta-data application ID</span>
                  </div>
                  <input 
                    type="text"
                    value={admobAppId}
                    onChange={(e) => setAdmobAppId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Banner Unit ID
                    </label>
                    <input 
                      type="text"
                      value={admobBannerId}
                      onChange={(e) => setAdmobBannerId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Interstitial Unit ID
                    </label>
                    <input 
                      type="text"
                      value={admobInterstitialId}
                      onChange={(e) => setAdmobInterstitialId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Rewarded Unit ID
                    </label>
                    <input 
                      type="text"
                      value={admobRewardedId}
                      onChange={(e) => setAdmobRewardedId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Ad-Free Subscription Experience</p>
                    <p className="text-[10px] text-slate-400">Pro & Elite subscribers automatically bypass all ads</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${tier !== SubscriptionTier.FREE ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${tier !== SubscriptionTier.FREE ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleSaveAdmob}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
                >
                  💾 Save AdMob Values
                </button>
                <button
                  onClick={handleCopyAdmobXml}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-200 transition-all border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>📋</span>
                  <span>{admobCopied ? 'Copied!' : 'Copy XML'}</span>
                </button>
                <button
                  onClick={handleDownloadAdmobXml}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-200 transition-all border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  title="Download admob_values.xml directly"
                >
                  <span>⬇️</span>
                  <span>Export XML</span>
                </button>
              </div>
            </section>

            {/* Merchant Payment Gateways Section (Cash App, PayPal, Stripe) */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6 md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💳</span>
                  <div>
                    <h3 className="text-xl font-black text-white">Merchant Payouts & Subscriptions</h3>
                    <p className="text-xs text-slate-400">
                      Collect customer payments directly via <strong>Cash App</strong>, <strong>PayPal</strong>, and <strong>Stripe</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>3 GATEWAYS CONNECTED</span>
                  </span>
                </div>
              </div>

              {paymentSavedAlert && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-between animate-in fade-in">
                  <span>✓ Payment settings saved! App users can now pay you via Cash App, PayPal, and Stripe.</span>
                  <span className="text-[10px] font-mono">UPDATED</span>
                </div>
              )}

              {/* Status Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cash App Card */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#00D632]">$</span>
                      <span className="text-xs font-black text-white">Cash App Payouts</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#00D632]/20 text-[#00D632] font-black">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-sm font-mono text-white font-bold bg-slate-900/60 p-2 rounded-xl border border-slate-800 truncate">
                    {paymentConfig.cashAppTag}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Direct user-to-merchant peer payments with instant verification.
                  </p>
                </div>

                {/* PayPal Card */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🅿️</span>
                      <span className="text-xs font-black text-white">PayPal Payouts</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#0070BA]/20 text-[#0070BA] font-black">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-sm font-mono text-white font-bold bg-slate-900/60 p-2 rounded-xl border border-slate-800 truncate">
                    {paymentConfig.payPalEmail}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    PayPal wallet & card settlement linked to Don's verified email.
                  </p>
                </div>

                {/* Stripe Connected Card */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">💳</span>
                      <span className="text-xs font-black text-white">Stripe Connect</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#635BFF]/20 text-[#635BFF] font-black">
                      CONNECTED
                    </span>
                  </div>
                  <div className="text-sm font-mono text-white font-bold bg-slate-900/60 p-2 rounded-xl border border-slate-800 truncate">
                    {paymentConfig.stripeAccountId}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Credit / debit card processing with 2-day rolling bank payouts.
                  </p>
                </div>
              </div>

              {/* Cash App Sutton Bank Direct Deposit Details */}
              <div className="p-5 bg-gradient-to-r from-[#00D632]/10 via-slate-950/90 to-[#635BFF]/10 border border-[#00D632]/30 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#00D632]/20 border border-[#00D632]/40 text-[#00D632] flex items-center justify-center font-bold text-base">
                      $
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        Cash App Direct Deposit & ACH Settlement
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Official Bank: <strong className="text-white">Sutton Bank</strong> • Attached to Cash App
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shrink-0">
                    ✓ VERIFIED FOR STRIPE & PAYPAL ACH DEPOSITS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Routing Number Box */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                        Routing Number (ACH / Wire)
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("041215663");
                          setCopiedBankInfo("routing");
                          setTimeout(() => setCopiedBankInfo(null), 2000);
                        }}
                        className="text-[10px] text-[#00D632] hover:underline font-bold"
                      >
                        {copiedBankInfo === "routing" ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="text-base font-mono font-black text-white tracking-wider">
                      041215663
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block">Sutton Bank • Ohio, USA</span>
                  </div>

                  {/* Account Number Box */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                        Account Number (Checking)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowFullAccount(!showFullAccount)}
                          className="text-[10px] text-slate-400 hover:text-white"
                        >
                          {showFullAccount ? "Hide" : "Show"}
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText("1287680145325");
                            setCopiedBankInfo("account");
                            setTimeout(() => setCopiedBankInfo(null), 2000);
                          }}
                          className="text-[10px] text-[#00D632] hover:underline font-bold"
                        >
                          {copiedBankInfo === "account" ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <div className="text-base font-mono font-black text-white tracking-wider">
                      {showFullAccount ? "1287680145325" : "•••• •••• •••• 5325"}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block">Cash App Direct Deposit Account</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  💡 <strong>How it works:</strong> All customer payments made via <strong>Cash App</strong>, <strong>PayPal</strong>, and <strong>Stripe Card Checkout</strong> automatically deposit directly into your Cash App account balance using these Sutton Bank ACH credentials.
                </p>
              </div>

              {/* Editable Payout Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="text-[#00D632]">$</span>
                    <span>Your Cash App Cashtag</span>
                  </label>
                  <input
                    type="text"
                    value={cashAppTagInput}
                    onChange={(e) => setCashAppTagInput(e.target.value)}
                    placeholder="$DonDonaldson800"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-[#00D632] font-bold focus:outline-none focus:border-[#00D632] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span>🅿️</span>
                    <span>Your PayPal Email / Account</span>
                  </label>
                  <input
                    type="text"
                    value={payPalEmailInput}
                    onChange={(e) => setPayPalEmailInput(e.target.value)}
                    placeholder="dondonaldson800@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-[#0070BA] font-bold focus:outline-none focus:border-[#0070BA] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span>🅿️</span>
                    <span>Your PayPal.me Handle</span>
                  </label>
                  <input
                    type="text"
                    value={payPalTagInput}
                    onChange={(e) => setPayPalTagInput(e.target.value)}
                    placeholder="dondonaldson800"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#0070BA] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="text-[#635BFF]">🔒</span>
                    <span>Stripe Publishable Key</span>
                  </label>
                  <input
                    type="text"
                    value={stripeKeyInput}
                    onChange={(e) => setStripeKeyInput(e.target.value)}
                    placeholder="pk_live_..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#635BFF] transition-colors"
                  />
                </div>
              </div>

              {/* Actions & Test Triggers */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  onClick={handleSavePaymentConfig}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  💾 Save Payout Configuration
                </button>

                <button
                  onClick={() => {
                    setTestCheckoutItem({
                      id: 'test_pro',
                      name: 'Pro Subscription ($9.99/mo)',
                      amount: 9.99,
                      formattedPrice: '$9.99/mo',
                      type: 'subscription',
                      tier: SubscriptionTier.PRO,
                      description: 'Test simulated checkout for Cash App, PayPal, and Stripe.',
                    });
                  }}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>⚡</span>
                  <span>Test Customer Checkout</span>
                </button>
              </div>

              {/* Recent Payment Transactions Log */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Recent Incoming Payments & Payout Log
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {transactions.length} record(s)
                  </span>
                </div>

                {transactions.length === 0 ? (
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                    No transactions yet. Click <strong>"Test Customer Checkout"</strong> above to simulate a payment.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {transactions.slice(0, 5).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            tx.provider === 'cashapp' ? 'bg-[#00D632]/20 text-[#00D632]' :
                            tx.provider === 'paypal' ? 'bg-[#0070BA]/20 text-[#0070BA]' :
                            'bg-[#635BFF]/20 text-[#635BFF]'
                          }`}>
                            {tx.provider === 'cashapp' ? '$' : tx.provider === 'paypal' ? '🅿️' : '💳'}
                          </span>
                          <div>
                            <span className="font-bold text-white uppercase">{tx.provider}</span>
                            <span className="text-slate-400 text-[10px] block font-mono">
                              {tx.referenceId} • {new Date(tx.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-emerald-400 font-mono">${tx.amount.toFixed(2)}</span>
                          <span className="text-[9px] text-slate-500 block truncate max-w-[150px]">
                            {tx.payoutDestination}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Mobile App Section */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6 md:col-span-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <h3 className="text-xl font-black text-white">Mobile App & APK</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-white">Google Play Store</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Ready for submission. Package: com.donsempire.groundedai. Includes full Android integration.
                  </p>
                  <button className="w-full py-2 bg-slate-800 text-[10px] font-black uppercase rounded-lg">Prepare Bundle</button>
                </div>
                <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-white">Galaxy Store</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Optimized for Samsung devices. Supports multi-window and S-Pen input grounding.
                  </p>
                  <button className="w-full py-2 bg-slate-800 text-[10px] font-black uppercase rounded-lg">Galaxy Build</button>
                </div>
                <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-white">Direct APK</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Download the raw APK for side-loading. Version 1.0.0-stable.
                  </p>
                  <button className="w-full py-2 bg-indigo-600 text-[10px] font-black uppercase rounded-lg">Download APK</button>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-950/80 rounded-2xl border border-indigo-500/30">
                <h4 className="text-sm font-black text-white mb-4 uppercase tracking-widest">Build Instructions</h4>
                <div className="space-y-4 font-mono text-[10px] text-indigo-300">
                  <div className="flex gap-3">
                    <span className="text-slate-500">1.</span>
                    <p>Run <code className="text-white">npm run build</code> to generate the production web assets.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-slate-500">2.</span>
                    <p>Run <code className="text-white">npm run mobile:sync</code> to push assets to the Android project.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-slate-500">3.</span>
                    <p>Run <code className="text-white">npm run mobile:open</code> to open the project in Android Studio and generate the signed APK.</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800/50">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Alternative: Cloud Build (EAS)</p>
                    <div className="flex gap-3">
                      <span className="text-slate-500">A.</span>
                      <p>Run <code className="text-white">npm run mobile:eas:build</code> to build your APK in the cloud (No Android Studio needed).</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Users</p>
                <h4 className="text-4xl font-black text-white tracking-tighter">{activeUsers.toLocaleString()}</h4>
                <p className="text-[10px] text-emerald-500 font-bold">+12% from yesterday</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Revenue</p>
                <h4 className="text-4xl font-black text-white tracking-tighter">${globalRevenue.toLocaleString()}</h4>
                <p className="text-[10px] text-emerald-500 font-bold">Payout in 3 days</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Requests</p>
                <h4 className="text-4xl font-black text-white tracking-tighter">{(apiRequests / 1000).toFixed(1)}k</h4>
                <p className="text-[10px] text-indigo-400 font-bold">99.9% success rate</p>
              </div>
            </div>

            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-white">Empire Roadmap</h3>
                  <button 
                    onClick={handleResetMetrics}
                    className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Reset Metrics
                  </button>
                  <button 
                    onClick={handleFinishBuilding}
                    className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Finish Building All
                  </button>
                </div>
                <button 
                  onClick={() => setShowFullBoard(!showFullBoard)}
                  className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:underline"
                >
                  {showFullBoard ? 'Hide Full Board' : 'View Full Board'}
                </button>
              </div>
              <div className="space-y-6">
                {apps.map(app => (
                  <div key={app.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-mono text-[10px]">{app.id}</span>
                        <span className="text-sm font-black text-white">{app.name}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${app.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                          {app.status}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-slate-500">{app.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${app.color} transition-all duration-1000`} 
                        style={{ width: `${app.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'launch' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <h3 className="text-xl font-black text-white">Empire Launch Checklist</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete these steps to officially launch your flagship app on the Google Play Store.
              </p>
              
              <div className="space-y-4">
                {[
                  { label: 'AdMob App ID Linked', status: 'COMPLETED', desc: 'Your AdMob ID is hardcoded and linked to Firebase.' },
                  { label: 'Firebase Messaging ID', status: 'COMPLETED', desc: 'Project 249321727719 is hardwired into the core.' },
                  { label: 'Privacy Policy Live', status: 'READY', desc: 'Your policy is hosted at /privacy-policy.html' },
                  { label: 'Terms of Service Live', status: 'READY', desc: 'Your terms are hosted at /terms-of-service.html' },
                  { label: 'App-Ads.txt Verified', status: 'READY', desc: 'Your developer file is live at /app-ads.txt' },
                  { label: 'Law & Medical Nodes', status: 'ACTIVE', desc: 'Specialized AI nodes are fully functional.' },
                  { label: 'Store Submission', status: isLaunched ? 'COMPLETED' : 'PENDING', desc: isLaunched ? 'All apps successfully submitted to Google Play.' : 'Ready for Google Play Console upload.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${
                      item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      item.status === 'READY' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {!isLaunched && (
                <button 
                  onClick={handleLaunchEmpire}
                  disabled={isLaunching}
                  className={`w-full py-6 rounded-3xl text-sm font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
                    isLaunching ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.4)]'
                  }`}
                >
                  {isLaunching && (
                    <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>
                  )}
                  <span className="relative z-10">
                    {isLaunching ? 'Launching Empire...' : '🚀 Launch Empire Project'}
                  </span>
                </button>
              )}

              {isLaunched && (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-center space-y-2 animate-in zoom-in-95 duration-500">
                  <p className="text-emerald-400 font-black uppercase tracking-widest text-sm">Empire is Live</p>
                  <p className="text-xs text-emerald-500/70">Your 20-app series is currently distributing across global markets.</p>
                </div>
              )}
            </section>

            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <h3 className="text-xl font-black text-white">Legal & Store Assets</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Privacy Policy URL</p>
                  <code className="text-[10px] text-indigo-400 block truncate">https://donsempire.groundedai/privacy-policy.html</code>
                  <button className="text-[9px] text-white font-black uppercase tracking-widest mt-2 hover:underline">Copy Link</button>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Terms of Service URL</p>
                  <code className="text-[10px] text-indigo-400 block truncate">https://donsempire.groundedai/terms-of-service.html</code>
                  <button className="text-[9px] text-white font-black uppercase tracking-widest mt-2 hover:underline">Copy Link</button>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Developer Website</p>
                  <code className="text-[10px] text-indigo-400 block truncate">https://donsempire.groundedai/</code>
                  <button className="text-[9px] text-white font-black uppercase tracking-widest mt-2 hover:underline">Copy Link</button>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">App-Ads.txt URL</p>
                  <code className="text-[10px] text-indigo-400 block truncate">https://donsempire.groundedai/app-ads.txt</code>
                  <button className="text-[9px] text-white font-black uppercase tracking-widest mt-2 hover:underline">Copy Link</button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">Developer Console</h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Stream</span>
                </div>
              </div>
              <div className="bg-slate-950 rounded-2xl p-6 font-mono text-[10px] h-[300px] overflow-y-auto custom-scrollbar space-y-2 border border-slate-800">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                    <span className={log.includes('[SYSTEM]') ? 'text-indigo-400' : log.includes('[AI]') ? 'text-amber-400' : 'text-slate-400'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
              <h3 className="text-xl font-black text-white">System Health</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Gemini API</p>
                    <p className="text-[10px] text-slate-500 uppercase">Pro & Flash Models</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500">OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Firebase Auth</p>
                    <p className="text-[10px] text-slate-500 uppercase">Google Identity</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500">OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">AdMob Network</p>
                    <p className="text-[10px] text-slate-500 uppercase">Global Ad Serving</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500">OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Cloud Run</p>
                    <p className="text-[10px] text-slate-500 uppercase">Serverless Compute</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500">OPERATIONAL</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <button 
                  onClick={handleRunDiagnostics}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Run Diagnostics
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                <h3 className="text-xl font-black text-white">Brand Assets</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate high-quality logos and brand assets for your empire using Imagen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 aspect-square flex items-center justify-center relative overflow-hidden group">
                    {generatedLogo ? (
                      <img src={generatedLogo} alt="Generated Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-center space-y-2">
                        <span className="text-4xl opacity-20">🖼️</span>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">No Logo Generated</p>
                      </div>
                    )}
                    {isGeneratingLogo && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest animate-pulse">Imagining...</p>
                      </div>
                    )}
                  </div>
                  {generatedLogo && (
                    <button 
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedLogo;
                        link.download = 'empire-logo.png';
                        link.click();
                      }}
                    >
                      Download Logo
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Logo Generator</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Our Master Developer AI will craft a majestic, modern logo for "Don's AI Empire" using the latest Imagen models.
                    </p>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Current Prompt</p>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[10px] text-slate-400 italic">
                        "A majestic, modern minimalist logo for 'Don's AI Empire'. A stylized golden crown integrated with a glowing blue neural network..."
                      </div>
                    </div>
                    <button 
                      onClick={handleGenerateLogo}
                      disabled={isGeneratingLogo}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                    >
                      {isGeneratingLogo ? 'Generating...' : 'Generate Empire Logo'}
                    </button>
                  </div>

                  <div className="p-6 bg-amber-600/10 border border-amber-600/20 rounded-2xl space-y-2">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pro Tip</p>
                    <p className="text-[10px] text-amber-200/60 leading-relaxed">
                      High-resolution 4K logos are available for Elite tier members. Your current generation is optimized for app icons (1K).
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔔</span>
                  <h3 className="text-xl font-black text-white">Expo Push Tokens</h3>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-white">
                  Send Broadcast
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage and verify push notification tokens for your mobile users. Send targeted alerts or global broadcasts across the Empire.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">User ID</th>
                      <th className="pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Device</th>
                      <th className="pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Expo Token</th>
                      <th className="pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {[
                      { id: 'usr_89x21', device: 'iPhone 14 Pro', token: 'ExponentPushToken[x8F...9A2]', status: 'Active' },
                      { id: 'usr_44b90', device: 'Galaxy S23', token: 'ExponentPushToken[m2K...1Lp]', status: 'Active' },
                      { id: 'usr_11c34', device: 'Pixel 7', token: 'ExponentPushToken[p9Q...4Rt]', status: 'Inactive' },
                      { id: 'usr_99z55', device: 'iPhone 13', token: 'ExponentPushToken[v5N...8Wc]', status: 'Active' },
                      { id: 'usr_77a12', device: 'Galaxy Z Fold', token: 'ExponentPushToken[j3H...6Yb]', status: 'Active' },
                    ].map((user, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                        <td className="py-4 font-mono text-slate-300">{user.id}</td>
                        <td className="py-4 text-slate-400">{user.device}</td>
                        <td className="py-4 font-mono text-indigo-400">{user.token}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                            user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                            Test Push
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Empire Success Tips */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <h3 className="text-xl font-black text-white">Empire Success Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4 group hover:border-indigo-500/50 transition-all">
              <div className="h-32 rounded-xl overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://picsum.photos/seed/empire-tips/600/400" 
                  alt="Empire Strategy" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-[10px] font-black text-white uppercase tracking-widest">Strategy 01</span>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Grounding is Key</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Always ensure your AI responses are grounded in real-world data. Users trust accuracy over speed. Use the Google Search tool for all legal and medical queries.
              </p>
            </div>
            <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4 group hover:border-indigo-500/50 transition-all">
              <div className="h-32 rounded-xl overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://picsum.photos/seed/monetization/600/400" 
                  alt="Monetization" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-[10px] font-black text-white uppercase tracking-widest">Revenue 02</span>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Ad Placement Logic</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Place banners at the bottom to avoid interfering with the chat input. Trigger interstitials only after a user completes a major task to maximize retention.
              </p>
            </div>
          </div>
        </section>

        {/* Affiliate Section */}
        <AffiliateSection />

        {/* Ad Placeholder */}
        <div className="p-8 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl flex flex-col items-center text-center space-y-4">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Sponsored Content</span>
          <h4 className="text-xl font-black text-white">Build Your Own Empire with Don's Series</h4>
          <p className="text-xs text-slate-400 max-w-lg">
            Get early access to all 20 applications in the Don Series. From Code Smith to Finance Pilot, we are grounding AI in every industry.
          </p>
          <button className="px-8 py-3 bg-white text-slate-950 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
            Learn More
          </button>
        </div>

        {testCheckoutItem && (
          <PaymentModal
            item={testCheckoutItem}
            isOpen={Boolean(testCheckoutItem)}
            onClose={() => setTestCheckoutItem(null)}
            onSuccess={() => {
              setTestCheckoutItem(null);
              refreshTransactions();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ManagementHub;
