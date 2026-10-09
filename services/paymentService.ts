// Payment service managing Cash App, PayPal, Stripe configurations and Direct Bank ACH Payouts

export interface BankPayoutDetails {
  routingNumber: string;
  accountNumberMasked: string;
  accountLast4: string;
  status: 'VERIFIED_ACTIVE' | 'PROCESSING';
  payoutSchedule: string;
  currency: string;
}

export interface PaymentConfig {
  cashAppTag: string; // e.g. $DonDonaldson800
  payPalTag: string; // e.g. dondonaldson800 for paypal.me/dondonaldson800
  payPalEmail: string; // e.g. dondonaldson800@gmail.com
  stripePublicKey: string; // e.g. pk_live_... or pk_test_...
  stripeAccountId?: string; // Stripe Connected Account ID e.g. acct_1DonDonaldsonEmpirePayouts
  stripePaymentLinkPro: string;
  stripePaymentLinkElite: string;
  stripePaymentLinkTokens: string;
  isStripeTestMode: boolean;
  stripeConnected: boolean;
  // Direct Bank Account Payout Destination (Cash App Sutton Bank Direct Deposit)
  bankName: string;
  bankRoutingNumber: string;
  bankAccountNumberMasked: string;
  bankAccountLast4: string;
  bankAccountFull: string;
  bankPayoutStatus: string;
  bankPayoutSchedule: string;
}

export interface PaymentTransaction {
  id: string;
  provider: 'cashapp' | 'paypal' | 'stripe';
  amount: number;
  itemType: 'subscription' | 'tokens';
  tier?: string;
  tokenAmount?: number;
  date: string;
  status: 'completed' | 'pending';
  customerEmail?: string;
  referenceId: string;
  payoutDestination?: string;
}

const DEFAULT_CONFIG: PaymentConfig = {
  cashAppTag: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CASHAPP_CASHTAG) || '$DonDonaldson800',
  payPalTag: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PAYPAL_TAG) || 'dondonaldson800',
  payPalEmail: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PAYPAL_EMAIL) || 'dondonaldson800@gmail.com',
  stripePublicKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRIPE_PUBLIC_KEY) || 'pk_live_51EmpireDon2026SecureGroundedAI',
  stripeAccountId: 'acct_1DonDonaldsonEmpirePayouts',
  stripePaymentLinkPro: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRIPE_PAYMENT_LINK_PRO) || 'https://buy.stripe.com/don_grounded_pro_monthly',
  stripePaymentLinkElite: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRIPE_PAYMENT_LINK_ELITE) || 'https://buy.stripe.com/don_grounded_elite_monthly',
  stripePaymentLinkTokens: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRIPE_PAYMENT_LINK_TOKENS) || 'https://buy.stripe.com/don_grounded_tokens_pack',
  isStripeTestMode: false,
  stripeConnected: true,
  // Don's verified Direct Deposit Banking Info (Cash App - Sutton Bank)
  bankName: 'Sutton Bank (Cash App Direct Deposit)',
  bankRoutingNumber: '041215663',
  bankAccountNumberMasked: '•••• •••• •••• 5325',
  bankAccountLast4: '5325',
  bankAccountFull: '1287680145325',
  bankPayoutStatus: 'VERIFIED_ACTIVE',
  bankPayoutSchedule: 'Instant Cash App Direct Deposit & ACH Settlement',
};

const STORAGE_KEY_CONFIG = 'dons_empire_payment_config';
const STORAGE_KEY_TXS = 'dons_empire_payment_transactions';

