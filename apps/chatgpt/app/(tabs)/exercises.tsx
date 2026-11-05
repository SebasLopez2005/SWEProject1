import { useRouter } from 'expo-router';
import { useState } from 'react';
import { muscles, searchExercises, typeLabels } from '../../src/domain';
import { ExerciseForm } from '../../src/editors';
import { useApp } from '../../src/session';
import { Button, Chip, Empty, Field, Item, Page, Row } from '../../src/ui';

export default function Exercises() {
  const { model } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('');
  const [archived, setArchived] = useState(false);
  const [creating, setCreating] = useState(false);
  const exercises = searchExercises(model!, search, muscle, archived);
  return <Page kicker="EXERCISE LIBRARY" title="Exercises" subtitle="Find a lift, check its history, or add your own.">
    <Field label="Search exercise names" defaultValue={search} onChangeText={setSearch}
      autoCorrect={false} spellCheck={false} autoCapitalize="none" returnKeyType="search" placeholder="Try row or squat" />
    <Row>{['All', ...muscles].map(m => <Chip key={m} label={m} selected={(muscle || 'All') === m}
      onPress={() => setMuscle(m === 'All' ? '' : m)} />)}</Row>
    <Row>
      <Chip label="Available" selected={!archived} onPress={() => setArchived(false)} />
      <Chip label="Archived" selected={archived} onPress={() => setArchived(true)} />
    </Row>
    <Button label="Create custom exercise" icon="add" onPress={() => setCreating(true)} />
    {!exercises.length && <Empty title="No matching exercises" detail={archived ? 'Archived custom exercises appear here.' : 'Try a different search or create a custom exercise.'} />}
    {exercises.map(e => <Item key={e.id} title={e.name} detail={e.muscle + ' · ' + typeLabels[e.type] + (e.shared ? '' : ' · Custom')}
      icon="barbell-outline" onPress={() => router.push({ pathname: '/exercise', params: { id: e.id } })} />)}
    {creating && <ExerciseForm onClose={() => setCreating(false)} onDone={exercise => {
      setCreating(false); router.push({ pathname: '/exercise', params: { id: exercise.id } });
    }} />}
  </Page>;
}
