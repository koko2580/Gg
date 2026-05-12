import { AdMob, BannerAdSize, BannerAdPosition, RewardAdPluginEvents, RewardInterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const ADMOB_IDS = {
  banner: 'ca-app-pub-5984576938417142/2994020841',
  rewarded: 'ca-app-pub-5984576938417142/5620184189',
  rewardedInterstitial: 'ca-app-pub-5984576938417142/8142567448',
};

// State trackers for smart loading and lazy loading
let isAdmobInitialized = false;
let isRewardedPrepared = false;
let isRewardedInterstitialPrepared = false;

export const initAdMob = async () => {
  if (Capacitor.getPlatform() === 'web') return; // AdMob plugin doesn't work well on web directly
  if (isAdmobInitialized) return;

  try {
    await AdMob.initialize({
      initializeForTesting: false,
    });
    isAdmobInitialized = true;
    
    // Smart loading: Prepare rewarded videos in advance
    prepareRewardedVideo();
    prepareRewardedInterstitial();
  } catch (err) {
    console.error('Failed to initialize AdMob', err);
  }
};

export const showBanner = async () => {
  if (!isAdmobInitialized) return;
  try {
    await AdMob.showBanner({
      adId: ADMOB_IDS.banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 100, // Account for BottomNav height
      isTesting: false
    });
  } catch (err) {
    console.error('Banner ad failed to load', err);
  }
};

export const hideBanner = async () => {
  if (!isAdmobInitialized) return;
  await AdMob.hideBanner().catch(console.error);
};

export const removeBanner = async () => {
  if (!isAdmobInitialized) return;
  await AdMob.removeBanner().catch(console.error);
};

export const prepareRewardedVideo = async () => {
  if (!isAdmobInitialized) return;
  if (isRewardedPrepared) return;
  try {
    await AdMob.prepareRewardVideoAd({
      adId: ADMOB_IDS.rewarded,
      isTesting: false
    });
    isRewardedPrepared = true;
  } catch (err) {
    console.error('Failed to prepare rewarded video', err);
    isRewardedPrepared = false;
  }
};

export const showRewardedVideo = async (onReward: () => void, onFallback?: () => void) => {
  if (!isAdmobInitialized || !isRewardedPrepared) {
    onFallback?.();
    return;
  }
  
  return new Promise<void>(async (resolve, reject) => {
    let rewardGranted = false;
    
    const rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
      rewardGranted = true;
    });
    
    const dismissListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      rewardListener.remove();
      dismissListener.remove();
      if (rewardGranted) {
        onReward();
      }
      isRewardedPrepared = false;
      prepareRewardedVideo(); // Smart reload
      resolve();
    });

    try {
      await AdMob.showRewardVideoAd();
    } catch (err) {
      console.error('Show rewarded failed', err);
      rewardListener.remove();
      dismissListener.remove();
      onFallback?.();
      reject(err);
    }
  });
};

export const prepareRewardedInterstitial = async () => {
  if (!isAdmobInitialized) return;
  if (isRewardedInterstitialPrepared) return;
  try {
    await AdMob.prepareRewardInterstitialAd({
      adId: ADMOB_IDS.rewardedInterstitial,
      isTesting: false
    });
    isRewardedInterstitialPrepared = true;
  } catch (err) {
    console.error('Failed to prepare rewarded interstitial', err);
    isRewardedInterstitialPrepared = false;
  }
};

export const showRewardedInterstitial = async (onReward: () => void, onFallback?: () => void) => {
  if (!isAdmobInitialized || !isRewardedInterstitialPrepared) {
    onFallback?.();
    return;
  }
  
  return new Promise<void>(async (resolve, reject) => {
    let rewardGranted = false;
    
    const rewardListener = await AdMob.addListener(RewardInterstitialAdPluginEvents.Rewarded, () => {
      rewardGranted = true;
    });
    
    const dismissListener = await AdMob.addListener(RewardInterstitialAdPluginEvents.Dismissed, () => {
      rewardListener.remove();
      dismissListener.remove();
      if (rewardGranted) {
        onReward();
      }
      isRewardedInterstitialPrepared = false;
      prepareRewardedInterstitial(); // Smart reload
      resolve();
    });

    try {
      await AdMob.showRewardInterstitialAd();
    } catch (err) {
      console.error('Show rewarded interstitial failed', err);
      rewardListener.remove();
      dismissListener.remove();
      onFallback?.();
      reject(err);
    }
  });
};
