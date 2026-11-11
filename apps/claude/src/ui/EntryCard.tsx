import { useState } from 'react';
import { ActionSheetIOS, Alert, Platform, View } from 'react-native';
import { suggestActual, type PreviousPerformance } from '../domain/analytics';
import { formatDateShort } from '../domain/dates';
import type { Exercise, Settings, Workout, WorkoutEntry } from '../domain/types';
import { formatActual } from './format';
import { Button, Card, IconButton, Row, T } from './kit';
import { SetRowEditor, type SetRowActions } from './SetRowEditor';
import { colors, space } from './theme';

export function EntryCard({
  workout, entry, exercise, previous, settings, actions, onAddSet, onEntryMenu,
}: {
  workout: Workout; entry: WorkoutEntry; exercise: Exercise | undefined; previous: PreviousPerformance | null; settings: Settings;
  actions: SetRowActions; onAddSet: (input?: Parameters<SetRowActions['complete']>[1]) => Promise<void>; onEntryMenu: (choice: 'history' | 'info' | 'rest' | 'replace' | 'remove') => void;
}) {
  const finished = workout.state === 'finished';
  const [draft, setDraft] = useState(false);
  const type = exercise?.type ?? 'weight_reps';
  const done = entry.sets.filter((s) => s.state === 'done').length;

  const menu = () => {
    const opts: { key: Parameters<typeof onEntryMenu>[0]; text: string; destructive?: boolean }[] = [
      { key: 'history', text: 'Exercise history' },
      { key: 'info', text: 'Instructions and muscles' },
    ];
    if (!finished && entry.phase === 'work') opts.push({ key: 'rest', text: 'Rest timer for this exercise' });
    if (!finished && done === 0) opts.push({ key: 'replace', text: 'Substitute exercise' });
    opts.push({ key: 'remove', text: 'Remove exercise', destructive: true });
    if (Platform.OS === 'ios')
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [...opts.map((o) => o.text), 'Cancel'], cancelButtonIndex: opts.length, destructiveButtonIndex: opts.length - 1, title: exercise?.name, userInterfaceStyle: 'dark' },
        (i) => opts[i] && onEntryMenu(opts[i].key),
      );
    else Alert.alert(exercise?.name ?? 'Exercise', undefined, [...opts.map((o) => ({ text: o.text, onPress: () => onEntryMenu(o.key) })), { text: 'Cancel', style: 'cancel' }]);
  };

  const restLabel = entry.phase !== 'work' ? null : entry.restMode === 'off' ? 'Rest off' : entry.restMode === 'duration' ? `Rest ${entry.restSeconds}s` : null;

  return (
    <Card>
      <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <View style={{ flex: 1 }}>
          <T variant="h3">{exercise?.name ?? 'Unknown exercise'}</T>
          {exercise?.archived ? <T variant="caption" color={colors.warning}>Archived exercise</T> : null}
          {restLabel ? <T variant="caption" color={colors.faint}>{restLabel}</T> : null}
        </View>
        <IconButton icon="ellipsis.circle" label={`Options for ${exercise?.name ?? 'exercise'}`} onPress={menu} color={colors.accent} fallback="⋯" />
      </Row>
      {entry.phase === 'work' ? (
        previous ? (
          <View accessible accessibilityLabel={`Last time on ${formatDateShort(previous.date)}: ${previous.sets.map((s) => formatActual(s, type, settings.showEquivalent)).join(', ')}`}>
            <T variant="small" color={colors.muted}>Last time · {formatDateShort(previous.date)}</T>
            <T variant="small" color={colors.muted}>{previous.sets.map((s) => formatActual(s, type, settings.showEquivalent)).join('  ·  ')}</T>
          </View>
        ) : (
          <T variant="small" color={colors.faint}>No previous record</T>
        )
      ) : (
        <T variant="small" color={colors.faint} numberOfLines={2}>{exercise?.instructions ? exercise.instructions.split('\n')[0] : 'Preparation step'}</T>
      )}
      {entry.sets.length === 0 ? <T variant="small" color={colors.faint}>No sets yet.</T> : null}
      {entry.sets.map((s) => (
        <SetRowEditor
          key={`${s.id}-${s.state}`}
          set={s}
          type={type}
          suggestion={s.state === 'pending' ? suggestActual(entry, s, entry.phase === 'work' ? previous : null, settings.unit) : null}
          defaultUnit={settings.unit}
          showEquivalent={settings.showEquivalent}
          actions={actions}
          finished={finished}
        />
      ))}
      {finished && draft ? (
        <SetRowEditor
          set={{ id: `draft-${entry.id}`, entryId: entry.id, position: entry.sets.length + 1, state: 'pending', targetReps: null, targetSeconds: null, targetLoad: null, targetUnit: null, targetRirMin: null, targetRirMax: null, weight: null, unit: null, reps: null, seconds: null, rir: null, completedAt: null }}
          type={type}
          suggestion={suggestActual(entry, { ...entry.sets[0], position: entry.sets.length + 1, targetReps: null, targetSeconds: null, targetLoad: null, targetUnit: null }, null, settings.unit)}
          defaultUnit={settings.unit}
          showEquivalent={settings.showEquivalent}
          finished
          actions={{
            complete: async (_id, input) => { await onAddSet(input); setDraft(false); },
            skip: async () => undefined,
            reopen: async () => undefined,
            remove: async () => setDraft(false),
          }}
        />
      ) : null}
      {!(finished && draft) ? (
        <Button title="Add set" variant="ghost" compact icon="plus" onPress={() => (finished ? setDraft(true) : onAddSet())} accessibilityLabel={`Add a set to ${exercise?.name ?? 'exercise'}`} />
      ) : null}
      {entry.phase === 'work' ? null : <T variant="caption" color={colors.faint}>Counts as preparation: no working volume.</T>}
      <View style={{ height: space.xs }} />
    </Card>
  );
}
