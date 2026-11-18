import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/navigation/AppTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      backBehavior="history"
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Tabs.Screen name="index" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="visitas" options={{ title: 'Minhas visitas' }} />
      <Tabs.Screen name="preferencias" options={{ title: 'Preferências' }} />
    </Tabs>
  );
}
