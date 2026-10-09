// Master SKU, In-App Purchase & Store Billing Configuration Service
// Formatted strictly to comply with Google Play Console, Apple App Store, Amazon Appstore, and Samsung Galaxy Store.

export interface StoreProductSKU {
  id: string;
  name: string;
  type: 'subscription' | 'inapp_consumable' | 'inapp_nonconsumable';
  priceUsd: number;
  formattedPrice: string;
  billingPeriod?: 'monthly' | 'annual';
  // Store-specific identifiers
  googlePlaySku: string;
  googlePlayBasePlanId?: string;
  appleProductId: string;
  appleAppSku: string;
  amazonSku: string;
  samsungItemId: string;
  // Descriptions
  title: string;
  description: string;
  freeTrialDays?: number;
  gracePeriodDays?: number;
}

export interface AppStoreSkuCollection {
  appKey: string;
  appName: string;
  appTitle: string;
  packageName: string;
  category: string;
  products: StoreProductSKU[];
}

// 1. MASTER SUITE (DON'S GROUNDED AI EMPIRE - 20-IN-1)
export const MASTER_SUITE_SKUS: StoreProductSKU[] = [
  {
    id: 'sub_pro_monthly',
    name: 'Power User Pro (Monthly)',
    type: 'subscription',
    priceUsd: 9.99,
    formattedPrice: '$9.99/month',
    billingPeriod: 'monthly',
    googlePlaySku: 'dons_empire_pro_monthly',
    googlePlayBasePlanId: 'pro-monthly-base',
    appleProductId: 'com.donsempire.groundedai.pro.monthly',
    appleAppSku: 'DONS_EMPIRE_2026',
    amazonSku: 'dons_empire_pro_monthly',
    samsungItemId: 'dons_pro_month',
    title: "Pro Subscription - Don's Grounded AI Empire",
    description: "Unlock deep thinking mode, real-time Google search grounding, and unlimited professional multi-tool access.",
    freeTrialDays: 7,
    gracePeriodDays: 16
  },
  {
    id: 'sub_elite_monthly',
    name: 'Infinite Creator Elite (Monthly)',
    type: 'subscription',
    priceUsd: 24.99,
    formattedPrice: '$24.99/month',
    billingPeriod: 'monthly',
    googlePlaySku: 'dons_empire_elite_monthly',
    googlePlayBasePlanId: 'elite-monthly-base',
    appleProductId: 'com.donsempire.groundedai.elite.monthly',
    appleAppSku: 'DONS_EMPIRE_2026',
    amazonSku: 'dons_empire_elite_monthly',
    samsungItemId: 'dons_elite_month',
    title: "Elite VIP Subscription - Don's Grounded AI Empire",
    description: "All 20 domain tools, Veo video generation, Google Maps grounding, multi-speaker voice synthesis, and ad-free offline access.",
    freeTrialDays: 3,
    gracePeriodDays: 16
  },
  {
    id: 'sub_pro_annual',
    name: 'Power User Pro (Annual Pass - 20% Off)',
    type: 'subscription',
    priceUsd: 95.99,
    formattedPrice: '$95.99/year',
    billingPeriod: 'annual',
    googlePlaySku: 'dons_empire_pro_annual',
    googlePlayBasePlanId: 'pro-annual-save20',
    appleProductId: 'com.donsempire.groundedai.pro.annual',
    appleAppSku: 'DONS_EMPIRE_2026',
    amazonSku: 'dons_empire_pro_annual',
    samsungItemId: 'dons_pro_annual',
    title: "Annual Pro Pass - Don's Grounded AI Empire",
    description: "Save 20% with a full year of unlimited grounded AI access across all platforms.",
    freeTrialDays: 7,
    gracePeriodDays: 16
  },
  {
    id: 'token_starter_500',
    name: 'Starter Token Pack (500 Tokens)',
    type: 'inapp_consumable',
    priceUsd: 4.99,
    formattedPrice: '$4.99',
    googlePlaySku: 'dons_tokens_starter_500',
    appleProductId: 'com.donsempire.groundedai.tokens.500',
    appleAppSku: 'DONS_EMPIRE_2026',
    amazonSku: 'dons_tokens_starter_500',
    samsungItemId: 'dons_tok_500',
    title: "500 Empire Tokens",
    description: "500 Grounded AI tokens for high-resolution image synthesis and voice interactions."
  },
  {
    id: 'token_creator_2000',
    name: 'Creator Token Pack (2,000 Tokens)',
    type: 'inapp_consumable',
    priceUsd: 14.99,
    formattedPrice: '$14.99',
    googlePlaySku: 'dons_tokens_creator_2000',
    appleProductId: 'com.donsempire.groundedai.tokens.2000',
    appleAppSku: 'DONS_EMPIRE_2026',
    amazonSku: 'dons_tokens_creator_2000',
    samsungItemId: 'dons_tok_2000',
    title: "2,000 Empire Tokens (+25% Bonus)",
    description: "2,000 Grounded AI tokens with bonus credits for complex coding audits and calculations."
  },
  {
    id: 'token_vault_10000',
    name: 'Empire Vault (10,000 Tokens)',
    type: 'inapp_consumable',
    priceUsd: 49.99,
    formattedPrice: '$49.99',
    googlePlaySku: 'dons_tokens_vault_10000',
    appleProductId: 'com.donsempire.groundedai.tokens.10000',
    appleAppSku: 'DONS_EMPIRE_2026',
    amazonSku: 'dons_tokens_vault_10000',
    samsungItemId: 'dons_tok_10000',
    title: "10,000 Empire Vault Tokens (+50% Bonus)",
    description: "Maximum value token vault for power users and enterprise multi-tool automation."
  }
];

