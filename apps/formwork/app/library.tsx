import { useRouter } from 'expo-router';
import { ExerciseList } from '../src/ExercisePicker';
import { Header, Page } from '../src/ui';

export default function Library() {
  const router = useRouter();
  return <Page>
    <Header eyebrow="OFFLINE CATALOG" title="Exercise library" subtitle="Look up a movement, review its instructions or create your own." back={() => router.back()} />
    <ExerciseList onSelect={e => router.push({ pathname: '/exercise/[id]', params: { id: e.id } })} />
  </Page>;
}
