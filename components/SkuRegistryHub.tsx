import React, { useState } from 'react';
import { 
  MASTER_SUITE_SKUS, 
  STANDALONE_APPS_SKU_REGISTRY, 
  validateStoreSku, 
  STORE_COMPLIANCE_AND_OTHER_REQUIREMENTS,
  StoreProductSKU
} from '../services/skuService';

interface SkuRegistryHubProps {
  onClose?: () => void;
}

export const SkuRegistryHub: React.FC<SkuRegistryHubProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'master' | 'standalone' | 'validator' | 'other_checklist'>('validator');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Interactive SKU Validator State
  const [testSkuInput, setTestSkuInput] = useState<string>('Dons Empire Pro 2026');
  const [targetStore, setTargetStore] = useState<'google_play' | 'apple' | 'amazon' | 'samsung'>('google_play');
  
  // Standalone app filter
  const [selectedStandaloneKey, setSelectedStandaloneKey] = useState<string>('all');

  const validationResult = validateStoreSku(testSkuInput, targetStore);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 uppercase tracking-widest">
                STORE BILLING & SKU COMMAND CENTER
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 uppercase tracking-widest">
                GOOGLE PLAY • APPLE • AMAZON • SAMSUNG
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white text-2xl shadow-lg">
                🏷️
              </span>
              Store SKUs & Submission Requirements
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Resolve <strong className="text-rose-400 font-mono">"SKU not right"</strong> errors with verified product identifiers, automated syntax correction, and complete compliance documentation for the Master Suite and First 6 Apps.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
                title="Close"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('validator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'validator'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>🛠️</span>
            <span>SKU Diagnostic & Auto-Fixer</span>
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'master'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>👑</span>
            <span>Master Empire SKUs (20-in-1)</span>
          </button>
          <button
            onClick={() => setActiveTab('standalone')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'standalone'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>📱</span>
            <span>First 6 Apps SKUs (General, Med, Law)</span>
          </button>
          <button
            onClick={() => setActiveTab('other_checklist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'other_checklist'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>📋</span>
            <span>"The Other" Store Checklist</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE SKU DIAGNOSTIC & AUTO-FIXER */}
        {activeTab === 'validator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Why SKU is Not Right banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">⚠️</span>
                <div>
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">
                    Why Did You Get "SKU Not Right" or "Invalid Product ID"?
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    App stores (especially Google Play and Apple) have rigid syntax rules for SKUs. Any <strong className="text-white">uppercase letters</strong>, <strong className="text-white">spaces</strong>, <strong className="text-white">hyphens in product IDs</strong>, or <strong className="text-white">starting with punctuation</strong> will cause the store console or EAS build tool to reject your entry.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Validator Tool */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🧪</span> Live SKU Syntax Inspector & Auto-Repair
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Type or paste whatever SKU you tried to enter into Google Play, Apple, Amazon, or EAS:
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-2">Store:</span>
                  {(['google_play', 'apple', 'amazon', 'samsung'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setTargetStore(s)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                        targetStore === s
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s === 'google_play' ? 'Google Play' : s === 'apple' ? 'Apple' : s === 'amazon' ? 'Amazon' : 'Samsung'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Row */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Input SKU / Product ID to Check:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={testSkuInput}
                    onChange={(e) => setTestSkuInput(e.target.value)}
                    placeholder="e.g. dons_empire_pro_monthly or Dons Empire Pro 2026"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTestSkuInput('dons_empire_pro_monthly')}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold"
                    >
                      Valid Example
                    </button>
                    <button
                      onClick={() => setTestSkuInput('Dons Empire Pro 2026!')}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl text-xs font-mono font-bold"
                    >
                      Invalid Example
                    </button>
                  </div>
                </div>
              </div>

              {/* Validation Result Box */}
              <div className={`p-5 rounded-2xl border transition-all ${
                validationResult.isValid 
                  ? 'bg-emerald-950/20 border-emerald-500/40' 
                  : 'bg-rose-950/20 border-rose-500/40'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xl ${validationResult.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {validationResult.isValid ? '✅' : '❌'}
                    </span>
                    <span className={`text-sm font-black uppercase tracking-wider ${
                      validationResult.isValid ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {validationResult.isValid ? 'Valid & Store Compliant' : 'Invalid SKU - Store Will Reject'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    Checked for: {targetStore.toUpperCase()}
                  </span>
                </div>

                {/* Errors list */}
                {!validationResult.isValid && (
                  <div className="space-y-2 mb-4 bg-slate-950/60 p-3.5 rounded-xl border border-rose-900/40">
                    <div className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                      Why it failed ({validationResult.errors.length} issue{validationResult.errors.length > 1 ? 's' : ''}):
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-200">
                      {validationResult.errors.map((err, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Auto-Corrected SKU */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      ✨ Auto-Corrected Safe SKU (Ready for Store):
                    </div>
                    <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
                      {validationResult.normalizedSku || '(empty)'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(validationResult.normalizedSku, 'corrected_sku')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg"
                  >
                    <span>{copiedKey === 'corrected_sku' ? '✓ Copied!' : '📋 Copy Fixed SKU'}</span>
                  </button>
                </div>
              </div>

              {/* Store Rule Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black text-indigo-400 uppercase">Google Play Rules</div>
                  <p className="text-[11px] text-slate-400">
                    Lowercase only (<code className="text-indigo-300">a-z, 0-9, _, .</code>). Max 40 chars. NO UPPERCASE, NO SPACES.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black text-indigo-400 uppercase">Apple App Store Rules</div>
                  <p className="text-[11px] text-slate-400">
                    Reverse-domain syntax: <code className="text-indigo-300">com.company.app.product</code>. No spaces. Max 100 chars.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black text-amber-400 uppercase">Amazon Appstore Rules</div>
                  <p className="text-[11px] text-slate-400">
                    Alphanumeric with underscores. Must match in-code SKU. Max 150 chars. Zero testing delay.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black text-cyan-400 uppercase">Samsung Galaxy Rules</div>
                  <p className="text-[11px] text-slate-400">
                    Item ID up to 30 chars. Alphanumeric. DeX & Multi-window ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER SUITE (DON'S EMPIRE) SKUS */}
        {activeTab === 'master' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>👑</span> Don's Grounded AI Empire (20-in-1 Master Suite)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Package Name: <code className="text-indigo-400 font-mono">com.donsempire.groundedai</code> | Apple App SKU: <code className="text-indigo-400 font-mono">DONS_EMPIRE_2026</code>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  6 Store Products Ready
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {MASTER_SUITE_SKUS.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {product.type === 'subscription' ? '💎' : '🪙'}
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-white">{product.name}</h4>
                        <p className="text-[11px] text-slate-400">{product.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-black text-xs">
                        {product.formattedPrice}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 uppercase font-black">
                        {product.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Store Specific SKUs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Google Play */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase text-indigo-400 flex items-center justify-between">
                          <span>Google Play Product ID</span>
                          <span className="text-[9px] text-slate-500">Android</span>
                        </div>
                        <code className="block mt-1 font-mono text-emerald-400 text-[11px] truncate" title={product.googlePlaySku}>
                          {product.googlePlaySku}
                        </code>
                        {product.googlePlayBasePlanId && (
                          <div className="mt-1 text-[9px] text-slate-400">
                            Base Plan: <span className="font-mono text-indigo-300">{product.googlePlayBasePlanId}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(product.googlePlaySku, `${product.id}_gp`)}
                        className="mt-2.5 w-full py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold uppercase transition-all"
                      >
                        {copiedKey === `${product.id}_gp` ? '✓ Copied' : 'Copy Play SKU'}
                      </button>
                    </div>

                    {/* Apple App Store */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase text-cyan-400 flex items-center justify-between">
                          <span>Apple Product ID</span>
                          <span className="text-[9px] text-slate-500">iOS</span>
                        </div>
                        <code className="block mt-1 font-mono text-cyan-300 text-[11px] truncate" title={product.appleProductId}>
                          {product.appleProductId}
                        </code>
                        <div className="mt-1 text-[9px] text-slate-400">
                          App SKU: <span className="font-mono text-slate-300">{product.appleAppSku}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(product.appleProductId, `${product.id}_apple`)}
                        className="mt-2.5 w-full py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold uppercase transition-all"
                      >
                        {copiedKey === `${product.id}_apple` ? '✓ Copied' : 'Copy Apple ID'}
                      </button>
                    </div>

                    {/* Amazon Appstore */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase text-amber-400 flex items-center justify-between">
                          <span>Amazon IAP SKU</span>
                          <span className="text-[9px] text-slate-500">Fire OS</span>
                        </div>
                        <code className="block mt-1 font-mono text-amber-300 text-[11px] truncate" title={product.amazonSku}>
                          {product.amazonSku}
                        </code>
                        <div className="mt-1 text-[9px] text-emerald-400">
                          ✓ 0-Tester Approval
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(product.amazonSku, `${product.id}_amz`)}
                        className="mt-2.5 w-full py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold uppercase transition-all"
                      >
                        {copiedKey === `${product.id}_amz` ? '✓ Copied' : 'Copy Amazon SKU'}
                      </button>
                    </div>

                    {/* Samsung Galaxy Store */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase text-purple-400 flex items-center justify-between">
                          <span>Samsung Item ID</span>
                          <span className="text-[9px] text-slate-500">Galaxy</span>
                        </div>
                        <code className="block mt-1 font-mono text-purple-300 text-[11px] truncate" title={product.samsungItemId}>
                          {product.samsungItemId}
                        </code>
                        <div className="mt-1 text-[9px] text-indigo-300">
                          DeX & Foldable Ready
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(product.samsungItemId, `${product.id}_sam`)}
                        className="mt-2.5 w-full py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold uppercase transition-all"
                      >
                        {copiedKey === `${product.id}_sam` ? '✓ Copied' : 'Copy Samsung ID'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: THE FIRST 6 STANDALONE APPS SKUS */}
        {activeTab === 'standalone' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter and App Selector */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  First 6 Standalone Apps SKUs (User Requested Layout)
                </h3>
                <p className="text-xs text-slate-400">
                  #1 General, #2 & #3 Medical, #4 Non-Profit, #5 & #6 Law
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">Filter App:</span>
                <select
                  value={selectedStandaloneKey}
                  onChange={(e) => setSelectedStandaloneKey(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-400 focus:outline-none"
                >
                  <option value="all">All 6 Apps</option>
                  {STANDALONE_APPS_SKU_REGISTRY.map(app => (
                    <option key={app.appKey} value={app.appKey}>
                      {app.appName} ({app.category.split('/')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Standalone Apps List */}
            <div className="space-y-6">
              {STANDALONE_APPS_SKU_REGISTRY
                .filter(app => selectedStandaloneKey === 'all' || app.appKey === selectedStandaloneKey)
                .map((app, idx) => (
                  <div
                    key={app.appKey}
                    className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-black">
                            APP 0{idx + 1}
                          </span>
                          <h4 className="text-base font-black text-white">{app.appTitle}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                          <span className="text-slate-400">Package:</span>
                          <code className="text-indigo-400 font-mono text-[11px]">{app.packageName}</code>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">Category:</span>
                          <span className="text-slate-200 font-bold">{app.category}</span>
                        </div>
                      </div>

                      {/* EAS Build profile helper */}
                      <button
                        onClick={() => handleCopy(`npx eas build --platform android --profile app${idx+1}-${app.appKey.replace('_','')}`, `eas_${app.appKey}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <span>⚡</span>
                        <span>{copiedKey === `eas_${app.appKey}` ? '✓ Copied Build Command' : `Copy EAS Build Profile`}</span>
                      </button>
                    </div>

                    {/* Products for this app */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {app.products.map(prod => (
                        <div
                          key={prod.id}
                          className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{prod.name}</span>
                            <span className="text-xs font-mono font-black text-emerald-400">{prod.formattedPrice}</span>
                          </div>

                          <div className="space-y-2 text-[11px]">
                            {/* Google Play SKU */}
                            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-indigo-400 block">Google Play SKU:</span>
                                <code className="text-white font-mono">{prod.googlePlaySku}</code>
                              </div>
                              <button
                                onClick={() => handleCopy(prod.googlePlaySku, `${prod.id}_gp`)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold uppercase"
                              >
                                {copiedKey === `${prod.id}_gp` ? '✓' : 'Copy'}
                              </button>
                            </div>

                            {/* Base Plan ID */}
                            {prod.googlePlayBasePlanId && (
                              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Google Play Base Plan ID:</span>
                                  <code className="text-indigo-300 font-mono">{prod.googlePlayBasePlanId}</code>
                                </div>
                                <button
                                  onClick={() => handleCopy(prod.googlePlayBasePlanId!, `${prod.id}_bp`)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold uppercase"
                                >
                                  {copiedKey === `${prod.id}_bp` ? '✓' : 'Copy'}
                                </button>
                              </div>
                            )}

                            {/* Apple Product ID */}
                            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-cyan-400 block">Apple Product ID:</span>
                                <code className="text-cyan-200 font-mono text-[10px] truncate max-w-[190px] block">{prod.appleProductId}</code>
                              </div>
                              <button
                                onClick={() => handleCopy(prod.appleProductId, `${prod.id}_apple`)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold uppercase"
                              >
                                {copiedKey === `${prod.id}_apple` ? '✓' : 'Copy'}
                              </button>
                            </div>

                            {/* Amazon SKU */}
                            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-amber-400 block">Amazon SKU:</span>
                                <code className="text-amber-200 font-mono">{prod.amazonSku}</code>
                              </div>
                              <button
                                onClick={() => handleCopy(prod.amazonSku, `${prod.id}_amz`)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold uppercase"
                              >
                                {copiedKey === `${prod.id}_amz` ? '✓' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: "THE OTHER" COMPLETE STORE SUBMISSION CHECKLIST */}
        {activeTab === 'other_checklist' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
              <span className="text-2xl mt-0.5">📋</span>
              <div>
                <h3 className="text-sm font-black text-indigo-300 uppercase tracking-wider">
                  "The Other" Submission Requirements Cheat Sheet
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Beyond SKUs, store reviewers (Google Play, Apple, Amazon, Samsung) require these mandatory legal links, data declarations, permissions, and questionnaires. Copy the answers directly into the developer portals.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Legal URLs */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>🌐</span> Live Legal URLs (Required by all stores)
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Privacy Policy URL</span>
                      <button
                        onClick={() => handleCopy(STORE_COMPLIANCE_AND_OTHER_REQUIREMENTS.legalUrls.privacyPolicy, 'priv_url')}
                        className="text-[9px] text-indigo-400 font-bold uppercase hover:underline"
                      >
                        {copiedKey === 'priv_url' ? '✓ Copied' : 'Copy URL'}
                      </button>
                    </div>
                    <code className="text-indigo-300 font-mono text-[11px] break-all">
                      {STORE_COMPLIANCE_AND_OTHER_REQUIREMENTS.legalUrls.privacyPolicy}
                    </code>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Terms of Service URL</span>
                      <button
                        onClick={() => handleCopy(STORE_COMPLIANCE_AND_OTHER_REQUIREMENTS.legalUrls.termsOfService, 'tos_url')}
                        className="text-[9px] text-indigo-400 font-bold uppercase hover:underline"
                      >
                        {copiedKey === 'tos_url' ? '✓ Copied' : 'Copy URL'}
                      </button>
                    </div>
                    <code className="text-indigo-300 font-mono text-[11px] break-all">
                      {STORE_COMPLIANCE_AND_OTHER_REQUIREMENTS.legalUrls.termsOfService}
                    </code>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">AdMob app-ads.txt URL</span>
                      <button
                        onClick={() => handleCopy(STORE_COMPLIANCE_AND_OTHER_REQUIREMENTS.legalUrls.appAdsTxt, 'ads_url')}
                        className="text-[9px] text-indigo-400 font-bold uppercase hover:underline"
                      >
                        {copiedKey === 'ads_url' ? '✓ Copied' : 'Copy URL'}
                      </button>
                    </div>
                    <code className="text-emerald-400 font-mono text-[11px] break-all">
                      {STORE_COMPLIANCE_AND_OTHER_REQUIREMENTS.legalUrls.appAdsTxt}
                    </code>
                  </div>
                </div>
              </div>

              {/* Card 2: Data Safety Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>🔒</span> Google Play Data Safety Answers
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Does app collect user data?</span>
                    <span className="text-white font-medium">Only account email for authentication and payment verification. No location or biometric tracking.</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Is data encrypted in transit?</span>
                    <span className="text-emerald-400 font-bold">Yes (TLS 1.3 / HTTPS encryption everywhere).</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Can users request deletion?</span>
                    <span className="text-emerald-400 font-bold">Yes (Account reset available in settings).</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Target Age Group</span>
                    <span className="text-white font-medium">13 and older (Teens & Adults). Select 13+ or 18+.</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Permissions & In-App Billing */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>💳</span> In-App Billing & Permissions Status
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase text-emerald-400">Google Play Billing Permission</div>
                      <code className="text-emerald-300 font-mono text-xs">com.android.vending.BILLING</code>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">ACTIVE IN APP.JSON</span>
                  </div>

                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase text-indigo-400">EAS Submit iOS SKU</div>
                      <code className="text-indigo-300 font-mono text-xs">com.donsempire.groundedai</code>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">CONFIGURED IN EAS.JSON</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-black mb-1">Target SDK & Version Code</div>
                    <div className="text-slate-300 text-xs">
                      Version Name: <strong className="text-white font-mono">1.0.0</strong> | Version Code: <strong className="text-white font-mono">100</strong> | Target SDK: <strong className="text-white font-mono">Android 14/15 (API 34/35)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Store Testing Bypass (Amazon vs Google) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>⏱️</span> Fast-Track Publishing (0-Tester Route)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
                    <div className="text-[10px] font-black uppercase text-amber-400">Amazon Appstore ($0, 24-48 hours)</div>
                    <p className="text-slate-300 text-[11px] mt-1">
                      <strong>0 testers required.</strong> Direct upload of your <code className="text-amber-300 font-mono">universal-release.apk</code>. Goes live for Fire Tablets & Android devices worldwide with zero delays.
                    </p>
                  </div>

                  <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl">
                    <div className="text-[10px] font-black uppercase text-cyan-400">Samsung Galaxy Store ($0, 48-72 hours)</div>
                    <p className="text-slate-300 text-[11px] mt-1">
                      <strong>0 testers required.</strong> Upload your <code className="text-cyan-300 font-mono">production.aab</code>. Instantly accessible across 1 Billion+ Samsung Galaxy phones, tablets, and Samsung DeX.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="text-[10px] font-black uppercase text-slate-400">Google Play Personal Account Note</div>
                    <p className="text-slate-400 text-[11px] mt-1">
                      New personal accounts require a 14-day closed test with 20 opt-in testers before production. Launching on Amazon and Samsung first gives you immediate paying users while your Google test runs!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SkuRegistryHub;
