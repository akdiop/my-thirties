import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond/500Medium';
import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond/600SemiBold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { DatabaseProvider } from '@/db/DatabaseProvider';
import { useRefresh } from '@/data/useRefresh';
import { LockGate } from '@/features/lock/LockGate';
import { NotificationSync } from '@/notifications/NotificationSync';
import { WidgetSync } from '@/widgets/WidgetSync';
import { Welcome } from '@/features/profile/Welcome';
import { useAppData } from '@/state/appData';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Themed>
          <LockGate>
            <DatabaseProvider fallback={<Loading />} onError={(e) => <DatabaseError error={e} />}>
              <ProfileGate>
                <NotificationSync />
                <WidgetSync />
                <Stack screenOptions={{ headerShown: false }} />
              </ProfileGate>
            </DatabaseProvider>
          </LockGate>
        </Themed>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function Themed({ children }: { children: ReactNode }) {
  const { scheme, c } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </View>
  );
}

function ProfileGate({ children }: { children: ReactNode }) {
  const refresh = useRefresh();
  const profile = useAppData((s) => s.profile);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);
  if (!ready) return <Loading />;
  return profile ? <>{children}</> : <Welcome />;
}

function Loading() {
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background }}>
      <ActivityIndicator color={c.primary} />
    </View>
  );
}

function DatabaseError({ error }: { error: Error }) {
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, padding: 32, justifyContent: 'center', gap: 12, backgroundColor: c.background }}>
      <AppText variant="screenTitle">Données inaccessibles</AppText>
      <AppText>La base chiffrée n’a pas pu être ouverte. Vos données ne sont pas effacées.</AppText>
      <AppText variant="caption" color={c.textMuted}>{error.message}</AppText>
    </View>
  );
}
