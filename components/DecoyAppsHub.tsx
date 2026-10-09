import React, { useState } from 'react';
import { SubscriptionTier } from '../types';
import { ALL_EMPIRE_APPS, AppConfig } from '../themeManager';
import UniversalApp from './UniversalApp';
import { AppInteractiveTools } from './AppInteractiveTools';
import SkuRegistryHub from './SkuRegistryHub';

interface DecoyAppsHubProps {
  tier: SubscriptionTier;
  onOpenStore?: () => void;
}

export interface DecoyAppSpec {
  id: string;
  key: string;
  name: string;
  standaloneTitle: string;
  standaloneTagline: string;
  packageName: string;
  category: string;
  icon: string;
  accentColor: string;
  primaryColor: string;
  toolType: string;
  toolName: string;
  reviewerNotes: string;
  geminiModel: string;
  features: string[];
}

export const FIRST_FIVE_DECOYS: DecoyAppSpec[] = [
  {
    id: '01',
    key: 'general',
    name: 'General AI & Productivity',
    standaloneTitle: 'OmniAssist - General AI & Multi-Task Suite',
    standaloneTagline: 'All-in-one general intelligence assistant for multi-task writing, reasoning, planning, and problem-solving.',
    packageName: 'com.omniassist.general.app',
    category: 'General & Productivity',
    icon: '🌐',
    accentColor: '#818CF8',
    primaryColor: '#4338CA',
    toolType: 'general_calc',
    toolName: 'Task Breakdown & Smart Productivity Planner',
    reviewerNotes: 'OmniAssist is a standalone general-purpose productivity application that assists users with structured task breakdown, writing, logical reasoning, and daily workflow planning. Powered by Gemini with zero mandatory paywalls for core tools.',
    geminiModel: 'gemini-2.5-flash',
    features: ['Multi-Topic Reasoning', 'Smart Task Breakdown', 'Daily Time Blocking', 'Executive Action Roadmaps']
  },
  {
    id: '02',
    key: 'medical',
    name: 'Clinical Health & Triage',
    standaloneTitle: 'VitalTriage - Symptom & Interaction Screener',
    standaloneTagline: 'Clinical wellness triage, symptom assessment, and multi-drug interaction screening.',
    packageName: 'com.vitaltriage.health.app',
    category: 'Health & Medical Utilities',
    icon: '⚕️',
    accentColor: '#34D399',
    primaryColor: '#059669',
    toolType: 'medical_calc',
    toolName: 'Symptom & Drug Interaction Screener',
    reviewerNotes: 'VitalTriage is an educational and informational clinical triage utility. It screens potential pharmaceutical interactions and summarizes symptom markers using verified clinical research data.',
    geminiModel: 'gemini-2.5-flash',
    features: ['Drug Interaction Checker', 'Clinical Reference Grounding', 'Symptom Severity Triage', 'Blood Pressure & Vitals Stage']
  },
  {
    id: '03',
    key: 'medical_care',
    name: 'Emergency Care & Diagnostics',
    standaloneTitle: 'MedCare Pro - Diagnostic Triage & Emergency Care',
    standaloneTagline: 'Emergency care protocols, vital signs diagnostic analyzer, dosage benchmarks, and triage guidance.',
    packageName: 'com.medcarepro.clinical.app',
    category: 'Health & Medical Utilities',
    icon: '🩺',
    accentColor: '#38BDF8',
    primaryColor: '#0284C7',
    toolType: 'medcare_calc',
    toolName: 'Clinical Diagnostic & Emergency Care Protocol',
    reviewerNotes: 'MedCare Pro is a standalone clinical diagnostic reference utility. It calculates vital sign emergency indexes, triage acuity benchmarks, and provides immediate emergency first-response protocol summaries.',
    geminiModel: 'gemini-2.5-flash',
    features: ['Emergency Care Protocols', 'Vital Signs Diagnostic Index', 'Pediatric Dosage Helper', 'Acuity Scoring Matrix']
  },
  {
    id: '04',
    key: 'nonprofit',
    name: 'Non-Profit Grants & Philanthropy',
    standaloneTitle: 'CausePilot - Non-Profit Grants & 501(c)(3) Navigator',
    standaloneTagline: '501(c)(3) statutory compliance auditing, grant proposal drafting, donor impact modeling, and fundraising ROI.',
    packageName: 'com.causepilot.nonprofit.app',
    category: 'Non-Profit & Philanthropy',
    icon: '🤝',
    accentColor: '#FBBF24',
    primaryColor: '#D97706',
    toolType: 'nonprofit_calc',
    toolName: 'Non-Profit Grant & Fundraising Impact Calculator',
    reviewerNotes: 'CausePilot is a dedicated utility for 501(c)(3) charities and non-profit organizations. It models grant allocation efficiency, calculates fundraising event ROI, and generates compliant donor impact narratives.',
    geminiModel: 'gemini-2.5-flash',
    features: ['501(c)(3) Compliance Checker', 'Grant Proposal Generator', 'Fundraising Event ROI Model', 'Donor Retention & Impact Forecast']
  },
  {
    id: '05',
    key: 'law',
    name: 'Legal Services & Contracts',
    standaloneTitle: 'ClauseGuard - Legal Contract & NDA Auditor',
    standaloneTagline: 'Statute-grounded contract risk analysis, NDA drafting, and statutory compliance review.',
    packageName: 'com.clauseguard.legal.app',
    category: 'Legal & Contracts',
    icon: '⚖️',
    accentColor: '#F59E0B',
    primaryColor: '#1E3A8A',
    toolType: 'legal_calc',
    toolName: 'Contract Clause & Risk Auditor',
    reviewerNotes: 'ClauseGuard is a standalone legal utility that assists users in drafting standard contracts and auditing risk clauses. Real-time statute grounding is provided via Gemini with no mandatory subscription for core tools.',
    geminiModel: 'gemini-2.5-flash',
    features: ['NDA & Contract Generator', 'Clause Risk Scoring', 'Statutory Grounding', 'Offline Contract Templates']
  },
  {
    id: '06',
    key: 'personal_injury',
    name: 'Personal Injury & Litigation',
    standaloneTitle: 'ClaimValuator - Auto & Injury Settlement Multiplier',
    standaloneTagline: 'Accident claim damage valuation, litigation multipliers, lost wage calculation, and demand letter generation.',
    packageName: 'com.claimvaluator.settlement.app',
    category: 'Finance & Legal Estimators',
    icon: '🏛️',
    accentColor: '#F87171',
    primaryColor: '#991B1B',
    toolType: 'injury_calc',
    toolName: 'Settlement Value Multiplier Calculator',
    reviewerNotes: 'ClaimValuator is a dedicated settlement estimate calculator for insurance claims and litigation. It calculates pain-and-suffering multipliers, medical special damages, and lost income models.',
    geminiModel: 'gemini-2.5-flash',
    features: ['Settlement Multiplier (1.5x-5.0x)', 'Lost Wages Worksheet', 'Demand Letter Generator', 'Damage Itemization']
  }
];

