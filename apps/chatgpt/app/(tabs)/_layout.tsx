import { Tabs } from 'expo-router';
import { View } from 'react-native';
import type { ComponentProps } from 'react';
import { c, Icon } from '../../src/ui';

function TabIcon({ name, focused }: { name: ComponentProps<typeof Icon>['name']; focused: boolean }) {
  return <View style={{ width: 39, height: 27, alignItems: 'center', justifyContent: 'center',
    borderRadius: 14, backgroundColor: focused ? c.accentSurface : 'transparent' }}>
    <Icon name={name} color={focused ? c.accent : c.muted} size={19} />
  </View>;
}

export default function TabsLayout() {
  return <Tabs screenOptions={{
    headerShown: false, tabBarActiveTintColor: c.accent, tabBarInactiveTintColor: c.muted,
    tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line },
    tabBarLabelStyle: { fontSize: 10, fontWeight: '600' }, tabBarAllowFontScaling: false,
  }}>
    <Tabs.Screen name="index" options={{ title: 'Workout', tabBarAccessibilityLabel: 'Workout', tabBarIcon: ({ focused }) => <TabIcon name="flash-outline" focused={focused} /> }} />
    <Tabs.Screen name="history" options={{ title: 'History', tabBarAccessibilityLabel: 'History', tabBarIcon: ({ focused }) => <TabIcon name="calendar-outline" focused={focused} /> }} />
    <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarAccessibilityLabel: 'Progress', tabBarIcon: ({ focused }) => <TabIcon name="stats-chart-outline" focused={focused} /> }} />
    <Tabs.Screen name="exercises" options={{ title: 'Exercises', tabBarAccessibilityLabel: 'Exercises', tabBarIcon: ({ focused }) => <TabIcon name="barbell-outline" focused={focused} /> }} />
    <Tabs.Screen name="templates" options={{ title: 'Templates', tabBarAccessibilityLabel: 'Templates', tabBarIcon: ({ focused }) => <TabIcon name="layers-outline" focused={focused} /> }} />
    <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarAccessibilityLabel: 'Settings', tabBarIcon: ({ focused }) => <TabIcon name="settings-outline" focused={focused} /> }} />
  </Tabs>;
}
