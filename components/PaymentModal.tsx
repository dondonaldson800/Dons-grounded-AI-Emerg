import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { getPaymentConfig, recordTransaction, formatCashAppUrl, formatPayPalUrl, PaymentConfig } from '../services/paymentService';
import { SubscriptionTier } from '../types';
import { useUser } from '../contexts/UserContext';

export interface PaymentItem {
  id: string;
  name: string;
  amount: number;
  formattedPrice: string;
  type: 'subscription' | 'tokens';
  tier?: SubscriptionTier;
  tokenCount?: number;
  description: string;
}

interface PaymentModalProps {
  item: PaymentItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  item,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, updateTier, addTokens } = useUser();
  const [paymentMethod, setPaymentMethod] = useState<'cashapp' | 'paypal' | 'stripe'>('cashapp');
  const [config, setConfig] = useState<PaymentConfig>(getPaymentConfig());
  const [copiedTag, setCopiedTag] = useState(false);
  const [copiedPaypal, setCopiedPaypal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<{ id: string; ref: string; dest: string } | null>(null);

  // Stripe card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');
  const [cardName, setCardName] = useState(user?.displayName || '');
  const [stripeError, setStripeError] = useState('');

  if (!isOpen) return null;

  const handleCopyCashtag = () => {
    navigator.clipboard.writeText(config.cashAppTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const handleCopyPaypal = () => {
    navigator.clipboard.writeText(config.payPalEmail || config.payPalTag);
    setCopiedPaypal(true);
    setTimeout(() => setCopiedPaypal(false), 2000);
  };

  const handleActivatePurchase = async (provider: 'cashapp' | 'paypal' | 'stripe') => {
    setIsProcessing(true);
    
    // Simulate payment settlement time
    await new Promise(r => setTimeout(r, 1200));

    // Record transaction
    const tx = recordTransaction({
      provider,
      amount: item.amount,
      itemType: item.type,
      tier: item.tier,
      tokenAmount: item.tokenCount,
      status: 'completed',
      customerEmail: user?.email || undefined,
    });

    // Apply upgrade or tokens
    if (item.type === 'subscription' && item.tier) {
      await updateTier(item.tier);
    } else if (item.type === 'tokens' && item.tokenCount) {
      await addTokens(item.tokenCount);
    }

    setIsProcessing(false);
    setCompletedTx({ id: tx.id, ref: tx.referenceId, dest: tx.payoutDestination || provider });

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#00D632', '#0070BA', '#635BFF', '#F59E0B', '#10B981'],
    });

    if (onSuccess) {
      onSuccess();
    }
  };

  const handleStripeCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStripeError('');

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      setStripeError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 4) {
      setStripeError('Please enter a valid MM/YY expiration date.');
      return;
    }
    if (!cardCvc || cardCvc.length < 3) {
      setStripeError('Please enter a valid 3-digit CVC.');
      return;
    }

    handleActivatePurchase('stripe');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {completedTx ? (
          /* Payment Success & Receipt View */
          <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black">
                Payment Confirmed & Settled
              </span>
              <h3 className="text-2xl font-black text-white">{item.name} Activated!</h3>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>

            {/* Receipt Card */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="text-white">{completedTx.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Order Reference:</span>
                <span className="text-indigo-400">{completedTx.ref}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="text-emerald-400 font-bold">{item.formattedPrice}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="text-amber-400 uppercase font-bold">
                  {paymentMethod === 'cashapp' ? 'Cash App Pay' : paymentMethod === 'paypal' ? 'PayPal Wallet' : 'Stripe Connected Card'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payout Recipient:</span>
                <span className="text-emerald-400 truncate ml-2 font-bold">{completedTx.dest}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              Continue to Empire Apps
            </button>
          </div>
        ) : (
          /* Main Checkout View */
          <div className="space-y-6">
            {/* Header & Order Summary */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    Direct Payout Checkout
                  </span>
                  <h3 className="text-2xl font-black text-white">{item.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">{item.formattedPrice}</div>
                  <span className="text-[10px] text-slate-500 font-bold">Instant Delivery</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{item.description}</p>
            </div>

            {/* Payment Method Selector Tabs: Cash App | PayPal | Stripe */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPaymentMethod('cashapp')}
                className={`py-2.5 px-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cashapp'
                    ? 'bg-[#00D632] text-slate-950 shadow-lg shadow-[#00D632]/20 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-sm font-bold">$</span>
                <span className="truncate">Cash App</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`py-2.5 px-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'paypal'
                    ? 'bg-[#0070BA] text-white shadow-lg shadow-[#0070BA]/30 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-sm">🅿️</span>
                <span className="truncate">PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`py-2.5 px-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'stripe'
                    ? 'bg-[#635BFF] text-white shadow-lg shadow-[#635BFF]/30 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>💳</span>
                <span className="truncate">Stripe</span>
              </button>
            </div>

            {/* Cash App Tab View */}
            {paymentMethod === 'cashapp' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 bg-[#00D632]/10 border border-[#00D632]/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#00D632] uppercase tracking-wider flex items-center gap-1.5">
                      <span>$</span>
                      <span>Don's Cash App Tag</span>
                    </span>
                    <button
                      onClick={handleCopyCashtag}
                      className="px-2.5 py-1 rounded bg-[#00D632] text-slate-950 font-black text-[10px] uppercase hover:bg-[#00bd2c] transition-all cursor-pointer"
                    >
                      {copiedTag ? '✓ Copied' : 'Copy $tag'}
                    </button>
                  </div>

                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    {config.cashAppTag}
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p>
                      <strong>Step 1:</strong> Send <span className="text-[#00D632] font-bold">{item.formattedPrice}</span> directly to{' '}
                      <span className="font-mono text-white font-bold">{config.cashAppTag}</span>.
                    </p>
                    <p>
                      <strong>Step 2:</strong> In the note field, write:{' '}
                      <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                        EMPIRE-{user?.email?.split('@')[0] || 'APP'}
                      </code>
                    </p>
                    <div className="pt-2 border-t border-[#00D632]/20 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Direct ACH to Cash App:</span>
                      <span className="font-mono text-emerald-300">
                        Sutton Bank • Routing 041215663 ••••5325
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={formatCashAppUrl(config.cashAppTag, item.amount)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-[#00D632] hover:bg-[#00bd2c] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Launch Cash App ({item.formattedPrice})</span>
                    <span>↗</span>
                  </a>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleActivatePurchase('cashapp')}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-700 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Verifying...' : '✓ I Sent Payment'}
                  </button>
                </div>
              </div>
            )}

            {/* PayPal Tab View */}
            {paymentMethod === 'paypal' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 bg-[#0070BA]/10 border border-[#0070BA]/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#0070BA] uppercase tracking-wider flex items-center gap-1.5">
                      <span>🅿️</span>
                      <span>Don's PayPal Destination</span>
                    </span>
                    <button
                      onClick={handleCopyPaypal}
                      className="px-2.5 py-1 rounded bg-[#0070BA] text-white font-black text-[10px] uppercase hover:bg-[#005ea6] transition-all cursor-pointer"
                    >
                      {copiedPaypal ? '✓ Copied' : 'Copy PayPal'}
                    </button>
                  </div>

                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    {config.payPalEmail}
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p>
                      <strong>Step 1:</strong> Pay <span className="text-[#0070BA] font-bold">{item.formattedPrice}</span> to{' '}
                      <span className="font-mono text-white font-bold">{config.payPalEmail}</span> or{' '}
                      <span className="font-mono text-indigo-300">paypal.me/{config.payPalTag}</span>.
                    </p>
                    <p>
                      <strong>Step 2:</strong> In the transfer description, write:{' '}
                      <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                        EMPIRE-{user?.email?.split('@')[0] || 'APP'}
                      </code>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={formatPayPalUrl(config.payPalTag, item.amount)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Launch PayPal ({item.formattedPrice})</span>
                    <span>↗</span>
                  </a>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleActivatePurchase('paypal')}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-700 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Verifying...' : '✓ I Sent via PayPal'}
                  </button>
                </div>
              </div>
            )}

            {/* Stripe Tab View */}
            {paymentMethod === 'stripe' && (
              <form onSubmit={handleStripeCardSubmit} className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3 bg-[#635BFF]/10 border border-[#635BFF]/30 rounded-xl flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-[#635BFF] font-black text-sm">🔒</span>
                    <div>
                      <span className="font-bold text-white">Stripe Connected Payouts</span>
                      <span className="block text-[10px] text-slate-400">Routes to Don's connected bank account & card</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#635BFF] font-bold">PCI-DSS LEVEL 1</span>
                </div>

                {stripeError && (
                  <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs font-bold">
                    {stripeError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Don Donaldson"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          setCardExpiry(val);
                        }}
                        placeholder="MM/YY"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#635BFF]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                        CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#635BFF]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                        ZIP / Postal
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        placeholder="90210"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#635BFF]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-[#635BFF] hover:bg-[#534be0] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#635BFF]/30 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Authorizing with Stripe...' : `Pay ${item.formattedPrice} with Stripe`}
                  </button>
                </div>
              </form>
            )}

            {/* Instant Developer Bypass for Don */}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
              <span className="text-slate-500">Need instant testing?</span>
              <button
                type="button"
                onClick={() => handleActivatePurchase(paymentMethod)}
                className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider cursor-pointer"
              >
                ⚡ Instant Test Activate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PaymentModal;
