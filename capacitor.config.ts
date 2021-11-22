import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'FallsWholesaleApp',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      AndroidPersistentFileLocation: 'Compatibility',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      SplashScreenDelay: '0',
      FadeSplashScreen: 'false',
      AutoHideSplashScreen: 'false'
    }
  }
};

export default config;
