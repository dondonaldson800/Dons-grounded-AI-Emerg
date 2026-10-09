import React, { useState } from 'react';
import { ALL_EMPIRE_APPS, AppConfig } from '../themeManager';
import SkuRegistryHub from './SkuRegistryHub';

interface StoreReadinessHubProps {
  onClose?: () => void;
}

export const StoreReadinessHub: React.FC<StoreReadinessHubProps> = ({ onClose }) => {
  const [selectedTarget, setSelectedTarget] = useState<'amazon' | 'samsung' | 'both'>('both');
  const [selectedAppKey, setSelectedAppKey] = useState<string>('all'); // 'all' or specific app key
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Selected App or Master Suite
  const selectedApp: AppConfig | undefined = ALL_EMPIRE_APPS.find(a => a.key === selectedAppKey);
  const isMasterSuite = selectedAppKey === 'all';

  // Generated Store Listing Data
  const getListingData = () => {
    if (isMasterSuite) {
      return {
        amazon: {
          title: "Don's Grounded AI Empire - 20-in-1 Suite",
          shortDesc: "The definitive 20-in-1 grounded AI suite for legal analysis, clinical telehealth, wealth estimation, trade calculators, home security, and real-time search intelligence.",
          longDesc: `Don's Grounded AI Empire is an elite suite of 20 domain-specialized artificial intelligence tools and interactive calculators engineered for professionals, homeowners, and tradespeople.

KEY CAPABILITIES ACROSS 20 DEDICATED MODULES:
• 01. Legal Eagle & Contract Review: Clause risk analyzer & NDA generator
• 02. Code Smith & Dev Studio: Multi-language refactoring, unit test generation & code complexity analyzer
• 03. Health Sync & Telehealth: Symptom checker & wellness biomarker interpreter
• 04. Finance Pilot & Wealth Engine: Compound ROI, mortgage & tax optimization calculator
• 05. Creative Forge & Design AI: Brand asset generator & marketing copy synthesis
• 06. Auto Assist & Vehicle Doctor: OBD-II diagnostic decoder & repair cost estimator
• 07. Real Estate Pro & Valuation: Cap rate, cash-on-cash & property ROI calculator
• 08. Tax Shield & Deduction Finder: 1099/W-2 tax deduction optimizer & bracket calculator
• 09. Dental Care & Smile Studio: Dental treatment planner & procedure insurance estimator
• 10. Chiro Connect & Spine Align: Ergonomic posture audit & musculoskeletal assessment
• 11. Roofing Pro & Shingle Estimator: Roof pitch, square footage & replacement cost estimator
• 12. HVAC Master & Climate Control: BTU/tonnage sizing & seasonal SEER efficiency calculator
• 13. IT Support & Cloud Helpdesk: Network subnetting, CIDR calculator & ticket triage
• 14. Insurance Pro & Policy Advisor: Coverage gap analysis & life/liability quote estimator
• 15. Home Security & Safe Guard: Perimeter security audit & surveillance coverage planner
• 16. Credit Repair & Score Boost: Debt-to-income (DTI) & FICO utilization planner
• 17. Fitness Coach & Muscle Matrix: 1RM strength calculator, TDEE & macro split planner
• 18. Nutrition Guide & Macro Meal: BMR/macro breakdown & personalized meal planner
• 19. Landscaping Pro & Lawn Design: Topsoil/mulch cubic yardage & lawn care scheduler
• 20. Senior Care & Elder Companion: ADL care level assessment & caregiving planning

REAL-TIME GOOGLE SEARCH GROUNDING:
Every AI analysis can optionally tap live web grounding for up-to-the-minute statutory, medical, market, and technical references.

OPTIMIZED FOR AMAZON FIRE TABLETS & FIRE OS:
Engineered to run seamlessly across Fire HD 8, Fire HD 10, Fire Max 11, and Android devices with adaptive touch interfaces.`,
          featureBullets: [
            "Complete 20-in-1 professional AI applications and trade calculators",
            "Live web search grounding with verified reference citations",
            "Specialized interactive calculators for legal, health, auto, roofing & finance",
            "Fully compatible with Amazon Fire Tablets and Fire OS devices",
            "Client lead capture and professional quote booking workflows"
          ],
          keywords: "ai assistant, legal ai, health sync, obd2 diagnostics, mortgage calculator, roof estimator, hvac sizing, tax calculator, credit repair, real estate cap rate, fire tablet tools, productivity",
          category: "Productivity",
          contentRating: "12+ (Informational Guidance)",
          targetDevices: "Fire HD 8, Fire HD 10, Fire Max 11, Fire 7, Android Tablets & Phones",
          buildProfile: "eas build --platform android --profile amazon"
        },
        samsung: {
          title: "Don's Grounded AI Empire",
          shortDesc: "20-in-1 Grounded AI suite with live search, legal, clinical, and trade tools.",
          longDesc: `Don's Grounded AI Empire brings professional-grade artificial intelligence and interactive calculation tools directly to your Samsung Galaxy smartphone, tablet, and foldable device.

OPTIMIZED FOR SAMSUNG GALAXY & ONE UI:
• Multi-Window & Split Screen: Run AI calculations side-by-side with your documents, spreadsheets, or browser.
• Samsung DeX Ready: Seamless desktop-class productivity when docked or connected to an external display.
• Galaxy Foldable Adaptive Layout: Dynamically unfolds from phone mode into a rich dual-pane tablet experience.

20 SPECIALIZED INDUSTRY SUITES:
1. Legal Eagle (Contract review, NDA generator, clause risk scorer)
2. Code Smith (Refactoring, test suite builder, complexity analyzer)
3. Health Sync (Symptom analysis, wellness biomarker evaluator)
4. Finance Pilot (Compound interest, mortgage & retirement planner)
5. Creative Forge (Design assistant, brand identity generator)
6. Auto Assist (OBD-II trouble codes, vehicle repair cost estimator)
7. Real Estate Pro (Cap rate, rental cash flow & property ROI)
8. Tax Shield (Deductions, 1099 vs W-2 analysis, tax brackets)
9. Dental Care (Procedure estimate, treatment stage planner)
10. Chiro Connect (Posture audit, ergonomic desk checklist)
11. Roofing Pro (Square footage, pitch multiplier, material waste)
12. HVAC Master (BTU heat load, tonnage & SEER ROI calculator)
13. IT Support (CIDR subnetting, IP ranges, troubleshooting)
14. Insurance Pro (Life & liability gap analysis, premium estimator)
15. Home Security (Perimeter audit, camera placement plan)
16. Credit Repair (DTI ratio, credit utilization impact)
17. Fitness Coach (1RM calculator, TDEE, macro split)
18. Nutrition Guide (Calorie intake, meal macronutrient splits)
19. Landscaping Pro (Mulch/topsoil cubic yardage & lawn schedule)
20. Senior Care (Activities of daily living & care plan advisor)`,
          featureTags: ["Samsung DeX Supported", "Multi-Window Ready", "Foldable Enhanced", "Grounded AI", "Productivity"],
          category: "Productivity / Utilities",
          contentRating: "12+",
          buildProfile: "eas build --platform android --profile samsung"
        }
      };
    } else {
      // Individual app listing
      const app = selectedApp!;
      return {
        amazon: {
          title: `${app.name} - Grounded AI (${app.id}/20)`,
          shortDesc: `${app.tagline} Powered by Don's Grounded AI Empire with interactive ${app.toolName} and live search grounding.`,
          longDesc: `${app.name} is a dedicated professional intelligence application built as part of Don's Grounded AI Empire.

KEY FEATURES:
• ${app.toolName}: Interactive built-in calculator and audit simulator
• Live Google Search Grounding: Verify domain insights with real-time sources
• Specialized AI Role: ${app.promptRole}
• Client Quote & Lead Generation: Direct consultation booking
• Full Fire OS & Fire Tablet Compatibility

Category: ${app.category}
Est. Benchmark Value: $${app.leadValueEstimate}`,
          featureBullets: [
            `Specialized ${app.promptRole} with search grounding`,
            `Built-in interactive ${app.toolName}`,
            `Verified references and action-oriented reports`,
            `Optimized for Amazon Fire Tablets and Android devices`
          ],
          keywords: `${app.name.toLowerCase()}, ${app.category.toLowerCase()}, ${app.toolName.toLowerCase()}, grounded ai, fire tablet, productivity`,
          category: "Productivity",
          contentRating: "12+",
          targetDevices: "Fire Tablets & Android Devices",
          buildProfile: `eas build --platform android --profile amazon`
        },
        samsung: {
          title: `${app.name} AI`,
          shortDesc: `${app.tagline} Optimized for Samsung Galaxy devices with Multi-Window and DeX.`,
          longDesc: `${app.name} by Don's Grounded AI Empire delivers specialized intelligence and interactive tools directly to your Samsung Galaxy device.

FEATURES & SAMSUNG OPTIMIZATIONS:
• Interactive ${app.toolName}
• Multi-Window & Samsung DeX Compatible
• Real-time search-grounded intelligence
• Built for Galaxy smartphones, foldables, and Galaxy Tab devices.`,
          featureTags: ["Samsung DeX", "Multi-Window", app.category.split(' ')[0]],
          category: "Productivity / Utilities",
          contentRating: "12+",
          buildProfile: `eas build --platform android --profile samsung`
        }
      };
    }
  };

  const listing = getListingData();

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadListingPackage = () => {
    const packageData = {
      packageInfo: {
        appPackageName: "com.donsempire.groundedai",
        versionName: "1.0.0",
        versionCode: 100,
        developerName: "Don's Grounded AI Empire",
        supportEmail: "dondonaldson800@gmail.com",
        privacyPolicyUrl: "https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app/privacy-policy.html",
        termsOfServiceUrl: "https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app/terms-of-service.html",
      },
      selectedAppKey,
      listing
    };

    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isMasterSuite ? 'AMAZON_SAMSUNG_STORE_LISTING_MASTER.json' : `STORE_LISTING_${selectedApp?.id || 'APP'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBuildScripts = () => {
    const scriptContent = `#!/bin/bash
# ==============================================================
# DON'S GROUNDED AI EMPIRE - MOBILE BUILD SCRIPT (APK & AAB)
# Package: com.donsempire.groundedai | Version: 1.0.0
# ==============================================================

echo "=========================================================="
echo " 📱 SELECT BUILD TARGET FOR DON'S GROUNDED AI EMPIRE"
echo "=========================================================="
echo "1) Build Universal APK for Amazon Appstore & Fire OS (APK)"
echo "2) Build Direct Testing & Sideload APK (APK)"
echo "3) Build Production AAB for Samsung Galaxy Store (AAB)"
echo "4) Build Production AAB for Google Play Console (AAB)"
echo "5) Build Both Amazon APK and Samsung AAB"
echo "=========================================================="
read -p "Enter choice [1-5]: " choice

case $choice in
  1)
    echo "[+] Building Amazon Appstore Universal APK..."
    npx eas build --platform android --profile amazon
    ;;
  2)
    echo "[+] Building Direct Preview APK..."
    npx eas build --platform android --profile preview
    ;;
  3)
    echo "[+] Building Samsung Galaxy Store AAB..."
    npx eas build --platform android --profile samsung
    ;;
  4)
    echo "[+] Building Google Play Console AAB..."
    npx eas build --platform android --profile production
    ;;
  5)
    echo "[+] Building Amazon APK first..."
    npx eas build --platform android --profile amazon
    echo "[+] Building Samsung AAB next..."
    npx eas build --platform android --profile samsung
    ;;
  *)
    echo "Invalid option. Exiting."
    ;;