export function getPaymentConfig(): PaymentConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        cashAppTag: parsed.cashAppTag || DEFAULT_CONFIG.cashAppTag,
        payPalTag: parsed.payPalTag || DEFAULT_CONFIG.payPalTag,
        payPalEmail: parsed.payPalEmail || DEFAULT_CONFIG.payPalEmail,
        stripePublicKey: parsed.stripePublicKey || DEFAULT_CONFIG.stripePublicKey,
        stripeAccountId: parsed.stripeAccountId || DEFAULT_CONFIG.stripeAccountId,
        stripePaymentLinkPro: parsed.stripePaymentLinkPro || DEFAULT_CONFIG.stripePaymentLinkPro,
        stripePaymentLinkElite: parsed.stripePaymentLinkElite || DEFAULT_CONFIG.stripePaymentLinkElite,
        stripePaymentLinkTokens: parsed.stripePaymentLinkTokens || DEFAULT_CONFIG.stripePaymentLinkTokens,
        isStripeTestMode: Boolean(parsed.isStripeTestMode),
        stripeConnected: parsed.stripeConnected !== undefined ? Boolean(parsed.stripeConnected) : true,
        bankName: parsed.bankName || DEFAULT_CONFIG.bankName,
        bankRoutingNumber: parsed.bankRoutingNumber || DEFAULT_CONFIG.bankRoutingNumber,
        bankAccountNumberMasked: parsed.bankAccountNumberMasked || DEFAULT_CONFIG.bankAccountNumberMasked,
        bankAccountLast4: parsed.bankAccountLast4 || DEFAULT_CONFIG.bankAccountLast4,
        bankAccountFull: parsed.bankAccountFull || DEFAULT_CONFIG.bankAccountFull,
        bankPayoutStatus: parsed.bankPayoutStatus || DEFAULT_CONFIG.bankPayoutStatus,
        bankPayoutSchedule: parsed.bankPayoutSchedule || DEFAULT_CONFIG.bankPayoutSchedule,
      };
    }
  } catch (err) {
    console.warn('Failed to parse payment config', err);
  }
  return DEFAULT_CONFIG;
}

export function savePaymentConfig(config: Partial<PaymentConfig>): PaymentConfig {
  const current = getPaymentConfig();
  const updated: PaymentConfig = { ...current, ...config };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save payment config', err);
    }
  }
  return updated;
}

export function getTransactions(): PaymentTransaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load transactions', err);
  }
  return [];
}

export function recordTransaction(tx: Omit<PaymentTransaction, 'id' | 'date' | 'referenceId'>): PaymentTransaction {
  const cfg = getPaymentConfig();
  let payoutDestination = `ACH Direct Deposit (Routing: ${cfg.bankRoutingNumber} ••••${cfg.bankAccountLast4})`;
  if (tx.provider === 'cashapp') {
    payoutDestination = `Cash App (${cfg.cashAppTag}) ➔ Bank Direct Deposit (••••${cfg.bankAccountLast4})`;
  } else if (tx.provider === 'paypal') {
    payoutDestination = `PayPal (${cfg.payPalEmail}) ➔ ACH Transfer (••••${cfg.bankAccountLast4})`;
  } else if (tx.provider === 'stripe') {
    payoutDestination = `Stripe Payouts ➔ ACH Direct Deposit (Routing: ${cfg.bankRoutingNumber} ••••${cfg.bankAccountLast4})`;
  }

  const newTx: PaymentTransaction = {
    ...tx,
    id: `TX-${Date.now().toString(36).toUpperCase()}`,
    date: new Date().toISOString(),
    referenceId: `DON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    payoutDestination,
  };

  if (typeof window !== 'undefined') {
    try {
      const txs = getTransactions();
      const updated = [newTx, ...txs].slice(0, 50);
      localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to record transaction', err);
    }
  }

  return newTx;
}

export function formatCashAppUrl(tag: string, amount?: number): string {
  const cleanTag = tag.replace('$', '').trim();
  if (amount && amount > 0) {
    return `https://cash.app/$${cleanTag}/${amount}`;
  }
  return `https://cash.app/$${cleanTag}`;
}

export function formatPayPalUrl(tagOrEmail: string, amount?: number): string {
  const clean = tagOrEmail.replace('@', '').replace('https://paypal.me/', '').trim();
  if (clean.includes('.')) {
    return `https://paypal.me/${clean.split('.')[0]}/${amount || ''}`;
  }
  if (amount && amount > 0) {
    return `https://paypal.me/${clean}/${amount}`;
  }
  return `https://paypal.me/${clean}`;
}
