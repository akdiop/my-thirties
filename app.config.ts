import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'My thirties',
  slug: 'my-thirties',
  version: '0.1.0',
  scheme: 'mythirties',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  backgroundColor: '#FAF7F2',
  ios: {
    bundleIdentifier: 'com.akdiop.mythirties',
    supportsTablet: false,
    config: { usesNonExemptEncryption: false },
    infoPlist: {
      NSFaceIDUsageDescription: 'My thirties utilise Face ID pour déverrouiller vos données personnelles.',
      NSCalendarsFullAccessUsageDescription: 'My thirties affiche vos calendriers (Google, iCloud) dans son agenda, en lecture seule.',
    },
  },
  android: {
    package: 'com.akdiop.mythirties',
    allowBackup: false,
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    ['expo-sqlite', { useSQLCipher: true }],
    ['expo-local-authentication', { faceIDPermission: 'My thirties utilise Face ID pour déverrouiller vos données personnelles.' }],
    'expo-notifications',
    ['expo-sensors', { motionPermission: 'My thirties lit le nombre de pas compté par votre iPhone pour l’afficher dans Ma santé.' }],
    ['expo-location', { locationWhenInUsePermission: 'My thirties utilise votre position, une seule fois et arrondie, pour calculer les horaires des prières.' }],
    ['expo-calendar', { calendarPermission: 'My thirties affiche vos calendriers (Google, iCloud) dans son agenda, en lecture seule.' }],
    'expo-font',
    ['expo-splash-screen', { image: './assets/splash-icon.png', imageWidth: 160, backgroundColor: '#FAF7F2' }],
  ],
  experiments: { typedRoutes: true },
};

export default config;
