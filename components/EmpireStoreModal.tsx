import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import confetti from 'canvas-confetti';
import PaymentModal, { PaymentItem } from './PaymentModal';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: 'badge' | 'perk';
}

interface TokenBundle {
  id: string;
  name: string;
  tokens: number;
  price: number;
  formattedPrice: string;
  description: string;
  badge?: string;
  icon: string;
}

export const TOKEN_BUNDLES: TokenBundle[] = [
  { id: 'tokens_starter', name: 'Starter Pack', tokens: 500, price: 4.99, formattedPrice: '$4.99', description: '500 Grounded AI tokens for image generation and voice queries.', icon: '🪙' },
  { id: 'tokens_creator', name: 'Creator Bundle', tokens: 2000, price: 14.99, formattedPrice: '$14.99', description: '2,000 tokens (+25% bonus) for heavy model grounding & deep code scans.', badge: 'POPULAR', icon: '💎' },
  { id: 'tokens_empire', name: 'Empire Vault', tokens: 10000, price: 49.99, formattedPrice: '$49.99', description: '10,000 tokens (+50% bonus) for unlimited multi-app usage across the suite.', badge: 'BEST VALUE', icon: '👑' },
];

export const STORE_ITEMS: StoreItem[] = [
  { id: 'badge_pioneer', name: 'Pioneer Badge', description: 'Show you were here from the beginning.', cost: 50, icon: '🌟', type: 'badge' },
  { id: 'badge_builder', name: 'Empire Builder', description: 'A mark of true dedication to the Empire.', cost: 250, icon: '🏛️', type: 'badge' },
  { id: 'badge_legend', name: 'Legend Badge', description: 'Only for the most elite members.', cost: 1000, icon: '🐉', type: 'badge' },
  { id: 'perk_streak_repair', name: 'Streak Saver', description: 'Instantly adds +1 to your login streak.', cost: 300, icon: '🔥', type: 'perk' },
];

interface EmpireStoreModalProps {
  onClose: () => void;
}

const EmpireStoreModal: React.FC<EmpireStoreModalProps> = ({ onClose }) => {
  const { tokens, ownedItems, activeBadge, purchaseItem, equipBadge } = useUser();
  const [activeTab, setActiveTab] = useState<'badge' | 'perk' | 'tokens'>('badge');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [paymentItem, setPaymentItem] = useState<PaymentItem | null>(null);

  const handlePurchase = async (item: StoreItem) => {
    setPurchasingId(item.id);
    const success = await purchaseItem(item.id, item.cost, item.type);
    
    if (success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#3B82F6']
      });
    }
    setPurchasingId(null);
  };

  const filteredItems = (STORE_ITEMS || []).filter(item => item.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🛒</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Empire Store</h2>
              <p className="text-xs text-slate-400 font-medium">Spend tokens on cosmetics & perks</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-sm">🪙</span>
              <span className="text-sm font-black text-indigo-400">{tokens}</span>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
          <button 
            onClick={() => setActiveTab('badge')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'badge' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Profile Badges
          </button>
          <button 
            onClick={() => setActiveTab('perk')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'perk' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Time-Savers & Perks
          </button>
          <button 
            onClick={() => setActiveTab('tokens')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeTab === 'tokens' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <span>🪙</span>
            <span>Buy Tokens (Cash App / Stripe)</span>
          </button>
        </div>

        {/* Token Bundles View */}
        {activeTab === 'tokens' ? (
          <div className="space-y-4 overflow-y-auto custom-scrollbar pb-4 pr-2">
            <div className="p-3 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">$ Cash App</span>
                <span>•</span>
                <span className="text-indigo-400 font-bold">💳 Stripe</span>
                <span>Supported</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-black">INSTANT TOKEN DELIVERY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TOKEN_BUNDLES.map(bundle => (
                <div
                  key={bundle.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between relative transition-all"
                >
                  {bundle.badge && (
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                      {bundle.badge}
                    </span>
                  )}
                  <div>
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-2xl border border-slate-800 mb-3">
                      {bundle.icon}
                    </div>
                    <h3 className="text-base font-black text-white">{bundle.name}</h3>
                    <div className="flex items-baseline gap-1 my-1">
                      <span className="text-2xl font-black text-emerald-400">{bundle.formattedPrice}</span>
                      <span className="text-xs text-slate-400">/ one-time</span>
                    </div>
                    <div className="text-xs font-mono text-indigo-400 font-bold mb-2">
                      +{bundle.tokens.toLocaleString()} Tokens
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{bundle.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      setPaymentItem({
                        id: bundle.id,
                        name: `${bundle.name} (${bundle.tokens.toLocaleString()} Tokens)`,
                        amount: bundle.price,
                        formattedPrice: bundle.formattedPrice,
                        type: 'tokens',
                        tokenCount: bundle.tokens,
                        description: bundle.description,
                      });
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    Buy via Cash App / Stripe
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Badges and Perks Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-4 pr-2">
            {filteredItems.map(item => {
              const currentOwned = ownedItems || [];
              const isOwned = item.type === 'badge' && currentOwned.includes(item.id);
              const isEquipped = activeBadge === item.id;
              const canAfford = tokens >= item.cost;
              const isProcessing = purchasingId === item.id;

              return (
                <div key={item.id} className={`bg-slate-950/50 border rounded-2xl p-4 flex flex-col transition-all ${
                  isEquipped ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-slate-800 hover:border-slate-700'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-2xl border border-slate-800">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-white">{item.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/50">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">🪙</span>
                      <span className={`text-sm font-black ${canAfford || isOwned ? 'text-indigo-400' : 'text-red-400'}`}>
                        {item.cost}
                      </span>
                    </div>

                    {isOwned ? (
                      <button 
                        onClick={() => equipBadge(item.id)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          isEquipped 
                            ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : 'Equip'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford || isProcessing}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                      >
                        {isProcessing ? 'Processing...' : 'Purchase'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paymentItem && (
          <PaymentModal
            item={paymentItem}
            isOpen={Boolean(paymentItem)}
            onClose={() => setPaymentItem(null)}
            onSuccess={() => setPaymentItem(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EmpireStoreModal;
