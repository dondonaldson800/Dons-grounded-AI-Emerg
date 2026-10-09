// AdMob configuration and values for Don's Grounded AI Empire

export interface AdMobConfig {
  appId: string;
  bannerUnitId: string;
  interstitialUnitId: string;
  rewardedUnitId: string;
  isTestMode: boolean;
}

export const PRODUCTION_ADMOB_VALUES = {
  appId: 'ca-app-pub-8715031019966551~8423706184',
  bannerUnitId: 'ca-app-pub-8715031019966551/7800201293',
  interstitialUnitId: 'ca-app-pub-8715031019966551/4392127683',
  rewardedUnitId: 'ca-app-pub-8715031019966551/5231846921',
};

export const TEST_ADMOB_VALUES = {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  bannerUnitId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialUnitId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedUnitId: 'ca-app-pub-3940256099942544/5224354917',
};

const STORAGE_KEY = 'dons_empire_admob_config';

export function getAdMobConfig(): AdMobConfig {
  if (typeof window === 'undefined') {
    return { ...PRODUCTION_ADMOB_VALUES, isTestMode: false };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        appId: parsed.appId || PRODUCTION_ADMOB_VALUES.appId,
        bannerUnitId: parsed.bannerUnitId || PRODUCTION_ADMOB_VALUES.bannerUnitId,
        interstitialUnitId: parsed.interstitialUnitId || PRODUCTION_ADMOB_VALUES.interstitialUnitId,
        rewardedUnitId: parsed.rewardedUnitId || PRODUCTION_ADMOB_VALUES.rewardedUnitId,
        isTestMode: Boolean(parsed.isTestMode),
      };
    }
  } catch (err) {
    console.warn('Failed to load AdMob config from localStorage', err);
  }

  return { ...PRODUCTION_ADMOB_VALUES, isTestMode: false };
}

export function saveAdMobConfig(config: Partial<AdMobConfig>): AdMobConfig {
  const current = getAdMobConfig();
  const updated: AdMobConfig = {
    ...current,
    ...config,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save AdMob config to localStorage', err);
    }
  }

  return updated;
}

export function getActiveAdMobUnits(config: AdMobConfig = getAdMobConfig()) {
  if (config.isTestMode) {
    return TEST_ADMOB_VALUES;
  }
  return {
    appId: config.appId || PRODUCTION_ADMOB_VALUES.appId,
    bannerUnitId: config.bannerUnitId || PRODUCTION_ADMOB_VALUES.bannerUnitId,
    interstitialUnitId: config.interstitialUnitId || PRODUCTION_ADMOB_VALUES.interstitialUnitId,
    rewardedUnitId: config.rewardedUnitId || PRODUCTION_ADMOB_VALUES.rewardedUnitId,
  };
}
