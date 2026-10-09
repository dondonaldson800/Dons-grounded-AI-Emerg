# 👑 MASTER DEVELOPER DEPLOYMENT, REGISTRATION & DOWNLOAD GUIDE
**App:** Don's Grounded AI Empire (20-in-1 Suite)  
**Package:** `com.donsempire.groundedai` | **Version:** `1.0.0` (Code: `100`)  
**Owner:** Don Donaldson (`dondonaldson800@gmail.com`)  
**Publisher ID:** `pub-8715031019966551`

---

## 🚀 1. DEPLOYMENT STATUS (LIVE RIGHT NOW)

### ✅ Web & Mobile PWA (Live Cloud Run Deployment)
* **Production Live App URL:** [https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app](https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app)
* **Development Preview URL:** [https://ais-dev-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app](https://ais-dev-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app)
* **Status:** 100% Deployed, fully compiled, with Service Worker, Web App Manifest, and offline caching enabled.
* **Instant Mobile Install:** Open the URL on any Android phone, Samsung Galaxy, Fire Tablet, or Chromebook in Google Chrome or Samsung Internet, tap the browser menu (**⋮**), and select **"Add to Home Screen" / "Install App"**.

---

## 📲 2. HOW TO DOWNLOAD YOUR ANDROID BUILDS (.APK & .AAB)

### Option A: Direct In-App Export (Zero Coding)
1. Open the app and click **Store Readiness Hub** (or **Management Hub**).
2. At the top right:
   * Click **"Export Build Scripts (.sh)"** → instantly downloads `build-empire-mobile.sh`.
   * Click **"Export JSON Listing Kit"** → instantly downloads `AMAZON_SAMSUNG_STORE_LISTING_MASTER.json` with all descriptions, keywords, and specs.

### Option B: Cloud Build to Download Standalone APK / AAB
Run either command in your terminal or via EAS:

1. **Universal APK (Amazon Appstore & Fire Tablets):**
   ```bash
   npm run mobile:amazon:build
   # or
   bash build-apk.sh
   ```
   * *Output:* Standalone `.apk` file that installs directly onto Fire Tablets, Android phones, or uploads to Amazon.

2. **Direct Test/Sideload APK (Instant phone test link):**
   ```bash
   npm run mobile:build:apk
   ```
   * *Output:* Generates an instant Expo download URL and QR code to download the `.apk` directly to your phone.

3. **Android App Bundle AAB (Samsung Galaxy Store & Google Play):**
   ```bash
   npm run mobile:samsung:build
   # or
   bash build-aab.sh
   ```
   * *Output:* Production `.aab` file optimized for Samsung Galaxy Store Seller Portal and Google Play Console.

---

## 📝 3. STORE REGISTRATION & LISTING CHECKLIST

### 1. Amazon Appstore
* **Portal:** [https://developer.amazon.com/apps-and-games](https://developer.amazon.com/apps-and-games) (Free)
* **App Submission Tab:**
  * **Title:** `Don's Grounded AI Empire - 20-in-1 Suite`
  * **Category:** `Productivity`
  * **Binary File:** Upload your generated `universal-release.apk`
  * **Target Devices:** Check all Fire Tablets (Fire 7, Fire HD 8, Fire HD 10, Fire Max 11) + Non-Amazon Android
  * **Content Rating:** `12+`

### 2. Samsung Galaxy Store
* **Portal:** [https://seller.samsungapps.com](https://seller.samsungapps.com) (Free)
* **App Submission Tab:**
  * **Title:** `Don's Grounded AI Empire`
  * **Category:** `Productivity / Utilities`
  * **Binary File:** Upload your generated `.aab` (Android App Bundle)
  * **Features:** Check `Multi-Window Ready` and `Samsung DeX Supported`
  * **Content Rating:** `12+`

### 3. Google Play Console
* **Portal:** [https://play.google.com/console](https://play.google.com/console) ($25 one-time)
* **Binary File:** Upload `.aab`
* **Package Name:** `com.donsempire.groundedai`

---

## 💰 4. PAYMENTS & ADMOB REGISTRATION SUMMARY

1. **Google AdMob:**
   * **App ID:** `ca-app-pub-8715031019966551~8423706184`
   * **Banner Unit:** `ca-app-pub-8715031019966551/7800201293`
   * **Interstitial Unit:** `ca-app-pub-8715031019966551/4392127683`
   * **Rewarded Unit:** `ca-app-pub-8715031019966551/5231846921`
   * **app-ads.txt:** Hosted at `https://ais-pre-bhi6jiljireellnj5x52rr-120616653945.us-east1.run.app/app-ads.txt`
   * *Action:* In [admob.google.com](https://admob.google.com), verify your identity and link your published store URL once live.

2. **Cash App:**
   * Configured for `$DonDonaldson800`
   * Direct deep-link: `https://cash.app/$DonDonaldson800`

3. **Stripe & Direct Payouts:**
   * Configured in `services/paymentService.ts`
   * Routing & Bank account records configured for your direct deposit payouts.

---

## 🏷️ 5. IN-APP PURCHASE & SUBSCRIPTION SKUS (WHY "SKU NOT RIGHT" & FIXES)

### ⚠️ Why Stores Reject SKUs ("SKU not right" / "Invalid Product ID"):
1. **No Uppercase Letters:** Google Play strictly rejects uppercase (`Dons_Pro` ❌ -> `dons_pro` ✅).
2. **No Spaces:** Stores forbid spaces (`dons pro monthly` ❌ -> `dons_pro_monthly` ✅).
3. **No Hyphens in In-App Product IDs:** In Google Play, use underscores or dots (`dons-tokens` ❌ -> `dons_tokens` ✅). *Hyphens are only allowed in Base Plan IDs.*
4. **Must start with letter/number:** Never start with a dot or underscore (`.dons_pro` ❌).
5. **EAS Submit iOS SKU:** In `eas.json`, `submit.production.ios.sku` was previously empty; it is now set to `"com.donsempire.groundedai"`.

### 👑 Master Suite SKUs (Copy & Paste directly into Store Consoles):

| Product | Type | Price | Google Play SKU | Google Play Base Plan | Apple Product ID | Amazon SKU | Samsung Item ID |
|---|---|---|---|---|---|---|---|
| **Power User Pro** | Subscription | $9.99/mo | `dons_empire_pro_monthly` | `pro-monthly-base` | `com.donsempire.groundedai.pro.monthly` | `dons_empire_pro_monthly` | `dons_pro_month` |
| **Creator Elite** | Subscription | $24.99/mo | `dons_empire_elite_monthly` | `elite-monthly-base` | `com.donsempire.groundedai.elite.monthly` | `dons_empire_elite_monthly` | `dons_elite_month` |
| **Annual Pro Pass** | Subscription | $95.99/yr | `dons_empire_pro_annual` | `pro-annual-save20` | `com.donsempire.groundedai.pro.annual` | `dons_empire_pro_annual` | `dons_pro_annual` |
| **500 Tokens** | Consumable | $4.99 | `dons_tokens_starter_500` | N/A | `com.donsempire.groundedai.tokens.500` | `dons_tokens_starter_500` | `dons_tok_500` |
| **2,000 Tokens** | Consumable | $14.99 | `dons_tokens_creator_2000` | N/A | `com.donsempire.groundedai.tokens.2000` | `dons_tokens_creator_2000` | `dons_tok_2000` |
| **10,000 Tokens** | Consumable | $49.99 | `dons_tokens_vault_10000` | N/A | `com.donsempire.groundedai.tokens.10000` | `dons_tokens_vault_10000` | `dons_tok_10000` |

---

### 📱 Standalone First 6 Apps SKUs (General, Medical, Non-Profit, Law):

#### 1. App 1 (General): OmniAssist (`com.omniassist.general.app`)
* **Monthly Subscription SKU:** `omniassist_general_monthly` (Base Plan: `omni-monthly-base`) — $9.99/mo
* **Annual Pass SKU:** `omniassist_general_annual` (Base Plan: `omni-annual-base`) — $79.99/yr
* **EAS Build:** `npx eas build --platform android --profile app1-general`

#### 2. App 2 (Medical 1): VitalTriage (`com.vitaltriage.health.app`)
* **Monthly Subscription SKU:** `vitaltriage_clinical_monthly` (Base Plan: `vital-monthly-base`) — $14.99/mo
* **Annual Pass SKU:** `vitaltriage_clinical_annual` (Base Plan: `vital-annual-base`) — $99.99/yr
* **EAS Build:** `npx eas build --platform android --profile app2-medical`

#### 3. App 3 (Medical 2): MedCare Pro (`com.medcarepro.clinical.app`)
* **Monthly Subscription SKU:** `medcarepro_emergency_monthly` (Base Plan: `medcare-monthly-base`) — $19.99/mo
* **Annual Pass SKU:** `medcarepro_emergency_annual` (Base Plan: `medcare-annual-base`) — $149.99/yr
* **EAS Build:** `npx eas build --platform android --profile app3-medicalcare`

#### 4. App 4 (Non-Profit): CausePilot (`com.causepilot.nonprofit.app`)
* **Monthly Subscription SKU:** `causepilot_grant_monthly` (Base Plan: `cause-monthly-base`) — $19.99/mo
* **Annual Pass SKU:** `causepilot_grant_annual` (Base Plan: `cause-annual-base`) — $149.99/yr
* **EAS Build:** `npx eas build --platform android --profile app4-nonprofit`

#### 5. App 5 (Law 1): ClauseGuard (`com.clauseguard.legal.app`)
* **Monthly Subscription SKU:** `clauseguard_contract_monthly` (Base Plan: `clause-monthly-base`) — $19.99/mo
* **Annual Pass SKU:** `clauseguard_contract_annual` (Base Plan: `clause-annual-base`) — $149.99/yr
* **EAS Build:** `npx eas build --platform android --profile app5-law`

#### 6. App 6 (Law 2): ClaimValuator (`com.claimvaluator.settlement.app`)
* **Monthly Subscription SKU:** `claimvaluator_injury_monthly` (Base Plan: `claim-monthly-base`) — $24.99/mo
* **Annual Pass SKU:** `claimvaluator_injury_annual` (Base Plan: `claim-annual-base`) — $199.99/yr
* **EAS Build:** `npx eas build --platform android --profile app6-injury`

---

## 📋 6. "THE OTHER" STORE SUBMISSION CHECKLIST (MANDATORY FIELDS)

1. **Google Play Billing Permission:**
   * Configured in `app.json`: `com.android.vending.BILLING` (Required to activate in-app products).
2. **EAS Submit Configuration:**
   * Configured in `eas.json`: `submit.production.ios.sku = "com.donsempire.groundedai"` and `submit.production.android.track = "internal"`.
3. **Data Safety Questionnaire Answers (Google Play):**
   * *Data collected:* Only user account email for authentication and token balance sync. No biometric, location, or health records stored without consent.
   * *Data encrypted in transit:* **Yes** (TLS 1.3 / HTTPS encryption).
   * *Data deletion:* **Yes** (Users can request account reset).
   * *Target Age:* **13+** (Teens and adults).
4. **IARC Content Rating Answers:**
   * Violence: **No**
   * Sex/Nudity: **No**
   * Gambling: **No**
   * Medical/Drugs: **Educational/Informational reference only** (Clear disclaimers included in clinical triage calculators).
5. **Fast-Track Advice:**
   * Publish to **Amazon Appstore** and **Samsung Galaxy Store** first (Free, 0 tester requirement, goes live in 24–48 hours).
   * Submit to **Google Play** concurrently while conducting closed testing.
