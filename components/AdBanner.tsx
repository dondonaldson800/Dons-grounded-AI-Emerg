import React, { useState, useEffect } from 'react';
import { SubscriptionTier } from '../types';

export interface AdProps {
  appKey?: string;
  appName?: string;
  tier?: SubscriptionTier;
  slot?: 'banner_top' | 'banner_bottom' | 'inline' | 'interstitial';
  onAdClosed?: () => void;
}

interface AdCreative {
  title: string;
  sponsor: string;
  body: string;
  cta: string;
  link: string;
  tag: string;
  category: string;
  badge: string;
}

// Targeted sponsors mapped by app industry
const TARGETED_ADS: Record<string, AdCreative[]> = {
  law: [
    {
      title: 'Protect Your Business with LegalShield',
      sponsor: 'LegalShield Corporate',
      body: 'Dedicated attorney consultations, contract reviews, and 24/7 emergency legal access starting at $29.95/mo.',
      cta: 'Claim Free Legal Audit',
      link: 'https://www.legalshield.com',
      tag: 'Legal Shield',
      category: 'Legal Services',
      badge: 'SPONSORED'
    },
    {
      title: 'Fast LLC & Trademark Registration',
      sponsor: 'LegalZoom Pro',
      body: 'Form your corporate entity with guaranteed accuracy and registered agent compliance in all 50 states.',
      cta: 'Start Filing ($0 + State Fee)',
      link: 'https://www.legalzoom.com',
      tag: 'Corporate Formation',
      category: 'Business Services',
      badge: 'ADVERTISEMENT'
    }
  ],
  medical: [
    {
      title: 'Same-Day Virtual Doctor & Prescription Refill',
      sponsor: 'Teladoc Health Network',
      body: 'Board-certified physicians available 24/7 on your phone with zero waiting rooms. Covered by major insurance.',
      cta: 'Book 5-Min Telehealth Visit',
      link: 'https://www.teladoc.com',
      tag: 'Telehealth',
      category: 'Clinical Health',
      badge: 'SPONSORED'
    },
    {
      title: 'Comprehensive At-Home Biomarker Blood Panel',
      sponsor: 'LetsGetChecked Labs',
      body: 'Test hormone levels, thyroid, cholesterol, and nutrient deficiencies with CLIA-certified home lab kits.',
      cta: 'Order At-Home Kit (20% Off)',
      link: 'https://www.letsgetchecked.com',
      tag: 'Diagnostics',
      category: 'Preventative Medicine',
      badge: 'ADVERTISEMENT'
    }
  ],
  personal_injury: [
    {
      title: 'Free Accident & Injury Case Evaluation',
      sponsor: 'National Injury Attorneys Network',
      body: 'Injured in an auto or workplace accident? No fee unless you win. Average settlements up to 3.5x initial offers.',
      cta: 'Check Claim Payout Value',
      link: 'https://www.findlaw.com',
      tag: 'Injury Law',
      category: 'Legal Settlements',
      badge: 'SPONSORED'
    },
    {
      title: 'Pre-Settlement Lawsuit Cash Advance',
      sponsor: 'Oasis Financial Funding',
      body: 'Get approved for emergency non-recourse funding against your pending personal injury settlement within 24 hours.',
      cta: 'Get Cash in 24 Hours',
      link: 'https://www.oasisfinancial.com',
      tag: 'Litigation Finance',
      category: 'Financial Assistance',
      badge: 'ADVERTISEMENT'
    }
  ],
  real_estate: [
    {
      title: 'Get Today’s Lowest Mortgage & Refinance Rates',
      sponsor: 'LendingTree Mortgages',
      body: 'Compare live offers from top 5 national lenders in under 2 minutes with no impact on your credit score.',
      cta: 'View Live Today’s Rates',
      link: 'https://www.lendingtree.com',
      tag: 'Lending Rates',
      category: 'Mortgage Lending',
      badge: 'SPONSORED'
    },
    {
      title: 'Off-Market Multifamily & Residential Deal Finder',
      sponsor: 'DealMachine Pro',
      body: 'Uncover distressed properties, absentee owners, and high cap-rate rental deals with automated skip tracing.',
      cta: 'Start 7-Day Free Trial',
      link: 'https://www.dealmachine.com',
      tag: 'Property Intelligence',
      category: 'Real Estate Software',
      badge: 'ADVERTISEMENT'
    }
  ],
  finance: [
    {
      title: 'High-Yield Cash Account: Earn 5.15% APY',
      sponsor: 'Wealthfront Cash',
      body: 'Up to $8M in FDIC insurance through partner banks with unlimited free transfers and zero monthly advisory fees.',
      cta: 'Open Account & Earn 5.15%',
      link: 'https://www.wealthfront.com',
      tag: 'Cash Management',
      category: 'High-Yield Wealth',
      badge: 'SPONSORED'
    },
    {
      title: 'Automated Commission-Free Robo-Investing',
      sponsor: 'M1 Finance Super App',
      body: 'Build custom pies of stocks and ETFs with automated dividend reinvestment and low-cost portfolio margin lines.',
      cta: 'Claim $50 Sign-Up Bonus',
      link: 'https://www.m1.com',
      tag: 'Asset Growth',
      category: 'Investment Portfolio',
      badge: 'ADVERTISEMENT'
    }
  ]
};