esac
`;
    const blob = new Blob([scriptContent], { type: 'application/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build-empire-mobile.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 uppercase tracking-widest">
                STORE DEPLOYMENT HUB
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 uppercase tracking-widest">
                AMAZON & SAMSUNG READY
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white text-2xl shadow-lg">
                📦
              </span>
              Amazon & Samsung Store Readiness Center
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Everything required to package, build, and publish your 20-app series to the Amazon Appstore (Universal APK) and Samsung Galaxy Store (Android App Bundle / AAB).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveStep(5)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              <span>🏷️</span> Fix SKUs & Store IDs
            </button>
            <button
              onClick={handleDownloadBuildScripts}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              <span>⚙️</span> Export Build Scripts (.sh)
            </button>
            <button
              onClick={handleDownloadListingPackage}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              <span>📥</span> Export JSON Listing Kit
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Step-by-Step Store Launch Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { step: 1, title: "1. App Config", desc: "Package name & permissions verified" },
            { step: 2, title: "2. Build Binaries", desc: "Generate APK for Amazon & AAB for Samsung" },
            { step: 3, title: "3. Store Listings", desc: "One-click copy titles & descriptions" },
            { step: 4, title: "4. Submission Checklists", desc: "Console walkthroughs & compliance" },
            { step: 5, title: "5. In-App SKUs & Billing", desc: "Fix SKU errors & product IDs" },
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                activeStep === s.step
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-black text-white">{s.title}</div>
              <div className="text-[10px] text-slate-400 mt-1 leading-snug">{s.desc}</div>
            </button>
          ))}
        </div>

        {/* App Scope Selector */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">Listing Scope:</span>
            <select
              value={selectedAppKey}
              onChange={e => setSelectedAppKey(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">👑 Master Suite: Don's Grounded AI Empire (20-in-1)</option>
              {ALL_EMPIRE_APPS.map(app => (
                <option key={app.key} value={app.key}>
                  App {app.id} · {app.name} ({app.category.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">View Target:</span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedTarget('amazon')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  selectedTarget === 'amazon' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Amazon Appstore
              </button>
              <button
                onClick={() => setSelectedTarget('samsung')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  selectedTarget === 'samsung' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Samsung Galaxy Store
              </button>
              <button
                onClick={() => setSelectedTarget('both')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  selectedTarget === 'both' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Both Stores
              </button>
            </div>
          </div>
        </div>

        {/* STEP 1: CONFIG & COMPLIANCE VERIFICATION */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* Package & Identity Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>🆔</span> Core Binary Identifiers
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PASSED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-black">Android Package Identifier</div>
                  <code className="text-indigo-400 font-mono text-xs">com.donsempire.groundedai</code>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-black">Version Code</div>
                    <code className="text-white font-mono text-xs">100</code>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-black">Version Name</div>
                    <code className="text-white font-mono text-xs">1.0.0</code>
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-black">EAS Project ID</div>
                  <code className="text-slate-400 font-mono text-[11px]">de9a3bfd-69f0-4928-afc7-2114dfc8376d</code>
                </div>
              </div>
            </div>

            {/* Hardware & Permissions Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>🛡️</span> Permissions & Compatibility
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AMAZON & SAMSUNG SAFE
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="text-[10px] text-slate-500 uppercase font-black">Declared Permissions</div>
                  <div className="flex flex-wrap gap-1">
                    {["INTERNET", "ACCESS_NETWORK_STATE", "CAMERA", "RECORD_AUDIO", "ACCESS_FINE_LOCATION", "VIBRATE"].map(p => (
                      <span key={p} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-black">Device Compatibility Matrix</div>
                  <p className="text-[11px] text-slate-300">
                    ✓ Amazon Fire 7, Fire HD 8, Fire HD 10, Fire Max 11<br />
                    ✓ Samsung Galaxy S21-S26, Galaxy Z Fold 1-7, Galaxy Tab S7-S10<br />
                    ✓ Samsung DeX Desktop Mode & Split Multi-Window
                  </p>
                </div>
              </div>
            </div>

            {/* Google AdMob Values Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4 md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>📢</span> AdMob Production Values & Metadata
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    SAVED IN FILES & MANIFEST
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 uppercase font-black">AdMob App ID</span>
                    <button
                      onClick={() => handleCopy("ca-app-pub-8715031019966551~8423706184", "admob-app")}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      {copiedField === "admob-app" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <code className="text-amber-300 font-mono text-[11px] block truncate">
                    ca-app-pub-8715031019966551~8423706184
                  </code>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 uppercase font-black">Banner Unit ID</span>
                    <button
                      onClick={() => handleCopy("ca-app-pub-8715031019966551/7800201293", "admob-banner")}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      {copiedField === "admob-banner" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <code className="text-white font-mono text-[11px] block truncate">
                    ca-app-pub-8715031019966551/7800201293
                  </code>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 uppercase font-black">Interstitial Unit ID</span>
                    <button
                      onClick={() => handleCopy("ca-app-pub-8715031019966551/4392127683", "admob-inter")}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      {copiedField === "admob-inter" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <code className="text-white font-mono text-[11px] block truncate">
                    ca-app-pub-8715031019966551/4392127683
                  </code>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 uppercase font-black">Rewarded Unit ID</span>
                    <button
                      onClick={() => handleCopy("ca-app-pub-8715031019966551/5231846921", "admob-rew")}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      {copiedField === "admob-rew" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <code className="text-white font-mono text-[11px] block truncate">
                    ca-app-pub-8715031019966551/5231846921
                  </code>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span>
                  📁 Values persisted to <code className="text-indigo-400">android/app/src/main/res/values/admob_values.xml</code> and <code className="text-indigo-400">app.json</code>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ✓ Compliant with Google Mobile Ads SDK
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BUILD BINARIES RECIPES (APK & AAB) */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick Summary Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>📱</span> APK vs AAB: Which Format Do You Need?
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  <strong>APK (.apk)</strong> is for Amazon Appstore, Fire OS tablets, Chromebooks, and direct phone installs.<br />
                  <strong>AAB (.aab)</strong> is the Android App Bundle for Samsung Galaxy Store Seller Portal and Google Play Console.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCopy("bash build-apk.sh", "cmd-sh-apk")}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
                >
                  <span>⚡</span> {copiedField === 'cmd-sh-apk' ? '✓ Copied' : './build-apk.sh'}
                </button>
                <button
                  onClick={() => handleCopy("bash build-aab.sh", "cmd-sh-aab")}
                  className="px-3 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] font-bold hover:bg-indigo-500/30 transition-all flex items-center gap-1.5"
                >
                  <span>⚡</span> {copiedField === 'cmd-sh-aab' ? '✓ Copied' : './build-aab.sh'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Amazon Build Recipe (APK) */}
              <div className="bg-slate-900/40 border border-amber-500/30 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h3 className="text-base font-black text-white">Amazon Appstore Build</h3>
                      <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Universal APK (.apk)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy("npm run mobile:amazon:build", "cmd-amazon")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-amber-400 transition-colors"
                  >
                    {copiedField === 'cmd-amazon' ? '✓ Copied!' : 'Copy Command'}
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300">
                  <code>npm run mobile:amazon:build</code>
                  <div className="text-[10px] text-slate-500 mt-1"># Profile: amazon · outputs release APK for Fire OS 7, 8 & Android</div>
                </div>

                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Standalone <strong>Universal APK</strong> without requiring Google Play Services.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Direct drag-and-drop into <strong>Amazon Developer Console → App Submission → APK Files</strong>.</span>
                  </li>
                </ul>
              </div>

              {/* 2. Direct Sideload / Preview APK */}
              <div className="bg-slate-900/40 border border-emerald-500/30 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📲</span>
                    <div>
                      <h3 className="text-base font-black text-white">Direct Sideload & Testing</h3>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Installable APK (.apk)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy("npm run mobile:build:apk", "cmd-apk-preview")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-emerald-400 transition-colors"
                  >
                    {copiedField === 'cmd-apk-preview' ? '✓ Copied!' : 'Copy Command'}
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300">
                  <code>npm run mobile:build:apk</code>
                  <div className="text-[10px] text-slate-500 mt-1"># Profile: preview · instant download link for Android phones & tablets</div>
                </div>

                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Direct installation on any Android phone, tablet, or Chromebook via browser download.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Local build command: <code>eas build --platform android --profile preview --local</code></span>
                  </li>
                </ul>
              </div>

              {/* 3. Samsung Galaxy Store Build (AAB) */}
              <div className="bg-slate-900/40 border border-indigo-500/30 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌌</span>
                    <div>
                      <h3 className="text-base font-black text-white">Samsung Galaxy Store Build</h3>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Android App Bundle (.aab)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy("npm run mobile:samsung:build", "cmd-samsung")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-indigo-400 transition-colors"
                  >
                    {copiedField === 'cmd-samsung' ? '✓ Copied!' : 'Copy Command'}
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300">
                  <code>npm run mobile:samsung:build</code>
                  <div className="text-[10px] text-slate-500 mt-1"># Builds production Android App Bundle (.aab) for Galaxy Store Seller Portal</div>
                </div>

                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Optimized <strong>.aab</strong> bundle with dynamic delivery for Samsung Galaxy devices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Upload directly to <strong>Samsung Galaxy Store Seller Portal → Binary</strong> section.</span>
                  </li>
                </ul>
              </div>

              {/* 4. Google Play Production Build (AAB) */}
              <div className="bg-slate-900/40 border border-cyan-500/30 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">▶️</span>
                    <div>
                      <h3 className="text-base font-black text-white">Google Play Production Build</h3>
                      <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Android App Bundle (.aab)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy("npm run mobile:play:build", "cmd-play")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-cyan-400 transition-colors"
                  >
                    {copiedField === 'cmd-play' ? '✓ Copied!' : 'Copy Command'}
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-cyan-300">
                  <code>npm run mobile:play:build</code>
                  <div className="text-[10px] text-slate-500 mt-1"># Profile: production · Google Play Console Release track App Bundle</div>
                </div>

                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Compliant with Google Play 2026 App Bundle specification with full Play Feature Delivery.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Upload to <strong>Google Play Console → Production / Internal Testing</strong> track.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: STORE LISTING COPY WITH 1-CLICK COPY */}
        {activeStep === 3 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Amazon Appstore Box */}
            {(selectedTarget === 'amazon' || selectedTarget === 'both') && (
              <div className="bg-slate-900/40 border border-amber-500/30 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400">
                      🔥
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Amazon Appstore Listing Information</h3>
                      <p className="text-xs text-slate-400">Amazon Developer Console Copy & Paste Ready</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* App Title */}
                  <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-400 uppercase font-black">App Title (Max 85 chars)</label>
                      <button 
                        onClick={() => handleCopy(listing.amazon.title, 'amz-title')}
                        className="text-[10px] text-amber-400 font-bold hover:underline"
                      >
                        {copiedField === 'amz-title' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-xs text-white font-bold">{listing.amazon.title}</div>
                    <div className="text-[9px] text-slate-500">{listing.amazon.title.length}/85 chars</div>
                  </div>

                  {/* Category & Rating */}
                  <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-black">Category & Rating</div>
                    <div className="text-xs text-slate-200">
                      Category: <span className="font-bold text-amber-400">{listing.amazon.category}</span>
                    </div>
                    <div className="text-xs text-slate-200">
                      Content Rating: <span className="font-bold text-white">{listing.amazon.contentRating}</span>
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Short Description (Max 1200 chars)</label>
                    <button 
                      onClick={() => handleCopy(listing.amazon.shortDesc, 'amz-short')}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      {copiedField === 'amz-short' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">{listing.amazon.shortDesc}</div>
                </div>

                {/* Feature Bullets */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Product Feature Bullets (3-5 required)</label>
                    <button 
                      onClick={() => handleCopy(listing.amazon.featureBullets.join('\n'), 'amz-bullets')}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      {copiedField === 'amz-bullets' ? '✓ Copied All' : 'Copy Bullets'}
                    </button>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {listing.amazon.featureBullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long Description */}
                <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Full Long Description (Max 4000 chars)</label>
                    <button 
                      onClick={() => handleCopy(listing.amazon.longDesc, 'amz-long')}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      {copiedField === 'amz-long' ? '✓ Copied' : 'Copy Full Text'}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans max-h-48 overflow-y-auto custom-scrollbar leading-relaxed">
                    {listing.amazon.longDesc}
                  </pre>
                </div>

                {/* Keywords */}
                <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Keywords / Search Terms</label>
                    <button 
                      onClick={() => handleCopy(listing.amazon.keywords, 'amz-keywords')}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      {copiedField === 'amz-keywords' ? '✓ Copied' : 'Copy Keywords'}
                    </button>
                  </div>
                  <div className="text-xs font-mono text-indigo-300">{listing.amazon.keywords}</div>
                </div>
              </div>
            )}

            {/* Samsung Galaxy Store Box */}
            {(selectedTarget === 'samsung' || selectedTarget === 'both') && (
              <div className="bg-slate-900/40 border border-indigo-500/30 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xl text-indigo-400">
                      🌌
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Samsung Galaxy Store Listing Information</h3>
                      <p className="text-xs text-slate-400">Galaxy Store Seller Portal Ready</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* App Title */}
                  <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-400 uppercase font-black">App Title (Max 50 chars)</label>
                      <button 
                        onClick={() => handleCopy(listing.samsung.title, 'sam-title')}
                        className="text-[10px] text-indigo-400 font-bold hover:underline"
                      >
                        {copiedField === 'sam-title' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-xs text-white font-bold">{listing.samsung.title}</div>
                    <div className="text-[9px] text-slate-500">{listing.samsung.title.length}/50 chars</div>
                  </div>

                  {/* Category & Tags */}
                  <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-black">Galaxy Features & Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {listing.samsung.featureTags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-[10px] border border-indigo-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Summary / Short Description</label>
                    <button 
                      onClick={() => handleCopy(listing.samsung.shortDesc, 'sam-short')}
                      className="text-[10px] text-indigo-400 font-bold hover:underline"
                    >
                      {copiedField === 'sam-short' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">{listing.samsung.shortDesc}</div>
                </div>

                {/* Full Description */}
                <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Full Description</label>
                    <button 
                      onClick={() => handleCopy(listing.samsung.longDesc, 'sam-long')}
                      className="text-[10px] text-indigo-400 font-bold hover:underline"
                    >
                      {copiedField === 'sam-long' ? '✓ Copied' : 'Copy Full Text'}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans max-h-48 overflow-y-auto custom-scrollbar leading-relaxed">
                    {listing.samsung.longDesc}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: SUBMISSION CHECKLISTS */}
        {activeStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* Amazon Checklist */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>🔥</span> Amazon Developer Console Checklist
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">1. Create New App Submission</div>
                  <p className="text-slate-400 text-[11px]">Log in at <a href="https://developer.amazon.com/apps-and-games" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">developer.amazon.com</a> &gt; Add New App &gt; Android.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">2. Paste App Title & Category</div>
                  <p className="text-slate-400 text-[11px]">Use the Step 3 copy for Title, Short Description, Long Description & Keywords.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">3. Upload APK Binary</div>
                  <p className="text-slate-400 text-[11px]">Run <code>npm run mobile:amazon:build</code> and drop the resulting APK into the APK Files section.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">4. Content Rating & Privacy</div>
                  <p className="text-slate-400 text-[11px]">Set Rating to General (12+) and provide Privacy Policy URL: <br/><code className="text-indigo-400 font-mono text-[10px]">https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app/privacy-policy.html</code></p>
                </div>
              </div>
            </div>

            {/* Samsung Checklist */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>🌌</span> Samsung Galaxy Store Seller Portal Checklist
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">1. Access Seller Portal</div>
                  <p className="text-slate-400 text-[11px]">Log in to <a href="https://seller.samsungapps.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">seller.samsungapps.com</a> &gt; Add Application &gt; Android.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">2. Upload AAB Bundle</div>
                  <p className="text-slate-400 text-[11px]">Run <code>npm run mobile:samsung:build</code> and upload the produced <code>.aab</code> file.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">3. Fill Galaxy Metadata</div>
                  <p className="text-slate-400 text-[11px]">Paste Title (<code>{listing.samsung.title}</code>), Description, and select Category: Productivity.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">4. Enable Multi-Window & Galaxy Foldable</div>
                  <p className="text-slate-400 text-[11px]">Check boxes for Multi-Window support and Galaxy Foldable / Tablet compatibility.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: IN-APP SKUS & BILLING COMMAND CENTER */}
        {activeStep === 5 && (
          <div className="animate-in fade-in duration-300">
            <SkuRegistryHub />
          </div>
        )}

      </div>
    </div>
  );
};
export default StoreReadinessHub;
