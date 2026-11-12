import { Tabs } from 'expo-router';
import { Activity, BookOpen, Dumbbell, History, UserRound } from 'lucide-react-native';
import { c } from '../../src/ui';

export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.bg },
    tabBarStyle: { backgroundColor: '#191a17', borderTopColor: c.rule },
    tabBarActiveTintColor: c.accent, tabBarInactiveTintColor: c.muted, tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
  }}>
    <Tabs.Screen name="index" options={{ title: 'Workout', tabBarIcon: ({ color }) => <Dumbbell size={22} color={color} /> }} />
    <Tabs.Screen name="routines" options={{ title: 'Routines', tabBarIcon: ({ color }) => <BookOpen size={21} color={color} /> }} />
    <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: ({ color }) => <History size={22} color={color} /> }} />
    <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <Activity size={22} color={color} /> }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <UserRound size={22} color={color} /> }} />
  </Tabs>;
}