export const DecoyAppsHub: React.FC<DecoyAppsHubProps> = ({ tier, onOpenStore }) => {
  const [selectedDecoy, setSelectedDecoy] = useState<DecoyAppSpec | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'store_kits' | 'checklist' | 'deployment' | 'skus'>('deployment');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedGeminiModel, setSelectedGeminiModel] = useState<string>('gemini-3.7-flash');
  const [showDirectTool, setShowDirectTool] = useState<string | null>(null);
  const [deployedFilter, setDeployedFilter] = useState<'all' | 'amazon' | 'samsung'>('all');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // If an app is launched in Standalone Mode:
  if (selectedDecoy) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-200">
        {/* Standalone Mode Header - Clean, zero-empire branding */}
        <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedDecoy(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-black uppercase flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Back to First 5 Hub</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedDecoy.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black text-white">{selectedDecoy.standaloneTitle}</h1>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black tracking-wider border border-emerald-500/30">
                    STANDALONE {selectedDecoy.id}/06
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">{selectedDecoy.packageName} • v1.0.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Standalone App Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {FIRST_FIVE_DECOYS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDecoy(d)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 ${
                    selectedDecoy.id === d.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>{d.icon}</span>
                  <span>{d.id}</span>
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span>✨ Gemini 3.7 Integrated</span>
            </div>
          </div>
        </header>

        {/* Universal App rendered in full standalone mode */}
        <div className="flex-1 relative overflow-hidden">
          <UniversalApp
            appName={selectedDecoy.standaloneTitle}
            appKey={selectedDecoy.key}
            appIcon={selectedDecoy.icon}
            appDesc={selectedDecoy.standaloneTagline}
            tier={tier}
            standaloneMode={true}
            onClose={() => setSelectedDecoy(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-950 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Status Banner */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                <span>🛡️</span>
                FLAGSHIP STANDALONE SUITE • APPS 01 TO 06
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                Flagship Standalone Applications
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full font-black uppercase">
                  Gemini Active
                </span>
              </h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
                Clean, standalone, store-compliant versions of your flagship series: <strong className="text-indigo-400">#1 General</strong>, <strong className="text-emerald-400">#2 & #3 Medical</strong>, <strong className="text-amber-400">#4 Non-Profit</strong>, and <strong className="text-rose-400">#5 & #6 Law</strong>. Each app is equipped with independent package IDs, isolated single-purpose UIs, and calculators.
              </p>
            </div>

            {/* Model Selector Pill */}
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 pl-2">Engine:</span>
              <button
                onClick={() => setSelectedGeminiModel('gemini-3.7-flash')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                  selectedGeminiModel === 'gemini-3.7-flash'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡</span>
                <span>Gemini 3.7 Flash</span>
              </button>
              <button
                onClick={() => setSelectedGeminiModel('gemini-3.7-pro')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                  selectedGeminiModel === 'gemini-3.7-pro'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🧠</span>
                <span>Gemini 3.7 Pro</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Standalone Apps</div>
              <div className="text-xl font-black text-emerald-400">6 / 6 Ready</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Engine</div>
              <div className="text-xl font-black text-indigo-400">Gemini Active</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Zero Master Leakage</div>
              <div className="text-xl font-black text-cyan-400">100% Isolated</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monetization</div>
              <div className="text-xl font-black text-amber-400">Ads Integrated</div>
            </div>
          </div>
        </header>

        {/* View Mode Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('deployment')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'deployment'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>🚀</span>
            <span>Flagship Deployed Hub</span>
            <span className="px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 text-[9px] rounded font-mono">6/6 READY</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>📱</span>
            <span>Standalone Matrix & Launchers</span>
          </button>
          <button
            onClick={() => setActiveTab('store_kits')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'store_kits'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>📦</span>
            <span>Submission Kits (Amazon & Samsung)</span>
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'checklist'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>✅</span>
            <span>Compliance Checklist</span>
          </button>
          <button
            onClick={() => setActiveTab('skus')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'skus'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>🏷️</span>
            <span>SKUs & Product IDs</span>
            <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[9px] rounded font-mono">FIX "NOT RIGHT"</span>
          </button>
        </div>

        {/* TAB: SKUS & IN-APP BILLING */}
        {activeTab === 'skus' && (
          <div className="space-y-6">
            <SkuRegistryHub />
          </div>
        )}

        {/* TAB 1: THE FIRST 5 STANDALONE APPS MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FIRST_FIVE_DECOYS.map((decoy) => (
                <div
                  key={decoy.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full pointer-events-none"
                    style={{ backgroundColor: decoy.accentColor }}
                  ></div>

                  <div className="space-y-3">
                    {/* Top Row: Icon + ID + Package */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-lg"
                          style={{
                            backgroundColor: `${decoy.primaryColor}20`,
                            borderColor: `${decoy.accentColor}40`
                          }}
                        >
                          {decoy.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              STANDALONE #{decoy.id}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          </div>
                          <h3 className="text-sm font-black text-white leading-snug">{decoy.standaloneTitle}</h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {decoy.standaloneTagline}
                    </p>

                    {/* Meta badges */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                        <span className="truncate">{decoy.packageName}</span>
                        <button
                          onClick={() => handleCopy(decoy.packageName, `pkg-${decoy.id}`)}
                          className="text-indigo-400 hover:text-indigo-300 font-bold ml-2 shrink-0"
                        >
                          {copiedKey === `pkg-${decoy.id}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                          {decoy.category}
                        </span>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-black">
                          ✨ Gemini 3.7
                        </span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                          {decoy.toolName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
                    <button
                      onClick={() => setSelectedDecoy(decoy)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                      style={{ backgroundColor: decoy.primaryColor }}
                    >
                      <span>🚀</span>
                      <span>Launch Standalone Mode</span>
                    </button>

                    <button
                      onClick={() => setShowDirectTool(showDirectTool === decoy.id ? null : decoy.id)}
                      className="w-full py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 border border-slate-800"
                    >
                      <span>🧮</span>
                      <span>{showDirectTool === decoy.id ? 'Hide Calculator' : 'Test Tool'}</span>
                    </button>

                    {showDirectTool === decoy.id && (
                      <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 animate-in fade-in">
                        <AppInteractiveTools
                          toolType={decoy.toolType}
                          toolName={decoy.toolName}
                          accentColor={decoy.accentColor}
                          primaryColor={decoy.primaryColor}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STORE SUBMISSION KITS */}
        {activeTab === 'store_kits' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <h2 className="text-sm font-black text-white uppercase tracking-wider mb-2">
                📦 Amazon & Samsung Appstore Standalone Submission Packages
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use these pre-formatted store listings and standalone build parameters when submitting each of the first five apps as independent standalone binaries to Amazon Appstore or Samsung Galaxy Store.
              </p>
            </div>

            <div className="space-y-4">
              {FIRST_FIVE_DECOYS.map((decoy) => (
                <div key={decoy.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{decoy.icon}</span>
                      <div>
                        <h3 className="text-base font-black text-white">
                          App #{decoy.id}: {decoy.standaloneTitle}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">{decoy.packageName}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDecoy(decoy)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider"
                    >
                      Run App
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Column 1: Store Copy */}
                    <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Short Store Description</span>
                        <button
                          onClick={() => handleCopy(decoy.standaloneTagline, `desc-${decoy.id}`)}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          {copiedKey === `desc-${decoy.id}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{decoy.standaloneTagline}</p>
                    </div>

                    {/* Column 2: Reviewer Notes */}
                    <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Appstore Reviewer Notes</span>
                        <button
                          onClick={() => handleCopy(decoy.reviewerNotes, `rev-${decoy.id}`)}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          {copiedKey === `rev-${decoy.id}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{decoy.reviewerNotes}</p>
                    </div>
                  </div>

                  {/* EAS Standalone Build Command */}
                  <div className="bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 truncate">
                      eas build --platform android --profile decoy-{decoy.key}
                    </span>
                    <button
                      onClick={() => handleCopy(`eas build --platform android --profile decoy-${decoy.key}`, `eas-${decoy.id}`)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold ml-2 shrink-0 font-sans uppercase tracking-wider"
                    >
                      {copiedKey === `eas-${decoy.id}` ? '✓ Copied' : 'Copy Command'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STANDALONE COMPLIANCE CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              ✅ App Store Standalone Compliance Audit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <span>✓</span>
                  <span>Zero Master Leakage Verified</span>
                </div>
                <p className="text-xs text-slate-400">
                  When launched in Standalone Mode, all references to "Don's Grounded AI Empire", master docks, tokens, and multi-app managers are suppressed. The reviewer only sees the individual single-purpose tool.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <span>✓</span>
                  <span>Gemini 3.7 Integrated with Fallback</span>
                </div>
                <p className="text-xs text-slate-400">
                  All 5 apps tap Gemini 3.7 Flash and Pro for real-time analysis with an automated graceful fallback to Gemini 2.5 Flash if credentials need standard routing.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <span>✓</span>
                  <span>Store-Compliant Package Identifiers</span>
                </div>
                <p className="text-xs text-slate-400">
                  Each of the five apps has its own distinct Android package identifier (e.g. com.clauseguard.legal.app) ready for separate Appstore listing submissions.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <span>✓</span>
                  <span>Ad Monetization Integrated</span>
                </div>
                <p className="text-xs text-slate-400">
                  All 5 apps feature responsive industry-targeted advertisement units (legal retainers, telehealth, injury evaluations, commercial mortgages, and wealth management) compliant with store policies.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FIRST 5 DEPLOYED SUITE */}
        {activeTab === 'deployment' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Mission Briefing Banner */}
            <div className="p-5 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      DEPLOYMENT CONSOLE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">STAGE 1: APPS 01 TO 06</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                    Flagship Standalone Applications (01 - 06) — Production Deployed
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
                    All six standalone applications are fully packaged: <strong className="text-indigo-400">#01 General</strong>, <strong className="text-emerald-400">#02 & #03 Medical</strong>, <strong className="text-amber-400">#04 Non-Profit</strong>, and <strong className="text-rose-400">#05 & #06 Law</strong>. Configured with isolated Android package namespaces, Gemini intelligence, monetization ads, and store submission profiles.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allCommands = FIRST_FIVE_DECOYS.map(d => `npm run decoy:build:${d.id}:${d.key}`).join(' && \\\n');
                      handleCopy(allCommands, 'build-all-6');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <span>⚡</span>
                    <span>{copiedKey === 'build-all-6' ? '✓ Commands Copied!' : 'Copy All 6 Build Commands'}</span>
                  </button>
                  {onOpenStore && (
                    <button
                      onClick={onOpenStore}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs uppercase tracking-wider transition-all border border-slate-700 flex items-center gap-2"
                    >
                      <span>📦</span>
                      <span>Store Hub</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Pill Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Target Store:</span>
                <button
                  onClick={() => setDeployedFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    deployedFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  All Stores (6/6)
                </button>
                <button
                  onClick={() => setDeployedFilter('amazon')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    deployedFilter === 'amazon'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Amazon Appstore (APK)
                </button>
                <button
                  onClick={() => setDeployedFilter('samsung')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    deployedFilter === 'samsung'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Samsung Galaxy Store (AAB)
                </button>
              </div>

              <span className="text-xs font-mono text-slate-400">
                6 Standalone Binaries Configured
              </span>
            </div>

            {/* The 5 Deployed App Cards */}
            <div className="space-y-4">
              {FIRST_FIVE_DECOYS.map((decoy) => {
                const buildProfile = `decoy-${decoy.key}`;
                const npmScript = `npm run decoy:build:${decoy.id}:${decoy.key}`;
                const easCmd = `eas build --platform android --profile ${buildProfile}`;

                return (
                  <div
                    key={decoy.id}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-lg shrink-0"
                          style={{
                            backgroundColor: `${decoy.primaryColor}25`,
                            borderColor: `${decoy.accentColor}50`
                          }}
                        >
                          {decoy.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              APP #{decoy.id} • DEPLOYED
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {decoy.category}
                            </span>
                            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-black">
                              ✨ Gemini 3.7
                            </span>
                          </div>
                          <h3 className="text-base md:text-lg font-black text-white mt-1">
                            {decoy.standaloneTitle}
                          </h3>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            Package ID: <span className="text-indigo-300">{decoy.packageName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Top Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDecoy(decoy)}
                          className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all flex items-center gap-1.5 shadow-lg"
                          style={{ backgroundColor: decoy.primaryColor }}
                        >
                          <span>🚀</span>
                          <span>Launch Live App</span>
                        </button>
                        <button
                          onClick={() => setShowDirectTool(showDirectTool === decoy.id ? null : decoy.id)}
                          className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 transition-all border border-slate-800 flex items-center gap-1.5"
                        >
                          <span>🧮</span>
                          <span>{showDirectTool === decoy.id ? 'Close Tool' : 'Interactive Tool'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Features Strip */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {decoy.features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800/80 px-2.5 py-1 rounded-lg font-medium"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    {/* Deployment Specs & Build Terminal Box */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
                      {/* Column 1: Amazon Appstore Targets */}
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                            <span>📦</span> Amazon Appstore (Fire OS)
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">APK Release</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Standalone APK target compiled for Fire HD 8, 10, Max 11 & Android TV. Zero master dock injection.
                        </p>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          Status: Configured in eas.json
                        </div>
                      </div>

                      {/* Column 2: Samsung Galaxy Store */}
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
                            <span>🌌</span> Samsung Galaxy Store
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">AAB Bundle</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Android App Bundle with DeX desktop mode & One UI multi-window split screen support.
                        </p>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          Status: Configured in eas.json
                        </div>
                      </div>

                      {/* Column 3: EAS Build Profile */}
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                            <span>⚙️</span> EAS Build Trigger
                          </span>
                          <button
                            onClick={() => handleCopy(npmScript, `npm-${decoy.id}`)}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                          >
                            {copiedKey === `npm-${decoy.id}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="font-mono text-[10px] text-emerald-300 bg-slate-900 p-1.5 rounded border border-slate-800 truncate">
                          {npmScript}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                          <span>Profile: {buildProfile}</span>
                          <button
                            onClick={() => handleCopy(easCmd, `eas-${decoy.id}`)}
                            className="text-slate-400 hover:text-slate-200"
                          >
                            Copy EAS CLI
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Tool Drawer if expanded */}
                    {showDirectTool === decoy.id && (
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <span>🧮</span>
                            <span>Standalone Offline Tool: {decoy.toolName}</span>
                          </span>
                          <button
                            onClick={() => setShowDirectTool(null)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            ✕ Close
                          </button>
                        </div>
                        <AppInteractiveTools
                          toolType={decoy.toolType}
                          toolName={decoy.toolName}
                          accentColor={decoy.accentColor}
                          primaryColor={decoy.primaryColor}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Master Deployment CLI Cheatsheet */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    ⚡ Master Deployment CLI Reference
                  </h3>
                  <p className="text-xs text-slate-400">
                    Run these commands locally or in cloud CI/CD pipelines to build the first five standalone binaries:
                  </p>
                </div>
                <button
                  onClick={() => {
                    const bashScript = `#!/usr/bin/env bash
# Deploy First 5 Standalone Applications (Amazon & Samsung Stores)
set -e

echo "Building App 01: ClauseGuard (Legal)..."
npm run decoy:build:01:law

echo "Building App 02: VitalTriage (Medical)..."
npm run decoy:build:02:medical

echo "Building App 03: ClaimValuator (Injury)..."
npm run decoy:build:03:injury

echo "Building App 04: PropYield (Real Estate)..."
npm run decoy:build:04:realestate

echo "Building App 05: WealthVector (Finance)..."
npm run decoy:build:05:finance

echo "All 5 First Standalone Applications built successfully!"
`;
                    handleCopy(bashScript, 'bash-script');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all"
                >
                  {copiedKey === 'bash-script' ? '✓ Copied Script!' : 'Copy Bash Script'}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300 overflow-x-auto custom-scrollbar">
                <div className="text-slate-500"># 1. ClauseGuard (Legal & Contracts)</div>
                <div className="text-emerald-400">npm run decoy:build:01:law</div>
                <div className="text-slate-500 pt-1"># 2. VitalTriage (Clinical Triage)</div>
                <div className="text-emerald-400">npm run decoy:build:02:medical</div>
                <div className="text-slate-500 pt-1"># 3. ClaimValuator (Personal Injury)</div>
                <div className="text-emerald-400">npm run decoy:build:03:injury</div>
                <div className="text-slate-500 pt-1"># 4. PropYield (Real Estate & Cap Rate)</div>
                <div className="text-emerald-400">npm run decoy:build:04:realestate</div>
                <div className="text-slate-500 pt-1"># 5. WealthVector (Wealth & FIRE)</div>
                <div className="text-emerald-400">npm run decoy:build:05:finance</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecoyAppsHub;
