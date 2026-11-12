import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Dumbbell, Plus, Search } from 'lucide-react-native';
import { Exercise, Kind, catalog, kindName, muscles, normalized, searchExercises, validateName } from './model';
import { useApp } from './state';
import { newId } from './repository';
import { Badge, Button, Chip, ErrorNote, Field, Item, Kicker, Sheet, T, c, s, useAction } from './ui';

export function recentIds(workouts: ReturnType<typeof useApp>['workouts']) {
  return [...new Set([...workouts].sort((a, b) => b.started - a.started)
    .flatMap(w => [...w.entries].reverse().filter(e => e.sets.some(set => set.state === 'done')).map(e => e.exerciseId)))].slice(0, 10);
}
const categories = [...new Set(catalog.map(e => e.category))].sort();
const equipment = [...new Set(catalog.map(e => e.equipment))].sort();

export function ExerciseList({ onSelect, picking = false, preset = '', filter }: {
  onSelect: (exercise: Exercise) => void; picking?: boolean; preset?: string; filter?: (exercise: Exercise) => boolean;
}) {
  const app = useApp();
  const [query, setQuery] = useState(preset);
  const [archived, setArchived] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState('');
  const [gear, setGear] = useState('');
  const [muscle, setMuscle] = useState('');
  const [limit, setLimit] = useState(25);
  const [creating, setCreating] = useState(false);
  const recent = useMemo(() => recentIds(app.workouts), [app.workouts]);
  const matches = useMemo(() => {
    const source = filter ? app.exercises.filter(filter) : app.exercises;
    return searchExercises(source, query, recent, archived, gear, category, muscle);
  }, [app.exercises, query, recent, archived, gear, category, muscle, filter]);
  const showsRecent = !query.trim() && !archived && !category && !gear && !muscle;
  return <View style={s.column}>
    {creating ? <ExerciseEditor initialName={query} onClose={() => setCreating(false)}
      onSaved={exercise => { setCreating(false); if (!filter || filter(exercise)) onSelect(exercise); }} /> : <>
      <Field label="Search exercises" placeholder="Name, equipment or muscle" value={query} autoCorrect={false}
        onChangeText={text => { setQuery(text); setLimit(25); }} />
      <View style={s.wrap}>
        <Chip label="Filters" selected={showFilters} onPress={() => setShowFilters(x => !x)} />
        {!picking ? <Chip label={archived ? 'Archived' : 'Available'} selected={archived} onPress={() => { setArchived(!archived); setLimit(25); }} /> : null}
        {!archived ? <Button label="Custom exercise" icon={<Plus size={16} color={c.accent} />} compact onPress={() => setCreating(true)} /> : null}
      </View>
      {showFilters ? <View style={s.panel}>
        {([{ title: 'Category', options: categories, current: category, select: setCategory },
          { title: 'Equipment', options: equipment, current: gear, select: setGear },
          { title: 'Muscle', options: muscles, current: muscle, select: setMuscle }]).map(group => <View key={group.title} style={s.column}>
          <Kicker>{group.title}</Kicker>
          <View style={s.wrap}>
            <Chip label="Any" selected={!group.current} onPress={() => { group.select(''); setLimit(25); }} />
            {group.options.map(name => <Chip key={name} label={name} selected={group.current === name}
              onPress={() => { group.select(name); setLimit(25); }} />)}
          </View>
        </View>)}
      </View> : null}
      <Kicker>{matches.length ? `${matches.length} exercises` : 'No matches'}</Kicker>
      {!matches.length ? <View style={s.panel}><Search color={c.muted} size={22} /><T color={c.muted}>Try a different search or clear your filters.</T></View> : null}
      {matches.length ? <View style={s.panel}>
        {matches.slice(0, limit).map((exercise, i) => {
          const recentStart = showsRecent && (i === 0 || !recent.includes(exercise.id) && recent.includes(matches[i - 1]?.id));
          return <View key={exercise.id}>
            {recentStart ? <Kicker color={c.muted}>{recent.includes(exercise.id) ? 'Recent' : 'Library'}</Kicker> : null}
            <Item title={exercise.name} subtitle={`${kindName[exercise.kind]} · ${exercise.equipment}`} onPress={() => onSelect(exercise)}
              lead={<Dumbbell color={c.accent} size={18} />} end={exercise.archived ? <Badge label="Archived" /> : undefined} />
            {i < Math.min(limit, matches.length) - 1 ? <View style={s.rule} /> : null}
          </View>;
        })}
      </View> : null}
      {limit < matches.length ? <Button label="Show more exercises" onPress={() => setLimit(n => n + 25)} /> : null}
    </>}
  </View>;
}

