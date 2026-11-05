import { Tabs } from 'expo-router';
import { c, Icon } from '../../src/ui';

export default function TabsLayout() {
  return <Tabs screenOptions={{
    headerShown: false, tabBarActiveTintColor: c.green, tabBarInactiveTintColor: c.muted,
    tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line },
    tabBarLabelStyle: { fontSize: 10, fontWeight: '700' }, tabBarAllowFontScaling: false,
  }}>
    <Tabs.Screen name="index" options={{ title: 'Workout', tabBarAccessibilityLabel: 'Workout', tabBarIcon: ({ color }) => <Icon name="flash-outline" color={String(color)} /> }} />
    <Tabs.Screen name="history" options={{ title: 'History', tabBarAccessibilityLabel: 'History', tabBarIcon: ({ color }) => <Icon name="calendar-outline" color={String(color)} /> }} />
    <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarAccessibilityLabel: 'Progress', tabBarIcon: ({ color }) => <Icon name="stats-chart-outline" color={String(color)} /> }} />
    <Tabs.Screen name="exercises" options={{ title: 'Exercises', tabBarAccessibilityLabel: 'Exercises', tabBarIcon: ({ color }) => <Icon name="barbell-outline" color={String(color)} /> }} />
    <Tabs.Screen name="templates" options={{ title: 'Templates', tabBarAccessibilityLabel: 'Templates', tabBarIcon: ({ color }) => <Icon name="layers-outline" color={String(color)} /> }} />
    <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarAccessibilityLabel: 'Settings', tabBarIcon: ({ color }) => <Icon name="settings-outline" color={String(color)} /> }} />
  </Tabs>;
}
