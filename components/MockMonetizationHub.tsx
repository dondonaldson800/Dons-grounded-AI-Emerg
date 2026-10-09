import React, { useState, useMemo } from 'react';
import { MASTER_SUITE_SKUS } from '../services/skuService';
import { PRODUCTION_ADMOB_VALUES } from '../services/admobConfig';

export interface MonetizationScenario {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  mau: number;
  subConversionRate: number; // percentage, e.g. 3.5
  proRatio: number; // percentage of subscribers choosing $9.99 Pro vs $24.99 Elite
  tokenBuyerRate: number; // percentage of non-subscribers buying tokens, e.g. 2.0
  avgTokenSpend: number; // in USD, e.g. 10.00
  adImpressionsPerDay: number; // per active user
  adEcpm: number; // blended eCPM in USD, e.g. 2.50
  storeFeeRate: number; // 0.15 for 15% small business tier
}

export const PRESET_SCENARIOS: MonetizationScenario[] = [
  {
    id: 'launch',
    name: 'Phase 1: Launch & Validation',
    tagline: 'Initial early adopters & beta testers across Amazon & Samsung',
    icon: '🌱',
    mau: 1000,
    subConversionRate: 3.0,
    proRatio: 75,
    tokenBuyerRate: 1.5,
    avgTokenSpend: 6.99,
    adImpressionsPerDay: 5,
    adEcpm: 1.80,
    storeFeeRate: 0.15,
  },
  {
    id: 'growth',
    name: 'Phase 2: Growth & Traction',
    tagline: 'Consistent organic discovery across Google Play, Amazon Fire & Galaxy Store',
    icon: '🚀',
    mau: 10000,
    subConversionRate: 3.5,
    proRatio: 70,
    tokenBuyerRate: 2.2,
    avgTokenSpend: 9.99,
    adImpressionsPerDay: 6,
    adEcpm: 2.20,
    storeFeeRate: 0.15,
  },
  {
    id: 'fleet',
    name: 'Phase 3: Mature Series Fleet',
    tagline: 'Flagship apps (1-6) cross-promoting users throughout the suite',
    icon: '⚡',
    mau: 50000,
    subConversionRate: 4.0,
    proRatio: 65,
    tokenBuyerRate: 2.8,
    avgTokenSpend: 14.50,
    adImpressionsPerDay: 7,
    adEcpm: 2.60,
    storeFeeRate: 0.15,
  },
  {
    id: 'empire',
    name: 'Phase 4: Full 20-App Empire Scale',
    tagline: 'Complete 20-app grounded series live on all global stores & DeX',
    icon: '👑',
    mau: 250000,
    subConversionRate: 4.5,
    proRatio: 60,
    tokenBuyerRate: 3.2,
    avgTokenSpend: 18.00,
    adImpressionsPerDay: 8,
    adEcpm: 3.10,
    storeFeeRate: 0.15,
  },
];

interface MockMonetizationHubProps {
  onClose?: () => void;
}