export function ExercisePicker({ onSelect, onClose, title, preset, filter }: {
  onSelect: (exercise: Exercise) => void; onClose: () => void; title?: string; preset?: string; filter?: (exercise: Exercise) => boolean;
}) {
  return <Sheet title={title ?? 'Choose exercise'} onClose={onClose}>
    <ExerciseList onSelect={onSelect} picking preset={preset} filter={filter} />
  </Sheet>;
}

export function ExerciseEditor({ exercise, initialName, onSaved, onClose }: {
  exercise?: Exercise; initialName?: string; onSaved: (exercise: Exercise) => void; onClose: () => void;
}) {
  const app = useApp();
  const [name, setName] = useState(exercise?.name ?? initialName ?? '');
  const [kind, setKind] = useState<Kind>(exercise?.kind ?? 'load');
  const [gear, setGear] = useState(exercise?.equipment ?? '');
  const [instruction, setInstruction] = useState(exercise?.instructions.join('\n') ?? '');
  const [primary, setPrimary] = useState(exercise?.primary ?? []);
  const [secondary, setSecondary] = useState(exercise?.secondary ?? []);
  const action = useAction();
  const used = exercise && (exercise.used || app.workouts.some(w => w.entries.some(e => e.exerciseId === exercise.id && e.sets.some(r => r.state === 'done'))));
  function save() {
    validateName(name, app.exercises.some(e => e.id !== exercise?.id && normalized(e.name) === normalized(name)), 'exercise');
    const id = exercise?.id ?? newId();
    const value: Exercise = { id, name: name.trim(), kind, equipment: gear.trim() || 'unknown', category: 'custom',
      instructions: instruction.trim().split('\n').map(x => x.trim()).filter(Boolean), custom: true,
      archived: exercise?.archived ?? false, used: !!used, primary, secondary: secondary.filter(x => !primary.includes(x)) };
    app.save([{ id, kind: 'exercise', value }]);
    onSaved(value);
  }
  function toggle(list: string[], tag: string, set: (next: string[]) => void) {
    set(list.includes(tag) ? list.filter(x => x !== tag) : [...list, tag]);
  }
  return <View style={s.column}>
    <Kicker>{exercise ? 'Edit custom exercise' : 'Create custom exercise'}</Kicker>
    <Field label="Exercise name" value={name} onChangeText={setName} maxLength={61} />
    <T color={c.muted}>{used ? 'Logging type is locked after an exercise is recorded.' : 'Choose what a set records.'}</T>
    <View style={s.wrap}>{(Object.keys(kindName) as Kind[]).map(key => used
      ? (key === kind ? <Badge key={key} label={kindName[key]} /> : null)
      : <Chip key={key} label={kindName[key]} selected={key === kind} onPress={() => setKind(key)} />)}</View>
    <Field label="Equipment (optional)" value={gear} onChangeText={setGear} maxLength={60} />
    <Field label="Instructions (optional)" value={instruction} onChangeText={setInstruction} multiline maxLength={1500} />
    <T kind="label">Primary muscles</T>
    <View style={s.wrap}>{muscles.map(tag => <Chip key={tag} label={tag} selected={primary.includes(tag)} onPress={() => toggle(primary, tag, setPrimary)} />)}</View>
    <T kind="label">Secondary muscles</T>
    <View style={s.wrap}>{muscles.filter(tag => !primary.includes(tag)).map(tag =>
      <Chip key={tag} label={tag} selected={secondary.includes(tag)} onPress={() => toggle(secondary, tag, setSecondary)} />)}</View>
    <ErrorNote message={action.error} />
    <Button label="Save exercise" tone="primary" onPress={() => action.run(save)} />
    <Button label="Cancel" tone="quiet" onPress={onClose} />
  </View>;
}