// 2. THE FIRST 6 STANDALONE APPS REQUESTED BY USER
// 1 = General, 2 & 3 = Medical, 4 = Non-profit, 5 & 6 = Law
export const STANDALONE_APPS_SKU_REGISTRY: AppStoreSkuCollection[] = [
  {
    appKey: 'general',
    appName: 'OmniAssist',
    appTitle: 'OmniAssist - General AI & Multi-Task Suite',
    packageName: 'com.omniassist.general.app',
    category: 'Productivity',
    products: [
      {
        id: 'omni_monthly',
        name: 'OmniAssist Pro (Monthly)',
        type: 'subscription',
        priceUsd: 9.99,
        formattedPrice: '$9.99/mo',
        billingPeriod: 'monthly',
        googlePlaySku: 'omniassist_general_monthly',
        googlePlayBasePlanId: 'omni-monthly-base',
        appleProductId: 'com.omniassist.general.pro.monthly',
        appleAppSku: 'OMNIASSIST_APP_01',
        amazonSku: 'omniassist_general_monthly',
        samsungItemId: 'omni_pro_month',
        title: 'OmniAssist Pro Monthly Access',
        description: 'Unlimited task breakdown, reasoning, and daily multi-task workflows.'
      },
      {
        id: 'omni_annual',
        name: 'OmniAssist Pro (Annual Pass)',
        type: 'subscription',
        priceUsd: 79.99,
        formattedPrice: '$79.99/yr',
        billingPeriod: 'annual',
        googlePlaySku: 'omniassist_general_annual',
        googlePlayBasePlanId: 'omni-annual-base',
        appleProductId: 'com.omniassist.general.pro.annual',
        appleAppSku: 'OMNIASSIST_APP_01',
        amazonSku: 'omniassist_general_annual',
        samsungItemId: 'omni_pro_annual',
        title: 'OmniAssist Pro Annual Pass',
        description: 'Year-round access to the full OmniAssist general productivity suite.'
      }
    ]
  },
  {
    appKey: 'medical',
    appName: 'VitalTriage',
    appTitle: 'VitalTriage - Symptom & Interaction Screener',
    packageName: 'com.vitaltriage.health.app',
    category: 'Medical / Health & Fitness',
    products: [
      {
        id: 'vital_monthly',
        name: 'VitalTriage Clinical (Monthly)',
        type: 'subscription',
        priceUsd: 14.99,
        formattedPrice: '$14.99/mo',
        billingPeriod: 'monthly',
        googlePlaySku: 'vitaltriage_clinical_monthly',
        googlePlayBasePlanId: 'vital-monthly-base',
        appleProductId: 'com.vitaltriage.health.clinical.monthly',
        appleAppSku: 'VITALTRIAGE_APP_02',
        amazonSku: 'vitaltriage_clinical_monthly',
        samsungItemId: 'vital_clin_month',
        title: 'VitalTriage Clinical Access',
        description: 'Drug interaction screening, symptom stage evaluation, and clinical research data.'
      },
      {
        id: 'vital_annual',
        name: 'VitalTriage Clinical (Annual Pass)',
        type: 'subscription',
        priceUsd: 99.99,
        formattedPrice: '$99.99/yr',
        billingPeriod: 'annual',
        googlePlaySku: 'vitaltriage_clinical_annual',
        googlePlayBasePlanId: 'vital-annual-base',
        appleProductId: 'com.vitaltriage.health.clinical.annual',
        appleAppSku: 'VITALTRIAGE_APP_02',
        amazonSku: 'vitaltriage_clinical_annual',
        samsungItemId: 'vital_clin_annual',
        title: 'VitalTriage Clinical Annual Pass',
        description: 'Full year of unlimited clinical screening and drug interaction audits.'
      }
    ]
  },
  {
    appKey: 'medical_care',
    appName: 'MedCare Pro',
    appTitle: 'MedCare Pro - Diagnostic Triage & Emergency Care',
    packageName: 'com.medcarepro.clinical.app',
    category: 'Medical / Health & Fitness',
    products: [
      {
        id: 'medcare_monthly',
        name: 'MedCare Pro Emergency Protocols (Monthly)',
        type: 'subscription',
        priceUsd: 19.99,
        formattedPrice: '$19.99/mo',
        billingPeriod: 'monthly',
        googlePlaySku: 'medcarepro_emergency_monthly',
        googlePlayBasePlanId: 'medcare-monthly-base',
        appleProductId: 'com.medcarepro.clinical.emergency.monthly',
        appleAppSku: 'MEDCAREPRO_APP_03',
        amazonSku: 'medcarepro_emergency_monthly',
        samsungItemId: 'medcare_em_month',
        title: 'MedCare Pro Protocol Subscription',
        description: 'Full emergency care triage scores, vital signs calculators, and diagnostic benchmarks.'
      },
      {
        id: 'medcare_annual',
        name: 'MedCare Pro Emergency Protocols (Annual Pass)',
        type: 'subscription',
        priceUsd: 149.99,
        formattedPrice: '$149.99/yr',
        billingPeriod: 'annual',
        googlePlaySku: 'medcarepro_emergency_annual',
        googlePlayBasePlanId: 'medcare-annual-base',
        appleProductId: 'com.medcarepro.clinical.emergency.annual',
        appleAppSku: 'MEDCAREPRO_APP_03',
        amazonSku: 'medcarepro_emergency_annual',
        samsungItemId: 'medcare_em_annual',
        title: 'MedCare Pro Annual Protocol Pass',
        description: 'Yearly access to emergency diagnostic calculators and triage matrices.'
      }
    ]
  },
  {
    appKey: 'nonprofit',
    appName: 'CausePilot',
    appTitle: 'CausePilot - Non-Profit Grants & 501(c)(3) Navigator',
    packageName: 'com.causepilot.nonprofit.app',
    category: 'Business / Finance',
    products: [
      {
        id: 'cause_monthly',
        name: 'CausePilot Navigator (Monthly)',
        type: 'subscription',
        priceUsd: 19.99,
        formattedPrice: '$19.99/mo',
        billingPeriod: 'monthly',
        googlePlaySku: 'causepilot_grant_monthly',
        googlePlayBasePlanId: 'cause-monthly-base',
        appleProductId: 'com.causepilot.nonprofit.grant.monthly',
        appleAppSku: 'CAUSEPILOT_APP_04',
        amazonSku: 'causepilot_grant_monthly',
        samsungItemId: 'cause_nav_month',
        title: 'CausePilot Non-Profit Navigator',
        description: '501(c)(3) compliance audits, grant drafting formulas, and fundraising ROI calculators.'
      },
      {
        id: 'cause_annual',
        name: 'CausePilot Navigator (Annual Pass)',
        type: 'subscription',
        priceUsd: 149.99,
        formattedPrice: '$149.99/yr',
        billingPeriod: 'annual',
        googlePlaySku: 'causepilot_grant_annual',
        googlePlayBasePlanId: 'cause-annual-base',
        appleProductId: 'com.causepilot.nonprofit.grant.annual',
        appleAppSku: 'CAUSEPILOT_APP_04',
        amazonSku: 'causepilot_grant_annual',
        samsungItemId: 'cause_nav_annual',
        title: 'CausePilot Annual Non-Profit Pass',
        description: 'Unlimited annual access to grant generator and donor impact forecasting.'
      }
    ]
  },
  {
    appKey: 'law',
    appName: 'ClauseGuard',
    appTitle: 'ClauseGuard - Legal Contract & NDA Auditor',
    packageName: 'com.clauseguard.legal.app',
    category: 'Business / Legal',
    products: [
      {
        id: 'clause_monthly',
        name: 'ClauseGuard Statute Auditor (Monthly)',
        type: 'subscription',
        priceUsd: 19.99,
        formattedPrice: '$19.99/mo',
        billingPeriod: 'monthly',
        googlePlaySku: 'clauseguard_contract_monthly',
        googlePlayBasePlanId: 'clause-monthly-base',
        appleProductId: 'com.clauseguard.legal.contract.monthly',
        appleAppSku: 'CLAUSEGUARD_APP_05',
        amazonSku: 'clauseguard_contract_monthly',
        samsungItemId: 'clause_st_month',
        title: 'ClauseGuard Statute Auditor Monthly',
        description: 'Contract risk analysis, indemnification clause reviews, and NDA generator.'
      },
      {
        id: 'clause_annual',
        name: 'ClauseGuard Statute Auditor (Annual Pass)',
        type: 'subscription',
        priceUsd: 149.99,
        formattedPrice: '$149.99/yr',
        billingPeriod: 'annual',
        googlePlaySku: 'clauseguard_contract_annual',
        googlePlayBasePlanId: 'clause-annual-base',
        appleProductId: 'com.clauseguard.legal.contract.annual',
        appleAppSku: 'CLAUSEGUARD_APP_05',
        amazonSku: 'clauseguard_contract_annual',
        samsungItemId: 'clause_st_annual',
        title: 'ClauseGuard Annual Legal Pass',
        description: 'Year-round access to contract drafting templates and statutory risk scoring.'
      }
    ]
  },
  {
    appKey: 'personal_injury',
    appName: 'ClaimValuator',
    appTitle: 'ClaimValuator - Auto & Injury Settlement Multiplier',
    packageName: 'com.claimvaluator.settlement.app',
    category: 'Finance / Legal',
    products: [
      {
        id: 'claim_monthly',
        name: 'ClaimValuator Settlement Multiplier (Monthly)',
        type: 'subscription',
        priceUsd: 24.99,
        formattedPrice: '$24.99/mo',
        billingPeriod: 'monthly',
        googlePlaySku: 'claimvaluator_injury_monthly',
        googlePlayBasePlanId: 'claim-monthly-base',
        appleProductId: 'com.claimvaluator.settlement.injury.monthly',
        appleAppSku: 'CLAIMVALUATOR_APP_06',
        amazonSku: 'claimvaluator_injury_monthly',
        samsungItemId: 'claim_val_month',
        title: 'ClaimValuator Settlement Multiplier',
        description: 'Pain-and-suffering multipliers (1.5x-5.0x), special damages calculator, and demand letters.'
      },
      {
        id: 'claim_annual',
        name: 'ClaimValuator Settlement Multiplier (Annual Pass)',
        type: 'subscription',
        priceUsd: 199.99,
        formattedPrice: '$199.99/yr',
        billingPeriod: 'annual',
        googlePlaySku: 'claimvaluator_injury_annual',
        googlePlayBasePlanId: 'claim-annual-base',
        appleProductId: 'com.claimvaluator.settlement.injury.annual',
        appleAppSku: 'CLAIMVALUATOR_APP_06',
        amazonSku: 'claimvaluator_injury_annual',
        samsungItemId: 'claim_val_annual',
        title: 'ClaimValuator Annual Multiplier Pass',
        description: 'Annual unlimited case evaluations, litigation damages worksheets, and demand drafting.'
      }
    ]
  }
];

