import { useRouter } from 'expo-router';
import { useApp } from '../../src/session';
import { Button, Empty, Item, Page } from '../../src/ui';

export default function Templates() {
  const { model } = useApp();
  const router = useRouter();
  const templates = [...model!.templates].sort((a, b) => a.name.localeCompare(b.name));
  return <Page kicker="SAVED ROUTINES" title="Templates" subtitle="Reuse an exercise list and enter fresh sets each time.">
    <Button label="Create template" icon="add" onPress={() => router.push('/template')} />
    {!templates.length && <Empty title="No templates yet" detail="Create a list here or save one from a finished workout." icon="layers-outline" />}
    {templates.map(t => <Item key={t.id} title={t.name} detail={t.exercises.length + (t.exercises.length === 1 ? ' exercise' : ' exercises')} icon="layers-outline"
      onPress={() => router.push({ pathname: '/template', params: { id: t.id } })} />)}
  </Page>;
}
