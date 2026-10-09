
import React, { useState } from 'react';
import { SubscriptionTier } from '../types';
import PaymentModal, { PaymentItem } from './PaymentModal';

interface PricingModalProps {
  currentTier: SubscriptionTier;
  onSelectTier: (tier: SubscriptionTier) => void;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ currentTier, onSelectTier, onClose }) => {
  const [checkoutItem, setCheckoutItem] = useState<PaymentItem | null>(null);
  const tiers = [
    {
      id: SubscriptionTier.FREE,
      name: 'Community',
      price: '$0',
      description: 'Zero startup cost. Perfect for daily grounded tasks.',
      features: [
        'Standard OmniChat (Lite)',
        'Basic Explorer Access',
        'Image Generation (1K)',
        'Sync across Play/Galaxy Store',
        'Standard Voice Hub'
      ],
      color: 'bg-slate-700',
      buttonText: 'Select Free'
    },
    {
      id: SubscriptionTier.PRO,
      name: 'Power User',
      price: '$9.99/mo',
      description: 'Unlock the depth of the Grounded series.',
      features: [
        'Advanced OmniChat (Pro)',
        'Deep Thinking Mode 🧠',
        'Real-time Search Grounding',
        'Priority Processing',
        'Cross-platform Firefox Plugin'
      ],
      color: 'bg-indigo-600',
      buttonText: 'Upgrade to Pro',
      popular: true
    },
    {
      id: SubscriptionTier.ELITE,
      name: 'Infinite Creator',
      price: '$24.99/mo',
      description: 'The ultimate tier for the 20-app series.',
      features: [
        'Veo 3.1 Video Generation 🎬',
        'Google Maps Grounding 📍',
        'High-Res Image (4K)',
        'Multi-Speaker Voice Synthesis',
        'Shared Credits across Series'
      ],
      color: 'bg-amber-500 text-slate-900',
      buttonText: 'Get Elite Access'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] relative p-8 md:p-12">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors p-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <header className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">App 1 of 20 Series</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Grounded Intelligence</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Don's Grounded AI is designed for transparency. Start for free on Play Store, Galaxy Store, or Firefox with absolutely no initial cost.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              className={`flex flex-col rounded-[2rem] p-8 border transition-all duration-500 relative group ${
                tier.popular 
                  ? 'border-indigo-500 bg-indigo-500/[0.03] shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)]' 
                  : 'border-slate-800 bg-slate-900/50'
              } ${currentTier === tier.id ? 'ring-2 ring-emerald-500/50 border-emerald-500/50' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Recommended
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-black mb-1 tracking-tight">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{tier.price}</span>
                  <span className="text-slate-500 text-xs font-bold">/mo</span>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-8 leading-relaxed flex-1">
                {tier.description}
              </p>
              
              <ul className="space-y-4 mb-10">
                {tier.features.map((feature, i) => (
                  <li key={i} className="text-xs flex items-center gap-3 text-slate-300">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tier.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (currentTier === tier.id) return;
                  if (tier.id === SubscriptionTier.FREE) {
                    onSelectTier(SubscriptionTier.FREE);
                  } else {
                    setCheckoutItem({
                      id: `tier_${tier.id}`,
                      name: `${tier.name} (${tier.id})`,
                      amount: tier.id === SubscriptionTier.PRO ? 9.99 : 24.99,
                      formattedPrice: tier.price,
                      type: 'subscription',
                      tier: tier.id,
                      description: tier.description,
                    });
                  }
                }}
                disabled={currentTier === tier.id}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  currentTier === tier.id 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-default cursor-not-allowed shadow-inner' 
                    : `${tier.color} hover:scale-[1.02] active:scale-[0.98] shadow-lg`
                }`}
              >
                {currentTier === tier.id ? (tier.id === SubscriptionTier.ELITE ? '👑 Elite Plan Active' : 'Active Plan') : tier.buttonText}
              </button>

              {tier.id !== SubscriptionTier.FREE && (
                <div className="mt-2.5 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                  <span className="text-[#00D632] font-black font-mono">$ Cash App</span>
                  <span>•</span>
                  <span className="text-[#635BFF] font-black">💳 Stripe</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Master Developer Elite Bypass Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white uppercase tracking-wider">Master Developer Elite Access</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black uppercase">Active</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Full unlimited access to Veo 3.1 video generation, Google Maps grounding, Gemini 3.7 Pro, and ad-free offline tools.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTier(SubscriptionTier.ELITE)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-all shadow-lg shrink-0 flex items-center gap-1.5"
          >
            <span>⚡</span>
            <span>{currentTier === SubscriptionTier.ELITE ? 'Elite Active' : 'Start Elite Access'}</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 items-center grayscale opacity-50">
            <span className="text-[10px] font-bold tracking-widest uppercase">Available on</span>
            <span className="text-xs font-black">PLAY STORE</span>
            <span className="text-xs font-black">GALAXY STORE</span>
            <span className="text-xs font-black">FIREFOX</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
              NO HIDDEN SETUP COSTS • CANCEL ANYTIME
            </p>
            <div className="flex gap-4">
              <a href="/privacy-policy.html" target="_blank" className="text-[9px] text-slate-600 hover:text-indigo-400 uppercase tracking-widest font-black transition-colors">Privacy Policy</a>
              <a href="/terms-of-service.html" target="_blank" className="text-[9px] text-slate-600 hover:text-indigo-400 uppercase tracking-widest font-black transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        {checkoutItem && (
          <PaymentModal
            item={checkoutItem}
            isOpen={Boolean(checkoutItem)}
            onClose={() => setCheckoutItem(null)}
            onSuccess={() => {
              if (checkoutItem.tier) {
                onSelectTier(checkoutItem.tier);
              }
              setCheckoutItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PricingModal;
