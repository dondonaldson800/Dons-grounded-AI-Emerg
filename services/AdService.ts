import { getAdMobConfig, getActiveAdMobUnits, PRODUCTION_ADMOB_VALUES, TEST_ADMOB_VALUES } from './admobConfig';

const Platform = { OS: 'web' };

export class AdService {
  static getValues() {
    return getActiveAdMobUnits();
  }

  static getProductionValues() {
    return PRODUCTION_ADMOB_VALUES;
  }

  static getTestValues() {
    return TEST_ADMOB_VALUES;
  }

  static getConfig() {
    return getAdMobConfig();
  }

  static async initialize() {
    if (Platform.OS === 'web') {
      const config = getAdMobConfig();
      console.log(`[AdMob] Initialized for web preview (App ID: ${config.appId}, Test Mode: ${config.isTestMode})`);
      return;
    }
    try {
      // In native environments:
      // await mobileAds().initialize();
      console.log('[AdMob] Native SDK Initialized with App ID:', getActiveAdMobUnits().appId);
    } catch (e) {
      console.error('[AdMob] Init Error', e);
    }
  }

  static async showBanner() {
    console.log('[AdMob] Serving banner unit:', getActiveAdMobUnits().bannerUnitId);
  }

  static async showInterstitial() {
    const units = getActiveAdMobUnits();
    console.log('[AdMob] Triggering interstitial unit:', units.interstitialUnitId);
  }

  static async showRewarded() {
    const units = getActiveAdMobUnits();
    console.log('[AdMob] Triggering rewarded video unit:', units.rewardedUnitId);
  }
}