// SKU VALIDATION UTILITY
// Explains why a user might see "SKU not right" in Google Play / Apple / Amazon
export interface SkuValidationResult {
  isValid: boolean;
  store: 'google_play' | 'apple' | 'amazon' | 'samsung';
  normalizedSku: string;
  errors: string[];
  recommendations: string[];
}

export function validateStoreSku(rawSku: string, store: 'google_play' | 'apple' | 'amazon' | 'samsung'): SkuValidationResult {
  const errors: string[] = [];
  const recommendations: string[] = [];
  const trimmed = rawSku.trim();

  if (!trimmed) {
    return {
      isValid: false,
      store,
      normalizedSku: '',
      errors: ['SKU cannot be empty.'],
      recommendations: ['Provide a lowercase identifier, e.g. "dons_empire_pro_monthly".']
    };
  }

  // Google Play Console Validation Rules
  if (store === 'google_play') {
    if (/[A-Z]/.test(trimmed)) {
      errors.push('Contains uppercase letters. Google Play Console forbids uppercase in Product IDs / SKUs.');
      recommendations.push('Convert all uppercase letters to lowercase.');
    }
    if (/\s/.test(trimmed)) {
      errors.push('Contains whitespace spaces. Google Play Console forbids spaces.');
      recommendations.push('Replace spaces with underscores (_).');
    }
    if (/-/.test(trimmed)) {
      errors.push('Contains hyphens (-). In Google Play In-App Product IDs, hyphens are disallowed (use underscores _ or dots .).');
      recommendations.push('Replace hyphens with underscores (_). Note: Hyphens are only allowed in Base Plan IDs, not Product IDs.');
    }
    if (!/^[a-z0-9]/.test(trimmed.toLowerCase())) {
      errors.push('Must start with a lowercase letter or number.');
    }
    if (trimmed.length > 40) {
      errors.push(`Length is ${trimmed.length} characters (maximum allowed in Google Play is 40).`);
      recommendations.push('Shorten SKU to under 40 characters.');
    }
    if (!/^[a-z0-9._]+$/.test(trimmed.toLowerCase())) {
      errors.push('Contains invalid characters. Only lowercase letters (a-z), numbers (0-9), underscores (_), and dots (.) are allowed.');
    }
  }

  // Apple App Store Connect Validation Rules
  if (store === 'apple') {
    if (/\s/.test(trimmed)) {
      errors.push('Contains whitespace spaces. Apple App Store Connect forbids spaces in Product IDs.');
      recommendations.push('Replace spaces with dots (.) or underscores (_).');
    }
    if (trimmed.length > 100) {
      errors.push('Length exceeds 100 characters.');
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) {
      errors.push('Contains invalid characters for Apple Product ID.');
    }
  }

  // Amazon Appstore Validation Rules
  if (store === 'amazon') {
    if (/\s/.test(trimmed)) {
      errors.push('Contains whitespace spaces. Amazon Appstore forbids spaces in IAP SKUs.');
    }
    if (trimmed.length > 150) {
      errors.push('Length exceeds 150 characters.');
    }
  }

  // Auto-Normalize SKU
  let normalized = trimmed
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9._]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[^a-z0-9]+/, '')
    .slice(0, 40);

  return {
    isValid: errors.length === 0,
    store,
    normalizedSku: normalized,
    errors,
    recommendations
  };
}