export const MockMonetizationHub: React.FC<MockMonetizationHubProps> = ({ onClose }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('growth');

  // Custom adjustable parameters
  const [mau, setMau] = useState<number>(10000);
  const [subConversionRate, setSubConversionRate] = useState<number>(3.5);
  const [proRatio, setProRatio] = useState<number>(70); // % Pro vs Elite
  const [tokenBuyerRate, setTokenBuyerRate] = useState<number>(2.2);
  const [avgTokenSpend, setAvgTokenSpend] = useState<number>(9.99);
  const [adImpressionsPerDay, setAdImpressionsPerDay] = useState<number>(6);
  const [adEcpm, setAdEcpm] = useState<number>(2.20);
  const [storeFeeRate, setStoreFeeRate] = useState<number>(0.15); // 15% small business tier

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Apply preset scenario
  const applyScenario = (scenario: MonetizationScenario) => {
    setSelectedScenarioId(scenario.id);
    setMau(scenario.mau);
    setSubConversionRate(scenario.subConversionRate);
    setProRatio(scenario.proRatio);
    setTokenBuyerRate(scenario.tokenBuyerRate);
    setAvgTokenSpend(scenario.avgTokenSpend);
    setAdImpressionsPerDay(scenario.adImpressionsPerDay);
    setAdEcpm(scenario.adEcpm);
    setStoreFeeRate(scenario.storeFeeRate);
  };

  // Calculations
  const metrics = useMemo(() => {
    const totalSubscribers = Math.round(mau * (subConversionRate / 100));
    const proSubscribers = Math.round(totalSubscribers * (proRatio / 100));
    const eliteSubscribers = totalSubscribers - proSubscribers;

    const proPriceMonthly = 9.99;
    const elitePriceMonthly = 24.99;

    const monthlyProRevenue = proSubscribers * proPriceMonthly;
    const monthlyEliteRevenue = eliteSubscribers * elitePriceMonthly;
    const monthlySubscriptionRevenue = monthlyProRevenue + monthlyEliteRevenue;

    // Tokens
    const nonSubscribers = Math.max(0, mau - totalSubscribers);
    const tokenBuyers = Math.round(nonSubscribers * (tokenBuyerRate / 100));
    const monthlyTokenRevenue = tokenBuyers * avgTokenSpend;

    // AdMob Ads
    // Active free/hybrid users viewing ads
    const adViewers = nonSubscribers + Math.round(totalSubscribers * 0.15); // hybrid ad impressions
    const dailyTotalImpressions = adViewers * adImpressionsPerDay;
    const monthlyTotalImpressions = dailyTotalImpressions * 30.4;
    const monthlyAdRevenue = (monthlyTotalImpressions / 1000) * adEcpm;

    // Totals
    const grossMonthlyRevenue = monthlySubscriptionRevenue + monthlyTokenRevenue + monthlyAdRevenue;
    const grossAnnualRevenue = grossMonthlyRevenue * 12;

    // Platform Store Fees (Google Play, Amazon Appstore, Samsung Galaxy Store take 15% on IAP/Subs; Ads have $0 store fee)
    const storeApplicableGross = monthlySubscriptionRevenue + monthlyTokenRevenue;
    const monthlyStoreFee = storeApplicableGross * storeFeeRate;
    const annualStoreFee = monthlyStoreFee * 12;

    // Net Payouts (Direct to Developer Bank / Sutton Bank ACH)
    const netMonthlyTakeHome = grossMonthlyRevenue - monthlyStoreFee;
    const netAnnualTakeHome = grossAnnualRevenue - annualStoreFee;

    // Blended ARPU (Average Revenue Per User)
    const monthlyArpu = mau > 0 ? grossMonthlyRevenue / mau : 0;
    const annualArpu = monthlyArpu * 12;

    // Store breakdown estimations
    const googlePlayShare = 0.55;
    const samsungShare = 0.25;
    const amazonShare = 0.20;

    return {
      totalSubscribers,
      proSubscribers,
      eliteSubscribers,
      monthlyProRevenue,
      monthlyEliteRevenue,
      monthlySubscriptionRevenue,
      tokenBuyers,
      monthlyTokenRevenue,
      monthlyTotalImpressions,
      monthlyAdRevenue,
      grossMonthlyRevenue,
      grossAnnualRevenue,
      monthlyStoreFee,
      annualStoreFee,
      netMonthlyTakeHome,
      netAnnualTakeHome,
      monthlyArpu,
      annualArpu,
      googlePlayShareRevenue: grossMonthlyRevenue * googlePlayShare,
      samsungShareRevenue: grossMonthlyRevenue * samsungShare,
      amazonShareRevenue: grossMonthlyRevenue * amazonShare,
    };
  }, [mau, subConversionRate, proRatio, tokenBuyerRate, avgTokenSpend, adImpressionsPerDay, adEcpm, storeFeeRate]);

  // Copy Executive Text Summary
  const handleCopySummary = () => {
    const text = `=== DON'S GROUNDED AI EMPIRE - MOCK MONETIZATION REPORT ===
Project: Don's Grounded AI Empire (20-App Series)
Package: com.donsempire.groundedai
Active Base: ${mau.toLocaleString()} Monthly Active Users (MAU)

MONTHLY GROSS REVENUE: $${metrics.grossMonthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
ANNUAL RUN-RATE (ARR): $${metrics.grossAnnualRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

REVENUE STREAMS BREAKDOWN (MONTHLY):
1. Subscriptions: $${metrics.monthlySubscriptionRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
   - Power User Pro ($9.99/mo): ${metrics.proSubscribers.toLocaleString()} subs ($${metrics.monthlyProRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
   - Infinite Creator Elite ($24.99/mo): ${metrics.eliteSubscribers.toLocaleString()} subs ($${metrics.monthlyEliteRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
   - Total Subscribers: ${metrics.totalSubscribers.toLocaleString()} (${subConversionRate}% conversion)

2. In-App Token Packs: $${metrics.monthlyTokenRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
   - Active Buyers: ${metrics.tokenBuyers.toLocaleString()} users @ $${avgTokenSpend.toFixed(2)} avg spend

3. Google AdMob Ads: $${metrics.monthlyAdRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
   - Monthly Impressions: ${Math.round(metrics.monthlyTotalImpressions).toLocaleString()}
   - Blended eCPM: $${adEcpm.toFixed(2)}
   - Units: Banner, Interstitial, Rewarded Video

STORE DEDUCTIONS & NET PAYOUT:
- Store Cut (${(storeFeeRate * 100).toFixed(0)}% Small Business Tier): -$${metrics.monthlyStoreFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
- NET MONTHLY TAKE-HOME (Direct Deposit): $${metrics.netMonthlyTakeHome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
- NET ANNUAL TAKE-HOME: $${metrics.netAnnualTakeHome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / yr
- Blended ARPU: $${metrics.monthlyArpu.toFixed(2)} / user / month

STORE DISTRIBUTION ESTIMATE:
- Google Play Store (55%): $${metrics.googlePlayShareRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
- Samsung Galaxy Store (25%): $${metrics.samsungShareRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
- Amazon Appstore (20%): $${metrics.amazonShareRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
===========================================================`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Copy JSON
  const handleCopyJson = () => {
    const payload = {
      project: "Don's Grounded AI Empire",
      generated_at: new Date().toISOString(),
      scenario: selectedScenarioId,
      parameters: {
        mau,
        subConversionRate,
        proRatio,
        tokenBuyerRate,
        avgTokenSpend,
        adImpressionsPerDay,
        adEcpm,
        storeFeeRate,
      },
      figures: {
        grossMonthlyRevenue: Number(metrics.grossMonthlyRevenue.toFixed(2)),
        grossAnnualRevenue: Number(metrics.grossAnnualRevenue.toFixed(2)),
        netMonthlyTakeHome: Number(metrics.netMonthlyTakeHome.toFixed(2)),
        netAnnualTakeHome: Number(metrics.netAnnualTakeHome.toFixed(2)),
        monthlySubscriptionRevenue: Number(metrics.monthlySubscriptionRevenue.toFixed(2)),
        monthlyTokenRevenue: Number(metrics.monthlyTokenRevenue.toFixed(2)),
        monthlyAdRevenue: Number(metrics.monthlyAdRevenue.toFixed(2)),
        monthlyStoreFee: Number(metrics.monthlyStoreFee.toFixed(2)),
        monthlyArpu: Number(metrics.monthlyArpu.toFixed(2)),
        totalSubscribers: metrics.totalSubscribers,
        proSubscribers: metrics.proSubscribers,
        eliteSubscribers: metrics.eliteSubscribers,
      },
      store_distribution: {
        google_play_usd: Number(metrics.googlePlayShareRevenue.toFixed(2)),
        samsung_galaxy_usd: Number(metrics.samsungShareRevenue.toFixed(2)),
        amazon_appstore_usd: Number(metrics.amazonShareRevenue.toFixed(2)),
      },
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 uppercase tracking-widest">
              MONETIZATION PROJECTION ENGINE
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 uppercase tracking-widest">
              SUBSCRIPTIONS • ADMOB • TOKENS • 3 STORES
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white text-xl shadow-lg">
              💰
            </span>
            Mock Monetization & Revenue Simulator
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Live financial projections based on your active SKUs, AdMob ad units, and verified store fees for Google Play, Amazon Appstore, and Samsung Galaxy Store.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <span>{copiedSummary ? '✓ Copied!' : '📋 Copy Financial Summary'}</span>
          </button>
          <button
            onClick={handleCopyJson}
            className="px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
          >
            <span>{copiedJson ? '✓ JSON Copied!' : '{ } Export JSON'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Preset Scenario Selector Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {PRESET_SCENARIOS.map((scenario) => {
          const isSelected = selectedScenarioId === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => applyScenario(scenario)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{scenario.icon}</span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {scenario.mau.toLocaleString()} MAU
                  </span>
                </div>
                <h4 className="text-xs font-black text-white">{scenario.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {scenario.tagline}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 uppercase font-black">Conversion</span>
                <span className="text-emerald-400 font-mono font-bold">{scenario.subConversionRate}% Subs</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Master High-Level Revenue Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Net Monthly Take-Home */}
        <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400 text-6xl font-black">
            $
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Net Monthly Take-Home
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              DIRECT DEPOSIT
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2">
            ${metrics.netMonthlyTakeHome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            After all store fees deducted (15% tier)
          </p>
        </div>

        {/* Net Annual Figure */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              Net Annual Run-Rate
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
              12-MO PROJECTION
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2">
            ${metrics.netAnnualTakeHome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Gross ARR: <strong className="text-slate-200 font-mono">${metrics.grossAnnualRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
          </p>
        </div>

        {/* Gross Monthly Revenue */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Monthly Gross Inflow
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              TOTAL VOLUME
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2">
            ${metrics.grossMonthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Store fees: -${metrics.monthlyStoreFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
          </p>
        </div>

        {/* Blended ARPU */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
              Monthly ARPU
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
              PER ACTIVE USER
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2">
            ${metrics.monthlyArpu.toFixed(2)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Annual value: <strong className="text-slate-200 font-mono">${metrics.annualArpu.toFixed(2)}/yr</strong> per user
          </p>
        </div>
      </div>

      {/* Stream Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream 1: Subscriptions */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔄</span>
              <div>
                <h4 className="text-sm font-black text-white">1. Recurring Subscriptions</h4>
                <p className="text-[10px] text-slate-400">Google Play & Galaxy Store auto-renewals</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-emerald-400 font-mono">
                ${metrics.monthlySubscriptionRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[9px] text-slate-500 uppercase font-black">/ Month</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Power User Pro ($9.99/mo):</span>
              <span className="font-mono text-white font-bold">
                {metrics.proSubscribers.toLocaleString()} subs (${metrics.monthlyProRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Infinite Creator Elite ($24.99/mo):</span>
              <span className="font-mono text-white font-bold">
                {metrics.eliteSubscribers.toLocaleString()} subs (${metrics.monthlyEliteRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>
            <div className="pt-2 border-t border-slate-850 flex justify-between items-center font-bold">
              <span className="text-slate-300">Total Subscribers:</span>
              <span className="text-emerald-400 font-mono">
                {metrics.totalSubscribers.toLocaleString()} ({subConversionRate}% of active base)
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 space-y-1">
            <p>• SKUs: <code className="text-indigo-400 font-mono">dons_empire_pro_monthly</code>, <code className="text-indigo-400 font-mono">dons_empire_elite_monthly</code></p>
            <p>• Retains ~85% subscriber base month-over-month</p>
          </div>
        </div>

        {/* Stream 2: Consumable Token Packs */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🪙</span>
              <div>
                <h4 className="text-sm font-black text-white">2. In-App Token Packs</h4>
                <p className="text-[10px] text-slate-400">Consumables across all 4 app stores</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-amber-400 font-mono">
                ${metrics.monthlyTokenRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[9px] text-slate-500 uppercase font-black">/ Month</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Monthly Token Buyers:</span>
              <span className="font-mono text-white font-bold">
                {metrics.tokenBuyers.toLocaleString()} users ({tokenBuyerRate}% of free base)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Average Order Spend:</span>
              <span className="font-mono text-white font-bold">
                ${avgTokenSpend.toFixed(2)} / buyer
              </span>
            </div>
            <div className="pt-2 border-t border-slate-850 flex justify-between items-center font-bold">
              <span className="text-slate-300">Annual Token Gross:</span>
              <span className="text-amber-400 font-mono">
                ${(metrics.monthlyTokenRevenue * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 space-y-1">
            <p>• SKUs: <code className="text-amber-400 font-mono">dons_tokens_500</code> ($4.99), <code className="text-amber-400 font-mono">dons_tokens_2500</code> ($19.99), <code className="text-amber-400 font-mono">dons_tokens_10000</code> ($49.99)</p>
            <p>• High impulse purchase frequency for heavy AI/music generation</p>
          </div>
        </div>

        {/* Stream 3: Google AdMob Ads */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📢</span>
              <div>
                <h4 className="text-sm font-black text-white">3. Google AdMob Advertising</h4>
                <p className="text-[10px] text-slate-400">Banners, interstitials, and rewarded ads</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-cyan-400 font-mono">
                ${metrics.monthlyAdRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[9px] text-slate-500 uppercase font-black">/ Month</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Monthly Impressions:</span>
              <span className="font-mono text-white font-bold">
                {Math.round(metrics.monthlyTotalImpressions).toLocaleString()} ads shown
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Blended eCPM:</span>
              <span className="font-mono text-white font-bold">
                ${adEcpm.toFixed(2)} per 1,000 views
              </span>
            </div>
            <div className="pt-2 border-t border-slate-850 flex justify-between items-center font-bold">
              <span className="text-slate-300">Store Commission:</span>
              <span className="text-emerald-400 font-mono">
                $0.00 (AdMob pays 100% to dev)
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 space-y-1">
            <p>• Ad Unit IDs: <code className="text-cyan-400 font-mono">{PRODUCTION_ADMOB_VALUES.appId.slice(0, 20)}...</code></p>
            <p>• Rewarded video grants users +10 bonus tokens per watch</p>
          </div>
        </div>
      </div>

      {/* Store Distribution Breakdown */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <div>
              <h4 className="text-sm font-black text-white">Channel Distribution Projection Across App Stores</h4>
              <p className="text-[10px] text-slate-400">Estimated volume split based on typical multi-store Android distribution</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
            3 GLOBAL CHANNELS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/20 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>🤖</span> Google Play Store (55%)
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                ${metrics.googlePlayShareRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[55%]"></div>
            </div>
            <p className="text-[10px] text-slate-400">
              Targeted via <code className="text-emerald-300 font-mono">app-release.aab</code> + Google Play Billing Library
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/20 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>🌌</span> Samsung Galaxy Store (25%)
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                ${metrics.samsungShareRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-[25%]"></div>
            </div>
            <p className="text-[10px] text-slate-400">
              Galaxy devices & Samsung DeX power users with high subscription loyalty
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/20 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>📦</span> Amazon Appstore (20%)
              </span>
              <span className="font-mono text-amber-400 font-bold">
                ${metrics.amazonShareRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[20%]"></div>
            </div>
            <p className="text-[10px] text-slate-400">
              Fire 7, Fire HD 8, Fire Max 11 tablets & Windows 11 Android Subsystem
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Custom Adjustment Sliders */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>🎛️</span> Interactive Model Simulator
            </h3>
            <p className="text-[11px] text-slate-400">
              Fine-tune user counts, conversion rates, and eCPM to calculate custom mock figures on the fly.
            </p>
          </div>
          <button
            onClick={() => applyScenario(PRESET_SCENARIOS[1])}
            className="text-[11px] font-black uppercase text-indigo-400 hover:text-indigo-300 self-start md:self-auto"
          >
            Reset to Growth Baseline
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: MAU */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Monthly Active Users</span>
              <span className="text-emerald-400 font-mono font-black">{mau.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="250000"
              step="500"
              value={mau}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                setMau(Number(e.target.value));
              }}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>500</span>
              <span>100k</span>
              <span>250k</span>
            </div>
          </div>

          {/* Slider 2: Subscription Conversion % */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Paid Sub Conversion %</span>
              <span className="text-indigo-400 font-mono font-black">{subConversionRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.1"
              value={subConversionRate}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                setSubConversionRate(Number(e.target.value));
              }}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>0.5%</span>
              <span>5.0%</span>
              <span>10.0%</span>
            </div>
          </div>

          {/* Slider 3: Pro vs Elite Ratio */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Pro ($9.99) vs Elite ($24.99)</span>
              <span className="text-purple-400 font-mono font-black">{proRatio}% Pro</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={proRatio}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                setProRatio(Number(e.target.value));
              }}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>20% Pro</span>
              <span>50/50</span>
              <span>90% Pro</span>
            </div>
          </div>

          {/* Slider 4: AdMob eCPM */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">AdMob Blended eCPM</span>
              <span className="text-cyan-400 font-mono font-black">${adEcpm.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="6.00"
              step="0.10"
              value={adEcpm}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                setAdEcpm(Number(e.target.value));
              }}
              className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>$0.50</span>
              <span>$3.00</span>
              <span>$6.00</span>
            </div>
          </div>
        </div>

        {/* Secondary Row of Adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Daily Ad Impressions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Daily Ad Views / User</span>
              <span className="text-cyan-400 font-mono font-black">{adImpressionsPerDay} views</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={adImpressionsPerDay}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                setAdImpressionsPerDay(Number(e.target.value));
              }}
              className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Token Buyer % */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Token Buyer Rate %</span>
              <span className="text-amber-400 font-mono font-black">{tokenBuyerRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={tokenBuyerRate}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                setTokenBuyerRate(Number(e.target.value));
              }}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Store Fee Rate Toggle */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">App Store Fee Program</span>
              <span className="text-emerald-400 font-mono font-black">
                {storeFeeRate === 0.15 ? '15% Small Business' : '30% Standard'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStoreFeeRate(0.15)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  storeFeeRate === 0.15
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                15% Tier (Google/Amazon/Samsung)
              </button>
              <button
                type="button"
                onClick={() => setStoreFeeRate(0.30)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  storeFeeRate === 0.30
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                30% Standard Tier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Destination Verification Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-black">
            🏦
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Direct Deposit Routing Configured</h4>
            <p className="text-xs text-slate-400">
              Payouts from Google Play, Amazon, Samsung & AdMob wire directly via ACH to Sutton Bank / Cash App.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-white">SUTTON BANK •••• 9368</div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-black">Routing: 071923284 • ACTIVE</div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-black border border-emerald-500/30">
            VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
};

export default MockMonetizationHub;
