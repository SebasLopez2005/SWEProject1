import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, BarChart3, Download, LibraryBig, Scale, Settings2, Target } from 'lucide-react-native';
import { useApp } from '../../src/state';
import { Badge, Header, Item, Kicker, Page, T, c, s } from '../../src/ui';

const sections = [
  { key: 'muscles', title: 'Muscle activity', detail: 'Front and back map with set-equivalents', Icon: Activity },
  { key: 'report', title: 'Monthly report', detail: 'Sessions, volume and lift highlights', Icon: BarChart3 },
  { key: 'goals', title: 'Lift goals', detail: 'Track a target load and rep count', Icon: Target },
  { key: 'bodyweight', title: 'Bodyweight', detail: 'Optional readings and weight target', Icon: Scale },
  { key: 'export', title: 'Export my data', detail: 'Choose dates and download CSV files', Icon: Download },
  { key: 'settings', title: 'Settings', detail: 'Units, text size, alerts and account sync', Icon: Settings2 },
] as const;

export default function Profile() {
  const app = useApp();
  const router = useRouter();
  return <Page>
    <Header eyebrow="YOUR TRAINING ACCOUNT" title="Profile" subtitle="Review your work and manage your preferences." />
    <View style={[s.panel, { backgroundColor: c.olive }]}>
      <Kicker color={c.green}>{app.account?.demo ? 'DEVELOPMENT WORKSPACE' : 'SIGNED IN'}</Kicker>
      <T kind="sub">{app.account?.email}</T>
      <View style={s.wrap}><Badge label={app.account?.demo ? 'On-device demo' : !app.online ? 'Offline' : 'Account connected'} color={c.green} />
        {app.queued.length ? <Badge label={app.queued.length + ' pending'} /> : null}</View>
    </View>
    <View style={s.panel}>
      {sections.map(({ key, title, detail, Icon }, index) => <View key={key}>
        <Item title={title} subtitle={detail} lead={<Icon color={c.accent} size={22} />}
          onPress={() => router.push({ pathname: '/account/[section]', params: { section: key } })} />
        {index < sections.length - 1 ? <View style={s.rule} /> : null}
      </View>)}
    </View>
    <View style={s.panel}><Item title="Exercise library" subtitle="Browse and manage movements" lead={<LibraryBig color={c.accent} size={22} />}
      onPress={() => router.push('/library')} /></View>
  </Page>;
}