// "THE OTHER" - COMPLETE STORE SUBMISSION METADATA COMPLIANCE PACK
export const STORE_COMPLIANCE_AND_OTHER_REQUIREMENTS = {
  packageIdentifiers: {
    masterApp: 'com.donsempire.groundedai',
    app1General: 'com.omniassist.general.app',
    app2MedicalTriage: 'com.vitaltriage.health.app',
    app3MedicalCare: 'com.medcarepro.clinical.app',
    app4NonProfit: 'com.causepilot.nonprofit.app',
    app5LawContracts: 'com.clauseguard.legal.app',
    app6LawSettlement: 'com.claimvaluator.settlement.app'
  },
  legalUrls: {
    privacyPolicy: 'https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app/privacy-policy.html',
    termsOfService: 'https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app/terms-of-service.html',
    appAdsTxt: 'https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app/app-ads.txt'
  },
  dataSafetyAnswers: {
    dataCollected: 'No sensitive personal data collected without consent. Only anonymous usage diagnostics and user-authenticated email.',
    dataEncryptedInTransit: 'Yes (100% HTTPS TLS 1.3 encryption)',
    canUserRequestDeletion: 'Yes (via support contact or account reset in settings)',
    targetAge: '13 and older (13+ Teens & Adults)'
  },
  contentRatingSurveyAnswers: {
    violence: 'None',
    sexualContent: 'None',
    profanity: 'None',
    controlledSubstances: 'None (Medical triage apps present reference pharmaceutical info for educational purposes only)',
    gambling: 'None',
    userInteraction: 'Users can interact with AI reasoning tools; safe content filtering enabled via Gemini SafetySettings'
  },
  googlePlayTestingRequirement: {
    newDeveloperRequirement: 'Personal Google Play accounts created after Nov 2023 require 14 days of closed testing with 20 opt-in testers.',
    instantBypassAlternatives: [
      'Amazon Appstore: 0 testers needed, approved in 24 hours ($0 cost).',
      'Samsung Galaxy Store: 0 testers needed, fast-track developer registration ($0 cost).',
      'Google Play Organization Account: DUNS registered organization accounts do not have the 20-tester requirement.'
    ]
  }
};
