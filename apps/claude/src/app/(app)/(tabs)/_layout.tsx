import { Tabs } from 'expo-router';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Text } from 'react-native';
import { colors } from '../../../ui/theme';

const icon = (name: SFSymbol, fallback: string) =>
  function TabIcon({ color }: { color: unknown }) {
    const c = String(color ?? colors.muted);
    return <SymbolView name={name} tintColor={c} size={24} fallback={<Text style={{ color: c }}>{fallback}</Text>} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.canvas },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.accent,
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        sceneStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Train', tabBarIcon: icon('figure.strengthtraining.traditional', '🏋'), tabBarAccessibilityLabel: 'Train' }} />
      <Tabs.Screen name="routines" options={{ title: 'Routines', tabBarIcon: icon('list.bullet.rectangle', '☰') }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: icon('calendar', '📅') }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: icon('chart.xyaxis.line', '📈') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person.crop.circle', '👤') }} />
    </Tabs>
  );
}
