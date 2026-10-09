
import React from 'react';
import { analytics, logEvent } from '../services/firebase';

const AffiliateSection: React.FC = () => {
  const openAffiliateLink = () => {
    // Replace with your actual affiliate URL (Amazon, LegalZoom, etc.)
    const affiliateURL = import.meta.env.VITE_AFFILIATE_URL || "https://your-affiliate-link-here.com";
    
    // Track the click in Firebase Analytics before redirecting
    if (analytics) {
      logEvent(analytics, 'affiliate_click', {
        app_type: 'law_medical_empire',
        project_id: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'donss-new-empire--250221-84f89'
      });
    }
    
    window.open(affiliateURL, '_blank');
  };

  return (
    <div id="affiliate-section" className="text-center my-5 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50 backdrop-blur-md">
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Empire Resources</h3>
      <button 
        id="monetize-btn" 
        onClick={openAffiliateLink} 
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
      >
        🚀 ACCESS PREMIUM RESOURCES
      </button>
      <p className="mt-3 text-[10px] text-slate-500 italic">
        Curated tools to scale your legal & medical empire.
      </p>
    </div>
  );
};

export default AffiliateSection;