const DEFAULT_ADS: AdCreative[] = [
  {
    title: 'Google AdSense / AdMob Mobile Network',
    sponsor: 'Google Ad Network',
    body: 'High-converting relevant advertisements served dynamically on Android, Amazon Fire OS, and Samsung Galaxy devices.',
    cta: 'Learn More',
    link: 'https://ads.google.com',
    tag: 'AdMob Certified',
    category: 'Digital Ads',
    badge: 'ADVERTISEMENT'
  }
];

export const AdBanner: React.FC<AdProps> = ({
  appKey = 'law',
  tier = SubscriptionTier.FREE,
  slot = 'banner_bottom'
}) => {
  // Free users always see ads. Pro/Elite users get an ad-free experience unless in preview
  const [dismissed, setDismissed] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  const adList = TARGETED_ADS[appKey] || DEFAULT_ADS;
  const currentAd = adList[adIndex % adList.length];

  // Rotate ads every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex(prev => (prev + 1) % adList.length);
    }, 20000);
    return () => clearInterval(timer);
  }, [adList.length]);

  if (dismissed) return null;

  return (
    <div className={`w-full bg-slate-950/95 border border-slate-800 text-slate-200 transition-all ${
      slot === 'banner_bottom' 
        ? 'border-t shadow-2xl relative z-30 px-3 py-2 sm:px-4 sm:py-2.5'
        : 'rounded-xl border shadow-lg my-2 px-3 py-2'
    }`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Ad Tag & Creative info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex flex-col items-center justify-center shrink-0">
            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {currentAd.badge}
            </span>
            <span className="text-[7px] text-slate-500 font-mono mt-0.5 hidden sm:block">AdMob/Native</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white truncate hover:text-indigo-300">
                {currentAd.title}
              </span>
              <span className="text-[10px] text-slate-400 hidden md:inline truncate">
                • {currentAd.sponsor}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 hidden sm:block leading-tight">
              {currentAd.body}
            </p>
          </div>
        </div>

        {/* CTA Button and Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={currentAd.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-md shadow-indigo-600/20 whitespace-nowrap"
          >
            <span>{currentAd.cta}</span>
            <span className="text-[10px]">↗</span>
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-500 hover:text-slate-300 p-1 text-xs rounded hover:bg-slate-800 transition-all"
            title="Hide Ad for this session"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export const InterstitialAdModal: React.FC<{
  isOpen: boolean;
  appKey?: string;
  onClose: () => void;
}> = ({ isOpen, appKey = 'law', onClose }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const adList = TARGETED_ADS[appKey] || DEFAULT_ADS;
  const ad = adList[0];

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(4);
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(s => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {ad.badge} • SPONSORED BREAK
          </span>
          <button
            disabled={secondsRemaining > 0}
            onClick={onClose}
            className={`text-xs px-2.5 py-1 rounded-lg font-black transition-all ${
              secondsRemaining > 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {secondsRemaining > 0 ? `Skip in ${secondsRemaining}s` : 'Skip ✕'}
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">{ad.category}</div>
          <h3 className="text-lg font-black text-white">{ad.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{ad.body}</p>
        </div>

        <div className="pt-2">
          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <span>{ad.cta}</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
};
