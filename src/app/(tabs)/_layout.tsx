import { Tabs } from 'expo-router';
import { CalendarDays, House, LayoutGrid, Leaf, UserRound, type LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/theme/ThemeProvider';

const icon = (Icon: LucideIcon) =>
  function TabIcon({ color, focused }: { color: string; focused: boolean }) {
    return <Icon size={24} color={color} strokeWidth={focused ? 2 : 1.6} />;
  };

export default function TabsLayout() {
  const { c } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.background, borderTopColor: c.border },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: icon(House) }} />
      <Tabs.Screen name="agenda" options={{ title: 'Agenda', tabBarIcon: icon(CalendarDays) }} />
      <Tabs.Screen name="bien-etre" options={{ title: 'Bien-être', tabBarIcon: icon(Leaf) }} />
      <Tabs.Screen name="espaces" options={{ title: 'Espaces', tabBarIcon: icon(LayoutGrid) }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil', tabBarIcon: icon(UserRound) }} />
    </Tabs>
  );
}
